/**
 * GoHighLevel MCP Server (stdio transport)
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
  Tool
} from '@modelcontextprotocol/sdk/types.js';
import * as dotenv from 'dotenv';

import { GHLApiClient } from './clients/ghl-api-client';
import { GHLConfig } from './types/ghl-types';
import { ToolRegistry } from './tools/tool-registry.js';

dotenv.config();

interface AccountConfig {
  locationId: string;
  apiKey: string;
}

const LIST_ACCOUNTS_TOOL: Tool = {
  name: 'ghl_list_accounts',
  description: 'List all configured GHL sub-account aliases. Pass account: "<alias>" in any tool call to route it to that sub-account instead of the default.',
  inputSchema: { type: 'object', properties: {} }
};

function withAccountParam(tools: any[]): any[] {
  return tools.map((tool: any) => {
    if (tool.name === 'ghl_list_accounts') return tool;
    const schema = tool.inputSchema || { type: 'object', properties: {} };
    return {
      ...tool,
      inputSchema: {
        ...schema,
        properties: {
          ...(schema.properties || {}),
          account: {
            type: 'string',
            description: 'Sub-account alias (e.g. "et", "duda", "fatninja"). Omit for default (Systems Ninjas).'
          }
        }
      }
    };
  });
}


class GHLMCPServer {
  private server: Server;
  private registry: ToolRegistry;
  private accountMap: Map<string, AccountConfig>;
  private baseUrl: string;
  private ghlClient: GHLApiClient;

  constructor() {
    this.server = new Server(
      { name: 'ghl-mcp-server', version: '1.0.0' },
      { capabilities: { tools: {} } }
    );

    this.baseUrl = process.env.GHL_BASE_URL || 'https://services.leadconnectorhq.com';
    this.accountMap = this.parseAccountMap();
    this.ghlClient = this.initializeGHLClient();
    this.registry = new ToolRegistry(this.ghlClient);

    this.setupHandlers();
  }

  private parseAccountMap(): Map<string, AccountConfig> {
    const map = new Map<string, AccountConfig>();
    const raw = process.env.GHL_ACCOUNTS || '';
    if (!raw.trim()) return map;
    for (const entry of raw.split(',')) {
      const parts = entry.trim().split(':');
      if (parts.length >= 3) {
        const alias = parts[0];
        const locationId = parts[1];
        const apiKey = parts.slice(2).join(':');
        map.set(alias, { locationId, apiKey });
      }
    }
    return map;
  }

  private initializeGHLClient(): GHLApiClient {
    const config: GHLConfig = {
      accessToken: process.env.GHL_API_KEY || '',
      baseUrl: this.baseUrl,
      version: '2021-07-28',
      locationId: process.env.GHL_LOCATION_ID || ''
    };
    if (!config.accessToken) throw new Error('GHL_API_KEY environment variable is required');
    if (!config.locationId) throw new Error('GHL_LOCATION_ID environment variable is required');
    process.stderr.write(`[GHL MCP] Default location: ${config.locationId}\n`);
    if (this.accountMap.size > 0) {
      process.stderr.write(`[GHL MCP] Additional accounts: ${[...this.accountMap.keys()].join(', ')}\n`);
    }
    return new GHLApiClient(config);
  }

  private resolveRegistry(alias: string | undefined): ToolRegistry {
    if (!alias) return this.registry;
    const ac = this.accountMap.get(alias);
    if (!ac) {
      const available = [...this.accountMap.keys()].join(', ') || 'none configured';
      throw new Error(`Unknown account alias "${alias}". Available: ${available}`);
    }
    const client = new GHLApiClient({
      accessToken: ac.apiKey,
      baseUrl: this.baseUrl,
      version: '2021-07-28',
      locationId: ac.locationId
    });
    return new ToolRegistry(client);
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = withAccountParam([...this.registry.getTools(), LIST_ACCOUNTS_TOOL]);
      process.stderr.write(`[GHL MCP] Listing ${tools.length} tools\n`);
      return { tools };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: rawArgs } = request.params;
      const args = { ...(rawArgs || {}) } as Record<string, any>;

      // Handle the accounts meta-tool
      if (name === 'ghl_list_accounts') {
        const accounts: Record<string, string> = {
          default: process.env.GHL_LOCATION_ID || ''
        };
        for (const [alias, ac] of this.accountMap) {
          accounts[alias] = ac.locationId;
        }
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              accounts,
              usage: 'Pass account: "<alias>" in any tool call to route to that sub-account'
            }, null, 2)
          }]
        };
      }

      const alias = args.account as string | undefined;
      delete args.account;

      process.stderr.write(`[GHL MCP] Tool: ${name}${alias ? ` (account: ${alias})` : ''}\n`);

      try {
        const registry = this.resolveRegistry(alias);
        const result = await registry.dispatch(name, args);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      } catch (error) {
        const errorCode = error instanceof Error && error.message.includes('404')
          ? ErrorCode.InvalidRequest
          : ErrorCode.InternalError;
        throw new McpError(errorCode, `Tool execution failed: ${error}`);
      }
    });
  }

  private async testGHLConnection(): Promise<void> {
    const result = await this.ghlClient.testConnection();
    process.stderr.write(`[GHL MCP] Connected to location: ${result.data?.locationId}\n`);
  }

  async start(): Promise<void> {
    process.stderr.write('🚀 Starting GoHighLevel MCP Server...\n');
    await this.testGHLConnection();
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    const toolCount = this.registry.getTools().length + 1; // +1 for ghl_list_accounts
    process.stderr.write(`✅ GHL MCP Server ready — ${toolCount} tools available\n`);
    if (this.accountMap.size > 0) {
      process.stderr.write(`🔀 Multi-account routing enabled: ${[...this.accountMap.keys()].join(', ')}\n`);
    }
  }
}

function setupGracefulShutdown(): void {
  const shutdown = (signal: string) => {
    process.stderr.write(`\n[GHL MCP] Received ${signal}, shutting down gracefully...\n`);
    process.exit(0);
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

async function main(): Promise<void> {
  try {
    setupGracefulShutdown();
    const server = new GHLMCPServer();
    await server.start();
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});

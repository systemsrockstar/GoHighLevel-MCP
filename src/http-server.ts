/**
 * GoHighLevel MCP HTTP Server
 * HTTP/SSE transport for VPS deployment
 */

import express from 'express';
import cors from 'cors';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
  Tool,
  isInitializeRequest
} from '@modelcontextprotocol/sdk/types.js';
import { randomUUID } from 'node:crypto';
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


class GHLMCPHttpServer {
  private app: express.Application;
  private server: Server;
  private registry: ToolRegistry;
  private accountMap: Map<string, AccountConfig>;
  private baseUrl: string;
  private ghlClient: GHLApiClient;
  private port: number;
  private mcpTransports: Record<string, StreamableHTTPServerTransport> = {};

  constructor() {
    this.port = parseInt(process.env.PORT || process.env.MCP_SERVER_PORT || '8000');
    this.app = express();
    this.setupExpress();

    this.server = new Server(
      { name: 'ghl-mcp-server', version: '1.0.0' },
      { capabilities: { tools: {} } }
    );

    this.baseUrl = process.env.GHL_BASE_URL || 'https://services.leadconnectorhq.com';
    this.accountMap = this.parseAccountMap();
    this.ghlClient = this.initializeGHLClient();
    this.registry = new ToolRegistry(this.ghlClient);

    this.setupMCPHandlers(this.server);
    this.setupRoutes();
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

  private setupExpress(): void {
    this.app.use(cors({
      origin: ['https://chatgpt.com', 'https://chat.openai.com', 'http://localhost:*'],
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
      credentials: true
    }));
    this.app.use(express.json());
    this.app.use((req, res, next) => {
      console.log(`[HTTP] ${req.method} ${req.path} - ${new Date().toISOString()}`);
      next();
    });
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
    console.log(`[GHL MCP HTTP] Default location: ${config.locationId}`);
    if (this.accountMap.size > 0) {
      console.log(`[GHL MCP HTTP] Additional accounts: ${[...this.accountMap.keys()].join(', ')}`);
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

  private createMcpServer(): Server {
    const server = new Server(
      { name: 'ghl-mcp-server', version: '1.0.0' },
      { capabilities: { tools: {} } }
    );
    this.setupMCPHandlers(server);
    return server;
  }

  private setupMCPHandlers(server: Server): void {
    server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = [...this.registry.getTools(), LIST_ACCOUNTS_TOOL];
      console.log(`[GHL MCP HTTP] Listing ${tools.length} tools`);
      return { tools };
    });

    server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: rawArgs } = request.params;
      const args = { ...(rawArgs || {}) } as Record<string, any>;

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

      console.log(`[GHL MCP HTTP] Tool: ${name}${alias ? ` (account: ${alias})` : ''}`);

      try {
        const registry = this.resolveRegistry(alias);
        const result = await registry.dispatch(name, args);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      } catch (error) {
        throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${error}`);
      }
    });
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req, res) => {
      const total = this.registry.getTools().length + 1;
      res.json({
        status: 'healthy',
        server: 'ghl-mcp-server',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        tools: { total },
        accounts: ['default', ...this.accountMap.keys()]
      });
    });

    // Tools listing
    this.app.get('/tools', async (req, res) => {
      try {
        const tools = [...this.registry.getTools(), LIST_ACCOUNTS_TOOL];
        res.json({ tools, count: tools.length });
      } catch (error) {
        res.status(500).json({ error: 'Failed to list tools' });
      }
    });

    // Capabilities
    this.app.get('/capabilities', (req, res) => {
      res.json({
        capabilities: { tools: {} },
        server: { name: 'ghl-mcp-server', version: '1.0.0' }
      });
    });

    // SSE endpoint (MCP protocol)
    const handleSSE = async (req: express.Request, res: express.Response) => {
      const sessionId = req.query.sessionId || 'unknown';
      console.log(`[GHL MCP HTTP] New SSE connection, session: ${sessionId}`);
      try {
        const transport = new SSEServerTransport('/sse', res);
        await this.server.connect(transport);
        req.on('close', () => {
          console.log(`[GHL MCP HTTP] SSE closed, session: ${sessionId}`);
        });
      } catch (error) {
        console.error(`[GHL MCP HTTP] SSE error:`, error);
        if (!res.headersSent) res.status(500).json({ error: 'SSE connection failed' });
        else res.end();
      }
    };

    this.app.get('/sse', handleSSE);
    this.app.post('/sse', handleSSE);

    // Streamable HTTP endpoint (modern MCP transport, auto-retry/reconnect)
    const handleMcpPost = async (req: express.Request, res: express.Response) => {
      try {
        const sessionId = req.headers['mcp-session-id'] as string | undefined;
        let transport: StreamableHTTPServerTransport | undefined =
          sessionId ? this.mcpTransports[sessionId] : undefined;
        if (!transport) {
          if (!isInitializeRequest(req.body)) {
            res.status(400).json({ jsonrpc: '2.0', error: { code: -32000, message: 'Bad Request: No valid session ID provided' }, id: null });
            return;
          }
          const newTransport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => randomUUID(),
            onsessioninitialized: (sid: string) => { this.mcpTransports[sid] = newTransport; }
          });
          newTransport.onclose = () => {
            const sid = newTransport.sessionId;
            if (sid && this.mcpTransports[sid]) delete this.mcpTransports[sid];
          };
          await this.createMcpServer().connect(newTransport);
          console.log('[GHL MCP HTTP] New streamable HTTP session initialized');
          transport = newTransport;
        }
        await transport.handleRequest(req, res, req.body);
      } catch (error) {
        console.error('[GHL MCP HTTP] /mcp error:', error);
        if (!res.headersSent) {
          res.status(500).json({ jsonrpc: '2.0', error: { code: -32603, message: 'Internal server error' }, id: null });
        }
      }
    };
    const handleMcpSession = async (req: express.Request, res: express.Response) => {
      const sessionId = req.headers['mcp-session-id'] as string | undefined;
      const transport = sessionId ? this.mcpTransports[sessionId] : undefined;
      if (!transport) { res.status(400).send('Invalid or missing session ID'); return; }
      await transport.handleRequest(req, res);
    };

    this.app.post('/mcp', handleMcpPost);
    this.app.get('/mcp', handleMcpSession);
    this.app.delete('/mcp', handleMcpSession);

    // Root info
    this.app.get('/', (req, res) => {
      res.json({
        name: 'GoHighLevel MCP Server',
        version: '1.0.0',
        status: 'running',
        tools: this.registry.getTools().length + 1,
        accounts: ['default', ...this.accountMap.keys()],
        endpoints: { health: '/health', tools: '/tools', sse: '/sse', mcp: '/mcp' }
      });
    });
  }

  async start(): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(this.port, '0.0.0.0', () => {
        const toolCount = this.registry.getTools().length + 1;
        console.log('=========================================');
        console.log('🚀 GoHighLevel MCP HTTP Server');
        console.log(`🌐 Server running on: http://0.0.0.0:${this.port}`);
        console.log(`🔗 SSE Endpoint: http://0.0.0.0:${this.port}/sse`);
        console.log(`📋 Tools Available: ${toolCount}`);
        if (this.accountMap.size > 0) {
          console.log(`🔀 Multi-account: ${[...this.accountMap.keys()].join(', ')}`);
        }
        console.log('🎯 Ready for MCP connections!');
        console.log('=========================================');
        resolve();
      });
    });
  }
}

function setupGracefulShutdown(): void {
  const shutdown = (signal: string) => {
    console.log(`\n[GHL MCP HTTP] Received ${signal}, shutting down...`);
    process.exit(0);
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

async function main(): Promise<void> {
  try {
    setupGracefulShutdown();
    const server = new GHLMCPHttpServer();
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

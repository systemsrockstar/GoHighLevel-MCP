import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class AgentStudioTools {
  constructor(private apiClient: GHLApiClient) {}

  getTools(): Tool[] {
    return [
      {
        name: 'ghl_agent_studio_list_agents',
        description: 'List all active Agent Studio agents for a location',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            limit: { type: 'number', description: 'Max results to return', default: 20 },
            offset: { type: 'number', description: 'Offset for pagination', default: 0 }
          }
        }
      },
      {
        name: 'ghl_agent_studio_get_agent',
        description: 'Get detailed configuration for a specific Agent Studio agent including tool-nodes, variables, and lifecycle stage',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: { type: 'string', description: 'Agent ID' },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['agentId']
        }
      },
      {
        name: 'ghl_agent_studio_execute_agent',
        description: 'Execute an Agent Studio agent programmatically. Omit executionId for the first turn; include it to continue a conversation thread. Execution IDs expire after 30 minutes of inactivity.',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: { type: 'string', description: 'Agent ID to execute (must be Active in Production)' },
            locationId: { type: 'string', description: 'Location ID' },
            input: { type: 'object', description: 'Input data for the agent (agent-specific fields)' },
            executionId: { type: 'string', description: 'Execution ID for multi-turn conversation continuity (omit for new conversation)' }
          },
          required: ['agentId', 'input']
        }
      }
    ];
  }

  async executeAgentStudioTool(name: string, params: any): Promise<any> {
    switch (name) {
      case 'ghl_agent_studio_list_agents':
        return await this.listAgents(params);
      case 'ghl_agent_studio_get_agent':
        return await this.getAgent(params);
      case 'ghl_agent_studio_execute_agent':
        return await this.executeAgent(params);
      default:
        throw new Error(`Unknown agent studio tool: ${name}`);
    }
  }

  private async listAgents(params: any): Promise<any> {
    const result = await this.apiClient.agentStudioListAgents(params);
    if (!result.success) throw new Error(`Failed to list agents: ${result}`);
    const agents = (result.data as any)?.agents || result.data || [];
    return {
      success: true,
      agents,
      message: `Retrieved ${Array.isArray(agents) ? agents.length : 0} agent(s)`
    };
  }

  private async getAgent(params: any): Promise<any> {
    const result = await this.apiClient.agentStudioGetAgent(params.agentId, params);
    if (!result.success) throw new Error(`Failed to get agent: ${result}`);
    return {
      success: true,
      agent: result.data,
      message: `Agent ${params.agentId} retrieved`
    };
  }

  private async executeAgent(params: any): Promise<any> {
    const result = await this.apiClient.agentStudioExecuteAgent(params.agentId, params);
    if (!result.success) throw new Error(`Failed to execute agent: ${result}`);
    return {
      success: true,
      data: result.data,
      executionId: (result.data as any)?.executionId,
      message: `Agent ${params.agentId} executed successfully`
    };
  }
}

export function isAgentStudioTool(toolName: string): boolean {
  const names = [
    'ghl_agent_studio_list_agents',
    'ghl_agent_studio_get_agent',
    'ghl_agent_studio_execute_agent'
  ];
  return names.includes(toolName);
}

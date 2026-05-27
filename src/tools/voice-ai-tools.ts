import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class VoiceAITools {
  constructor(private apiClient: GHLApiClient) {}

  getTools(): Tool[] {
    return [
      // Agent management
      {
        name: 'ghl_voice_ai_list_agents',
        description: 'Retrieve a paginated list of Voice AI agents for a location',
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
        name: 'ghl_voice_ai_create_agent',
        description: 'Create a new Voice AI agent with custom configuration',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID' },
            name: { type: 'string', description: 'Agent name' },
            voiceId: { type: 'string', description: 'Voice ID to use for the agent' },
            prompt: { type: 'string', description: 'System prompt / agent instructions' },
            firstMessage: { type: 'string', description: 'First message the agent says when a call starts' },
            language: { type: 'string', description: 'Agent language code (e.g. en-US)' }
          },
          required: ['name']
        }
      },
      {
        name: 'ghl_voice_ai_get_agent',
        description: 'Retrieve detailed configuration and settings for a specific Voice AI agent',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: { type: 'string', description: 'Voice AI agent ID' },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['agentId']
        }
      },
      {
        name: 'ghl_voice_ai_update_agent',
        description: 'Partially update an existing Voice AI agent configuration',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: { type: 'string', description: 'Voice AI agent ID to update' },
            locationId: { type: 'string', description: 'Location ID' },
            name: { type: 'string', description: 'Updated agent name' },
            voiceId: { type: 'string', description: 'Updated voice ID' },
            prompt: { type: 'string', description: 'Updated system prompt' },
            firstMessage: { type: 'string', description: 'Updated first message' },
            language: { type: 'string', description: 'Updated language code' }
          },
          required: ['agentId']
        }
      },
      {
        name: 'ghl_voice_ai_delete_agent',
        description: 'Delete a Voice AI agent and its associated configuration',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: { type: 'string', description: 'Voice AI agent ID to delete' },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['agentId']
        }
      },

      // Call logs
      {
        name: 'ghl_voice_ai_get_call_logs',
        description: 'Return call logs for Voice AI agents scoped to a location. Supports filtering by agent, contact, call type, action types, and date range.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID' },
            agentId: { type: 'string', description: 'Filter by agent ID' },
            contactId: { type: 'string', description: 'Filter by contact ID' },
            callType: { type: 'string', description: 'Filter by call type (inbound/outbound)' },
            startDate: { type: 'string', description: 'Start date filter (ISO format)' },
            endDate: { type: 'string', description: 'End date filter (ISO format)' },
            limit: { type: 'number', description: 'Max results per page', default: 20 },
            page: { type: 'number', description: 'Page number (1-based)', default: 1 }
          }
        }
      },
      {
        name: 'ghl_voice_ai_get_call_log',
        description: 'Retrieve a specific Voice AI call log by call ID',
        inputSchema: {
          type: 'object',
          properties: {
            callId: { type: 'string', description: 'Call log ID' },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['callId']
        }
      }
    ];
  }

  async executeVoiceAITool(name: string, params: any): Promise<any> {
    switch (name) {
      case 'ghl_voice_ai_list_agents':
        return await this.listAgents(params);
      case 'ghl_voice_ai_create_agent':
        return await this.createAgent(params);
      case 'ghl_voice_ai_get_agent':
        return await this.getAgent(params);
      case 'ghl_voice_ai_update_agent':
        return await this.updateAgent(params);
      case 'ghl_voice_ai_delete_agent':
        return await this.deleteAgent(params);
      case 'ghl_voice_ai_get_call_logs':
        return await this.getCallLogs(params);
      case 'ghl_voice_ai_get_call_log':
        return await this.getCallLog(params);
      default:
        throw new Error(`Unknown voice AI tool: ${name}`);
    }
  }

  private async listAgents(params: any): Promise<any> {
    const result = await this.apiClient.voiceAIListAgents(params);
    if (!result.success) throw new Error(`Failed to list Voice AI agents: ${result}`);
    const agents = (result.data as any)?.agents || result.data || [];
    return {
      success: true,
      agents,
      message: `Retrieved ${Array.isArray(agents) ? agents.length : 0} Voice AI agent(s)`
    };
  }

  private async createAgent(params: any): Promise<any> {
    const result = await this.apiClient.voiceAICreateAgent(params);
    if (!result.success) throw new Error(`Failed to create Voice AI agent: ${result}`);
    return {
      success: true,
      agent: result.data,
      message: 'Voice AI agent created successfully'
    };
  }

  private async getAgent(params: any): Promise<any> {
    const result = await this.apiClient.voiceAIGetAgent(params.agentId, params);
    if (!result.success) throw new Error(`Failed to get Voice AI agent: ${result}`);
    return {
      success: true,
      agent: result.data,
      message: `Voice AI agent ${params.agentId} retrieved`
    };
  }

  private async updateAgent(params: any): Promise<any> {
    const result = await this.apiClient.voiceAIUpdateAgent(params.agentId, params);
    if (!result.success) throw new Error(`Failed to update Voice AI agent: ${result}`);
    return {
      success: true,
      agent: result.data,
      message: `Voice AI agent ${params.agentId} updated`
    };
  }

  private async deleteAgent(params: any): Promise<any> {
    const result = await this.apiClient.voiceAIDeleteAgent(params.agentId, params);
    if (!result.success) throw new Error(`Failed to delete Voice AI agent: ${result}`);
    return {
      success: true,
      message: `Voice AI agent ${params.agentId} deleted`
    };
  }

  private async getCallLogs(params: any): Promise<any> {
    const result = await this.apiClient.voiceAIGetCallLogs(params);
    if (!result.success) throw new Error(`Failed to get call logs: ${result}`);
    const logs = (result.data as any)?.callLogs || (result.data as any)?.data || result.data || [];
    return {
      success: true,
      callLogs: logs,
      message: `Retrieved ${Array.isArray(logs) ? logs.length : 0} call log(s)`
    };
  }

  private async getCallLog(params: any): Promise<any> {
    const result = await this.apiClient.voiceAIGetCallLog(params.callId, params);
    if (!result.success) throw new Error(`Failed to get call log: ${result}`);
    return {
      success: true,
      callLog: result.data,
      message: `Call log ${params.callId} retrieved`
    };
  }
}

export function isVoiceAITool(toolName: string): boolean {
  const names = [
    'ghl_voice_ai_list_agents',
    'ghl_voice_ai_create_agent',
    'ghl_voice_ai_get_agent',
    'ghl_voice_ai_update_agent',
    'ghl_voice_ai_delete_agent',
    'ghl_voice_ai_get_call_logs',
    'ghl_voice_ai_get_call_log'
  ];
  return names.includes(toolName);
}

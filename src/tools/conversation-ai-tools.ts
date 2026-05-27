import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class ConversationAITools {
  constructor(private apiClient: GHLApiClient) {}

  getTools(): Tool[] {
    return [
      // ── Agent management ───────────────────────────────────────────────────

      {
        name: 'ghl_convo_ai_search_agents',
        description: 'Search / list Conversation AI agents for the location. Returns agents with their mode, channels, actions, and full configuration.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query to filter agents by name' },
            limit: { type: 'number', description: 'Max results to return', default: 20 },
            startAfter: { type: 'string', description: 'Cursor for pagination (agent ID to start after)' }
          }
        }
      },
      {
        name: 'ghl_convo_ai_create_agent',
        description: 'Create a new Conversation AI agent (bot). Set the name, mode (off / suggestive / auto-pilot), channels, personality, goal, and instructions.',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Agent name' },
            personality: { type: 'string', description: 'Personality traits of the agent' },
            goal: { type: 'string', description: 'The goal the agent is trying to achieve' },
            instructions: { type: 'string', description: 'Detailed instructions for how the agent should behave' },
            businessName: { type: 'string', description: 'Name of the business the agent represents' },
            mode: {
              type: 'string',
              enum: ['off', 'suggestive', 'auto-pilot'],
              description: 'Operating mode: off = disabled, suggestive = suggests replies, auto-pilot = replies automatically',
              default: 'suggestive'
            },
            channels: {
              type: 'array',
              items: { type: 'string' },
              description: 'Communication channels (e.g. ["sms", "email", "live_chat"])'
            },
            isPrimary: { type: 'boolean', description: 'Whether this is the primary agent for the location' },
            waitTime: { type: 'number', description: 'Wait time before agent responds (max 5 minutes or 300 seconds)' },
            waitTimeUnit: { type: 'string', enum: ['minutes', 'seconds'], description: 'Unit for wait time' },
            autoPilotMaxMessages: { type: 'number', description: 'Max messages in auto-pilot mode before handing off to human (1-100)' },
            knowledgeBaseIds: {
              type: 'array',
              items: { type: 'string' },
              description: 'Knowledge base IDs to attach to this agent'
            },
            respondToImages: { type: 'boolean', description: 'Allow agent to respond to images' },
            respondToAudio: { type: 'boolean', description: 'Allow agent to respond to audio' },
            sleepEnabled: { type: 'boolean', description: 'Enable sleep mode (agent stops responding during sleep)' },
            sleepTime: { type: 'number', description: 'Sleep duration (null for indefinite)' },
            sleepTimeUnit: { type: 'string', enum: ['hours', 'minutes', 'seconds'], description: 'Unit for sleep time' },
            sleepOnManualMessage: { type: 'boolean', description: 'Put agent to sleep when a manual outbound message is sent' },
            sleepOnWorkflowMessage: { type: 'boolean', description: 'Put agent to sleep when a workflow message is sent' }
          },
          required: ['name', 'personality', 'goal', 'instructions']
        }
      },
      {
        name: 'ghl_convo_ai_get_agent',
        description: 'Get the full configuration of a specific Conversation AI agent by ID, including its actions, channels, mode, and all settings.',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: { type: 'string', description: 'Conversation AI agent ID' }
          },
          required: ['agentId']
        }
      },
      {
        name: 'ghl_convo_ai_update_agent',
        description: 'Update a Conversation AI agent — change its name, mode, instructions, channels, knowledge base, or any other setting.',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: { type: 'string', description: 'Conversation AI agent ID to update' },
            name: { type: 'string', description: 'Updated agent name' },
            personality: { type: 'string', description: 'Updated personality' },
            goal: { type: 'string', description: 'Updated goal' },
            instructions: { type: 'string', description: 'Updated instructions' },
            businessName: { type: 'string', description: 'Updated business name' },
            mode: { type: 'string', enum: ['off', 'suggestive', 'auto-pilot'], description: 'Updated operating mode' },
            channels: { type: 'array', items: { type: 'string' }, description: 'Updated channels' },
            isPrimary: { type: 'boolean', description: 'Whether this is the primary agent' },
            waitTime: { type: 'number', description: 'Updated wait time' },
            waitTimeUnit: { type: 'string', enum: ['minutes', 'seconds'], description: 'Updated wait time unit' },
            autoPilotMaxMessages: { type: 'number', description: 'Updated auto-pilot max messages (1-100)' },
            knowledgeBaseIds: { type: 'array', items: { type: 'string' }, description: 'Updated knowledge base IDs' },
            respondToImages: { type: 'boolean', description: 'Updated respond to images setting' },
            respondToAudio: { type: 'boolean', description: 'Updated respond to audio setting' },
            sleepEnabled: { type: 'boolean', description: 'Updated sleep enabled setting' },
            sleepTime: { type: 'number', description: 'Updated sleep duration' },
            sleepTimeUnit: { type: 'string', enum: ['hours', 'minutes', 'seconds'], description: 'Updated sleep time unit' },
            sleepOnManualMessage: { type: 'boolean', description: 'Updated sleep on manual message setting' },
            sleepOnWorkflowMessage: { type: 'boolean', description: 'Updated sleep on workflow message setting' }
          },
          required: ['agentId']
        }
      },
      {
        name: 'ghl_convo_ai_delete_agent',
        description: 'Permanently delete a Conversation AI agent and all its associated actions.',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: { type: 'string', description: 'Conversation AI agent ID to delete' }
          },
          required: ['agentId']
        }
      },

      // ── Action management ──────────────────────────────────────────────────

      {
        name: 'ghl_convo_ai_list_actions',
        description: 'List all actions attached to a Conversation AI agent. Actions define what the bot does (book appointments, trigger workflows, hand over to human, etc.).',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: { type: 'string', description: 'Conversation AI agent ID' }
          },
          required: ['agentId']
        }
      },
      {
        name: 'ghl_convo_ai_create_action',
        description: 'Attach a new action to a Conversation AI agent. Action types: triggerWorkflow, updateContactField, appointmentBooking, stopBot, humanHandOver, advancedFollowup, transferBot.',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: { type: 'string', description: 'Conversation AI agent ID to attach the action to' },
            type: {
              type: 'string',
              enum: ['triggerWorkflow', 'updateContactField', 'appointmentBooking', 'stopBot', 'humanHandOver', 'advancedFollowup', 'transferBot'],
              description: 'Type of action'
            },
            name: { type: 'string', description: 'Action name' },
            details: { type: 'object', description: 'Action-specific configuration. For triggerWorkflow: {workflowId}. For appointmentBooking: {calendarId}. For updateContactField: {fieldKey, value}. For humanHandOver/stopBot/transferBot: {}.' }
          },
          required: ['agentId', 'type', 'name', 'details']
        }
      },
      {
        name: 'ghl_convo_ai_get_action',
        description: 'Get the full details of a specific action on a Conversation AI agent.',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: { type: 'string', description: 'Conversation AI agent ID' },
            actionId: { type: 'string', description: 'Action ID' }
          },
          required: ['agentId', 'actionId']
        }
      },
      {
        name: 'ghl_convo_ai_update_action',
        description: 'Update an existing action on a Conversation AI agent.',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: { type: 'string', description: 'Conversation AI agent ID' },
            actionId: { type: 'string', description: 'Action ID to update' },
            type: {
              type: 'string',
              enum: ['triggerWorkflow', 'updateContactField', 'appointmentBooking', 'stopBot', 'humanHandOver', 'advancedFollowup', 'transferBot'],
              description: 'Updated action type'
            },
            name: { type: 'string', description: 'Updated action name' },
            details: { type: 'object', description: 'Updated action-specific configuration' }
          },
          required: ['agentId', 'actionId']
        }
      },
      {
        name: 'ghl_convo_ai_delete_action',
        description: 'Permanently remove an action from a Conversation AI agent.',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: { type: 'string', description: 'Conversation AI agent ID' },
            actionId: { type: 'string', description: 'Action ID to remove' }
          },
          required: ['agentId', 'actionId']
        }
      },
      {
        name: 'ghl_convo_ai_update_followup_settings',
        description: 'Update the followup settings for a set of actions on a Conversation AI agent. Controls dynamic channel switching, working hours, and timezone.',
        inputSchema: {
          type: 'object',
          properties: {
            agentId: { type: 'string', description: 'Conversation AI agent ID' },
            actionIds: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of action IDs to apply followup settings to'
            },
            followupSettings: {
              type: 'object',
              description: 'Followup configuration',
              properties: {
                dynamicChannelSwitching: { type: 'boolean', description: 'Dynamically switch channels for followups' },
                followUpHours: { type: 'boolean', description: 'Respect working hours for followups' },
                timezoneToUse: { type: 'string', enum: ['contact', 'business'], description: 'Timezone reference for followups' }
              },
              required: ['dynamicChannelSwitching']
            }
          },
          required: ['agentId', 'actionIds', 'followupSettings']
        }
      },

      // ── Generations (AI response inspection) ──────────────────────────────

      {
        name: 'ghl_convo_ai_get_generation',
        description: 'Get the full details of what the Conversation AI generated for a specific message — includes the prompt used, the response, FAQ chunks, website content used, action logs, and conversation history. Useful for auditing bot responses or debugging why it said something.',
        inputSchema: {
          type: 'object',
          properties: {
            messageId: { type: 'string', description: 'The message ID to retrieve AI generation details for' },
            source: { type: 'string', description: 'Source context for the generation (e.g. "conversation")' }
          },
          required: ['messageId', 'source']
        }
      }
    ];
  }

  async executeConversationAITool(name: string, params: any): Promise<any> {
    switch (name) {
      case 'ghl_convo_ai_search_agents':
        return await this.searchAgents(params);
      case 'ghl_convo_ai_create_agent':
        return await this.createAgent(params);
      case 'ghl_convo_ai_get_agent':
        return await this.getAgent(params);
      case 'ghl_convo_ai_update_agent':
        return await this.updateAgent(params);
      case 'ghl_convo_ai_delete_agent':
        return await this.deleteAgent(params);
      case 'ghl_convo_ai_list_actions':
        return await this.listActions(params);
      case 'ghl_convo_ai_create_action':
        return await this.createAction(params);
      case 'ghl_convo_ai_get_action':
        return await this.getAction(params);
      case 'ghl_convo_ai_update_action':
        return await this.updateAction(params);
      case 'ghl_convo_ai_delete_action':
        return await this.deleteAction(params);
      case 'ghl_convo_ai_update_followup_settings':
        return await this.updateFollowupSettings(params);
      case 'ghl_convo_ai_get_generation':
        return await this.getGeneration(params);
      default:
        throw new Error(`Unknown conversation AI tool: ${name}`);
    }
  }

  private async searchAgents(params: any): Promise<any> {
    const result = await this.apiClient.convoAISearchAgents(params);
    if (!result.success) throw new Error(`Failed to search agents: ${result}`);
    const agents = (result.data as any)?.employees || (result.data as any)?.agents || result.data || [];
    return { success: true, agents, message: `Found ${Array.isArray(agents) ? agents.length : 0} Conversation AI agent(s)` };
  }

  private async createAgent(params: any): Promise<any> {
    const result = await this.apiClient.convoAICreateAgent(params);
    if (!result.success) throw new Error(`Failed to create agent: ${result}`);
    return { success: true, agent: result.data, message: `Conversation AI agent '${params.name}' created successfully` };
  }

  private async getAgent(params: any): Promise<any> {
    const result = await this.apiClient.convoAIGetAgent(params.agentId);
    if (!result.success) throw new Error(`Failed to get agent: ${result}`);
    return { success: true, agent: result.data, message: `Agent ${params.agentId} retrieved` };
  }

  private async updateAgent(params: any): Promise<any> {
    const result = await this.apiClient.convoAIUpdateAgent(params.agentId, params);
    if (!result.success) throw new Error(`Failed to update agent: ${result}`);
    return { success: true, agent: result.data, message: `Agent ${params.agentId} updated` };
  }

  private async deleteAgent(params: any): Promise<any> {
    const result = await this.apiClient.convoAIDeleteAgent(params.agentId);
    if (!result.success) throw new Error(`Failed to delete agent: ${result}`);
    return { success: true, message: `Agent ${params.agentId} deleted` };
  }

  private async listActions(params: any): Promise<any> {
    const result = await this.apiClient.convoAIListActions(params.agentId);
    if (!result.success) throw new Error(`Failed to list actions: ${result}`);
    const actions = (result.data as any)?.data || result.data || [];
    return { success: true, actions, message: `Found ${Array.isArray(actions) ? actions.length : 0} action(s)` };
  }

  private async createAction(params: any): Promise<any> {
    const result = await this.apiClient.convoAICreateAction(params.agentId, params);
    if (!result.success) throw new Error(`Failed to create action: ${result}`);
    return { success: true, action: (result.data as any)?.data || result.data, message: `Action '${params.name}' attached to agent ${params.agentId}` };
  }

  private async getAction(params: any): Promise<any> {
    const result = await this.apiClient.convoAIGetAction(params.agentId, params.actionId);
    if (!result.success) throw new Error(`Failed to get action: ${result}`);
    return { success: true, action: (result.data as any)?.data || result.data, message: `Action ${params.actionId} retrieved` };
  }

  private async updateAction(params: any): Promise<any> {
    const result = await this.apiClient.convoAIUpdateAction(params.agentId, params.actionId, params);
    if (!result.success) throw new Error(`Failed to update action: ${result}`);
    return { success: true, action: (result.data as any)?.data || result.data, message: `Action ${params.actionId} updated` };
  }

  private async deleteAction(params: any): Promise<any> {
    const result = await this.apiClient.convoAIDeleteAction(params.agentId, params.actionId);
    if (!result.success) throw new Error(`Failed to delete action: ${result}`);
    return { success: true, message: `Action ${params.actionId} removed from agent ${params.agentId}` };
  }

  private async updateFollowupSettings(params: any): Promise<any> {
    const result = await this.apiClient.convoAIUpdateFollowupSettings(params.agentId, params);
    if (!result.success) throw new Error(`Failed to update followup settings: ${result}`);
    return { success: true, data: result.data, message: `Followup settings updated for agent ${params.agentId}` };
  }

  private async getGeneration(params: any): Promise<any> {
    const result = await this.apiClient.convoAIGetGeneration(params.messageId, params.source);
    if (!result.success) throw new Error(`Failed to get generation: ${result}`);
    return { success: true, generation: result.data, message: `Generation details retrieved for message ${params.messageId}` };
  }
}

export function isConversationAITool(toolName: string): boolean {
  const names = [
    'ghl_convo_ai_search_agents',
    'ghl_convo_ai_create_agent',
    'ghl_convo_ai_get_agent',
    'ghl_convo_ai_update_agent',
    'ghl_convo_ai_delete_agent',
    'ghl_convo_ai_list_actions',
    'ghl_convo_ai_create_action',
    'ghl_convo_ai_get_action',
    'ghl_convo_ai_update_action',
    'ghl_convo_ai_delete_action',
    'ghl_convo_ai_update_followup_settings',
    'ghl_convo_ai_get_generation'
  ];
  return names.includes(toolName);
}

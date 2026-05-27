import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class TriggerLinksTools {
  constructor(private apiClient: GHLApiClient) {}

  getTools(): Tool[] {
    return [
      {
        name: 'ghl_list_trigger_links',
        description: 'List all trigger links in a location.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' }
          }
        }
      },
      {
        name: 'ghl_search_trigger_links',
        description: 'Search trigger links by name. Useful when you have many links and need to find a specific one.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            query: { type: 'string', description: 'Search query to filter by name' },
            skip: { type: 'number', description: 'Records to skip', default: 0 },
            limit: { type: 'number', description: 'Max records to return', default: 20 }
          }
        }
      },
      {
        name: 'ghl_get_trigger_link',
        description: 'Get a specific trigger link by ID.',
        inputSchema: {
          type: 'object',
          properties: {
            linkId: { type: 'string', description: 'Trigger link ID' },
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' }
          },
          required: ['linkId']
        }
      },
      {
        name: 'ghl_create_trigger_link',
        description: 'Create a new trigger link. Trigger links redirect to a URL and can fire a workflow when clicked.',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Name of the trigger link' },
            redirectTo: { type: 'string', description: 'URL to redirect to when the link is clicked' },
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' }
          },
          required: ['name', 'redirectTo']
        }
      },
      {
        name: 'ghl_update_trigger_link',
        description: 'Update an existing trigger link\'s name or destination URL.',
        inputSchema: {
          type: 'object',
          properties: {
            linkId: { type: 'string', description: 'Trigger link ID to update' },
            name: { type: 'string', description: 'New name for the link' },
            redirectTo: { type: 'string', description: 'New redirect URL' }
          },
          required: ['linkId', 'name', 'redirectTo']
        }
      },
      {
        name: 'ghl_delete_trigger_link',
        description: 'Delete a trigger link.',
        inputSchema: {
          type: 'object',
          properties: {
            linkId: { type: 'string', description: 'Trigger link ID to delete' }
          },
          required: ['linkId']
        }
      }
    ];
  }

  async executeTriggerLinksTool(name: string, params: any): Promise<any> {
    switch (name) {
      case 'ghl_list_trigger_links':
        return await this.listTriggerLinks(params);
      case 'ghl_search_trigger_links':
        return await this.searchTriggerLinks(params);
      case 'ghl_get_trigger_link':
        return await this.getTriggerLink(params);
      case 'ghl_create_trigger_link':
        return await this.createTriggerLink(params);
      case 'ghl_update_trigger_link':
        return await this.updateTriggerLink(params);
      case 'ghl_delete_trigger_link':
        return await this.deleteTriggerLink(params);
      default:
        throw new Error(`Unknown trigger links tool: ${name}`);
    }
  }

  private async listTriggerLinks(params: any): Promise<any> {
    const result = await this.apiClient.listTriggerLinks(params);
    if (!result.success) throw new Error(`Failed to list trigger links: ${result.error}`);
    const links = (result.data as any)?.links || result.data || [];
    return { success: true, links, message: `Retrieved ${Array.isArray(links) ? links.length : 0} trigger link(s)` };
  }

  private async searchTriggerLinks(params: any): Promise<any> {
    const result = await this.apiClient.searchTriggerLinks(params);
    if (!result.success) throw new Error(`Failed to search trigger links: ${result.error}`);
    const links = (result.data as any)?.links || result.data || [];
    return { success: true, links, message: `Found ${Array.isArray(links) ? links.length : 0} trigger link(s)` };
  }

  private async getTriggerLink(params: any): Promise<any> {
    const result = await this.apiClient.getTriggerLink(params.linkId, params.locationId);
    if (!result.success) throw new Error(`Failed to get trigger link: ${result.error}`);
    return { success: true, link: (result.data as any)?.link || result.data };
  }

  private async createTriggerLink(params: any): Promise<any> {
    const result = await this.apiClient.createTriggerLink(params);
    if (!result.success) throw new Error(`Failed to create trigger link: ${result.error}`);
    return { success: true, link: result.data, message: 'Trigger link created successfully' };
  }

  private async updateTriggerLink(params: any): Promise<any> {
    const { linkId, ...body } = params;
    const result = await this.apiClient.updateTriggerLink(linkId, body);
    if (!result.success) throw new Error(`Failed to update trigger link: ${result.error}`);
    return { success: true, link: result.data, message: 'Trigger link updated successfully' };
  }

  private async deleteTriggerLink(params: any): Promise<any> {
    const result = await this.apiClient.deleteTriggerLink(params.linkId);
    if (!result.success) throw new Error(`Failed to delete trigger link: ${result.error}`);
    return { success: true, data: result.data, message: 'Trigger link deleted successfully' };
  }
}

export function isTriggerLinksTool(toolName: string): boolean {
  return [
    'ghl_list_trigger_links', 'ghl_search_trigger_links', 'ghl_get_trigger_link',
    'ghl_create_trigger_link', 'ghl_update_trigger_link', 'ghl_delete_trigger_link'
  ].includes(toolName);
}

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class FunnelsTools {
  constructor(private apiClient: GHLApiClient) {}

  getTools(): Tool[] {
    return [
      {
        name: 'ghl_list_funnels',
        description: 'List all funnels in a location. Returns funnel IDs, names, and types. Funnels cannot be edited via API — this is read-only.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            name: { type: 'string', description: 'Filter by funnel name (partial match)' },
            type: { type: 'string', description: 'Filter by type' },
            category: { type: 'string', description: 'Filter by category' },
            limit: { type: 'number', description: 'Max records to return', default: 20 },
            offset: { type: 'number', description: 'Records to skip', default: 0 }
          }
        }
      },
      {
        name: 'ghl_list_funnel_pages',
        description: 'List pages within a specific funnel. Useful for getting page IDs and names.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            funnelId: { type: 'string', description: 'Funnel ID to list pages for' },
            name: { type: 'string', description: 'Filter by page name' },
            limit: { type: 'number', description: 'Max records', default: 20 },
            offset: { type: 'number', description: 'Records to skip', default: 0 }
          }
        }
      },
      {
        name: 'ghl_count_funnel_pages',
        description: 'Get the count of pages in a funnel.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            funnelId: { type: 'string', description: 'Funnel ID' },
            name: { type: 'string', description: 'Filter by page name' }
          }
        }
      },
      {
        name: 'ghl_list_funnel_redirects',
        description: 'List URL redirects configured for funnels/websites in a location.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            search: { type: 'string', description: 'Search by path or domain' },
            limit: { type: 'number', description: 'Max records', default: 20 },
            offset: { type: 'number', description: 'Records to skip', default: 0 }
          }
        }
      },
      {
        name: 'ghl_create_funnel_redirect',
        description: 'Create a URL redirect for a funnel or website domain. Redirects a specific path to a target URL.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            domain: { type: 'string', description: 'Domain where the redirect applies (e.g. systemsninjas.com)' },
            path: { type: 'string', description: 'Source path to redirect from (e.g. /old-page)' },
            target: { type: 'string', description: 'Target URL to redirect to' },
            action: { type: 'string', description: 'Redirect type: "permanent" (301) or "temporary" (302)' }
          },
          required: ['domain', 'path', 'target', 'action']
        }
      },
      {
        name: 'ghl_update_funnel_redirect',
        description: 'Update an existing URL redirect.',
        inputSchema: {
          type: 'object',
          properties: {
            redirectId: { type: 'string', description: 'Redirect ID to update' },
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            target: { type: 'string', description: 'New target URL' },
            action: { type: 'string', description: 'Redirect type: "permanent" or "temporary"' }
          },
          required: ['redirectId', 'target', 'action']
        }
      },
      {
        name: 'ghl_delete_funnel_redirect',
        description: 'Delete a URL redirect.',
        inputSchema: {
          type: 'object',
          properties: {
            redirectId: { type: 'string', description: 'Redirect ID to delete' },
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' }
          },
          required: ['redirectId']
        }
      }
    ];
  }

  async executeFunnelsTool(name: string, params: any): Promise<any> {
    switch (name) {
      case 'ghl_list_funnels':
        return await this.listFunnels(params);
      case 'ghl_list_funnel_pages':
        return await this.listFunnelPages(params);
      case 'ghl_count_funnel_pages':
        return await this.countFunnelPages(params);
      case 'ghl_list_funnel_redirects':
        return await this.listFunnelRedirects(params);
      case 'ghl_create_funnel_redirect':
        return await this.createFunnelRedirect(params);
      case 'ghl_update_funnel_redirect':
        return await this.updateFunnelRedirect(params);
      case 'ghl_delete_funnel_redirect':
        return await this.deleteFunnelRedirect(params);
      default:
        throw new Error(`Unknown funnels tool: ${name}`);
    }
  }

  private async listFunnels(params: any): Promise<any> {
    const result = await this.apiClient.listFunnels(params);
    if (!result.success) throw new Error(`Failed to list funnels: ${result.error}`);
    const funnels = (result.data as any)?.funnels || (result.data as any)?.data || result.data || [];
    return { success: true, funnels, message: `Retrieved ${Array.isArray(funnels) ? funnels.length : 0} funnel(s)` };
  }

  private async listFunnelPages(params: any): Promise<any> {
    const result = await this.apiClient.listFunnelPages(params);
    if (!result.success) throw new Error(`Failed to list funnel pages: ${result.error}`);
    const pages = (result.data as any)?.pages || (result.data as any)?.data || result.data || [];
    return { success: true, pages, message: `Retrieved ${Array.isArray(pages) ? pages.length : 0} page(s)` };
  }

  private async countFunnelPages(params: any): Promise<any> {
    const result = await this.apiClient.countFunnelPages(params);
    if (!result.success) throw new Error(`Failed to count funnel pages: ${result.error}`);
    return { success: true, data: result.data };
  }

  private async listFunnelRedirects(params: any): Promise<any> {
    const result = await this.apiClient.listFunnelRedirects(params);
    if (!result.success) throw new Error(`Failed to list redirects: ${result.error}`);
    const redirects = (result.data as any)?.data || result.data || [];
    return { success: true, redirects, message: `Retrieved redirects` };
  }

  private async createFunnelRedirect(params: any): Promise<any> {
    const result = await this.apiClient.createFunnelRedirect(params);
    if (!result.success) throw new Error(`Failed to create redirect: ${result.error}`);
    return { success: true, data: result.data, message: 'Redirect created successfully' };
  }

  private async updateFunnelRedirect(params: any): Promise<any> {
    const { redirectId, ...body } = params;
    const result = await this.apiClient.updateFunnelRedirect(redirectId, body);
    if (!result.success) throw new Error(`Failed to update redirect: ${result.error}`);
    return { success: true, data: result.data, message: 'Redirect updated successfully' };
  }

  private async deleteFunnelRedirect(params: any): Promise<any> {
    const result = await this.apiClient.deleteFunnelRedirect(params.redirectId, params.locationId);
    if (!result.success) throw new Error(`Failed to delete redirect: ${result.error}`);
    return { success: true, data: result.data, message: 'Redirect deleted successfully' };
  }
}

export function isFunnelsTool(toolName: string): boolean {
  return [
    'ghl_list_funnels', 'ghl_list_funnel_pages', 'ghl_count_funnel_pages',
    'ghl_list_funnel_redirects', 'ghl_create_funnel_redirect',
    'ghl_update_funnel_redirect', 'ghl_delete_funnel_redirect'
  ].includes(toolName);
}

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class MiscTools {
  constructor(private apiClient: GHLApiClient) {}

  getTools(): Tool[] {
    return [
      {
        name: 'ghl_list_campaigns',
        description: 'List all campaigns (drip sequences) in a location.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            status: { type: 'string', description: 'Filter by status (e.g. "active", "inactive", "draft")' }
          }
        }
      },
      {
        name: 'ghl_get_company',
        description: 'Get agency/company details by company ID.',
        inputSchema: {
          type: 'object',
          properties: {
            companyId: { type: 'string', description: 'Company/agency ID' }
          },
          required: ['companyId']
        }
      }
    ];
  }

  async executeMiscTool(name: string, params: any): Promise<any> {
    switch (name) {
      case 'ghl_list_campaigns': return await this.listCampaigns(params);
      case 'ghl_get_company': return await this.getCompany(params);
      default: throw new Error(`Unknown misc tool: ${name}`);
    }
  }

  private async listCampaigns(params: any): Promise<any> {
    const result = await this.apiClient.listCampaigns(params);
    if (!result.success) throw new Error(`Failed to list campaigns: ${result.error}`);
    const campaigns = (result.data as any)?.campaigns || result.data || [];
    return { success: true, campaigns, message: `Retrieved ${Array.isArray(campaigns) ? campaigns.length : 0} campaign(s)` };
  }

  private async getCompany(params: any): Promise<any> {
    const result = await this.apiClient.getCompany(params.companyId);
    if (!result.success) throw new Error(`Failed to get company: ${result.error}`);
    return { success: true, company: result.data };
  }
}

export function isMiscTool(toolName: string): boolean {
  return ['ghl_list_campaigns', 'ghl_get_company'].includes(toolName);
}

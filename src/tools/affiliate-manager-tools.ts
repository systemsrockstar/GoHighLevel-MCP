import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class AffiliateManagerTools {
  constructor(private apiClient: GHLApiClient) {}

  getTools(): Tool[] {
    return [
      {
        name: 'ghl_list_affiliates',
        description: 'List all affiliates in a location.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            limit: { type: 'number', description: 'Max records', default: 20 },
            offset: { type: 'number', description: 'Records to skip', default: 0 }
          }
        }
      },
      {
        name: 'ghl_get_affiliate',
        description: 'Get a specific affiliate by ID.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            affiliateId: { type: 'string', description: 'Affiliate ID' }
          },
          required: ['affiliateId']
        }
      },
      {
        name: 'ghl_list_affiliate_payouts',
        description: 'List payout history for affiliates in a location.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            limit: { type: 'number', description: 'Max records', default: 20 },
            offset: { type: 'number', description: 'Records to skip', default: 0 }
          }
        }
      },
      {
        name: 'ghl_list_affiliate_commissions',
        description: 'List commissions earned by affiliates in a location.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            limit: { type: 'number', description: 'Max records', default: 20 },
            offset: { type: 'number', description: 'Records to skip', default: 0 }
          }
        }
      }
    ];
  }

  async executeAffiliateManagerTool(name: string, params: any): Promise<any> {
    switch (name) {
      case 'ghl_list_affiliates': return await this.listAffiliates(params);
      case 'ghl_get_affiliate': return await this.getAffiliate(params);
      case 'ghl_list_affiliate_payouts': return await this.listPayouts(params);
      case 'ghl_list_affiliate_commissions': return await this.listCommissions(params);
      default: throw new Error(`Unknown affiliate manager tool: ${name}`);
    }
  }

  private async listAffiliates(params: any): Promise<any> {
    const locationId = params.locationId || this.apiClient.getLocationId();
    const result = await this.apiClient.listAffiliates(locationId, params);
    if (!result.success) throw new Error(`Failed to list affiliates: ${result.error}`);
    const affiliates = (result.data as any)?.affiliates || result.data || [];
    return { success: true, affiliates, message: `Retrieved ${Array.isArray(affiliates) ? affiliates.length : 0} affiliate(s)` };
  }

  private async getAffiliate(params: any): Promise<any> {
    const locationId = params.locationId || this.apiClient.getLocationId();
    const result = await this.apiClient.getAffiliate(locationId, params.affiliateId);
    if (!result.success) throw new Error(`Failed to get affiliate: ${result.error}`);
    return { success: true, affiliate: result.data };
  }

  private async listPayouts(params: any): Promise<any> {
    const locationId = params.locationId || this.apiClient.getLocationId();
    const result = await this.apiClient.listAffiliatePayouts(locationId, params);
    if (!result.success) throw new Error(`Failed to list payouts: ${result.error}`);
    const payouts = (result.data as any)?.payouts || result.data || [];
    return { success: true, payouts, message: `Retrieved ${Array.isArray(payouts) ? payouts.length : 0} payout(s)` };
  }

  private async listCommissions(params: any): Promise<any> {
    const locationId = params.locationId || this.apiClient.getLocationId();
    const result = await this.apiClient.listAffiliateCommissions(locationId, params);
    if (!result.success) throw new Error(`Failed to list commissions: ${result.error}`);
    const commissions = (result.data as any)?.commissions || result.data || [];
    return { success: true, commissions, message: `Retrieved ${Array.isArray(commissions) ? commissions.length : 0} commission(s)` };
  }
}

export function isAffiliateManagerTool(toolName: string): boolean {
  return ['ghl_list_affiliates', 'ghl_get_affiliate', 'ghl_list_affiliate_payouts', 'ghl_list_affiliate_commissions'].includes(toolName);
}

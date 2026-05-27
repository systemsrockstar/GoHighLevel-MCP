import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class PhoneSystemTools {
  constructor(private apiClient: GHLApiClient) {}

  getTools(): Tool[] {
    return [
      {
        name: 'ghl_list_phone_numbers',
        description: 'List all active phone numbers assigned to a location.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' }
          }
        }
      },
      {
        name: 'ghl_list_available_phone_numbers',
        description: 'Search for available phone numbers to purchase for a location.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' }
          }
        }
      },
      {
        name: 'ghl_list_number_pools',
        description: 'List phone number pools configured in GHL.',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'ghl_purchase_phone_number',
        description: 'Purchase a phone number for a location.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            phoneNumber: { type: 'string', description: 'Phone number to purchase in E.164 format (e.g. +16175551234)' }
          },
          required: ['phoneNumber']
        }
      }
    ];
  }

  async executePhoneSystemTool(name: string, params: any): Promise<any> {
    switch (name) {
      case 'ghl_list_phone_numbers': return await this.listPhoneNumbers(params);
      case 'ghl_list_available_phone_numbers': return await this.listAvailableNumbers(params);
      case 'ghl_list_number_pools': return await this.listNumberPools(params);
      case 'ghl_purchase_phone_number': return await this.purchasePhoneNumber(params);
      default: throw new Error(`Unknown phone system tool: ${name}`);
    }
  }

  private async listPhoneNumbers(params: any): Promise<any> {
    const result = await this.apiClient.listPhoneNumbers(params.locationId);
    if (!result.success) throw new Error(`Failed to list phone numbers: ${result.error}`);
    const numbers = (result.data as any)?.numbers || result.data || [];
    return { success: true, numbers, message: `Retrieved ${Array.isArray(numbers) ? numbers.length : 0} number(s)` };
  }

  private async listAvailableNumbers(params: any): Promise<any> {
    const result = await this.apiClient.listAvailablePhoneNumbers(params.locationId);
    if (!result.success) throw new Error(`Failed to list available numbers: ${result.error}`);
    return { success: true, data: result.data };
  }

  private async listNumberPools(params: any): Promise<any> {
    const result = await this.apiClient.listNumberPools();
    if (!result.success) throw new Error(`Failed to list number pools: ${result.error}`);
    return { success: true, data: result.data };
  }

  private async purchasePhoneNumber(params: any): Promise<any> {
    const result = await this.apiClient.purchasePhoneNumber(params.locationId, params.phoneNumber);
    if (!result.success) throw new Error(`Failed to purchase phone number: ${result.error}`);
    return { success: true, data: result.data, message: `Phone number ${params.phoneNumber} purchased successfully` };
  }
}

export function isPhoneSystemTool(toolName: string): boolean {
  return ['ghl_list_phone_numbers', 'ghl_list_available_phone_numbers', 'ghl_list_number_pools', 'ghl_purchase_phone_number'].includes(toolName);
}

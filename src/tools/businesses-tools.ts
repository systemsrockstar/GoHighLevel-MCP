import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class BusinessesTools {
  constructor(private apiClient: GHLApiClient) {}

  getTools(): Tool[] {
    return [
      {
        name: 'ghl_list_businesses',
        description: 'List all businesses (companies) in a location. Businesses can be linked to contacts.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            limit: { type: 'number', description: 'Max records to return', default: 25 },
            skip: { type: 'number', description: 'Records to skip', default: 0 }
          }
        }
      },
      {
        name: 'ghl_get_business',
        description: 'Get a specific business by ID.',
        inputSchema: {
          type: 'object',
          properties: {
            businessId: { type: 'string', description: 'Business ID to retrieve' }
          },
          required: ['businessId']
        }
      },
      {
        name: 'ghl_create_business',
        description: 'Create a new business record in a location. Businesses can be associated with contacts.',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Business name' },
            locationId: { type: 'string', description: 'Location ID to create the business in (defaults to configured location)' },
            phone: { type: 'string', description: 'Business phone number' },
            email: { type: 'string', description: 'Business email' },
            website: { type: 'string', description: 'Business website URL' },
            address: { type: 'string', description: 'Street address' },
            city: { type: 'string', description: 'City' },
            state: { type: 'string', description: 'State/province' },
            postalCode: { type: 'string', description: 'Postal/zip code' },
            country: { type: 'string', description: 'Country' },
            description: { type: 'string', description: 'Business description' }
          },
          required: ['name']
        }
      },
      {
        name: 'ghl_update_business',
        description: 'Update an existing business record.',
        inputSchema: {
          type: 'object',
          properties: {
            businessId: { type: 'string', description: 'Business ID to update' },
            name: { type: 'string', description: 'Business name' },
            phone: { type: 'string', description: 'Business phone number' },
            email: { type: 'string', description: 'Business email' },
            website: { type: 'string', description: 'Business website URL' },
            address: { type: 'string', description: 'Street address' },
            city: { type: 'string', description: 'City' },
            state: { type: 'string', description: 'State/province' },
            postalCode: { type: 'string', description: 'Postal/zip code' },
            country: { type: 'string', description: 'Country' },
            description: { type: 'string', description: 'Business description' }
          },
          required: ['businessId']
        }
      },
      {
        name: 'ghl_delete_business',
        description: 'Delete a business record from a location.',
        inputSchema: {
          type: 'object',
          properties: {
            businessId: { type: 'string', description: 'Business ID to delete' }
          },
          required: ['businessId']
        }
      }
    ];
  }

  async executeBusinessesTool(name: string, params: any): Promise<any> {
    switch (name) {
      case 'ghl_list_businesses':
        return await this.listBusinesses(params);
      case 'ghl_get_business':
        return await this.getBusiness(params);
      case 'ghl_create_business':
        return await this.createBusiness(params);
      case 'ghl_update_business':
        return await this.updateBusiness(params);
      case 'ghl_delete_business':
        return await this.deleteBusiness(params);
      default:
        throw new Error(`Unknown businesses tool: ${name}`);
    }
  }

  private async listBusinesses(params: any): Promise<any> {
    const result = await this.apiClient.listBusinesses(params);
    if (!result.success) throw new Error(`Failed to list businesses: ${result.error}`);
    const businesses = (result.data as any)?.businesses || result.data || [];
    return { success: true, businesses, message: `Retrieved ${Array.isArray(businesses) ? businesses.length : 0} business(es)` };
  }

  private async getBusiness(params: any): Promise<any> {
    const result = await this.apiClient.getBusiness(params.businessId);
    if (!result.success) throw new Error(`Failed to get business: ${result.error}`);
    return { success: true, business: result.data };
  }

  private async createBusiness(params: any): Promise<any> {
    const result = await this.apiClient.createBusiness(params);
    if (!result.success) throw new Error(`Failed to create business: ${result.error}`);
    return { success: true, business: result.data, message: 'Business created successfully' };
  }

  private async updateBusiness(params: any): Promise<any> {
    const { businessId, ...body } = params;
    const result = await this.apiClient.updateBusiness(businessId, body);
    if (!result.success) throw new Error(`Failed to update business: ${result.error}`);
    return { success: true, business: result.data, message: 'Business updated successfully' };
  }

  private async deleteBusiness(params: any): Promise<any> {
    const result = await this.apiClient.deleteBusiness(params.businessId);
    if (!result.success) throw new Error(`Failed to delete business: ${result.error}`);
    return { success: true, data: result.data, message: 'Business deleted successfully' };
  }
}

export function isBusinessesTool(toolName: string): boolean {
  return [
    'ghl_list_businesses', 'ghl_get_business', 'ghl_create_business',
    'ghl_update_business', 'ghl_delete_business'
  ].includes(toolName);
}

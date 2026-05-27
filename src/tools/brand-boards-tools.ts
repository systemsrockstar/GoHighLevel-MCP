import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class BrandBoardsTools {
  constructor(private apiClient: GHLApiClient) {}

  getTools(): Tool[] {
    return [
      {
        name: 'ghl_list_brand_boards',
        description: 'List all brand boards for a location.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' }
          }
        }
      },
      {
        name: 'ghl_get_brand_board',
        description: 'Get a specific brand board by ID.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            id: { type: 'string', description: 'Brand board ID' }
          },
          required: ['id']
        }
      },
      {
        name: 'ghl_create_brand_board',
        description: 'Create a new brand board (colors, fonts, logos) for a location.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            name: { type: 'string', description: 'Brand board name' },
            colors: { type: 'object', description: 'Brand colors object (primary, secondary, etc.)' },
            fonts: { type: 'object', description: 'Brand fonts object' },
            logos: { type: 'object', description: 'Brand logos (URLs)' }
          },
          required: ['name']
        }
      },
      {
        name: 'ghl_update_brand_board',
        description: 'Update an existing brand board.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            id: { type: 'string', description: 'Brand board ID' },
            name: { type: 'string', description: 'Updated name' },
            colors: { type: 'object', description: 'Updated brand colors' },
            fonts: { type: 'object', description: 'Updated brand fonts' },
            logos: { type: 'object', description: 'Updated brand logos' }
          },
          required: ['id']
        }
      },
      {
        name: 'ghl_delete_brand_board',
        description: 'Delete a brand board by ID.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            id: { type: 'string', description: 'Brand board ID to delete' }
          },
          required: ['id']
        }
      }
    ];
  }

  async executeBrandBoardsTool(name: string, params: any): Promise<any> {
    switch (name) {
      case 'ghl_list_brand_boards': return await this.listBrandBoards(params);
      case 'ghl_get_brand_board': return await this.getBrandBoard(params);
      case 'ghl_create_brand_board': return await this.createBrandBoard(params);
      case 'ghl_update_brand_board': return await this.updateBrandBoard(params);
      case 'ghl_delete_brand_board': return await this.deleteBrandBoard(params);
      default: throw new Error(`Unknown brand boards tool: ${name}`);
    }
  }

  private async listBrandBoards(params: any): Promise<any> {
    const locationId = params.locationId || this.apiClient.getLocationId();
    const result = await this.apiClient.listBrandBoards(locationId);
    if (!result.success) throw new Error(`Failed to list brand boards: ${result.error}`);
    const boards = (result.data as any)?.brandBoards || result.data || [];
    return { success: true, brandBoards: boards, message: `Retrieved ${Array.isArray(boards) ? boards.length : 0} brand board(s)` };
  }

  private async getBrandBoard(params: any): Promise<any> {
    const locationId = params.locationId || this.apiClient.getLocationId();
    const result = await this.apiClient.getBrandBoard(locationId, params.id);
    if (!result.success) throw new Error(`Failed to get brand board: ${result.error}`);
    return { success: true, brandBoard: result.data };
  }

  private async createBrandBoard(params: any): Promise<any> {
    const locationId = params.locationId || this.apiClient.getLocationId();
    const result = await this.apiClient.createBrandBoard(locationId, params);
    if (!result.success) throw new Error(`Failed to create brand board: ${result.error}`);
    return { success: true, brandBoard: result.data, message: 'Brand board created successfully' };
  }

  private async updateBrandBoard(params: any): Promise<any> {
    const locationId = params.locationId || this.apiClient.getLocationId();
    const result = await this.apiClient.updateBrandBoard(locationId, params.id, params);
    if (!result.success) throw new Error(`Failed to update brand board: ${result.error}`);
    return { success: true, brandBoard: result.data, message: 'Brand board updated successfully' };
  }

  private async deleteBrandBoard(params: any): Promise<any> {
    const locationId = params.locationId || this.apiClient.getLocationId();
    const result = await this.apiClient.deleteBrandBoard(locationId, params.id);
    if (!result.success) throw new Error(`Failed to delete brand board: ${result.error}`);
    return { success: true, message: 'Brand board deleted successfully' };
  }
}

export function isBrandBoardsTool(toolName: string): boolean {
  return ['ghl_list_brand_boards', 'ghl_get_brand_board', 'ghl_create_brand_board', 'ghl_update_brand_board', 'ghl_delete_brand_board'].includes(toolName);
}

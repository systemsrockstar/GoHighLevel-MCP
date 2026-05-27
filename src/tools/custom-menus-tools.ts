import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class CustomMenusTools {
  constructor(private apiClient: GHLApiClient) {}

  getTools(): Tool[] {
    return [
      {
        name: 'ghl_list_custom_menus',
        description: 'List all custom menu links added to GHL (white-label navigation items visible in the sidebar).',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' }
          }
        }
      },
      {
        name: 'ghl_get_custom_menu',
        description: 'Get a specific custom menu link by ID.',
        inputSchema: {
          type: 'object',
          properties: {
            customMenuId: { type: 'string', description: 'Custom menu ID' }
          },
          required: ['customMenuId']
        }
      },
      {
        name: 'ghl_create_custom_menu',
        description: 'Create a new custom menu link in the GHL sidebar.',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Label shown in the sidebar' },
            url: { type: 'string', description: 'URL to open when clicked' },
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            icon: { type: 'string', description: 'Icon name for the menu item' },
            openMode: { type: 'string', description: 'How to open: "new_tab", "current_tab", or "iframe"' },
            showOnCompany: { type: 'boolean', description: 'Show at agency level' },
            showOnLocation: { type: 'boolean', description: 'Show at location level' }
          },
          required: ['name', 'url']
        }
      },
      {
        name: 'ghl_update_custom_menu',
        description: 'Update an existing custom menu link.',
        inputSchema: {
          type: 'object',
          properties: {
            customMenuId: { type: 'string', description: 'Custom menu ID to update' },
            name: { type: 'string', description: 'New label' },
            url: { type: 'string', description: 'New URL' },
            icon: { type: 'string', description: 'Icon name' },
            openMode: { type: 'string', description: '"new_tab", "current_tab", or "iframe"' },
            showOnCompany: { type: 'boolean' },
            showOnLocation: { type: 'boolean' }
          },
          required: ['customMenuId']
        }
      },
      {
        name: 'ghl_delete_custom_menu',
        description: 'Delete a custom menu link.',
        inputSchema: {
          type: 'object',
          properties: {
            customMenuId: { type: 'string', description: 'Custom menu ID to delete' }
          },
          required: ['customMenuId']
        }
      }
    ];
  }

  async executeCustomMenusTool(name: string, params: any): Promise<any> {
    switch (name) {
      case 'ghl_list_custom_menus': return await this.listCustomMenus(params);
      case 'ghl_get_custom_menu': return await this.getCustomMenu(params);
      case 'ghl_create_custom_menu': return await this.createCustomMenu(params);
      case 'ghl_update_custom_menu': return await this.updateCustomMenu(params);
      case 'ghl_delete_custom_menu': return await this.deleteCustomMenu(params);
      default: throw new Error(`Unknown custom menus tool: ${name}`);
    }
  }

  private async listCustomMenus(params: any): Promise<any> {
    const result = await this.apiClient.listCustomMenus(params);
    if (!result.success) throw new Error(`Failed to list custom menus: ${result.error}`);
    const menus = (result.data as any)?.customMenus || result.data || [];
    return { success: true, menus, message: `Retrieved ${Array.isArray(menus) ? menus.length : 0} custom menu(s)` };
  }

  private async getCustomMenu(params: any): Promise<any> {
    const result = await this.apiClient.getCustomMenu(params.customMenuId);
    if (!result.success) throw new Error(`Failed to get custom menu: ${result.error}`);
    return { success: true, menu: result.data };
  }

  private async createCustomMenu(params: any): Promise<any> {
    const result = await this.apiClient.createCustomMenu(params);
    if (!result.success) throw new Error(`Failed to create custom menu: ${result.error}`);
    return { success: true, menu: result.data, message: 'Custom menu created successfully' };
  }

  private async updateCustomMenu(params: any): Promise<any> {
    const { customMenuId, ...body } = params;
    const result = await this.apiClient.updateCustomMenu(customMenuId, body);
    if (!result.success) throw new Error(`Failed to update custom menu: ${result.error}`);
    return { success: true, menu: result.data, message: 'Custom menu updated successfully' };
  }

  private async deleteCustomMenu(params: any): Promise<any> {
    const result = await this.apiClient.deleteCustomMenu(params.customMenuId);
    if (!result.success) throw new Error(`Failed to delete custom menu: ${result.error}`);
    return { success: true, data: result.data, message: 'Custom menu deleted successfully' };
  }
}

export function isCustomMenusTool(toolName: string): boolean {
  return ['ghl_list_custom_menus', 'ghl_get_custom_menu', 'ghl_create_custom_menu', 'ghl_update_custom_menu', 'ghl_delete_custom_menu'].includes(toolName);
}

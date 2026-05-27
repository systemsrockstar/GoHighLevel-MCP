import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class UsersTools {
  constructor(private apiClient: GHLApiClient) {}

  getTools(): Tool[] {
    return [
      {
        name: 'ghl_get_users_by_location',
        description: 'Get all users assigned to a specific location/sub-account.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' }
          }
        }
      },
      {
        name: 'ghl_search_users',
        description: 'Search users across the agency. Filter by role, type, location, or query string.',
        inputSchema: {
          type: 'object',
          properties: {
            companyId: { type: 'string', description: 'Agency/company ID' },
            locationId: { type: 'string', description: 'Filter by location ID' },
            query: { type: 'string', description: 'Search by name or email' },
            type: { type: 'string', description: 'User type: "account" or "agency"' },
            role: { type: 'string', description: 'Role filter: "admin" or "user"' },
            skip: { type: 'number', description: 'Records to skip', default: 0 },
            limit: { type: 'number', description: 'Max records', default: 25 },
            sort: { type: 'string', description: 'Sort field' },
            sortDirection: { type: 'string', description: '"asc" or "desc"' }
          }
        }
      },
      {
        name: 'ghl_filter_users_by_email',
        description: 'Find a user by their email address.',
        inputSchema: {
          type: 'object',
          properties: {
            email: { type: 'string', description: 'Email address to look up' }
          },
          required: ['email']
        }
      },
      {
        name: 'ghl_get_user',
        description: 'Get a specific user by their user ID.',
        inputSchema: {
          type: 'object',
          properties: {
            userId: { type: 'string', description: 'User ID to retrieve' }
          },
          required: ['userId']
        }
      },
      {
        name: 'ghl_create_user',
        description: 'Create a new user in the agency. Requires agency-level access. The user is added to the specified locations.',
        inputSchema: {
          type: 'object',
          properties: {
            companyId: { type: 'string', description: 'Agency/company ID' },
            firstName: { type: 'string', description: 'First name' },
            lastName: { type: 'string', description: 'Last name' },
            email: { type: 'string', description: 'Email address (used as login)' },
            password: { type: 'string', description: 'Initial password' },
            type: { type: 'string', description: '"account" for sub-account user, "agency" for agency user' },
            role: { type: 'string', description: '"admin" or "user"' },
            locationIds: { type: 'array', items: { type: 'string' }, description: 'Location IDs to assign the user to' },
            phone: { type: 'string', description: 'Phone number' },
            platformLanguage: { type: 'string', description: 'Platform language preference' }
          },
          required: ['companyId', 'firstName', 'lastName', 'email', 'password', 'type', 'role', 'locationIds']
        }
      },
      {
        name: 'ghl_update_user',
        description: 'Update an existing user\'s details, role, or location assignments.',
        inputSchema: {
          type: 'object',
          properties: {
            userId: { type: 'string', description: 'User ID to update' },
            firstName: { type: 'string', description: 'First name' },
            lastName: { type: 'string', description: 'Last name' },
            phone: { type: 'string', description: 'Phone number' },
            type: { type: 'string', description: '"account" or "agency"' },
            role: { type: 'string', description: '"admin" or "user"' },
            locationIds: { type: 'array', items: { type: 'string' }, description: 'Location IDs to assign the user to' },
            password: { type: 'string', description: 'New password' },
            platformLanguage: { type: 'string', description: 'Platform language preference' }
          },
          required: ['userId']
        }
      },
      {
        name: 'ghl_delete_user',
        description: 'Delete a user from the agency.',
        inputSchema: {
          type: 'object',
          properties: {
            userId: { type: 'string', description: 'User ID to delete' }
          },
          required: ['userId']
        }
      }
    ];
  }

  async executeUsersTool(name: string, params: any): Promise<any> {
    switch (name) {
      case 'ghl_get_users_by_location':
        return await this.getUsersByLocation(params);
      case 'ghl_search_users':
        return await this.searchUsers(params);
      case 'ghl_filter_users_by_email':
        return await this.filterUsersByEmail(params);
      case 'ghl_get_user':
        return await this.getUser(params);
      case 'ghl_create_user':
        return await this.createUser(params);
      case 'ghl_update_user':
        return await this.updateUser(params);
      case 'ghl_delete_user':
        return await this.deleteUser(params);
      default:
        throw new Error(`Unknown users tool: ${name}`);
    }
  }

  private async getUsersByLocation(params: any): Promise<any> {
    const result = await this.apiClient.getUsersByLocation(params);
    if (!result.success) throw new Error(`Failed to get users by location: ${result.error}`);
    const users = (result.data as any)?.users || result.data || [];
    return { success: true, users, message: `Retrieved ${Array.isArray(users) ? users.length : 0} user(s)` };
  }

  private async searchUsers(params: any): Promise<any> {
    const result = await this.apiClient.searchUsers(params);
    if (!result.success) throw new Error(`Failed to search users: ${result.error}`);
    const users = (result.data as any)?.users || result.data || [];
    const count = (result.data as any)?.count;
    return { success: true, users, ...(count !== undefined && { count }), message: `Found ${Array.isArray(users) ? users.length : 0} user(s)` };
  }

  private async filterUsersByEmail(params: any): Promise<any> {
    const result = await this.apiClient.filterUsersByEmail(params);
    if (!result.success) throw new Error(`Failed to filter users by email: ${result.error}`);
    return { success: true, data: result.data };
  }

  private async getUser(params: any): Promise<any> {
    const result = await this.apiClient.getUser(params.userId);
    if (!result.success) throw new Error(`Failed to get user: ${result.error}`);
    return { success: true, user: result.data };
  }

  private async createUser(params: any): Promise<any> {
    const result = await this.apiClient.createUser(params);
    if (!result.success) throw new Error(`Failed to create user: ${result.error}`);
    return { success: true, user: result.data, message: 'User created successfully' };
  }

  private async updateUser(params: any): Promise<any> {
    const { userId, ...body } = params;
    const result = await this.apiClient.updateUser(userId, body);
    if (!result.success) throw new Error(`Failed to update user: ${result.error}`);
    return { success: true, user: result.data, message: 'User updated successfully' };
  }

  private async deleteUser(params: any): Promise<any> {
    const result = await this.apiClient.deleteUser(params.userId);
    if (!result.success) throw new Error(`Failed to delete user: ${result.error}`);
    return { success: true, data: result.data, message: 'User deleted successfully' };
  }
}

export function isUsersTool(toolName: string): boolean {
  return [
    'ghl_get_users_by_location', 'ghl_search_users', 'ghl_filter_users_by_email',
    'ghl_get_user', 'ghl_create_user', 'ghl_update_user', 'ghl_delete_user'
  ].includes(toolName);
}

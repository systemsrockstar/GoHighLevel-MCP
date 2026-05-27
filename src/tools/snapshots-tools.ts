import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class SnapshotsTools {
  constructor(private apiClient: GHLApiClient) {}

  getTools(): Tool[] {
    return [
      {
        name: 'ghl_list_snapshots',
        description: 'List all snapshots available in the agency.',
        inputSchema: {
          type: 'object',
          properties: {
            companyId: { type: 'string', description: 'Agency/company ID' }
          }
        }
      },
      {
        name: 'ghl_create_snapshot_share_link',
        description: 'Create a shareable link for a snapshot so it can be installed into a sub-account.',
        inputSchema: {
          type: 'object',
          properties: {
            snapshotId: { type: 'string', description: 'Snapshot ID to share' },
            companyId: { type: 'string', description: 'Agency/company ID' },
            shareType: { type: 'string', description: 'Share type (e.g. "permanent" or "link")' }
          },
          required: ['snapshotId']
        }
      },
      {
        name: 'ghl_get_snapshot_push_status',
        description: 'Get the push history for a snapshot between two dates.',
        inputSchema: {
          type: 'object',
          properties: {
            snapshotId: { type: 'string', description: 'Snapshot ID' },
            from: { type: 'string', description: 'Start date (ISO format)' },
            to: { type: 'string', description: 'End date (ISO format)' },
            companyId: { type: 'string', description: 'Agency/company ID' }
          },
          required: ['snapshotId']
        }
      },
      {
        name: 'ghl_get_last_snapshot_push',
        description: 'Get the most recent snapshot push for a specific location.',
        inputSchema: {
          type: 'object',
          properties: {
            snapshotId: { type: 'string', description: 'Snapshot ID' },
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            companyId: { type: 'string', description: 'Agency/company ID' }
          },
          required: ['snapshotId']
        }
      }
    ];
  }

  async executeSnapshotsTool(name: string, params: any): Promise<any> {
    switch (name) {
      case 'ghl_list_snapshots': return await this.listSnapshots(params);
      case 'ghl_create_snapshot_share_link': return await this.createShareLink(params);
      case 'ghl_get_snapshot_push_status': return await this.getPushStatus(params);
      case 'ghl_get_last_snapshot_push': return await this.getLastPush(params);
      default: throw new Error(`Unknown snapshots tool: ${name}`);
    }
  }

  private async listSnapshots(params: any): Promise<any> {
    const result = await this.apiClient.listSnapshots(params);
    if (!result.success) throw new Error(`Failed to list snapshots: ${result.error}`);
    const snapshots = (result.data as any)?.snapshots || result.data || [];
    return { success: true, snapshots, message: `Retrieved ${Array.isArray(snapshots) ? snapshots.length : 0} snapshot(s)` };
  }

  private async createShareLink(params: any): Promise<any> {
    const result = await this.apiClient.createSnapshotShareLink(params);
    if (!result.success) throw new Error(`Failed to create share link: ${result.error}`);
    return { success: true, data: result.data, message: 'Snapshot share link created' };
  }

  private async getPushStatus(params: any): Promise<any> {
    const result = await this.apiClient.getSnapshotPushStatus(params);
    if (!result.success) throw new Error(`Failed to get push status: ${result.error}`);
    return { success: true, data: result.data };
  }

  private async getLastPush(params: any): Promise<any> {
    const result = await this.apiClient.getLastSnapshotPush(params);
    if (!result.success) throw new Error(`Failed to get last push: ${result.error}`);
    return { success: true, data: result.data };
  }
}

export function isSnapshotsTool(toolName: string): boolean {
  return ['ghl_list_snapshots', 'ghl_create_snapshot_share_link', 'ghl_get_snapshot_push_status', 'ghl_get_last_snapshot_push'].includes(toolName);
}

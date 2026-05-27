import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class AdManagerTools {
  constructor(private apiClient: GHLApiClient) {}

  getTools(): Tool[] {
    return [
      // Entity retrieval
      {
        name: 'ghl_ad_get_entities',
        description: 'Retrieve Facebook campaigns, ad sets, or ads for a location',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            entityType: {
              type: 'string',
              enum: ['campaign', 'adset', 'ad'],
              description: 'Type of entity to retrieve'
            }
          }
        }
      },

      // Campaign management
      {
        name: 'ghl_ad_upsert_campaign',
        description: 'Create or update a Facebook ad campaign',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID' },
            name: { type: 'string', description: 'Campaign name' },
            objective: { type: 'string', description: 'Campaign objective' },
            status: { type: 'string', enum: ['ACTIVE', 'PAUSED'], description: 'Campaign status' },
            campaignId: { type: 'string', description: 'Campaign ID for updates (omit for create)' }
          },
          required: ['name']
        }
      },
      {
        name: 'ghl_ad_get_campaign',
        description: 'Get a Facebook campaign with its linked ad sets and ads',
        inputSchema: {
          type: 'object',
          properties: {
            campaignId: { type: 'string', description: 'Campaign ID' },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['campaignId']
        }
      },
      {
        name: 'ghl_ad_pause_campaign',
        description: 'Pause a running Facebook campaign',
        inputSchema: {
          type: 'object',
          properties: {
            campaignId: { type: 'string', description: 'Campaign ID to pause' },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['campaignId']
        }
      },
      {
        name: 'ghl_ad_resume_campaign',
        description: 'Resume a paused Facebook campaign',
        inputSchema: {
          type: 'object',
          properties: {
            campaignId: { type: 'string', description: 'Campaign ID to resume' },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['campaignId']
        }
      },
      {
        name: 'ghl_ad_duplicate_campaign',
        description: 'Duplicate an existing Facebook campaign',
        inputSchema: {
          type: 'object',
          properties: {
            campaignId: { type: 'string', description: 'Campaign ID to duplicate' },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['campaignId']
        }
      },
      {
        name: 'ghl_ad_delete_campaign',
        description: 'Delete a Facebook campaign by ID',
        inputSchema: {
          type: 'object',
          properties: {
            campaignId: { type: 'string', description: 'Campaign ID to delete' },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['campaignId']
        }
      },

      // Ad set management
      {
        name: 'ghl_ad_upsert_adset',
        description: 'Create or update a Facebook ad set',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID' },
            name: { type: 'string', description: 'Ad set name' },
            campaignId: { type: 'string', description: 'Parent campaign ID' },
            adSetId: { type: 'string', description: 'Ad set ID for updates (omit for create)' },
            dailyBudget: { type: 'number', description: 'Daily budget in cents' },
            targeting: { type: 'object', description: 'Targeting specification' }
          },
          required: ['name', 'campaignId']
        }
      },
      {
        name: 'ghl_ad_pause_adset',
        description: 'Pause a running Facebook ad set',
        inputSchema: {
          type: 'object',
          properties: {
            adSetId: { type: 'string', description: 'Ad set ID to pause' },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['adSetId']
        }
      },
      {
        name: 'ghl_ad_resume_adset',
        description: 'Resume a paused Facebook ad set',
        inputSchema: {
          type: 'object',
          properties: {
            adSetId: { type: 'string', description: 'Ad set ID to resume' },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['adSetId']
        }
      },
      {
        name: 'ghl_ad_duplicate_adset',
        description: 'Duplicate an existing Facebook ad set',
        inputSchema: {
          type: 'object',
          properties: {
            adSetId: { type: 'string', description: 'Ad set ID to duplicate' },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['adSetId']
        }
      },
      {
        name: 'ghl_ad_delete_adset',
        description: 'Delete a Facebook ad set by ID',
        inputSchema: {
          type: 'object',
          properties: {
            adSetId: { type: 'string', description: 'Ad set ID to delete' },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['adSetId']
        }
      },

      // Ad management
      {
        name: 'ghl_ad_upsert_ad',
        description: 'Create or update a Facebook ad',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID' },
            name: { type: 'string', description: 'Ad name' },
            adSetId: { type: 'string', description: 'Parent ad set ID' },
            adId: { type: 'string', description: 'Ad ID for updates (omit for create)' },
            creative: { type: 'object', description: 'Ad creative specification' }
          },
          required: ['name', 'adSetId']
        }
      },
      {
        name: 'ghl_ad_pause_ad',
        description: 'Pause a running Facebook ad',
        inputSchema: {
          type: 'object',
          properties: {
            adId: { type: 'string', description: 'Ad ID to pause' },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['adId']
        }
      },
      {
        name: 'ghl_ad_resume_ad',
        description: 'Resume a paused Facebook ad',
        inputSchema: {
          type: 'object',
          properties: {
            adId: { type: 'string', description: 'Ad ID to resume' },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['adId']
        }
      },
      {
        name: 'ghl_ad_duplicate_ad',
        description: 'Duplicate an existing Facebook ad',
        inputSchema: {
          type: 'object',
          properties: {
            adId: { type: 'string', description: 'Ad ID to duplicate' },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['adId']
        }
      },
      {
        name: 'ghl_ad_delete_ad',
        description: 'Delete a Facebook ad by ID',
        inputSchema: {
          type: 'object',
          properties: {
            adId: { type: 'string', description: 'Ad ID to delete' },
            locationId: { type: 'string', description: 'Location ID' }
          },
          required: ['adId']
        }
      },

      // Pixels
      {
        name: 'ghl_ad_get_pixels',
        description: 'Retrieve Facebook conversion pixels for a location',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID' }
          }
        }
      },
      {
        name: 'ghl_ad_upsert_pixel',
        description: 'Create or update a Facebook conversion pixel',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID' },
            pixelId: { type: 'string', description: 'Facebook Pixel ID' },
            name: { type: 'string', description: 'Pixel name' }
          },
          required: ['pixelId']
        }
      },

      // Audiences
      {
        name: 'ghl_ad_get_audiences',
        description: 'Retrieve Facebook custom audiences for a location',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID' }
          }
        }
      },

      // Targeting
      {
        name: 'ghl_ad_search_targeting',
        description: 'Search Facebook geo-locations and interests for ad targeting',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID' },
            query: { type: 'string', description: 'Search query for targeting options' },
            type: {
              type: 'string',
              enum: ['geolocation', 'interest'],
              description: 'Type of targeting option to search'
            }
          },
          required: ['query']
        }
      },

      // Reporting
      {
        name: 'ghl_ad_get_reporting',
        description: 'Retrieve aggregated Facebook ad reporting metrics for a location',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID' },
            startDate: { type: 'string', description: 'Start date (ISO format)' },
            endDate: { type: 'string', description: 'End date (ISO format)' }
          }
        }
      },
      {
        name: 'ghl_ad_get_campaign_reporting',
        description: 'Retrieve reporting metrics for a specific Facebook campaign',
        inputSchema: {
          type: 'object',
          properties: {
            campaignId: { type: 'string', description: 'Campaign ID' },
            locationId: { type: 'string', description: 'Location ID' },
            startDate: { type: 'string', description: 'Start date (ISO format)' },
            endDate: { type: 'string', description: 'End date (ISO format)' }
          },
          required: ['campaignId']
        }
      },
      {
        name: 'ghl_ad_get_reporting_list',
        description: 'Retrieve a list of Facebook campaigns, ad sets, or ads with reporting data',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID' },
            entityType: {
              type: 'string',
              enum: ['campaign', 'adset', 'ad'],
              description: 'Entity type to list with reporting data'
            },
            startDate: { type: 'string', description: 'Start date (ISO format)' },
            endDate: { type: 'string', description: 'End date (ISO format)' }
          }
        }
      }
    ];
  }

  async executeAdManagerTool(name: string, params: any): Promise<any> {
    switch (name) {
      case 'ghl_ad_get_entities':
        return await this.getEntities(params);
      case 'ghl_ad_upsert_campaign':
        return await this.upsertCampaign(params);
      case 'ghl_ad_get_campaign':
        return await this.getCampaign(params);
      case 'ghl_ad_pause_campaign':
        return await this.pauseCampaign(params);
      case 'ghl_ad_resume_campaign':
        return await this.resumeCampaign(params);
      case 'ghl_ad_duplicate_campaign':
        return await this.duplicateCampaign(params);
      case 'ghl_ad_delete_campaign':
        return await this.deleteCampaign(params);
      case 'ghl_ad_upsert_adset':
        return await this.upsertAdSet(params);
      case 'ghl_ad_pause_adset':
        return await this.pauseAdSet(params);
      case 'ghl_ad_resume_adset':
        return await this.resumeAdSet(params);
      case 'ghl_ad_duplicate_adset':
        return await this.duplicateAdSet(params);
      case 'ghl_ad_delete_adset':
        return await this.deleteAdSet(params);
      case 'ghl_ad_upsert_ad':
        return await this.upsertAd(params);
      case 'ghl_ad_pause_ad':
        return await this.pauseAd(params);
      case 'ghl_ad_resume_ad':
        return await this.resumeAd(params);
      case 'ghl_ad_duplicate_ad':
        return await this.duplicateAd(params);
      case 'ghl_ad_delete_ad':
        return await this.deleteAd(params);
      case 'ghl_ad_get_pixels':
        return await this.getPixels(params);
      case 'ghl_ad_upsert_pixel':
        return await this.upsertPixel(params);
      case 'ghl_ad_get_audiences':
        return await this.getAudiences(params);
      case 'ghl_ad_search_targeting':
        return await this.searchTargeting(params);
      case 'ghl_ad_get_reporting':
        return await this.getReporting(params);
      case 'ghl_ad_get_campaign_reporting':
        return await this.getCampaignReporting(params);
      case 'ghl_ad_get_reporting_list':
        return await this.getReportingList(params);
      default:
        throw new Error(`Unknown ad manager tool: ${name}`);
    }
  }

  private async getEntities(params: any): Promise<any> {
    const result = await this.apiClient.adGetEntities(params);
    if (!result.success) throw new Error(`Failed to get entities: ${result}`);
    return { success: true, data: result.data, message: 'Entities retrieved successfully' };
  }

  private async upsertCampaign(params: any): Promise<any> {
    const result = await this.apiClient.adUpsertCampaign(params);
    if (!result.success) throw new Error(`Failed to upsert campaign: ${result}`);
    return { success: true, data: result.data, message: 'Campaign upserted successfully' };
  }

  private async getCampaign(params: any): Promise<any> {
    const result = await this.apiClient.adGetCampaign(params.campaignId, params);
    if (!result.success) throw new Error(`Failed to get campaign: ${result}`);
    return { success: true, data: result.data, message: `Campaign ${params.campaignId} retrieved` };
  }

  private async pauseCampaign(params: any): Promise<any> {
    const result = await this.apiClient.adPauseCampaign(params.campaignId, params);
    if (!result.success) throw new Error(`Failed to pause campaign: ${result}`);
    return { success: true, data: result.data, message: `Campaign ${params.campaignId} paused` };
  }

  private async resumeCampaign(params: any): Promise<any> {
    const result = await this.apiClient.adResumeCampaign(params.campaignId, params);
    if (!result.success) throw new Error(`Failed to resume campaign: ${result}`);
    return { success: true, data: result.data, message: `Campaign ${params.campaignId} resumed` };
  }

  private async duplicateCampaign(params: any): Promise<any> {
    const result = await this.apiClient.adDuplicateCampaign(params.campaignId, params);
    if (!result.success) throw new Error(`Failed to duplicate campaign: ${result}`);
    return { success: true, data: result.data, message: `Campaign ${params.campaignId} duplicated` };
  }

  private async deleteCampaign(params: any): Promise<any> {
    const result = await this.apiClient.adDeleteCampaign(params.campaignId, params);
    if (!result.success) throw new Error(`Failed to delete campaign: ${result}`);
    return { success: true, message: `Campaign ${params.campaignId} deleted` };
  }

  private async upsertAdSet(params: any): Promise<any> {
    const result = await this.apiClient.adUpsertAdSet(params);
    if (!result.success) throw new Error(`Failed to upsert ad set: ${result}`);
    return { success: true, data: result.data, message: 'Ad set upserted successfully' };
  }

  private async pauseAdSet(params: any): Promise<any> {
    const result = await this.apiClient.adPauseAdSet(params.adSetId, params);
    if (!result.success) throw new Error(`Failed to pause ad set: ${result}`);
    return { success: true, data: result.data, message: `Ad set ${params.adSetId} paused` };
  }

  private async resumeAdSet(params: any): Promise<any> {
    const result = await this.apiClient.adResumeAdSet(params.adSetId, params);
    if (!result.success) throw new Error(`Failed to resume ad set: ${result}`);
    return { success: true, data: result.data, message: `Ad set ${params.adSetId} resumed` };
  }

  private async duplicateAdSet(params: any): Promise<any> {
    const result = await this.apiClient.adDuplicateAdSet(params.adSetId, params);
    if (!result.success) throw new Error(`Failed to duplicate ad set: ${result}`);
    return { success: true, data: result.data, message: `Ad set ${params.adSetId} duplicated` };
  }

  private async deleteAdSet(params: any): Promise<any> {
    const result = await this.apiClient.adDeleteAdSet(params.adSetId, params);
    if (!result.success) throw new Error(`Failed to delete ad set: ${result}`);
    return { success: true, message: `Ad set ${params.adSetId} deleted` };
  }

  private async upsertAd(params: any): Promise<any> {
    const result = await this.apiClient.adUpsertAd(params);
    if (!result.success) throw new Error(`Failed to upsert ad: ${result}`);
    return { success: true, data: result.data, message: 'Ad upserted successfully' };
  }

  private async pauseAd(params: any): Promise<any> {
    const result = await this.apiClient.adPauseAd(params.adId, params);
    if (!result.success) throw new Error(`Failed to pause ad: ${result}`);
    return { success: true, data: result.data, message: `Ad ${params.adId} paused` };
  }

  private async resumeAd(params: any): Promise<any> {
    const result = await this.apiClient.adResumeAd(params.adId, params);
    if (!result.success) throw new Error(`Failed to resume ad: ${result}`);
    return { success: true, data: result.data, message: `Ad ${params.adId} resumed` };
  }

  private async duplicateAd(params: any): Promise<any> {
    const result = await this.apiClient.adDuplicateAd(params.adId, params);
    if (!result.success) throw new Error(`Failed to duplicate ad: ${result}`);
    return { success: true, data: result.data, message: `Ad ${params.adId} duplicated` };
  }

  private async deleteAd(params: any): Promise<any> {
    const result = await this.apiClient.adDeleteAd(params.adId, params);
    if (!result.success) throw new Error(`Failed to delete ad: ${result}`);
    return { success: true, message: `Ad ${params.adId} deleted` };
  }

  private async getPixels(params: any): Promise<any> {
    const result = await this.apiClient.adGetPixels(params);
    if (!result.success) throw new Error(`Failed to get pixels: ${result}`);
    return { success: true, data: result.data, message: 'Pixels retrieved successfully' };
  }

  private async upsertPixel(params: any): Promise<any> {
    const result = await this.apiClient.adUpsertPixel(params);
    if (!result.success) throw new Error(`Failed to upsert pixel: ${result}`);
    return { success: true, data: result.data, message: 'Pixel upserted successfully' };
  }

  private async getAudiences(params: any): Promise<any> {
    const result = await this.apiClient.adGetAudiences(params);
    if (!result.success) throw new Error(`Failed to get audiences: ${result}`);
    return { success: true, data: result.data, message: 'Custom audiences retrieved successfully' };
  }

  private async searchTargeting(params: any): Promise<any> {
    const result = await this.apiClient.adSearchTargeting(params);
    if (!result.success) throw new Error(`Failed to search targeting: ${result}`);
    return { success: true, data: result.data, message: 'Targeting options retrieved successfully' };
  }

  private async getReporting(params: any): Promise<any> {
    const result = await this.apiClient.adGetReporting(params);
    if (!result.success) throw new Error(`Failed to get reporting: ${result}`);
    return { success: true, data: result.data, message: 'Reporting data retrieved successfully' };
  }

  private async getCampaignReporting(params: any): Promise<any> {
    const result = await this.apiClient.adGetCampaignReporting(params.campaignId, params);
    if (!result.success) throw new Error(`Failed to get campaign reporting: ${result}`);
    return { success: true, data: result.data, message: `Campaign ${params.campaignId} reporting retrieved` };
  }

  private async getReportingList(params: any): Promise<any> {
    const result = await this.apiClient.adGetReportingList(params);
    if (!result.success) throw new Error(`Failed to get reporting list: ${result}`);
    return { success: true, data: result.data, message: 'Reporting list retrieved successfully' };
  }
}

export function isAdManagerTool(toolName: string): boolean {
  const names = [
    'ghl_ad_get_entities',
    'ghl_ad_upsert_campaign', 'ghl_ad_get_campaign', 'ghl_ad_pause_campaign',
    'ghl_ad_resume_campaign', 'ghl_ad_duplicate_campaign', 'ghl_ad_delete_campaign',
    'ghl_ad_upsert_adset', 'ghl_ad_pause_adset', 'ghl_ad_resume_adset',
    'ghl_ad_duplicate_adset', 'ghl_ad_delete_adset',
    'ghl_ad_upsert_ad', 'ghl_ad_pause_ad', 'ghl_ad_resume_ad',
    'ghl_ad_duplicate_ad', 'ghl_ad_delete_ad',
    'ghl_ad_get_pixels', 'ghl_ad_upsert_pixel',
    'ghl_ad_get_audiences',
    'ghl_ad_search_targeting',
    'ghl_ad_get_reporting', 'ghl_ad_get_campaign_reporting', 'ghl_ad_get_reporting_list'
  ];
  return names.includes(toolName);
}

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class SaasTools {
  constructor(private apiClient: GHLApiClient) {}

  getTools(): Tool[] {
    return [
      {
        name: 'ghl_get_saas_locations',
        description: 'Get all SaaS-enabled sub-accounts for a company.',
        inputSchema: {
          type: 'object',
          properties: {
            companyId: { type: 'string', description: 'Agency/company ID' }
          },
          required: ['companyId']
        }
      },
      {
        name: 'ghl_get_saas_subscription',
        description: 'Get SaaS subscription details for a specific location.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location/sub-account ID' }
          },
          required: ['locationId']
        }
      },
      {
        name: 'ghl_update_saas_subscription',
        description: 'Update the SaaS subscription plan for a location.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location/sub-account ID' },
            planId: { type: 'string', description: 'New plan ID to assign' },
            customerId: { type: 'string', description: 'Stripe customer ID (optional)' }
          },
          required: ['locationId', 'planId']
        }
      },
      {
        name: 'ghl_enable_saas',
        description: 'Enable SaaS mode for a sub-account.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location/sub-account ID to enable SaaS on' },
            stripeCustomerId: { type: 'string', description: 'Stripe customer ID' },
            planId: { type: 'string', description: 'Plan ID to assign' }
          },
          required: ['locationId']
        }
      },
      {
        name: 'ghl_bulk_enable_saas',
        description: 'Bulk enable SaaS mode for multiple sub-accounts under a company.',
        inputSchema: {
          type: 'object',
          properties: {
            companyId: { type: 'string', description: 'Agency/company ID' },
            locationIds: { type: 'array', items: { type: 'string' }, description: 'Array of location IDs to enable' }
          },
          required: ['companyId', 'locationIds']
        }
      },
      {
        name: 'ghl_bulk_disable_saas',
        description: 'Bulk disable SaaS mode for multiple sub-accounts under a company.',
        inputSchema: {
          type: 'object',
          properties: {
            companyId: { type: 'string', description: 'Agency/company ID' },
            locationIds: { type: 'array', items: { type: 'string' }, description: 'Array of location IDs to disable' }
          },
          required: ['companyId', 'locationIds']
        }
      },
      {
        name: 'ghl_pause_location',
        description: 'Pause a sub-account (suspends access without deleting).',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location/sub-account ID to pause' },
            paused: { type: 'boolean', description: 'true to pause, false to unpause' }
          },
          required: ['locationId', 'paused']
        }
      },
      {
        name: 'ghl_update_rebilling',
        description: 'Update rebilling configuration for all locations under a company.',
        inputSchema: {
          type: 'object',
          properties: {
            companyId: { type: 'string', description: 'Agency/company ID' },
            product: { type: 'string', description: 'Product to configure rebilling for (e.g. "phone", "email", "ai")' },
            markupPercentage: { type: 'number', description: 'Markup percentage to apply' }
          },
          required: ['companyId', 'product']
        }
      },
      {
        name: 'ghl_get_agency_plans',
        description: 'Get all SaaS plans configured for an agency.',
        inputSchema: {
          type: 'object',
          properties: {
            companyId: { type: 'string', description: 'Agency/company ID' }
          },
          required: ['companyId']
        }
      },
      {
        name: 'ghl_get_saas_plan',
        description: 'Get details of a specific SaaS plan by plan ID.',
        inputSchema: {
          type: 'object',
          properties: {
            planId: { type: 'string', description: 'SaaS plan ID' }
          },
          required: ['planId']
        }
      },
      {
        name: 'ghl_get_locations_by_stripe_id',
        description: 'Get locations associated with a Stripe customer ID.',
        inputSchema: {
          type: 'object',
          properties: {
            companyId: { type: 'string', description: 'Agency/company ID' },
            stripeId: { type: 'string', description: 'Stripe customer or subscription ID' }
          },
          required: ['companyId', 'stripeId']
        }
      }
    ];
  }

  async executeSaasTool(name: string, params: any): Promise<any> {
    switch (name) {
      case 'ghl_get_saas_locations': return await this.getSaasLocations(params);
      case 'ghl_get_saas_subscription': return await this.getSaasSubscription(params);
      case 'ghl_update_saas_subscription': return await this.updateSaasSubscription(params);
      case 'ghl_enable_saas': return await this.enableSaas(params);
      case 'ghl_bulk_enable_saas': return await this.bulkEnableSaas(params);
      case 'ghl_bulk_disable_saas': return await this.bulkDisableSaas(params);
      case 'ghl_pause_location': return await this.pauseLocation(params);
      case 'ghl_update_rebilling': return await this.updateRebilling(params);
      case 'ghl_get_agency_plans': return await this.getAgencyPlans(params);
      case 'ghl_get_saas_plan': return await this.getSaasPlan(params);
      case 'ghl_get_locations_by_stripe_id': return await this.getLocationsByStripeId(params);
      default: throw new Error(`Unknown SaaS tool: ${name}`);
    }
  }

  private async getSaasLocations(params: any): Promise<any> {
    const result = await this.apiClient.getSaasLocations(params.companyId);
    if (!result.success) throw new Error(`Failed to get SaaS locations: ${result.error}`);
    const locations = (result.data as any)?.locations || result.data || [];
    return { success: true, locations, message: `Retrieved ${Array.isArray(locations) ? locations.length : 0} SaaS location(s)` };
  }

  private async getSaasSubscription(params: any): Promise<any> {
    const result = await this.apiClient.getSaasSubscription(params.locationId);
    if (!result.success) throw new Error(`Failed to get SaaS subscription: ${result.error}`);
    return { success: true, subscription: result.data };
  }

  private async updateSaasSubscription(params: any): Promise<any> {
    const result = await this.apiClient.updateSaasSubscription(params.locationId, params);
    if (!result.success) throw new Error(`Failed to update SaaS subscription: ${result.error}`);
    return { success: true, data: result.data, message: 'SaaS subscription updated successfully' };
  }

  private async enableSaas(params: any): Promise<any> {
    const result = await this.apiClient.enableSaas(params.locationId, params);
    if (!result.success) throw new Error(`Failed to enable SaaS: ${result.error}`);
    return { success: true, data: result.data, message: 'SaaS enabled for location successfully' };
  }

  private async bulkEnableSaas(params: any): Promise<any> {
    const result = await this.apiClient.bulkEnableSaas(params.companyId, params.locationIds);
    if (!result.success) throw new Error(`Failed to bulk enable SaaS: ${result.error}`);
    return { success: true, data: result.data, message: 'SaaS bulk enabled successfully' };
  }

  private async bulkDisableSaas(params: any): Promise<any> {
    const result = await this.apiClient.bulkDisableSaas(params.companyId, params.locationIds);
    if (!result.success) throw new Error(`Failed to bulk disable SaaS: ${result.error}`);
    return { success: true, data: result.data, message: 'SaaS bulk disabled successfully' };
  }

  private async pauseLocation(params: any): Promise<any> {
    const result = await this.apiClient.pauseLocation(params.locationId, params.paused);
    if (!result.success) throw new Error(`Failed to pause/unpause location: ${result.error}`);
    return { success: true, data: result.data, message: `Location ${params.paused ? 'paused' : 'unpaused'} successfully` };
  }

  private async updateRebilling(params: any): Promise<any> {
    const result = await this.apiClient.updateRebilling(params.companyId, params);
    if (!result.success) throw new Error(`Failed to update rebilling: ${result.error}`);
    return { success: true, data: result.data, message: 'Rebilling updated successfully' };
  }

  private async getAgencyPlans(params: any): Promise<any> {
    const result = await this.apiClient.getAgencyPlans(params.companyId);
    if (!result.success) throw new Error(`Failed to get agency plans: ${result.error}`);
    const plans = (result.data as any)?.plans || result.data || [];
    return { success: true, plans, message: `Retrieved ${Array.isArray(plans) ? plans.length : 0} plan(s)` };
  }

  private async getSaasPlan(params: any): Promise<any> {
    const result = await this.apiClient.getSaasPlan(params.planId);
    if (!result.success) throw new Error(`Failed to get SaaS plan: ${result.error}`);
    return { success: true, plan: result.data };
  }

  private async getLocationsByStripeId(params: any): Promise<any> {
    const result = await this.apiClient.getLocationsByStripeId(params.companyId, params.stripeId);
    if (!result.success) throw new Error(`Failed to get locations by Stripe ID: ${result.error}`);
    const locations = (result.data as any)?.locations || result.data || [];
    return { success: true, locations, message: `Retrieved ${Array.isArray(locations) ? locations.length : 0} location(s)` };
  }
}

export function isSaasTool(toolName: string): boolean {
  return [
    'ghl_get_saas_locations', 'ghl_get_saas_subscription', 'ghl_update_saas_subscription',
    'ghl_enable_saas', 'ghl_bulk_enable_saas', 'ghl_bulk_disable_saas',
    'ghl_pause_location', 'ghl_update_rebilling', 'ghl_get_agency_plans',
    'ghl_get_saas_plan', 'ghl_get_locations_by_stripe_id'
  ].includes(toolName);
}

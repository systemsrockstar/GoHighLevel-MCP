import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class FormsTools {
  constructor(private apiClient: GHLApiClient) {}

  getTools(): Tool[] {
    return [
      {
        name: 'ghl_get_forms',
        description: 'List all forms in the location. Returns form IDs, names, and types — use the form ID to pull submissions.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            type: { type: 'string', description: 'Filter by form type (e.g. "form", "survey")' },
            skip: { type: 'number', description: 'Records to skip for pagination', default: 0 },
            limit: { type: 'number', description: 'Max records to return', default: 20 }
          }
        }
      },
      {
        name: 'ghl_get_form_submissions',
        description: 'Retrieve form submissions for a location. Filter by form, date range, or search query. Useful for reading lead data without logging into GHL.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            formId: { type: 'string', description: 'Filter submissions to a specific form ID (leave blank to get all forms)' },
            q: { type: 'string', description: 'Search query to filter submissions by contact name or email' },
            startAt: { type: 'string', description: 'Start date filter (ISO format, e.g. 2026-05-01)' },
            endAt: { type: 'string', description: 'End date filter (ISO format, e.g. 2026-05-31)' },
            page: { type: 'number', description: 'Page number (1-based)', default: 1 },
            limit: { type: 'number', description: 'Submissions per page', default: 20 }
          }
        }
      }
    ];
  }

  async executeFormsTool(name: string, params: any): Promise<any> {
    switch (name) {
      case 'ghl_get_forms':
        return await this.getForms(params);
      case 'ghl_get_form_submissions':
        return await this.getFormSubmissions(params);
      default:
        throw new Error(`Unknown forms tool: ${name}`);
    }
  }

  private async getForms(params: any): Promise<any> {
    const result = await this.apiClient.getForms(params);
    if (!result.success) throw new Error(`Failed to get forms: ${result}`);
    const forms = (result.data as any)?.forms || result.data || [];
    return {
      success: true,
      forms,
      message: `Retrieved ${Array.isArray(forms) ? forms.length : 0} form(s)`
    };
  }

  private async getFormSubmissions(params: any): Promise<any> {
    const result = await this.apiClient.getFormSubmissions(params);
    if (!result.success) throw new Error(`Failed to get form submissions: ${result}`);
    const submissions = (result.data as any)?.submissions || (result.data as any)?.data || result.data || [];
    const total = (result.data as any)?.total;
    return {
      success: true,
      submissions,
      ...(total !== undefined && { total }),
      message: `Retrieved ${Array.isArray(submissions) ? submissions.length : 0} submission(s)${total !== undefined ? ` of ${total} total` : ''}`
    };
  }
}

export function isFormsTool(toolName: string): boolean {
  return ['ghl_get_forms', 'ghl_get_form_submissions'].includes(toolName);
}

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class ProposalsTools {
  constructor(private apiClient: GHLApiClient) {}

  getTools(): Tool[] {
    return [
      {
        name: 'ghl_list_proposal_documents',
        description: 'List proposals and documents in a location. Filter by status, payment status, or date range.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            status: { type: 'string', description: 'Filter by status (e.g. "sent", "viewed", "signed")' },
            paymentStatus: { type: 'string', description: 'Filter by payment status' },
            query: { type: 'string', description: 'Search by document name' },
            dateFrom: { type: 'string', description: 'Start date filter (ISO format)' },
            dateTo: { type: 'string', description: 'End date filter (ISO format)' },
            limit: { type: 'number', description: 'Max records', default: 20 },
            skip: { type: 'number', description: 'Records to skip', default: 0 }
          }
        }
      },
      {
        name: 'ghl_send_proposal_document',
        description: 'Send an existing proposal/document to a recipient.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            documentId: { type: 'string', description: 'Document ID to send' },
            sentBy: { type: 'string', description: 'User ID sending the document' },
            medium: { type: 'string', description: 'Delivery method (e.g. "email")' },
            documentName: { type: 'string', description: 'Name for the document' }
          },
          required: ['documentId', 'sentBy']
        }
      },
      {
        name: 'ghl_list_proposal_templates',
        description: 'List proposal/document templates in a location.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            name: { type: 'string', description: 'Filter by template name' },
            type: { type: 'string', description: 'Filter by template type' },
            dateFrom: { type: 'string', description: 'Start date filter' },
            dateTo: { type: 'string', description: 'End date filter' },
            limit: { type: 'number', description: 'Max records', default: 20 },
            skip: { type: 'number', description: 'Records to skip', default: 0 }
          }
        }
      },
      {
        name: 'ghl_send_proposal_template',
        description: 'Create and send a proposal from a template to a contact.',
        inputSchema: {
          type: 'object',
          properties: {
            templateId: { type: 'string', description: 'Template ID to use' },
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            contactId: { type: 'string', description: 'Contact ID to send to' },
            userId: { type: 'string', description: 'User ID sending the proposal' },
            opportunityId: { type: 'string', description: 'Opportunity ID to link (optional)' },
            sendDocument: { type: 'boolean', description: 'Whether to send immediately or just create' }
          },
          required: ['templateId', 'contactId', 'userId']
        }
      }
    ];
  }

  async executeProposalsTool(name: string, params: any): Promise<any> {
    switch (name) {
      case 'ghl_list_proposal_documents': return await this.listDocuments(params);
      case 'ghl_send_proposal_document': return await this.sendDocument(params);
      case 'ghl_list_proposal_templates': return await this.listTemplates(params);
      case 'ghl_send_proposal_template': return await this.sendTemplate(params);
      default: throw new Error(`Unknown proposals tool: ${name}`);
    }
  }

  private async listDocuments(params: any): Promise<any> {
    const result = await this.apiClient.listProposalDocuments(params);
    if (!result.success) throw new Error(`Failed to list documents: ${result.error}`);
    const docs = (result.data as any)?.documents || result.data || [];
    const total = (result.data as any)?.total;
    return { success: true, documents: docs, ...(total !== undefined && { total }), message: `Retrieved ${Array.isArray(docs) ? docs.length : 0} document(s)` };
  }

  private async sendDocument(params: any): Promise<any> {
    const result = await this.apiClient.sendProposalDocument(params);
    if (!result.success) throw new Error(`Failed to send document: ${result.error}`);
    return { success: true, data: result.data, message: 'Document sent successfully' };
  }

  private async listTemplates(params: any): Promise<any> {
    const result = await this.apiClient.listProposalTemplates(params);
    if (!result.success) throw new Error(`Failed to list templates: ${result.error}`);
    const templates = (result.data as any)?.data || result.data || [];
    const total = (result.data as any)?.total;
    return { success: true, templates, ...(total !== undefined && { total }), message: `Retrieved ${Array.isArray(templates) ? templates.length : 0} template(s)` };
  }

  private async sendTemplate(params: any): Promise<any> {
    const result = await this.apiClient.sendProposalTemplate(params);
    if (!result.success) throw new Error(`Failed to send template: ${result.error}`);
    return { success: true, data: result.data, message: 'Proposal sent from template successfully' };
  }
}

export function isProposalsTool(toolName: string): boolean {
  return ['ghl_list_proposal_documents', 'ghl_send_proposal_document', 'ghl_list_proposal_templates', 'ghl_send_proposal_template'].includes(toolName);
}

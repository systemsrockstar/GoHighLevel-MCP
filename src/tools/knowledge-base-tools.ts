import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

export class KnowledgeBaseTools {
  constructor(private apiClient: GHLApiClient) {}

  getTools(): Tool[] {
    return [
      // ── Knowledge Base CRUD ──────────────────────────────────────────────────
      {
        name: 'ghl_list_knowledge_bases',
        description: 'List all knowledge bases for a location. Knowledge bases power Conversation AI agents with structured information.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            query: { type: 'string', description: 'Search by name' },
            limit: { type: 'number', description: 'Max records per page', default: 20 },
            lastKnowledgeBaseId: { type: 'string', description: 'Cursor for next page (from previous response)' }
          }
        }
      },
      {
        name: 'ghl_get_knowledge_base',
        description: 'Get a specific knowledge base by ID including its content counts (FAQs, URLs, files, etc.).',
        inputSchema: {
          type: 'object',
          properties: {
            knowledgeBaseId: { type: 'string', description: 'Knowledge base ID' }
          },
          required: ['knowledgeBaseId']
        }
      },
      {
        name: 'ghl_create_knowledge_base',
        description: 'Create a new knowledge base for a location. Max 15 knowledge bases per location.',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Name of the knowledge base' },
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            description: { type: 'string', description: 'Description of the knowledge base' }
          },
          required: ['name']
        }
      },
      {
        name: 'ghl_update_knowledge_base',
        description: 'Update a knowledge base name or description.',
        inputSchema: {
          type: 'object',
          properties: {
            knowledgeBaseId: { type: 'string', description: 'Knowledge base ID to update' },
            name: { type: 'string', description: 'New name' },
            description: { type: 'string', description: 'New description' }
          },
          required: ['knowledgeBaseId']
        }
      },
      {
        name: 'ghl_delete_knowledge_base',
        description: 'Delete a knowledge base and all its content.',
        inputSchema: {
          type: 'object',
          properties: {
            knowledgeBaseId: { type: 'string', description: 'Knowledge base ID to delete' }
          },
          required: ['knowledgeBaseId']
        }
      },
      // ── FAQs ─────────────────────────────────────────────────────────────────
      {
        name: 'ghl_list_faqs',
        description: 'List all FAQs in a knowledge base.',
        inputSchema: {
          type: 'object',
          properties: {
            knowledgeBaseId: { type: 'string', description: 'Knowledge base ID' },
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            limit: { type: 'number', description: 'Max records per page', default: 20 },
            lastFaqId: { type: 'string', description: 'Cursor for next page' }
          },
          required: ['knowledgeBaseId']
        }
      },
      {
        name: 'ghl_create_faq',
        description: 'Add a new FAQ (question + answer) to a knowledge base.',
        inputSchema: {
          type: 'object',
          properties: {
            knowledgeBaseId: { type: 'string', description: 'Knowledge base ID to add the FAQ to' },
            question: { type: 'string', description: 'The FAQ question' },
            answer: { type: 'string', description: 'The FAQ answer' },
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' }
          },
          required: ['knowledgeBaseId', 'question', 'answer']
        }
      },
      {
        name: 'ghl_update_faq',
        description: 'Update an existing FAQ question or answer.',
        inputSchema: {
          type: 'object',
          properties: {
            faqId: { type: 'string', description: 'FAQ ID to update' },
            question: { type: 'string', description: 'Updated question' },
            answer: { type: 'string', description: 'Updated answer' }
          },
          required: ['faqId', 'question', 'answer']
        }
      },
      {
        name: 'ghl_delete_faq',
        description: 'Delete a FAQ from a knowledge base.',
        inputSchema: {
          type: 'object',
          properties: {
            faqId: { type: 'string', description: 'FAQ ID to delete' }
          },
          required: ['faqId']
        }
      },
      // ── Web Crawler ───────────────────────────────────────────────────────────
      {
        name: 'ghl_list_crawled_urls',
        description: 'List all URLs that have been crawled and ingested into a knowledge base.',
        inputSchema: {
          type: 'object',
          properties: {
            knowledgeBaseId: { type: 'string', description: 'Knowledge base ID' },
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            query: { type: 'string', description: 'Filter by URL or title' },
            page: { type: 'number', description: 'Page number', default: 1 },
            pageLength: { type: 'number', description: 'Records per page', default: 20 }
          },
          required: ['knowledgeBaseId']
        }
      },
      {
        name: 'ghl_start_website_crawl',
        description: 'Start crawling a website to discover pages for training the knowledge base. After crawling, use ghl_get_crawler_status to monitor progress, then ghl_train_crawled_urls to ingest the pages.',
        inputSchema: {
          type: 'object',
          properties: {
            knowledgeBaseId: { type: 'string', description: 'Knowledge base ID to train' },
            url: { type: 'string', description: 'Website URL to crawl (e.g. https://systemsninjas.com)' },
            option: { type: 'string', description: 'Crawl mode: "single" (one page only) or "full" (entire site)' },
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' }
          },
          required: ['knowledgeBaseId', 'url', 'option']
        }
      },
      {
        name: 'ghl_get_crawler_status',
        description: 'Check the status of an ongoing website crawl operation.',
        inputSchema: {
          type: 'object',
          properties: {
            knowledgeBaseId: { type: 'string', description: 'Knowledge base ID' },
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            operationId: { type: 'string', description: 'Operation ID from ghl_start_website_crawl' }
          },
          required: ['knowledgeBaseId']
        }
      },
      {
        name: 'ghl_train_crawled_urls',
        description: 'Train specific discovered URLs into the knowledge base. Call this after ghl_start_website_crawl completes and you have the URL IDs.',
        inputSchema: {
          type: 'object',
          properties: {
            knowledgeBaseId: { type: 'string', description: 'Knowledge base ID' },
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            urlIds: { type: 'array', items: { type: 'string' }, description: 'Array of discovered URL object IDs to train' },
            operationId: { type: 'string', description: 'Operation ID from ghl_start_website_crawl' }
          },
          required: ['knowledgeBaseId', 'urlIds', 'operationId']
        }
      },
      {
        name: 'ghl_delete_crawled_urls',
        description: 'Remove specific trained URLs from a knowledge base.',
        inputSchema: {
          type: 'object',
          properties: {
            knowledgeBaseId: { type: 'string', description: 'Knowledge base ID' },
            locationId: { type: 'string', description: 'Location ID (defaults to configured location)' },
            urlIds: { type: 'array', items: { type: 'string' }, description: 'Array of URL IDs to remove' }
          },
          required: ['knowledgeBaseId', 'urlIds']
        }
      }
    ];
  }

  async executeKnowledgeBaseTool(name: string, params: any): Promise<any> {
    switch (name) {
      case 'ghl_list_knowledge_bases': return await this.listKnowledgeBases(params);
      case 'ghl_get_knowledge_base': return await this.getKnowledgeBase(params);
      case 'ghl_create_knowledge_base': return await this.createKnowledgeBase(params);
      case 'ghl_update_knowledge_base': return await this.updateKnowledgeBase(params);
      case 'ghl_delete_knowledge_base': return await this.deleteKnowledgeBase(params);
      case 'ghl_list_faqs': return await this.listFaqs(params);
      case 'ghl_create_faq': return await this.createFaq(params);
      case 'ghl_update_faq': return await this.updateFaq(params);
      case 'ghl_delete_faq': return await this.deleteFaq(params);
      case 'ghl_list_crawled_urls': return await this.listCrawledUrls(params);
      case 'ghl_start_website_crawl': return await this.startWebsiteCrawl(params);
      case 'ghl_get_crawler_status': return await this.getCrawlerStatus(params);
      case 'ghl_train_crawled_urls': return await this.trainCrawledUrls(params);
      case 'ghl_delete_crawled_urls': return await this.deleteCrawledUrls(params);
      default: throw new Error(`Unknown knowledge base tool: ${name}`);
    }
  }

  private async listKnowledgeBases(params: any): Promise<any> {
    const result = await this.apiClient.listKnowledgeBases(params);
    if (!result.success) throw new Error(`Failed to list knowledge bases: ${result.error}`);
    const data = (result.data as any)?.data || result.data;
    const kbs = data?.knowledgeBases || data || [];
    return { success: true, knowledgeBases: kbs, hasMore: data?.hasMore, activeCount: data?.activeCount, message: `Retrieved ${Array.isArray(kbs) ? kbs.length : 0} knowledge base(s)` };
  }

  private async getKnowledgeBase(params: any): Promise<any> {
    const result = await this.apiClient.getKnowledgeBase(params.knowledgeBaseId);
    if (!result.success) throw new Error(`Failed to get knowledge base: ${result.error}`);
    return { success: true, knowledgeBase: (result.data as any)?.data || result.data };
  }

  private async createKnowledgeBase(params: any): Promise<any> {
    const result = await this.apiClient.createKnowledgeBase(params);
    if (!result.success) throw new Error(`Failed to create knowledge base: ${result.error}`);
    return { success: true, knowledgeBase: (result.data as any)?.data || result.data, message: 'Knowledge base created successfully' };
  }

  private async updateKnowledgeBase(params: any): Promise<any> {
    const { knowledgeBaseId, ...body } = params;
    const result = await this.apiClient.updateKnowledgeBase(knowledgeBaseId, body);
    if (!result.success) throw new Error(`Failed to update knowledge base: ${result.error}`);
    return { success: true, data: result.data, message: 'Knowledge base updated successfully' };
  }

  private async deleteKnowledgeBase(params: any): Promise<any> {
    const result = await this.apiClient.deleteKnowledgeBase(params.knowledgeBaseId);
    if (!result.success) throw new Error(`Failed to delete knowledge base: ${result.error}`);
    return { success: true, data: result.data, message: 'Knowledge base deleted successfully' };
  }

  private async listFaqs(params: any): Promise<any> {
    const result = await this.apiClient.listFaqs(params);
    if (!result.success) throw new Error(`Failed to list FAQs: ${result.error}`);
    const data = (result.data as any)?.data || result.data;
    const faqs = data?.faqs || data || [];
    return { success: true, faqs, message: `Retrieved ${Array.isArray(faqs) ? faqs.length : 0} FAQ(s)` };
  }

  private async createFaq(params: any): Promise<any> {
    const result = await this.apiClient.createFaq(params);
    if (!result.success) throw new Error(`Failed to create FAQ: ${result.error}`);
    return { success: true, faq: (result.data as any)?.faq || result.data, message: 'FAQ created successfully' };
  }

  private async updateFaq(params: any): Promise<any> {
    const { faqId, ...body } = params;
    const result = await this.apiClient.updateFaq(faqId, body);
    if (!result.success) throw new Error(`Failed to update FAQ: ${result.error}`);
    return { success: true, data: result.data, message: 'FAQ updated successfully' };
  }

  private async deleteFaq(params: any): Promise<any> {
    const result = await this.apiClient.deleteFaq(params.faqId);
    if (!result.success) throw new Error(`Failed to delete FAQ: ${result.error}`);
    return { success: true, data: result.data, message: 'FAQ deleted successfully' };
  }

  private async listCrawledUrls(params: any): Promise<any> {
    const result = await this.apiClient.listCrawledUrls(params);
    if (!result.success) throw new Error(`Failed to list crawled URLs: ${result.error}`);
    const urls = (result.data as any)?.urls || result.data || [];
    const count = (result.data as any)?.count;
    return { success: true, urls, ...(count !== undefined && { count }), message: `Retrieved ${Array.isArray(urls) ? urls.length : 0} URL(s)` };
  }

  private async startWebsiteCrawl(params: any): Promise<any> {
    const result = await this.apiClient.startWebsiteCrawl(params);
    if (!result.success) throw new Error(`Failed to start crawl: ${result.error}`);
    return { success: true, data: result.data, message: 'Website crawl started. Use ghl_get_crawler_status to monitor progress.' };
  }

  private async getCrawlerStatus(params: any): Promise<any> {
    const result = await this.apiClient.getCrawlerStatus(params);
    if (!result.success) throw new Error(`Failed to get crawler status: ${result.error}`);
    return { success: true, data: result.data };
  }

  private async trainCrawledUrls(params: any): Promise<any> {
    const result = await this.apiClient.trainCrawledUrls(params);
    if (!result.success) throw new Error(`Failed to train URLs: ${result.error}`);
    return { success: true, data: result.data, message: 'Training started for selected URLs.' };
  }

  private async deleteCrawledUrls(params: any): Promise<any> {
    const result = await this.apiClient.deleteCrawledUrls(params);
    if (!result.success) throw new Error(`Failed to delete crawled URLs: ${result.error}`);
    return { success: true, data: result.data, message: 'Crawled URLs deleted successfully.' };
  }
}

export function isKnowledgeBaseTool(toolName: string): boolean {
  return [
    'ghl_list_knowledge_bases', 'ghl_get_knowledge_base', 'ghl_create_knowledge_base',
    'ghl_update_knowledge_base', 'ghl_delete_knowledge_base',
    'ghl_list_faqs', 'ghl_create_faq', 'ghl_update_faq', 'ghl_delete_faq',
    'ghl_list_crawled_urls', 'ghl_start_website_crawl', 'ghl_get_crawler_status',
    'ghl_train_crawled_urls', 'ghl_delete_crawled_urls'
  ].includes(toolName);
}

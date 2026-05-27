import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';

import { ContactTools } from './contact-tools.js';
import { ConversationTools } from './conversation-tools.js';
import { BlogTools } from './blog-tools.js';
import { OpportunityTools } from './opportunity-tools.js';
import { CalendarTools } from './calendar-tools.js';
import { EmailTools } from './email-tools.js';
import { LocationTools } from './location-tools.js';
import { EmailISVTools } from './email-isv-tools.js';
import { SocialMediaTools } from './social-media-tools.js';
import { MediaTools } from './media-tools.js';
import { ObjectTools } from './object-tools.js';
import { AssociationTools } from './association-tools.js';
import { CustomFieldV2Tools } from './custom-field-v2-tools.js';
import { WorkflowTools } from './workflow-tools.js';
import { SurveyTools } from './survey-tools.js';
import { StoreTools } from './store-tools.js';
import { ProductsTools } from './products-tools.js';
import { PaymentsTools } from './payments-tools.js';
import { InvoicesTools } from './invoices-tools.js';
import { AdManagerTools, isAdManagerTool } from './ad-manager-tools.js';
import { AgentStudioTools, isAgentStudioTool } from './agent-studio-tools.js';
import { VoiceAITools, isVoiceAITool } from './voice-ai-tools.js';
import { ConversationAITools, isConversationAITool } from './conversation-ai-tools.js';
import { FormsTools, isFormsTool } from './forms-tools.js';
import { UsersTools, isUsersTool } from './users-tools.js';
import { BusinessesTools, isBusinessesTool } from './businesses-tools.js';
import { TriggerLinksTools, isTriggerLinksTool } from './trigger-links-tools.js';
import { FunnelsTools, isFunnelsTool } from './funnels-tools.js';
import { KnowledgeBaseTools, isKnowledgeBaseTool } from './knowledge-base-tools.js';
import { PhoneSystemTools, isPhoneSystemTool } from './phone-system-tools.js';
import { SnapshotsTools, isSnapshotsTool } from './snapshots-tools.js';
import { AffiliateManagerTools, isAffiliateManagerTool } from './affiliate-manager-tools.js';
import { CustomMenusTools, isCustomMenusTool } from './custom-menus-tools.js';
import { ProposalsTools, isProposalsTool } from './proposals-tools.js';
import { MiscTools, isMiscTool } from './misc-tools.js';
import { BrandBoardsTools, isBrandBoardsTool } from './brand-boards-tools.js';
import { SaasTools, isSaasTool } from './saas-tools.js';

// ── Tool name sets for legacy tools (those without module-level is*Tool exports) ──

const CONTACT_TOOLS = new Set([
  'create_contact', 'search_contacts', 'get_contact', 'update_contact',
  'add_contact_tags', 'remove_contact_tags', 'delete_contact',
  'get_contact_tasks', 'create_contact_task', 'get_contact_task', 'update_contact_task',
  'delete_contact_task', 'update_task_completion',
  'get_contact_notes', 'create_contact_note', 'get_contact_note', 'update_contact_note',
  'delete_contact_note',
  'upsert_contact', 'get_duplicate_contact', 'get_contacts_by_business', 'get_contact_appointments',
  'bulk_update_contact_tags', 'bulk_update_contact_business',
  'add_contact_followers', 'remove_contact_followers',
  'add_contact_to_campaign', 'remove_contact_from_campaign', 'remove_contact_from_all_campaigns',
  'add_contact_to_workflow', 'remove_contact_from_workflow',
]);

const CONVERSATION_TOOLS = new Set([
  'send_sms', 'send_email', 'search_conversations', 'get_conversation',
  'create_conversation', 'update_conversation', 'delete_conversation', 'get_recent_messages',
  'get_email_message', 'get_message', 'upload_message_attachments', 'update_message_status',
  'add_inbound_message', 'add_outbound_call',
  'get_message_recording', 'get_message_transcription', 'download_transcription',
  'cancel_scheduled_message', 'cancel_scheduled_email', 'live_chat_typing',
]);

const BLOG_TOOLS = new Set([
  'create_blog_post', 'update_blog_post', 'get_blog_posts', 'get_blog_sites',
  'get_blog_authors', 'get_blog_categories', 'check_url_slug',
]);

const OPPORTUNITY_TOOLS = new Set([
  'search_opportunities', 'get_pipelines', 'get_opportunity', 'create_opportunity',
  'update_opportunity_status', 'delete_opportunity', 'update_opportunity',
  'upsert_opportunity', 'add_opportunity_followers', 'remove_opportunity_followers',
]);

const CALENDAR_TOOLS = new Set([
  'get_calendar_groups', 'get_calendars', 'create_calendar', 'get_calendar', 'update_calendar',
  'delete_calendar', 'get_calendar_events', 'get_free_slots', 'create_appointment',
  'get_appointment', 'update_appointment', 'delete_appointment', 'create_block_slot', 'update_block_slot',
]);

const EMAIL_TOOLS = new Set([
  'get_email_campaigns', 'create_email_template', 'get_email_templates',
  'update_email_template', 'delete_email_template',
]);

const LOCATION_TOOLS = new Set([
  'search_locations', 'get_location', 'create_location', 'update_location', 'delete_location',
  'get_location_tags', 'create_location_tag', 'get_location_tag', 'update_location_tag', 'delete_location_tag',
  'search_location_tasks',
  'get_location_custom_fields', 'create_location_custom_field', 'get_location_custom_field',
  'update_location_custom_field', 'delete_location_custom_field',
  'get_location_custom_values', 'create_location_custom_value', 'get_location_custom_value',
  'update_location_custom_value', 'delete_location_custom_value',
  'get_location_templates', 'delete_location_template', 'get_timezones',
]);

const EMAIL_ISV_TOOLS = new Set(['verify_email']);

const SOCIAL_MEDIA_TOOLS = new Set([
  'search_social_posts', 'create_social_post', 'get_social_post', 'update_social_post',
  'delete_social_post', 'bulk_delete_social_posts',
  'get_social_accounts', 'delete_social_account',
  'upload_social_csv', 'get_csv_upload_status', 'set_csv_accounts',
  'get_social_categories', 'get_social_category', 'get_social_tags', 'get_social_tags_by_ids',
  'start_social_oauth', 'get_platform_accounts',
]);

const MEDIA_TOOLS = new Set(['get_media_files', 'upload_media_file', 'delete_media_file']);

const OBJECT_TOOLS = new Set([
  'get_all_objects', 'create_object_schema', 'get_object_schema', 'update_object_schema',
  'create_object_record', 'get_object_record', 'update_object_record', 'delete_object_record',
  'search_object_records',
]);

const ASSOCIATION_TOOLS = new Set([
  'ghl_get_all_associations', 'ghl_create_association', 'ghl_get_association_by_id',
  'ghl_update_association', 'ghl_delete_association', 'ghl_get_association_by_key',
  'ghl_get_association_by_object_key', 'ghl_create_relation', 'ghl_get_relations_by_record',
  'ghl_delete_relation',
]);

const CUSTOM_FIELD_V2_TOOLS = new Set([
  'ghl_get_custom_field_by_id', 'ghl_create_custom_field', 'ghl_update_custom_field',
  'ghl_delete_custom_field', 'ghl_get_custom_fields_by_object_key', 'ghl_create_custom_field_folder',
  'ghl_update_custom_field_folder', 'ghl_delete_custom_field_folder',
]);

const WORKFLOW_TOOLS = new Set(['ghl_get_workflows']);

const SURVEY_TOOLS = new Set(['ghl_get_surveys', 'ghl_get_survey_submissions']);

const STORE_TOOLS = new Set([
  'ghl_create_shipping_zone', 'ghl_list_shipping_zones', 'ghl_get_shipping_zone',
  'ghl_update_shipping_zone', 'ghl_delete_shipping_zone',
  'ghl_get_available_shipping_rates', 'ghl_create_shipping_rate', 'ghl_list_shipping_rates',
  'ghl_get_shipping_rate', 'ghl_update_shipping_rate', 'ghl_delete_shipping_rate',
  'ghl_create_shipping_carrier', 'ghl_list_shipping_carriers', 'ghl_get_shipping_carrier',
  'ghl_update_shipping_carrier', 'ghl_delete_shipping_carrier',
  'ghl_create_store_setting', 'ghl_get_store_setting',
]);

const PRODUCTS_TOOLS = new Set([
  'ghl_create_product', 'ghl_list_products', 'ghl_get_product', 'ghl_update_product',
  'ghl_delete_product', 'ghl_create_price', 'ghl_list_prices', 'ghl_list_inventory',
  'ghl_create_product_collection', 'ghl_list_product_collections',
]);

const PAYMENTS_TOOLS = new Set([
  'create_whitelabel_integration_provider', 'list_whitelabel_integration_providers',
  'list_orders', 'get_order_by_id', 'create_order_fulfillment', 'list_order_fulfillments',
  'list_transactions', 'get_transaction_by_id', 'list_subscriptions', 'get_subscription_by_id',
  'list_coupons', 'create_coupon', 'update_coupon', 'delete_coupon', 'get_coupon',
  'create_custom_provider_integration', 'delete_custom_provider_integration',
  'get_custom_provider_config', 'create_custom_provider_config', 'disconnect_custom_provider_config',
]);

const INVOICES_TOOLS = new Set([
  'create_invoice_template', 'list_invoice_templates', 'get_invoice_template', 'update_invoice_template', 'delete_invoice_template',
  'update_invoice_template_late_fees', 'update_invoice_template_payment_methods',
  'create_invoice_schedule', 'list_invoice_schedules', 'get_invoice_schedule', 'update_invoice_schedule', 'delete_invoice_schedule',
  'schedule_invoice_schedule', 'auto_payment_invoice_schedule', 'cancel_invoice_schedule',
  'create_invoice', 'list_invoices', 'get_invoice', 'update_invoice', 'delete_invoice', 'void_invoice', 'send_invoice',
  'record_invoice_payment', 'generate_invoice_number', 'text2pay_invoice', 'update_invoice_last_visited',
  'create_estimate', 'list_estimates', 'update_estimate', 'delete_estimate', 'send_estimate', 'create_invoice_from_estimate',
  'generate_estimate_number', 'update_estimate_last_visited',
  'list_estimate_templates', 'create_estimate_template', 'update_estimate_template', 'delete_estimate_template', 'preview_estimate_template',
]);

// ── ToolRegistry ─────────────────────────────────────────────────────────────

export class ToolRegistry {
  private contactTools: ContactTools;
  private conversationTools: ConversationTools;
  private blogTools: BlogTools;
  private opportunityTools: OpportunityTools;
  private calendarTools: CalendarTools;
  private emailTools: EmailTools;
  private locationTools: LocationTools;
  private emailISVTools: EmailISVTools;
  private socialMediaTools: SocialMediaTools;
  private mediaTools: MediaTools;
  private objectTools: ObjectTools;
  private associationTools: AssociationTools;
  private customFieldV2Tools: CustomFieldV2Tools;
  private workflowTools: WorkflowTools;
  private surveyTools: SurveyTools;
  private storeTools: StoreTools;
  private productsTools: ProductsTools;
  private paymentsTools: PaymentsTools;
  private invoicesTools: InvoicesTools;
  private adManagerTools: AdManagerTools;
  private agentStudioTools: AgentStudioTools;
  private voiceAITools: VoiceAITools;
  private conversationAITools: ConversationAITools;
  private formsTools: FormsTools;
  private usersTools: UsersTools;
  private businessesTools: BusinessesTools;
  private triggerLinksTools: TriggerLinksTools;
  private funnelsTools: FunnelsTools;
  private knowledgeBaseTools: KnowledgeBaseTools;
  private phoneSystemTools: PhoneSystemTools;
  private snapshotsTools: SnapshotsTools;
  private affiliateManagerTools: AffiliateManagerTools;
  private customMenusTools: CustomMenusTools;
  private proposalsTools: ProposalsTools;
  private miscTools: MiscTools;
  private brandBoardsTools: BrandBoardsTools;
  private saasTools: SaasTools;

  constructor(client: GHLApiClient) {
    this.contactTools = new ContactTools(client);
    this.conversationTools = new ConversationTools(client);
    this.blogTools = new BlogTools(client);
    this.opportunityTools = new OpportunityTools(client);
    this.calendarTools = new CalendarTools(client);
    this.emailTools = new EmailTools(client);
    this.locationTools = new LocationTools(client);
    this.emailISVTools = new EmailISVTools(client);
    this.socialMediaTools = new SocialMediaTools(client);
    this.mediaTools = new MediaTools(client);
    this.objectTools = new ObjectTools(client);
    this.associationTools = new AssociationTools(client);
    this.customFieldV2Tools = new CustomFieldV2Tools(client);
    this.workflowTools = new WorkflowTools(client);
    this.surveyTools = new SurveyTools(client);
    this.storeTools = new StoreTools(client);
    this.productsTools = new ProductsTools(client);
    this.paymentsTools = new PaymentsTools(client);
    this.invoicesTools = new InvoicesTools(client);
    this.adManagerTools = new AdManagerTools(client);
    this.agentStudioTools = new AgentStudioTools(client);
    this.voiceAITools = new VoiceAITools(client);
    this.conversationAITools = new ConversationAITools(client);
    this.formsTools = new FormsTools(client);
    this.usersTools = new UsersTools(client);
    this.businessesTools = new BusinessesTools(client);
    this.triggerLinksTools = new TriggerLinksTools(client);
    this.funnelsTools = new FunnelsTools(client);
    this.knowledgeBaseTools = new KnowledgeBaseTools(client);
    this.phoneSystemTools = new PhoneSystemTools(client);
    this.snapshotsTools = new SnapshotsTools(client);
    this.affiliateManagerTools = new AffiliateManagerTools(client);
    this.customMenusTools = new CustomMenusTools(client);
    this.proposalsTools = new ProposalsTools(client);
    this.miscTools = new MiscTools(client);
    this.brandBoardsTools = new BrandBoardsTools(client);
    this.saasTools = new SaasTools(client);
  }

  getTools(): Tool[] {
    return ([
      ...this.contactTools.getToolDefinitions(),
      ...this.conversationTools.getToolDefinitions(),
      ...this.blogTools.getToolDefinitions(),
      ...this.opportunityTools.getToolDefinitions(),
      ...this.calendarTools.getToolDefinitions(),
      ...this.emailTools.getToolDefinitions(),
      ...this.locationTools.getToolDefinitions(),
      ...this.emailISVTools.getToolDefinitions(),
      ...this.socialMediaTools.getTools(),
      ...this.mediaTools.getToolDefinitions(),
      ...this.objectTools.getToolDefinitions(),
      ...this.associationTools.getTools(),
      ...this.customFieldV2Tools.getTools(),
      ...this.workflowTools.getTools(),
      ...this.surveyTools.getTools(),
      ...this.storeTools.getTools(),
      ...this.productsTools.getTools(),
      ...this.paymentsTools.getTools(),
      ...this.invoicesTools.getTools(),
      ...this.adManagerTools.getTools(),
      ...this.agentStudioTools.getTools(),
      ...this.voiceAITools.getTools(),
      ...this.conversationAITools.getTools(),
      ...this.formsTools.getTools(),
      ...this.usersTools.getTools(),
      ...this.businessesTools.getTools(),
      ...this.triggerLinksTools.getTools(),
      ...this.funnelsTools.getTools(),
      ...this.knowledgeBaseTools.getTools(),
      ...this.phoneSystemTools.getTools(),
      ...this.snapshotsTools.getTools(),
      ...this.affiliateManagerTools.getTools(),
      ...this.customMenusTools.getTools(),
      ...this.proposalsTools.getTools(),
      ...this.miscTools.getTools(),
      ...this.brandBoardsTools.getTools(),
      ...this.saasTools.getTools(),
    ] as Tool[]);
  }

  async dispatch(name: string, args: any): Promise<any> {
    if (CONTACT_TOOLS.has(name))           return await this.contactTools.executeTool(name, args);
    if (CONVERSATION_TOOLS.has(name))      return await this.conversationTools.executeTool(name, args);
    if (BLOG_TOOLS.has(name))              return await this.blogTools.executeTool(name, args);
    if (OPPORTUNITY_TOOLS.has(name))       return await this.opportunityTools.executeTool(name, args);
    if (CALENDAR_TOOLS.has(name))          return await this.calendarTools.executeTool(name, args);
    if (EMAIL_TOOLS.has(name))             return await this.emailTools.executeTool(name, args);
    if (LOCATION_TOOLS.has(name))          return await this.locationTools.executeTool(name, args);
    if (EMAIL_ISV_TOOLS.has(name))         return await this.emailISVTools.executeTool(name, args);
    if (SOCIAL_MEDIA_TOOLS.has(name))      return await this.socialMediaTools.executeTool(name, args);
    if (MEDIA_TOOLS.has(name))             return await this.mediaTools.executeTool(name, args);
    if (OBJECT_TOOLS.has(name))            return await this.objectTools.executeTool(name, args);
    if (ASSOCIATION_TOOLS.has(name))       return await this.associationTools.executeAssociationTool(name, args);
    if (CUSTOM_FIELD_V2_TOOLS.has(name))   return await this.customFieldV2Tools.executeCustomFieldV2Tool(name, args);
    if (WORKFLOW_TOOLS.has(name))          return await this.workflowTools.executeWorkflowTool(name, args);
    if (SURVEY_TOOLS.has(name))            return await this.surveyTools.executeSurveyTool(name, args);
    if (STORE_TOOLS.has(name))             return await this.storeTools.executeStoreTool(name, args);
    if (PRODUCTS_TOOLS.has(name))          return await this.productsTools.executeProductsTool(name, args);
    if (PAYMENTS_TOOLS.has(name))          return await this.paymentsTools.handleToolCall(name, args);
    if (INVOICES_TOOLS.has(name))          return await this.invoicesTools.handleToolCall(name, args);
    if (isAdManagerTool(name))             return await this.adManagerTools.executeAdManagerTool(name, args);
    if (isAgentStudioTool(name))           return await this.agentStudioTools.executeAgentStudioTool(name, args);
    if (isVoiceAITool(name))               return await this.voiceAITools.executeVoiceAITool(name, args);
    if (isConversationAITool(name))        return await this.conversationAITools.executeConversationAITool(name, args);
    if (isFormsTool(name))                 return await this.formsTools.executeFormsTool(name, args);
    if (isUsersTool(name))                 return await this.usersTools.executeUsersTool(name, args);
    if (isBusinessesTool(name))            return await this.businessesTools.executeBusinessesTool(name, args);
    if (isTriggerLinksTool(name))          return await this.triggerLinksTools.executeTriggerLinksTool(name, args);
    if (isFunnelsTool(name))               return await this.funnelsTools.executeFunnelsTool(name, args);
    if (isKnowledgeBaseTool(name))         return await this.knowledgeBaseTools.executeKnowledgeBaseTool(name, args);
    if (isPhoneSystemTool(name))           return await this.phoneSystemTools.executePhoneSystemTool(name, args);
    if (isSnapshotsTool(name))             return await this.snapshotsTools.executeSnapshotsTool(name, args);
    if (isAffiliateManagerTool(name))      return await this.affiliateManagerTools.executeAffiliateManagerTool(name, args);
    if (isCustomMenusTool(name))           return await this.customMenusTools.executeCustomMenusTool(name, args);
    if (isProposalsTool(name))             return await this.proposalsTools.executeProposalsTool(name, args);
    if (isMiscTool(name))                  return await this.miscTools.executeMiscTool(name, args);
    if (isBrandBoardsTool(name))           return await this.brandBoardsTools.executeBrandBoardsTool(name, args);
    if (isSaasTool(name))                  return await this.saasTools.executeSaasTool(name, args);
    throw new Error(`Unknown tool: ${name}`);
  }
}

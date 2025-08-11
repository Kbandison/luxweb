// LuxWeb Studio CRM - Complete TypeScript Types
// Generated from the complete database schema

export type ContactSubmission = {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  project_type: 'starter' | 'growth' | 'complete'
  project_goals?: string
  budget_range?: 'under-1k' | '1k-3k' | '3k-5k' | '5k-10k' | '10k-plus' | 'discuss'
  additional_details?: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  created_at: string
  updated_at: string
}

export type Package = {
  id: string
  name: string
  price: number
  retainer_price: number
  description?: string
  features?: string[]
  is_active: boolean
  created_at: string
}

export type Client = {
  id: string
  contact_submission_id?: string
  company_name: string
  primary_contact: string
  email: string
  phone?: string
  address?: string
  website_url?: string
  brand_colors?: {
    primary?: string
    secondary?: string
    accent?: string
  }
  communication_preferences?: {
    email?: boolean
    sms?: boolean
    preferred_time?: string
  }
  status: 'active' | 'inactive' | 'archived'
  engagement_score: number
  notes?: string
  created_at: string
  updated_at: string
}

export type Project = {
  id: string
  client_id: string
  package_id?: string
  project_name: string
  project_type: 'starter' | 'growth' | 'complete' | 'custom'
  description?: string
  total_value?: number
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold' | 'cancelled'
  start_date?: string
  target_completion?: string
  actual_completion?: string
  retainer_active: boolean
  project_phases?: any
  created_at: string
  updated_at: string
}

export type ProjectMilestone = {
  id: string
  project_id: string
  title: string
  description?: string
  milestone_order: number
  status: 'pending' | 'in_progress' | 'completed' | 'skipped'
  due_date?: string
  completed_at?: string
  requires_client_action: boolean
  client_approved: boolean
  notification_sent: boolean
  created_at: string
}

export type Invoice = {
  id: string
  project_id: string
  client_id: string
  invoice_number: string
  amount: number
  tax_amount: number
  total_amount: number
  due_date: string
  paid_date?: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  invoice_data?: any
  payment_terms: string
  notes?: string
  created_at: string
  updated_at: string
}

export type Payment = {
  id: string
  invoice_id: string
  amount: number
  payment_date: string
  payment_method: 'bank_transfer' | 'credit_card' | 'paypal' | 'stripe' | 'check' | 'cash'
  transaction_id?: string
  notes?: string
  created_at: string
}

export type ClientCommunication = {
  id: string
  client_id: string
  project_id?: string
  type: 'email' | 'sms' | 'call' | 'meeting' | 'chat'
  direction: 'inbound' | 'outbound'
  subject?: string
  content?: string
  sent_by?: string
  delivered_at?: string
  opened_at?: string
  replied: boolean
  created_at: string
}

export type ProjectFile = {
  id: string
  project_id: string
  client_id: string
  filename: string
  original_filename: string
  file_path: string
  file_type?: string
  file_size?: number
  version: number
  approved: boolean
  uploaded_by?: string
  is_public: boolean
  tags?: string[]
  created_at: string
}

export type ContractTemplate = {
  id: string
  name: string
  template_type: 'contract' | 'proposal' | 'sow'
  template_content: string
  placeholder_fields?: any
  service_type?: string
  package_type?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Contract = {
  id: string
  project_id: string
  client_id: string
  template_id?: string
  contract_data?: any
  status: 'draft' | 'sent' | 'signed' | 'expired'
  sent_at?: string
  signed_at?: string
  signature_data?: any
  created_at: string
  updated_at: string
}

export type QuestionnaireTemplate = {
  id: string
  name: string
  description?: string
  questions: any[]
  project_type?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type ClientQuestionnaire = {
  id: string
  project_id: string
  client_id: string
  template_id: string
  responses?: any
  status: 'pending' | 'submitted' | 'reviewed'
  submitted_at?: string
  created_at: string
}

export type User = {
  id: string
  email: string
  role: 'admin' | 'client'
  client_id?: string
  is_active: boolean
  last_login?: string
  created_at: string
  updated_at: string
}

export type ClientPortalSettings = {
  id: string
  client_id: string
  theme_settings?: any
  enabled_features?: any
  custom_domain?: string
  welcome_message?: string
  created_at: string
  updated_at: string
}

export type SystemSettings = {
  id: string
  key: string
  value: string
  description?: string
  created_at: string
  updated_at: string
}

export type Notification = {
  id: string
  user_id?: string
  client_id?: string
  project_id?: string
  type: string
  title: string
  message: string
  is_read: boolean
  action_url?: string
  created_at: string
}

export type WorkflowTemplate = {
  id: string
  name: string
  trigger_type: string
  trigger_conditions?: any
  actions?: any[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export type WorkflowExecution = {
  id: string
  workflow_template_id: string
  project_id?: string
  client_id?: string
  status: 'pending' | 'completed' | 'failed'
  execution_data?: any
  error_message?: string
  executed_at: string
}

// Extended types with relationships for queries
export type ClientWithProjects = Client & {
  projects?: Project[]
  contact_submissions?: ContactSubmission
}

export type ProjectWithDetails = Project & {
  client?: Client
  package?: Package
  milestones?: ProjectMilestone[]
  files?: ProjectFile[]
  invoices?: Invoice[]
  communications?: ClientCommunication[]
}

export type InvoiceWithDetails = Invoice & {
  client?: Client
  project?: Project
  payments?: Payment[]
}

// Dashboard statistics types
export type DashboardStats = {
  total_clients: number
  active_projects: number
  completed_this_month: number
  revenue_this_month: number
  pending_invoices: number
  overdue_invoices: number
  recent_communications: ClientCommunication[]
  upcoming_milestones: ProjectMilestone[]
}

// Form types for creating/updating
export type CreateClientRequest = Omit<Client, 'id' | 'created_at' | 'updated_at' | 'engagement_score'>
export type UpdateClientRequest = Partial<CreateClientRequest>

export type CreateProjectRequest = Omit<Project, 'id' | 'created_at' | 'updated_at'>
export type UpdateProjectRequest = Partial<CreateProjectRequest>

export type CreateInvoiceRequest = Omit<Invoice, 'id' | 'created_at' | 'updated_at'>
export type UpdateInvoiceRequest = Partial<CreateInvoiceRequest>
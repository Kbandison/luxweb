import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

// Client-side Supabase client (with RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client (bypasses RLS) - only create on server
export const supabaseAdmin = (() => {
  // Only try to create admin client on server side
  if (typeof window !== 'undefined') {
    return supabase // Return regular client on client-side
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!serviceKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY not found - admin functions will be limited')
    return supabase // Fallback to regular client
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
})()

export type ContactSubmission = {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  project_type: 'starter' | 'growth' | 'complete' | 'enterprise'
  project_goals: string
  budget_range: 'under-1k' | '1k-3k' | '3k-5k' | '5k-10k' | '10k-plus' | 'discuss'
  additional_details?: string
  created_at: string
  status: 'new' | 'contacted' | 'qualified' | 'converted'
}

export type Client = {
  id: string
  contact_submission_id?: string
  company_name?: string
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
  notes?: string
  created_at: string
  updated_at: string
}

export type Project = {
  id: string
  client_id: string
  project_name: string
  project_type: 'starter' | 'growth' | 'complete' | 'enterprise' | 'custom'
  description?: string
  total_value?: number
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold' | 'cancelled'
  start_date?: string
  target_completion?: string
  actual_completion?: string
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
  requires_client_action: boolean
  due_date?: string
  completed_at?: string
  notes?: string
  created_at: string
}

export type ProjectFile = {
  id: string
  project_id: string
  filename: string
  original_filename: string
  file_path: string
  file_type: string
  file_size?: number
  mime_type?: string
  uploaded_by: 'admin' | 'client'
  is_approved: boolean
  version: number
  description?: string
  created_at: string
}

export type ClientCommunication = {
  id: string
  client_id: string
  project_id?: string
  type: 'email' | 'sms' | 'call' | 'meeting' | 'note'
  subject?: string
  content: string
  direction: 'inbound' | 'outbound'
  sent_by?: string
  delivered_at?: string
  opened_at?: string
  replied: boolean
  created_at: string
}

export type ContractTemplate = {
  id: string
  name: string
  template_content: string
  placeholder_fields: Record<string, string>
  service_type?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type QuestionnaireTemplate = {
  id: string
  name: string
  questions: Array<{
    id: string
    question: string
    type: 'text' | 'textarea' | 'select' | 'multiselect' | 'radio' | 'checkbox'
    options?: string[]
    required: boolean
  }>
  project_type?: string
  created_at: string
  updated_at: string
}
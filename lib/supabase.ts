import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client-side Supabase client (with RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

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
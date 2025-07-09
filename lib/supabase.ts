import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type ContactSubmission = {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  project_type: 'starter' | 'growth' | 'complete'
  message: string
  created_at: string
  status: 'new' | 'contacted' | 'qualified' | 'converted'
}
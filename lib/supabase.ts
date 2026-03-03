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

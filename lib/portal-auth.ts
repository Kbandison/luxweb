'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getClientUser() {
  // TEMPORARILY RETURN MOCK DATA FOR TESTING
  // TODO: Re-enable once users table is properly set up
  return {
    id: 'test-client-id',
    email: 'test@client.com',
    role: 'client',
    client: {
      id: 'test-client-id',
      primary_contact: 'Test Client',
      company_name: 'Test Company',
      email: 'test@client.com',
      brand_colors: {
        primary: '#2d1b69',
        secondary: '#7c3aed',
        accent: '#d4b3ff'
      }
    }
  }

  /* Original code - commented out for testing
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch client user data with role verification
  const { data: clientUser, error } = await supabase
    .from('users')
    .select(`
      *,
      client:clients(*)
    `)
    .eq('id', user.id)
    .eq('role', 'client')
    .single()

  if (error || !clientUser) {
    console.error('Error fetching client user:', error)
    return null
  }

  return clientUser
  */
}

export async function requireClientAuth() {
  const user = await getClientUser()
  
  if (!user) {
    redirect('/portal/login')
  }
  
  return user
}

export async function isClientUser(userId: string): Promise<boolean> {
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .eq('role', 'client')
    .single()

  return !!data
}
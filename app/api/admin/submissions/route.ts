import { NextResponse } from 'next/server'
import { getAdminUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET() {
  const user = await getAdminUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

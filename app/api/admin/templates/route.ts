import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, ...templateData } = await request.json()

    let result
    if (type === 'contract') {
      const { data, error } = await supabaseAdmin
        .from('contract_templates')
        .insert([templateData])
        .select()
        .single()

      if (error) {
        console.error('Error creating contract template:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      result = data
    } else if (type === 'email') {
      const { data, error } = await supabaseAdmin
        .from('email_templates')
        .insert([templateData])
        .select()
        .single()

      if (error) {
        console.error('Error creating email template:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      result = data
    } else {
      return NextResponse.json({ error: 'Invalid template type' }, { status: 400 })
    }

    return NextResponse.json({ template: result })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Check if user is admin
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get both contract and email templates
    const [contractTemplates, emailTemplates] = await Promise.all([
      supabaseAdmin
        .from('contract_templates')
        .select('*')
        .order('created_at', { ascending: false }),
      supabaseAdmin
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false })
    ])

    return NextResponse.json({
      contractTemplates: contractTemplates.data || [],
      emailTemplates: emailTemplates.data || []
    })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
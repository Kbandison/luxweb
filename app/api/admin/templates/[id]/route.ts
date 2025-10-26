import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if user is admin
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { type } = await request.json()

    let error
    if (type === 'contract_templates') {
      const result = await supabaseAdmin
        .from('contract_templates')
        .delete()
        .eq('id', id)
      error = result.error
    } else if (type === 'email_templates') {
      const result = await supabaseAdmin
        .from('email_templates')
        .delete()
        .eq('id', id)
      error = result.error
    } else {
      return NextResponse.json({ error: 'Invalid template type' }, { status: 400 })
    }

    if (error) {
      console.error('Error deleting template:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if user is admin
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { type, ...updateData } = await request.json()

    let result
    if (type === 'contract') {
      const { data, error } = await supabaseAdmin
        .from('contract_templates')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating contract template:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      result = data
    } else if (type === 'email') {
      const { data, error } = await supabaseAdmin
        .from('email_templates')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating email template:', error)
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
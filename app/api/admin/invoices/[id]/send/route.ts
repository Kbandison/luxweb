import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { getAdminUser } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Update invoice status to sent and set issued_at
    const { data: invoice, error } = await supabaseAdmin
      .from('invoices')
      .update({
        status: 'sent',
        issued_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error sending invoice:', error)
      return NextResponse.json({ error: 'Failed to send invoice' }, { status: 500 })
    }

    // TODO: Add email sending logic here
    // This would integrate with your email service (Resend, SendGrid, etc.)
    // to actually send the invoice to the client

    return NextResponse.json({ invoice })

  } catch (error) {
    console.error('Send invoice error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
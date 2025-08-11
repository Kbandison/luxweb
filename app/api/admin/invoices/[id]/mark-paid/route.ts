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

    // Update invoice status to paid
    const { data: invoice, error } = await supabaseAdmin
      .from('invoices')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error marking invoice as paid:', error)
      return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 })
    }

    return NextResponse.json({ invoice })

  } catch (error) {
    console.error('Mark paid error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
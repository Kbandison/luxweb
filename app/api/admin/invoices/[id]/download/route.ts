import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { getAdminUser } from '@/lib/auth'

export async function GET(
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

    // Get invoice details
    const { data: invoice, error } = await supabaseAdmin
      .from('invoices')
      .select(`
        *,
        clients(primary_contact, company_name, email),
        projects(project_name)
      `)
      .eq('id', id)
      .single()

    if (error || !invoice) {
      console.error('Error fetching invoice:', error)
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // For now, return success (client handles the actual download)
    // In the future, this would generate a PDF and return it
    return NextResponse.json({ 
      success: true,
      invoice: {
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        total_amount: invoice.total_amount,
        status: invoice.status,
        client_name: invoice.clients?.primary_contact,
        company_name: invoice.clients?.company_name,
        project_name: invoice.projects?.project_name
      }
    })

  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
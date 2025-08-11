import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { getAdminUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get invoices with related data
    const { data: invoices, error } = await supabaseAdmin
      .from('invoices')
      .select(`
        *,
        clients(primary_contact, company_name, email),
        projects(project_name, project_type)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching invoices:', error)
      return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 })
    }

    return NextResponse.json({ invoices: invoices || [] })

  } catch (error) {
    console.error('Invoices GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const invoiceData = await request.json()

    // Validate required fields
    if (!invoiceData.client_id || !invoiceData.invoice_number) {
      return NextResponse.json(
        { error: 'Client and invoice number are required' },
        { status: 400 }
      )
    }

    // Create the invoice using admin client (bypasses RLS)
    const { data: invoice, error } = await supabaseAdmin
      .from('invoices')
      .insert([{
        invoice_number: invoiceData.invoice_number,
        client_id: invoiceData.client_id,
        project_id: invoiceData.project_id || null,
        status: invoiceData.status || 'draft',
        amount: invoiceData.amount || 0,
        tax_amount: invoiceData.tax_amount || 0,
        total_amount: invoiceData.total_amount || 0,
        due_date: invoiceData.due_date || null,
        notes: invoiceData.description || null,
        invoice_data: { line_items: invoiceData.line_items || [] },
        payment_terms: invoiceData.payment_terms || 'Net 30'
      }])
      .select(`
        *,
        clients(primary_contact, company_name, email),
        projects(project_name, project_type)
      `)
      .single()

    if (error) {
      console.error('Error creating invoice:', error)
      return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 })
    }

    return NextResponse.json({ invoice }, { status: 201 })

  } catch (error) {
    console.error('Invoices POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
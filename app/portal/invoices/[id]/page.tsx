import { requireClientAuth } from '@/lib/portal-auth'
import { supabaseAdmin } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { InvoiceHeader } from '@/components/portal/InvoiceHeader'
import { InvoiceDetails } from '@/components/portal/InvoiceDetails'
import { InvoicePayments } from '@/components/portal/InvoicePayments'

async function getInvoice(invoiceId: string, clientId: string) {
  const { data: invoice, error } = await supabaseAdmin
    .from('invoices')
    .select(`
      *,
      project:projects(project_name, project_type, description),
      client:clients(company_name, primary_contact, email, address),
      payments:payments(*)
    `)
    .eq('id', invoiceId)
    .eq('client_id', clientId)
    .single()

  if (error) {
    console.error('Error fetching invoice:', error)
    return null
  }

  return invoice
}

interface InvoicePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const user = await requireClientAuth()
  const { id } = await params
  const invoice = await getInvoice(id, user.client.id)

  if (!invoice) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <InvoiceHeader invoice={invoice} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <InvoiceDetails invoice={invoice} />
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <InvoicePayments 
            invoice={invoice}
            payments={invoice.payments || []} 
          />
        </div>
      </div>
    </div>
  )
}
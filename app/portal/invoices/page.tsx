import { requireClientAuth } from '@/lib/portal-auth'
import { supabaseAdmin } from '@/lib/supabase-server'
import { InvoicesHeader } from '@/components/portal/InvoicesHeader'
import { InvoicesList } from '@/components/portal/InvoicesList'

async function getClientInvoices(clientId: string) {
  const { data: invoices, error } = await supabaseAdmin
    .from('invoices')
    .select(`
      *,
      project:projects(project_name, project_type)
    `)
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching client invoices:', error)
    return []
  }

  return invoices || []
}

export default async function ClientInvoicesPage() {
  const user = await requireClientAuth()
  const invoices = await getClientInvoices(user.client_id)

  return (
    <div className="space-y-8">
      <InvoicesHeader invoices={invoices} />
      <InvoicesList invoices={invoices} />
    </div>
  )
}
import { supabaseAdmin } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { InvoiceDetails } from '@/components/admin/InvoiceDetails'
import { InvoiceActions } from '@/components/admin/InvoiceActions'

async function getInvoiceData(id: string) {
  const { data: invoice, error } = await supabaseAdmin
    .from('invoices')
    .select(`
      *,
      clients(primary_contact, company_name, email, phone, website_url),
      projects(project_name, project_type, total_value),
      payments(*)
    `)
    .eq('id', id)
    .single()

  if (error || !invoice) {
    notFound()
  }

  return invoice
}

export default async function InvoicePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const invoice = await getInvoiceData(id)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Invoice {invoice.invoice_number}
          </h1>
          <p className="text-gray-400">
            For {invoice.clients?.primary_contact}
            {invoice.clients?.company_name && ` (${invoice.clients.company_name})`}
          </p>
        </div>
        
        <InvoiceActions invoice={invoice} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Details */}
        <div className="lg:col-span-2">
          <InvoiceDetails invoice={invoice} />
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Client Info */}
            <div className="bg-glass-primary backdrop-blur-xl border border-white/20 rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-4">Client Information</h3>
              <div className="space-y-2 text-sm">
                <p className="text-white font-medium">{invoice.clients?.primary_contact}</p>
                {invoice.clients?.company_name && (
                  <p className="text-gray-300">{invoice.clients.company_name}</p>
                )}
                <p className="text-gray-300">{invoice.clients?.email}</p>
                {invoice.clients?.phone && (
                  <p className="text-gray-300">{invoice.clients.phone}</p>
                )}
              </div>
            </div>

            {/* Project Info */}
            {invoice.projects && (
              <div className="bg-glass-primary backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4">Project Information</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-white font-medium">{invoice.projects.project_name}</p>
                  <p className="text-gray-300 capitalize">{invoice.projects.project_type}</p>
                  {invoice.projects.total_value && (
                    <p className="text-gray-300">
                      Project Value: ${invoice.projects.total_value.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Payment History */}
            {invoice.payments && invoice.payments.length > 0 && (
              <div className="bg-glass-primary backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4">Payment History</h3>
                <div className="space-y-3">
                  {invoice.payments.map((payment: any) => (
                    <div key={payment.id} className="flex justify-between items-center text-sm">
                      <div>
                        <p className="text-white">${payment.amount.toLocaleString()}</p>
                        <p className="text-gray-400">
                          {new Date(payment.payment_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-green-400 font-medium">
                        {payment.payment_method}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
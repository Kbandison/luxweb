import { supabaseAdmin } from '@/lib/supabase-server'
import { InvoicesList } from '@/components/admin/InvoicesList'
import { CreateInvoiceModal } from '@/components/admin/CreateInvoiceModal'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

async function getInvoicesData() {
  // Get all invoices with client and project information
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
    return []
  }

  return invoices || []
}

async function getClientsForDropdown() {
  // Get active clients for invoice creation dropdown
  const { data: clients, error } = await supabaseAdmin
    .from('clients')
    .select('id, primary_contact, company_name, email')
    .in('status', ['lead', 'active'])
    .order('primary_contact')

  if (error) {
    console.error('Error fetching clients:', error)
    return []
  }

  return clients || []
}

async function getProjectsForDropdown() {
  // Get active projects for invoice creation dropdown
  const { data: projects, error } = await supabaseAdmin
    .from('projects')
    .select('id, project_name, client_id, total_value')
    .in('status', ['planning', 'in_progress', 'review', 'completed'])
    .order('project_name')

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  console.log(`Found ${projects?.length || 0} projects for dropdown`)
  return projects || []
}

export default async function InvoicesPage() {
  const [invoices, clients, projects] = await Promise.all([
    getInvoicesData(),
    getClientsForDropdown(), 
    getProjectsForDropdown()
  ])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Invoices</h1>
          <p className="text-gray-400">Manage billing and track payments</p>
        </div>
        <CreateInvoiceModal clients={clients} projects={projects}>
          <Button className="bg-primary-light hover:bg-primary-light/80">
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
          </Button>
        </CreateInvoiceModal>
      </div>

      {/* Invoices List */}
      <InvoicesList invoices={invoices} />
    </div>
  )
}
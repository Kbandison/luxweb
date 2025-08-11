import { supabaseAdmin } from '@/lib/supabase-server'
import { ClientsTable } from '@/components/admin/ClientsTable'
import { CreateClientModal } from '@/components/admin/CreateClientModal'
import { Button } from '@/components/ui/button'
import { Plus, Users } from 'lucide-react'

async function getClientsData() {
  try {
    const { data: clients, error } = await supabaseAdmin
      .from('clients')
      .select(`
        *,
        projects(id, project_name, status, total_value)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching clients:', error)
      return []
    }

    return clients || []
  } catch (error) {
    console.error('Error in getClientsData:', error)
    return []
  }
}

export default async function ClientsPage() {
  const clients = await getClientsData()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Clients</h1>
          <p className="text-gray-400">Manage your client relationships and projects</p>
        </div>
        <CreateClientModal>
          <Button className="bg-primary-light hover:bg-primary-medium text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Client
          </Button>
        </CreateClientModal>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-glass-primary backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Clients</p>
              <p className="text-2xl font-bold text-white mt-1">{clients.length}</p>
            </div>
            <Users className="h-8 w-8 text-primary-light" />
          </div>
        </div>
        
        <div className="bg-glass-primary backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Active Clients</p>
              <p className="text-2xl font-bold text-white mt-1">
                {clients.filter(c => c.status === 'active').length}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-glass-primary backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Projects</p>
              <p className="text-2xl font-bold text-white mt-1">
                {clients.reduce((acc, client) => acc + (client.projects?.length || 0), 0)}
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-glass-primary backdrop-blur-xl border border-white/20 rounded-xl">
        <ClientsTable clients={clients} />
      </div>
    </div>
  )
}
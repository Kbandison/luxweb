import { supabaseAdmin } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { ClientDetails } from '@/components/admin/ClientDetails'
import { ClientProjects } from '@/components/admin/ClientProjects'
import { ClientCommunications } from '@/components/admin/ClientCommunications'

async function getClientData(id: string) {
  const { data: client, error } = await supabaseAdmin
    .from('clients')
    .select(`
      *,
      projects(*),
      client_communications(*)
    `)
    .eq('id', id)
    .single()

  if (error || !client) {
    notFound()
  }

  return client
}

export default async function ClientPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const client = await getClientData(id)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {client.primary_contact}
          </h1>
          {client.company_name && (
            <p className="text-xl text-gray-400">{client.company_name}</p>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Details */}
        <div className="lg:col-span-1">
          <ClientDetails client={client} />
        </div>

        {/* Projects and Communications */}
        <div className="lg:col-span-2 space-y-6">
          <ClientProjects 
            clientId={client.id} 
            projects={client.projects || []} 
          />
          <ClientCommunications 
            clientId={client.id}
            communications={client.client_communications || []}
          />
        </div>
      </div>
    </div>
  )
}
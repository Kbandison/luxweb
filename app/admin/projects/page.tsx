import { supabaseAdmin } from '@/lib/supabase-server'
import { ProjectsList } from '@/components/admin/ProjectsList'
import { CreateProjectModal } from '@/components/admin/CreateProjectModal'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

async function getProjectsData() {
  // Get all projects with client and package information
  const { data: projects, error } = await supabaseAdmin
    .from('projects')
    .select(`
      *,
      clients(primary_contact, company_name, email),
      packages(name, price)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return projects || []
}

async function getClientsForDropdown() {
  // Get active clients for project creation dropdown
  const { data: clients, error } = await supabaseAdmin
    .from('clients')
    .select('id, primary_contact, company_name, email')
    .eq('status', 'active')
    .order('primary_contact')

  if (error) {
    console.error('Error fetching clients:', error)
    return []
  }

  return clients || []
}

async function getPackagesForDropdown() {
  // Get all packages for project creation dropdown
  const { data: packages, error } = await supabaseAdmin
    .from('packages')
    .select('id, name, price, description')
    .order('price')

  if (error) {
    console.error('Error fetching packages:', error)
    return []
  }

  return packages || []
}

export default async function ProjectsPage() {
  const [projects, clients, packages] = await Promise.all([
    getProjectsData(),
    getClientsForDropdown(),
    getPackagesForDropdown()
  ])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-gray-400">Manage all client projects and track progress</p>
        </div>
        <CreateProjectModal clients={clients} packages={packages}>
          <Button className="bg-primary-light hover:bg-primary-light/80">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </CreateProjectModal>
      </div>

      {/* Projects List */}
      <ProjectsList projects={projects} />
    </div>
  )
}
import { requireClientAuth } from '@/lib/portal-auth'
import { supabaseAdmin } from '@/lib/supabase-server'
import { ProjectsList } from '@/components/portal/ProjectsList'
import { ProjectsHeader } from '@/components/portal/ProjectsHeader'

async function getClientProjects(clientId: string) {
  const { data: projects, error } = await supabaseAdmin
    .from('projects')
    .select(`
      *,
      milestones:project_milestones(*),
      files:project_files(
        id,
        filename,
        original_filename,
        file_type,
        file_size,
        is_public,
        created_at
      ),
      package:packages(name, price, description)
    `)
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching client projects:', error)
    return []
  }

  return projects || []
}

export default async function ClientProjectsPage() {
  const user = await requireClientAuth()
  const projects = await getClientProjects(user.client_id)

  return (
    <div className="space-y-8">
      <ProjectsHeader projects={projects} />
      <ProjectsList projects={projects} />
    </div>
  )
}
import { requireClientAuth } from '@/lib/portal-auth'
import { supabaseAdmin } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { ProjectHeader } from '@/components/portal/ProjectHeader'
import { ProjectProgress } from '@/components/portal/ProjectProgress'
import { ProjectFiles } from '@/components/portal/ProjectFiles'
import { ProjectMilestones } from '@/components/portal/ProjectMilestones'

async function getProject(projectId: string, clientId: string) {
  const { data: project, error } = await supabaseAdmin
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
        description,
        created_at
      ),
      package:packages(name, price, description),
      client:clients(company_name, primary_contact)
    `)
    .eq('id', projectId)
    .eq('client_id', clientId)
    .single()

  if (error) {
    console.error('Error fetching project:', error)
    return null
  }

  return project
}

interface ProjectPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const user = await requireClientAuth()
  const { id } = await params
  const project = await getProject(id, user.client_id)

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <ProjectHeader project={project} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <ProjectProgress project={project} />
          <ProjectMilestones milestones={project.milestones || []} />
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <ProjectFiles files={project.files || []} projectId={project.id} />
        </div>
      </div>
    </div>
  )
}
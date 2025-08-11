import { supabaseAdmin } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { ProjectDetails } from '@/components/admin/ProjectDetails'
import { ProjectMilestones } from '@/components/admin/ProjectMilestones'
import { ProjectFiles } from '@/components/admin/ProjectFiles'

async function getProjectData(id: string) {
  const { data: project, error } = await supabaseAdmin
    .from('projects')
    .select(`
      *,
      clients(primary_contact, company_name, email, phone, website_url),
      packages(name, price, description),
      project_milestones(*),
      project_files(*)
    `)
    .eq('id', id)
    .single()

  if (error || !project) {
    notFound()
  }

  return project
}

export default async function ProjectPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const project = await getProjectData(id)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {project.title}
          </h1>
          <p className="text-gray-400">
            Project for {project.clients?.primary_contact}
            {project.clients?.company_name && ` (${project.clients.company_name})`}
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Details */}
        <div className="lg:col-span-1">
          <ProjectDetails project={project} />
        </div>

        {/* Milestones and Files */}
        <div className="lg:col-span-2 space-y-6">
          <ProjectMilestones 
            projectId={project.id} 
            milestones={project.project_milestones || []} 
          />
          <ProjectFiles 
            projectId={project.id}
            clientId={project.client_id}
            files={project.project_files || []}
          />
        </div>
      </div>
    </div>
  )
}
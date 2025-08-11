import { requireClientAuth } from '@/lib/portal-auth'
import { supabaseAdmin } from '@/lib/supabase-server'
import { FilesHeader } from '@/components/portal/FilesHeader'
import { FilesList } from '@/components/portal/FilesList'
import { FileUploadArea } from '@/components/portal/FileUploadArea'

async function getClientFiles(clientId: string) {
  const { data: files, error } = await supabaseAdmin
    .from('project_files')
    .select(`
      *,
      project:projects(project_name, project_type, status)
    `)
    .eq('client_id', clientId)
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching client files:', error)
    return []
  }

  return files || []
}

async function getClientProjects(clientId: string) {
  const { data: projects, error } = await supabaseAdmin
    .from('projects')
    .select('id, project_name, status')
    .eq('client_id', clientId)
    .in('status', ['planning', 'in_progress', 'review', 'completed'])
    .order('project_name')

  if (error) {
    console.error('Error fetching client projects:', error)
    return []
  }

  return projects || []
}

export default async function ClientFilesPage() {
  const user = await requireClientAuth()
  const [files, projects] = await Promise.all([
    getClientFiles(user.client_id),
    getClientProjects(user.client_id)
  ])

  return (
    <div className="space-y-8">
      <FilesHeader files={files} />
      <FileUploadArea projects={projects} />
      <FilesList files={files} />
    </div>
  )
}
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, ExternalLink, Calendar, DollarSign } from 'lucide-react'
import { Project } from '@/lib/supabase'

interface ClientProjectsProps {
  clientId: string
  projects: Project[]
}

const statusColors = {
  planning: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  in_progress: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  review: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  completed: 'bg-green-500/20 text-green-300 border-green-500/30',
  on_hold: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  cancelled: 'bg-red-500/20 text-red-300 border-red-500/30',
}

export function ClientProjects({ clientId, projects }: ClientProjectsProps) {
  return (
    <div className="bg-glass-primary backdrop-blur-xl border border-white/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Projects</h3>
        <Button size="sm" className="bg-primary-light hover:bg-primary-medium text-white">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">No projects yet</p>
            <Button className="bg-primary-light hover:bg-primary-medium text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create First Project
            </Button>
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1">{project.project_name}</h4>
                  {project.description && (
                    <p className="text-sm text-gray-400 mb-2">{project.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${statusColors[project.status as keyof typeof statusColors]} border`}>
                    {project.status.replace('_', ' ')}
                  </Badge>
                  <Link href={`/admin/projects/${project.id}`}>
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4 text-gray-400">
                  <span className="capitalize">{project.project_type}</span>
                  {project.total_value && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {project.total_value.toLocaleString()}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-gray-400">
                  {project.start_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Started {new Date(project.start_date).toLocaleDateString()}
                    </div>
                  )}
                  {project.target_completion && (
                    <div className="text-xs">
                      Due {new Date(project.target_completion).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
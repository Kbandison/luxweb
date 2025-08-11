import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ExternalLink } from 'lucide-react'

interface Project {
  id: string
  project_name: string
  status: string
  target_completion: string | null
  clients: {
    primary_contact: string
  } | null
}

interface ActiveProjectsProps {
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

export function ActiveProjects({ projects }: ActiveProjectsProps) {
  return (
    <div className="bg-glass-primary backdrop-blur-xl border border-white/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Active Projects</h3>
        <Link 
          href="/admin/projects"
          className="text-sm text-primary-light hover:text-primary-medium transition-colors flex items-center gap-1"
        >
          View all <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {projects.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No active projects</p>
        ) : (
          projects.slice(0, 5).map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex-1">
                <h4 className="font-medium text-white">{project.project_name}</h4>
                <p className="text-sm text-gray-400 mt-1">
                  Client: {project.clients?.primary_contact || 'Unknown'}
                </p>
                {project.target_completion && (
                  <p className="text-xs text-gray-500 mt-1">
                    Due: {new Date(project.target_completion).toLocaleDateString()}
                  </p>
                )}
              </div>
              <Badge 
                className={`${statusColors[project.status as keyof typeof statusColors]} border`}
              >
                {project.status.replace('_', ' ')}
              </Badge>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
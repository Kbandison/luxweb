'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FolderOpen, Calendar, ArrowRight, Clock, CheckCircle, AlertCircle } from 'lucide-react'

interface RecentProjectsProps {
  projects: any[]
}

const statusConfig = {
  planning: {
    icon: Clock,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    label: 'Planning'
  },
  in_progress: {
    icon: Clock,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    label: 'In Progress'
  },
  review: {
    icon: AlertCircle,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    label: 'In Review'
  },
  completed: {
    icon: CheckCircle,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    label: 'Completed'
  }
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  const recentProjects = projects.slice(0, 3)

  if (projects.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Recent Projects</h2>
        </div>
        <div className="text-center py-8">
          <FolderOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">No projects yet</p>
          <p className="text-gray-500 text-sm">Your projects will appear here once they're created.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Recent Projects</h2>
        <Link href="/portal/projects">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {recentProjects.map((project) => {
          const status = statusConfig[project.status as keyof typeof statusConfig] || statusConfig.planning
          const Icon = status.icon
          const completedMilestones = project.milestones?.filter((m: any) => m.status === 'completed').length || 0
          const totalMilestones = project.milestones?.length || 0
          const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0

          return (
            <Link key={project.id} href={`/portal/projects/${project.id}`}>
              <div className="p-4 border border-white/10 rounded-xl hover:bg-white/5 transition-all duration-200 group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-white font-medium group-hover:text-white mb-1">
                      {project.project_name}
                    </h3>
                    {project.description && (
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${status.bgColor}`}>
                    <Icon className={`w-3 h-3 ${status.color}`} />
                    <span className={`text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                {totalMilestones > 0 && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'No start date'}
                    </span>
                  </div>
                  {totalMilestones > 0 && (
                    <span>{completedMilestones}/{totalMilestones} milestones</span>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
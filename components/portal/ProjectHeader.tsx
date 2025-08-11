'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Package, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Pause, 
  XCircle,
  Target
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ProjectHeaderProps {
  project: any
}

const statusConfig = {
  planning: {
    icon: Target,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    label: 'Planning'
  },
  in_progress: {
    icon: Clock,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    label: 'In Progress'
  },
  review: {
    icon: AlertCircle,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    label: 'In Review'
  },
  completed: {
    icon: CheckCircle,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    label: 'Completed'
  },
  on_hold: {
    icon: Pause,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    label: 'On Hold'
  },
  cancelled: {
    icon: XCircle,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    label: 'Cancelled'
  }
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const status = statusConfig[project.status as keyof typeof statusConfig] || statusConfig.planning
  const StatusIcon = status.icon

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2">
        <Link href="/portal/projects">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </Link>
      </div>

      {/* Project Header */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6">
          <div className="flex-1 mb-4 lg:mb-0">
            <div className="flex items-center space-x-3 mb-4">
              <h1 className="text-3xl font-bold text-white">{project.project_name}</h1>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${status.bgColor} ${status.borderColor} border`}>
                <StatusIcon className={`w-4 h-4 ${status.color}`} />
                <span className={`text-sm font-medium ${status.color}`}>
                  {status.label}
                </span>
              </div>
            </div>
            {project.description && (
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                {project.description}
              </p>
            )}
          </div>
        </div>

        {/* Project Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Start Date */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Start Date</p>
              <p className="text-white font-medium">
                {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Not set'}
              </p>
            </div>
          </div>

          {/* Target Completion */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Target Completion</p>
              <p className="text-white font-medium">
                {project.target_completion ? new Date(project.target_completion).toLocaleDateString() : 'Not set'}
              </p>
            </div>
          </div>

          {/* Project Value */}
          {project.total_value && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Project Value</p>
                <p className="text-white font-medium">
                  ${project.total_value.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Package */}
          {project.package && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Package</p>
                <p className="text-white font-medium">
                  {project.package.name}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Created Date */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-gray-500 text-sm">
            Project created {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  FolderOpen, 
  Search, 
  Calendar, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Pause, 
  XCircle,
  DollarSign,
  Target
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ProjectsListProps {
  projects: any[]
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

export function ProjectsList({ projects }: ProjectsListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    const matchesType = typeFilter === 'all' || project.project_type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  if (projects.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12">
        <div className="text-center">
          <FolderOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
          <p className="text-gray-400 mb-6">
            Your projects will appear here once they're created by your development team.
          </p>
          <Button
            onClick={() => window.location.href = '/portal/communications'}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            Contact Your Team
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/20">
              <SelectItem value="all" className="text-white">All Statuses</SelectItem>
              <SelectItem value="planning" className="text-white">Planning</SelectItem>
              <SelectItem value="in_progress" className="text-white">In Progress</SelectItem>
              <SelectItem value="review" className="text-white">In Review</SelectItem>
              <SelectItem value="completed" className="text-white">Completed</SelectItem>
              <SelectItem value="on_hold" className="text-white">On Hold</SelectItem>
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/20">
              <SelectItem value="all" className="text-white">All Types</SelectItem>
              <SelectItem value="starter" className="text-white">Starter</SelectItem>
              <SelectItem value="growth" className="text-white">Growth</SelectItem>
              <SelectItem value="complete" className="text-white">Complete</SelectItem>
              <SelectItem value="enterprise" className="text-white">Enterprise</SelectItem>
              <SelectItem value="custom" className="text-white">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
          const status = statusConfig[project.status as keyof typeof statusConfig] || statusConfig.planning
          const Icon = status.icon
          const completedMilestones = project.milestones?.filter((m: any) => m.status === 'completed').length || 0
          const totalMilestones = project.milestones?.length || 0
          const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0
          const filesCount = project.files?.filter((f: any) => f.is_public).length || 0

          return (
            <Link key={project.id} href={`/portal/projects/${project.id}`}>
              <div className={`bg-white/5 backdrop-blur-xl border ${status.borderColor} rounded-2xl p-6 hover:bg-white/10 transition-all duration-200 group`}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white group-hover:text-white mb-2">
                      {project.project_name}
                    </h3>
                    {project.description && (
                      <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                        {project.description}
                      </p>
                    )}
                  </div>
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${status.bgColor}`}>
                    <Icon className={`w-4 h-4 ${status.color}`} />
                    <span className={`text-sm font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                {totalMilestones > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Progress</span>
                      <span>{Math.round(progress)}% ({completedMilestones}/{totalMilestones})</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Project Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-gray-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'No start date'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400 text-sm">
                    <FileText className="w-4 h-4" />
                    <span>{filesCount} files</span>
                  </div>
                  {project.total_value && (
                    <div className="flex items-center space-x-2 text-gray-400 text-sm">
                      <DollarSign className="w-4 h-4" />
                      <span>${project.total_value.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-gray-400 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>
                      {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                {/* Package Info */}
                {project.package && (
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <p className="text-white font-medium text-sm">{project.package.name}</p>
                    <p className="text-gray-400 text-xs">{project.package.description}</p>
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {/* No Results */}
      {filteredProjects.length === 0 && projects.length > 0 && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12">
          <div className="text-center">
            <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Projects Found</h3>
            <p className="text-gray-400">
              Try adjusting your search terms or filters.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
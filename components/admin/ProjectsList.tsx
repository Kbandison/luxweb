'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  FolderOpen, 
  Users, 
  Calendar, 
  DollarSign, 
  Eye,
  Edit,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle
} from 'lucide-react'
import Link from 'next/link'

interface Project {
  id: string
  project_name: string
  project_type: 'starter' | 'growth' | 'complete' | 'enterprise' | 'custom'
  description: string | null
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold' | 'cancelled'
  start_date: string | null
  target_completion: string | null
  actual_completion: string | null
  total_value: number | null
  created_at: string
  clients: {
    primary_contact: string
    company_name: string | null
    email: string
  } | null
  packages: {
    name: string
    price: number
  } | null
}

interface ProjectsListProps {
  projects: Project[]
}

export function ProjectsList({ projects }: ProjectsListProps) {
  const handleEditProject = (projectId: string) => {
    window.location.href = `/admin/projects/${projectId}/edit`
  }

  const getStatusBadge = (status: Project['status']) => {
    const statusConfig = {
      planning: { label: 'Planning', variant: 'secondary', icon: Clock },
      in_progress: { label: 'In Progress', variant: 'default', icon: FolderOpen },
      review: { label: 'Review', variant: 'outline', icon: Eye },
      completed: { label: 'Completed', variant: 'success', icon: CheckCircle },
      on_hold: { label: 'On Hold', variant: 'warning', icon: AlertTriangle },
      cancelled: { label: 'Cancelled', variant: 'destructive', icon: XCircle }
    } as const

    const config = statusConfig[status]
    const Icon = config.icon

    return (
      <Badge variant={config.variant as any} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const getProjectTypeColor = (project_type: Project['project_type']) => {
    const colors = {
      starter: 'text-green-400',
      growth: 'text-blue-400', 
      complete: 'text-purple-400',
      enterprise: 'text-orange-400',
      custom: 'text-gray-400'
    }
    return colors[project_type] || 'text-gray-400'
  }

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (projects.length === 0) {
    return (
      <div className="bg-glass-primary backdrop-blur-xl border border-white/20 rounded-xl p-12 text-center">
        <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
        <p className="text-gray-400 mb-6">Create your first project to get started</p>
      </div>
    )
  }

  return (
    <div className="bg-glass-primary backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden">
      {/* Table Header */}
      <div className="bg-white/5 px-8 py-5 border-b border-white/10">
        <div className="grid grid-cols-12 gap-6 items-center text-sm font-medium text-gray-300">
          <div className="col-span-3">Project</div>
          <div className="col-span-2">Client</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Type</div>
          <div className="col-span-2">Deadline</div>
          <div className="col-span-1">Value</div>
          <div className="col-span-2">Actions</div>
        </div>
      </div>

      {/* Projects List */}
      <div className="divide-y divide-white/10">
        {projects.map((project) => (
          <div key={project.id} className="px-8 py-6 hover:bg-white/5 transition-colors">
            <div className="grid grid-cols-12 gap-6 items-center">
              {/* Project Info */}
              <div className="col-span-3">
                <h3 className="font-semibold text-white mb-2">{project.project_name}</h3>
                {project.description && (
                  <p className="text-sm text-gray-400 truncate">{project.description}</p>
                )}
                {project.packages && (
                  <span className="text-xs text-primary-light">{project.packages.name}</span>
                )}
              </div>

              {/* Client */}
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-white">
                      {project.clients?.primary_contact || 'Unknown'}
                    </p>
                    {project.clients?.company_name && (
                      <p className="text-xs text-gray-400">{project.clients.company_name}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="col-span-1">
                {getStatusBadge(project.status)}
              </div>

              {/* Project Type */}
              <div className="col-span-1">
                <span className={`text-sm font-medium capitalize ${getProjectTypeColor(project.project_type)}`}>
                  {project.project_type}
                </span>
              </div>

              {/* Deadline */}
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">
                    {formatDate(project.target_completion)}
                  </span>
                </div>
              </div>

              {/* Value */}
              <div className="col-span-1">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-white">
                    {formatCurrency(project.total_value)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <Link href={`/admin/projects/${project.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditProject(project.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
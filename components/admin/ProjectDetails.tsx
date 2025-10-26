'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Globe, 
  Github, 
  Package,
  Edit,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle
} from 'lucide-react'

interface ProjectDetailsProps {
  project: {
    id: string
    title: string
    description: string | null
    status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold' | 'cancelled'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    start_date: string | null
    deadline: string | null
    actual_completion: string | null
    total_value: number | null
    deposit_amount: number | null
    project_url: string | null
    github_repo: string | null
    notes: string | null
    created_at: string
    clients: {
      primary_contact: string
      company_name: string | null
      email: string
      phone: string | null
      website_url: string | null
    } | null
    packages: {
      name: string
      price: number
      description: string | null
    } | null
  }
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  const handleEditProject = () => {
    window.location.href = `/admin/projects/${project.id}/edit`
  }

  const getStatusBadge = (status: ProjectDetailsProps['project']['status']) => {
    const statusConfig = {
      planning: { label: 'Planning', variant: 'secondary', icon: Clock },
      in_progress: { label: 'In Progress', variant: 'default', icon: CheckCircle },
      review: { label: 'Review', variant: 'outline', icon: AlertTriangle },
      completed: { label: 'Completed', variant: 'success', icon: CheckCircle },
      on_hold: { label: 'On Hold', variant: 'warning', icon: Clock },
      cancelled: { label: 'Cancelled', variant: 'destructive', icon: XCircle }
    } as const

    const config = statusConfig[status]
    const Icon = config.icon

    return (
      <Badge variant={config.variant as any} className="flex items-center gap-1 w-fit">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const getPriorityColor = (priority: ProjectDetailsProps['project']['priority']) => {
    const colors = {
      low: 'text-green-400',
      medium: 'text-yellow-400', 
      high: 'text-orange-400',
      urgent: 'text-red-400'
    }
    return colors[priority] || 'text-gray-400'
  }

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'Not set'
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
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-glass-primary backdrop-blur-xl border border-white/20 rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Project Details</h2>
        <Button variant="outline" size="sm" onClick={handleEditProject}>
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      {/* Status and Priority */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
          {getStatusBadge(project.status)}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Priority</label>
          <span className={`text-sm font-medium capitalize ${getPriorityColor(project.priority)}`}>
            {project.priority}
          </span>
        </div>
      </div>

      {/* Client Information */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white">Client</h3>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-white font-medium">{project.clients?.primary_contact}</p>
            {project.clients?.company_name && (
              <p className="text-sm text-gray-400">{project.clients.company_name}</p>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-300">{project.clients?.email}</p>
        {project.clients?.phone && (
          <p className="text-sm text-gray-300">{project.clients.phone}</p>
        )}
      </div>

      {/* Package Information */}
      {project.packages && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">Package</h3>
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-white font-medium">{project.packages.name}</p>
              <p className="text-sm text-gray-400">
                ${project.packages.price.toLocaleString()}
              </p>
            </div>
          </div>
          {project.packages.description && (
            <p className="text-sm text-gray-300">{project.packages.description}</p>
          )}
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white">Timeline</h3>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Start Date:</span>
            <span className="text-sm text-white">{formatDate(project.start_date)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Deadline:</span>
            <span className="text-sm text-white">{formatDate(project.deadline)}</span>
          </div>
          
          {project.actual_completion && (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">Completed:</span>
              <span className="text-sm text-white">{formatDate(project.actual_completion)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Financial */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white">Financial</h3>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Total Value:</span>
            <span className="text-sm font-medium text-white">{formatCurrency(project.total_value)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Deposit:</span>
            <span className="text-sm font-medium text-white">{formatCurrency(project.deposit_amount)}</span>
          </div>
        </div>
      </div>

      {/* Links */}
      {(project.project_url || project.github_repo) && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">Links</h3>
          
          <div className="space-y-2">
            {project.project_url && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-400" />
                <a
                  href={project.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-light hover:underline"
                >
                  View Live Site
                </a>
              </div>
            )}
            
            {project.github_repo && (
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4 text-gray-400" />
                <a
                  href={project.github_repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-light hover:underline"
                >
                  View Repository
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Description */}
      {project.description && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">Description</h3>
          <p className="text-sm text-gray-300 leading-relaxed">{project.description}</p>
        </div>
      )}

      {/* Notes */}
      {project.notes && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">Internal Notes</h3>
          <p className="text-sm text-gray-300 leading-relaxed">{project.notes}</p>
        </div>
      )}
    </div>
  )
}
'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, Clock, Plus } from 'lucide-react'

interface Milestone {
  id: string
  title: string
  description: string | null
  status: 'pending' | 'in_progress' | 'completed'
  due_date: string | null
  completed_at: string | null
  created_at: string
}

interface ProjectMilestonesProps {
  projectId: string
  milestones: Milestone[]
}

export function ProjectMilestones({ projectId, milestones }: ProjectMilestonesProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No due date'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: Milestone['status']) => {
    const statusConfig = {
      pending: { label: 'Pending', variant: 'secondary', icon: Clock },
      in_progress: { label: 'In Progress', variant: 'default', icon: Clock },
      completed: { label: 'Completed', variant: 'success', icon: CheckCircle }
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

  return (
    <div className="bg-glass-primary backdrop-blur-xl border border-white/20 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Project Milestones</h2>
        <Button size="sm" className="bg-primary-light hover:bg-primary-light/80">
          <Plus className="w-4 h-4 mr-2" />
          Add Milestone
        </Button>
      </div>

      {/* Milestones List */}
      {milestones.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Milestones</h3>
          <p className="text-gray-400 mb-4">Add milestones to track project progress</p>
        </div>
      ) : (
        <div className="space-y-4">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-white">{milestone.title}</h3>
                {getStatusBadge(milestone.status)}
              </div>
              
              {milestone.description && (
                <p className="text-sm text-gray-300 mb-3">{milestone.description}</p>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Due: {formatDate(milestone.due_date)}</span>
                {milestone.completed_at && (
                  <span>Completed: {formatDate(milestone.completed_at)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
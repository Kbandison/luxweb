'use client'

import { Clock, CheckCircle, AlertCircle, Target, Calendar, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ProjectMilestonesProps {
  milestones: any[]
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/10',
    borderColor: 'border-gray-500/20',
    label: 'Pending'
  },
  in_progress: {
    icon: AlertCircle,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    label: 'In Progress'
  },
  completed: {
    icon: CheckCircle,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    label: 'Completed'
  },
  skipped: {
    icon: Target,
    color: 'text-gray-500',
    bgColor: 'bg-gray-600/10',
    borderColor: 'border-gray-600/20',
    label: 'Skipped'
  }
}

export function ProjectMilestones({ milestones }: ProjectMilestonesProps) {
  const sortedMilestones = [...milestones].sort((a, b) => a.milestone_order - b.milestone_order)

  if (milestones.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Project Milestones</h2>
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">No milestones defined yet</p>
          <p className="text-gray-500 text-sm">
            Your development team will add milestones as the project progresses.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Project Milestones</h2>
      
      <div className="space-y-4">
        {sortedMilestones.map((milestone, index) => {
          const status = statusConfig[milestone.status as keyof typeof statusConfig] || statusConfig.pending
          const StatusIcon = status.icon
          const isLast = index === sortedMilestones.length - 1

          return (
            <div key={milestone.id} className="relative">
              {/* Timeline Line */}
              {!isLast && (
                <div className="absolute left-6 top-12 w-0.5 h-16 bg-gradient-to-b from-gray-600 to-transparent" />
              )}
              
              <div className={`border ${status.borderColor} rounded-xl p-4 hover:bg-white/5 transition-all duration-200`}>
                <div className="flex items-start space-x-4">
                  {/* Status Icon */}
                  <div className={`w-12 h-12 ${status.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <StatusIcon className={`w-5 h-5 ${status.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-medium text-lg">
                        {milestone.title}
                      </h3>
                      <div className={`px-2 py-1 rounded-lg ${status.bgColor} flex items-center space-x-1`}>
                        <span className={`text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>

                    {milestone.description && (
                      <p className="text-gray-400 mb-3">
                        {milestone.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      {/* Due Date */}
                      {milestone.due_date && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Due {new Date(milestone.due_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {/* Completed Date */}
                      {milestone.completed_at && (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>
                            Completed {formatDistanceToNow(new Date(milestone.completed_at), { addSuffix: true })}
                          </span>
                        </div>
                      )}

                      {/* Client Action Required */}
                      {milestone.requires_client_action && milestone.status !== 'completed' && (
                        <div className="flex items-center space-x-1 text-amber-400">
                          <User className="w-4 h-4" />
                          <span>Action required</span>
                        </div>
                      )}

                      {/* Client Approved */}
                      {milestone.client_approved && (
                        <div className="flex items-center space-x-1 text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span>Approved</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
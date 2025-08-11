'use client'

import { FolderOpen, Clock, CheckCircle, AlertCircle, Pause, XCircle } from 'lucide-react'

interface ProjectsHeaderProps {
  projects: any[]
}

export function ProjectsHeader({ projects }: ProjectsHeaderProps) {
  // Calculate project stats
  const totalProjects = projects.length
  const activeProjects = projects.filter(p => ['planning', 'in_progress', 'review'].includes(p.status)).length
  const completedProjects = projects.filter(p => p.status === 'completed').length
  const onHoldProjects = projects.filter(p => p.status === 'on_hold').length

  const stats = [
    {
      name: 'Total Projects',
      value: totalProjects,
      icon: FolderOpen,
      color: 'text-white',
      bgColor: 'bg-white/10'
    },
    {
      name: 'Active',
      value: activeProjects,
      icon: Clock,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      name: 'Completed',
      value: completedProjects,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      name: 'On Hold',
      value: onHoldProjects,
      icon: Pause,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Your Projects</h1>
        <p className="text-gray-400">
          Track progress, view milestones, and access project files
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className={`${stat.bgColor} border border-white/10 rounded-xl p-4`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-gray-400 text-sm">{stat.name}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
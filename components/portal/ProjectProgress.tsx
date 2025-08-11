'use client'

import { Clock, CheckCircle, AlertCircle, Target } from 'lucide-react'

interface ProjectProgressProps {
  project: any
}

export function ProjectProgress({ project }: ProjectProgressProps) {
  const milestones = project.milestones || []
  const completedMilestones = milestones.filter((m: any) => m.status === 'completed').length
  const totalMilestones = milestones.length
  const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0

  const statusCounts = {
    pending: milestones.filter((m: any) => m.status === 'pending').length,
    in_progress: milestones.filter((m: any) => m.status === 'in_progress').length,
    completed: milestones.filter((m: any) => m.status === 'completed').length,
    skipped: milestones.filter((m: any) => m.status === 'skipped').length
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Project Progress</h2>
      
      {totalMilestones === 0 ? (
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">No milestones defined yet</p>
          <p className="text-gray-500 text-sm">
            Milestones will be added by your development team as the project progresses.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Overall Progress */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-medium">Overall Progress</h3>
              <span className="text-white font-semibold text-lg">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3 mb-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-gray-400 text-sm">
              {completedMilestones} of {totalMilestones} milestones completed
            </p>
          </div>

          {/* Progress Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-500/10 rounded-lg p-4 border border-gray-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm font-medium">Pending</span>
              </div>
              <p className="text-2xl font-bold text-white">{statusCounts.pending}</p>
            </div>

            <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 text-sm font-medium">In Progress</span>
              </div>
              <p className="text-2xl font-bold text-white">{statusCounts.in_progress}</p>
            </div>

            <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-medium">Completed</span>
              </div>
              <p className="text-2xl font-bold text-white">{statusCounts.completed}</p>
            </div>

            <div className="bg-gray-500/10 rounded-lg p-4 border border-gray-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm font-medium">Skipped</span>
              </div>
              <p className="text-2xl font-bold text-white">{statusCounts.skipped}</p>
            </div>
          </div>

          {/* Timeline Info */}
          {(project.start_date || project.target_completion) && (
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="text-white font-medium mb-3">Timeline</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.start_date && (
                  <div>
                    <p className="text-gray-400 text-sm">Started</p>
                    <p className="text-white font-medium">
                      {new Date(project.start_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
                {project.target_completion && (
                  <div>
                    <p className="text-gray-400 text-sm">Target Completion</p>
                    <p className="text-white font-medium">
                      {new Date(project.target_completion).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
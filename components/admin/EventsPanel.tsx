'use client'

import { Clock, DollarSign, Users, Calendar } from 'lucide-react'

interface Event {
  id: string
  title: string
  subtitle?: string
  date: string
  type: 'project' | 'invoice' | 'meeting'
  status?: string
}

interface EventsPanelProps {
  title: string
  events: Event[]
}

export function EventsPanel({ title, events }: EventsPanelProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <Clock className="w-4 h-4 text-blue-400" />
      case 'invoice':
        return <DollarSign className="w-4 h-4 text-green-400" />
      case 'meeting':
        return <Users className="w-4 h-4 text-purple-400" />
      default:
        return <Calendar className="w-4 h-4 text-gray-400" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays === -1) return 'Yesterday'
    if (diffDays > 0) return `In ${diffDays} days`
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`
    
    return date.toLocaleDateString()
  }

  const getStatusColor = (type: string, status?: string) => {
    if (type === 'project') {
      switch (status) {
        case 'planning':
          return 'text-yellow-400'
        case 'in_progress':
          return 'text-blue-400'
        case 'review':
          return 'text-purple-400'
        default:
          return 'text-gray-400'
      }
    }
    if (type === 'invoice') {
      switch (status) {
        case 'draft':
          return 'text-gray-400'
        case 'sent':
          return 'text-orange-400'
        case 'overdue':
          return 'text-red-400'
        default:
          return 'text-gray-400'
      }
    }
    return 'text-gray-400'
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      
      {events.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No upcoming events</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="flex-shrink-0 mt-1">
                {getEventIcon(event.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white truncate">
                  {event.title}
                </h4>
                {event.subtitle && (
                  <p className="text-xs text-gray-400 truncate mt-1">
                    {event.subtitle}
                  </p>
                )}
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs text-gray-300">
                    {formatDate(event.date)}
                  </span>
                  {event.status && (
                    <>
                      <span className="text-xs text-gray-500">•</span>
                      <span className={`text-xs ${getStatusColor(event.type, event.status)}`}>
                        {event.status.replace('_', ' ')}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
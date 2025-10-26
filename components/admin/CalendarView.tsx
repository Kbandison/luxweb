'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, DollarSign, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CalendarEvent {
  id: string
  title: string
  date: string
  type: 'project' | 'invoice' | 'meeting'
  status?: string
}

interface CalendarViewProps {
  projectDeadlines: any[]
  invoiceDueDates: any[]
  meetings: any[]
}

export function CalendarView({ projectDeadlines, invoiceDueDates, meetings }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  // Convert data to calendar events
  const events: CalendarEvent[] = [
    ...projectDeadlines.map(project => ({
      id: project.id,
      title: project.project_name,
      date: project.target_completion,
      type: 'project' as const,
      status: project.status
    })),
    ...invoiceDueDates.map(invoice => ({
      id: invoice.id,
      title: invoice.invoice_name,
      date: invoice.due_date,
      type: 'invoice' as const,
      status: invoice.status
    })),
    ...meetings.map(meeting => ({
      id: meeting.id,
      title: meeting.subject || 'Meeting',
      date: meeting.scheduled_date,
      type: 'meeting' as const,
      status: meeting.status
    }))
  ]
  
  // Get calendar data
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const days = []
  const currentDay = new Date(startDate)
  
  // Generate 42 days (6 weeks)
  for (let i = 0; i < 42; i++) {
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.toDateString() === currentDay.toDateString()
    })
    
    days.push({
      date: new Date(currentDay),
      isCurrentMonth: currentDay.getMonth() === month,
      isToday: currentDay.toDateString() === new Date().toDateString(),
      events: dayEvents
    })
    
    currentDay.setDate(currentDay.getDate() + 1)
  }
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }
  
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <Clock className="w-3 h-3" />
      case 'invoice':
        return <DollarSign className="w-3 h-3" />
      case 'meeting':
        return <Users className="w-3 h-3" />
      default:
        return null
    }
  }
  
  const getEventColor = (type: string) => {
    switch (type) {
      case 'project':
        return 'bg-blue-600 text-blue-100'
      case 'invoice':
        return 'bg-green-600 text-green-100'
      case 'meeting':
        return 'bg-purple-600 text-purple-100'
      default:
        return 'bg-gray-600 text-gray-100'
    }
  }
  
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-lg p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          {monthNames[month]} {year}
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPreviousMonth}
            className="text-gray-400 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
            className="text-gray-400 hover:text-white px-4"
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextMonth}
            className="text-gray-400 hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-white/10 rounded-lg overflow-hidden">
        {/* Day Headers */}
        {dayNames.map(day => (
          <div key={day} className="bg-white/5 p-3 text-center">
            <span className="text-sm font-medium text-gray-400">{day}</span>
          </div>
        ))}
        
        {/* Calendar Days */}
        {days.map((day, index) => (
          <div
            key={index}
            className={`min-h-[100px] bg-white/5 p-2 ${
              !day.isCurrentMonth ? 'opacity-50' : ''
            } ${day.isToday ? 'bg-primary-light/20 border border-primary-light' : ''}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm ${
                day.isToday 
                  ? 'text-white font-bold' 
                  : day.isCurrentMonth 
                    ? 'text-gray-300' 
                    : 'text-gray-500'
              }`}>
                {day.date.getDate()}
              </span>
            </div>
            
            {/* Events */}
            <div className="space-y-1">
              {day.events.slice(0, 2).map((event, eventIndex) => (
                <div
                  key={eventIndex}
                  className={`text-xs px-2 py-1 rounded flex items-center space-x-1 ${getEventColor(event.type)}`}
                  title={event.title}
                >
                  {getEventIcon(event.type)}
                  <span className="truncate">{event.title}</span>
                </div>
              ))}
              {day.events.length > 2 && (
                <div className="text-xs text-gray-400 px-2">
                  +{day.events.length - 2} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-600 rounded"></div>
          <span className="text-sm text-gray-400">Project Deadlines</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-600 rounded"></div>
          <span className="text-sm text-gray-400">Invoice Due Dates</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-600 rounded"></div>
          <span className="text-sm text-gray-400">Meetings</span>
        </div>
      </div>
    </div>
  )
}
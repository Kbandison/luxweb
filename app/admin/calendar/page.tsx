import { CalendarView } from '@/components/admin/CalendarView'
import { EventsPanel } from '@/components/admin/EventsPanel'

export default function CalendarPage() {
  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Calendar</h1>
        <p className="text-gray-400">View upcoming deadlines and important dates.</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <CalendarView
            projectDeadlines={[]}
            invoiceDueDates={[]}
            meetings={[]}
          />
        </div>

        {/* Events Panel */}
        <div className="space-y-6">
          <EventsPanel
            title="Upcoming Events"
            events={[]}
          />
        </div>
      </div>
    </div>
  )
}

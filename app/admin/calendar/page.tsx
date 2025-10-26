import { supabaseAdmin } from '@/lib/supabase-server'
import { CalendarView } from '@/components/admin/CalendarView'
import { EventsPanel } from '@/components/admin/EventsPanel'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

async function getCalendarData() {
  // Get upcoming project deadlines
  const { data: projectDeadlines } = await supabaseAdmin
    .from('projects')
    .select(`
      id,
      project_name,
      target_completion,
      status,
      clients(primary_contact, company_name)
    `)
    .not('target_completion', 'is', null)
    .in('status', ['planning', 'in_progress', 'review'])
    .order('target_completion', { ascending: true })

  // Get invoice due dates
  const { data: invoiceDueDates } = await supabaseAdmin
    .from('invoices')
    .select(`
      id,
      invoice_name,
      due_date,
      amount,
      status,
      clients(primary_contact, company_name)
    `)
    .in('status', ['draft', 'sent'])
    .order('due_date', { ascending: true })

  // Get client communications (meetings, calls, etc.)
  const { data: meetings } = await supabaseAdmin
    .from('client_communications')
    .select(`
      id,
      subject,
      communication_type,
      scheduled_date,
      status,
      clients(primary_contact, company_name)
    `)
    .not('scheduled_date', 'is', null)
    .eq('status', 'scheduled')
    .order('scheduled_date', { ascending: true })

  return {
    projectDeadlines: projectDeadlines || [],
    invoiceDueDates: invoiceDueDates || [],
    meetings: meetings || []
  }
}

export default async function CalendarPage() {
  const { projectDeadlines, invoiceDueDates, meetings } = await getCalendarData()

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Calendar</h1>
          <p className="text-gray-400">Manage deadlines, meetings, and important dates</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button className="bg-primary-light hover:bg-primary-medium">
            <Plus className="w-4 h-4 mr-2" />
            Schedule Meeting
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <CalendarView 
            projectDeadlines={projectDeadlines}
            invoiceDueDates={invoiceDueDates}
            meetings={meetings}
          />
        </div>

        {/* Events Panel */}
        <div className="space-y-6">
          <EventsPanel
            title="Upcoming Deadlines"
            events={[
              ...projectDeadlines.slice(0, 5).map(project => ({
                id: project.id,
                title: project.project_name,
                subtitle: (project.clients as any)?.company_name || (project.clients as any)?.primary_contact,
                date: project.target_completion,
                type: 'project' as const,
                status: project.status
              })),
              ...invoiceDueDates.slice(0, 3).map(invoice => ({
                id: invoice.id,
                title: invoice.invoice_name,
                subtitle: `$${invoice.amount?.toLocaleString() || '0'} - ${(invoice.clients as any)?.company_name || (invoice.clients as any)?.primary_contact}`,
                date: invoice.due_date,
                type: 'invoice' as const,
                status: invoice.status
              }))
            ]}
          />

          <EventsPanel
            title="Upcoming Meetings"
            events={meetings.slice(0, 5).map(meeting => ({
              id: meeting.id,
              title: meeting.subject || 'Meeting',
              subtitle: (meeting.clients as any)?.company_name || (meeting.clients as any)?.primary_contact,
              date: meeting.scheduled_date,
              type: 'meeting' as const,
              status: meeting.status
            }))}
          />
        </div>
      </div>
    </div>
  )
}
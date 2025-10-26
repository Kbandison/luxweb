import { supabaseAdmin } from '@/lib/supabase-server'
import { CommunicationsHistory } from '@/components/admin/CommunicationsHistory'
import { ComposeEmailModal } from '@/components/admin/ComposeEmailModal'
import { EmailTemplatesQuick } from '@/components/admin/EmailTemplatesQuick'
import { Button } from '@/components/ui/button'
import { Plus, Mail, Send, Users, MessageSquare } from 'lucide-react'

async function getCommunicationsData() {
  try {
    // Get recent communications
    const { data: communications, error: commError } = await supabaseAdmin
      .from('client_communications')
      .select(`
        *,
        clients(primary_contact, company_name, email)
      `)
      .order('created_at', { ascending: false })
      .limit(50)

    // Get clients for compose email
    const { data: clients, error: clientsError } = await supabaseAdmin
      .from('clients')
      .select('id, primary_contact, company_name, email')
      .eq('status', 'active')
      .order('primary_contact')

    // Get email templates
    const { data: emailTemplates, error: templatesError } = await supabaseAdmin
      .from('email_templates')
      .select('id, name, subject, template_type')
      .eq('is_active', true)
      .order('name')

    if (commError) console.error('Communications error:', commError)
    if (clientsError) console.error('Clients error:', clientsError)
    if (templatesError) console.error('Templates error:', templatesError)

    return {
      communications: communications || [],
      clients: clients || [],
      emailTemplates: emailTemplates || []
    }
  } catch (error) {
    console.error('Error in getCommunicationsData:', error)
    return {
      communications: [],
      clients: [],
      emailTemplates: []
    }
  }
}

export default async function CommunicationsPage() {
  const { communications, clients, emailTemplates } = await getCommunicationsData()

  // Calculate stats
  const stats = {
    totalCommunications: communications.length,
    emailsSent: communications.filter(c => c.communication_type === 'email').length,
    meetingsScheduled: communications.filter(c => c.communication_type === 'meeting' && c.status === 'scheduled').length,
    thisWeek: communications.filter(c => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return new Date(c.created_at) > weekAgo
    }).length
  }

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Communications</h1>
          <p className="text-gray-400">Manage client communications, send emails, and track conversations</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Users className="w-4 h-4 mr-2" />
            Bulk Email
          </Button>
          <ComposeEmailModal clients={clients} emailTemplates={emailTemplates}>
            <Button className="bg-primary-light hover:bg-primary-medium text-white">
              <Plus className="w-4 h-4 mr-2" />
              Compose Email
            </Button>
          </ComposeEmailModal>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalCommunications}</p>
              <p className="text-gray-400 text-sm">Total Communications</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.emailsSent}</p>
              <p className="text-gray-400 text-sm">Emails Sent</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.meetingsScheduled}</p>
              <p className="text-gray-400 text-sm">Meetings Scheduled</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-600/20 rounded-lg flex items-center justify-center">
              <Send className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.thisWeek}</p>
              <p className="text-gray-400 text-sm">This Week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Communications History */}
        <div className="lg:col-span-2">
          <CommunicationsHistory communications={communications} />
        </div>

        {/* Quick Actions & Templates */}
        <div className="space-y-6">
          <EmailTemplatesQuick 
            templates={emailTemplates}
            clients={clients}
          />
          
          {/* Recent Activity Summary */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Active Conversations</span>
                <span className="text-white font-medium">
                  {communications.filter(c => c.status === 'active').length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Pending Responses</span>
                <span className="text-white font-medium">
                  {communications.filter(c => c.status === 'pending_response').length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Templates Available</span>
                <span className="text-white font-medium">{emailTemplates.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Active Clients</span>
                <span className="text-white font-medium">{clients.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
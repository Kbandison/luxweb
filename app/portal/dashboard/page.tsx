import { requireClientAuth } from '@/lib/portal-auth'
import { supabaseAdmin } from '@/lib/supabase-server'
import { DashboardStats } from '@/components/portal/DashboardStats'
import { RecentProjects } from '@/components/portal/RecentProjects'
import { RecentInvoices } from '@/components/portal/RecentInvoices'
import { RecentFiles } from '@/components/portal/RecentFiles'
import { QuickActions } from '@/components/portal/QuickActions'

async function getDashboardData(clientId: string) {
  const [projects, invoices, files, communications] = await Promise.all([
    // Active projects
    supabaseAdmin
      .from('projects')
      .select(`
        *,
        milestones:project_milestones(*),
        package:packages(name, price)
      `)
      .eq('client_id', clientId)
      .in('status', ['planning', 'in_progress', 'review'])
      .order('created_at', { ascending: false }),

    // Recent invoices
    supabaseAdmin
      .from('invoices')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(5),

    // Recent files
    supabaseAdmin
      .from('project_files')
      .select(`
        *,
        project:projects(project_name)
      `)
      .eq('client_id', clientId)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(5),

    // Recent communications
    supabaseAdmin
      .from('client_communications')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(10)
  ])

  return {
    projects: projects.data || [],
    invoices: invoices.data || [],
    files: files.data || [],
    communications: communications.data || []
  }
}

export default async function PortalDashboard() {
  const user = await requireClientAuth()
  const dashboardData = await getDashboardData(user.client_id)

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user.client?.primary_contact?.split(' ')[0] || 'there'}!
        </h1>
        <p className="text-gray-400">
          Here's an overview of your projects and account activity.
        </p>
      </div>

      {/* Dashboard Stats */}
      <DashboardStats 
        projects={dashboardData.projects}
        invoices={dashboardData.invoices}
        files={dashboardData.files}
        communications={dashboardData.communications}
      />

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <RecentProjects projects={dashboardData.projects} />

        {/* Recent Invoices */}
        <RecentInvoices invoices={dashboardData.invoices} />
      </div>

      {/* Recent Files */}
      <RecentFiles files={dashboardData.files} />
    </div>
  )
}
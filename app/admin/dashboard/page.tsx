import { supabaseAdmin } from '@/lib/supabase-server'
import { DashboardStats } from '@/components/admin/DashboardStats'
import { RecentActivity } from '@/components/admin/RecentActivity'
import { ActiveProjects } from '@/components/admin/ActiveProjects'
import { DemoDataButton } from '@/components/admin/DemoDataButton'

async function getDashboardData() {
  // Get total clients count
  const { count: clientsCount } = await supabaseAdmin
    .from('clients')
    .select('*', { count: 'exact', head: true })

  // Get leads count (new status)
  const { count: leadsCount } = await supabaseAdmin
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'lead')

  // Get active clients count
  const { count: activeClientsCount } = await supabaseAdmin
    .from('clients')  
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  // Get active projects
  const { data: activeProjects, count: activeProjectsCount } = await supabaseAdmin
    .from('projects')
    .select('*, clients(primary_contact, company_name)', { count: 'exact' })
    .in('status', ['planning', 'in_progress', 'review'])

  // Get completed projects this month
  const currentMonth = new Date().toISOString().slice(0, 7)
  const { count: completedThisMonth } = await supabaseAdmin
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed')
    .gte('actual_completion', `${currentMonth}-01`)

  // Get revenue this month from completed projects
  const { data: revenueData } = await supabaseAdmin
    .from('projects')
    .select('total_value')
    .eq('status', 'completed')
    .gte('actual_completion', `${currentMonth}-01`)

  const revenueThisMonth = revenueData?.reduce((sum, project) => 
    sum + (project.total_value || 0), 0) || 0

  // Get recent communications
  const { data: recentCommunications } = await supabaseAdmin
    .from('client_communications')
    .select('*, clients(primary_contact)')
    .order('created_at', { ascending: false })
    .limit(5)

  // Get pending invoices count
  const { count: pendingInvoices } = await supabaseAdmin
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .in('status', ['draft', 'sent'])

  return {
    clientsCount: clientsCount || 0,
    leadsCount: leadsCount || 0,
    activeClientsCount: activeClientsCount || 0,
    activeProjectsCount: activeProjectsCount || 0,
    completedThisMonth: completedThisMonth || 0,
    revenueThisMonth: revenueThisMonth,
    pendingInvoices: pendingInvoices || 0,
    activeProjects: activeProjects || [],
    recentCommunications: recentCommunications || []
  }
}

export default async function AdminDashboard() {
  const {
    clientsCount,
    leadsCount,
    activeClientsCount,
    activeProjectsCount,
    completedThisMonth,
    revenueThisMonth,
    pendingInvoices,
    activeProjects,
    recentCommunications
  } = await getDashboardData()

  return (
    <div className="py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Demo Data Button - Show only when no data exists */}
      {clientsCount === 0 && (
        <DemoDataButton />
      )}

      {/* Stats Grid */}
      <DashboardStats 
        clientsCount={clientsCount}
        leadsCount={leadsCount}
        activeClientsCount={activeClientsCount}
        activeProjectsCount={activeProjectsCount}
        completedThisMonth={completedThisMonth}
        revenueThisMonth={revenueThisMonth}
        pendingInvoices={pendingInvoices}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActiveProjects projects={activeProjects} />
        <RecentActivity communications={recentCommunications} />
      </div>
    </div>
  )
}
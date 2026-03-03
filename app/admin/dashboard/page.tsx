import { supabaseAdmin } from '@/lib/supabase-server'
import { DashboardStats } from '@/components/admin/DashboardStats'
import Link from 'next/link'

async function getDashboardData() {
  // Total submissions
  const { count: totalSubmissions } = await supabaseAdmin
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })

  // New/unread submissions
  const { count: newSubmissions } = await supabaseAdmin
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new')

  // This month's submissions
  const currentMonth = new Date().toISOString().slice(0, 7)
  const { count: thisMonthSubmissions } = await supabaseAdmin
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', `${currentMonth}-01`)

  // Conversion rate (converted / total)
  const { count: convertedCount } = await supabaseAdmin
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'converted')

  const total = totalSubmissions || 0
  const converted = convertedCount || 0
  const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0

  // Recent submissions (latest 10)
  const { data: recentSubmissions } = await supabaseAdmin
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  return {
    totalSubmissions: total,
    newSubmissions: newSubmissions || 0,
    thisMonthSubmissions: thisMonthSubmissions || 0,
    conversionRate,
    recentSubmissions: recentSubmissions || []
  }
}

export default async function AdminDashboard() {
  const {
    totalSubmissions,
    newSubmissions,
    thisMonthSubmissions,
    conversionRate,
    recentSubmissions
  } = await getDashboardData()

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatPackage = (type: string) => {
    const map: Record<string, string> = {
      starter: 'Starter',
      growth: 'Growth',
      complete: 'Complete',
      enterprise: 'Enterprise'
    }
    return map[type] || type
  }

  const statusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'text-blue-400 bg-blue-400/10',
      contacted: 'text-yellow-400 bg-yellow-400/10',
      qualified: 'text-purple-400 bg-purple-400/10',
      converted: 'text-green-400 bg-green-400/10'
    }
    return colors[status] || 'text-gray-400 bg-gray-400/10'
  }

  return (
    <div className="py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Overview of contact form submissions and leads.</p>
      </div>

      <DashboardStats
        totalSubmissions={totalSubmissions}
        newSubmissions={newSubmissions}
        thisMonthSubmissions={thisMonthSubmissions}
        conversionRate={conversionRate}
      />

      {/* Recent Submissions Table */}
      <div className="bg-glass-primary backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden">
        <div className="px-8 py-5 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent Submissions</h2>
          <Link
            href="/admin/submissions"
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            View all
          </Link>
        </div>

        {recentSubmissions.length === 0 ? (
          <div className="px-8 py-12 text-center text-gray-400">
            No submissions yet. Submissions from the contact form will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-8 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-8 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-8 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Package</th>
                  <th className="px-8 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-8 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentSubmissions.map((sub: any) => (
                  <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-8 py-4 text-sm text-white font-medium">{sub.name}</td>
                    <td className="px-8 py-4 text-sm text-gray-300">{sub.email}</td>
                    <td className="px-8 py-4 text-sm text-gray-300">{formatPackage(sub.project_type)}</td>
                    <td className="px-8 py-4 text-sm text-gray-400">{formatDate(sub.created_at)}</td>
                    <td className="px-8 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor(sub.status)}`}>
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

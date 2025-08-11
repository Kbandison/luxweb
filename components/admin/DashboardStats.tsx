import { Users, FolderOpen, CheckCircle, TrendingUp, UserPlus, DollarSign, FileText } from 'lucide-react'

interface DashboardStatsProps {
  clientsCount: number
  leadsCount: number
  activeClientsCount: number
  activeProjectsCount: number
  completedThisMonth: number
  revenueThisMonth: number
  pendingInvoices: number
}

export function DashboardStats({ 
  clientsCount,
  leadsCount,
  activeClientsCount,
  activeProjectsCount, 
  completedThisMonth,
  revenueThisMonth,
  pendingInvoices
}: DashboardStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const stats = [
    {
      name: 'Total Clients',
      value: clientsCount,
      icon: Users,
      change: `${leadsCount} leads, ${activeClientsCount} active`,
      changeType: 'neutral' as const,
    },
    {
      name: 'Active Projects',
      value: activeProjectsCount,
      icon: FolderOpen,
      change: 'In progress',
      changeType: 'positive' as const,
    },
    {
      name: 'Completed This Month',
      value: completedThisMonth,
      icon: CheckCircle,
      change: 'Projects finished',
      changeType: 'positive' as const,
    },
    {
      name: 'Revenue This Month',
      value: formatCurrency(revenueThisMonth),
      icon: TrendingUp,
      change: 'From completed projects',
      changeType: 'positive' as const,
    },
    {
      name: 'New Leads',
      value: leadsCount,
      icon: UserPlus,
      change: 'Awaiting contracts',
      changeType: 'neutral' as const,
    },
    {
      name: 'Pending Invoices',
      value: pendingInvoices,
      icon: FileText,
      change: 'Need attention',
      changeType: pendingInvoices > 0 ? 'warning' as const : 'positive' as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-glass-primary backdrop-blur-xl border border-white/20 rounded-xl p-8 hover:bg-white/10 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">{stat.name}</p>
              <p className="text-2xl font-bold text-white mt-2">
                {stat.value}
              </p>
            </div>
            <div className="p-3 bg-primary-light/20 rounded-lg">
              <stat.icon className="h-6 w-6 text-primary-light" />
            </div>
          </div>
          <div className="mt-6">
            <span
              className={`text-sm font-medium ${
                stat.changeType === 'positive' 
                  ? 'text-green-400' 
                  : stat.changeType === 'warning'
                  ? 'text-yellow-400'
                  : 'text-gray-400'
              }`}
            >
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
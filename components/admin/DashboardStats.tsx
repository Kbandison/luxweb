import { Mail, AlertCircle, Calendar, TrendingUp } from 'lucide-react'

interface DashboardStatsProps {
  totalSubmissions: number
  newSubmissions: number
  thisMonthSubmissions: number
  conversionRate: number
}

export function DashboardStats({
  totalSubmissions,
  newSubmissions,
  thisMonthSubmissions,
  conversionRate
}: DashboardStatsProps) {
  const stats = [
    {
      name: 'Total Submissions',
      value: totalSubmissions,
      icon: Mail,
      description: 'All time',
      type: 'neutral' as const,
    },
    {
      name: 'New / Unread',
      value: newSubmissions,
      icon: AlertCircle,
      description: 'Awaiting response',
      type: newSubmissions > 0 ? 'warning' as const : 'positive' as const,
    },
    {
      name: 'This Month',
      value: thisMonthSubmissions,
      icon: Calendar,
      description: 'Submissions received',
      type: 'neutral' as const,
    },
    {
      name: 'Conversion Rate',
      value: `${conversionRate}%`,
      icon: TrendingUp,
      description: 'Leads converted',
      type: 'positive' as const,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white/[0.03] border border-white/10 rounded-xl p-4 sm:p-6 hover:bg-white/[0.05] transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-400 truncate">{stat.name}</p>
              <p className="text-xl sm:text-2xl font-bold text-white mt-1">
                {stat.value}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-purple-600/10 rounded-lg flex-shrink-0">
              <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <span
              className={`text-xs sm:text-sm font-medium ${
                stat.type === 'positive'
                  ? 'text-green-400'
                  : stat.type === 'warning'
                  ? 'text-yellow-400'
                  : 'text-gray-400'
              }`}
            >
              {stat.description}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

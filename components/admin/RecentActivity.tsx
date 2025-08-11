import { Mail, Phone, MessageSquare, User } from 'lucide-react'

interface Communication {
  id: string
  type: 'email' | 'sms' | 'call' | 'meeting' | 'note'
  subject?: string
  content: string
  direction: 'inbound' | 'outbound'
  created_at: string
  clients: {
    primary_contact: string
  } | null
}

interface RecentActivityProps {
  communications: Communication[]
}

const typeIcons = {
  email: Mail,
  sms: MessageSquare,
  call: Phone,
  meeting: User,
  note: MessageSquare,
}

const typeColors = {
  email: 'text-blue-400',
  sms: 'text-green-400',
  call: 'text-yellow-400',
  meeting: 'text-purple-400',
  note: 'text-gray-400',
}

export function RecentActivity({ communications }: RecentActivityProps) {
  return (
    <div className="bg-glass-primary backdrop-blur-xl border border-white/20 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>

      <div className="space-y-4">
        {communications.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No recent activity</p>
        ) : (
          communications.map((comm) => {
            const Icon = typeIcons[comm.type]
            const colorClass = typeColors[comm.type]
            
            return (
              <div
                key={comm.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className={`p-2 rounded-lg bg-white/10`}>
                  <Icon className={`h-4 w-4 ${colorClass}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white">
                      {comm.clients?.primary_contact || 'Unknown Client'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(comm.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">
                    {comm.subject || comm.content.substring(0, 60) + (comm.content.length > 60 ? '...' : '')}
                  </p>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full bg-white/10 ${
                      comm.direction === 'inbound' ? 'text-green-300' : 'text-blue-300'
                    }`}>
                      {comm.direction === 'inbound' ? 'Received' : 'Sent'}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">
                      {comm.type}
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
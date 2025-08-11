import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Mail, 
  Phone, 
  MessageSquare, 
  User,
  Calendar
} from 'lucide-react'
import { ClientCommunication } from '@/lib/supabase'

interface ClientCommunicationsProps {
  clientId: string
  communications: ClientCommunication[]
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

const directionColors = {
  inbound: 'bg-green-500/20 text-green-300 border-green-500/30',
  outbound: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
}

export function ClientCommunications({ clientId, communications }: ClientCommunicationsProps) {
  return (
    <div className="bg-glass-primary backdrop-blur-xl border border-white/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Communications</h3>
        <Button size="sm" className="bg-primary-light hover:bg-primary-medium text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Note
        </Button>
      </div>

      <div className="space-y-4">
        {communications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">No communications yet</p>
            <Button className="bg-primary-light hover:bg-primary-medium text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add First Note
            </Button>
          </div>
        ) : (
          communications
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map((comm) => {
              const Icon = typeIcons[comm.type]
              const colorClass = typeColors[comm.type]

              return (
                <div
                  key={comm.id}
                  className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <Icon className={`h-4 w-4 ${colorClass}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {comm.subject && (
                            <h4 className="font-medium text-white">{comm.subject}</h4>
                          )}
                          <Badge className={`${directionColors[comm.direction]} border text-xs`}>
                            {comm.direction}
                          </Badge>
                          <span className="text-xs text-gray-500 capitalize">
                            {comm.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar className="h-3 w-3" />
                          {new Date(comm.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      <p className="text-gray-300 text-sm leading-relaxed">
                        {comm.content}
                      </p>

                      {comm.sent_by && (
                        <div className="mt-2 text-xs text-gray-500">
                          By: {comm.sent_by}
                        </div>
                      )}

                      {/* Delivery Status */}
                      {comm.type === 'email' && (
                        <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                          {comm.delivered_at && (
                            <span>✓ Delivered {new Date(comm.delivered_at).toLocaleString()}</span>
                          )}
                          {comm.opened_at && (
                            <span>👁 Opened {new Date(comm.opened_at).toLocaleString()}</span>
                          )}
                          {comm.replied && (
                            <span className="text-green-400">↩ Replied</span>
                          )}
                        </div>
                      )}
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
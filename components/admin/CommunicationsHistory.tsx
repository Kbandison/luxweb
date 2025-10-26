'use client'

import { useState } from 'react'
import { 
  Mail, 
  Phone, 
  Users, 
  MessageSquare, 
  Calendar, 
  Filter,
  Search,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Communication {
  id: string
  client_id: string
  communication_type: 'email' | 'phone' | 'meeting' | 'message'
  subject: string | null
  content: string | null
  status: 'sent' | 'received' | 'scheduled' | 'completed' | 'pending_response' | 'active'
  scheduled_date: string | null
  created_at: string
  clients: {
    primary_contact: string
    company_name: string | null
    email: string
  } | null
}

interface CommunicationsHistoryProps {
  communications: Communication[]
}

export function CommunicationsHistory({ communications }: CommunicationsHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'email' | 'phone' | 'meeting' | 'message'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'sent' | 'received' | 'scheduled' | 'completed'>('all')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [displayCount, setDisplayCount] = useState(20)

  // Filter communications
  const filteredCommunications = communications.filter(comm => {
    const matchesSearch = !searchTerm || 
      comm.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.clients?.primary_contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.clients?.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === 'all' || comm.communication_type === filterType
    const matchesStatus = filterStatus === 'all' || comm.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  }).slice(0, displayCount)

  const handleReply = (commId: string, clientEmail: string, subject: string) => {
    // Create mailto link with proper subject
    const replySubject = subject?.startsWith('Re:') ? subject : `Re: ${subject || 'Communication'}`
    const mailtoLink = `mailto:${clientEmail}?subject=${encodeURIComponent(replySubject)}`
    window.open(mailtoLink, '_blank')
  }

  const toggleExpanded = (commId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(commId)) {
      newExpanded.delete(commId)
    } else {
      newExpanded.add(commId)
    }
    setExpandedItems(newExpanded)
  }

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 20)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4 text-blue-400" />
      case 'phone':
        return <Phone className="w-4 h-4 text-green-400" />
      case 'meeting':
        return <Users className="w-4 h-4 text-purple-400" />
      case 'message':
        return <MessageSquare className="w-4 h-4 text-orange-400" />
      default:
        return <MessageSquare className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-blue-600/20 text-blue-400'
      case 'received':
        return 'bg-green-600/20 text-green-400'
      case 'scheduled':
        return 'bg-purple-600/20 text-purple-400'
      case 'completed':
        return 'bg-green-600/20 text-green-400'
      case 'pending_response':
        return 'bg-yellow-600/20 text-yellow-400'
      case 'active':
        return 'bg-blue-600/20 text-blue-400'
      default:
        return 'bg-gray-600/20 text-gray-400'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    
    return date.toLocaleDateString()
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Communications History</h2>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="text-gray-400 hover:text-white"
          >
            <Filter className="w-4 h-4" />
            {showAdvancedFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search communications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
        </div>

        {showAdvancedFilters && (
          <div className="flex items-center space-x-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:border-primary-light focus:outline-none"
            >
              <option value="all" className="bg-gray-900">All Types</option>
              <option value="email" className="bg-gray-900">Email</option>
              <option value="phone" className="bg-gray-900">Phone</option>
              <option value="meeting" className="bg-gray-900">Meeting</option>
              <option value="message" className="bg-gray-900">Message</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:border-primary-light focus:outline-none"
            >
              <option value="all" className="bg-gray-900">All Status</option>
              <option value="sent" className="bg-gray-900">Sent</option>
              <option value="received" className="bg-gray-900">Received</option>
              <option value="scheduled" className="bg-gray-900">Scheduled</option>
              <option value="completed" className="bg-gray-900">Completed</option>
            </select>
          </div>
        )}
      </div>

      {/* Communications List */}
      <div className="space-y-3">
        {filteredCommunications.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No communications found</p>
            {(searchTerm || filterType !== 'all' || filterStatus !== 'all') && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSearchTerm('')
                  setFilterType('all')
                  setFilterStatus('all')
                }}
                className="text-gray-400 hover:text-white mt-2"
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          filteredCommunications.map((comm) => (
            <div
              key={comm.id}
              className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex-shrink-0 mt-1">
                {getTypeIcon(comm.communication_type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">
                      {comm.subject || `${comm.communication_type.charAt(0).toUpperCase() + comm.communication_type.slice(1)} Communication`}
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">
                      {comm.clients?.primary_contact}
                      {comm.clients?.company_name && ` • ${comm.clients.company_name}`}
                    </p>
                    {comm.content && (
                      <div className="text-sm text-gray-300 mt-2">
                        <p className={expandedItems.has(comm.id) ? '' : 'line-clamp-2'}>
                          {comm.content}
                        </p>
                        {comm.content.length > 100 && (
                          <button
                            onClick={() => toggleExpanded(comm.id)}
                            className="text-blue-400 hover:text-blue-300 text-xs mt-1"
                          >
                            {expandedItems.has(comm.id) ? 'Show less' : 'Show more'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(comm.status)}`}>
                      {comm.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <span>{formatDate(comm.created_at)}</span>
                    {comm.scheduled_date && (
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Scheduled: {new Date(comm.scheduled_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleReply(comm.id, comm.clients?.email || '', comm.subject || '')}
                      className="text-gray-400 hover:text-white"
                    >
                      Reply
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleExpanded(comm.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${expandedItems.has(comm.id) ? 'rotate-180' : ''}`} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredCommunications.length > 0 && communications.length > displayCount && (
        <div className="mt-6 text-center">
          <Button 
            variant="outline" 
            onClick={handleLoadMore}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Load More ({communications.length - displayCount} remaining)
          </Button>
        </div>
      )}
    </div>
  )
}
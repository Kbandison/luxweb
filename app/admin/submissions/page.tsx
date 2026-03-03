'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Mail, Search, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'

type Submission = {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  project_type: string
  project_goals?: string
  message?: string
  budget_range?: string
  additional_details?: string
  created_at: string
  status: 'new' | 'contacted' | 'qualified' | 'converted'
}

const STATUS_TABS = ['all', 'new', 'contacted', 'qualified', 'converted'] as const
type StatusTab = typeof STATUS_TABS[number]

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<StatusTab>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  useEffect(() => {
    // Check URL for search param
    const params = new URLSearchParams(window.location.search)
    const search = params.get('search')
    if (search) setSearchQuery(search)

    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setSubmissions(data)
    }
    setLoading(false)
  }

  const updateStatus = async (id: string, newStatus: Submission['status']) => {
    const { error } = await supabase
      .from('contact_submissions')
      .update({ status: newStatus })
      .eq('id', id)

    if (!error) {
      setSubmissions(prev =>
        prev.map(s => s.id === id ? { ...s, status: newStatus } : s)
      )
    }
  }

  const filtered = submissions.filter(s => {
    const matchesTab = activeTab === 'all' || s.status === activeTab
    const matchesSearch = !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.company?.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesTab && matchesSearch
  })

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    })
  }

  const formatPackage = (type: string) => {
    const map: Record<string, string> = {
      starter: 'Starter', growth: 'Growth', complete: 'Complete', enterprise: 'Enterprise'
    }
    return map[type] || type
  }

  const statusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
      contacted: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
      qualified: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
      converted: 'text-green-400 bg-green-400/10 border-green-400/20'
    }
    return colors[status] || 'text-gray-400 bg-gray-400/10 border-gray-400/20'
  }

  const tabCount = (tab: StatusTab) => {
    if (tab === 'all') return submissions.length
    return submissions.filter(s => s.status === tab).length
  }

  return (
    <div className="py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Submissions</h1>
        <p className="text-gray-400">Manage contact form submissions and leads.</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search by name, email, or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent text-sm"
        />
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'bg-primary-light text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {tab} ({tabCount(tab)})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-glass-primary backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden">
        {loading ? (
          <div className="px-8 py-12 text-center text-gray-400">Loading submissions...</div>
        ) : filtered.length === 0 ? (
          <div className="px-8 py-12 text-center text-gray-400">
            {searchQuery ? 'No submissions match your search.' : 'No submissions found.'}
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
                  <th className="px-8 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((sub) => (
                  <>
                    <tr
                      key={sub.id}
                      className="hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => setExpandedRow(expandedRow === sub.id ? null : sub.id)}
                    >
                      <td className="px-8 py-4 text-sm text-white font-medium">
                        <div className="flex items-center gap-2">
                          {expandedRow === sub.id ? (
                            <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          )}
                          {sub.name}
                        </div>
                      </td>
                      <td className="px-8 py-4 text-sm text-gray-300">{sub.email}</td>
                      <td className="px-8 py-4 text-sm text-gray-300">{formatPackage(sub.project_type)}</td>
                      <td className="px-8 py-4 text-sm text-gray-400">{formatDate(sub.created_at)}</td>
                      <td className="px-8 py-4">
                        <select
                          value={sub.status}
                          onChange={(e) => {
                            e.stopPropagation()
                            updateStatus(sub.id, e.target.value as Submission['status'])
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className={`text-xs font-medium capitalize rounded-full px-3 py-1 border cursor-pointer bg-gray-900 ${statusColor(sub.status)}`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="converted">Converted</option>
                        </select>
                      </td>
                      <td className="px-8 py-4">
                        <a
                          href={`mailto:${sub.email}?subject=Re: Your inquiry to LuxWeb Studio&body=Hi ${sub.name.split(' ')[0]},%0D%0A%0D%0AThank you for reaching out! I'd love to learn more about your project.%0D%0A%0D%0AWould you be available for a quick call this week?%0D%0A%0D%0ABest,%0D%0ALuxWeb Studio`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          Reply
                        </a>
                      </td>
                    </tr>

                    {/* Expanded row */}
                    {expandedRow === sub.id && (
                      <tr key={`${sub.id}-expanded`} className="bg-white/5">
                        <td colSpan={6} className="px-8 py-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            {sub.phone && (
                              <div>
                                <span className="text-gray-400 block mb-1">Phone</span>
                                <span className="text-white">{sub.phone}</span>
                              </div>
                            )}
                            {sub.company && (
                              <div>
                                <span className="text-gray-400 block mb-1">Company</span>
                                <span className="text-white">{sub.company}</span>
                              </div>
                            )}
                            {sub.budget_range && (
                              <div>
                                <span className="text-gray-400 block mb-1">Budget Range</span>
                                <span className="text-white">{sub.budget_range}</span>
                              </div>
                            )}
                            <div className="md:col-span-2">
                              <span className="text-gray-400 block mb-1">Message / Project Goals</span>
                              <p className="text-white whitespace-pre-wrap">
                                {sub.project_goals || sub.message || 'No message provided'}
                              </p>
                            </div>
                            {sub.additional_details && (
                              <div className="md:col-span-2">
                                <span className="text-gray-400 block mb-1">Additional Details</span>
                                <p className="text-white whitespace-pre-wrap">{sub.additional_details}</p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

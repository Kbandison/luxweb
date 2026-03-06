'use client'

import { useState, useEffect } from 'react'
import {
  Mail, Search, ChevronDown, ChevronUp, Pencil, Trash2, X, Check
} from 'lucide-react'

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

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'converted'] as const
const PROJECT_TYPES = ['starter', 'growth', 'complete', 'enterprise'] as const

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<StatusTab>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Submission>>({})
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const search = params.get('search')
    if (search) setSearchQuery(search)
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/submissions')
      if (res.ok) {
        const data = await res.json()
        setSubmissions(data)
      }
    } catch (err) {
      console.error('Failed to fetch submissions:', err)
    }
    setLoading(false)
  }

  const updateStatus = async (id: string, newStatus: Submission['status']) => {
    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s))
    }
  }

  const startEdit = (sub: Submission) => {
    setEditingId(sub.id)
    setEditForm({
      name: sub.name,
      email: sub.email,
      phone: sub.phone || '',
      company: sub.company || '',
      project_type: sub.project_type,
      status: sub.status,
      message: sub.message || sub.project_goals || '',
    })
    setExpandedId(sub.id)
  }

  const saveEdit = async () => {
    if (!editingId) return
    setSaving(true)
    const res = await fetch(`/api/admin/submissions/${editingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    })
    if (res.ok) {
      const updated = await res.json()
      setSubmissions(prev => prev.map(s => s.id === editingId ? { ...s, ...updated } : s))
      setEditingId(null)
      setEditForm({})
    }
    setSaving(false)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const deleteSubmission = async (id: string) => {
    const res = await fetch(`/api/admin/submissions/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setSubmissions(prev => prev.filter(s => s.id !== id))
      setDeletingId(null)
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

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    })

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
      converted: 'text-green-400 bg-green-400/10 border-green-400/20',
    }
    return colors[status] || 'text-gray-400 bg-gray-400/10 border-gray-400/20'
  }

  const tabCount = (tab: StatusTab) => {
    if (tab === 'all') return submissions.length
    return submissions.filter(s => s.status === tab).length
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Submissions</h1>
        <p className="text-gray-400 text-sm">Manage contact form submissions and leads.</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search by name, email, or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-transparent text-sm"
        />
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/20'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {tab} ({tabCount(tab)})
          </button>
        ))}
      </div>

      {/* Cards */}
      {loading ? (
        <div className="text-center text-gray-400 py-12">Loading submissions...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          {searchQuery ? 'No submissions match your search.' : 'No submissions found.'}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((sub) => {
            const isExpanded = expandedId === sub.id
            const isEditing = editingId === sub.id
            const isDeleting = deletingId === sub.id

            return (
              <div
                key={sub.id}
                className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden transition-colors hover:bg-white/[0.05]"
              >
                {/* Card header */}
                <div
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                  onClick={() => {
                    if (!isEditing) setExpandedId(isExpanded ? null : sub.id)
                  }}
                >
                  <div className="flex-shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-white">{sub.name}</span>
                      <span className="text-xs text-gray-500 hidden sm:inline">{sub.email}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-500">{formatDate(sub.created_at)}</span>
                      <span className="text-xs text-gray-600">&middot;</span>
                      <span className="text-xs text-gray-400">{formatPackage(sub.project_type)}</span>
                    </div>
                  </div>

                  {/* Status badge */}
                  <span
                    className={`text-xs font-medium capitalize rounded-full px-2.5 py-0.5 border ${statusColor(sub.status)}`}
                  >
                    {sub.status}
                  </span>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-white/5 px-4 py-4 space-y-4">
                    {isEditing ? (
                      /* Edit form */
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Name</label>
                            <input
                              value={editForm.name || ''}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Email</label>
                            <input
                              value={editForm.email || ''}
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Phone</label>
                            <input
                              value={editForm.phone || ''}
                              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Company</label>
                            <input
                              value={editForm.company || ''}
                              onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Package</label>
                            <select
                              value={editForm.project_type || ''}
                              onChange={(e) => setEditForm({ ...editForm, project_type: e.target.value })}
                              className="w-full px-3 py-2 bg-gray-900 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                            >
                              {PROJECT_TYPES.map(t => (
                                <option key={t} value={t}>{formatPackage(t)}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Status</label>
                            <select
                              value={editForm.status || ''}
                              onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Submission['status'] })}
                              className="w-full px-3 py-2 bg-gray-900 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                            >
                              {STATUS_OPTIONS.map(s => (
                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Message</label>
                          <textarea
                            rows={3}
                            value={editForm.message || ''}
                            onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 resize-none"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={saveEdit}
                            disabled={saving}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Check className="w-3.5 h-3.5" />
                            {saving ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 text-sm rounded-lg transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Read-only details */
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500 text-xs">Email</span>
                            <p className="text-white">{sub.email}</p>
                          </div>
                          {sub.phone && (
                            <div>
                              <span className="text-gray-500 text-xs">Phone</span>
                              <p className="text-white">{sub.phone}</p>
                            </div>
                          )}
                          {sub.company && (
                            <div>
                              <span className="text-gray-500 text-xs">Company</span>
                              <p className="text-white">{sub.company}</p>
                            </div>
                          )}
                          {sub.budget_range && (
                            <div>
                              <span className="text-gray-500 text-xs">Budget</span>
                              <p className="text-white">{sub.budget_range}</p>
                            </div>
                          )}
                        </div>

                        <div>
                          <span className="text-gray-500 text-xs">Message</span>
                          <p className="text-white text-sm whitespace-pre-wrap mt-0.5">
                            {sub.project_goals || sub.message || 'No message provided'}
                          </p>
                        </div>

                        {sub.additional_details && (
                          <div>
                            <span className="text-gray-500 text-xs">Additional Details</span>
                            <p className="text-white text-sm whitespace-pre-wrap mt-0.5">
                              {sub.additional_details}
                            </p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-wrap pt-1">
                          {/* Status dropdown */}
                          <select
                            value={sub.status}
                            onChange={(e) => updateStatus(sub.id, e.target.value as Submission['status'])}
                            onClick={(e) => e.stopPropagation()}
                            className={`text-xs font-medium capitalize rounded-lg px-2.5 py-1.5 border cursor-pointer bg-gray-900 ${statusColor(sub.status)}`}
                          >
                            {STATUS_OPTIONS.map(s => (
                              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                          </select>

                          <button
                            onClick={(e) => { e.stopPropagation(); startEdit(sub) }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Pencil className="w-3 h-3" /> Edit
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              const subject = encodeURIComponent('Re: Your inquiry to LuxWeb Studio')
                              const body = encodeURIComponent(`Hi ${sub.name.split(' ')[0]},\n\nThank you for reaching out! I'd love to learn more about your project.\n\nWould you be available for a quick call this week?\n\nBest,\nLuxWeb Studio`)
                              window.location.href = `mailto:${sub.email}?subject=${subject}&body=${body}`
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg transition-colors"
                          >
                            <Mail className="w-3 h-3" /> Reply
                          </button>

                          {isDeleting ? (
                            <div className="inline-flex items-center gap-2 ml-auto">
                              <span className="text-xs text-red-400">Delete?</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); deleteSubmission(sub.id) }}
                                className="px-2.5 py-1.5 text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setDeletingId(null) }}
                                className="px-2.5 py-1.5 text-xs text-gray-400 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => { e.stopPropagation(); setDeletingId(sub.id) }}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

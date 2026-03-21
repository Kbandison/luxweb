'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Plus, Trash2, ChevronUp, ChevronDown, X, Check,
  ExternalLink, Image as ImageIcon, Upload, Loader2
} from 'lucide-react'

interface ProjectRow {
  id: string
  title: string
  description: string | null
  tech: string[]
  result: string | null
  category: string | null
  images: string[]
  color: string
  live_link: string | null
  sort_order: number
}

const EMPTY_PROJECT: Omit<ProjectRow, 'id' | 'sort_order'> = {
  title: '',
  description: '',
  tech: [],
  result: '',
  category: '',
  images: [],
  color: 'from-purple-500 to-pink-500',
  live_link: '',
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Omit<ProjectRow, 'id' | 'sort_order'>>(EMPTY_PROJECT)
  const [isNew, setIsNew] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [techInput, setTechInput] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/projects')
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err)
    }
    setLoading(false)
  }

  const startAdd = () => {
    setEditForm({ ...EMPTY_PROJECT })
    setTechInput('')
    setEditId('new')
    setIsNew(true)
  }

  const startEdit = (project: ProjectRow) => {
    if (editId !== null || deletingId !== null) return
    setEditForm({
      title: project.title,
      description: project.description,
      tech: project.tech || [],
      result: project.result,
      category: project.category,
      images: project.images || [],
      color: project.color,
      live_link: project.live_link,
    })
    setTechInput((project.tech || []).join(', '))
    setEditId(project.id)
    setIsNew(false)
  }

  const cancelEdit = () => {
    setEditId(null)
    setIsNew(false)
    setEditForm(EMPTY_PROJECT)
  }

  const saveEdit = async () => {
    if (!editForm.title.trim()) return
    setSaving(true)

    const payload = {
      title: editForm.title,
      description: editForm.description || '',
      tech: techInput.split(',').map(t => t.trim()).filter(Boolean),
      result: editForm.result || '',
      category: editForm.category || '',
      images: editForm.images || [],
      color: editForm.color || 'from-purple-500 to-pink-500',
      live_link: editForm.live_link || null,
    }

    try {
      if (isNew) {
        const res = await fetch('/api/admin/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (res.ok) await fetchProjects()
      } else {
        const res = await fetch(`/api/admin/projects/${editId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (res.ok) await fetchProjects()
      }
    } catch (err) {
      console.error('Failed to save project:', err)
    }

    setSaving(false)
    setEditId(null)
    setIsNew(false)
  }

  const deleteProject = async (id: string) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
      if (res.ok) await fetchProjects()
    } catch (err) {
      console.error('Failed to delete project:', err)
    }
    setSaving(false)
    setDeletingId(null)
  }

  const moveProject = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= projects.length) return

    const updated = [...projects]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp

    // Optimistically update UI
    setProjects(updated)

    // Send reorder request
    const reorderPayload = updated.map((p, i) => ({ id: p.id, sort_order: i }))
    try {
      await fetch('/api/admin/projects/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reorderPayload),
      })
    } catch (err) {
      console.error('Failed to reorder:', err)
      await fetchProjects() // Revert on failure
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/projects/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const { url } = await res.json()
        setEditForm(prev => ({ ...prev, images: [...prev.images, url] }))
      } else {
        const { error } = await res.json()
        console.error('Upload failed:', error)
      }
    } catch (err) {
      console.error('Upload failed:', err)
    }
    setUploading(false)
  }

  const removeImage = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Projects</h1>
          <p className="text-gray-400 text-sm">Manage portfolio projects. Click a row to edit.</p>
        </div>
        <button
          onClick={startAdd}
          disabled={editId !== null}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-12">Loading projects...</div>
      ) : (
        <div className="space-y-3">
          {projects.map((project, index) => {
            const isEditing = editId === project.id && !isNew
            const isDeleting = deletingId === project.id

            return (
              <div
                key={project.id}
                className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden"
              >
                {isEditing ? (
                  <ProjectForm
                    form={editForm}
                    setForm={setEditForm}
                    techInput={techInput}
                    setTechInput={setTechInput}
                    onSave={saveEdit}
                    onCancel={cancelEdit}
                    saving={saving}
                    uploading={uploading}
                    onImageUpload={handleImageUpload}
                    onRemoveImage={removeImage}
                  />
                ) : (
                  <div
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
                    onClick={() => startEdit(project)}
                  >
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {project.images[0] ? (
                        <img
                          src={project.images[0]}
                          alt={project.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-gray-500" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white truncate">{project.title}</span>
                        <span className="text-xs text-gray-500 hidden sm:inline">{project.category}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        {(project.tech || []).slice(0, 3).map(t => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 bg-white/5 text-gray-400 rounded">
                            {t}
                          </span>
                        ))}
                        {(project.tech || []).length > 3 && (
                          <span className="text-[10px] text-gray-500">+{project.tech.length - 3}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => moveProject(index, 'up')}
                        disabled={index === 0 || editId !== null}
                        className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30"
                        title="Move up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveProject(index, 'down')}
                        disabled={index === projects.length - 1 || editId !== null}
                        className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30"
                        title="Move down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      {project.live_link && (
                        <a
                          href={project.live_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-500 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                          title="View live"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}

                      {isDeleting ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => deleteProject(project.id)}
                            className="px-2 py-1 text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
                            className="px-2 py-1 text-xs text-gray-400 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeletingId(project.id)}
                          disabled={editId !== null}
                          className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-30"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* New project form */}
          {isNew && editId === 'new' && (
            <div className="bg-white/[0.03] border border-purple-500/20 rounded-xl overflow-hidden">
              <ProjectForm
                form={editForm}
                setForm={setEditForm}
                techInput={techInput}
                setTechInput={setTechInput}
                onSave={saveEdit}
                onCancel={cancelEdit}
                saving={saving}
                uploading={uploading}
                onImageUpload={handleImageUpload}
                onRemoveImage={removeImage}
                isNew
              />
            </div>
          )}
        </div>
      )}

      {saving && (
        <div className="fixed bottom-4 right-4 bg-purple-600 text-white text-sm px-4 py-2 rounded-lg shadow-lg">
          Saving changes...
        </div>
      )}
    </div>
  )
}

/* Reusable form for add/edit */
function ProjectForm({
  form,
  setForm,
  techInput,
  setTechInput,
  onSave,
  onCancel,
  saving,
  uploading,
  onImageUpload,
  onRemoveImage,
  isNew = false,
}: {
  form: Omit<ProjectRow, 'id' | 'sort_order'>
  setForm: (f: Omit<ProjectRow, 'id' | 'sort_order'>) => void
  techInput: string
  setTechInput: (v: string) => void
  onSave: () => void
  onCancel: () => void
  saving: boolean
  uploading: boolean
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: (index: number) => void
  isNew?: boolean
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="px-4 py-4 space-y-3">
      <h3 className="text-sm font-medium text-white">
        {isNew ? 'Add New Project' : 'Edit Project'}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Title *</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            placeholder="Project title"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Category</label>
          <input
            value={form.category || ''}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            placeholder="e.g. E-commerce, Healthcare"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs text-gray-400 mb-1 block">Description</label>
          <textarea
            rows={2}
            value={form.description || ''}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 resize-none"
            placeholder="Project description"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Result</label>
          <input
            value={form.result || ''}
            onChange={(e) => setForm({ ...form, result: e.target.value })}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            placeholder="e.g. Increased sales by 40%"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Color Gradient</label>
          <input
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            placeholder="from-purple-500 to-pink-500"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Live Link</label>
          <input
            value={form.live_link || ''}
            onChange={(e) => setForm({ ...form, live_link: e.target.value })}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            placeholder="https://example.com"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Tech (comma-separated)</label>
          <input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            placeholder="Next.js, TypeScript, Tailwind"
          />
        </div>

        {/* Image section */}
        <div className="sm:col-span-2">
          <label className="text-xs text-gray-400 mb-2 block">Images</label>

          {/* Image previews */}
          {form.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {form.images.map((url, i) => (
                <div key={i} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                  <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => onRemoveImage(i)}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    title="Remove image"
                  >
                    <X className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 text-sm rounded-lg transition-colors disabled:opacity-50 border border-white/10"
          >
            {uploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                Upload Image
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={onSave}
          disabled={saving || !form.title.trim()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
        >
          <Check className="w-3.5 h-3.5" />
          {saving ? 'Saving...' : isNew ? 'Add Project' : 'Save'}
        </button>
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 text-sm rounded-lg transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Cancel
        </button>
      </div>
    </div>
  )
}

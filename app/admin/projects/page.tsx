'use client'

import { useState, useEffect } from 'react'
import {
  Plus, Pencil, Trash2, ChevronUp, ChevronDown, X, Check,
  ExternalLink, Image as ImageIcon
} from 'lucide-react'

interface Project {
  title: string
  description: string
  tech: string[]
  result: string
  category: string
  images: string[]
  color: string
  links?: { live?: string }
}

const EMPTY_PROJECT: Project = {
  title: '',
  description: '',
  tech: [],
  result: '',
  category: '',
  images: [],
  color: 'from-purple-500 to-pink-500',
  links: { live: '' },
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<Project>(EMPTY_PROJECT)
  const [isNew, setIsNew] = useState(false)
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null)
  const [techInput, setTechInput] = useState('')
  const [imageInput, setImageInput] = useState('')

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

  const saveProjects = async (updated: Project[]) => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
      if (res.ok) {
        setProjects(updated)
      }
    } catch (err) {
      console.error('Failed to save projects:', err)
    }
    setSaving(false)
  }

  const startAdd = () => {
    setEditForm({ ...EMPTY_PROJECT, links: { live: '' } })
    setTechInput('')
    setImageInput('')
    setEditIndex(projects.length)
    setIsNew(true)
  }

  const startEdit = (index: number) => {
    const p = projects[index]
    setEditForm({ ...p, links: { live: p.links?.live || '' } })
    setTechInput(p.tech.join(', '))
    setImageInput(p.images.join('\n'))
    setEditIndex(index)
    setIsNew(false)
  }

  const cancelEdit = () => {
    setEditIndex(null)
    setIsNew(false)
    setEditForm(EMPTY_PROJECT)
  }

  const saveEdit = async () => {
    if (!editForm.title.trim()) return

    const project: Project = {
      ...editForm,
      tech: techInput.split(',').map(t => t.trim()).filter(Boolean),
      images: imageInput.split('\n').map(i => i.trim()).filter(Boolean),
    }

    let updated: Project[]
    if (isNew) {
      updated = [...projects, project]
    } else {
      updated = projects.map((p, i) => i === editIndex ? project : p)
    }

    await saveProjects(updated)
    setEditIndex(null)
    setIsNew(false)
  }

  const deleteProject = async (index: number) => {
    const updated = projects.filter((_, i) => i !== index)
    await saveProjects(updated)
    setDeletingIndex(null)
  }

  const moveProject = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= projects.length) return
    const updated = [...projects]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp
    await saveProjects(updated)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Projects</h1>
          <p className="text-gray-400 text-sm">Manage portfolio projects displayed on the public site.</p>
        </div>
        <button
          onClick={startAdd}
          disabled={editIndex !== null}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-12">Loading projects...</div>
      ) : (
        <div className="space-y-3">
          {/* New project form at the end */}
          {projects.map((project, index) => {
            const isEditing = editIndex === index && !isNew
            const isDeleting = deletingIndex === index

            return (
              <div
                key={index}
                className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden"
              >
                {isEditing ? (
                  <ProjectForm
                    form={editForm}
                    setForm={setEditForm}
                    techInput={techInput}
                    setTechInput={setTechInput}
                    imageInput={imageInput}
                    setImageInput={setImageInput}
                    onSave={saveEdit}
                    onCancel={cancelEdit}
                    saving={saving}
                  />
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3">
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
                        {project.tech.slice(0, 3).map(t => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 bg-white/5 text-gray-400 rounded">
                            {t}
                          </span>
                        ))}
                        {project.tech.length > 3 && (
                          <span className="text-[10px] text-gray-500">+{project.tech.length - 3}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => moveProject(index, 'up')}
                        disabled={index === 0 || editIndex !== null}
                        className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30"
                        title="Move up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveProject(index, 'down')}
                        disabled={index === projects.length - 1 || editIndex !== null}
                        className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30"
                        title="Move down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      {project.links?.live && (
                        <a
                          href={project.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-500 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                          title="View live"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}

                      <button
                        onClick={() => startEdit(index)}
                        disabled={editIndex !== null}
                        className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      {isDeleting ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => deleteProject(index)}
                            className="px-2 py-1 text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeletingIndex(null)}
                            className="px-2 py-1 text-xs text-gray-400 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeletingIndex(index)}
                          disabled={editIndex !== null}
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
          {isNew && editIndex !== null && (
            <div className="bg-white/[0.03] border border-purple-500/20 rounded-xl overflow-hidden">
              <ProjectForm
                form={editForm}
                setForm={setEditForm}
                techInput={techInput}
                setTechInput={setTechInput}
                imageInput={imageInput}
                setImageInput={setImageInput}
                onSave={saveEdit}
                onCancel={cancelEdit}
                saving={saving}
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
  imageInput,
  setImageInput,
  onSave,
  onCancel,
  saving,
  isNew = false,
}: {
  form: Project
  setForm: (f: Project) => void
  techInput: string
  setTechInput: (v: string) => void
  imageInput: string
  setImageInput: (v: string) => void
  onSave: () => void
  onCancel: () => void
  saving: boolean
  isNew?: boolean
}) {
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
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            placeholder="e.g. E-commerce, Healthcare"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs text-gray-400 mb-1 block">Description</label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 resize-none"
            placeholder="Project description"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Result</label>
          <input
            value={form.result}
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
            value={form.links?.live || ''}
            onChange={(e) => setForm({ ...form, links: { ...form.links, live: e.target.value } })}
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
        <div className="sm:col-span-2">
          <label className="text-xs text-gray-400 mb-1 block">Image URLs (one per line)</label>
          <textarea
            rows={3}
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 resize-none font-mono text-xs"
            placeholder={"/screenshot1.png\n/screenshot2.png"}
          />
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

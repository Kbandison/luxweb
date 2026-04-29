import { supabaseAdmin } from './supabase-server'
import { normalizeExternalUrl } from './utils'
import type { Project } from '@/data/projects'
import { projects as staticProjects } from '@/data/projects'

// DB row shape from Supabase
export interface ProjectRow {
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
  created_at: string
}

// Map DB row to the Project interface used by public components
function rowToProject(row: ProjectRow): Project {
  return {
    title: row.title,
    description: row.description || '',
    tech: row.tech || [],
    result: row.result || '',
    category: row.category || '',
    images: row.images || [],
    color: row.color || 'from-purple-500 to-pink-500',
    links: row.live_link ? { live: normalizeExternalUrl(row.live_link) ?? row.live_link } : undefined,
  }
}

// Fetch all projects from Supabase, ordered by sort_order
// Falls back to static data if the table doesn't exist or is empty
export async function getProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('demo_projects')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Failed to fetch projects from DB, using static fallback:', error.message)
      return staticProjects
    }

    if (!data || data.length === 0) {
      return staticProjects
    }

    return (data as ProjectRow[]).map(rowToProject)
  } catch {
    return staticProjects
  }
}

// Fetch raw rows (for admin use)
export async function getProjectRows(): Promise<ProjectRow[]> {
  const { data, error } = await supabaseAdmin
    .from('demo_projects')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Failed to fetch projects:', error)
    return []
  }

  return data as ProjectRow[]
}

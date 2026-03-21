import { NextResponse } from 'next/server'
import { getAdminUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'
import { projects } from '@/data/projects'

export async function POST() {
  const user = await getAdminUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Check if projects already exist
    const { data: existing } = await supabaseAdmin
      .from('demo_projects')
      .select('id')
      .limit(1)

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: 'Projects table already has data. Clear it first if you want to re-seed.' },
        { status: 400 }
      )
    }

    // Map static projects to DB rows
    const rows = projects.map((p, index) => ({
      title: p.title,
      description: p.description,
      tech: p.tech,
      result: p.result,
      category: p.category,
      images: p.images,
      color: p.color,
      live_link: p.links?.live || null,
      sort_order: index,
    }))

    const { data, error } = await supabaseAdmin
      .from('demo_projects')
      .insert(rows)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, count: data.length })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

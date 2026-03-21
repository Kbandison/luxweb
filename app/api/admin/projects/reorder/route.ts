import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function PUT(request: NextRequest) {
  const user = await getAdminUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const items: { id: string; sort_order: number }[] = await request.json()

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Expected array of { id, sort_order }' }, { status: 400 })
    }

    // Batch update sort_order for each project
    const updates = items.map(({ id, sort_order }) =>
      supabaseAdmin
        .from('demo_projects')
        .update({ sort_order })
        .eq('id', id)
    )

    await Promise.all(updates)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAdminUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()

    // Only update fields that were provided
    const updates: Record<string, any> = {}
    if (body.title !== undefined) updates.title = body.title
    if (body.description !== undefined) updates.description = body.description
    if (body.tech !== undefined) updates.tech = body.tech
    if (body.result !== undefined) updates.result = body.result
    if (body.category !== undefined) updates.category = body.category
    if (body.images !== undefined) updates.images = body.images
    if (body.color !== undefined) updates.color = body.color
    if (body.live_link !== undefined) updates.live_link = body.live_link
    if (body.sort_order !== undefined) updates.sort_order = body.sort_order

    const { data, error } = await supabaseAdmin
      .from('demo_projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAdminUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params

    // Get project images to clean up from storage
    const { data: project } = await supabaseAdmin
      .from('demo_projects')
      .select('images')
      .eq('id', id)
      .single()

    // Delete images from storage if they're in our bucket
    if (project?.images) {
      const storagePaths = project.images
        .filter((url: string) => url.includes('project-images/'))
        .map((url: string) => {
          const parts = url.split('project-images/')
          return parts[parts.length - 1]
        })

      if (storagePaths.length > 0) {
        await supabaseAdmin.storage
          .from('project-images')
          .remove(storagePaths)
      }
    }

    const { error } = await supabaseAdmin
      .from('demo_projects')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

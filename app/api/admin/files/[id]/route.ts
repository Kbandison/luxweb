import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const fileId = (await params).id

    // Get file record
    const { data: fileRecord, error: fileError } = await supabaseAdmin
      .from('project_files')
      .select(`
        *,
        project:projects(project_name, project_type),
        client:clients(company_name, primary_contact)
      `)
      .eq('id', fileId)
      .single()

    if (fileError || !fileRecord) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    return NextResponse.json({ file: fileRecord })

  } catch (error) {
    console.error('File GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const fileId = (await params).id
    const updateData = await request.json()

    // Only allow updating certain fields
    const allowedFields = ['description', 'is_public', 'approved', 'tags']
    const filteredData = Object.keys(updateData)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key]
        return obj
      }, {} as any)

    if (Object.keys(filteredData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    // Update file record
    const { data: fileRecord, error } = await supabaseAdmin
      .from('project_files')
      .update(filteredData)
      .eq('id', fileId)
      .select(`
        *,
        project:projects(project_name, project_type),
        client:clients(company_name, primary_contact)
      `)
      .single()

    if (error) {
      console.error('Error updating file:', error)
      return NextResponse.json({ error: 'Failed to update file' }, { status: 500 })
    }

    return NextResponse.json({ file: fileRecord })

  } catch (error) {
    console.error('File PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const fileId = (await params).id

    // Get file record first
    const { data: fileRecord, error: fileError } = await supabaseAdmin
      .from('project_files')
      .select('file_path, filename')
      .eq('id', fileId)
      .single()

    if (fileError || !fileRecord) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Delete from storage
    const { error: storageError } = await supabaseAdmin.storage
      .from('project-files')
      .remove([fileRecord.file_path])

    if (storageError) {
      console.error('Storage deletion error:', storageError)
      // Continue with database deletion even if storage deletion fails
    }

    // Delete from database
    const { error: dbError } = await supabaseAdmin
      .from('project_files')
      .delete()
      .eq('id', fileId)

    if (dbError) {
      console.error('Database deletion error:', dbError)
      return NextResponse.json({ error: 'Failed to delete file record' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'File deleted successfully'
    })

  } catch (error) {
    console.error('File DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
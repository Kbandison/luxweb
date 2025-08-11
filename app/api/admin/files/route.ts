import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('client_id')
    const projectId = searchParams.get('project_id')

    let query = supabaseAdmin
      .from('project_files')
      .select(`
        *,
        project:projects(project_name, project_type),
        client:clients(company_name, primary_contact)
      `)

    if (clientId) {
      query = query.eq('client_id', clientId)
    }

    if (projectId) {
      query = query.eq('project_id', projectId)
    }

    const { data: files, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching files:', error)
      return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 })
    }

    return NextResponse.json({ files: files || [] })

  } catch (error) {
    console.error('Files GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const clientId = formData.get('client_id') as string
    const projectId = formData.get('project_id') as string
    const description = formData.get('description') as string
    const isPublic = formData.get('is_public') === 'true'

    if (!file || !clientId) {
      return NextResponse.json({ error: 'File and client ID are required' }, { status: 400 })
    }

    // File size limit (100MB for admin uploads)
    const maxSize = 100 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 100MB.' }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/\.+/g, '.')
    const fileName = `admin_upload/${clientId}/${projectId || 'general'}/${timestamp}_${sanitizedName}`

    // Convert File to ArrayBuffer for Supabase upload
    const fileBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(fileBuffer)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('project-files')
      .upload(fileName, uint8Array, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload file to storage' }, { status: 500 })
    }

    // Get public URL for the uploaded file
    const { data: urlData } = supabaseAdmin.storage
      .from('project-files')
      .getPublicUrl(fileName)

    // Create file record in database
    const { data: fileRecord, error: dbError } = await supabaseAdmin
      .from('project_files')
      .insert({
        project_id: projectId || null,
        client_id: clientId,
        filename: fileName,
        original_filename: file.name,
        file_path: uploadData.path,
        file_url: urlData.publicUrl,
        file_type: file.type,
        file_size: file.size,
        description: description || null,
        uploaded_by: 'admin',
        is_public: isPublic,
      })
      .select(`
        *,
        project:projects(project_name, project_type),
        client:clients(company_name, primary_contact)
      `)
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Clean up uploaded file if database insert fails
      await supabaseAdmin.storage
        .from('project-files')
        .remove([fileName])
      
      return NextResponse.json({ error: 'Failed to create file record' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      file: fileRecord,
      message: 'File uploaded successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Admin file upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
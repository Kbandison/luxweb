import { NextRequest, NextResponse } from 'next/server'
import { getClientUser } from '@/lib/portal-auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    // Verify client authentication
    const user = await getClientUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const projectId = formData.get('projectId') as string
    const description = formData.get('description') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // File size limit (50MB)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 50MB.' }, { status: 400 })
    }

    // Validate file type (security measure)
    const allowedTypes = [
      'image/', 'video/', 'audio/',
      'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument',
      'text/', 'application/zip', 'application/x-zip-compressed',
      'application/json', 'application/xml'
    ]
    
    const isAllowedType = allowedTypes.some(type => file.type.startsWith(type) || file.type === type)
    if (!isAllowedType) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/\.+/g, '.')
    const fileName = `client_${user.client.id}/${projectId || 'general'}/${timestamp}_${sanitizedName}`

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
        client_id: user.client.id,
        filename: fileName,
        original_filename: file.name,
        file_path: uploadData.path,
        file_url: urlData.publicUrl,
        file_type: file.type,
        file_size: file.size,
        description: description || null,
        uploaded_by: 'client',
        is_public: true, // Client uploads are visible to both client and admin
      })
      .select()
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
    })

  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
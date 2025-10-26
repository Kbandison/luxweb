import { NextRequest, NextResponse } from 'next/server'
import { getClientUser } from '@/lib/portal-auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify client authentication
    const user = await getClientUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const fileId = (await params).id

    // Get file record and verify client access
    const { data: fileRecord, error: fileError } = await supabaseAdmin
      .from('project_files')
      .select('*')
      .eq('id', fileId)
      .eq('client_id', user.client.id)
      .eq('is_public', true)
      .single()

    if (fileError || !fileRecord) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Get file from Supabase Storage
    const { data: fileData, error: downloadError } = await supabaseAdmin.storage
      .from('project-files')
      .download(fileRecord.file_path)

    if (downloadError || !fileData) {
      console.error('Storage download error:', downloadError)
      return NextResponse.json({ error: 'Failed to download file' }, { status: 500 })
    }

    // Convert blob to array buffer
    const fileBuffer = await fileData.arrayBuffer()

    // Return file with appropriate headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': fileRecord.file_type || 'application/octet-stream',
        'Content-Length': fileRecord.file_size?.toString() || '0',
        'Content-Disposition': `attachment; filename="${fileRecord.original_filename}"`,
        'Cache-Control': 'private, max-age=3600',
      },
    })

  } catch (error) {
    console.error('File download error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'
import { sendClientInvitationEmail } from '@/lib/email'

// Generate a temporary password
function generateTemporaryPassword() {
  const length = 12
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return password
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      primary_contact,
      email,
      company_name,
      phone,
      project_name,
      project_type,
      message
    } = await request.json()

    // Validate required fields
    if (!primary_contact || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Generate temporary password
    const temporaryPassword = generateTemporaryPassword()

    // Create user account in Supabase Auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        name: primary_contact,
        role: 'client'
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json({ 
        error: `Failed to create user account: ${authError.message}` 
      }, { status: 500 })
    }

    // Create client record
    const clientData = {
      primary_contact,
      email,
      company_name: company_name || null,
      phone: phone || null,
      status: 'lead', // Start as lead
      notes: `Invited via admin portal. Project: ${project_name || 'Not specified'}`
    }

    const { data: client, error: clientError } = await supabaseAdmin
      .from('clients')
      .insert([clientData])
      .select()
      .single()

    if (clientError) {
      console.error('Client creation error:', clientError)
      
      // Clean up auth user if client creation fails
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)
      
      return NextResponse.json({ 
        error: `Failed to create client record: ${clientError.message}` 
      }, { status: 500 })
    }

    // Create user record for portal access
    const { error: userError } = await supabaseAdmin
      .from('users')
      .insert([{
        id: authUser.user.id,
        email,
        role: 'client',
        client_id: client.id
      }])

    if (userError) {
      console.error('User record error:', userError)
      
      // Clean up auth user and client if user record creation fails
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)
      await supabaseAdmin.from('clients').delete().eq('id', client.id)
      
      return NextResponse.json({ 
        error: `Failed to create user record: ${userError.message}` 
      }, { status: 500 })
    }

    // Create initial project if project details provided
    let project = null
    if (project_name) {
      const projectData = {
        client_id: client.id,
        project_name,
        project_type: project_type || 'growth',
        description: `Initial project for ${company_name || primary_contact}`,
        status: 'planning',
        total_value: 0
      }

      // Get package pricing
      const { data: packageData } = await supabaseAdmin
        .from('packages')
        .select('price')
        .eq('name', project_type)
        .single()

      if (packageData) {
        projectData.total_value = packageData.price
      }

      const { data: projectResult } = await supabaseAdmin
        .from('projects')
        .insert([projectData])
        .select()
        .single()

      project = projectResult
    }

    // Send invitation email
    const emailData = {
      client_name: primary_contact,
      client_email: email,
      company_name: company_name || null,
      project_name: project_name || null,
      project_type,
      temporary_password: temporaryPassword,
      login_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/portal/login`,
      personal_message: message || null
    }

    const emailResult = await sendClientInvitationEmail(emailData)
    if (!emailResult.success) {
      console.error('Email sending failed:', emailResult.error)
      // Don't fail the whole process if email fails, just log it
    }

    return NextResponse.json({ 
      success: true,
      client,
      project,
      message: 'Client invitation sent successfully!'
    })

  } catch (error) {
    console.error('Invitation error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
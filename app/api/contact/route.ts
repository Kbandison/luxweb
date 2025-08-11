import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendClientConfirmationEmail, sendAdminNotificationEmail, EmailData } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { name, email, project_type, project_goals, budget_range, message } = body
    
    if (!name || !email || !project_type || !project_goals || !budget_range) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Prepare data for database
    const submissionData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: body.phone?.trim() || null,
      company: body.company?.trim() || null,
      project_type,
      project_goals: project_goals.trim(),
      budget_range,
      additional_details: message?.trim() || '',
      status: 'new' as const
    }

    // Save to Supabase
    const { data: submissionResult, error: dbError } = await supabaseAdmin
      .from('contact_submissions')
      .insert([submissionData])
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save submission', details: dbError.message },
        { status: 500 }
      )
    }

    // Prepare email data
    const emailData: EmailData = {
      name: submissionData.name,
      email: submissionData.email,
      phone: submissionData.phone || undefined,
      company: submissionData.company || undefined,
      project_type: submissionData.project_type,
      project_goals: submissionData.project_goals,
      budget_range: submissionData.budget_range,
      message: submissionData.additional_details || undefined
    }

    // Send emails in background without blocking the response
    setImmediate(async () => {
      try {
        const [clientResult, adminResult] = await Promise.allSettled([
          sendClientConfirmationEmail(emailData),
          sendAdminNotificationEmail(emailData)
        ])
        
        if (clientResult.status === 'rejected' || (clientResult.status === 'fulfilled' && !clientResult.value.success)) {
          console.error('Failed to send client email:', clientResult.status === 'rejected' ? clientResult.reason : clientResult.value.error)
        }
        
        if (adminResult.status === 'rejected' || (adminResult.status === 'fulfilled' && !adminResult.value.success)) {
          console.error('Failed to send admin email:', adminResult.status === 'rejected' ? adminResult.reason : adminResult.value.error)
        }
      } catch (error) {
        console.error('Email sending process failed:', error)
      }
    })

    // Return success immediately
    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully! We\'ll get back to you within 24 hours.',
      submission_id: submissionResult.id
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
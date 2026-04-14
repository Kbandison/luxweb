import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendClientConfirmationEmail, sendAdminNotificationEmail, EmailData } from '@/lib/email'
import { analyzeIntake } from '@/lib/ai-intake'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  console.log('=== Contact Form Submission Started ===')

  try {
    const body = await request.json()
    console.log('Received body:', JSON.stringify(body, null, 2))

    // Validate required fields (simplified: only name, email, message)
    const { name, email, message } = body

    if (!name || !email || !message) {
      console.log('Validation failed: Missing required fields', { name: !!name, email: !!email, message: !!message })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('Validation failed: Invalid email format')
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Map project_type to valid database enum values
    // Database only allows: 'starter', 'growth', 'complete' - NOT 'enterprise'
    const projectTypeMap: Record<string, string> = {
      'starter': 'starter',
      'growth': 'growth',
      'complete': 'complete',
      'enterprise': 'complete',
      'signature': 'complete', // New default: Signature Site maps to highest tier
      'custom': 'complete',
    }
    const projectType = projectTypeMap[body.project_type] || 'complete'
    console.log('Project type mapping:', body.project_type, '->', projectType)

    // Run AI analysis in parallel with DB insert — saves ~1-2s of latency
    console.log('Starting AI intake analysis...')
    const analysisPromise = analyzeIntake({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      message: message.trim(),
      phone: body.phone?.trim() || undefined,
      company: body.company?.trim() || undefined,
      projectType: body.project_type || undefined,
    })

    // Prepare data for database (optional fields handled gracefully)
    const submissionData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: body.phone?.trim() || null,
      company: body.company?.trim() || null,
      project_type: projectType,
      project_goals: message.trim(),
      budget_range: 'discuss',
      additional_details: '',
      status: 'new' as const
    }

    console.log('Attempting to save to Supabase...')
    const { data: submissionResult, error: dbError } = await supabaseAdmin
      .from('contact_submissions')
      .insert([submissionData])
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', {
        message: dbError.message,
        details: dbError.details,
        hint: dbError.hint,
        code: dbError.code
      })
      return NextResponse.json(
        { error: 'Failed to save submission', details: dbError.message },
        { status: 500 }
      )
    }

    console.log('Successfully saved to database:', submissionResult?.id)

    // Wait for AI analysis to complete (started in parallel above)
    const analysis = await analysisPromise
    if (analysis) {
      console.log('AI analysis:', { priority: analysis.priority, tags: analysis.tags })
      // Persist AI summary alongside the submission for admin view
      await supabaseAdmin
        .from('contact_submissions')
        .update({
          additional_details: JSON.stringify({
            ai_summary: analysis.summary,
            ai_priority: analysis.priority,
            ai_tags: analysis.tags,
          }),
        })
        .eq('id', submissionResult.id)
    }

    // Prepare email data with AI-generated context
    const emailData: EmailData = {
      name: submissionData.name,
      email: submissionData.email,
      message: message.trim(),
      phone: submissionData.phone || undefined,
      company: submissionData.company || undefined,
      project_type: submissionData.project_type || undefined,
      aiSummary: analysis?.summary,
      aiPriority: analysis?.priority,
      aiTags: analysis?.tags,
      aiPersonalizedReply: analysis?.personalizedReply,
    }

    console.log('Sending emails...')

    const [clientResult, adminResult] = await Promise.allSettled([
      sendClientConfirmationEmail(emailData),
      sendAdminNotificationEmail(emailData)
    ])

    if (clientResult.status === 'rejected' || (clientResult.status === 'fulfilled' && !clientResult.value.success)) {
      console.error('Failed to send client email:', clientResult.status === 'rejected' ? clientResult.reason : clientResult.value.error)
    } else {
      console.log('Client email sent successfully')
    }

    if (adminResult.status === 'rejected' || (adminResult.status === 'fulfilled' && !adminResult.value.success)) {
      console.error('Failed to send admin email:', adminResult.status === 'rejected' ? adminResult.reason : adminResult.value.error)
    } else {
      console.log('Admin email sent successfully')
    }

    console.log('=== Contact Form Submission Completed Successfully ===')
    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully! We\'ll get back to you within 24 hours.',
      submission_id: submissionResult.id
    })

  } catch (error) {
    console.error('=== Contact Form Submission Failed ===')
    console.error('API Error:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
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
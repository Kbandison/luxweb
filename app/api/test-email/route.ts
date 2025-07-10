import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    console.log('Testing Resend API...')
    console.log('API Key exists:', !!process.env.RESEND_API_KEY)
    console.log('API Key starts with:', process.env.RESEND_API_KEY?.substring(0, 10) + '...')

    const { data, error } = await resend.emails.send({
      from: 'Test <onboarding@resend.dev>',
      to: ['test@example.com'], // This won't actually send, just tests the API
      subject: 'Test Email',
      html: '<p>This is a test email</p>',
    })

    if (error) {
      console.error('Resend Error:', error)
      return NextResponse.json({ success: false, error }, { status: 400 })
    }

    console.log('Resend Success:', data)
    return NextResponse.json({ success: true, data })

  } catch (error) {
    console.error('Test Email Error:', error)
    return NextResponse.json(
      { error: 'Failed to test email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Use POST to test email' })
}
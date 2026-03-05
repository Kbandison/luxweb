import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY);
const adminEmail = process.env.ADMIN_EMAIL;
const fromEmailDomain = process.env.FROM_EMAIL_DOMAIN;

// Parse the FROM_EMAIL_DOMAIN
let parsedFromEmail = 'onboarding@resend.dev';

if (fromEmailDomain) {
  const cleaned = fromEmailDomain.replace(/[<>]/g, '').trim();
  if (cleaned.includes('@')) {
    parsedFromEmail = `LuxWeb Studio <${cleaned}>`;
  } else {
    parsedFromEmail = `LuxWeb Studio <noreply@${cleaned}>`;
  }
}

const fromEmail = parsedFromEmail;
const finalAdminEmail = adminEmail || 'kbandison@gmail.com';

console.log('Email configuration:', {
  hasApiKey: !!process.env.RESEND_API_KEY,
  fromEmailDomain,
  fromEmail,
  adminEmail: finalAdminEmail,
  isProduction: process.env.NODE_ENV === 'production'
});

// Simplified EmailData to match the new contact form
export interface EmailData {
  name: string
  email: string
  message: string
  phone?: string
  company?: string
  project_type?: string
}

const formatProjectType = (type?: string) => {
  if (!type) return null
  const typeMap: Record<string, string> = {
    'starter': 'Starter Package',
    'growth': 'Growth Package',
    'complete': 'Complete Package',
    'enterprise': 'Enterprise Package'
  }
  return typeMap[type] || null
}

// Client confirmation email — dark, premium, matches site aesthetic
export const sendClientConfirmationEmail = async (data: EmailData) => {
  const packageName = formatProjectType(data.project_type)
  const year = new Date().getFullYear()

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>We received your message - LuxWeb Studio</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #010409; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; -webkit-font-smoothing: antialiased;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #010409;">
        <tr>
          <td align="center" style="padding: 48px 16px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 540px;">

              <!-- Logo -->
              <tr>
                <td style="text-align: center; padding-bottom: 40px;">
                  <div style="font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">LuxWeb Studio</div>
                </td>
              </tr>

              <!-- Main Card -->
              <tr>
                <td style="background: #0d0d0f; border-radius: 16px; border: 1px solid rgba(255,255,255,0.06); overflow: hidden;">

                  <!-- Purple accent bar -->
                  <div style="height: 3px; background: linear-gradient(90deg, #7c3aed, #6366f1, #8b5cf6);"></div>

                  <!-- Greeting -->
                  <div style="padding: 40px 36px 0;">
                    <h1 style="margin: 0 0 8px; font-size: 26px; font-weight: 600; color: #ffffff; line-height: 1.3;">
                      Hey ${data.name.split(' ')[0]},
                    </h1>
                    <p style="margin: 0; font-size: 16px; color: #9ca3af; line-height: 1.6;">
                      Thanks for reaching out. We&rsquo;ve got your message and will be in touch within 24 hours.
                    </p>
                  </div>

                  <!-- Message recap -->
                  <div style="padding: 28px 36px;">
                    <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 20px 24px;">
                      <div style="font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Your message</div>
                      <p style="margin: 0; font-size: 14px; color: #d1d5db; line-height: 1.7;">${data.message}</p>
                    </div>

                    ${packageName ? `
                    <div style="margin-top: 16px;">
                      <span style="font-size: 12px; color: #6b7280;">Interested in: </span>
                      <span style="font-size: 12px; font-weight: 600; color: #a78bfa;">${packageName}</span>
                    </div>
                    ` : ''}
                  </div>

                  <!-- Divider -->
                  <div style="margin: 0 36px; height: 1px; background: rgba(255,255,255,0.06);"></div>

                  <!-- Next Steps -->
                  <div style="padding: 28px 36px;">
                    <div style="font-size: 15px; font-weight: 600; color: #ffffff; margin-bottom: 20px;">What happens next</div>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-bottom: 16px; vertical-align: top; width: 36px;">
                          <div style="width: 28px; height: 28px; background: rgba(139,92,246,0.15); border-radius: 8px; text-align: center; line-height: 28px; font-size: 13px; font-weight: 700; color: #a78bfa;">1</div>
                        </td>
                        <td style="padding-bottom: 16px; padding-left: 12px; vertical-align: top;">
                          <div style="font-size: 14px; font-weight: 500; color: #e5e7eb;">We review your project details</div>
                          <div style="font-size: 13px; color: #6b7280; margin-top: 2px;">Understanding your goals and needs</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 16px; vertical-align: top; width: 36px;">
                          <div style="width: 28px; height: 28px; background: rgba(139,92,246,0.15); border-radius: 8px; text-align: center; line-height: 28px; font-size: 13px; font-weight: 700; color: #a78bfa;">2</div>
                        </td>
                        <td style="padding-bottom: 16px; padding-left: 12px; vertical-align: top;">
                          <div style="font-size: 14px; font-weight: 500; color: #e5e7eb;">Free discovery call</div>
                          <div style="font-size: 13px; color: #6b7280; margin-top: 2px;">30 minutes, no pressure, no obligation</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="vertical-align: top; width: 36px;">
                          <div style="width: 28px; height: 28px; background: rgba(139,92,246,0.15); border-radius: 8px; text-align: center; line-height: 28px; font-size: 13px; font-weight: 700; color: #a78bfa;">3</div>
                        </td>
                        <td style="padding-left: 12px; vertical-align: top;">
                          <div style="font-size: 14px; font-weight: 500; color: #e5e7eb;">Custom proposal</div>
                          <div style="font-size: 13px; color: #6b7280; margin-top: 2px;">Tailored plan with timeline and pricing</div>
                        </td>
                      </tr>
                    </table>
                  </div>

                  <!-- Divider -->
                  <div style="margin: 0 36px; height: 1px; background: rgba(255,255,255,0.06);"></div>

                  <!-- Questions prompt -->
                  <div style="padding: 24px 36px;">
                    <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                      Have questions in the meantime? Just reply to this email or reach us at
                      <a href="mailto:support@luxwebstudio.dev" style="color: #a78bfa; text-decoration: none; font-weight: 500;">support@luxwebstudio.dev</a>
                    </p>
                  </div>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 32px 36px; text-align: center;">
                  <div style="font-size: 12px; color: #4b5563;">
                    &copy; ${year} LuxWeb Studio &middot; Professional Web Development
                  </div>
                  <div style="margin-top: 8px;">
                    <a href="https://luxwebstudio.dev" style="font-size: 12px; color: #6b7280; text-decoration: none;">luxwebstudio.dev</a>
                  </div>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: [data.email],
      subject: `Thanks for reaching out, ${data.name.split(' ')[0]} — LuxWeb Studio`,
      html: emailHtml,
    })
    console.log('Client email sent successfully:', result.data?.id)
    return { success: true, data: result }
  } catch (error) {
    console.error('Error sending client email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Admin notification email — dark theme, matches site, quick-action focused
export const sendAdminNotificationEmail = async (data: EmailData) => {
  const packageName = formatProjectType(data.project_type)
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Inquiry — ${data.name}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #010409; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; -webkit-font-smoothing: antialiased;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #010409;">
        <tr>
          <td align="center" style="padding: 48px 16px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 540px;">

              <!-- Header label -->
              <tr>
                <td style="padding-bottom: 24px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                      <td>
                        <span style="font-size: 11px; font-weight: 700; color: #a78bfa; text-transform: uppercase; letter-spacing: 1.5px; background: rgba(139,92,246,0.1); padding: 6px 12px; border-radius: 6px; border: 1px solid rgba(139,92,246,0.2);">New Lead</span>
                      </td>
                      <td style="text-align: right;">
                        <span style="font-size: 12px; color: #6b7280;">${dateStr} &middot; ${timeStr}</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Main Card -->
              <tr>
                <td style="background: #0d0d0f; border-radius: 16px; border: 1px solid rgba(255,255,255,0.06); overflow: hidden;">

                  <!-- Name + Package header -->
                  <div style="padding: 32px 36px; border-bottom: 1px solid rgba(255,255,255,0.06);">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #ffffff; line-height: 1.3;">${data.name}</h1>
                    ${packageName ? `
                    <div style="margin-top: 10px;">
                      <span style="font-size: 12px; font-weight: 600; color: #a78bfa; background: rgba(139,92,246,0.12); padding: 4px 10px; border-radius: 6px;">${packageName}</span>
                    </div>
                    ` : ''}
                  </div>

                  <!-- Contact details grid -->
                  <div style="padding: 24px 36px; border-bottom: 1px solid rgba(255,255,255,0.06);">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-bottom: ${data.phone || data.company ? '14px' : '0'}; vertical-align: top;">
                          <div style="font-size: 10px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Email</div>
                          <a href="mailto:${data.email}" style="font-size: 15px; color: #a78bfa; text-decoration: none; font-weight: 500;">${data.email}</a>
                        </td>
                      </tr>
                      ${data.phone ? `
                      <tr>
                        <td style="padding-bottom: ${data.company ? '14px' : '0'}; vertical-align: top;">
                          <div style="font-size: 10px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Phone</div>
                          <a href="tel:${data.phone}" style="font-size: 15px; color: #d1d5db; text-decoration: none;">${data.phone}</a>
                        </td>
                      </tr>
                      ` : ''}
                      ${data.company ? `
                      <tr>
                        <td style="vertical-align: top;">
                          <div style="font-size: 10px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Company</div>
                          <div style="font-size: 15px; color: #d1d5db;">${data.company}</div>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </div>

                  <!-- Message -->
                  <div style="padding: 24px 36px;">
                    <div style="font-size: 10px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Message</div>
                    <div style="font-size: 15px; color: #d1d5db; line-height: 1.7; white-space: pre-wrap;">${data.message}</div>
                  </div>

                  <!-- Action Buttons -->
                  <div style="padding: 0 36px 32px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-right: 8px; width: 50%;">
                          <a href="mailto:${data.email}?subject=Re: Your inquiry to LuxWeb Studio&body=Hi ${encodeURIComponent(data.name.split(' ')[0])},%0D%0A%0D%0AThanks for reaching out! I'd love to learn more about your project.%0D%0A%0D%0AWould you be available for a quick call this week?%0D%0A%0D%0ABest,%0D%0ALuxWeb Studio" style="display: block; text-align: center; background: linear-gradient(135deg, #7c3aed, #6366f1); color: #ffffff; padding: 12px 20px; border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 600;">
                            Reply to ${data.name.split(' ')[0]}
                          </a>
                        </td>
                        ${data.phone ? `
                        <td style="padding-left: 8px; width: 50%;">
                          <a href="tel:${data.phone}" style="display: block; text-align: center; background: rgba(255,255,255,0.05); color: #d1d5db; padding: 12px 20px; border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 600; border: 1px solid rgba(255,255,255,0.1);">
                            Call ${data.name.split(' ')[0]}
                          </a>
                        </td>
                        ` : `
                        <td style="padding-left: 8px; width: 50%;">
                          <a href="https://luxwebstudio.dev/admin/submissions" style="display: block; text-align: center; background: rgba(255,255,255,0.05); color: #d1d5db; padding: 12px 20px; border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 600; border: 1px solid rgba(255,255,255,0.1);">
                            View in Dashboard
                          </a>
                        </td>
                        `}
                      </tr>
                    </table>
                  </div>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 24px 36px; text-align: center;">
                  <div style="font-size: 12px; color: #4b5563;">
                    LuxWeb Studio &middot; Admin Notification
                  </div>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: [finalAdminEmail],
      subject: `New inquiry from ${data.name}${packageName ? ` — ${packageName}` : ''}`,
      html: emailHtml,
    })
    console.log('Admin email sent successfully:', result.data?.id)
    return { success: true, data: result }
  } catch (error) {
    console.error('Error sending admin email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

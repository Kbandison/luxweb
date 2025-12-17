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

// Client confirmation email - sleek, professional design
export const sendClientConfirmationEmail = async (data: EmailData) => {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>We received your message - LuxWeb Studio</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; background: linear-gradient(180deg, #111111 0%, #0d0d0d 100%); border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); overflow: hidden;">

              <!-- Header -->
              <tr>
                <td style="padding: 48px 40px 32px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.06);">
                  <div style="font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">LuxWeb Studio</div>
                  <div style="font-size: 13px; color: rgba(255,255,255,0.5); margin-top: 4px; letter-spacing: 0.5px;">WEB DEVELOPMENT</div>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding: 40px;">
                  <h1 style="margin: 0 0 16px; font-size: 28px; font-weight: 600; color: #ffffff; line-height: 1.3;">
                    Thanks, ${data.name}!
                  </h1>
                  <p style="margin: 0 0 32px; font-size: 16px; color: rgba(255,255,255,0.7); line-height: 1.6;">
                    We've received your message and will get back to you within 24 hours.
                  </p>

                  <!-- Message Box -->
                  <div style="background: rgba(255,255,255,0.03); border-radius: 12px; padding: 24px; border: 1px solid rgba(255,255,255,0.06);">
                    <div style="font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Your Message</div>
                    <p style="margin: 0; font-size: 15px; color: rgba(255,255,255,0.8); line-height: 1.6;">${data.message}</p>
                  </div>

                  ${data.project_type && formatProjectType(data.project_type) ? `
                  <!-- Package Interest -->
                  <div style="margin-top: 20px; display: flex; align-items: center;">
                    <span style="font-size: 13px; color: rgba(255,255,255,0.5);">Interested in:</span>
                    <span style="margin-left: 8px; font-size: 13px; font-weight: 500; color: #a78bfa;">${formatProjectType(data.project_type)}</span>
                  </div>
                  ` : ''}
                </td>
              </tr>

              <!-- What's Next -->
              <tr>
                <td style="padding: 0 40px 40px;">
                  <div style="background: linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(99,102,241,0.1) 100%); border-radius: 12px; padding: 24px; border: 1px solid rgba(139,92,246,0.2);">
                    <div style="font-size: 14px; font-weight: 600; color: #a78bfa; margin-bottom: 16px;">What happens next?</div>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <table role="presentation" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="width: 24px; height: 24px; background: rgba(139,92,246,0.2); border-radius: 50%; text-align: center; font-size: 12px; font-weight: 600; color: #a78bfa; vertical-align: middle;">1</td>
                              <td style="padding-left: 12px; font-size: 14px; color: rgba(255,255,255,0.7);">We'll review your inquiry</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <table role="presentation" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="width: 24px; height: 24px; background: rgba(139,92,246,0.2); border-radius: 50%; text-align: center; font-size: 12px; font-weight: 600; color: #a78bfa; vertical-align: middle;">2</td>
                              <td style="padding-left: 12px; font-size: 14px; color: rgba(255,255,255,0.7);">Schedule a quick discovery call</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <table role="presentation" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="width: 24px; height: 24px; background: rgba(139,92,246,0.2); border-radius: 50%; text-align: center; font-size: 12px; font-weight: 600; color: #a78bfa; vertical-align: middle;">3</td>
                              <td style="padding-left: 12px; font-size: 14px; color: rgba(255,255,255,0.7);">Get a custom proposal</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 24px 40px; background: rgba(0,0,0,0.3); border-top: 1px solid rgba(255,255,255,0.06);">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="text-align: center;">
                        <div style="font-size: 13px; color: rgba(255,255,255,0.5); margin-bottom: 8px;">
                          <a href="mailto:support@luxwebstudio.dev" style="color: #a78bfa; text-decoration: none;">support@luxwebstudio.dev</a>
                        </div>
                        <div style="font-size: 12px; color: rgba(255,255,255,0.3);">
                          © ${new Date().getFullYear()} LuxWeb Studio
                        </div>
                      </td>
                    </tr>
                  </table>
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
      subject: 'We received your message - LuxWeb Studio',
      html: emailHtml,
    })
    console.log('Client email sent successfully:', result.data?.id)
    return { success: true, data: result }
  } catch (error) {
    console.error('Error sending client email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Admin notification email - clean, actionable design
export const sendAdminNotificationEmail = async (data: EmailData) => {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Inquiry from ${data.name}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; background: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden;">

              <!-- Header -->
              <tr>
                <td style="padding: 24px 32px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                      <td>
                        <div style="font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.8); text-transform: uppercase; letter-spacing: 1px;">New Inquiry</div>
                        <div style="font-size: 20px; font-weight: 600; color: #ffffff; margin-top: 4px;">${data.name}</div>
                      </td>
                      <td style="text-align: right;">
                        <div style="font-size: 12px; color: rgba(255,255,255,0.7);">${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        <div style="font-size: 12px; color: rgba(255,255,255,0.7);">${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Contact Info -->
              <tr>
                <td style="padding: 24px 32px; border-bottom: 1px solid #e5e7eb;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="padding-bottom: 12px;">
                        <div style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;">Email</div>
                        <a href="mailto:${data.email}" style="font-size: 15px; color: #6366f1; text-decoration: none; font-weight: 500;">${data.email}</a>
                      </td>
                    </tr>
                    ${data.phone ? `
                    <tr>
                      <td style="padding-bottom: 12px;">
                        <div style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;">Phone</div>
                        <a href="tel:${data.phone}" style="font-size: 15px; color: #374151; text-decoration: none;">${data.phone}</a>
                      </td>
                    </tr>
                    ` : ''}
                    ${data.company ? `
                    <tr>
                      <td>
                        <div style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;">Company</div>
                        <div style="font-size: 15px; color: #374151;">${data.company}</div>
                      </td>
                    </tr>
                    ` : ''}
                  </table>
                </td>
              </tr>

              <!-- Message -->
              <tr>
                <td style="padding: 24px 32px;">
                  <div style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Message</div>
                  <div style="font-size: 15px; color: #374151; line-height: 1.6; white-space: pre-wrap;">${data.message}</div>

                  ${data.project_type && formatProjectType(data.project_type) ? `
                  <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
                    <div style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Package Interest</div>
                    <div style="display: inline-block; font-size: 13px; font-weight: 500; color: #6366f1; background: #eef2ff; padding: 4px 12px; border-radius: 16px;">${formatProjectType(data.project_type)}</div>
                  </div>
                  ` : ''}
                </td>
              </tr>

              <!-- Action Button -->
              <tr>
                <td style="padding: 0 32px 32px;">
                  <a href="mailto:${data.email}?subject=Re: Your inquiry to LuxWeb Studio&body=Hi ${data.name},%0D%0A%0D%0AThank you for reaching out! I'd love to learn more about your project.%0D%0A%0D%0AWould you be available for a quick call this week?%0D%0A%0D%0ABest,%0D%0ALuxWeb Studio" style="display: block; text-align: center; background: #6366f1; color: #ffffff; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">
                    Reply to ${data.name.split(' ')[0]}
                  </a>
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
      subject: `New inquiry from ${data.name}`,
      html: emailHtml,
    })
    console.log('Admin email sent successfully:', result.data?.id)
    return { success: true, data: result }
  } catch (error) {
    console.error('Error sending admin email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Client invitation email (keeping for portal functionality)
export interface ClientInvitationData {
  client_name: string
  client_email: string
  company_name?: string | null
  project_name?: string | null
  project_type?: string
  temporary_password: string
  login_url: string
  personal_message?: string | null
}

export const sendClientInvitationEmail = async (data: ClientInvitationData) => {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Client Portal Access - LuxWeb Studio</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; background: linear-gradient(180deg, #111111 0%, #0d0d0d 100%); border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); overflow: hidden;">

              <!-- Header -->
              <tr>
                <td style="padding: 48px 40px 32px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.06);">
                  <div style="font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">LuxWeb Studio</div>
                  <div style="font-size: 13px; color: rgba(255,255,255,0.5); margin-top: 4px; letter-spacing: 0.5px;">CLIENT PORTAL</div>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding: 40px;">
                  <h1 style="margin: 0 0 16px; font-size: 28px; font-weight: 600; color: #ffffff; line-height: 1.3;">
                    Welcome, ${data.client_name}!
                  </h1>
                  <p style="margin: 0 0 32px; font-size: 16px; color: rgba(255,255,255,0.7); line-height: 1.6;">
                    Your client portal is ready. Track your project progress, access files, and communicate with our team.
                  </p>

                  ${data.personal_message ? `
                  <div style="background: rgba(139,92,246,0.1); border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid rgba(139,92,246,0.2);">
                    <p style="margin: 0; font-size: 15px; color: rgba(255,255,255,0.8); line-height: 1.6; font-style: italic;">${data.personal_message}</p>
                  </div>
                  ` : ''}

                  <!-- Credentials -->
                  <div style="background: rgba(255,255,255,0.03); border-radius: 12px; padding: 24px; border: 1px solid rgba(255,255,255,0.06);">
                    <div style="font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px;">Login Credentials</div>

                    <div style="margin-bottom: 16px;">
                      <div style="font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 4px;">Email</div>
                      <div style="font-size: 15px; color: #ffffff; font-family: 'Monaco', 'Menlo', monospace;">${data.client_email}</div>
                    </div>

                    <div>
                      <div style="font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 4px;">Temporary Password</div>
                      <div style="font-size: 15px; color: #ffffff; font-family: 'Monaco', 'Menlo', monospace; background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 6px; display: inline-block;">${data.temporary_password}</div>
                    </div>
                  </div>

                  <!-- CTA Button -->
                  <div style="margin-top: 24px; text-align: center;">
                    <a href="${data.login_url}" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; padding: 16px 32px; border-radius: 10px; text-decoration: none; font-size: 15px; font-weight: 600;">
                      Access Your Portal
                    </a>
                  </div>

                  <!-- Security Note -->
                  <p style="margin: 24px 0 0; font-size: 13px; color: rgba(255,255,255,0.4); text-align: center;">
                    Please change your password after your first login.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 24px 40px; background: rgba(0,0,0,0.3); border-top: 1px solid rgba(255,255,255,0.06);">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="text-align: center;">
                        <div style="font-size: 13px; color: rgba(255,255,255,0.5); margin-bottom: 8px;">
                          <a href="mailto:support@luxwebstudio.dev" style="color: #a78bfa; text-decoration: none;">support@luxwebstudio.dev</a>
                        </div>
                        <div style="font-size: 12px; color: rgba(255,255,255,0.3);">
                          © ${new Date().getFullYear()} LuxWeb Studio
                        </div>
                      </td>
                    </tr>
                  </table>
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
      to: [data.client_email],
      subject: 'Your Client Portal Access - LuxWeb Studio',
      html: emailHtml,
    })
    console.log('Client invitation email sent successfully:', result.data?.id)
    return { success: true, data: result }
  } catch (error) {
    console.error('Error sending client invitation email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

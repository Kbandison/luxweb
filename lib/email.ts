import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY);
const adminEmail = process.env.ADMIN_EMAIL;
const fromEmail = process.env.FROM_EMAIL_DOMAIN;

export interface EmailData {
  name: string
  email: string
  phone?: string
  company?: string
  project_type: string
  project_goals: string
  budget_range: string
  message?: string
}

const formatProjectType = (type: string) => {
  const typeMap = {
    'starter': 'Starter Package',
    'growth': 'Growth Package', 
    'complete': 'Complete Package',
    'enterprise': 'Enterprise Package'
  }
  return typeMap[type as keyof typeof typeMap] || type
}

const formatBudgetRange = (range: string) => {
  const rangeMap = {
    'under-1k': 'Under $1,000',
    '1k-3k': '$1,000 - $3,000',
    '3k-5k': '$3,000 - $5,000', 
    '5k-10k': '$5,000 - $10,000',
    '10k-plus': '$10,000+',
    'discuss': 'Let\'s discuss'
  }
  return rangeMap[range as keyof typeof rangeMap] || range
}

export const sendClientConfirmationEmail = async (data: EmailData) => {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You - LuxWeb Studio</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          background: #f8fafc;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 20px;
        }
        .message {
          font-size: 16px;
          color: #4b5563;
          margin-bottom: 30px;
        }
        .details-box {
          background: #f8fafc;
          border-radius: 8px;
          padding: 25px;
          margin: 30px 0;
          border-left: 4px solid #6366f1;
        }
        .detail-row {
          display: flex;
          margin-bottom: 12px;
          align-items: flex-start;
        }
        .detail-label {
          font-weight: 600;
          color: #374151;
          min-width: 140px;
          flex-shrink: 0;
        }
        .detail-value {
          color: #6b7280;
          flex: 1;
        }
        .next-steps {
          background: #ecfdf5;
          border-radius: 8px;
          padding: 25px;
          margin: 30px 0;
          border-left: 4px solid #10b981;
        }
        .step {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }
        .step-number {
          background: #10b981;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          font-size: 12px;
          font-weight: bold;
          margin-right: 15px;
          flex-shrink: 0;
          text-align: center;
          line-height: 24px;
          display: inline-block;
        }
        .footer {
          background: #1f2937;
          color: #9ca3af;
          padding: 30px;
          text-align: center;
          font-size: 14px;
        }
        .footer-link {
          color: #6366f1;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">LuxWeb Studio</div>
          <div>Professional Web Development</div>
        </div>
        
        <div class="content">
          <div class="greeting">Thank you, ${data.name}!</div>
          
          <div class="message">
            We've received your project inquiry and are excited to help bring your vision to life. 
            Your request has been submitted successfully and our team will review it shortly.
          </div>
          
          <div class="details-box">
            <h3 style="margin-top: 0; color: #1f2937;">Your Project Details</h3>
            <div class="detail-row">
              <div class="detail-label">Package:</div>
              <div class="detail-value">${formatProjectType(data.project_type)}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Budget Range:</div>
              <div class="detail-value">${formatBudgetRange(data.budget_range)}</div>
            </div>
            ${data.company ? `
            <div class="detail-row">
              <div class="detail-label">Company:</div>
              <div class="detail-value">${data.company}</div>
            </div>
            ` : ''}
            <div class="detail-row">
              <div class="detail-label">Project Goals:</div>
              <div class="detail-value">${data.project_goals}</div>
            </div>
            ${data.message ? `
            <div class="detail-row">
              <div class="detail-label">Additional Details:</div>
              <div class="detail-value">${data.message}</div>
            </div>
            ` : ''}
          </div>
          
          <div class="next-steps">
            <h3 style="margin-top: 0; color: #1f2937;">What Happens Next?</h3>
            <div class="step">
              <div class="step-number">1</div>
              <div>We'll review your project requirements within 24 hours</div>
            </div>
            <div class="step">
              <div class="step-number">2</div>
              <div>Schedule a free consultation call to discuss your vision</div>
            </div>
            <div class="step">
              <div class="step-number">3</div>
              <div>Receive a customized proposal and timeline</div>
            </div>
            <div class="step">
              <div class="step-number">4</div>
              <div>Start building your amazing website!</div>
            </div>
          </div>
          
          <div class="message">
            Have questions in the meantime? Feel free to reply to this email or give us a call. 
            We're here to help make your project a success!
          </div>
        </div>
        
        <div class="footer">
          <div style="margin-bottom: 15px;">
            <strong>LuxWeb Studio</strong><br>
            Creating stunning, high-converting websites
          </div>
          <div>
            <a href="mailto:support@luxwebstudio.dev" class="footer-link">support@luxwebstudio.dev</a> | 
            <a href="tel:+17186350736" class="footer-link">(718) 635-0736</a>
          </div>
          <div style="margin-top: 15px; font-size: 12px;">
            This email was sent because you submitted a project inquiry on our website.
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    await resend.emails.send({
      from: `LuxWeb Studio ${fromEmail}`, // Use Resend's test domain for now
      to: [data.email],
      subject: 'Thank you for your project inquiry - LuxWeb Studio',
      html: emailHtml,
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending client email:', error)
    return { success: false, error }
  }
}

export const sendAdminNotificationEmail = async (data: EmailData) => {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Project Inquiry - LuxWeb Studio</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          background: #f8fafc;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .alert-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 15px;
          display: inline-block;
        }
        .content {
          padding: 40px 30px;
        }
        .client-info {
          background: #fef3f2;
          border-radius: 8px;
          padding: 25px;
          margin: 30px 0;
          border-left: 4px solid #dc2626;
        }
        .project-info {
          background: #f0f9ff;
          border-radius: 8px;
          padding: 25px;
          margin: 30px 0;
          border-left: 4px solid #0ea5e9;
        }
        .detail-row {
          display: flex;
          margin-bottom: 12px;
          align-items: flex-start;
        }
        .detail-label {
          font-weight: 600;
          color: #374151;
          min-width: 140px;
          flex-shrink: 0;
        }
        .detail-value {
          color: #6b7280;
          flex: 1;
        }
        .priority-high {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 600;
          display: inline-block;
          margin: 15px 0;
        }
        .action-required {
          background: #fffbeb;
          border-radius: 8px;
          padding: 25px;
          margin: 30px 0;
          border-left: 4px solid #f59e0b;
        }
        .cta-button {
          background: #6366f1;
          color: white;
          padding: 12px 24px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          display: inline-block;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="alert-badge">🚨 NEW INQUIRY</div>
          <h1 style="margin: 0; font-size: 24px;">New Project Inquiry</h1>
          <div>LuxWeb Studio Admin Panel</div>
        </div>
        
        <div class="content">
          <div class="priority-high">⚡ Action Required - Respond within 24 hours</div>
          
          <div class="client-info">
            <h3 style="margin-top: 0; color: #1f2937;">👤 Client Information</h3>
            <div class="detail-row">
              <div class="detail-label">Name:</div>
              <div class="detail-value"><strong>${data.name}</strong></div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Email:</div>
              <div class="detail-value"><a href="mailto:${data.email}">${data.email}</a></div>
            </div>
            ${data.phone ? `
            <div class="detail-row">
              <div class="detail-label">Phone:</div>
              <div class="detail-value"><a href="tel:${data.phone}">${data.phone}</a></div>
            </div>
            ` : ''}
            ${data.company ? `
            <div class="detail-row">
              <div class="detail-label">Company:</div>
              <div class="detail-value">${data.company}</div>
            </div>
            ` : ''}
          </div>
          
          <div class="project-info">
            <h3 style="margin-top: 0; color: #1f2937;">🚀 Project Details</h3>
            <div class="detail-row">
              <div class="detail-label">Package Interest:</div>
              <div class="detail-value"><strong>${formatProjectType(data.project_type)}</strong></div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Budget Range:</div>
              <div class="detail-value"><strong>${formatBudgetRange(data.budget_range)}</strong></div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Project Goals:</div>
              <div class="detail-value">${data.project_goals}</div>
            </div>
            ${data.message ? `
            <div class="detail-row">
              <div class="detail-label">Additional Details:</div>
              <div class="detail-value">${data.message}</div>
            </div>
            ` : ''}
          </div>
          
          <div class="action-required">
            <h3 style="margin-top: 0; color: #1f2937;">📋 Recommended Next Steps</h3>
            <ul style="margin: 15px 0; padding-left: 20px;">
              <li>Review project requirements and budget alignment</li>
              <li>Send personalized follow-up email within 24 hours</li>
              <li>Schedule discovery call if project is a good fit</li>
              <li>Add to CRM/project management system</li>
            </ul>
            
            <a href="mailto:${data.email}?subject=Re: Your Project Inquiry - Let's Schedule a Call&body=Hi ${data.name},%0D%0A%0D%0AThank you for reaching out about your ${formatProjectType(data.project_type).toLowerCase()} project. I've reviewed your requirements and would love to discuss how we can help bring your vision to life.%0D%0A%0D%0AWould you be available for a quick 15-minute call this week to discuss your project in more detail?%0D%0A%0D%0ABest regards,%0D%0A[Your Name]%0D%0ALuxWeb Studio" class="cta-button">
              📧 Reply to Client
            </a>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">
            <strong>Submission Time:</strong> ${new Date().toLocaleString()}<br>
            <strong>Source:</strong> Website Contact Form
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    await resend.emails.send({
      from: `LuxWeb Studio ${fromEmail}`, // Use Resend's test domain for now
      to: [adminEmail || 'admin@example.com'], // Will use environment variable
      subject: `🚨 New Project Inquiry from ${data.name} - ${formatProjectType(data.project_type)}`,
      html: emailHtml,
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending admin email:', error)
    return { success: false, error }
  }
}
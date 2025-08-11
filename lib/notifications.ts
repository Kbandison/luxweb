import { supabaseAdmin } from '@/lib/supabase-server'

export interface NotificationData {
  client_id: string
  type: 'project_update' | 'invoice_sent' | 'payment_received' | 'file_shared' | 'milestone_completed' | 'message_received'
  title: string
  message: string
  link?: string
  project_id?: string
  invoice_id?: string
  file_id?: string
  priority: 'low' | 'medium' | 'high'
  metadata?: Record<string, any>
}

export async function createNotification(data: NotificationData) {
  try {
    const { error } = await supabaseAdmin
      .from('notifications')
      .insert({
        client_id: data.client_id,
        type: data.type,
        title: data.title,
        message: data.message,
        link: data.link,
        project_id: data.project_id,
        invoice_id: data.invoice_id,
        file_id: data.file_id,
        priority: data.priority,
        metadata: data.metadata,
        read: false,
        sent_via_email: false,
        sent_via_sms: false
      })

    if (error) {
      console.error('Error creating notification:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Notification creation error:', error)
    return false
  }
}

export async function sendEmailNotification(
  clientId: string, 
  subject: string, 
  content: string, 
  notificationId?: string
) {
  try {
    // Get client email preferences
    const { data: client, error: clientError } = await supabaseAdmin
      .from('clients')
      .select('email, primary_contact, communication_preferences')
      .eq('id', clientId)
      .single()

    if (clientError || !client) {
      console.error('Error fetching client for email:', clientError)
      return false
    }

    // Check if client wants email notifications
    if (!client.communication_preferences?.email) {
      console.log('Client has disabled email notifications')
      return false
    }

    // TODO: Integrate with email service (Resend, SendGrid, etc.)
    // For now, we'll simulate the email sending
    console.log('Would send email to:', client.email)
    console.log('Subject:', subject)
    console.log('Content:', content)

    // Update notification as sent via email if notificationId provided
    if (notificationId) {
      await supabaseAdmin
        .from('notifications')
        .update({ sent_via_email: true, email_sent_at: new Date().toISOString() })
        .eq('id', notificationId)
    }

    // Log the communication
    await supabaseAdmin
      .from('client_communications')
      .insert({
        client_id: clientId,
        type: 'email',
        direction: 'outbound',
        subject: subject,
        content: content,
        sent_by: 'system',
        delivered_at: new Date().toISOString()
      })

    return true
  } catch (error) {
    console.error('Email notification error:', error)
    return false
  }
}

export async function sendSMSNotification(
  clientId: string, 
  message: string, 
  notificationId?: string
) {
  try {
    // Get client phone and preferences
    const { data: client, error: clientError } = await supabaseAdmin
      .from('clients')
      .select('phone, primary_contact, communication_preferences')
      .eq('id', clientId)
      .single()

    if (clientError || !client) {
      console.error('Error fetching client for SMS:', clientError)
      return false
    }

    // Check if client wants SMS notifications and has phone number
    if (!client.communication_preferences?.sms || !client.phone) {
      console.log('Client has disabled SMS notifications or no phone number')
      return false
    }

    // TODO: Integrate with SMS service (Twilio, etc.)
    // For now, we'll simulate the SMS sending
    console.log('Would send SMS to:', client.phone)
    console.log('Message:', message)

    // Update notification as sent via SMS if notificationId provided
    if (notificationId) {
      await supabaseAdmin
        .from('notifications')
        .update({ sent_via_sms: true, sms_sent_at: new Date().toISOString() })
        .eq('id', notificationId)
    }

    // Log the communication
    await supabaseAdmin
      .from('client_communications')
      .insert({
        client_id: clientId,
        type: 'sms',
        direction: 'outbound',
        content: message,
        sent_by: 'system',
        delivered_at: new Date().toISOString()
      })

    return true
  } catch (error) {
    console.error('SMS notification error:', error)
    return false
  }
}

export async function notifyProjectUpdate(
  clientId: string,
  projectId: string,
  updateType: 'status_change' | 'milestone_completed' | 'file_added' | 'comment_added',
  details: string
) {
  const notification: NotificationData = {
    client_id: clientId,
    type: 'project_update',
    title: 'Project Update',
    message: details,
    link: `/portal/projects/${projectId}`,
    project_id: projectId,
    priority: 'medium',
    metadata: { updateType }
  }

  const success = await createNotification(notification)
  
  if (success) {
    // Send email notification for important updates
    if (updateType === 'milestone_completed' || updateType === 'status_change') {
      await sendEmailNotification(
        clientId,
        'Project Update - LuxWeb Studio',
        `Hello! We have an update on your project: ${details}. View details in your client portal.`
      )
    }
  }

  return success
}

export async function notifyInvoiceSent(clientId: string, invoiceId: string, invoiceNumber: string, amount: number) {
  const notification: NotificationData = {
    client_id: clientId,
    type: 'invoice_sent',
    title: 'New Invoice',
    message: `Invoice ${invoiceNumber} for $${amount.toLocaleString()} has been sent`,
    link: `/portal/invoices/${invoiceId}`,
    invoice_id: invoiceId,
    priority: 'high'
  }

  const success = await createNotification(notification)
  
  if (success) {
    // Always send email for invoice notifications
    await sendEmailNotification(
      clientId,
      `Invoice ${invoiceNumber} - LuxWeb Studio`,
      `Your invoice ${invoiceNumber} for $${amount.toLocaleString()} is ready. Please review and pay at your earliest convenience.`
    )
  }

  return success
}

export async function notifyPaymentReceived(clientId: string, invoiceId: string, amount: number) {
  const notification: NotificationData = {
    client_id: clientId,
    type: 'payment_received',
    title: 'Payment Confirmed',
    message: `Payment of $${amount.toLocaleString()} has been received`,
    link: `/portal/invoices/${invoiceId}`,
    invoice_id: invoiceId,
    priority: 'medium'
  }

  const success = await createNotification(notification)
  
  if (success) {
    await sendEmailNotification(
      clientId,
      'Payment Confirmation - LuxWeb Studio',
      `Thank you! We've received your payment of $${amount.toLocaleString()}. Your invoice has been marked as paid.`
    )
  }

  return success
}

export async function notifyFileShared(clientId: string, fileName: string, fileId: string, projectId?: string) {
  const notification: NotificationData = {
    client_id: clientId,
    type: 'file_shared',
    title: 'New File Shared',
    message: `File "${fileName}" has been shared with you`,
    link: projectId ? `/portal/projects/${projectId}` : '/portal/files',
    project_id: projectId,
    file_id: fileId,
    priority: 'low'
  }

  return await createNotification(notification)
}
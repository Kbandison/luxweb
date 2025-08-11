import { supabaseAdmin } from '@/lib/supabase-server'
import { 
  notifyProjectUpdate, 
  notifyInvoiceSent, 
  notifyPaymentReceived, 
  notifyFileShared 
} from '@/lib/notifications'

// Workflow triggers for various events
export class WorkflowEngine {
  // Project workflows
  static async onProjectStatusChange(projectId: string, oldStatus: string, newStatus: string) {
    try {
      // Get project details
      const { data: project, error } = await supabaseAdmin
        .from('projects')
        .select(`
          *,
          client:clients(id, primary_contact, email)
        `)
        .eq('id', projectId)
        .single()

      if (error || !project) {
        console.error('Error fetching project for workflow:', error)
        return
      }

      // Send notification for status changes
      await notifyProjectUpdate(
        project.client_id,
        projectId,
        'status_change',
        `Your project "${project.project_name}" status changed from ${oldStatus} to ${newStatus}`
      )

      // Specific workflows for different status changes
      switch (newStatus) {
        case 'in_progress':
          await this.onProjectStarted(project)
          break
        case 'review':
          await this.onProjectReadyForReview(project)
          break
        case 'completed':
          await this.onProjectCompleted(project)
          break
        case 'on_hold':
          await this.onProjectOnHold(project)
          break
      }

      // Log workflow execution
      await this.logWorkflowExecution(projectId, 'project_status_change', {
        oldStatus,
        newStatus,
        clientId: project.client_id
      })

    } catch (error) {
      console.error('Project status change workflow error:', error)
    }
  }

  static async onProjectStarted(project: any) {
    // Create initial milestones if they don't exist
    const { data: existingMilestones } = await supabaseAdmin
      .from('project_milestones')
      .select('id')
      .eq('project_id', project.id)

    if (!existingMilestones || existingMilestones.length === 0) {
      // Create default milestones based on project type
      const defaultMilestones = this.getDefaultMilestones(project.project_type)
      
      for (const milestone of defaultMilestones) {
        await supabaseAdmin
          .from('project_milestones')
          .insert({
            project_id: project.id,
            title: milestone.title,
            description: milestone.description,
            milestone_order: milestone.order,
            requires_client_action: milestone.requiresClientAction || false
          })
      }
    }

    // Set project start date if not set
    if (!project.start_date) {
      await supabaseAdmin
        .from('projects')
        .update({ start_date: new Date().toISOString().split('T')[0] })
        .eq('id', project.id)
    }
  }

  static async onProjectReadyForReview(project: any) {
    // Notify client for review
    await notifyProjectUpdate(
      project.client_id,
      project.id,
      'status_change',
      `Your project "${project.project_name}" is ready for review. Please check the latest updates and provide feedback.`
    )

    // Create review milestone if it doesn't exist
    const { data: reviewMilestone } = await supabaseAdmin
      .from('project_milestones')
      .select('id')
      .eq('project_id', project.id)
      .eq('title', 'Client Review')
      .single()

    if (!reviewMilestone) {
      await supabaseAdmin
        .from('project_milestones')
        .insert({
          project_id: project.id,
          title: 'Client Review',
          description: 'Client review and feedback collection',
          milestone_order: 90,
          requires_client_action: true,
          status: 'in_progress'
        })
    }
  }

  static async onProjectCompleted(project: any) {
    // Set actual completion date
    await supabaseAdmin
      .from('projects')
      .update({ actual_completion: new Date().toISOString() })
      .eq('id', project.id)

    // Mark all milestones as completed
    await supabaseAdmin
      .from('project_milestones')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('project_id', project.id)
      .neq('status', 'completed')

    // Send completion notification
    await notifyProjectUpdate(
      project.client_id,
      project.id,
      'status_change',
      `Congratulations! Your project "${project.project_name}" has been completed. Thank you for working with LuxWeb Studio!`
    )

    // Auto-generate final invoice if none exists
    const { data: existingInvoices } = await supabaseAdmin
      .from('invoices')
      .select('id')
      .eq('project_id', project.id)

    if (!existingInvoices || existingInvoices.length === 0) {
      await this.autoGenerateProjectInvoice(project)
    }
  }

  static async onProjectOnHold(project: any) {
    // Pause all active milestones
    await supabaseAdmin
      .from('project_milestones')
      .update({ status: 'pending' })
      .eq('project_id', project.id)
      .eq('status', 'in_progress')
  }

  // Milestone workflows
  static async onMilestoneCompleted(milestoneId: string) {
    try {
      const { data: milestone, error } = await supabaseAdmin
        .from('project_milestones')
        .select(`
          *,
          project:projects(
            id,
            project_name,
            client_id
          )
        `)
        .eq('id', milestoneId)
        .single()

      if (error || !milestone) {
        console.error('Error fetching milestone for workflow:', error)
        return
      }

      // Notify client of milestone completion
      await notifyProjectUpdate(
        milestone.project.client_id,
        milestone.project_id,
        'milestone_completed',
        `Milestone "${milestone.title}" has been completed for project "${milestone.project.project_name}"`
      )

      // Check if all milestones are completed
      const { data: allMilestones } = await supabaseAdmin
        .from('project_milestones')
        .select('status')
        .eq('project_id', milestone.project_id)

      const completedCount = allMilestones?.filter(m => m.status === 'completed').length || 0
      const totalCount = allMilestones?.length || 0

      // If all milestones completed, suggest project completion
      if (completedCount === totalCount && totalCount > 0) {
        await supabaseAdmin
          .from('projects')
          .update({ status: 'completed' })
          .eq('id', milestone.project_id)
          .eq('status', 'in_progress') // Only if currently in progress
      }

      await this.logWorkflowExecution(milestone.project_id, 'milestone_completed', {
        milestoneId,
        milestoneTitle: milestone.title,
        clientId: milestone.project.client_id
      })

    } catch (error) {
      console.error('Milestone completion workflow error:', error)
    }
  }

  // Invoice workflows
  static async onInvoiceCreated(invoiceId: string) {
    try {
      const { data: invoice, error } = await supabaseAdmin
        .from('invoices')
        .select(`
          *,
          client:clients(id, primary_contact, email)
        `)
        .eq('id', invoiceId)
        .single()

      if (error || !invoice) {
        console.error('Error fetching invoice for workflow:', error)
        return
      }

      // If invoice is in sent status, trigger notification
      if (invoice.status === 'sent') {
        await notifyInvoiceSent(
          invoice.client_id,
          invoiceId,
          invoice.invoice_number,
          invoice.total_amount
        )
      }

      await this.logWorkflowExecution(invoiceId, 'invoice_created', {
        invoiceNumber: invoice.invoice_number,
        amount: invoice.total_amount,
        clientId: invoice.client_id
      })

    } catch (error) {
      console.error('Invoice creation workflow error:', error)
    }
  }

  static async onPaymentReceived(paymentId: string) {
    try {
      const { data: payment, error } = await supabaseAdmin
        .from('payments')
        .select(`
          *,
          invoice:invoices(
            id,
            invoice_number,
            client_id,
            total_amount
          )
        `)
        .eq('id', paymentId)
        .single()

      if (error || !payment) {
        console.error('Error fetching payment for workflow:', error)
        return
      }

      // Update invoice status to paid if full payment received
      const { data: allPayments } = await supabaseAdmin
        .from('payments')
        .select('amount')
        .eq('invoice_id', payment.invoice_id)
        .eq('status', 'completed')

      const totalPaid = allPayments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0
      
      if (totalPaid >= payment.invoice.total_amount) {
        await supabaseAdmin
          .from('invoices')
          .update({ status: 'paid' })
          .eq('id', payment.invoice_id)

        // Send payment confirmation
        await notifyPaymentReceived(
          payment.invoice.client_id,
          payment.invoice_id,
          payment.amount
        )
      }

      await this.logWorkflowExecution(payment.invoice_id, 'payment_received', {
        paymentId,
        amount: payment.amount,
        clientId: payment.invoice.client_id
      })

    } catch (error) {
      console.error('Payment received workflow error:', error)
    }
  }

  // File workflows
  static async onFileUploaded(fileId: string, uploadedBy: 'client' | 'admin') {
    try {
      const { data: file, error } = await supabaseAdmin
        .from('project_files')
        .select(`
          *,
          project:projects(project_name),
          client:clients(id, primary_contact)
        `)
        .eq('id', fileId)
        .single()

      if (error || !file) {
        console.error('Error fetching file for workflow:', error)
        return
      }

      // If uploaded by admin and is public, notify client
      if (uploadedBy === 'admin' && file.is_public) {
        await notifyFileShared(
          file.client_id,
          file.original_filename,
          fileId,
          file.project_id
        )
      }

      await this.logWorkflowExecution(file.project_id || fileId, 'file_uploaded', {
        fileId,
        fileName: file.original_filename,
        uploadedBy,
        clientId: file.client_id
      })

    } catch (error) {
      console.error('File upload workflow error:', error)
    }
  }

  // Utility methods
  static getDefaultMilestones(projectType: string) {
    const milestoneTemplates: Record<string, any[]> = {
      starter: [
        { title: 'Requirements Gathering', description: 'Collect project requirements and assets', order: 10 },
        { title: 'Design & Mockups', description: 'Create initial design concepts', order: 20 },
        { title: 'Development', description: 'Build the website', order: 30 },
        { title: 'Content Integration', description: 'Add content and images', order: 40 },
        { title: 'Testing & Review', description: 'Test functionality and client review', order: 50, requiresClientAction: true },
        { title: 'Launch', description: 'Deploy website live', order: 60 }
      ],
      growth: [
        { title: 'Discovery & Planning', description: 'Project discovery and technical planning', order: 10 },
        { title: 'Wireframes & Design', description: 'Create wireframes and visual designs', order: 20 },
        { title: 'Frontend Development', description: 'Build user interface and interactions', order: 30 },
        { title: 'Backend Development', description: 'Implement server-side functionality', order: 40 },
        { title: 'Content Management', description: 'Set up CMS and content integration', order: 50 },
        { title: 'Testing & QA', description: 'Comprehensive testing and quality assurance', order: 60 },
        { title: 'Client Review', description: 'Client testing and feedback', order: 70, requiresClientAction: true },
        { title: 'Launch & Deployment', description: 'Deploy to production environment', order: 80 }
      ],
      complete: [
        { title: 'Project Kickoff', description: 'Initial meeting and project setup', order: 10 },
        { title: 'Research & Analysis', description: 'Market research and competitor analysis', order: 20 },
        { title: 'Architecture Planning', description: 'Technical architecture and system design', order: 30 },
        { title: 'UI/UX Design', description: 'Complete user interface and experience design', order: 40 },
        { title: 'Database Design', description: 'Database schema and data modeling', order: 50 },
        { title: 'API Development', description: 'Backend API and services development', order: 60 },
        { title: 'Frontend Development', description: 'Client-side application development', order: 70 },
        { title: 'Integration Testing', description: 'System integration and testing', order: 80 },
        { title: 'Performance Optimization', description: 'Speed and performance improvements', order: 90 },
        { title: 'Client Acceptance Testing', description: 'Client review and acceptance', order: 100, requiresClientAction: true },
        { title: 'Production Deployment', description: 'Deploy to production environment', order: 110 },
        { title: 'Post-Launch Support', description: 'Initial support and monitoring', order: 120 }
      ]
    }

    return milestoneTemplates[projectType] || milestoneTemplates.starter
  }

  static async autoGenerateProjectInvoice(project: any) {
    try {
      if (!project.total_value) return

      const invoiceNumber = `INV-${Date.now()}`
      
      await supabaseAdmin
        .from('invoices')
        .insert({
          invoice_number: invoiceNumber,
          client_id: project.client_id,
          project_id: project.id,
          status: 'draft',
          amount: project.total_value,
          tax_amount: project.total_value * 0.085, // 8.5% tax
          total_amount: project.total_value * 1.085,
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
          line_items: [
            {
              description: `${project.project_name} - Project Completion`,
              quantity: 1,
              rate: project.total_value,
              amount: project.total_value
            }
          ]
        })

    } catch (error) {
      console.error('Auto invoice generation error:', error)
    }
  }

  static async logWorkflowExecution(resourceId: string, workflowType: string, metadata: any) {
    try {
      await supabaseAdmin
        .from('workflow_logs')
        .insert({
          resource_id: resourceId,
          workflow_type: workflowType,
          metadata,
          executed_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('Workflow logging error:', error)
    }
  }
}
import { supabaseAdmin } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Create a test client
    const { data: client, error: clientError } = await supabaseAdmin
      .from('clients')
      .insert([
        {
          primary_contact: 'John Doe',
          email: 'john@example.com',
          phone: '(555) 123-4567',
          company_name: 'Example Corp',
          status: 'active',
          brand_colors: {
            primary: '#2d1b69',
            secondary: '#7c3aed',
            accent: '#d4b3ff'
          },
          notes: 'Test client for CRM setup'
        }
      ])
      .select()
      .single()

    if (clientError) throw clientError

    // Create a test project
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .insert([
        {
          client_id: client.id,
          project_name: 'Company Website Redesign',
          project_type: 'growth',
          description: 'Modern, responsive website redesign',
          total_value: 2400.00,
          status: 'in_progress',
          start_date: new Date().toISOString().split('T')[0],
          target_completion: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 2 weeks from now
        }
      ])
      .select()
      .single()

    if (projectError) throw projectError

    // Create test project tasks
    const { error: tasksError } = await supabaseAdmin
      .from('project_tasks')
      .insert([
        {
          project_id: project.id,
          title: 'Discovery Call',
          description: 'Initial consultation and requirements gathering',
          task_order: 1,
          status: 'completed',
          requires_client_action: true,
          completed_at: new Date().toISOString()
        },
        {
          project_id: project.id,
          title: 'Design Mockups',
          description: 'Create initial design concepts',
          task_order: 2,
          status: 'in_progress',
          requires_client_action: false,
        },
        {
          project_id: project.id,
          title: 'Client Review',
          description: 'Client feedback on designs',
          task_order: 3,
          status: 'pending',
          requires_client_action: true,
        }
      ])

    if (tasksError) throw tasksError

    // Create a test communication
    const { error: commError } = await supabaseAdmin
      .from('client_communications')
      .insert([
        {
          client_id: client.id,
          project_id: project.id,
          communication_type: 'email',
          subject: 'Project Kickoff - Website Redesign',
          content: 'Thanks for choosing LuxWeb Studio! We\'re excited to work on your website redesign. I\'ve scheduled our discovery call for next week.',
          direction: 'outbound',
          sent_by: 'admin',
          delivered_at: new Date().toISOString(),
          replied: false
        }
      ])

    if (commError) throw commError

    return NextResponse.json({ 
      message: 'Test data created successfully',
      client: client,
      project: project
    })

  } catch (error: any) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
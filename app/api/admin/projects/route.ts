import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { getAdminUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get projects with related data
    const { data: projects, error } = await supabaseAdmin
      .from('projects')
      .select(`
        *,
        clients(primary_contact, company_name, email),
        packages(name, price)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
    }

    return NextResponse.json({ projects: projects || [] })

  } catch (error) {
    console.error('Projects GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projectData = await request.json()

    // Validate required fields
    if (!projectData.title || !projectData.client_id) {
      return NextResponse.json(
        { error: 'Project name and client are required' },
        { status: 400 }
      )
    }

    // Map project_type from package selection or default to 'custom'
    let project_type = 'custom'
    if (projectData.package_id) {
      const packageData = await supabaseAdmin
        .from('packages')
        .select('name')
        .eq('id', projectData.package_id)
        .single()
      
      if (packageData.data) {
        const packageName = packageData.data.name.toLowerCase()
        if (packageName.includes('starter')) project_type = 'starter'
        else if (packageName.includes('growth')) project_type = 'growth'
        else if (packageName.includes('complete')) project_type = 'complete'
        else if (packageName.includes('enterprise')) project_type = 'enterprise'
      }
    }

    // Create the project using admin client (bypasses RLS)
    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .insert([{
        project_name: projectData.title,
        project_type: project_type,
        description: projectData.description || null,
        client_id: projectData.client_id,
        package_id: projectData.package_id || null,
        status: projectData.status || 'planning',
        start_date: projectData.start_date || null,
        target_completion: projectData.deadline || null,
        total_value: projectData.total_value || null,
      }])
      .select(`
        *,
        clients(primary_contact, company_name, email),
        packages(name, price)
      `)
      .single()

    if (error) {
      console.error('Error creating project:', error)
      return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
    }

    return NextResponse.json({ project }, { status: 201 })

  } catch (error) {
    console.error('Projects POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
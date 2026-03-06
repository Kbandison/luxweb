import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser } from '@/lib/auth'
import { projects as projectsData } from '@/data/projects'
import fs from 'fs'
import path from 'path'

const PROJECTS_FILE = path.join(process.cwd(), 'data', 'projects.ts')

function writeProjectsFile(projects: any[]) {
  const projectsJson = JSON.stringify(projects, null, 2)
    .replace(/"(\w+)":/g, '$1:')

  const content = `export interface Project {
  title: string
  description: string
  tech: string[]
  result: string
  category: string
  images: string[]
  color: string
  links?: {
    live?: string
  }
}

export const projects: Project[] = ${projectsJson}

// Portfolio stats (easily editable)
export interface PortfolioStat {
  icon: string
  value: string
  label: string
  color: string
}

export const portfolioStats: PortfolioStat[] = [
  {
    icon: "Code",
    value: "50+",
    label: "Websites Delivered",
    color: "green"
  },
  {
    icon: "Users",
    value: "100%",
    label: "Client Satisfaction",
    color: "blue"
  },
  {
    icon: "TrendingUp",
    value: "3x",
    label: "Average ROI Increase",
    color: "amber"
  }
]
`

  fs.writeFileSync(PROJECTS_FILE, content, 'utf-8')
}

export async function GET() {
  const user = await getAdminUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json(projectsData)
}

export async function PUT(request: NextRequest) {
  const putUser = await getAdminUser()
  if (!putUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const projects = await request.json()
    if (!Array.isArray(projects)) {
      return NextResponse.json({ error: 'Expected array of projects' }, { status: 400 })
    }
    writeProjectsFile(projects)
    return NextResponse.json({ success: true, count: projects.length })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

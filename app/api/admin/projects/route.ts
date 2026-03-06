import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/auth'
import fs from 'fs'
import path from 'path'

const PROJECTS_FILE = path.join(process.cwd(), 'data', 'projects.ts')

function readProjectsFile() {
  const content = fs.readFileSync(PROJECTS_FILE, 'utf-8')
  // Find the start of the projects array, then bracket-match to find the end
  const marker = content.indexOf('export const projects: Project[] =')
  if (marker === -1) throw new Error('Could not find projects array in file')
  const arrayStart = content.indexOf('[', marker)
  if (arrayStart === -1) throw new Error('Could not find opening bracket')

  // Walk through brackets to find the matching close bracket
  let depth = 0
  let arrayEnd = -1
  for (let i = arrayStart; i < content.length; i++) {
    if (content[i] === '[') depth++
    else if (content[i] === ']') {
      depth--
      if (depth === 0) { arrayEnd = i + 1; break }
    }
  }
  if (arrayEnd === -1) throw new Error('Could not find closing bracket')

  const arrayStr = content.slice(arrayStart, arrayEnd)
  // Remove single-line comments that could break parsing
  const cleaned = arrayStr.replace(/\/\/.*$/gm, '')
  const fn = new Function(`return ${cleaned}`)
  return fn()
}

function writeProjectsFile(projects: any[]) {
  const projectsJson = JSON.stringify(projects, null, 2)
    // Convert JSON to JS object literal style (unquote keys)
    .replace(/"(\w+)":/g, '$1:')
    // Convert double-quoted string values to double quotes (keep as-is, JSON uses double quotes)

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
  try {
    await requireAdminAuth()
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const projects = readProjectsFile()
    return NextResponse.json(projects)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdminAuth()
  } catch {
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

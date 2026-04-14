import { generateText, Output } from 'ai'
import { z } from 'zod'

export interface IntakeData {
  name: string
  email: string
  message: string
  phone?: string
  company?: string
  projectType?: string
}

export interface IntakeAnalysis {
  summary: string
  priority: 'hot' | 'warm' | 'cold'
  tags: string[]
  personalizedReply: string
}

const SYSTEM_PROMPT = `You are analyzing a new inquiry for LuxWeb Studio, a web development studio that builds custom websites ($4,500 starting, 2-3 week delivery) for local service businesses.

Your job is to:
1. Summarize the inquiry in one concise sentence (≤20 words) so the owner can triage it fast.
2. Rate the priority:
   - "hot" = ready to buy, specific project, budget implied or stated, urgency signals
   - "warm" = interested, asking questions, exploring — needs nurture
   - "cold" = vague, price-shopping, unlikely fit, or spam-like
3. Extract 2-4 short tags (e.g. "Ecommerce", "Rebuild", "Tight Timeline", "Budget Unclear", "Referral", "Multi-page").
4. Write a personalized reply paragraph (2-3 sentences, ≤60 words) that:
   - Addresses the person by first name
   - References something specific from what they said
   - Sounds like the founder (Kenneth Bandison) wrote it — warm, direct, confident, not corporate
   - Does NOT promise specifics (timelines, prices) beyond what's in the package
   - Ends by saying we'll follow up within 24 hours to schedule a call
   - No exclamation marks, no "I'm excited to..." filler`

export async function analyzeIntake(data: IntakeData): Promise<IntakeAnalysis | null> {
  const prompt = `New inquiry received:

Name: ${data.name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}\n` : ''}${data.company ? `Company: ${data.company}\n` : ''}${data.projectType ? `Project type selected: ${data.projectType}\n` : ''}
Message:
"""
${data.message}
"""

Analyze this inquiry.`

  try {
    const { output } = await generateText({
      model: 'anthropic/claude-sonnet-4.6',
      system: SYSTEM_PROMPT,
      prompt,
      output: Output.object({
        schema: z.object({
          summary: z.string(),
          priority: z.enum(['hot', 'warm', 'cold']),
          tags: z.array(z.string()).min(1).max(4),
          personalizedReply: z.string(),
        }),
      }),
    })

    return output ?? null
  } catch (err) {
    console.error('[ai-intake] analysis failed:', err)
    return null
  }
}

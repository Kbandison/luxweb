// Integration with the LuxWeb CRM (portal.luxwebstudio.dev)
// Called after a contact form submission has been saved locally, so a CRM
// outage does not block the primary flow.

export interface CrmLead {
  full_name: string
  email: string
  company?: string
  message: string
  source?: string
  website?: string // honeypot — must be empty for legitimate submissions
}

export interface CrmResponse {
  ok: boolean
  created: boolean
}

export async function submitLead(lead: CrmLead): Promise<CrmResponse | null> {
  try {
    const res = await fetch('https://portal.luxwebstudio.dev/api/public/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: lead.full_name,
        email: lead.email,
        company: lead.company ?? '',
        message: lead.message,
        source: lead.source ?? 'website-contact-form',
        website: lead.website ?? '',
      }),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error('[crm] non-OK response:', res.status, text)
      return null
    }

    return (await res.json()) as CrmResponse
  } catch (err) {
    console.error('[crm] submit failed:', err)
    return null
  }
}

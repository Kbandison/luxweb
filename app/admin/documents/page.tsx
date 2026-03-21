'use client'

import { useState, useRef, useCallback } from 'react'
import {
  FileText, Download, Copy, Check, ChevronDown, ChevronRight,
  Eye, EyeOff, RotateCcw
} from 'lucide-react'

// ── Form Fields ──────────────────────────────────────────────

interface FormData {
  clientName: string
  clientEmail: string
  effectiveDate: string
  pageCount: string
  deliverables: string
  durationWeeks: string
  targetLaunchDate: string
  totalAmount: string
  phone: string
}

const DEFAULT_DELIVERABLES = `Custom design with two (2) revision rounds per phase
Migration of existing page/content
Industry-standard security hardening
Conversion-rate optimization best practices
Three (3) months of post-launch support ("Support Period")`

const INITIAL_FORM: FormData = {
  clientName: '',
  clientEmail: '',
  effectiveDate: new Date().toISOString().split('T')[0],
  pageCount: '',
  deliverables: DEFAULT_DELIVERABLES,
  durationWeeks: '',
  targetLaunchDate: '',
  totalAmount: '',
  phone: '',
}

// ── Helpers ──────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  if (!dateStr) return '[DATE]'
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

function formatCurrency(amount: string): string {
  const num = parseFloat(amount)
  if (isNaN(num)) return '$[____]'
  return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function calcMilestone(total: string, pct: number): string {
  const num = parseFloat(total)
  if (isNaN(num)) return '$[____]'
  return formatCurrency(String(num * pct))
}

// ── Template Renderers ───────────────────────────────────────

function renderAgreement(f: FormData): string {
  const deposit = calcMilestone(f.totalAmount, 0.5)
  const phase1 = calcMilestone(f.totalAmount, 0.25)
  const launch = calcMilestone(f.totalAmount, 0.25)

  return `WEB DESIGN & DEVELOPMENT AGREEMENT ("Agreement")

This Agreement is dated ${formatDate(f.effectiveDate)} and is between:

${f.clientName || '[Client Name]'}, contact: ${f.clientEmail || '[Client Email]'} ("Client")
LuxWeb Studio, contact: support@luxwebstudio.dev ("Contractor")


1. Scope & Deliverables

1.1 Deliverables
Contractor will design and develop a custom website ("Project") that includes:
• Up to ${f.pageCount || '[PAGE COUNT]'} pages
${f.deliverables.split('\n').filter(l => l.trim()).map(l => `• ${l.trim()}`).join('\n')}

1.2 Out-of-Scope / Maintenance
After the Support Period ends, any additional work—new pages, change requests, DNS help, etc.—will be billed at $100 per hour, Net 7, subject to prior written approval by Client.

1.3 What's Not Included
• Ongoing hosting fees
• Domain registration or renewal
• Content creation (text, images, videos)
• Email setup or configuration
• E-commerce functionality (unless specifically contracted)
• Advanced custom development beyond scope
• SEO work beyond basic metadata
• ADA compliance audits

1.4 Expenses
Client will reimburse pre-approved expenses including:
• Premium plugins or themes (with written approval)
• Stock photography licenses (with written approval)
• Third-party service setup fees
Pre-approved cap: $50; anything above requires written approval.


2. Timeline

2.1 Project Schedule
Total Duration: ${f.durationWeeks || '[NUMBER]'} weeks from contract signing and deposit receipt
Projected Completion Date: ${formatDate(f.targetLaunchDate)}

2.2 Project Phases

Phase 1: Discovery & Design
• Requirements interview + site map
• Wireframes / visual mock-ups
• Client feedback window (3 business days)

Phase 2: Build
• Full-stack development and coding
• Content migration & third-party integrations
• Mid-build staging link + single consolidated feedback round (3 business days)

Phase 3: Test & Launch
• Cross-browser / responsive QA
• Performance + security checks
• Final polish, go-live, hand-off docs & brief training
• Client sign-off window: 3 business days

Work begins upon (a) signature of this Agreement and (b) clearance of the initial deposit.
Estimated duration: ${f.durationWeeks || '[X–Y]'} weeks.
Target launch date: ${formatDate(f.targetLaunchDate)}.
Delays caused by late content, feedback, or scope changes extend the timeline accordingly.


3. Payment Terms

Total Project Investment: ${f.totalAmount ? formatCurrency(f.totalAmount) : '$[AMOUNT]'}

Milestone          | Amount       | %    | Due
Deposit            | ${deposit.padEnd(12)} | 50%  | On signing (non-refundable)
Phase 1 Approval   | ${phase1.padEnd(12)} | 25%  | After design phase sign-off, before development
Launch             | ${launch.padEnd(12)} | 25%  | Before publishing to Client's domain

Late payment: Net 7; unpaid balances accrue the greater of 1.5% per month or the maximum rate permitted by law, plus collection costs. Payments are considered late 3 days after the invoice is sent out.
Retainer Fee: Retainer covers 12 hours of support per month; additional hours billed at §1.2 rate.
Currency: All amounts in USD.


4. Acceptance of Work

Contractor will issue a "ready-for-review" notice at the end of each phase.
If Client does not send a written defect list within three (3) business days, the phase is deemed accepted.
Defects will be corrected promptly; enhancement requests outside agreed scope may extend the timeline and will be billable per §1.2.


5. Client Responsibilities

• Supply all logos, copy, images, and credentials within three (3) days of Contractor's request, unless otherwise discussed in §1.1. Failure to supply items and information and irresponsiveness may pause the Project; and a 20% restart fee may apply.
• Provide consolidated, specific and actionable feedback provided in writing within three (3) days of each revision round. Missing any deadline may pause the Project; a 20% restart fee may apply. The original deadline will terminate and a new deadline will be established upon Contractor availability.
• Ensure all Client-supplied materials are properly licensed and non-infringing.
• Secure hosting, domain, and SSL certificates unless otherwise agreed.
• Maintain backups and ongoing security monitoring after the Support Period.


6. Contractor Responsibilities

• Perform services in a professional manner consistent with industry standards and all applicable laws.
• Deliver Work Product free of third-party IP infringement.
• Keep Client credentials and data confidential per §10.
• Provide bug-fix support for three (3) months after launch.
• Contractor is not responsible for missed launch deadlines caused by Client delays.
• Sections 6, 7, 10–17 survive termination.


7. Intellectual Property

7.1 Definitions
Work Product – final site files created specifically for Client.
Background IP – pre-existing libraries, code snippets, frameworks, or know-how Contractor uses for multiple clients.

7.2 Ownership
Upon final payment:
• Work Product is assigned to Client.
• Contractor retains all Background IP and grants Client a non-exclusive, perpetual license to use it only as embedded in the Work Product.
• Client permits Contractor to reuse non-confidential snippets (e.g., helper functions) in future projects provided no Client trade secrets are disclosed.

7.3 Portfolio Rights
Client grants Contractor the right to display non-confidential screenshots and a brief description of the Project in Contractor's portfolio, marketing materials, and social media, as well as a footer link to Contractor's website.


8. Non-Solicitation

During the Project and for twelve (12) months after completion, neither party will actively solicit the other's employees, contractors, or clients. General public job ads are exempt.


9. Representations & Warranties

• Each party warrants it has the authority to sign and perform.
• Contractor warrants the Work Product will not knowingly infringe third-party IP.
• Contractor disclaims all other warranties, express or implied—including merchantability, fitness for a particular purpose, SEO rankings, or ADA compliance—except as explicitly stated.
• Client warrants Client-supplied assets are lawful and non-infringing.


10. Confidentiality

10.1 Mutual Confidentiality
Both parties agree to:
• Keep confidential information secret
• Use confidential information only for project purposes
• Return or destroy confidential information upon project completion

10.2 Exceptions
Confidentiality obligations do not apply to information that:
• Is publicly available
• Was known prior to disclosure
• Is independently developed
• Is required to be disclosed by law

If Contractor processes personal data for EU/UK residents, the parties will execute a Data Processing Addendum.


11. Indemnification

Contractor → Client: Contractor will defend and indemnify Client from any third-party claim that the Work Product, as delivered, infringes intellectual-property rights, provided Client gives prompt notice and reasonable cooperation.

Client → Contractor: Client will defend and indemnify Contractor against claims arising from (a) Client-supplied materials or (b) Client's breach of this Agreement.

Party seeking indemnity must give prompt written notice and reasonable cooperation; failure to do so relieves the indemnifying party only to the extent of actual prejudice.


12. Limitation of Liability

12.1 Limitation of Damages
Neither party's liability will exceed the total contract amount. Neither party will be liable for:
• Indirect, incidental, or consequential damages
• Lost profits or business opportunities
• Data loss not caused by party's negligence

12.2 Exceptions
Limitations do not apply to:
• Intellectual property infringement
• Breach of confidentiality obligations
• Gross negligence or willful misconduct
• Payment obligations under this Agreement


13. Term & Termination

Term – This Agreement ends upon final payment and delivery unless earlier terminated.
Either party may terminate with seven (7) days' written notice if the other materially breaches and fails to cure within that period.
If Client terminates for convenience or fails to cure non-payment/unresponsiveness, Contractor may cease work and invoice for work performed to date plus a 20% kill fee of remaining contract value.


14. Independent Contractor

Contractor is an independent contractor; nothing here creates an employer-employee, agency, or joint-venture relationship.


15. Force Majeure

Neither party is liable for delays caused by events beyond reasonable control—e.g., acts of God, war, pandemic, government action or technical failures of third-party services.


16. Dispute Resolution

Any dispute shall be resolved by binding arbitration administered by the American Arbitration Association under its Commercial Rules, held virtually. Judgment on the award may be entered into in any court of competent jurisdiction.


17. Miscellaneous

• Assignment – Contractor may not assign this Agreement without written consent; Client may assign in a merger or asset sale.
• Headings – Headings are for convenience and do not affect interpretation.
• Counterparts / E-sign – This Agreement may be signed in counterparts, including electronic signatures, each deemed an original.
• This Agreement shall be governed by and construed in accordance with the laws of the State of Georgia, USA (without regard to its conflicts-of-law rules).
• Notices – Valid if delivered by email to addresses listed above, with receipt acknowledgment. Notice is deemed received when the sending party receives a non-automated reply or read-receipt, or—if no reply—24 hours after transmission without bounce-back, whichever occurs first.
• Legal Address: For purposes of legal service of process, each party designates the electronic addresses above and agrees that service via email satisfies applicable rules of civil procedure.
• Modification/Waiver – Must be in a signed writing. Failure to enforce is not a waiver.
• Severability – Unenforceable provisions will be modified or severed; remainder stays in force.
• Entire Agreement – This document supersedes all prior agreements and discussions.`
}


function renderProposal(f: FormData): string {
  const deposit = calcMilestone(f.totalAmount, 0.5)
  const phase1 = calcMilestone(f.totalAmount, 0.25)
  const launch = calcMilestone(f.totalAmount, 0.25)

  return `Project Proposal – ${f.clientName || '[Client Name]'}
Prepared by LuxWeb Studio
Date: ${formatDate(f.effectiveDate)}
Proposal v 1.0


1. Executive Summary

You need a website that looks sharp, loads fast, and converts visitors into customers—without turning into a money pit six months down the line. We'll build you a modern, secure site that's easy to update and primed for growth, then back you up for three months post-launch so you're never left hanging.


2. Project Goals

• Professional Presence – Convey Credibility, Capture Leads, Empower Editing, Provide Scalability.
• Lead Generation – Funnel visitors toward clear calls-to-action and capture qualified leads.
• Ease of Management – Empower your team to edit copy, swap images, and publish blog posts without touching code.
• Scalable Foundation – Clean, component-based code that can grow with new features (e-commerce, memberships, etc.) down the road.


3. Scope & Deliverables

• Up to ${f.pageCount || '[PAGE COUNT]'} fully designed pages
${f.deliverables.split('\n').filter(l => l.trim()).map(l => `• ${l.trim()}`).join('\n')}

Anything not listed above (e-commerce, custom app features, ongoing hosting, etc.) is out-of-scope and can be quoted separately.


4. Process & Timeline

Phase 1 – Discovery & Design (Weeks 1-2)
• Goal & audience workshop
• Site map & wireframes
• Visual mock-ups → Client review (3 business days)

Phase 2 – Build (Weeks 3-6)
• Responsive front-end & CMS setup
• Content migration, integrations
• Staging demo → Client feedback (3 business days)

Phase 3 – Test & Launch (Week 7)
• Cross-browser / device QA
• Performance & security checks
• Final tweaks, go-live, hand-off training

Total duration: ~${f.durationWeeks || '[NUMBER]'} weeks
Target launch: ${formatDate(f.targetLaunchDate)}


5. Investment

Milestone          | %    | Amount       | Due
Deposit            | 50%  | ${deposit.padEnd(12)} | On signing
Phase 1 Approval   | 25%  | ${phase1.padEnd(12)} | After design sign-off
Launch             | 25%  | ${launch.padEnd(12)} | Before go-live

All invoices Net 7. Late payments accrue the greater of 1.5%/month or the legal maximum, plus collection costs.


6. Assumptions

• Client will provide final copy, imagery, and brand assets within three (3) days of request.
• One consolidated feedback round per phase; additional rounds billed at $100/hr.
• Hosting, domain, and SSL costs are the client's responsibility.
• For the full legal details (IP ownership, confidentiality, indemnity, etc.), please review the Web Design & Development Agreement attached.
• Proposal is non-binding; scope/pricing governed by the signed Agreement.


7. Why LuxWeb Studio?

• Full-stack expertise – From Figma comps to production servers.
• Performance-first mindset – We treat site speed like a feature, not an afterthought.
• Plain-English comms – No jargon, no ghosting, regular check-ins.
• Future-proof code – Modular components you can extend without a rebuild next year.


8. Next Steps

1. Review & sign the Agreement.
2. Pay the 50% deposit (invoice sent upon signature).
3. Kick-off call & scheduling → we get to work.

Questions? Shoot an email to support@luxwebstudio.dev or call ${f.phone || '[YOUR PHONE]'}. We're excited to build something great together!`
}


// ── Main Component ───────────────────────────────────────────

export default function DocumentsPage() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [activeDoc, setActiveDoc] = useState<'agreement' | 'proposal'>('proposal')
  const [showPreview, setShowPreview] = useState(true)
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  const update = useCallback((field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }, [])

  const renderedText = activeDoc === 'agreement'
    ? renderAgreement(form)
    : renderProposal(form)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(renderedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadPDF = async () => {
    setGenerating(true)
    try {
      // Dynamic import to avoid SSR issues
      const html2pdf = (await import('html2pdf.js')).default

      // Create a styled HTML element for PDF conversion
      const el = document.createElement('div')
      el.style.fontFamily = 'Georgia, "Times New Roman", serif'
      el.style.fontSize = '11px'
      el.style.lineHeight = '1.6'
      el.style.color = '#1a1a1a'
      el.style.padding = '40px'
      el.style.maxWidth = '700px'
      el.innerHTML = renderedText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n\n/g, '</p><p style="margin:0 0 12px 0">')
        .replace(/\n/g, '<br/>')
        // Bold section headers (lines starting with a number followed by a period)
        .replace(/(^|\<br\/\>)(\d+\.\s[^\<]+)/g, '$1<strong style="font-size:13px">$2</strong>')
        // Bold sub-headers (e.g., "1.1 Deliverables")
        .replace(/(^|\<br\/\>)(\d+\.\d+\s[^\<]+)/g, '$1<strong>$2</strong>')
      el.innerHTML = '<p style="margin:0 0 12px 0">' + el.innerHTML + '</p>'

      const docTitle = activeDoc === 'agreement'
        ? `LuxWeb Agreement - ${form.clientName || 'Draft'}`
        : `LuxWeb Proposal - ${form.clientName || 'Draft'}`

      await (html2pdf().set as any)({
        margin: [0.75, 0.75, 0.75, 0.75],
        filename: `${docTitle}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      }).from(el).save()
    } catch (err) {
      console.error('PDF generation failed:', err)
    }
    setGenerating(false)
  }

  const resetForm = () => {
    setForm(INITIAL_FORM)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Documents</h1>
          <p className="text-gray-400 text-sm">Generate contracts and proposals for new clients.</p>
        </div>
        <button
          onClick={resetForm}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-sm rounded-lg transition-colors border border-white/10"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left: Form */}
        <div className="space-y-4">
          {/* Document type selector */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
            <label className="text-xs text-gray-400 mb-2 block">Document Type</label>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveDoc('proposal')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeDoc === 'proposal'
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                }`}
              >
                <FileText className="w-4 h-4" />
                Proposal
              </button>
              <button
                onClick={() => setActiveDoc('agreement')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeDoc === 'agreement'
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                }`}
              >
                <FileText className="w-4 h-4" />
                Agreement
              </button>
            </div>
          </div>

          {/* Client details */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-purple-400" />
              Client Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Client Name *</label>
                <input
                  value={form.clientName}
                  onChange={e => update('clientName', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Client Email *</label>
                <input
                  type="email"
                  value={form.clientEmail}
                  onChange={e => update('clientEmail', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  placeholder="client@example.com"
                />
              </div>
            </div>
          </div>

          {/* Project details */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-purple-400" />
              Project Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Effective Date</label>
                <input
                  type="date"
                  value={form.effectiveDate}
                  onChange={e => update('effectiveDate', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Page Count</label>
                <input
                  type="number"
                  min="1"
                  value={form.pageCount}
                  onChange={e => update('pageCount', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  placeholder="5"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-gray-400 mb-1 block">Deliverables (one per line)</label>
                <textarea
                  rows={5}
                  value={form.deliverables}
                  onChange={e => update('deliverables', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 resize-none"
                  placeholder="Custom design with two (2) revision rounds per phase&#10;Migration of existing page/content&#10;Industry-standard security hardening"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Duration (weeks)</label>
                <input
                  value={form.durationWeeks}
                  onChange={e => update('durationWeeks', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  placeholder="6-8"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Target Launch Date</label>
                <input
                  type="date"
                  value={form.targetLaunchDate}
                  onChange={e => update('targetLaunchDate', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-purple-400" />
              Pricing
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Total Amount ($) *</label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={form.totalAmount}
                  onChange={e => update('totalAmount', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  placeholder="1300"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Your Phone (proposal only)</label>
                <input
                  value={form.phone}
                  onChange={e => update('phone', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            {/* Auto-calculated breakdown */}
            {form.totalAmount && !isNaN(parseFloat(form.totalAmount)) && (
              <div className="mt-3 p-3 bg-purple-500/5 border border-purple-500/10 rounded-lg">
                <p className="text-xs text-gray-400 mb-2">Payment Breakdown</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-sm font-medium text-white">{calcMilestone(form.totalAmount, 0.5)}</p>
                    <p className="text-[10px] text-gray-500">Deposit (50%)</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{calcMilestone(form.totalAmount, 0.25)}</p>
                    <p className="text-[10px] text-gray-500">Phase 1 (25%)</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{calcMilestone(form.totalAmount, 0.25)}</p>
                    <p className="text-[10px] text-gray-500">Launch (25%)</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-sm rounded-lg transition-colors border border-white/10"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Text'}
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={generating}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {generating ? 'Generating...' : 'Download PDF'}
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-sm rounded-lg transition-colors border border-white/10 xl:hidden"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
        </div>

        {/* Right: Preview */}
        <div className={`${showPreview ? 'block' : 'hidden'} xl:block`}>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden sticky top-28">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h3 className="text-sm font-medium text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-400" />
                Preview: {activeDoc === 'agreement' ? 'Agreement' : 'Proposal'}
              </h3>
            </div>
            <div
              ref={previewRef}
              className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto"
            >
              <pre className="text-xs sm:text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                {renderedText}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useRef, useCallback } from 'react'
import {
  FileText, Download, Copy, Check, ChevronRight,
  Eye, EyeOff, RotateCcw
} from 'lucide-react'

// ── Form Fields ──────────────────────────────────────────────

interface FormData {
  clientName: string
  clientEmail: string
  effectiveDate: string
  pageCount: string
  deliverables: string
  scopeItems: string
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

const DEFAULT_SCOPE_ITEMS = `Design | Custom UI/UX, two (2) revision rounds per phase
Content Migration | Port existing copy & imagery
Integrations | Active Campaign email capture, Google Analytics, basic SEO setup
Security | HTTPS, best-practice hardening, critical updates applied pre-launch
Performance | Image optimization, lazy-loading, lighthouse >90% targets
Post-Launch Support | Bug-fixes & "how-do-I?" help for three (3) months`

const INITIAL_FORM: FormData = {
  clientName: '',
  clientEmail: '',
  effectiveDate: new Date().toISOString().split('T')[0],
  pageCount: '',
  deliverables: DEFAULT_DELIVERABLES,
  scopeItems: DEFAULT_SCOPE_ITEMS,
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

function phaseWeeks(durationStr: string): { phase1: string; phase2: string; phase3: string } {
  const match = durationStr.match(/(\d+)\s*[-–]\s*(\d+)/)
  const total = match ? parseInt(match[2]) : parseInt(durationStr)

  if (isNaN(total) || total < 3) {
    return { phase1: '[WEEKS]', phase2: '[WEEKS]', phase3: '[WEEK]' }
  }

  const p1 = Math.max(1, Math.round(total * 0.3))
  const p3 = Math.max(1, Math.round(total * 0.15))
  const p2End = total - p3
  const p2Start = p1 + 1

  return {
    phase1: p1 === 1 ? 'Week 1' : `Weeks 1-${p1}`,
    phase2: p2Start === p2End ? `Week ${p2Start}` : `Weeks ${p2Start}-${p2End}`,
    phase3: total === p2End + 1 ? `Week ${total}` : `Weeks ${p2End + 1}-${total}`,
  }
}

function calcMilestone(total: string, pct: number): string {
  const num = parseFloat(total)
  if (isNaN(num)) return '$[____]'
  return formatCurrency(String(num * pct))
}

// ── Decorative header for documents ──────────────────────────

const DOC_HEADER = `
<div style="padding:20px 28px 12px 28px; margin-bottom:16px;">
  <div style="margin-bottom:6px;">
    <img src="/logo-with-text.png" alt="LuxWeb Studio" style="height:56px; width:auto;" />
  </div>
</div>`

// ── Shared inline styles for HTML output ─────────────────────

const S = {
  title: 'font-size:22px; font-weight:bold; text-align:center; margin:0 0 4px 0; font-family:Georgia,serif; color:#8B55FF;',
  subtitle: 'text-align:center; color:#9969FF; font-size:13px; margin:0 0 24px 0;',
  h1: 'font-size:16px; font-weight:bold; margin:28px 0 8px 0; padding-bottom:4px; border-bottom:2px solid #8B55FF; color:#8B55FF;',
  h2: 'font-size:14px; font-weight:bold; margin:20px 0 6px 0; color:#9B57D3;',
  h3: 'font-size:13px; font-weight:bold; margin:16px 0 4px 0; color:#752EB0;',
  p: 'font-size:12px; line-height:1.7; margin:0 0 10px 0; color:#632E62;',
  ul: 'margin:0 0 10px 0; padding-left:20px;',
  li: 'font-size:12px; line-height:1.7; margin:0 0 3px 0; color:#632E62;',
  table: 'width:100%; border-collapse:collapse; margin:12px 0; font-size:12px;',
  th: 'text-align:left; padding:8px 12px; background:#EAE5EB; border:1px solid #9B57D3; font-weight:bold; font-size:11px; color:#4E1F76;',
  td: 'padding:8px 12px; border:1px solid #d4cdd6; font-size:12px; color:#632E62;',
  parties: 'font-size:12px; line-height:1.8; margin:0 0 8px 0; color:#632E62;',
  phaseName: 'font-size:13px; font-weight:bold; margin:14px 0 4px 0; color:#752EB0;',
  note: 'font-size:11px; color:#9969FF; font-style:italic; margin:8px 0;',
  ol: 'margin:0 0 10px 0; padding-left:20px;',
  olLi: 'font-size:12px; line-height:1.7; margin:0 0 3px 0; color:#632E62;',
  divider: 'border:none; border-top:1px solid #EAE5EB; margin:24px 0;',
}

// ── HTML Template Renderers ──────────────────────────────────

function renderAgreementHtml(f: FormData): string {
  const deposit = calcMilestone(f.totalAmount, 0.5)
  const phase1 = calcMilestone(f.totalAmount, 0.25)
  const launch = calcMilestone(f.totalAmount, 0.25)

  const deliverablesList = [
    `Up to ${f.pageCount || '[PAGE COUNT]'} pages`,
    ...f.deliverables.split('\n').filter(l => l.trim()),
  ].map(d => `<li style="${S.li}">${d}</li>`).join('')

  return `
<div style="font-family:Georgia,'Times New Roman',serif; color:#1a1a1a; max-width:700px; margin:0 auto;">
  ${DOC_HEADER}
  <div style="padding:0 32px 32px 32px;">
  <h1 style="${S.title}">WEB DESIGN &amp; DEVELOPMENT AGREEMENT</h1>
  <p style="${S.subtitle}">(&ldquo;Agreement&rdquo;)</p>

  <p style="${S.p}">This Agreement is dated <strong>${formatDate(f.effectiveDate)}</strong> and is between:</p>
  <p style="${S.parties}"><strong>${f.clientName || '[Client Name]'}</strong>, contact: ${f.clientEmail || '[Client Email]'} (&ldquo;Client&rdquo;)<br/>
  <strong>LuxWeb Studio</strong>, contact: support@luxwebstudio.dev (&ldquo;Contractor&rdquo;)</p>

  <hr style="${S.divider}"/>

  <h2 style="${S.h1}">1. Scope &amp; Deliverables</h2>

  <h3 style="${S.h2}">1.1 Deliverables</h3>
  <p style="${S.p}">Contractor will design and develop a custom website (&ldquo;Project&rdquo;) that includes:</p>
  <ul style="${S.ul}">${deliverablesList}</ul>

  <h3 style="${S.h2}">1.2 Out-of-Scope / Maintenance</h3>
  <p style="${S.p}">After the Support Period ends, any additional work&mdash;new pages, change requests, DNS help, etc.&mdash;will be billed at $100 per hour, Net 7, subject to prior written approval by Client.</p>

  <h3 style="${S.h2}">1.3 What&rsquo;s Not Included</h3>
  <ul style="${S.ul}">
    <li style="${S.li}">Ongoing hosting fees</li>
    <li style="${S.li}">Domain registration or renewal</li>
    <li style="${S.li}">Content creation (text, images, videos)</li>
    <li style="${S.li}">Email setup or configuration</li>
    <li style="${S.li}">E-commerce functionality (unless specifically contracted)</li>
    <li style="${S.li}">Advanced custom development beyond scope</li>
    <li style="${S.li}">SEO work beyond basic metadata</li>
    <li style="${S.li}">ADA compliance audits</li>
  </ul>

  <h3 style="${S.h2}">1.4 Expenses</h3>
  <p style="${S.p}">Client will reimburse pre-approved expenses including:</p>
  <ul style="${S.ul}">
    <li style="${S.li}">Premium plugins or themes (with written approval)</li>
    <li style="${S.li}">Stock photography licenses (with written approval)</li>
    <li style="${S.li}">Third-party service setup fees</li>
  </ul>
  <p style="${S.p}">Pre-approved cap: $50; anything above requires written approval.</p>

  <hr style="${S.divider}"/>

  <h2 style="${S.h1}">2. Timeline</h2>

  <h3 style="${S.h2}">2.1 Project Schedule</h3>
  <table style="${S.table}">
    <tr><td style="${S.th}">Total Duration</td><td style="${S.td}">${f.durationWeeks || '[NUMBER]'} weeks from contract signing and deposit receipt</td></tr>
    <tr><td style="${S.th}">Projected Completion</td><td style="${S.td}">${formatDate(f.targetLaunchDate)}</td></tr>
  </table>

  <h3 style="${S.h2}">2.2 Project Phases</h3>

  <p style="${S.phaseName}">Phase 1: Discovery &amp; Design</p>
  <ul style="${S.ul}">
    <li style="${S.li}">Requirements interview + site map</li>
    <li style="${S.li}">Wireframes / visual mock-ups</li>
    <li style="${S.li}">Client feedback window (3 business days)</li>
  </ul>

  <p style="${S.phaseName}">Phase 2: Build</p>
  <ul style="${S.ul}">
    <li style="${S.li}">Full-stack development and coding</li>
    <li style="${S.li}">Content migration &amp; third-party integrations</li>
    <li style="${S.li}">Mid-build staging link + single consolidated feedback round (3 business days)</li>
  </ul>

  <p style="${S.phaseName}">Phase 3: Test &amp; Launch</p>
  <ul style="${S.ul}">
    <li style="${S.li}">Cross-browser / responsive QA</li>
    <li style="${S.li}">Performance + security checks</li>
    <li style="${S.li}">Final polish, go-live, hand-off docs &amp; brief training</li>
    <li style="${S.li}">Client sign-off window: 3 business days</li>
  </ul>

  <p style="${S.p}">Work begins upon (a) signature of this Agreement and (b) clearance of the initial deposit.<br/>
  Estimated duration: <strong>${f.durationWeeks || '[X–Y]'} weeks</strong>. Target launch date: <strong>${formatDate(f.targetLaunchDate)}</strong>.<br/>
  Delays caused by late content, feedback, or scope changes extend the timeline accordingly.</p>

  <hr style="${S.divider}"/>

  <h2 style="${S.h1}">3. Payment Terms</h2>
  <p style="${S.p}">Total Project Investment: <strong>${f.totalAmount ? formatCurrency(f.totalAmount) : '$[AMOUNT]'}</strong></p>

  <table style="${S.table}">
    <tr><th style="${S.th}">Milestone</th><th style="${S.th}">Amount</th><th style="${S.th}">%</th><th style="${S.th}">Due</th></tr>
    <tr><td style="${S.td}">Deposit</td><td style="${S.td}">${deposit}</td><td style="${S.td}">50%</td><td style="${S.td}">On signing (non-refundable)</td></tr>
    <tr><td style="${S.td}">Phase 1 Approval</td><td style="${S.td}">${phase1}</td><td style="${S.td}">25%</td><td style="${S.td}">After design phase sign-off, before development</td></tr>
    <tr><td style="${S.td}">Launch</td><td style="${S.td}">${launch}</td><td style="${S.td}">25%</td><td style="${S.td}">Before publishing to Client&rsquo;s domain</td></tr>
  </table>

  <p style="${S.p}">Late payment: Net 7; unpaid balances accrue the greater of 1.5% per month or the maximum rate permitted by law, plus collection costs. Payments are considered late 3 days after the invoice is sent out.</p>
  <p style="${S.p}">Retainer Fee: Retainer covers 12 hours of support per month; additional hours billed at &sect;1.2 rate.</p>
  <p style="${S.p}">Currency: All amounts in USD.</p>

  <hr style="${S.divider}"/>

  <h2 style="${S.h1}">4. Acceptance of Work</h2>
  <p style="${S.p}">Contractor will issue a &ldquo;ready-for-review&rdquo; notice at the end of each phase.</p>
  <p style="${S.p}">If Client does not send a written defect list within three (3) business days, the phase is deemed accepted.</p>
  <p style="${S.p}">Defects will be corrected promptly; enhancement requests outside agreed scope may extend the timeline and will be billable per &sect;1.2.</p>

  <hr style="${S.divider}"/>

  <h2 style="${S.h1}">5. Client Responsibilities</h2>
  <ul style="${S.ul}">
    <li style="${S.li}">Supply all logos, copy, images, and credentials within three (3) days of Contractor&rsquo;s request, unless otherwise discussed in &sect;1.1. Failure to supply items and information and irresponsiveness may pause the Project; and a 20% restart fee may apply.</li>
    <li style="${S.li}">Provide consolidated, specific and actionable feedback provided in writing within three (3) days of each revision round. Missing any deadline may pause the Project; a 20% restart fee may apply. The original deadline will terminate and a new deadline will be established upon Contractor availability.</li>
    <li style="${S.li}">Ensure all Client-supplied materials are properly licensed and non-infringing.</li>
    <li style="${S.li}">Secure hosting, domain, and SSL certificates unless otherwise agreed.</li>
    <li style="${S.li}">Maintain backups and ongoing security monitoring after the Support Period.</li>
  </ul>

  <hr style="${S.divider}"/>

  <h2 style="${S.h1}">6. Contractor Responsibilities</h2>
  <ul style="${S.ul}">
    <li style="${S.li}">Perform services in a professional manner consistent with industry standards and all applicable laws.</li>
    <li style="${S.li}">Deliver Work Product free of third-party IP infringement.</li>
    <li style="${S.li}">Keep Client credentials and data confidential per &sect;10.</li>
    <li style="${S.li}">Provide bug-fix support for three (3) months after launch.</li>
    <li style="${S.li}">Contractor is not responsible for missed launch deadlines caused by Client delays.</li>
    <li style="${S.li}">Sections 6, 7, 10&ndash;17 survive termination.</li>
  </ul>

  <hr style="${S.divider}"/>

  <h2 style="${S.h1}">7. Intellectual Property</h2>

  <h3 style="${S.h2}">7.1 Definitions</h3>
  <p style="${S.p}"><strong>Work Product</strong> &ndash; final site files created specifically for Client.<br/>
  <strong>Background IP</strong> &ndash; pre-existing libraries, code snippets, frameworks, or know-how Contractor uses for multiple clients.</p>

  <h3 style="${S.h2}">7.2 Ownership</h3>
  <p style="${S.p}">Upon final payment:</p>
  <ul style="${S.ul}">
    <li style="${S.li}">Work Product is assigned to Client.</li>
    <li style="${S.li}">Contractor retains all Background IP and grants Client a non-exclusive, perpetual license to use it only as embedded in the Work Product.</li>
    <li style="${S.li}">Client permits Contractor to reuse non-confidential snippets (e.g., helper functions) in future projects provided no Client trade secrets are disclosed.</li>
  </ul>

  <h3 style="${S.h2}">7.3 Portfolio Rights</h3>
  <p style="${S.p}">Client grants Contractor the right to display non-confidential screenshots and a brief description of the Project in Contractor&rsquo;s portfolio, marketing materials, and social media, as well as a footer link to Contractor&rsquo;s website.</p>

  <hr style="${S.divider}"/>

  <h2 style="${S.h1}">8. Non-Solicitation</h2>
  <p style="${S.p}">During the Project and for twelve (12) months after completion, neither party will actively solicit the other&rsquo;s employees, contractors, or clients. General public job ads are exempt.</p>

  <hr style="${S.divider}"/>

  <h2 style="${S.h1}">9. Representations &amp; Warranties</h2>
  <ul style="${S.ul}">
    <li style="${S.li}">Each party warrants it has the authority to sign and perform.</li>
    <li style="${S.li}">Contractor warrants the Work Product will not knowingly infringe third-party IP.</li>
    <li style="${S.li}">Contractor disclaims all other warranties, express or implied&mdash;including merchantability, fitness for a particular purpose, SEO rankings, or ADA compliance&mdash;except as explicitly stated.</li>
    <li style="${S.li}">Client warrants Client-supplied assets are lawful and non-infringing.</li>
  </ul>

  <hr style="${S.divider}"/>

  <h2 style="${S.h1}">10. Confidentiality</h2>

  <h3 style="${S.h2}">10.1 Mutual Confidentiality</h3>
  <p style="${S.p}">Both parties agree to:</p>
  <ul style="${S.ul}">
    <li style="${S.li}">Keep confidential information secret</li>
    <li style="${S.li}">Use confidential information only for project purposes</li>
    <li style="${S.li}">Return or destroy confidential information upon project completion</li>
  </ul>

  <h3 style="${S.h2}">10.2 Exceptions</h3>
  <p style="${S.p}">Confidentiality obligations do not apply to information that:</p>
  <ul style="${S.ul}">
    <li style="${S.li}">Is publicly available</li>
    <li style="${S.li}">Was known prior to disclosure</li>
    <li style="${S.li}">Is independently developed</li>
    <li style="${S.li}">Is required to be disclosed by law</li>
  </ul>
  <p style="${S.p}">If Contractor processes personal data for EU/UK residents, the parties will execute a Data Processing Addendum.</p>

  <hr style="${S.divider}"/>

  <h2 style="${S.h1}">11. Indemnification</h2>

  <table style="${S.table}">
    <tr><th style="${S.th}">Party</th><th style="${S.th}">Scope</th></tr>
    <tr><td style="${S.td}"><strong>Contractor &rarr; Client</strong></td><td style="${S.td}">Contractor will defend and indemnify Client from any third-party claim that the Work Product, as delivered, infringes intellectual-property rights, provided Client gives prompt notice and reasonable cooperation.</td></tr>
    <tr><td style="${S.td}"><strong>Client &rarr; Contractor</strong></td><td style="${S.td}">Client will defend and indemnify Contractor against claims arising from (a) Client-supplied materials or (b) Client&rsquo;s breach of this Agreement.</td></tr>
  </table>
  <p style="${S.p}">Party seeking indemnity must give prompt written notice and reasonable cooperation; failure to do so relieves the indemnifying party only to the extent of actual prejudice.</p>

  <hr style="${S.divider}"/>

  <h2 style="${S.h1}">12. Limitation of Liability</h2>

  <h3 style="${S.h2}">12.1 Limitation of Damages</h3>
  <p style="${S.p}">Neither party&rsquo;s liability will exceed the total contract amount. Neither party will be liable for:</p>
  <ul style="${S.ul}">
    <li style="${S.li}">Indirect, incidental, or consequential damages</li>
    <li style="${S.li}">Lost profits or business opportunities</li>
    <li style="${S.li}">Data loss not caused by party&rsquo;s negligence</li>
  </ul>

  <h3 style="${S.h2}">12.2 Exceptions</h3>
  <p style="${S.p}">Limitations do not apply to:</p>
  <ul style="${S.ul}">
    <li style="${S.li}">Intellectual property infringement</li>
    <li style="${S.li}">Breach of confidentiality obligations</li>
    <li style="${S.li}">Gross negligence or willful misconduct</li>
    <li style="${S.li}">Payment obligations under this Agreement</li>
  </ul>

  <hr style="${S.divider}"/>

  <h2 style="${S.h1}">13. Term &amp; Termination</h2>
  <p style="${S.p}"><strong>Term</strong> &ndash; This Agreement ends upon final payment and delivery unless earlier terminated.</p>
  <p style="${S.p}">Either party may terminate with seven (7) days&rsquo; written notice if the other materially breaches and fails to cure within that period.</p>
  <p style="${S.p}">If Client terminates for convenience or fails to cure non-payment/unresponsiveness, Contractor may cease work and invoice for work performed to date plus a 20% kill fee of remaining contract value.</p>

  <hr style="${S.divider}"/>

  <h2 style="${S.h1}">14. Independent Contractor</h2>
  <p style="${S.p}">Contractor is an independent contractor; nothing here creates an employer-employee, agency, or joint-venture relationship.</p>

  <hr style="${S.divider}"/>

  <h2 style="${S.h1}">15. Force Majeure</h2>
  <p style="${S.p}">Neither party is liable for delays caused by events beyond reasonable control&mdash;e.g., acts of God, war, pandemic, government action or technical failures of third-party services.</p>

  <hr style="${S.divider}"/>

  <h2 style="${S.h1}">16. Dispute Resolution</h2>
  <p style="${S.p}">Any dispute shall be resolved by binding arbitration administered by the American Arbitration Association under its Commercial Rules, held virtually. Judgment on the award may be entered into in any court of competent jurisdiction.</p>

  <hr style="${S.divider}"/>

  <h2 style="${S.h1}">17. Miscellaneous</h2>
  <ul style="${S.ul}">
    <li style="${S.li}"><strong>Assignment</strong> &ndash; Contractor may not assign this Agreement without written consent; Client may assign in a merger or asset sale.</li>
    <li style="${S.li}"><strong>Headings</strong> &ndash; Headings are for convenience and do not affect interpretation.</li>
    <li style="${S.li}"><strong>Counterparts / E-sign</strong> &ndash; This Agreement may be signed in counterparts, including electronic signatures, each deemed an original.</li>
    <li style="${S.li}">This Agreement shall be governed by and construed in accordance with the laws of the State of Georgia, USA (without regard to its conflicts-of-law rules).</li>
    <li style="${S.li}"><strong>Notices</strong> &ndash; Valid if delivered by email to addresses listed above, with receipt acknowledgment. Notice is deemed received when the sending party receives a non-automated reply or read-receipt, or&mdash;if no reply&mdash;24 hours after transmission without bounce-back, whichever occurs first.</li>
    <li style="${S.li}"><strong>Legal Address</strong>: For purposes of legal service of process, each party designates the electronic addresses above and agrees that service via email satisfies applicable rules of civil procedure.</li>
    <li style="${S.li}"><strong>Modification/Waiver</strong> &ndash; Must be in a signed writing. Failure to enforce is not a waiver.</li>
    <li style="${S.li}"><strong>Severability</strong> &ndash; Unenforceable provisions will be modified or severed; remainder stays in force.</li>
    <li style="${S.li}"><strong>Entire Agreement</strong> &ndash; This document supersedes all prior agreements and discussions.</li>
  </ul>
  </div>
</div>`
}


function renderProposalHtml(f: FormData): string {
  const deposit = calcMilestone(f.totalAmount, 0.5)
  const phase1 = calcMilestone(f.totalAmount, 0.25)
  const launch = calcMilestone(f.totalAmount, 0.25)
  const pw = phaseWeeks(f.durationWeeks)

  const scopeRows = [
    { item: 'Pages', detail: `Up to ${f.pageCount || '[PAGE COUNT]'} fully designed pages` },
    ...f.scopeItems.split('\n').filter(l => l.trim()).map(l => {
      const [item, ...rest] = l.split('|')
      return { item: (item || '').trim(), detail: (rest.join('|') || '').trim() }
    }),
  ].map(r => `<tr><td style="${S.td}"><strong>${r.item}</strong></td><td style="${S.td}">${r.detail}</td></tr>`).join('')

  return `
<div style="font-family:Georgia,'Times New Roman',serif; color:#1a1a1a; max-width:700px; margin:0 auto;">
  ${DOC_HEADER}
  <div style="padding:0 32px 32px 32px;">
  <h1 style="${S.title}">Project Proposal</h1>
  <p style="text-align:center; font-size:16px; color:#333; margin:0 0 4px 0;">${f.clientName || '[Client Name]'}</p>
  <p style="${S.subtitle}">Prepared by <strong>LuxWeb Studio</strong> &middot; ${formatDate(f.effectiveDate)}<br/>Proposal v 1.0</p>

  <hr style="${S.divider}"/>

  <h2 style="${S.h1}">1. Executive Summary</h2>
  <p style="${S.p}">You need a website that looks sharp, loads fast, and converts visitors into customers&mdash;without turning into a money pit six months down the line. We&rsquo;ll build you a modern, secure site that&rsquo;s easy to update and primed for growth, then back you up for three months post-launch so you&rsquo;re never left hanging.</p>

  <hr style="${S.divider}"/>

  <h2 style="${S.h1}">2. Project Goals</h2>
  <ul style="${S.ul}">
    <li style="${S.li}"><strong>Professional Presence</strong> &ndash; Convey Credibility, Capture Leads, Empower Editing, Provide Scalability.</li>
    <li style="${S.li}"><strong>Lead Generation</strong> &ndash; Funnel visitors toward clear calls-to-action and capture qualified leads.</li>
    <li style="${S.li}"><strong>Ease of Management</strong> &ndash; Empower your team to edit copy, swap images, and publish blog posts without touching code.</li>
    <li style="${S.li}"><strong>Scalable Foundation</strong> &ndash; Clean, component-based code that can grow with new features (e-commerce, memberships, etc.) down the road.</li>
  </ul>

  <hr style="${S.divider}"/>

  <h2 style="${S.h1}">3. Scope &amp; Deliverables</h2>

  <table style="${S.table}">
    <tr><th style="${S.th}">Item</th><th style="${S.th}">Details</th></tr>
    ${scopeRows}
  </table>

  <p style="${S.note}">Anything not listed above (e-commerce, custom app features, ongoing hosting, etc.) is out-of-scope and can be quoted separately.</p>

  <hr style="${S.divider}"/>

  <h2 style="${S.h1}">4. Process &amp; Timeline</h2>

  <p style="${S.phaseName}">Phase 1 &ndash; Discovery &amp; Design (${pw.phase1})</p>
  <ul style="${S.ul}">
    <li style="${S.li}">Goal &amp; audience workshop</li>
    <li style="${S.li}">Site map &amp; wireframes</li>
    <li style="${S.li}">Visual mock-ups &rarr; Client review (3 business days)</li>
  </ul>

  <p style="${S.phaseName}">Phase 2 &ndash; Build (${pw.phase2})</p>
  <ul style="${S.ul}">
    <li style="${S.li}">Responsive front-end &amp; CMS setup</li>
    <li style="${S.li}">Content migration, integrations</li>
    <li style="${S.li}">Staging demo &rarr; Client feedback (3 business days)</li>
  </ul>

  <p style="${S.phaseName}">Phase 3 &ndash; Test &amp; Launch (${pw.phase3})</p>
  <ul style="${S.ul}">
    <li style="${S.li}">Cross-browser / device QA</li>
    <li style="${S.li}">Performance &amp; security checks</li>
    <li style="${S.li}">Final tweaks, go-live, hand-off training</li>
  </ul>

  <table style="${S.table}">
    <tr><td style="${S.th}">Total Duration</td><td style="${S.td}">~${f.durationWeeks || '[NUMBER]'} weeks</td></tr>
    <tr><td style="${S.th}">Target Launch</td><td style="${S.td}">${formatDate(f.targetLaunchDate)}</td></tr>
  </table>

  <hr style="${S.divider}"/>

  <h2 style="${S.h1}">5. Investment</h2>

  <table style="${S.table}">
    <tr><th style="${S.th}">Milestone</th><th style="${S.th}">%</th><th style="${S.th}">Amount</th><th style="${S.th}">Due</th></tr>
    <tr><td style="${S.td}">Deposit</td><td style="${S.td}">50%</td><td style="${S.td}">${deposit}</td><td style="${S.td}">On signing</td></tr>
    <tr><td style="${S.td}">Phase 1 Approval</td><td style="${S.td}">25%</td><td style="${S.td}">${phase1}</td><td style="${S.td}">After design sign-off</td></tr>
    <tr><td style="${S.td}">Launch</td><td style="${S.td}">25%</td><td style="${S.td}">${launch}</td><td style="${S.td}">Before go-live</td></tr>
  </table>

  <p style="${S.p}">All invoices Net 7. Late payments accrue the greater of 1.5%/month or the legal maximum, plus collection costs.</p>

  <hr style="${S.divider}"/>

  <h2 style="${S.h1}">6. Assumptions</h2>
  <ul style="${S.ul}">
    <li style="${S.li}">Client will provide final copy, imagery, and brand assets within three (3) days of request.</li>
    <li style="${S.li}">One consolidated feedback round per phase; additional rounds billed at $100/hr.</li>
    <li style="${S.li}">Hosting, domain, and SSL costs are the client&rsquo;s responsibility.</li>
    <li style="${S.li}">For the full legal details (IP ownership, confidentiality, indemnity, etc.), please review the Web Design &amp; Development Agreement attached.</li>
    <li style="${S.li}">Proposal is non-binding; scope/pricing governed by the signed Agreement.</li>
  </ul>

  <hr style="${S.divider}"/>

  <h2 style="${S.h1}">7. Why LuxWeb Studio?</h2>
  <ul style="${S.ul}">
    <li style="${S.li}"><strong>Full-stack expertise</strong> &ndash; From Figma comps to production servers.</li>
    <li style="${S.li}"><strong>Performance-first mindset</strong> &ndash; We treat site speed like a feature, not an afterthought.</li>
    <li style="${S.li}"><strong>Plain-English comms</strong> &ndash; No jargon, no ghosting, regular check-ins.</li>
    <li style="${S.li}"><strong>Future-proof code</strong> &ndash; Modular components you can extend without a rebuild next year.</li>
  </ul>

  <hr style="${S.divider}"/>

  <h2 style="${S.h1}">8. Next Steps</h2>
  <ol style="${S.ol}">
    <li style="${S.olLi}">Review &amp; sign the Agreement.</li>
    <li style="${S.olLi}">Pay the 50% deposit (invoice sent upon signature).</li>
    <li style="${S.olLi}">Kick-off call &amp; scheduling &rarr; we get to work.</li>
  </ol>

  <p style="${S.p}">Questions? Shoot an email to <strong>support@luxwebstudio.dev</strong> or call <strong>${f.phone || '[YOUR PHONE]'}</strong>. We&rsquo;re excited to build something great together!</p>
  </div>
</div>`
}


// ── Plain text renderers (for copy-to-clipboard) ─────────────

function renderAgreementText(f: FormData): string {
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


function renderProposalText(f: FormData): string {
  const deposit = calcMilestone(f.totalAmount, 0.5)
  const phase1 = calcMilestone(f.totalAmount, 0.25)
  const launch = calcMilestone(f.totalAmount, 0.25)
  const pw = phaseWeeks(f.durationWeeks)

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

Item                  | Details
Pages                 | Up to ${f.pageCount || '[PAGE COUNT]'} fully designed pages
${f.scopeItems.split('\n').filter(l => l.trim()).map(l => { const [item, ...rest] = l.split('|'); return `${(item || '').trim().padEnd(22)}| ${(rest.join('|') || '').trim()}` }).join('\n')}

Anything not listed above (e-commerce, custom app features, ongoing hosting, etc.) is out-of-scope and can be quoted separately.


4. Process & Timeline

Phase 1 – Discovery & Design (${pw.phase1})
• Goal & audience workshop
• Site map & wireframes
• Visual mock-ups → Client review (3 business days)

Phase 2 – Build (${pw.phase2})
• Responsive front-end & CMS setup
• Content migration, integrations
• Staging demo → Client feedback (3 business days)

Phase 3 – Test & Launch (${pw.phase3})
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

  const renderedHtml = activeDoc === 'agreement'
    ? renderAgreementHtml(form)
    : renderProposalHtml(form)

  const renderedText = activeDoc === 'agreement'
    ? renderAgreementText(form)
    : renderProposalText(form)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(renderedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadPDF = async () => {
    setGenerating(true)
    try {
      const html2pdf = (await import('html2pdf.js')).default

      const el = document.createElement('div')
      el.innerHTML = renderedHtml

      const docTitle = activeDoc === 'agreement'
        ? `LuxWeb Agreement - ${form.clientName || 'Draft'}`
        : `LuxWeb Proposal - ${form.clientName || 'Draft'}`

      await (html2pdf().set as any)({
        margin: [0.6, 0.7, 0.6, 0.7],
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
              {activeDoc === 'agreement' && (
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
              )}
              {activeDoc === 'proposal' && (
                <div className="sm:col-span-2">
                  <label className="text-xs text-gray-400 mb-1 block">Scope Items (one per line, format: Item | Details)</label>
                  <textarea
                    rows={6}
                    value={form.scopeItems}
                    onChange={e => update('scopeItems', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 resize-none font-mono text-xs"
                    placeholder="Design | Custom UI/UX, two (2) revision rounds per phase&#10;Content Migration | Port existing copy & imagery&#10;Security | HTTPS, best-practice hardening"
                  />
                </div>
              )}
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

        {/* Right: Preview — styled like a paper document */}
        <div className={`${showPreview ? 'block' : 'hidden'} xl:block`}>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden sticky top-28">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h3 className="text-sm font-medium text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-400" />
                Preview: {activeDoc === 'agreement' ? 'Agreement' : 'Proposal'}
              </h3>
            </div>
            <div className="p-3 sm:p-4 max-h-[70vh] overflow-y-auto bg-gray-900/50">
              {/* Paper container */}
              <div
                ref={previewRef}
                className="bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-[700px]"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

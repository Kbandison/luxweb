> **ARCHIVED 2026-09-28.** Stale — most of this shipped in April (bc66ffe), and the rest conflicts with current contracts (50/25/25 payments, up to 10 pages, 60-day support, AI Lead Assistant). Kept for reference only; do not build from it.

# LuxWeb Studio — Pricing Page Rewrite Spec

**Target file:** `luxwebstudio.dev/pricing` (pricing page route in the LuxWeb marketing site)
**Goal:** Reposition the pricing page from a feature-dump to an outcome-driven, conviction-building page that justifies the $4,500 price and pre-qualifies buyers.
**Scope:** Pricing page ONLY. Do not modify other routes, global layout, nav, or footer.
**Positioning constraint:** Site stays niche-agnostic and location-agnostic. No references to landscaping, Atlanta, Georgia, or any specific industry. Outbound campaigns handle niche specificity separately.

---

## Strategic context (read before writing code)

The current pricing page has clean visuals but weak strategic messaging:
- Headline ("One Package. Real Results.") says nothing specific
- Product name ("The Signature Site") isn't explained for who or why
- Bullet list reads as a feature dump, not business outcomes
- No ROI framing — $4,500 feels like a cost, not an investment
- No qualification filter (no "who this is for / not for")
- FAQ answers objections but doesn't sell against alternatives (Wix, cheap devs)

The rewrite shifts the page from "here's what I build" to "here's how this grows your business" — without losing the clean premium aesthetic or changing the core offer structure.

**Do NOT change:**
- The Signature Site offer itself ($4,500, 3 weeks, 50% deposit / 50% on launch)
- The founding client pricing ($3,750 for first 3 clients)
- The Care Plan recurring offer ($175/month)
- Add-ons (copywriting, extra pages) — these are kept but de-emphasized visually
- Overall dark/premium visual aesthetic

---

## New page structure (top to bottom)

### 1. Hero section

**Headline (H1):**
> A website that actually brings you customers.

**Subhead:**
> Custom-designed, mobile-first websites for local service businesses that want to look like a brand — not a listing. Built to turn visitors into leads, so your business grows beyond word-of-mouth.

**Primary CTA button:** "Start Your Project" (links to contact/intake form)
**Secondary CTA (text link):** "See what's included ↓" (smooth-scrolls to the offer section)

---

### 2. The offer section ("The Signature Site")

Keep the product name "The Signature Site" but add a one-line positioning statement beneath it.

**Product name (H2):** The Signature Site
**Positioning line:** For established local service businesses ready to stop looking generic online.

**Price display:**
- Large: **$4,500**
- Below price, smaller: *Delivered in 3 weeks · 50% to start, 50% on launch*

**ROI anchor line (directly under price, slightly larger than body text, accent color):**
> Most clients recover their investment with just a handful of new customers.

**What's included — rewrite as benefits, not features.** Use this exact list and wording:

- **Custom design that matches your brand.** No templates. Your business doesn't look like every other site in your industry.
- **Looks flawless on every device.** Mobile-first build, because over 60% of your customers find you on their phone.
- **Built to show up on Google.** Local SEO setup, schema markup, and fast page speeds so new customers can find you.
- **Captures every lead.** Contact forms with instant email and SMS notifications, so you never miss a call-ready customer.
- **You'll know what's working.** Google Analytics and Google Business Profile setup included.
- **Up to 7 pages.** Home, services, about, gallery, service area, testimonials, contact — the pages that actually drive leads.
- **One revision round included.** We get it right together before launch.
- **30 days of post-launch support.** Tweaks, questions, fixes — we're there after you go live.

---

### 3. "Who this is for / Not for" section

New section, two columns. Headline: **Is this right for you?**

**This is for you if:**
- You run an established local service business and want to look like it
- You're tired of a site that doesn't bring in leads
- You understand that your website is an investment, not an expense
- You want a professional partner, not a DIY platform

**This is not for you if:**
- You're looking for the cheapest option available
- A basic template site from Wix or Squarespace meets your needs
- You're not ready to invest in growing your business
- You want to manage every pixel yourself

Visual treatment: two clean columns, green check icons for the left column, muted X or dash icons for the right. Not aggressive — confident.

---

### 4. The Care Plan section

This stays — it's the recurring revenue engine. Reframe it as a benefit, not an afterthought.

**Section headline:** Keep your site running at its best.
**Subhead:** The Care Plan — $175/month

**What's included:**
- Hosting, security, and software updates handled for you
- Small content edits whenever you need them
- Monthly analytics review so you know what's working
- Priority support when something needs attention
- Backups and uptime monitoring running in the background

**Supporting line beneath:** Most clients add the Care Plan at launch. Cancel anytime.

---

### 5. Add-ons (de-emphasized)

Keep add-ons but treat them visually as a smaller, simpler block. Not a prominent section.

**Headline:** Optional add-ons
- Professional copywriting: +$850
- Additional pages: +$400 each

No more than this. Do not list every possible add-on.

---

### 6. FAQ section (rewritten to sell, not just answer)

Replace the current FAQ with these questions. Answers should be confident, 2-3 sentences max, and reinforce positioning.

**Q: Why not just use Wix, Squarespace, or WordPress?**
A: Those platforms are built for people who want to build their own site. This is for business owners who'd rather focus on running their business while a professional handles the website. A DIY site looks like a DIY site — and your customers can tell.

**Q: How is this different from a cheaper developer?**
A: Cheaper developers typically deliver template sites with generic design, weak SEO, and no strategy behind the layout. The Signature Site is custom-designed for conversion, built on a modern tech stack (Next.js and Vercel) for speed and reliability, and set up to actually generate leads — not just exist online.

**Q: How long does it take?**
A: Three weeks from kickoff to launch, assuming content and feedback move on schedule.

**Q: What do I need to provide?**
A: Your logo, your photos (or access to your existing ones), and information about your services. If you need help with copywriting or photography, we can recommend partners or add copywriting to your project.

**Q: What happens after launch?**
A: You get 30 days of post-launch support included. Most clients continue with the Care Plan for ongoing updates, hosting, and support.

**Q: Do you offer payment plans?**
A: Yes — 50% to start, 50% on launch. For most clients that splits the investment across the 3-week build.

**Q: What if I need something bigger than the Signature Site?**
A: Let's talk. If your needs go beyond a service-business site (custom applications, e-commerce, complex integrations), reach out and we'll scope a custom project.

---

### 7. Closing CTA section

**Headline:** Ready to build a website that works as hard as you do?
**Subhead:** Start with a free 20-minute call. We'll talk through your business, your goals, and whether the Signature Site is the right fit.
**CTA button:** "Book Your Free Call"

---

## Design & implementation notes

- **Maintain existing visual language:** dark theme, existing typography, existing accent colors. Do not introduce new fonts or color systems.
- **Mobile-first:** Every section must render cleanly at 375px width before desktop concerns.
- **No new dependencies:** Use existing components from the LuxWeb design system (shadcn/ui, Aceternity UI, Lucide icons). Do not add new libraries.
- **Smooth scroll behavior** between hero CTA and offer section.
- **Section spacing:** Generous vertical padding between sections (maintain existing rhythm).
- **ROI anchor line under price:** Give it visual emphasis — slightly larger than body text, use the site's accent color, and treat it as a standalone line with breathing room above and below.
- **"For you / Not for you" columns:** On mobile, stack vertically with "For you" first.
- **FAQ:** Use accordion pattern if the existing site uses one; otherwise clean expandable sections.
- **CTAs:** All three CTAs on the page ("Start Your Project," "Book Your Free Call," any inline ones) should route to the same existing contact/intake flow. Do not create new routes.

---

## What NOT to do

- Do not rewrite any other pages (home, about, process, portfolio) in this pass.
- Do not change global components (nav, footer, layout).
- Do not change pricing numbers.
- Do not add niche-specific or location-specific language anywhere on the page.
- Do not add testimonials or case study blocks to this page (those live on other pages).
- Do not introduce new animation libraries or motion patterns beyond what the site already uses.
- Do not remove the Care Plan section — it is strategically critical.

---

## Acceptance criteria

- [ ] Hero headline and subhead replaced with the new copy exactly as written above
- [ ] "The Signature Site" offer section reorganized with benefit-based bullets (exact copy above)
- [ ] ROI anchor line present directly under the $4,500 price
- [ ] "Is this right for you?" two-column section added
- [ ] Care Plan section reframed with new headline and benefit-based copy
- [ ] Add-ons visually de-emphasized (smaller block, only copywriting and extra pages listed)
- [ ] FAQ rewritten with the 7 questions and answers above
- [ ] Closing CTA section added
- [ ] Page is fully mobile-responsive (test at 375px)
- [ ] No changes to other routes, global components, or the existing visual theme
- [ ] All existing CTAs route to the existing contact/intake flow

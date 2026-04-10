export interface Package {
  name: string
  description: string
  price: string
  features: string[]
  idealFor: string
  cta: string
}

export const signatureSite: Package = {
  name: "The Signature Site",
  description: "A custom-designed, mobile-first website built to generate leads and grow your business.",
  price: "Starting at $4,500",
  features: [
    "AI-powered chat assistant — 24/7 lead qualification & customer Q&A",
    "Up to 10 custom-designed pages",
    "2 rounds of revisions per phase",
    "Mobile-first responsive build",
    "Lead capture forms with email & SMS notifications",
    "Local SEO setup (meta tags, Google Business, Search Console)",
    "Local business schema markup",
    "Performance guarantee: Lighthouse 90+",
    "WCAG 2.1 AA accessibility",
    "Blog-ready CMS setup",
    "Analytics integration (GA4)",
    "Social media integration & Open Graph cards",
    "Custom 404 page, favicon, Open Graph images",
    "30-minute training call at launch",
    "60 days of post-launch support",
    "Delivered in 2-3 weeks",
  ],
  idealFor: "Local service businesses, contractors, professional services, and growing brands ready for a website that actually converts",
  cta: "Get Your Free Quote",
}

export const addOns = [
  { name: "Additional Pages", price: "+$400/page" },
  { name: "Copywriting", price: "+$850" },
  { name: "Care Plan", price: "$175/mo", description: "Hosting, updates, small edits, monthly analytics review, priority support" },
]

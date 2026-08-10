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
  price: "$4,500",
  features: [
    "AI Lead Assistant — 24/7 chatbot, smart intake, and personalized auto-replies",
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

// Optional extras, priced per project. The Care Plan is deliberately kept
// separate below — it's recurring, not a one-time add-on.
export const addOns = [
  { name: "Professional copywriting", price: "+$850" },
  { name: "Additional pages", price: "+$400 each" },
]

export const carePlan = {
  name: "The Care Plan",
  price: "$175/month",
  features: [
    "Hosting, security, and software updates handled for you",
    "Small content edits whenever you need them",
    "Monthly analytics review so you know what's working",
    "Priority support when something needs attention",
    "Backups and uptime monitoring running in the background",
  ],
}

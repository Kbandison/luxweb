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
    "Up to 7 custom-designed pages",
    "Mobile-first, responsive build",
    "Lead capture forms with notifications",
    "Local SEO & Google Business optimization",
    "Analytics integration",
    "Performance-optimized (Next.js)",
    "1 round of revisions",
    "Delivered in 2-3 weeks",
    "30-day post-launch support",
  ],
  idealFor: "Local service businesses, contractors, professional services, and growing brands ready for a website that actually converts",
  cta: "Get Your Free Quote",
}

export const addOns = [
  { name: "Additional Pages", price: "+$400/page" },
  { name: "Copywriting", price: "+$850" },
  { name: "Care Plan", price: "$175/mo", description: "Hosting, updates, small edits, monthly analytics review, priority support" },
]

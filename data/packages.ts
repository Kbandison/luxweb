export interface Package {
  name: string
  description: string
  price: string
  originalPrice?: string
  features: string[]
  idealFor: string
  cta: string
  popular: boolean
  badge?: string
}

export const packages: Package[] = [
  {
    name: "Starter Package",
    description: "Perfect for new businesses getting online",
    price: "$1,100",
    originalPrice: "$1,400",
    features: [
      "Professional single-page website",
      "Mobile-responsive design",
      "Basic SEO optimization",
      "Contact form integration",
      "1 week delivery",
      "30-day support"
    ],
    idealFor: "New businesses, personal brands, service providers",
    cta: "Get Your Quote",
    popular: false,
    badge: "Save $300"
  },
  {
    name: "Growth Package",
    description: "Ideal for established businesses ready to scale",
    price: "$1,300",
    originalPrice: "$1,700",
    features: [
      "Multi-page custom website",
      "Advanced SEO setup",
      "Analytics integration",
      "Social media integration",
      "Blog setup (optional)",
      "2 weeks delivery",
      "60-day support"
    ],
    idealFor: "Growing businesses, e-commerce, professional services",
    cta: "Start Your Project",
    popular: true,
    badge: "Save $400"
  },
  {
    name: "Complete Package",
    description: "Full-service solution for serious growth",
    price: "$1,500",
    originalPrice: "$2,000",
    features: [
      "Custom web application",
      "Database integration",
      "User authentication",
      "Payment processing",
      "Advanced functionality",
      "2+ weeks delivery",
      "90-day support"
    ],
    idealFor: "Established businesses, complex requirements",
    cta: "Let's Discuss",
    popular: false,
    badge: "Save $500"
  },
  {
    name: "Enterprise Package",
    description: "Premium solution for maximum results",
    price: "$2,500",
    originalPrice: "$3,200",
    features: [
      "Custom enterprise web application",
      "Advanced database architecture",
      "Multi-user authentication system",
      "Payment gateway integration",
      "Advanced analytics dashboard",
      "API development",
      "Priority support",
      "3+ weeks delivery",
      "6-month support"
    ],
    idealFor: "Large businesses, complex enterprise needs",
    cta: "Contact Sales",
    popular: false,
    badge: "Save $700"
  }
]
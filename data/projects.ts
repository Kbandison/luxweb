export interface Project {
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

export const projects: Project[] = [
  {
    title: "Local Bakery Online Ordering System",
    description: "Helped local bakery increase online orders with easy-to-use ordering system",
    tech: ["Next.js", "Responsive Design", "Contact Forms"],
    result: "Increased online orders by 40%",
    category: "E-commerce",
    images: [
      "/api/placeholder/400/300",
      "/api/placeholder/400/300", 
      "/api/placeholder/400/300"
    ],
    color: "from-orange-500 to-red-500",
    links: {
      live: "https://example-bakery.com"
    }
  },
  {
    title: "Healthcare Provider Professional Site",
    description: "Professional credibility site that converts prospects into patients",
    tech: ["Professional Design", "Mobile-First", "SEO Optimized"],
    result: "Enhanced professional credibility",
    category: "Healthcare",
    images: [
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ],
    color: "from-blue-500 to-cyan-500",
    links: {
      live: "https://example-healthcare.com"
    }
  },
  {
    title: "Community Resource Platform",
    description: "Modern, accessible design serving the community",
    tech: ["Modern UI/UX", "Accessibility Features", "Content Management"],
    result: "Improved community engagement",
    category: "Community",
    images: [
      "/api/placeholder/400/300"
    ],
    color: "from-purple-500 to-pink-500",
    links: {
      live: "https://example-community.org"
    }
  }
]

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
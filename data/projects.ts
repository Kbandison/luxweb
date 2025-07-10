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
    title: "Cake Haven",
    description: "Helped local bakery increase online orders with easy-to-use ordering system",
    tech: ["Next.js", "Responsive Design", "TypeScript"],
    result: "Increased online orders by 90%",
    category: "E-commerce",
    images: [
      "/Screenshot 2025-06-19 133941.png",
      "/Screenshot 2025-06-19 134235.png",
      "/Screenshot 2025-06-19 134255.png",
      "/Screenshot 2025-06-19 134320.png"
    ],
    color: "from-orange-500 to-red-500",
    links: {
      live: "https://bit.ly/4n8OG3t"
    }
  },
  {
    title: "Galon Consulting",
    description: "Galon Consulting Services, LLC provides world-class solutions in billing, compliance, and patient care for practices of all sizes.",
    tech: ["Professional Design", "Mobile-First", "SEO Optimized"],
    result: "Enhanced professional credibility",
    category: "Healthcare",
    images: [
      "/Screenshot 2025-06-10 082614.png",
      "/Screenshot 2025-06-10 082345.png",
      "/Screenshot 2025-06-10 082227.png",
    ],
    color: "from-blue-500 to-cyan-500",
    links: {
      live: "https://galon-consulting.vercel.app/"
    }
  },
  {
    title: "Reparation Road",
    description: "Uncover your family history and explore Black heritage with Reparation Road’s research, genealogy, and cultural resources.",
    tech: ["Modern UI/UX", "Accessibility Features", "Content Management"],
    result: "Improved community engagement",
    category: "Community",
    images: [
      "/Screenshot 2025-06-30 092759.png",
      "/Screenshot 2025-06-30 095029.png",
      "/Screenshot 2025-06-30 095055.png",
    ],
    color: "from-purple-500 to-pink-500",
    links: {
      live: "https://reparationroad.org"
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
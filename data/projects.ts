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
  // A LuxWeb concept build (a demo for a fictional business), not client work. Concepts sit at the end of
  // the list, below client work and planned sites, and aren't counted as delivered projects.
  concept?: boolean
}

export const projects: Project[] = [
  {
    title: "Hoop Metrix",
    description: "NBA and WNBA rosters, all in one place.",
    tech: ["Next.js", "Responsive Design", "TypeScript"],
    result: "Launched live NBA & WNBA rosters",
    category: "Sports",
    images: [
      "/Screenshot 2025-10-25 203837.png",
      "/Screenshot 2025-10-25 204057.png",
      "/Screenshot 2025-10-25 204016.png",
      "/Screenshot 2025-10-25 204122.png",
      "/Screenshot 2025-10-25 204218.png",
      "/Screenshot 2025-10-25 204347.png",
      "/Screenshot 2025-10-25 204235.png",
      "/Screenshot 2025-10-25 204421.png",
      "/Screenshot 2025-10-25 204256.png"
    ],
    color: "from-blue-500 to-orange-500",
    links: {
      live: "http://bit.ly/47qyvr0"
    }
  },
  {
    title: "Cake Haven",
    description: "Easy-to-use online ordering system for a local bakery",
    tech: ["Next.js", "Responsive Design", "TypeScript"],
    result: "Launched online ordering",
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
    description: "Billing, compliance, and practice support for healthcare providers of all sizes.",
    tech: ["Professional Design", "Mobile-First", "SEO Optimized"],
    result: "Professional site for a healthcare consultancy",
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
    description: "Genealogy research and cultural resources for exploring Black heritage.",
    tech: ["Modern UI/UX", "Accessibility Features", "Content Management"],
    result: "Genealogy and heritage resource hub",
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
  },
  {
    title: "JSW Law Group",
    description: "Metro-Atlanta law firm covering real estate, business, and immigration law.",
    tech: ["Modern UI/UX", "Accessibility Features", "Content Management"],
    result: "Multi-practice law firm site",
    category: "Community",
    images: [
      "/Screenshot 2025-07-12 234024.png",
      "/Screenshot 2025-07-12 234046.png",
      "/Screenshot 2025-07-12 234059.png",
      "/Screenshot 2025-07-12 234115.png",
    ],
    color: "from-purple-500 to-pink-500",
    links: {
      live: "https://jswlaw.vercel.app"
    }
  },
  {
    title: "Axionyx",
    description: "Brand site for a digital agency offering web design, SaaS, and ongoing support.",
    tech: ["Modern UI/UX", "Accessibility Features", "Content Management"],
    result: "Premium agency brand site",
    category: "Agency",
    images: [
      "/Screenshot 2025-06-10 140131.png",
    ],
    color: "from-purple-500 to-pink-500",
    links: {
      live: "https://axionyx.vercel.app/"
    }
  },
  {
    title: "FlexFit Gym",
    description: "Gym site highlighting coaching, equipment, and community.",
    tech: ["Modern UI/UX", "Accessibility Features", "Content Management"],
    result: "Membership-focused gym site",
    category: "Agency",
    images: [
      "/Screenshot 2025-07-07 163435.png",
      "/Screenshot 2025-07-07 163456.png",
      "/Screenshot 2025-07-07 163511.png"
    ],
    color: "from-purple-500 to-pink-500",
    links: {
      live: "https://flexfit-gym-eight.vercel.app/"
    }
  },
  // Concept builds go below this line.
  {
    title: "Settles Bridge Lawn & Landscape",
    description: "A concept site for a north Gwinnett lawn and pine straw crew, built around the shop's route board.",
    tech: ["Next.js", "GSAP Scroll", "Mobile-First"],
    result: "Concept build: prices up front, route day by city",
    category: "Concept",
    images: [
      "/projects/settles-bridge-lawn-1.jpg",
      "/projects/settles-bridge-lawn-2.jpg",
      "/projects/settles-bridge-lawn-3.jpg",
      "/projects/settles-bridge-lawn-4.jpg"
    ],
    color: "from-green-900 to-emerald-950",
    links: {
      live: "https://settles-bridge-lawn.luxwebstudio.dev"
    },
    concept: true
  }
]

// Portfolio stats (easily editable)
export interface PortfolioStat {
  icon: string
  value: string
  label: string
  color: string
}

// "Websites Delivered" is a placeholder count — update it as real projects ship.
// The other two are deliberately claims we can actually back up: the delivery
// window quoted everywhere on the site, and the Lighthouse score guaranteed in
// the package.
export const portfolioStats: PortfolioStat[] = [
  {
    icon: "Code",
    value: "10+",
    label: "Websites Delivered",
    color: "green"
  },
  {
    icon: "Clock",
    value: "2-3 wks",
    label: "Typical Delivery",
    color: "blue"
  },
  {
    icon: "TrendingUp",
    value: "90+",
    label: "Guaranteed Lighthouse Score",
    color: "amber"
  }
]
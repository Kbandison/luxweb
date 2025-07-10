export interface Testimonial {
  name: string
  role: string
  company: string
  content: string
  rating: number
  image?: string
}

export const testimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    role: "Owner",
    company: "Sweet Treats Bakery",
    content: "LuxWeb Studio transformed our business! Our new website increased online orders by 40% in just the first month. The team was professional, responsive, and delivered exactly what we needed.",
    rating: 5,
    image: "/api/placeholder/60/60"
  },
  {
    name: "Dr. Michael Chen",
    role: "Physician",
    company: "Chen Family Practice",
    content: "The website they built for my practice has helped establish credibility with new patients. I've received numerous compliments on the professional design and easy appointment booking system.",
    rating: 5,
    image: "/api/placeholder/60/60"
  },
  {
    name: "Jennifer Martinez",
    role: "Director",
    company: "Community Resource Center",
    content: "Working with LuxWeb Studio was a pleasure from start to finish. They understood our mission and created a website that truly serves our community. The accessibility features are outstanding.",
    rating: 5,
    image: "/api/placeholder/60/60"
  },
  {
    name: "David Thompson",
    role: "CEO",
    company: "Thompson Consulting",
    content: "Our new website has been a game-changer for lead generation. The SEO optimization and modern design have significantly improved our online presence. Highly recommend their services!",
    rating: 5,
    image: "/api/placeholder/60/60"
  },
  {
    name: "Lisa Park",
    role: "Founder",
    company: "Park Creative Studio",
    content: "The team at LuxWeb Studio brought our vision to life perfectly. The website not only looks stunning but also functions flawlessly. Our client inquiries have doubled since launch.",
    rating: 5,
    image: "/api/placeholder/60/60"
  },
  {
    name: "Robert Williams",
    role: "Manager",
    company: "Williams Auto Repair",
    content: "Finally, a website that actually brings in customers! The local SEO work they did has us ranking #1 for auto repair in our area. The investment paid for itself in the first month.",
    rating: 5,
    image: "/api/placeholder/60/60"
  }
]
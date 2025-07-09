# LuxWeb Project Rules

## Technology Stack

- **Framework:** Next.js
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Backend/DB:** Supabase
- **UI Components:** shadcn/ui, Aceternity UI
- **Icons:** Lucide Icons

## Development Guidelines

- **Mobile-First Design:** All designs must be mobile-first
- **Modular Code:** Write reusable, modular components
- **TypeScript:** Use TypeScript for type safety
- **Code Comments:** Add inline comments for complex logic
- **Latest Dependencies:** Always verify latest installation commands

## Design Inspiration

When creating mobile designs, take cues from:
- Amazon App
- eBay App
- Google Play Store

## Commands

- **Build:** `npm run build`
- **Dev:** `npm run dev`
- **Lint:** `npm run lint`
- **Type Check:** `npm run type-check`

# LuxWeb Studio - Complete Development Brief

## Project Overview
Build a conversion-focused MVP website for LuxWeb Studio, a web development agency, with a black background and glassomorphic design aesthetic.

**Timeline:** Complete MVP by end of week (3-5 days)
**Priority:** Complete all sections over polish

## Business Requirements

### Company Information
- **Business Name:** LuxWeb Studio
- **Industry:** Web Development Agency
- **Target Clients:** Local businesses and startups
- **Unique Value Proposition:** Speed, personal attention, modern tech stack, direct developer access

### Services Offered
1. **Starter Package** ($1100) - Single-page websites for new businesses
2. **Growth Package** ($1300) - Multi-page with advanced features (most popular)
3. **Complete Package** ($1500) - Full-stack solutions + $100/month retainer

### Key Business Differentiators
- 1-2 week delivery (vs months for agencies)
- Direct access to developer (no middleman)
- Modern tech stack (Next.js, TypeScript, Tailwind)
- Personal attention (not juggling 20+ clients)
- Fair pricing (no agency overhead)

## Technical Specifications

### Tech Stack
```
Next.js 14+ (App Router)
├── TypeScript (strict mode)
├── Tailwind CSS
├── shadcn/ui components
├── Supabase (database)
├── Vercel (hosting + analytics)
└── Lucide Icons
```

### Database Schema (Supabase)
```sql
-- Contact form submissions
CREATE TABLE contact_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  project_type TEXT CHECK (project_type IN ('starter', 'growth', 'complete')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted'))
);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
```

### Environment Variables Needed
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: For future email integration
RESEND_API_KEY=your_resend_api_key
```

## Design Specifications

### Color Palette
```css
/* Primary Brand Colors */
--primary-dark: #160528;
--primary-medium: #1c033c;
--primary-light: #2d1b69;

/* Background System */
--bg-primary: #000000;        /* Pure black */
--bg-secondary: #0a0a0a;      /* Subtle black variation */
--bg-tertiary: #1a1a1a;       /* Dark gray for contrast */

/* Glassomorphic Elements */
--glass-primary: rgba(22, 5, 40, 0.15);
--glass-secondary: rgba(28, 3, 60, 0.12);
--glass-light: rgba(255, 255, 255, 0.08);
--glass-ultra-light: rgba(255, 255, 255, 0.04);

/* Typography */
--text-primary: #ffffff;
--text-secondary: #e5e7eb;
--text-muted: #9ca3af;
--text-accent: #d4b3ff;

/* Interactive Elements */
--cta-primary: #2d1b69;       /* Success green */
--cta-secondary: #7c3aed;     /* Purple */
--border-glass: rgba(255, 255, 255, 0.2);
--shadow-glass: rgba(0, 0, 0, 0.5);
```

### Glassomorphic Component Styles
```css
.glass-card {
  background: rgba(22, 5, 40, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.glass-nav {
  background: rgba(28, 3, 60, 0.12);
  backdrop-filter: blur(30px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-btn-primary {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
}

.glass-hover:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}
```

## Content Structure & Copy

### 1. Hero Section
**Headline:**
- "Stop Losing Customers to Competitors With Better Websites"

**Subheadline:** Emphasize speed, results, and direct developer access

**CTAs:** 
- Primary: "Start my Growth Journey"
- Secondary: "View Our Work"

**Trust Signals:**
- "14-Day Delivery"
- "50+ Happy Clients"

### 2. Pain Points Section
**Title:** "Your Website Should Be Making You Money, Not Costing You Customers"

**Three Key Pain Points:**
1. **Lost Revenue:** "Every day without a professional website, you're losing customers to competitors"
2. **Visibility:** "When people search for your services, competitors show up first"
3. **Credibility:** "Your outdated site makes you look like a small, unreliable business"

### 3. Solutions Section
**Title:** "How LuxWeb Studio Solves This"

**Solutions Map:**
- **Revenue:** "Turn 30% more website visitors into customers with clear calls-to-action"
- **Visibility:** "Appear on Google's first page when customers search for your services"
- **Credibility:** "Look bigger and more professional than competitors"

### 4. Why Choose Us Section
**Title:** "Why Work With LuxWeb Studio"

**Key Points:**
- Personal attention (not outsourced to junior developers)
- Fast delivery (websites in days, not months)
- Full Customizable and Unique
- Direct communication (work directly with the developer)
- Fair pricing (no agency overhead markup)

### 5. Services/Packages Section
**Title:** "Choose Your Growth Package"

**Packages:**

**Starter Package**
- Description: "Perfect for new businesses getting online"
- Features: Professional single-page website, Mobile-responsive design, Basic SEO optimization, Contact form integration, 1 week delivery, 30-day support
- Ideal for: "New businesses, personal brands, service providers"
- CTA: "Get Your Quote"

**Growth Package** [POPULAR]
- Description: "Ideal for established businesses ready to scale"
- Features: Multi-page custom website, Advanced SEO setup, Analytics integration, Social media integration, Blog setup (optional), 2 weeks delivery, 60-day support
- Ideal for: "Growing businesses, e-commerce, professional services"
- CTA: "Start Your Project"

**Complete Package**
- Description: "Full-service solution for serious growth"
- Features: Custom web application, Database integration, User authentication, Payment processing, Advanced functionality, 2+ weeks delivery, 90-day support
- Ideal for: "Established businesses, complex requirements"
- CTA: "Let's Discuss"

### 6. Portfolio Section
**Title:** "Real Results for Real Businesses"

**Project 1: Cake Shop**
- Title: "Local Bakery Online Ordering System"
- Description: "Helped local bakery increase online orders with easy-to-use ordering system"
- Tech: Next.js, Responsive Design, Contact Forms
- Result: "Increased online orders by 40%"

**Project 2: Medical Business**
- Title: "Healthcare Provider Professional Site"
- Description: "Professional credibility site that converts prospects into patients"
- Tech: Professional Design, Mobile-First, SEO Optimized
- Result: "Enhanced professional credibility"

**Project 3: Black History Library**
- Title: "Community Resource Platform"
- Description: "Modern, accessible design serving the community"
- Tech: Modern UI/UX, Accessibility Features, Content Management
- Result: "Improved community engagement"

### 7. Process Section
**Title:** "How It Works"

**4-Step Process:**
1. **Discovery Call** - "Understand your business goals and target audience"
2. **Strategy & Design** - "Create a conversion-focused design and development plan"
3. **Development** - "Build your website with modern tech and best practices"
4. **Launch & Optimize** - "Experience the Growth you've deserved!"

### 8. Testimonials Section
**Title:** "What Our Clients Say"

**Testimonial 1:**
- Name: "Sarah Johnson"
- Company: "Tech Startup"
- Text: "Our new website generated 5x more leads in the first month. The team delivered exactly what we needed."
- Rating: 5 stars

**Testimonial 2:**
- Name: "Mike Chen"
- Company: "E-commerce Store"
- Text: "Sales increased by 180% after the redesign. Professional, fast, and results-driven work."
- Rating: 5 stars

**Testimonial 3:**
- Name: "Lisa Rodriguez"
- Company: "Local Business"
- Text: "Finally have a website that actually converts visitors into customers. Highly recommend!"
- Rating: 5 stars

### 9. FAQ Section
**Title:** "Frequently Asked Questions"

**Key Questions:**
- "How long does it take to build my website?" - "Typically 1-2 weeks depending on complexity"
- "What do you need from me to get started?" - "Basic content, images, and a discovery call"
- "Will my website work on phones and tablets?" - "Yes, all websites are mobile-first and responsive"
- "What happens if I need changes after launch?" - "We provide support and can make adjustments"
- "Do you provide hosting and domain setup?" - "Yes, we handle all technical aspects"
- "How do I know if my website is working?" - "We provide analytics and performance reports"

### 10. Contact Form
**Title:** "Ready to Get Started?"
**Subtitle:** "Let's discuss your project and create a website that grows your business"

**Form Fields:**
- Name (required)
- Email (required)
- Phone (optional)
- Company (optional)
- Project Type (dropdown: Starter, Growth, Complete)
- Message (required)

**CTA Button:** "Send My Message"

## Component Requirements

### Navigation
- Fixed glass navigation with blur effect
- Mobile hamburger menu
- Smooth scroll to sections
- LuxWeb Studio logo
- Menu items: Services, Portfolio, Process, Contact

### Responsive Design
- Mobile-first approach
- Breakpoints: mobile (320px+), tablet (768px+), desktop (1024px+)
- Touch-friendly interactions (44px minimum)
- Optimized for Amazon/eBay/Play Store style UX

### Forms
- Real-time validation
- Glass styling with backdrop blur
- Success/error states
- Spam protection (honeypot field)
- Supabase integration for submissions

### Performance
- Next.js Image optimization
- Lazy loading for portfolio images
- Minimal JavaScript bundles
- SEO optimization with proper metadata

## File Structure
```
luxweb-studio/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── api/
│       └── contact/
│           └── route.ts
├── components/
│   ├── ui/ (shadcn/ui components)
│   ├── Navigation.tsx
│   ├── Hero.tsx
│   ├── PainPoints.tsx
│   ├── Solutions.tsx
│   ├── Services.tsx
│   ├── Portfolio.tsx
│   ├── Process.tsx
│   ├── Testimonials.tsx
│   ├── FAQ.tsx
│   └── Contact.tsx
├── lib/
│   └── supabase.ts
├── public/
│   └── images/
└── styles/
    └── globals.css
```

## Development Priorities

### Day 1: Foundation
- [ ] Initialize Next.js project with TypeScript
- [ ] Set up Tailwind CSS with custom glass styles
- [ ] Install shadcn/ui components
- [ ] Configure Supabase connection
- [ ] Create basic layout and navigation
- [ ] Deploy to Vercel

### Day 2: Core Pages
- [ ] Build Hero section with glassomorphic design
- [ ] Create Pain Points and Solutions sections
- [ ] Implement Services/Packages section
- [ ] Add Portfolio section with project cards
- [ ] Set up contact form with validation

### Day 3: Polish & Mobile
- [ ] Mobile responsive optimization
- [ ] Add Process and Testimonials sections
- [ ] Implement FAQ section
- [ ] Glass hover effects and animations
- [ ] Cross-browser testing

### Day 4: Final Testing
- [ ] Performance optimization
- [ ] SEO metadata setup
- [ ] Form submission testing
- [ ] Final deployment and DNS setup

## Post-MVP Features (Future Phases)
- AI chat widget with Claude integration
- Twilio phone system with AI assistant
- SMS follow-up campaigns
- Enhanced analytics and conversion tracking
- Blog section for content marketing

## Success Metrics
- Mobile-first responsive design
- Fast loading times (< 3 seconds)
- High conversion contact form
- Professional glassomorphic aesthetic
- SEO-optimized structure
- Accessible design (WCAG 2.1 AA)

## Notes
- All content provided above should be used as-is
- Focus on conversion optimization over visual complexity
- Ensure all glass effects work across modern browsers
- Prioritize mobile experience
- Use placeholder images for portfolio until real screenshots provided
- Set up proper error handling for all forms
- Include proper TypeScript types throughout
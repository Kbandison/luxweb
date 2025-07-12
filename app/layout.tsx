import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://luxwebstudio.dev'),
  title: {
    default: "LuxWeb Studio - Professional Web Development | Custom Websites That Convert",
    template: "%s | LuxWeb Studio"
  },
  description: "Stop losing customers to competitors with better websites. LuxWeb Studio builds modern, professional, conversion-focused websites in just 1-2 weeks. Get more leads, sales, and credibility with a custom website that actually works for your business.",
  keywords: [
    "web development",
    "custom websites",
    "professional web design", 
    "business websites",
    "conversion optimization",
    "responsive design",
    "modern web development",
    "website redesign",
    "small business websites",
    "ecommerce websites",
    "landing pages",
    "web developer",
    "website builder",
    "affordable web design",
    "fast website development",
    "mobile responsive websites",
    "WordPress alternatives",
    "custom web applications",
    "lead generation websites",
    "high converting websites",
    "professional website design",
    "website development services",
    "business website design",
    "modern website design",
    "website development company",
    "custom website development",
    "responsive web design",
    "website optimization",
    "SEO friendly websites",
    "fast loading websites",
    "mobile first design",
    "startup websites",
    "corporate websites",
    "portfolio websites",
    "restaurant websites",
    "real estate websites",
    "healthcare websites",
    "law firm websites",
    "consulting websites",
    "freelancer websites",
    "agency websites",
    "NextJS development",
    "React development",
    "TypeScript development",
    "modern JavaScript",
    "web design agency",
    "website development agency",
    "professional web services",
    "website maintenance",
    "website hosting",
    "domain setup",
    "SSL certificates",
    "website security",
    "website analytics",
    "conversion tracking",
    "user experience design",
    "UI/UX design",
    "website performance",
    "website speed optimization",
    "search engine optimization",
    "local SEO",
    "Google ranking",
    "online presence",
    "digital marketing",
    "brand websites",
    "sales funnel websites",
    "membership websites",
    "booking websites",
    "appointment scheduling",
    "online stores",
    "payment integration",
    "contact forms",
    "newsletter signup",
    "social media integration",
    "Google Analytics setup",
    "LuxWeb Studio",
    "lux",
    "luxweb"
  ],
  authors: [{ name: "LuxWeb Studio" }],
  creator: "LuxWeb Studio",
  publisher: "LuxWeb Studio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/android-chrome-512x512.png',
      },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://luxwebstudio.dev',
    title: 'LuxWeb Studio - Professional Web Development | Custom Websites That Convert',
    description: 'Stop losing customers to competitors with better websites. Get a modern, professional, conversion-focused website in just 1-2 weeks.',
    siteName: 'LuxWeb Studio',
    images: [
      {
        url: '/logo-with-text.png',
        width: 1200,
        height: 630,
        alt: 'LuxWeb Studio - Professional Web Development',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LuxWeb Studio - Professional Web Development',
    description: 'Stop losing customers to competitors with better websites. Get a modern, professional, conversion-focused website in just 1-2 weeks.',
    images: ['/logo-with-text.png'],
    creator: '@luxwebstudio',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "LuxWeb Studio",
    "url": "https://luxwebstudio.dev",
    "logo": "https://luxwebstudio.dev/logo-with-text.png",
    "description": "Professional web development studio creating modern, conversion-focused websites for businesses.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Remote",
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-718-635-0736",
      "contactType": "customer service",
      "email": "support@luxwebstudio.dev"
    },
    "sameAs": [
      "https://github.com/luxwebstudio",
      "https://linkedin.com/company/luxwebstudio",
      "https://twitter.com/luxwebstudio"
    ],
    "services": [
      {
        "@type": "Service",
        "name": "Custom Website Development",
        "description": "Professional custom website development for businesses"
      },
      {
        "@type": "Service", 
        "name": "Website Redesign",
        "description": "Modern website redesign to improve conversions and user experience"
      },
      {
        "@type": "Service",
        "name": "E-commerce Development", 
        "description": "E-commerce website development and optimization"
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body
        className={`${inter.variable} antialiased`}
      >
        <Navigation />
        <Analytics />
        <SpeedInsights />
        {children}
        <Footer />
      </body>
    </html>
  );
}

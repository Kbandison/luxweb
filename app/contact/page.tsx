import Contact from "@/components/Contact"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Contact - LuxWeb Studio | Get Your Free Quote",
  description: "Ready to transform your business with a professional website? Contact LuxWeb Studio for a free consultation and personalized quote. Call (718) 635-0736 or email support@luxwebstudio.dev",
  keywords: ["contact web developer", "free consultation", "website quote", "web development consultation", "LuxWeb Studio contact"],
  openGraph: {
    title: "Contact LuxWeb Studio - Get Your Free Quote",
    description: "Ready to transform your business with a professional website? Contact LuxWeb Studio for a free consultation and personalized quote.",
    url: "/contact",
  },
}

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-20">
      <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
        <Contact />
      </Suspense>
    </main>
  )
}
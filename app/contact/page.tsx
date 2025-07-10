import Contact from "@/components/Contact"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Contact - LuxWeb Studio | Get Your Free Quote",
  description: "Ready to transform your business with a professional website? Contact LuxWeb Studio for a free consultation and personalized quote.",
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
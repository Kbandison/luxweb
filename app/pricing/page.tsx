import { Metadata } from "next"
import PricingPageContent from "@/components/PricingPageContent"
import { getActivePromo } from "@/data/promo"

// Metadata is generated per-render so the title and description follow the
// promo in and out rather than advertising a price that has expired.
export function generateMetadata(): Metadata {
  const promo = getActivePromo()

  const title = promo
    ? `Pricing - LuxWeb Studio | The Signature Site ${promo.salePriceWithQualifier} (reg. ${promo.regularPriceLabel})`
    : "Pricing - LuxWeb Studio | The Signature Site at $4,500"

  const description = promo
    ? `Limited-time offer: The Signature Site is ${promo.salePriceWithQualifier.toLowerCase()} instead of ${promo.regularPriceLabel} through ${promo.endsAtLabel}. Custom-designed, mobile-first websites for local service businesses, delivered in 2-3 weeks.`
    : "A website that actually brings you customers. Custom-designed, mobile-first websites for local service businesses. The Signature Site — $4,500, delivered in 2-3 weeks."

  return {
    title,
    description,
    openGraph: {
      title: promo
        ? `LuxWeb Studio Pricing - The Signature Site, ${promo.salePriceWithQualifier.toLowerCase()} for a limited time`
        : "LuxWeb Studio Pricing - The Signature Site",
      description,
      url: "/pricing",
    },
  }
}

export default function PricingPage() {
  const promo = getActivePromo()

  return (
    <main className="min-h-screen pt-[calc(5rem+var(--promo-offset,0px))]">
      <PricingPageContent promo={promo} />
    </main>
  )
}

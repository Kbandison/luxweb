// Google reviews for the homepage, from the LuxWeb CRM's public feed
// (portal.luxwebstudio.dev/api/public/reviews). The CRM copies them from our
// Google Business Profile once a day and decides which ones are shown.
import { z } from 'zod'

const FEED_URL = 'https://portal.luxwebstudio.dev/api/public/reviews'

// Our profile on Google Maps, where every review can be read.
export const GOOGLE_PROFILE_URL = 'https://www.google.com/maps?cid=2638105958723141762'

const FeedSchema = z.object({
  reviews: z.array(
    z.object({
      id: z.string(),
      rating: z.number().int().min(1).max(5),
      review: z.string(),
      name: z.string(),
      reviewedAt: z.string(),
    })
  ),
  summary: z.object({
    count: z.number().int(),
    average: z.number().nullable(),
  }),
})

export type ReviewFeed = z.infer<typeof FeedSchema>

const EMPTY: ReviewFeed = { reviews: [], summary: { count: 0, average: null } }

// Refetched at most hourly, like the rest of the site. A CRM outage hides the
// section instead of breaking the page.
export async function getReviews(): Promise<ReviewFeed> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 3600 } })
    if (!res.ok) return EMPTY
    const parsed = FeedSchema.safeParse(await res.json())
    return parsed.success ? parsed.data : EMPTY
  } catch {
    return EMPTY
  }
}

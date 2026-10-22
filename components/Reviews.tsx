import { ArrowRight, Star } from "lucide-react"
import ScrollReveal from "./ScrollReveal"
import { GOOGLE_PROFILE_URL, type ReviewFeed } from "@/lib/reviews"

const MONTH = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "America/New_York",
})

// The rating badge waits for a few reviews, so one 5-star isn't sold as a record.
const BADGE_MIN_REVIEWS = 3

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden="true"
          className={n <= rating ? "w-4 h-4 text-amber-400 fill-amber-400" : "w-4 h-4 text-gray-600"}
        />
      ))}
    </div>
  )
}

// Google reviews, newest first. Hidden until there's one to show. It never
// claims to be every review: the link goes to all of them on Google.
export default function Reviews({ feed }: { feed: ReviewFeed }) {
  const reviews = feed.reviews.slice(0, 6)
  if (reviews.length === 0) return null

  const { count, average } = feed.summary
  const grid =
    reviews.length === 1
      ? "max-w-xl mx-auto"
      : reviews.length === 2
        ? "grid gap-4 lg:gap-5 md:grid-cols-2 max-w-4xl mx-auto"
        : "grid gap-4 lg:gap-5 md:grid-cols-2 lg:grid-cols-3"

  return (
    <section id="reviews" className="py-20 lg:py-28 px-6">
      <div className="container mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Straight From <span className="text-gradient-purple">Our Clients</span>
            </h2>
            {count >= BADGE_MIN_REVIEWS && average !== null ? (
              <p className="inline-flex items-center gap-2 text-gray-300 text-sm">
                <Star aria-hidden="true" className="w-4 h-4 text-amber-400 fill-amber-400" />
                {average.toFixed(1)} on Google · {count} reviews
              </p>
            ) : (
              <p className="text-gray-400 text-sm">From our Google reviews</p>
            )}
          </div>
        </ScrollReveal>

        <div className={grid}>
          {reviews.map((r, index) => (
            <ScrollReveal key={r.id} delay={0.1 * index}>
              <figure className="glass-card-subtle h-full p-6 flex flex-col gap-4">
                <Stars rating={r.rating} />
                <blockquote className="text-gray-200 text-sm leading-relaxed line-clamp-6 flex-1">
                  &ldquo;{r.review}&rdquo;
                </blockquote>
                <figcaption className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-medium text-white">{r.name}</span>
                  <span className="text-gray-500">Google · {MONTH.format(new Date(r.reviewedAt))}</span>
                </figcaption>
              </figure>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.2}>
          <div className="text-center mt-10">
            <a
              href={GOOGLE_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium"
            >
              See all our reviews on Google
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

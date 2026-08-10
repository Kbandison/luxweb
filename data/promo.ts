/**
 * Single source of truth for site-wide promotional pricing.
 *
 * Every surface that shows a price — the announcement bar, the homepage pricing
 * card, the pricing page, page metadata, and the AI chat assistant — reads from
 * `getActivePromo()`. When `endsAt` passes, the promo goes inactive on its own
 * and the whole site reverts to regular pricing. Nothing needs to be edited to
 * end the sale.
 *
 * To end it early, set `promo` to null. To run a new one, update the fields and
 * give it a fresh `id`.
 */

export interface Promo {
  /** Stable identifier for this offer. Change it when starting a new promo. */
  id: string
  /** Short name for the offer, used on badges. */
  name: string
  /** The regular (non-sale) price. Must be a genuine former price. */
  regularPrice: number
  /** The promotional price. */
  salePrice: number
  /**
   * Optional qualifier shown before the sale price, e.g. "Starting at".
   * The regular price is always shown plain — scope-dependent pricing is
   * disclosed on the promo side only.
   */
  salePriceQualifier?: string
  /**
   * ISO 8601 with an explicit UTC offset. The offer is over at this instant.
   * Uses Eastern Time to match the business's timezone.
   */
  endsAt: string
}

export const promo: Promo | null = {
  id: 'launch-2026-09',
  name: 'Limited-Time Launch Offer',
  regularPrice: 4500,
  salePrice: 3000,
  salePriceQualifier: 'Starting at',
  endsAt: '2026-09-10T23:59:59-04:00',
}

/** Height of the announcement bar. Kept in sync with the `--promo-offset` CSS variable set in the root layout. */
export const PROMO_BAR_HEIGHT = '2.25rem'

const usd = (amount: number) =>
  amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })

/**
 * Formats the deadline with an explicit timeZone so the server and the client
 * always produce the same string — without it, a visitor in another timezone
 * would hydrate a different date than the server rendered.
 */
const formatEndsAt = (iso: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    timeZone: 'America/New_York',
  }).format(new Date(iso))

export interface ActivePromo extends Promo {
  /** Deadline as epoch milliseconds, for the countdown timer. */
  endsAtMs: number
  regularPriceLabel: string
  salePriceLabel: string
  /** How much the customer saves, e.g. "$1,500". */
  savingsLabel: string
  /** Sale price with its qualifier applied, e.g. "Starting at $3,000". */
  salePriceWithQualifier: string
  /** Human-readable deadline, e.g. "September 10". */
  endsAtLabel: string
}

/**
 * Returns the promo only while it is still running, otherwise null.
 * Callers should treat null as "show regular pricing".
 */
export function getActivePromo(now: number = Date.now()): ActivePromo | null {
  if (!promo) return null

  const endsAtMs = new Date(promo.endsAt).getTime()
  if (Number.isNaN(endsAtMs) || now >= endsAtMs) return null

  const salePriceLabel = usd(promo.salePrice)

  return {
    ...promo,
    endsAtMs,
    regularPriceLabel: usd(promo.regularPrice),
    salePriceLabel,
    savingsLabel: usd(promo.regularPrice - promo.salePrice),
    salePriceWithQualifier: promo.salePriceQualifier
      ? `${promo.salePriceQualifier} ${salePriceLabel}`
      : salePriceLabel,
    endsAtLabel: formatEndsAt(promo.endsAt),
  }
}

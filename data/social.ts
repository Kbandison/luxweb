/**
 * LuxWeb Studio's social profiles — single source of truth.
 *
 * Used by the footer and contact page icons and by the schema.org `sameAs`
 * list, so a handle change only happens here. Only accounts that are actually
 * posted to belong here; an empty profile linked from the site looks worse
 * than no link at all.
 */

export type SocialNetwork = 'facebook' | 'instagram' | 'x' | 'linkedin'

export type SocialProfile = {
  network: SocialNetwork
  /** Shown to screen readers as "LuxWeb Studio on <name>". */
  name: string
  href: string
}

export const socialProfiles: SocialProfile[] = [
  { network: 'facebook', name: 'Facebook', href: 'https://www.facebook.com/377381926401081' },
  { network: 'instagram', name: 'Instagram', href: 'https://www.instagram.com/luxwebstudio1/' },
  { network: 'x', name: 'X', href: 'https://x.com/LuxWebStudio1' },
  { network: 'linkedin', name: 'LinkedIn', href: 'https://www.linkedin.com/company/luxwebstudio1/' },
]

/** The X handle, for Twitter card metadata. */
export const xHandle = '@LuxWebStudio1'

/**
 * Business contact details — single source of truth.
 *
 * The phone number previously lived as a literal in five separate files, which
 * is how it drifts. Import from here instead of typing it out.
 */

export const businessPhone = {
  /** E.164 form, for tel: links. */
  e164: '+17186350159',
  /** How the number is displayed to visitors. */
  display: '(718) 635-0159',
  /** Hyphenated international form, for schema.org structured data. */
  schema: '+1-718-635-0159',
}

/** Ready-to-use href for click-to-call links. */
export const telHref = `tel:${businessPhone.e164}`

export const businessEmail = 'support@luxwebstudio.dev'
export const mailtoHref = `mailto:${businessEmail}`

/**
 * Express written consent language for the contact form.
 *
 * This wording is rendered verbatim next to the consent checkbox AND stored
 * with the submission, so there is never a question about what a given lead
 * actually agreed to. If you change the wording, bump CONSENT_VERSION — older
 * submissions keep the version they were captured under.
 *
 * Consent is deliberately OPTIONAL. Under the TCPA, consent to receive
 * autodialed/prerecorded marketing calls cannot be made a condition of
 * purchasing goods or services, so the form still submits without it.
 */

export const CONSENT_VERSION = '2026-08-11'

export const CONSENT_TEXT =
  'By checking this box, I give LuxWeb Studio LLC my express written consent to ' +
  'contact me at the phone number and email address I provided — including by ' +
  'automatic telephone dialing systems, prerecorded or artificial voice messages, ' +
  'AI-generated voice and text messages, SMS, and email — regarding my inquiry, ' +
  'quotes, and related services. Consent is not a condition of purchase. Message ' +
  'and data rates may apply. Message frequency varies. Reply STOP to opt out of ' +
  'text messages at any time, or HELP for help.'

export interface ConsentRecord {
  /** Whether the visitor affirmatively checked the box. */
  granted: boolean
  /** Wording version they were shown. */
  version: string
  /** The exact text displayed at the time of capture. */
  text: string
  /** Server-side capture time (ISO 8601). Never trust a client clock for this. */
  capturedAt: string
  /** Evidence of who gave consent, for a TCPA dispute. */
  ipAddress: string | null
  userAgent: string | null
}

/**
 * Builds the record stored alongside the submission. Text and version are taken
 * from this module rather than the request body so a crafted payload can't
 * rewrite the history of what was agreed to.
 */
export function buildConsentRecord(
  granted: boolean,
  ipAddress: string | null,
  userAgent: string | null
): ConsentRecord {
  return {
    granted,
    version: CONSENT_VERSION,
    text: CONSENT_TEXT,
    capturedAt: new Date().toISOString(),
    ipAddress,
    userAgent,
  }
}

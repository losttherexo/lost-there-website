// ---------------------------------------------------------------------------
// Pre-launch "coming soon" gate.
//
// THE TOGGLE: by default the splash shows in production and is OFF during local
// `npm run dev` (so we can build the real site). Override anytime without a code
// change via a Vercel env var:  VITE_COMING_SOON = "true" | "false".
// To launch for good: set VITE_COMING_SOON="false" (and remove the noindex meta
// in index.html).
//
// PREVIEW BYPASS: visit the live site with ?preview=1 to see the full site behind
// the splash on this browser (persists via localStorage). ?preview=0 re-locks it.
// ---------------------------------------------------------------------------

const FLAG = import.meta.env.VITE_COMING_SOON
const GATED =
  FLAG === 'true' ? true : FLAG === 'false' ? false : import.meta.env.PROD

const PREVIEW_KEY = 'lt-preview'

function previewUnlocked() {
  if (typeof window === 'undefined') return false
  const params = new URLSearchParams(window.location.search)
  if (params.has('preview')) {
    const on = params.get('preview') !== '0'
    try {
      on ? localStorage.setItem(PREVIEW_KEY, '1') : localStorage.removeItem(PREVIEW_KEY)
    } catch { /* localStorage unavailable — ignore */ }
    return on
  }
  try {
    return localStorage.getItem(PREVIEW_KEY) === '1'
  } catch {
    return false
  }
}

export const SHOW_SPLASH = GATED && !previewUnlocked()

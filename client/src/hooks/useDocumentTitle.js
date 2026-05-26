import { useEffect } from 'react'

const BASE = 'lost,there'
const DEFAULT_DESCRIPTION =
  'lost,there — producer-artist. Music, shows, creative-tech lab, press kit.'

// Sets the per-route document <title> and <meta name="description">.
// - title: page title (omit for the bare brand name)
// - description: optional; falls back to the site default, and is restored to
//   the default on unmount so stale per-page copy never lingers.
export default function useDocumentTitle(title, description) {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE}` : BASE

    const tag = document.querySelector('meta[name="description"]')
    if (tag) tag.setAttribute('content', description ?? DEFAULT_DESCRIPTION)

    return () => {
      if (tag) tag.setAttribute('content', DEFAULT_DESCRIPTION)
    }
  }, [title, description])
}

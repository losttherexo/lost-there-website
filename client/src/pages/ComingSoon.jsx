import { useEffect } from 'react'

// Pre-launch splash. Standalone (no nav/footer) — rendered by App when the
// coming-soon gate is active. Uses the Phase 2 design tokens; intentionally
// minimal. TODO: drop real social links + a launch month when known.
export default function ComingSoon() {
  useEffect(() => {
    document.title = 'lost,there — coming soon'
  }, [])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-canvas text-ink">
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight">lost,there</h1>

      <div className="mt-6 h-px w-16 bg-accent" aria-hidden="true" />

      <p className="mt-6 text-sm md:text-base text-muted uppercase tracking-[0.35em]">
        Coming soon
      </p>
      <p className="mt-4 max-w-sm text-sm text-faint">
        New site in the works — music, shows, and the lab. Back shortly.
      </p>
    </main>
  )
}

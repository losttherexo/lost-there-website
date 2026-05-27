import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Atlas from './scene/Atlas'
import SectionMenu from './SectionMenu'

const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/lostthere.xo' },
  { label: 'Spotify', href: 'https://open.spotify.com/artist/27dTdSe8fBtCAle3kuMaOB' },
  { label: 'X', href: 'https://x.com/losttherexo' },
]

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()

  const isHome = location.pathname === '/'
  const activeTo = isHome ? null : location.pathname // drives the camera (null = overview)

  return (
    <>
      {/* Persistent 3D backdrop (fixed, behind everything). */}
      <div className="fixed inset-0 z-0">
        <Atlas activeTo={activeTo} onNavigate={navigate} />
      </div>

      {/* Section pages: scrim for legibility + the slide-in menu. The map/home has
          neither — you navigate it by its pins. */}
      {!isHome && (
        <>
          <div aria-hidden="true" className="fixed inset-0 z-[5] bg-canvas/60 pointer-events-none" />
          <SectionMenu />
        </>
      )}

      {/* UI layer. Click-through by default so overview pins (in the canvas below)
          stay clickable; real content re-enables pointer events. */}
      <div className="relative z-10 flex min-h-[100dvh] flex-col pointer-events-none">
        <a
          href="#main"
          className="pointer-events-auto sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-ink focus:text-canvas focus:px-3 focus:py-2 focus:rounded"
        >
          Skip to content
        </a>

        <main id="main" className="flex-1">
          {!isHome && (
            <div key={location.pathname} className="pointer-events-auto pt-16" style={{ animation: 'fadeIn 600ms ease-out both' }}>
              <Outlet />
            </div>
          )}
        </main>

        {!isHome && (
          <footer className="pointer-events-auto mt-16 border-t border-line/60 backdrop-blur-sm">
            <div className="shell flex flex-col items-start justify-between gap-4 py-8 text-sm text-faint sm:flex-row sm:items-center">
              <p>&copy; {new Date().getFullYear()} lost,there</p>
              <ul className="flex gap-5">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`lost,there on ${s.label} (opens in a new tab)`}
                      className="transition-colors hover:text-ink"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </footer>
        )}
      </div>
    </>
  )
}

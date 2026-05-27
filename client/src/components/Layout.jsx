import { useState, useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Atlas from './scene/Atlas'

const NAV_ITEMS = [
  { to: '/', label: 'home', end: true },
  { to: '/music', label: 'music' },
  { to: '/shows', label: 'shows' },
  { to: '/lab', label: 'lab' },
  { to: '/about', label: 'about' },
  { to: '/contact', label: 'contact' },
]

const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/lostthere.xo' },
  { label: 'Spotify', href: 'https://open.spotify.com/artist/27dTdSe8fBtCAle3kuMaOB' },
  { label: 'X', href: 'https://x.com/losttherexo' },
]

const deskBase = 'px-3 py-2 text-sm uppercase tracking-wider border-b-2 transition-colors'
const deskCls = ({ isActive }) =>
  `${deskBase} ${isActive ? 'text-ink border-accent font-medium' : 'text-muted border-transparent hover:text-ink'}`

const mobileBase = 'block px-4 py-3 text-sm uppercase tracking-wider border-l-2 transition-colors'
const mobileCls = ({ isActive }) =>
  `${mobileBase} ${isActive ? 'text-ink border-accent font-medium bg-surface' : 'text-muted border-transparent hover:text-ink hover:bg-surface'}`

export default function Layout() {
  const [navOpen, setNavOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isHome = location.pathname === '/'
  const activeTo = isHome ? null : location.pathname // drives the camera (null = overview)

  useEffect(() => {
    setNavOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!navOpen) return
    const onKey = (e) => e.key === 'Escape' && setNavOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navOpen])

  return (
    <>
      {/* Persistent 3D backdrop (fixed, behind everything). */}
      <div className="fixed inset-0 z-0">
        <Atlas activeTo={activeTo} onNavigate={navigate} />
      </div>

      {/* Section scrim — darkens the map for legibility when reading a section. */}
      {!isHome && (
        <div aria-hidden="true" className="fixed inset-0 z-[5] bg-canvas/60 pointer-events-none" />
      )}

      {/* UI layer. Click-through by default so the overview's marker buttons (which
          live in the canvas below) stay clickable; real UI re-enables pointer events. */}
      <div className="relative z-10 flex min-h-[100dvh] flex-col pointer-events-none">
        <a
          href="#main"
          className="pointer-events-auto sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-ink focus:text-canvas focus:px-3 focus:py-2 focus:rounded"
        >
          Skip to content
        </a>

        <header className="pointer-events-auto border-b border-line/60 backdrop-blur-sm">
          <nav aria-label="Primary" className="shell h-16 flex items-center justify-between">
            <NavLink to="/" end className="text-xl font-semibold tracking-tight text-ink">
              lost,there
            </NavLink>

            <ul className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.filter((item) => item.to !== '/').map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.end} className={deskCls}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <button
              type="button"
              aria-label={navOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={navOpen}
              aria-controls="mobile-nav"
              onClick={() => setNavOpen((o) => !o)}
              className="md:hidden p-2 -mr-2 rounded text-ink"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                {navOpen ? (
                  <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </nav>

          {navOpen && (
            <div id="mobile-nav" className="md:hidden border-t border-line">
              <ul className="flex flex-col py-2">
                {NAV_ITEMS.map((item) => (
                  <li key={item.to}>
                    <NavLink to={item.to} end={item.end} className={mobileCls}>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </header>

        {/* On the overview (home) main is empty + click-through so the map shows and
            its pins are clickable. Section content re-enables pointer events + fades in. */}
        <main id="main" className="flex-1">
          {!isHome && (
            <div key={location.pathname} className="pointer-events-auto" style={{ animation: 'fadeIn 600ms ease-out both' }}>
              <Outlet />
            </div>
          )}
        </main>

        {!isHome && (
          <footer className="pointer-events-auto border-t border-line/60 mt-16 backdrop-blur-sm">
            <div className="shell py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-faint">
              <p>&copy; {new Date().getFullYear()} lost,there</p>
              <ul className="flex gap-5">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`lost,there on ${s.label} (opens in a new tab)`}
                      className="hover:text-ink transition-colors"
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

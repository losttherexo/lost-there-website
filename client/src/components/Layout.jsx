import { useState, useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'home', end: true },
  { to: '/music', label: 'music' },
  { to: '/shows', label: 'shows' },
  { to: '/lab', label: 'lab' },
  { to: '/about', label: 'about' },
  { to: '/contact', label: 'contact' },
]

const linkBase =
  'px-3 py-2 text-sm uppercase tracking-wider transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2'
const linkInactive = 'text-neutral-600 hover:text-neutral-900'
const linkActive = 'text-neutral-900 font-semibold'

export default function Layout() {
  const [navOpen, setNavOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setNavOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-neutral-900 focus:text-white focus:px-3 focus:py-2 focus:rounded"
      >
        Skip to content
      </a>

      <header className="border-b border-neutral-200">
        <nav
          aria-label="Primary"
          className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between"
        >
          <NavLink to="/" end className="text-xl font-semibold tracking-tight">
            lost,there
          </NavLink>

          <ul className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.filter((item) => item.to !== '/').map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : linkInactive}`
                  }
                >
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
            className="md:hidden p-2 -mr-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 rounded"
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
          <div id="mobile-nav" className="md:hidden border-t border-neutral-200">
            <ul className="flex flex-col p-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `block ${linkBase} ${isActive ? linkActive : linkInactive}`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      <main id="main" className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-neutral-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-neutral-600">
          <p>&copy; {new Date().getFullYear()} lost,there</p>
          <ul className="flex gap-4">
            <li><span aria-label="Social link placeholder">[INSTAGRAM]</span></li>
            <li><span aria-label="Social link placeholder">[SPOTIFY]</span></li>
            <li><span aria-label="Social link placeholder">[BANDCAMP]</span></li>
          </ul>
        </div>
      </footer>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'

const ITEMS = [
  { to: '/', label: 'home', end: true },
  { to: '/music', label: 'music' },
  { to: '/shows', label: 'shows' },
  { to: '/lab', label: 'lab' },
  { to: '/about', label: 'about' },
  { to: '/logs', label: 'logs' },
]

const linkCls = ({ isActive }) =>
  `block border-l-2 px-3 py-3 text-sm uppercase tracking-[0.2em] transition-colors ${
    isActive ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink'
  }`

// Floating menu for section pages: an icon that slides in a drawer to jump to
// another section or back to the map. (The map/home navigates via its pins.)
export default function SectionMenu() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => setOpen(false), [location.pathname]) // close on navigate

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="section-menu"
        onClick={() => setOpen(true)}
        className="pointer-events-auto fixed right-4 top-4 z-40 rounded border border-line/70 bg-canvas/60 p-2.5 text-ink backdrop-blur-sm transition-colors hover:border-accent"
      >
        <FiMenu size={20} aria-hidden="true" />
      </button>

      {/* backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-canvas/40 transition-opacity duration-300 ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* slide-in drawer */}
      <nav
        id="section-menu"
        aria-label="Sections"
        className={`pointer-events-auto fixed right-0 top-0 z-50 h-full w-64 max-w-[80vw] border-l border-line bg-canvas/95 backdrop-blur-md transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <NavLink to="/" end className="text-lg font-semibold tracking-tight text-ink">
            lost,there
          </NavLink>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="p-1 text-muted hover:text-ink"
          >
            <FiX size={20} aria-hidden="true" />
          </button>
        </div>
        <ul className="flex flex-col p-3">
          {ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} end={item.end} className={linkCls}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}

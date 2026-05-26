import { useEffect, useState } from 'react'
import useDocumentTitle from '../hooks/useDocumentTitle'
import ReleaseCard from '../components/ReleaseCard'
import { releases } from '../data/releases'

export default function Music() {
  useDocumentTitle('Music')

  // Single source of truth: id of the open card (null = all closed). Opening one
  // implicitly closes any other, so only one player is ever live at a time.
  const [openId, setOpenId] = useState(null)

  // Close the open player on: a click anywhere outside a card, Escape (keyboard),
  // or the tab being hidden (switch away / minimize). visibilitychange — not blur —
  // so clicking into the cross-origin Spotify iframe never closes it.
  useEffect(() => {
    const onPointerDown = (e) => {
      if (e.target instanceof Element && !e.target.closest('[data-release-card]')) {
        setOpenId(null)
      }
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpenId(null)
    }
    const onVisibility = () => {
      if (document.hidden) setOpenId(null)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <section aria-labelledby="releases-heading" className="shell py-12 md:py-16">
      <h1 id="releases-heading" className="text-2xl font-semibold md:text-3xl">
        Releases
      </h1>
      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {releases.map((r) => (
          <li key={r.id}>
            <ReleaseCard
              release={r}
              isOpen={openId === r.id}
              onOpen={() => setOpenId(r.id)}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}

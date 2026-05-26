import useDocumentTitle from '../hooks/useDocumentTitle'
import Atlas from '../components/scene/Atlas'

export default function Home() {
  useDocumentTitle()

  return (
    <section aria-label="lost,there — interactive map" className="relative h-[calc(100vh-4rem)] w-full overflow-hidden">
      {/* The 3D holographic map fills the section; drag to explore. */}
      <Atlas />

      {/* Wordmark overlay. pointer-events-none so drags pass through to the map.
          The radial vignette keeps it legible over the terrain lines. */}
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-[12vh]">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_bottom,var(--color-canvas)_20%,transparent_75%)]" />
        <h1 className="relative text-5xl font-bold tracking-tight md:text-7xl">lost,there</h1>
      </div>
    </section>
  )
}

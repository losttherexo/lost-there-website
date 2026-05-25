import useDocumentTitle from '../hooks/useDocumentTitle'
import ReleaseCard from '../components/ReleaseCard'
import Embed from '../components/Embed'
import { releases } from '../data/releases'

// Standalone "find me on" players — placeholder URLs render labeled boxes.
const PLATFORMS = [
  { provider: 'spotify', url: '' },
  { provider: 'soundcloud', url: '' },
  { provider: 'untitled', url: '' },
]

export default function Music() {
  useDocumentTitle('Music')

  return (
    <>
      <section className="shell py-12 md:py-16">
        <h1 className="text-4xl font-bold md:text-5xl">Music</h1>
        <p className="mt-3 max-w-xl text-muted">
          [Releases, singles, and works in progress. Expand any release for the player and full
          track listing.]
        </p>
      </section>

      {/* Releases grid */}
      <section aria-labelledby="releases-heading" className="shell border-t border-line py-12">
        <h2 id="releases-heading" className="mb-6 text-2xl font-semibold md:text-3xl">
          Releases
        </h2>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {releases.map((r) => (
            <li key={r.id}>
              <ReleaseCard release={r} />
            </li>
          ))}
        </ul>
      </section>

      {/* Listen everywhere */}
      <section aria-labelledby="listen-heading" className="shell border-t border-line py-12">
        <h2 id="listen-heading" className="mb-6 text-2xl font-semibold md:text-3xl">
          Listen everywhere
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {PLATFORMS.map((p) => (
            <Embed key={p.provider} provider={p.provider} url={p.url} />
          ))}
        </div>
      </section>
    </>
  )
}

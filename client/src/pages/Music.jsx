import useDocumentTitle from '../hooks/useDocumentTitle'
import Placeholder from '../components/Placeholder'

const RELEASES = [1, 2, 3, 4, 5, 6]
const TRACKS = [1, 2, 3, 4, 5, 6, 7]

export default function Music() {
  useDocumentTitle('Music')
  return (
    <>
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Music</h1>
        <p className="mt-2 text-neutral-400">Releases, embeds, and tracks.</p>
      </section>

      <section aria-labelledby="releases-heading" className="max-w-6xl mx-auto px-4 py-12 border-t border-neutral-800">
        <h2 id="releases-heading" className="text-2xl md:text-3xl font-semibold mb-6">Releases</h2>
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {RELEASES.map((n) => (
            <li key={n}>
              <article className="border border-neutral-800 p-3">
                <Placeholder label="[COVER]" minHeight="180px" />
                <p className="mt-3 text-sm font-medium">[RELEASE TITLE]</p>
                <p className="text-xs text-neutral-500">[YEAR]</p>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="streaming-heading" className="max-w-6xl mx-auto px-4 py-12 border-t border-neutral-800">
        <h2 id="streaming-heading" className="text-2xl md:text-3xl font-semibold mb-6">Streaming Embeds</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Placeholder label="[SPOTIFY EMBED]" minHeight="180px" />
          <Placeholder label="[SOUNDCLOUD EMBED]" minHeight="180px" />
          <Placeholder label="[UNTITLED.STREAM EMBED]" minHeight="180px" />
        </div>
      </section>

      <section aria-labelledby="tracks-heading" className="max-w-6xl mx-auto px-4 py-12 border-t border-neutral-800">
        <h2 id="tracks-heading" className="text-2xl md:text-3xl font-semibold mb-6">Track Listing</h2>
        <ol className="border-y border-neutral-800 divide-y divide-neutral-800">
          {TRACKS.map((n) => (
            <li key={n} className="flex items-center justify-between py-3 px-4">
              <span className="flex items-center gap-4">
                <span className="text-neutral-500 tabular-nums w-6">{String(n).padStart(2, '0')}</span>
                <span>[TRACK TITLE]</span>
              </span>
              <span className="text-neutral-500 text-sm tabular-nums">[--:--]</span>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}

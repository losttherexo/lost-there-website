import useDocumentTitle from '../hooks/useDocumentTitle'
import Placeholder from '../components/Placeholder'

const STATS = [
  { value: '[MONTHLY LISTENERS]', label: 'Spotify' },
  { value: '[FOLLOWERS]', label: 'Instagram' },
  { value: '[STREAMS]', label: 'Total streams' },
  { value: '[SHOWS PLAYED]', label: 'Shows to date' },
]

const DOWNLOADS = [
  'Press photos (.zip)',
  'Bio (.pdf)',
  'Logo files (.zip)',
  'Tech rider (.pdf)',
]

export default function About() {
  useDocumentTitle('About', 'About lost,there — bio, stats, and press kit.')
  return (
    <>
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">About</h1>
        <p className="mt-2 text-neutral-400">For fans, press, and bookers.</p>
      </section>

      <section aria-labelledby="bio-heading" className="max-w-6xl mx-auto px-4 py-12 border-t border-neutral-800">
        <h2 id="bio-heading" className="text-2xl md:text-3xl font-semibold mb-6">Bio</h2>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 items-start">
          <Placeholder label="[ARTIST PHOTO]" minHeight="320px" />
          <Placeholder label="[BIO COPY]" minHeight="320px">
            Long-form narrative bio. Fan-facing tone. Multiple paragraphs.
          </Placeholder>
        </div>
      </section>

      <section aria-labelledby="presskit-heading" className="max-w-6xl mx-auto px-4 py-12 border-t border-neutral-800">
        <header className="mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Press Kit / EPK</p>
          <h2 id="presskit-heading" className="text-2xl md:text-3xl font-semibold mt-2">For press &amp; bookers</h2>
        </header>

        <h3 className="text-lg font-semibold mt-6 mb-3">Quotes</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((n) => (
            <li key={n}>
              <Placeholder label="[PRESS QUOTE]" minHeight="120px">
                &ldquo;Placeholder quote text.&rdquo; — [Outlet, YYYY]
              </Placeholder>
            </li>
          ))}
        </ul>

        <h3 className="text-lg font-semibold mt-10 mb-3">Stats</h3>
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="border border-neutral-800 p-4">
              <dt className="text-xs uppercase tracking-wider text-neutral-500">{s.label}</dt>
              <dd className="text-lg font-semibold mt-1">{s.value}</dd>
            </div>
          ))}
        </dl>

        <h3 className="text-lg font-semibold mt-10 mb-3">Downloads</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DOWNLOADS.map((label) => (
            <li key={label}>
              <button
                type="button"
                disabled
                className="w-full flex items-center justify-between border border-neutral-800 p-4 text-left cursor-not-allowed"
              >
                <span>{label}</span>
                <span className="text-xs uppercase tracking-wider text-neutral-500">[DOWNLOAD]</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

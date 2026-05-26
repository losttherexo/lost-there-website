import { Link } from 'react-router-dom'
import useDocumentTitle from '../hooks/useDocumentTitle'
import Placeholder from '../components/Placeholder'

const UPCOMING = [
  { date: '[DATE]', venue: '[VENUE]', city: '[CITY]' },
  { date: '[DATE]', venue: '[VENUE]', city: '[CITY]' },
  { date: '[DATE]', venue: '[VENUE]', city: '[CITY]' },
  { date: '[DATE]', venue: '[VENUE]', city: '[CITY]' },
]

const ctaCls =
  'inline-block px-6 py-3 border border-neutral-100 text-neutral-100 hover:bg-neutral-100 hover:text-neutral-950 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950'

export default function Shows() {
  useDocumentTitle('Shows', 'Upcoming lost,there live dates and where to catch the project live.')
  return (
    <>
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Shows</h1>
        <p className="mt-2 text-neutral-400">Live performances, reels, and booking.</p>
      </section>

      <section aria-labelledby="upcoming-heading" className="max-w-6xl mx-auto px-4 py-12 border-t border-neutral-800">
        <h2 id="upcoming-heading" className="text-2xl md:text-3xl font-semibold mb-6">Upcoming</h2>
        <ul className="border-y border-neutral-800 divide-y divide-neutral-800">
          {UPCOMING.map((show, i) => (
            <li
              key={i}
              className="grid grid-cols-1 sm:grid-cols-[160px_1fr_auto] gap-2 sm:gap-6 py-4 px-4 items-baseline"
            >
              <span className="font-mono text-sm text-neutral-300">{show.date}</span>
              <span>
                <span className="font-medium">{show.venue}</span>
                <span className="text-neutral-500"> · {show.city}</span>
              </span>
              <button
                type="button"
                disabled
                className="justify-self-start sm:justify-self-end border border-neutral-700 px-3 py-1.5 text-sm text-neutral-400 cursor-not-allowed"
              >
                [TICKET LINK]
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="reel-heading" className="max-w-6xl mx-auto px-4 py-12 border-t border-neutral-800">
        <h2 id="reel-heading" className="text-2xl md:text-3xl font-semibold mb-6">Show Reel</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Placeholder label="[LIVE VIDEO EMBED]" minHeight="240px" />
          <Placeholder label="[LIVE VIDEO EMBED]" minHeight="240px" />
          <Placeholder label="[LIVE VIDEO EMBED]" minHeight="240px" />
          <Placeholder label="[LIVE VIDEO EMBED]" minHeight="240px" />
        </div>
      </section>

      <section aria-labelledby="book-heading" className="max-w-6xl mx-auto px-4 py-12 border-t border-neutral-800">
        <h2 id="book-heading" className="text-2xl md:text-3xl font-semibold mb-4">Book a show</h2>
        <p className="text-neutral-400 mb-6">[BOOKING COPY]</p>
        <Link to="/contact" className={ctaCls}>Get in touch</Link>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12 border-t border-neutral-800">
        <div className="border border-neutral-800 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">From the Lab</p>
          <h2 className="text-xl font-semibold mt-2">The tech behind the show</h2>
          <p className="text-neutral-400 mt-2">[SHORT TEASER COPY — TouchDesigner, Unreal previz, generative visuals]</p>
          <Link
            to="/lab"
            className="mt-4 inline-block underline underline-offset-4 text-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
          >
            Explore the lab →
          </Link>
        </div>
      </section>
    </>
  )
}

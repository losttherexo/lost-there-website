import { Link } from 'react-router-dom'
import useDocumentTitle from '../hooks/useDocumentTitle'
import Placeholder from '../components/Placeholder'

const TEASERS = [
  { to: '/music', label: 'Music' },
  { to: '/shows', label: 'Shows' },
  { to: '/lab', label: 'Lab' },
  { to: '/about', label: 'About' },
]

const ctaCls =
  'inline-block px-6 py-3 border border-neutral-100 text-neutral-100 hover:bg-neutral-100 hover:text-neutral-950 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950'

export default function Home() {
  useDocumentTitle()
  return (
    <>
      <section aria-labelledby="hero-heading" className="max-w-6xl mx-auto px-4 py-16 md:py-28">
        <h1 id="hero-heading" className="text-5xl md:text-7xl font-bold tracking-tight">lost,there</h1>
        <p className="mt-4 text-xl text-neutral-400">[TAGLINE PLACEHOLDER]</p>
        <div className="mt-8">
          <Link to="/music" className={ctaCls}>Listen now</Link>
        </div>
      </section>

      <section aria-labelledby="featured-heading" className="max-w-6xl mx-auto px-4 py-12 border-t border-neutral-800">
        <h2 id="featured-heading" className="text-2xl md:text-3xl font-semibold mb-6">Latest Release</h2>
        <Placeholder label="[RELEASE EMBED]" minHeight="280px">
          Spotify / Apple Music / Bandcamp embed for the most recent release.
        </Placeholder>
      </section>

      <section aria-labelledby="explore-heading" className="max-w-6xl mx-auto px-4 py-12 border-t border-neutral-800">
        <h2 id="explore-heading" className="text-2xl md:text-3xl font-semibold mb-6">Explore</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TEASERS.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="block border border-neutral-800 p-6 hover:bg-neutral-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
              >
                <p className="text-lg font-medium">{item.label}</p>
                <p className="mt-2 text-sm text-neutral-500">[TEASER COPY]</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

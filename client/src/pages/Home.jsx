import { Link } from 'react-router-dom'
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi'
import useDocumentTitle from '../hooks/useDocumentTitle'
import Embed from '../components/Embed'
import { featuredRelease } from '../data/releases'

const TEASERS = [
  { to: '/music', label: 'Music', copy: '[Releases, embeds, and the back catalog.]' },
  { to: '/shows', label: 'Shows', copy: '[Upcoming dates and where to catch me live.]' },
  { to: '/lab', label: 'Lab', copy: '[Visual + creative-tech experiments.]' },
  { to: '/about', label: 'About', copy: '[Bio, press kit, and the story so far.]' },
]

const btn = 'inline-flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors'
const btnPrimary = `${btn} bg-accent text-accent-contrast hover:opacity-90`
const btnGhost = `${btn} border border-line text-ink hover:bg-surface`

export default function Home() {
  useDocumentTitle()

  return (
    <>
      {/* Hero */}
      <section aria-labelledby="hero-heading" className="shell py-20 md:py-32">
        <p className="text-sm uppercase tracking-[0.3em] text-muted">[ARTIST NAME]</p>
        <h1 id="hero-heading" className="mt-4 text-5xl md:text-7xl font-bold">
          lost,there
        </h1>
        <p className="mt-6 max-w-xl text-lg md:text-xl text-muted">
          [TAGLINE — one line on who you are and what this sounds like.]
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/music" className={btnPrimary}>
            Listen <FiArrowRight aria-hidden="true" />
          </Link>
          <Link to="/shows" className={btnGhost}>
            Live shows
          </Link>
        </div>
      </section>

      {/* Featured release */}
      <section aria-labelledby="featured-heading" className="shell border-t border-line py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 id="featured-heading" className="text-2xl font-semibold md:text-3xl">
            Latest release
          </h2>
          <Link
            to="/music"
            className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink transition-colors"
          >
            All music <FiArrowUpRight aria-hidden="true" />
          </Link>
        </div>
        <div className="grid items-start gap-6 md:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="text-lg font-medium">{featuredRelease.title}</p>
            <p className="text-sm text-muted">
              {featuredRelease.year}
              {featuredRelease.type ? ` · ${featuredRelease.type}` : ''}
            </p>
            <p className="mt-3 max-w-sm text-sm text-faint">{featuredRelease.blurb}</p>
          </div>
          <Embed
            provider={featuredRelease.embed.provider}
            url={featuredRelease.embed.url}
            title={`${featuredRelease.title} — featured player`}
          />
        </div>
      </section>

      {/* Explore teasers */}
      <section aria-labelledby="explore-heading" className="shell border-t border-line py-12">
        <h2 id="explore-heading" className="mb-6 text-2xl font-semibold md:text-3xl">
          Explore
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEASERS.map((t) => (
            <li key={t.to}>
              <Link
                to={t.to}
                className="group flex h-full flex-col justify-between border border-line p-5 transition-colors hover:bg-surface"
              >
                <span className="flex items-center justify-between">
                  <span className="text-lg font-medium">{t.label}</span>
                  <FiArrowUpRight
                    aria-hidden="true"
                    className="text-muted transition-colors group-hover:text-ink"
                  />
                </span>
                <span className="mt-10 text-sm text-faint">{t.copy}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

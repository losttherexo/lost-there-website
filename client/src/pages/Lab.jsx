import { Link } from 'react-router-dom'
import useDocumentTitle from '../hooks/useDocumentTitle'
import Placeholder from '../components/Placeholder'

const PROJECTS = [1, 2, 3, 4, 5, 6]

const ctaCls =
  'inline-block px-6 py-3 border border-neutral-100 text-neutral-100 hover:bg-neutral-100 hover:text-neutral-950 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950'

export default function Lab() {
  useDocumentTitle('Lab', 'Visual and creative-technology experiments from lost,there.')
  return (
    <>
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Lab</h1>
        <p className="mt-2 text-neutral-400">Creative technology, show automation, and custom tooling.</p>
      </section>

      <section aria-labelledby="capabilities-heading" className="max-w-6xl mx-auto px-4 py-12 border-t border-neutral-800">
        <h2 id="capabilities-heading" className="text-2xl md:text-3xl font-semibold mb-6">What I build</h2>
        <Placeholder label="[CAPABILITIES STATEMENT]" minHeight="160px">
          Short paragraph: TouchDesigner show automation, Unreal Engine previz, generative visuals, custom tooling.
        </Placeholder>
      </section>

      <section aria-labelledby="projects-heading" className="max-w-6xl mx-auto px-4 py-12 border-t border-neutral-800">
        <h2 id="projects-heading" className="text-2xl md:text-3xl font-semibold mb-6">Project Showcase</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROJECTS.map((n) => (
            <li key={n}>
              <article className="border border-neutral-800 p-3 flex flex-col gap-3 h-full">
                <Placeholder label="[PROJECT THUMBNAIL / VIDEO]" minHeight="160px" />
                <div className="p-1">
                  <h3 className="text-lg font-medium">[PROJECT TITLE]</h3>
                  <p className="text-sm text-neutral-400 mt-1">[SHORT DESCRIPTION]</p>
                  <ul className="flex flex-wrap gap-1 mt-3" aria-label="Tech stack">
                    {['[TAG]', '[TAG]', '[TAG]'].map((t, i) => (
                      <li
                        key={i}
                        className="text-[10px] uppercase tracking-wider border border-neutral-700 text-neutral-400 px-2 py-1"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-neutral-500 mt-3">Role: [ROLE]</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="reels-heading" className="max-w-6xl mx-auto px-4 py-12 border-t border-neutral-800">
        <h2 id="reels-heading" className="text-2xl md:text-3xl font-semibold mb-6">Reels &amp; Previz</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Placeholder label="[TD REEL EMBED]" minHeight="240px" />
          <Placeholder label="[UNREAL PREVIZ EMBED]" minHeight="240px" />
        </div>
      </section>

      <section aria-labelledby="code-heading" className="max-w-6xl mx-auto px-4 py-12 border-t border-neutral-800">
        <h2 id="code-heading" className="text-2xl md:text-3xl font-semibold mb-6">Code</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {['[GITHUB REPO]', '[GITHUB REPO]', '[GITHUB REPO]', '[GITHUB REPO]'].map((label, i) => (
            <li key={i}>
              <button
                type="button"
                disabled
                className="w-full text-left border border-neutral-800 p-4 text-sm text-neutral-400 cursor-not-allowed"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="commission-heading" className="max-w-6xl mx-auto px-4 py-12 border-t border-neutral-800">
        <h2 id="commission-heading" className="text-2xl md:text-3xl font-semibold mb-4">Collaborate / Commission</h2>
        <p className="text-neutral-400 mb-6">[COLLAB COPY — artists, brands, immersive teams]</p>
        <Link to="/contact" className={ctaCls}>Start a project</Link>
      </section>
    </>
  )
}

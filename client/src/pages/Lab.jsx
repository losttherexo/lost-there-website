import useDocumentTitle from '../hooks/useDocumentTitle'
import Placeholder from '../components/Placeholder'

const PROJECTS = [1, 2, 3, 4, 5, 6]

export default function Lab() {
  useDocumentTitle('Lab', 'Visual and creative-technology experiments from lost,there.')

  return (
    <>
      <section aria-labelledby="build-heading" className="shell py-12 md:py-16">
        <h1 id="build-heading" className="text-4xl font-bold tracking-tight md:text-5xl">
          What I build
        </h1>
      </section>

      <section aria-labelledby="projects-heading" className="shell border-t border-line py-12">
        <h2 id="projects-heading" className="mb-6 text-2xl font-semibold md:text-3xl">
          Projects
        </h2>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((n) => (
            <li key={n}>
              <article className="flex h-full flex-col gap-3 border border-line bg-surface p-3">
                {/* reel/video goes here later (via <Embed>) */}
                <Placeholder label="[PROJECT REEL / VIDEO]" minHeight="160px" />
                <div className="p-1">
                  <h3 className="text-lg font-medium">[PROJECT TITLE]</h3>
                  <p className="mt-1 text-sm text-muted">[SHORT DESCRIPTION]</p>
                  <ul className="mt-3 flex flex-wrap gap-1" aria-label="Tech stack">
                    {['[TAG]', '[TAG]', '[TAG]'].map((t, i) => (
                      <li
                        key={i}
                        className="border border-line px-2 py-1 text-[10px] uppercase tracking-wider text-faint"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

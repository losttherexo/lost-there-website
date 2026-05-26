import useDocumentTitle from '../hooks/useDocumentTitle'
import ReleaseCard from '../components/ReleaseCard'
import { releases } from '../data/releases'

export default function Music() {
  useDocumentTitle('Music')

  return (
    <>
      <section className="shell py-12 md:py-16">
        <h1 className="text-4xl font-bold md:text-5xl">Music</h1>
        <p className="mt-3 max-w-xl text-muted">[Releases, singles, and works in progress.]</p>
      </section>

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
    </>
  )
}

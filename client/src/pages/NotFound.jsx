import { Link } from 'react-router-dom'
import useDocumentTitle from '../hooks/useDocumentTitle'

export default function NotFound() {
  useDocumentTitle('Not Found')
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-4 text-neutral-400">That page doesn&apos;t exist.</p>
      <Link
        to="/"
        className="mt-6 inline-block underline underline-offset-4 text-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
      >
        Back home
      </Link>
    </section>
  )
}

import { Link } from 'react-router-dom'
import useDocumentTitle from '../hooks/useDocumentTitle'

export default function NotFound() {
  useDocumentTitle('Not Found')
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-4 text-neutral-600">That page doesn't exist.</p>
      <Link to="/" className="mt-6 inline-block underline">Back home</Link>
    </section>
  )
}

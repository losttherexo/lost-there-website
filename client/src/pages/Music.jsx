import useDocumentTitle from '../hooks/useDocumentTitle'

export default function Music() {
  useDocumentTitle('Music')
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold">Music</h1>
      <p className="mt-4 text-neutral-600">Phase C stub. Wireframe content lands in Phase D.</p>
    </section>
  )
}

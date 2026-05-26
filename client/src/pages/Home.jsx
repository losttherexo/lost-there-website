import useDocumentTitle from '../hooks/useDocumentTitle'

export default function Home() {
  useDocumentTitle()

  return (
    <section aria-labelledby="hero-heading" className="shell py-20 md:py-32">
      <h1 id="hero-heading" className="text-5xl font-bold md:text-7xl">
        lost,there
      </h1>
    </section>
  )
}

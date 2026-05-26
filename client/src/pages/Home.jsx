import useDocumentTitle from '../hooks/useDocumentTitle'
import Atlas from '../components/scene/Atlas'

export default function Home() {
  useDocumentTitle()

  return (
    <section aria-label="lost,there — interactive map" className="relative h-[calc(100vh-4rem)] w-full overflow-hidden">
      <Atlas />
    </section>
  )
}

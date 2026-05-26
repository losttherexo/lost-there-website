import { useNavigate } from 'react-router-dom'
import useDocumentTitle from '../hooks/useDocumentTitle'
import Atlas from '../components/scene/Atlas'

export default function Home() {
  useDocumentTitle()
  // navigate() is created here (inside the Router) and passed into the scene —
  // r3f's Canvas is a separate renderer that doesn't inherit React Router context.
  const navigate = useNavigate()

  return (
    <section aria-label="lost,there — interactive map" className="relative h-[calc(100dvh-4rem)] w-full overflow-hidden">
      <Atlas onSelect={(to) => navigate(to)} />
    </section>
  )
}

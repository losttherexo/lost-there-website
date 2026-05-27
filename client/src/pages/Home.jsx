import useDocumentTitle from '../hooks/useDocumentTitle'

// Home is the map "overview". The 3D backdrop + section pins live in Layout
// (persistent across routes), so this page renders no content of its own.
export default function Home() {
  useDocumentTitle()
  return null
}

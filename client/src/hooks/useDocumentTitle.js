import { useEffect } from 'react'

const BASE = 'lost,there'

export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE}` : BASE
  }, [title])
}

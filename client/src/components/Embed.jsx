import Placeholder from './Placeholder'

// Reusable embed wrapper. Give it a provider + a normal share URL; it builds the
// right iframe src. Empty url → a labeled placeholder box (so the layout reads
// even before real URLs land). This is the single primitive for every embed slot
// across the site (releases, featured player, TD reel, previz, etc.).

const LABEL = {
  spotify: 'Spotify',
  soundcloud: 'SoundCloud',
  untitled: 'untitled.stream',
  apple: 'Apple Music',
  bandcamp: 'Bandcamp',
  youtube: 'YouTube',
}

const DEFAULT_HEIGHT = {
  spotify: 352,
  soundcloud: 166,
  untitled: 400,
  apple: 352,
  bandcamp: 120,
  youtube: 315,
}

// Turn a share/watch URL into an embeddable iframe src per provider.
function toEmbedSrc(provider, url) {
  if (!url) return null
  try {
    switch (provider) {
      case 'spotify':
        return url.includes('/embed/')
          ? url
          : url.replace('open.spotify.com/', 'open.spotify.com/embed/')
      case 'soundcloud':
        return `https://w.soundcloud.com/player/?url=${encodeURIComponent(
          url,
        )}&color=%236b8fb5&visual=true`
      case 'youtube': {
        const id = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)?.[1]
        return id ? `https://www.youtube.com/embed/${id}` : url
      }
      // untitled.stream / apple / bandcamp: assume an embeddable URL is given.
      default:
        return url
    }
  } catch {
    return url
  }
}

export default function Embed({
  provider = 'spotify',
  url = '',
  title,
  height,
  className = '',
}) {
  const label = LABEL[provider] ?? provider
  const src = toEmbedSrc(provider, url)
  const h = height ?? DEFAULT_HEIGHT[provider] ?? 352

  if (!src) {
    return (
      <Placeholder label={`${label} embed`} minHeight={`${h}px`} className={className}>
        Add a {label} share URL in <code className="text-neutral-300">src/data/releases.js</code>.
      </Placeholder>
    )
  }

  return (
    <iframe
      src={src}
      title={title ?? `${label} player`}
      loading="lazy"
      className={`w-full rounded border border-line bg-surface ${className}`}
      style={{ height: h }}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      allowFullScreen
    />
  )
}

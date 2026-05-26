import { FiPlay } from 'react-icons/fi'
import Embed from './Embed'

// Square cover: real artwork when `release.cover` is set, else a placeholder tile.
function Cover({ release }) {
  if (release.cover) {
    return (
      <img
        src={release.cover}
        alt={release.coverAlt ?? `${release.title} cover artwork`}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    )
  }
  return (
    <div
      role="img"
      aria-label={release.coverAlt ?? `${release.title} — artwork coming soon`}
      className="flex h-full w-full items-center justify-center bg-elevated"
    >
      <span className="text-[11px] uppercase tracking-[0.25em] text-faint">Artwork</span>
    </div>
  )
}

// Layers cross-dissolve in place inside a fixed square — no layout shift either
// direction. `motion-reduce` users get an instant swap.
const layer =
  'absolute inset-0 transition-opacity duration-500 ease-out motion-reduce:transition-none'

// Controlled: the Music page owns which card is open (one at a time) and handles
// closing (outside-click / Escape / tab-hide), so this just renders open/closed
// and reports intent to open. `data-release-card` marks the click-safe region.
export default function ReleaseCard({ release, isOpen, onOpen }) {
  return (
    <article data-release-card className="border border-line bg-surface">
      <div className="relative aspect-square">
        {/* Cover layer (the trigger) */}
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Play ${release.title}`}
          tabIndex={isOpen ? -1 : 0}
          className={`group ${layer} ${isOpen ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
        >
          <Cover release={release} />
          <span className="absolute inset-0 flex items-center justify-center bg-canvas/0 transition-colors group-hover:bg-canvas/40">
            <FiPlay
              aria-hidden="true"
              size={30}
              className="text-ink opacity-0 transition-opacity group-hover:opacity-100"
            />
          </span>
        </button>

        {/* Embed layer */}
        <div
          aria-hidden={!isOpen}
          className={`${layer} ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        >
          <Embed
            provider={release.embed.provider}
            url={release.embed.url}
            title={`${release.title} — player`}
            fill
          />
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium leading-tight">{release.title}</h3>
        <p className="mt-0.5 text-sm text-muted">
          {release.year}
          {release.type ? ` · ${release.type}` : ''}
        </p>
      </div>
    </article>
  )
}

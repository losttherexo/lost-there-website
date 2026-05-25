import { useId, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import Embed from './Embed'

// Square cover: real artwork when `release.cover` is set, else a placeholder tile.
function Cover({ release }) {
  if (release.cover) {
    return (
      <img
        src={release.cover}
        alt={release.coverAlt ?? `${release.title} cover artwork`}
        className="aspect-square w-full object-cover"
        loading="lazy"
      />
    )
  }
  return (
    <div
      role="img"
      aria-label={release.coverAlt ?? `${release.title} — artwork coming soon`}
      className="aspect-square w-full bg-elevated flex items-center justify-center"
    >
      <span className="text-faint text-[11px] uppercase tracking-[0.25em]">Artwork</span>
    </div>
  )
}

export default function ReleaseCard({ release }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <article className="flex flex-col border border-line bg-surface">
      <Cover release={release} />

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-medium leading-tight">{release.title}</h3>
            <p className="mt-0.5 text-sm text-muted">
              {release.year}
              {release.type ? ` · ${release.type}` : ''}
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className="mt-3 inline-flex items-center gap-1.5 self-start text-sm text-muted hover:text-ink transition-colors"
        >
          {open ? 'Hide details' : 'Player & tracks'}
          <FiChevronDown
            aria-hidden="true"
            className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {open && (
        <div id={panelId} className="space-y-4 border-t border-line p-4">
          <Embed
            provider={release.embed.provider}
            url={release.embed.url}
            title={`${release.title} — player`}
          />
          <ol className="divide-y divide-line">
            {release.tracks.map((t) => (
              <li
                key={t.n}
                className="flex items-center justify-between gap-4 py-2 text-sm"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="w-5 shrink-0 tabular-nums text-faint">
                    {String(t.n).padStart(2, '0')}
                  </span>
                  <span className="truncate">{t.title}</span>
                </span>
                <span className="shrink-0 tabular-nums text-faint">{t.duration}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </article>
  )
}

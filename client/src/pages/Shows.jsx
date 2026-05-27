import useDocumentTitle from '../hooks/useDocumentTitle'

const UPCOMING = [
  { date: '[DATE]', venue: '[VENUE]', city: '[CITY]' },
  { date: '[DATE]', venue: '[VENUE]', city: '[CITY]' },
  { date: '[DATE]', venue: '[VENUE]', city: '[CITY]' },
  { date: '[DATE]', venue: '[VENUE]', city: '[CITY]' },
]

export default function Shows() {
  useDocumentTitle('Shows', 'Upcoming lost,there live dates and where to catch the project live.')

  return (
    <section aria-labelledby="upcoming-heading" className="shell py-12 md:py-16">
      <h1 id="upcoming-heading" className="text-4xl font-bold tracking-tight md:text-5xl">
        Upcoming
      </h1>

      <ul className="mt-8 divide-y divide-line border-y border-line">
        {UPCOMING.map((show, i) => (
          <li
            key={i}
            className="grid grid-cols-1 items-baseline gap-2 px-1 py-4 sm:grid-cols-[160px_1fr_auto] sm:gap-6"
          >
            <span className="font-mono text-sm text-muted">{show.date}</span>
            <span>
              <span className="font-medium text-ink">{show.venue}</span>
              <span className="text-faint"> · {show.city}</span>
            </span>
            <button
              type="button"
              disabled
              className="cursor-not-allowed justify-self-start border border-line px-3 py-1.5 text-sm text-faint sm:justify-self-end"
            >
              [TICKET LINK]
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

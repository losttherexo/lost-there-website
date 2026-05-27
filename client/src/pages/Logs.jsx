import useDocumentTitle from '../hooks/useDocumentTitle'

const LOGS = [
  { date: '[DATE]', title: '[LOG TITLE]', excerpt: '[Short excerpt of the entry — process notes, releases, shows…]' },
  { date: '[DATE]', title: '[LOG TITLE]', excerpt: '[Short excerpt of the entry.]' },
  { date: '[DATE]', title: '[LOG TITLE]', excerpt: '[Short excerpt of the entry.]' },
  { date: '[DATE]', title: '[LOG TITLE]', excerpt: '[Short excerpt of the entry.]' },
]

export default function Logs() {
  useDocumentTitle('Logs', 'Logs — notes, process, and updates from lost,there.')

  return (
    <section aria-labelledby="logs-heading" className="shell py-12 md:py-16">
      <h1 id="logs-heading" className="text-4xl font-bold tracking-tight md:text-5xl">
        Logs
      </h1>

      <ul className="mt-8 divide-y divide-line border-t border-line">
        {LOGS.map((log, i) => (
          <li key={i} className="py-6">
            <p className="font-mono text-xs uppercase tracking-wider text-faint">{log.date}</p>
            <h2 className="mt-2 text-xl font-medium text-ink">{log.title}</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">{log.excerpt}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

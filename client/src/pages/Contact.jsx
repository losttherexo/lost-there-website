import useDocumentTitle from '../hooks/useDocumentTitle'

const SOCIALS = ['[INSTAGRAM]', '[SPOTIFY]', '[BANDCAMP]', '[SOUNDCLOUD]', '[YOUTUBE]', '[TIKTOK]']

const inputCls =
  'mt-2 w-full bg-neutral-900 border border-neutral-800 px-3 py-2 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus-visible:border-neutral-400 focus-visible:ring-1 focus-visible:ring-neutral-400 rounded'

const ctaCls =
  'inline-block px-6 py-3 border border-neutral-100 text-neutral-100 hover:bg-neutral-100 hover:text-neutral-950 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950'

export default function Contact() {
  useDocumentTitle('Contact')
  return (
    <>
      <section className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Contact</h1>
        <p className="mt-2 text-neutral-400">Booking, collaboration, press, or just to say hi.</p>
      </section>

      <section aria-labelledby="form-heading" className="max-w-3xl mx-auto px-4 py-12 border-t border-neutral-800">
        <h2 id="form-heading" className="text-2xl md:text-3xl font-semibold mb-6">Send a message</h2>
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()} noValidate>
          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium">Name</label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              className={inputCls}
              placeholder="[NAME]"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium">Email</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              className={inputCls}
              placeholder="[EMAIL]"
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="block text-sm font-medium">Message</label>
            <textarea
              id="contact-message"
              name="message"
              rows={6}
              className={inputCls}
              placeholder="[MESSAGE]"
            />
          </div>
          <p className="text-xs text-neutral-500">
            [FORM BACKEND TBD — wireframe only, no submit handler.]
          </p>
          <button type="submit" className={ctaCls}>Send</button>
        </form>
      </section>

      <section aria-labelledby="booking-heading" className="max-w-3xl mx-auto px-4 py-12 border-t border-neutral-800">
        <h2 id="booking-heading" className="text-2xl md:text-3xl font-semibold mb-3">Booking inquiries</h2>
        <p className="text-neutral-400">[BOOKING EMAIL / MGMT CONTACT]</p>
      </section>

      <section aria-labelledby="socials-heading" className="max-w-3xl mx-auto px-4 py-12 border-t border-neutral-800">
        <h2 id="socials-heading" className="text-2xl md:text-3xl font-semibold mb-6">Find me</h2>
        <ul className="flex flex-wrap gap-3">
          {SOCIALS.map((label) => (
            <li key={label}>
              <button
                type="button"
                disabled
                className="border border-neutral-800 px-4 py-2 text-sm text-neutral-300 cursor-not-allowed"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

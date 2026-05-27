import useDocumentTitle from '../hooks/useDocumentTitle'
import Placeholder from '../components/Placeholder'

export default function About() {
  useDocumentTitle('About', 'About lost,there — bio and booking.')

  return (
    <>
      <section aria-labelledby="bio-heading" className="shell py-12 md:py-16">
        <h1 id="bio-heading" className="text-4xl font-bold tracking-tight md:text-5xl">
          About
        </h1>
        <div className="mt-8 grid grid-cols-1 items-start gap-6 md:grid-cols-[1fr_2fr]">
          <Placeholder label="[ARTIST PHOTO]" minHeight="320px" />
          <div className="space-y-4 text-lg leading-relaxed text-muted">
            <p>
              the comma is the thesis. dislocated and present at the same time. most of us are
              both, most of the time.
            </p>
            <p>
              the songs get made between a guitar and a stack of screens — and from either side,
              the question doesn&rsquo;t change:
            </p>
            <p className="text-ink">what lives in the middle, and how do i get there?</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="contact-heading" className="shell border-t border-line py-12">
        <h2 id="contact-heading" className="mb-3 text-2xl font-semibold md:text-3xl">
          Contact
        </h2>
        <p className="text-muted">[BOOKING EMAIL — e.g. booking@lostthere.online]</p>
      </section>
    </>
  )
}

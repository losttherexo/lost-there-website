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
          <Placeholder label="[BIO COPY]" minHeight="320px">
            Long-form narrative bio. Fan-facing tone. Multiple paragraphs.
          </Placeholder>
        </div>
      </section>

      <section aria-labelledby="booking-heading" className="shell border-t border-line py-12">
        <h2 id="booking-heading" className="mb-3 text-2xl font-semibold md:text-3xl">
          Booking
        </h2>
        <p className="text-muted">[BOOKING EMAIL — e.g. booking@lostthere.online]</p>
      </section>
    </>
  )
}

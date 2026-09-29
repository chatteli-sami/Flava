import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Calendar } from 'lucide-react'
import { site } from '../config/site'
import { useReveal, VIEWPORT } from '../lib/motion'

const UNIT_OPTIONS = ['S+1', 'S+2', 'S+3', 'S+3.5', 'Duplex', 'Penthouse', 'Loft']

export function SectionBooking() {
  const left = useReveal({ distance: 40 })
  const form = useReveal({ distance: 40, delay: 0.15 })

  return (
    <section
      id="contact"
      className="group/eyebrow bg-bone px-6 py-24 sm:px-8 md:py-32"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 md:grid-cols-2 md:gap-24">
          <motion.div
            initial={left.initial}
            whileInView={left.whileInView}
            viewport={VIEWPORT}
            transition={left.transition}
          >
            <p className="eyebrow">Plan Your Visit</p>
            <h2
              id="contact-heading"
              className="font-serif text-4xl font-medium leading-tight text-charcoal sm:text-5xl"
            >
              Begin your FLAVA home journey.
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-stone">
              Schedule a private viewing of the model residence, or speak with our
              sales team about availability, pricing, and bespoke finish options. We
              will respond within two business days.
            </p>

            <address className="mt-10 not-italic">
              <ul className="space-y-5">
                <li className="group/contact flex items-start gap-4">
                  <span className="mt-0.5 text-gold transition-transform duration-300 group-hover/contact:scale-110">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <a
                    href={`mailto:${site.email}`}
                    className="link-underline text-charcoal hover:text-gold"
                  >
                    {site.email}
                  </a>
                </li>
                <li className="group/contact flex items-start gap-4">
                  <span className="mt-0.5 text-gold transition-transform duration-300 group-hover/contact:scale-110">
                    <Phone className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <a
                    href={`tel:${site.phone.replace(/\s/g, '')}`}
                    className="link-underline text-charcoal hover:text-gold"
                  >
                    {site.phone}
                  </a>
                </li>
                <li className="flex items-start gap-4">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
                  <span className="text-charcoal">{site.address}</span>
                </li>
                <li className="flex items-start gap-4">
                  <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
                  <span className="text-charcoal">Mon–Fri, 9:00–18:00 (Tunis)</span>
                </li>
              </ul>
            </address>
          </motion.div>

          <motion.form
            initial={form.initial}
            whileInView={form.whileInView}
            viewport={VIEWPORT}
            transition={form.transition}
            className="space-y-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs uppercase tracking-wider text-stone">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="field"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs uppercase tracking-wider text-stone">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="field"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-xs uppercase tracking-wider text-stone">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="field"
                placeholder="+216 ..."
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="unit" className="text-xs uppercase tracking-wider text-stone">
                Preferred Unit
              </label>
              <select id="unit" name="unit" className="field cursor-pointer">
                <option value="">Select a unit</option>
                {UNIT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-xs uppercase tracking-wider text-stone">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="field resize-none"
                placeholder="How can we help you?"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              <span>Request a Viewing</span>
              <span className="btn-arrow" aria-hidden="true">
                →
              </span>
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}

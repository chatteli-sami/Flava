import { motion } from 'framer-motion'
import { units } from '../config/site'
import { useReveal, staggerDelay, useHoverLift, VIEWPORT, VIEWPORT_EARLY } from '../lib/motion'

export function SectionUnits() {
  const header = useReveal({ distance: 30 })
  const card = useReveal({ distance: 40 })
  const lift = useHoverLift()

  return (
    <section
      id="units"
      className="group/eyebrow bg-bone px-6 py-24 sm:px-8 md:py-32"
      aria-labelledby="units-heading"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={header.initial}
          whileInView={header.whileInView}
          viewport={VIEWPORT}
          transition={header.transition}
          className="mb-16 md:mb-24"
        >
          <p className="eyebrow">Available Units</p>
          <h2
            id="units-heading"
            className="font-serif text-4xl font-medium leading-tight text-charcoal sm:text-5xl"
          >
            Homes designed to scale.
          </h2>
          <p className="mt-4 max-w-2xl text-base text-stone">
            Every floor plan is crafted with Feng Shui principles and finishes that honor
            modern living. From intimate S+1 apartments to the iconic rooftop Penthouse, each
            home spans 75–340 m² of refined space.
          </p>
        </motion.div>

        <div className="space-y-6">
          {units.map((unit, index) => (
            <motion.article
              key={unit.id}
              initial={card.initial}
              whileInView={card.whileInView}
              viewport={VIEWPORT_EARLY}
              transition={{ ...card.transition, delay: staggerDelay(index, 0.07) }}
              whileHover={lift.whileHover}
              whileFocus={lift.whileFocus}
              className="card card-light group"
            >
              <span className="card-rule" aria-hidden="true" />

              <div className="relative grid gap-6 p-8 md:grid-cols-3 md:items-center md:gap-12">
                <div>
                  <span className="inline-block bg-gold/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-charcoal">
                    {unit.type}
                  </span>
                  <h3
                    id={`${unit.id}-label`}
                    className="mt-2 font-serif text-3xl font-medium text-charcoal transition-colors duration-300 group-hover:text-gold md:text-4xl"
                  >
                    {unit.label}
                  </h3>
                </div>

                <div className="text-center">
                  <p className="font-serif text-2xl text-charcoal">{unit.size}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-stone">
                    Interior space
                  </p>
                </div>

                <p
                  className="text-base leading-relaxed text-stone md:text-right"
                  aria-labelledby={`${unit.id}-label`}
                >
                  {unit.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={header.initial}
          whileInView={header.whileInView}
          viewport={VIEWPORT}
          transition={header.transition}
          className="mt-14 flex justify-center"
        >
          <a
            href="#contact"
            className="btn btn-primary"
          >
            <span>Request availability</span>
            <span className="btn-arrow" aria-hidden="true">
              →
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

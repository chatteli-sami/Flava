import { motion } from 'framer-motion'
import { about, developer } from '../config/site'
import { useReveal, useRevealX, staggerDelay } from '../lib/motion'

const STATS = [
  { value: developer.founded, label: 'Founded' },
  { value: developer.projects, label: 'Projects' },
  { value: 'TN', label: 'Country' },
]

export function SectionAbout() {
  const left = useRevealX({ from: 'left' })
  const right = useRevealX({ from: 'right', delay: 0.1 })
  const statReveal = useReveal({ distance: 20, duration: 0.6 })

  return (
    <section
      id="about"
      className="group/eyebrow relative bg-bone px-6 py-24 sm:px-8 md:py-32"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-20">
          <motion.div initial={left.initial} whileInView={left.whileInView} viewport={{ once: true, margin: '-100px' }} transition={left.transition}>
            <p className="eyebrow">About FLAVA Residences</p>
            <h2
              id="about-heading"
              className="font-serif text-4xl font-medium leading-tight text-charcoal sm:text-5xl"
            >
              {about.tagline}
            </h2>
            <a
              href="#units"
              className="link-underline mt-8 inline-flex text-xs font-medium uppercase tracking-[0.2em] text-gold"
            >
              Explore the residences
            </a>
          </motion.div>

          <motion.div
            initial={right.initial}
            whileInView={right.whileInView}
            viewport={{ once: true, margin: '-100px' }}
            transition={right.transition}
            className="space-y-6 text-base leading-relaxed text-stone sm:text-lg"
          >
            <p>{about.concept}</p>
            <p>{about.fengShui}</p>
            <p className="text-charcoal font-medium">Developed by {developer.name}</p>

            <div className="grid grid-cols-3 gap-6 border-t border-charcoal/10 pt-8">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={statReveal.initial}
                  whileInView={statReveal.whileInView}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ ...statReveal.transition, delay: staggerDelay(i, 0.1) }}
                  className="group/stat"
                >
                  <p className="font-serif text-3xl text-charcoal transition-colors duration-300 group-hover/stat:text-gold">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-stone">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

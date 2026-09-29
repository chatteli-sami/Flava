import { motion } from 'framer-motion'
import { Waves, Sparkles, Dumbbell, Users, Film } from 'lucide-react'
import { amenities } from '../config/site'
import { useReveal, staggerDelay, useHoverLift, VIEWPORT, VIEWPORT_EARLY } from '../lib/motion'

const iconMap = {
  waves: Waves,
  spa: Sparkles,
  dumbbell: Dumbbell,
  users: Users,
  film: Film,
}

export function SectionAmenities() {
  const header = useReveal({ distance: 30 })
  const card = useReveal({ distance: 40 })
  const lift = useHoverLift()

  const renderIcon = (iconName) => {
    const Component = iconMap[iconName]
    return Component ? <Component className="h-7 w-7" aria-hidden="true" /> : null
  }

  return (
    <section
      id="amenities"
      className="group/eyebrow bg-charcoal px-6 py-24 text-bone sm:px-8 md:py-32"
      aria-labelledby="amenities-heading"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={header.initial}
          whileInView={header.whileInView}
          viewport={VIEWPORT}
          transition={header.transition}
          className="mb-16 md:mb-24"
        >
          <p className="eyebrow">Amenities</p>
          <h2 id="amenities-heading" className="font-serif text-4xl font-medium sm:text-5xl">
            Designed for the senses.
          </h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {amenities.map((amenity, index) => (
            <motion.div
              key={amenity.name}
              initial={card.initial}
              whileInView={card.whileInView}
              viewport={VIEWPORT_EARLY}
              transition={{ ...card.transition, delay: staggerDelay(index, 0.1) }}
              whileHover={lift.whileHover}
              whileFocus={lift.whileFocus}
              className="card card-dark group flex flex-col items-center rounded-sm p-8 text-center"
            >
              <span className="card-rule" aria-hidden="true" />

              <div className="icon-tile h-14 w-14 rounded-full">
                {renderIcon(amenity.icon)}
              </div>
              <h3 className="font-serif text-xl font-medium text-bone transition-colors duration-300 group-hover:text-gold">
                {amenity.name}
              </h3>
              <p className="text-sm leading-relaxed text-white/60">
                {amenity.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

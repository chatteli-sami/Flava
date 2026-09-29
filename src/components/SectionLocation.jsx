import { motion } from 'framer-motion'
import { MapPin, Navigation, Plane, Landmark } from 'lucide-react'
import { locationHighlights } from '../config/site'
import { useReveal, staggerDelay, useHoverLift, VIEWPORT, VIEWPORT_EARLY } from '../lib/motion'

const iconMap = {
  MapPin,
  Navigation,
  Plane,
  Landmark,
}

export function SectionLocation() {
  const header = useReveal({ distance: 30 })
  const card = useReveal({ distance: 40 })
  const lift = useHoverLift()

  const renderIcon = (iconName) => {
    const Component = iconMap[iconName]
    return Component ? <Component className="h-6 w-6" aria-hidden="true" /> : null
  }

  return (
    <section
      id="location"
      className="group/eyebrow bg-charcoal px-6 py-24 text-bone sm:px-8 md:py-32"
      aria-labelledby="location-heading"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={header.initial}
          whileInView={header.whileInView}
          viewport={VIEWPORT}
          transition={header.transition}
          className="mb-16 md:mb-24"
        >
          <p className="eyebrow">Prime Location</p>
          <h2 id="location-heading" className="font-serif text-4xl font-medium sm:text-5xl">
            Jardins de Carthage
          </h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {locationHighlights.map((location, index) => (
            <motion.article
              key={location.name}
              initial={card.initial}
              whileInView={card.whileInView}
              viewport={VIEWPORT_EARLY}
              transition={{ ...card.transition, delay: staggerDelay(index, 0.1) }}
              whileHover={lift.whileHover}
              whileFocus={lift.whileFocus}
              className="card card-dark group rounded-sm p-6"
            >
              <span className="card-rule" aria-hidden="true" />

              <div className="icon-tile mb-4 h-12 w-12 rounded-sm">
                {renderIcon(location.icon)}
              </div>

              <h3 className="mb-2 font-serif text-xl font-medium text-bone transition-colors duration-300 group-hover:text-gold">
                {location.name}
              </h3>
              <p className="mb-4 text-sm text-white/60">{location.description}</p>

              <div className="flex items-center gap-2 text-xs font-medium text-gold">
                <Navigation
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
                <span>{location.distance} drive</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

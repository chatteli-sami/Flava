import { useReducedMotion } from '../hooks/useReducedMotion'

/**
 * Shared motion language.
 *
 * Every section pulls its easing, duration and stagger from here so the site
 * reads as one continuous system rather than a set of separately-tuned pages.
 */

/** Primary curve — fast departure, long soft settle. Used for entrances. */
export const EASE_EXPO = [0.16, 1, 0.3, 1]

/** Softer curve for opacity-only fades and large surfaces. */
export const EASE_SWIFT = [0.4, 0, 0.2, 1]

export const DURATION = {
  fast: 0.4,
  base: 0.7,
  slow: 0.9,
}

/** Viewport trigger reused everywhere so reveals fire at the same depth. */
export const VIEWPORT = { once: true, margin: '-100px' }
export const VIEWPORT_EARLY = { once: true, margin: '-60px' }

/**
 * Builds a `whileInView` variant set that collapses to a plain fade when the
 * user has asked for reduced motion — no travel, no stagger.
 */
export function useReveal({ distance = 32, delay = 0, duration = DURATION.base } = {}) {
  const reduced = useReducedMotion()

  if (reduced) {
    return {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
      transition: { duration: 0.3, ease: 'linear' },
    }
  }

  return {
    initial: { opacity: 0, y: distance },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration, delay, ease: EASE_EXPO },
  }
}

/** Same as `useReveal` but travels horizontally — for left/right split layouts. */
export function useRevealX({ distance = 40, delay = 0, from = 'left' } = {}) {
  const reduced = useReducedMotion()
  const x = from === 'left' ? -distance : distance

  if (reduced) {
    return {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
      transition: { duration: 0.3, ease: 'linear' },
    }
  }

  return {
    initial: { opacity: 0, x },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: DURATION.base, delay, ease: EASE_EXPO },
  }
}

/** Per-index delay for lists, with a ceiling so late items don't feel sluggish. */
export function staggerDelay(index, step = 0.08, max = 0.4) {
  return Math.min(index * step, max)
}

/**
 * Framer Motion writes an inline `transform` on any element it animates, which
 * beats a CSS `:hover { transform }` rule. So the card lift has to be owned by
 * Motion too, or it is silently dropped. Returns an empty object under reduced
 * motion so the lift disappears along with the entrances.
 */
export function useHoverLift({ y = -6, scale = 1 } = {}) {
  const reduced = useReducedMotion()

  if (reduced) return { whileHover: {}, whileFocus: {} }

  return {
    whileHover: { y, scale },
    whileFocus: { y, scale },
    transition: { duration: 0.45, ease: EASE_EXPO },
  }
}

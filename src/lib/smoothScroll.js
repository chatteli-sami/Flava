import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

let activeTween = null

const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Height of the fixed nav bar. The mobile menu is a sibling of the bar, so
// measuring `header.fixed` would include an expanded menu and over-offset.
const navOffset = () => {
  const bar = document.querySelector('[data-nav-bar]')
  if (!bar) return 0
  return Math.ceil(bar.getBoundingClientRect().height)
}

const maxScroll = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight)

const stop = () => {
  if (activeTween) {
    activeTween.kill()
    activeTween = null
  }
}

const settle = () => {
  window.removeEventListener('wheel', stop)
  window.removeEventListener('touchstart', stop)
  window.removeEventListener('keydown', onKeyDown)
}

const onKeyDown = (event) => {
  const keys = [
    'ArrowUp',
    'ArrowDown',
    'PageUp',
    'PageDown',
    'Home',
    'End',
    ' ',
    'Spacebar',
  ]
  if (keys.includes(event.key)) stop()
}

export function scrollToPosition(y, options = {}) {
  const { duration = 1.1, offset = 0 } = options
  const target = Math.min(Math.max(0, y + offset), maxScroll())

  stop()

  if (prefersReducedMotion() || Math.abs(window.scrollY - target) < 2) {
    window.scrollTo(0, target)
    return
  }

  window.addEventListener('wheel', stop, { passive: true, once: true })
  window.addEventListener('touchstart', stop, { passive: true, once: true })
  window.addEventListener('keydown', onKeyDown)

  activeTween = gsap.to(window, {
    duration,
    ease: 'power2.inOut',
    overwrite: 'auto',
    scrollTo: { y: target, autoKill: true },
    onComplete: () => {
      activeTween = null
      settle()
    },
    onInterrupt: settle,
  })
}

export function scrollToSelector(selector, options = {}) {
  const element =
    typeof selector === 'string' ? document.querySelector(selector) : selector

  if (!element) return

  const top = element.getBoundingClientRect().top + window.scrollY

  scrollToPosition(top, { offset: -navOffset(), ...options })

  if (options.focus !== false) {
    const hadTabIndex = element.hasAttribute('tabindex')
    if (!hadTabIndex) element.setAttribute('tabindex', '-1')
    element.focus({ preventScroll: true })
    if (!hadTabIndex) {
      element.addEventListener('blur', () => element.removeAttribute('tabindex'), { once: true })
    }
  }
}

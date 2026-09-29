import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { navLinks, site } from '../config/site'
import { scrollToSelector } from '../lib/smoothScroll'

const SECTION_IDS = ['hero', ...navLinks.map((link) => link.href.replace('#', ''))]

export function Navigation() {
  const [visible, setVisible] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const railRef = useRef(null)

  // Header reveal + scroll progress rail, both driven from one rAF-throttled
  // scroll handler so we read layout once per frame instead of per event.
  useEffect(() => {
    let ticking = false

    const update = () => {
      ticking = false
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight

      setVisible(y > window.innerHeight * 0.9)

      if (railRef.current) {
        const progress = max > 0 ? Math.min(y / max, 1) : 0
        railRef.current.style.transform = `scaleX(${progress})`
      }
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Highlight whichever section currently owns the viewport.
  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean)
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]) setActiveSection(visible[0].target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!mobileOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen])

  const handleNavClick = (event, href) => {
    // Let modified clicks (new tab, download) behave natively.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return

    event.preventDefault()
    scrollToSelector(href)
    setMobileOpen(false)
  }

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div
        data-nav-bar
        className="border-b border-white/10 bg-charcoal/90 backdrop-blur-md"
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"
          aria-label="Main navigation"
        >
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="font-serif text-xl text-bone transition-colors duration-quick hover:text-gold"
          >
            {site.title}
          </a>

          <button
            type="button"
            className="text-bone transition-colors duration-quick hover:text-gold md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => {
              const id = link.href.replace('#', '')
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    data-active={activeSection === id}
                    aria-current={activeSection === id ? 'true' : undefined}
                    className="nav-link"
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      <div className="scroll-rail" aria-hidden="true">
        <div ref={railRef} className="scroll-rail-fill" style={{ transform: 'scaleX(0)' }} />
      </div>

      <div
        id="mobile-menu"
        className={`overflow-hidden border-b border-white/10 bg-charcoal/95 backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
          mobileOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="flex flex-col gap-4 px-6 py-6">
          {navLinks.map((link) => {
            const id = link.href.replace('#', '')
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  data-active={activeSection === id}
                  className="nav-link block"
                >
                  {link.label}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </header>
  )
}

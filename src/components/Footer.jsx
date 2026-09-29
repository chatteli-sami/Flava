import { site, navLinks } from '../config/site'
import { scrollToSelector } from '../lib/smoothScroll'

export function Footer() {
  const year = new Date().getFullYear()

  const handleClick = (event, href) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
    event.preventDefault()
    scrollToSelector(href)
  }

  return (
    <footer className="border-t border-charcoal/10 bg-bone px-6 py-12 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <a
          href="#hero"
          onClick={(e) => handleClick(e, '#hero')}
          className="link-underline font-serif text-xl text-charcoal hover:text-gold"
        >
          {site.title}
        </a>

        <ul className="flex flex-wrap items-center justify-center gap-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="link-underline text-xs uppercase tracking-widest text-stone hover:text-charcoal"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <p className="text-xs text-stone">
          © {year} {site.title}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

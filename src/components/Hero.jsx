import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Hero.css'

gsap.registerPlugin(ScrollTrigger)

const CHAPTERS = [
  {
    id: 'prologue',
    progress: [0, 0.12],
    title: 'The Ancient Chronicles',
    subtitle: 'A SONG OF ICE AND FIRE',
    body: 'In the beginning, there were only the words of the Maesters — secrets sealed within ancient tomes, waiting for a hand brave enough to open them.',
    sigil: '✦',
  },
  {
    id: 'winterfell',
    progress: [0.12, 0.30],
    title: 'The North Remembers',
    subtitle: 'HOUSE STARK — WINTERFELL',
    body: 'Winter is coming. Beyond the ancient walls, the cold whispers of the North carry stories older than the Wall itself.',
    sigil: '⚔',
  },
  {
    id: 'westeros',
    progress: [0.30, 0.52],
    title: 'The Seven Kingdoms',
    subtitle: 'THE REALM OF WESTEROS',
    body: "From the Eyrie's clouded peaks to the red sands of Dorne — seven kingdoms, one throne, a thousand reasons to bleed.",
    sigil: '♜',
  },
  {
    id: 'kings-landing',
    progress: [0.52, 0.70],
    title: 'Where Crowns Are Won',
    subtitle: "KING'S LANDING — THE CAPITAL",
    body: 'The city that swallows kings whole. Gold and treachery perfume the air. Every smile here conceals a blade.',
    sigil: '👑',
  },
  {
    id: 'swords',
    progress: [0.70, 0.87],
    title: 'A Thousand Blades',
    subtitle: 'FORGED IN CONQUEST',
    body: 'One thousand swords, surrendered by enemies of Aegon the Conqueror. Melted. Reshaped. Made into something terrible and magnificent.',
    sigil: '⚒',
  },
  {
    id: 'throne',
    progress: [0.87, 1.0],
    title: 'The Iron Throne',
    subtitle: 'WHEN YOU PLAY THE GAME OF THRONES',
    body: 'You win — or you die.',
    sigil: '♔',
  },
]

const Hero = () => {
  const containerRef   = useRef(null)
  const stickyRef      = useRef(null)
  const videoRef       = useRef(null)
  const overlayRef     = useRef(null)
  const titleRef       = useRef(null)
  const subtitleRef    = useRef(null)
  const bodyRef        = useRef(null)
  const sigilRef       = useRef(null)
  const progressRef    = useRef(null)
  const vignetteRef    = useRef(null)
  const chapterLabelRef = useRef(null)
  const runeBarRef     = useRef(null)

  const [videoReady, setVideoReady] = useState(false)

// ─── Refs for scroll-direction / chapter state (no re-renders) ──
  const prevChapter     = useRef(-1)
  const isScrollingUp   = useRef(false)
  const lastProgress    = useRef(0)
  const chapterEnterTl  = useRef(null)
  const chapterExitTl   = useRef(null)
  const isAnimating     = useRef(false)
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  // ─── Chapter detection (pure math, no DOM) ───────────────────────
  const detectChapter = useCallback((p) => {
    for (let i = 0; i < CHAPTERS.length; i++) {
      if (p >= CHAPTERS[i].progress[0] && p < CHAPTERS[i].progress[1]) return i
    }
    return CHAPTERS.length - 1
  }, [])

  // ─── Chapter enter animation (forward) ───────────────────────────
  const chapterEnter = useCallback((idx) => {
    const ch = CHAPTERS[idx]
    if (!sigilRef.current || !subtitleRef.current || !titleRef.current || !bodyRef.current) return

    // Set new text first
    sigilRef.current.textContent    = ch.sigil
    subtitleRef.current.textContent = ch.subtitle
    titleRef.current.textContent    = ch.title
    bodyRef.current.textContent     = ch.body

    // Chapter label
    if (chapterLabelRef.current) {
      chapterLabelRef.current.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(CHAPTERS.length).padStart(2, '0')}`
      gsap.fromTo(chapterLabelRef.current,
        { opacity: 0, x: 12 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
      )
    }

    // Staggered entrance
    chapterEnterTl.current = gsap.timeline()
    chapterEnterTl.current
      .to([sigilRef.current, subtitleRef.current, titleRef.current, bodyRef.current], {
        y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', stagger: 0.07,
      })

    return chapterEnterTl.current
  }, [])

  // ─── Chapter exit animation (reverse — scroll back) ──────────────
  const chapterExit = useCallback(() => {
    if (!sigilRef.current || !subtitleRef.current || !titleRef.current || !bodyRef.current) return

    chapterExitTl.current = gsap.timeline()
    chapterExitTl.current
      .to([sigilRef.current, subtitleRef.current, titleRef.current, bodyRef.current], {
        y: -24, opacity: 0, duration: 0.35, ease: 'power2.in', stagger: 0.04,
      })
      .call(() => {
        // Clear text on exit so next enter can set fresh
        sigilRef.current.textContent    = ''
        subtitleRef.current.textContent = ''
        titleRef.current.textContent    = ''
        bodyRef.current.textContent     = ''
      })

    return chapterExitTl.current
  }, [])

  // ─── Video + overlay setup ───────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onReady = () => setTimeout(() => setVideoReady(true), 800)
    video.addEventListener('loadedmetadata', onReady)
    if (video.readyState >= 1) onReady()

    // Init chapter text
    const ch0 = CHAPTERS[0]
    if (titleRef.current)    titleRef.current.textContent    = ch0.title
    if (subtitleRef.current) subtitleRef.current.textContent = ch0.subtitle
    if (bodyRef.current)     bodyRef.current.textContent     = ch0.body
    if (sigilRef.current)    sigilRef.current.textContent    = ch0.sigil

    return () => video.removeEventListener('loadedmetadata', onReady)
  }, [])

  // ─── GSAP ScrollTrigger ──────────────────────────────────────────
  useEffect(() => {
    if (!videoReady) return

    const video    = videoRef.current
    const duration = video.duration || 1
    const scrollHeight = window.innerHeight * 6

    // Pin the sticky wrapper
    const pinTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start:   'top top',
      end:     `+=${scrollHeight}`,
      pin:     stickyRef.current,
      pinSpacing: true,
    })

    // Main scrub timeline — drives video time + rune bar
    const scrubTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start:   'top top',
        end:     `+=${scrollHeight}`,
        scrub:   1.2,
        onUpdate: (self) => {
          const p = self.progress

          // ── direction detection ──
          if (p > lastProgress.current) {
            isScrollingUp.current = false  // scrolling down
          } else if (p < lastProgress.current) {
            isScrollingUp.current = true   // scrolling up
          }
          lastProgress.current = p

          // ── video scrub (throttled) ──
          const t = p * duration
          if (Math.abs(video.currentTime - t) > 0.04) {
            video.currentTime = t
          }

          // ── progress bar ──
          if (progressRef.current) {
            progressRef.current.style.width = `${p * 100}%`
          }

          // ── vignette intensity ──
          const vinInt = 0.55 + Math.sin(p * Math.PI) * 0.2
          if (vignetteRef.current) {
            vignetteRef.current.style.opacity = String(vinInt)
          }

          // ── chapter transition (bidirectional) ──
          const idx = detectChapter(p)
          if (idx !== prevChapter.current && !isAnimating.current) {
            isAnimating.current = true

            // Exit animates out in the scroll direction, then the new chapter
            // slides in — identical for scrolling up or down.
            chapterExit()
            chapterEnter(idx)

            prevChapter.current = idx
            setActiveChapterIndex(idx)

            // Debounce: allow next transition after animation finishes
            const tl = chapterEnterTl.current || chapterExitTl.current
            if (tl) {
              tl.eventCallback('onComplete', () => {
                isAnimating.current = false
              })
            }
          }
        },
      },
    })

    // Subtle overlay colour shift across scroll
    gsap.to(overlayRef.current, {
      background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.0) 55%)',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${scrollHeight}`,
        scrub: 2,
      },
    })

    // Rune bar decorative tick animation
    if (runeBarRef.current) {
      const ticks = runeBarRef.current.querySelectorAll('.rune-tick')
      gsap.fromTo(ticks,
        { scaleY: 0, opacity: 0 },
        {
          scaleY: 1, opacity: 1, stagger: 0.06, duration: 0.6, ease: 'elastic.out(1,0.5)',
          scrollTrigger: { trigger: containerRef.current, start: 'top 80%' }
        }
      )
    }

    // Initial entrance animation
    gsap.fromTo(
      [sigilRef.current, subtitleRef.current, titleRef.current, bodyRef.current],
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', stagger: 0.1, delay: 0.3 }
    )

    return () => {
      scrubTl.kill()
      pinTrigger.kill()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoReady])

  // ─── Render ───────────────────────────────────────────────────────
  return (
    <>
      {/* Loading overlay */}
      <div className={`got-loading ${videoReady ? 'hidden' : ''}`}>
        <div className="got-loading-logo">Game of Thrones</div>
        <div className="got-loading-sub">The Chronicles of Westeros</div>
        <div className="got-loading-bar-wrap">
          <div className="got-loading-bar-fill" />
        </div>
      </div>

      {/* Main scroll container */}
      <div
        ref={containerRef}
        className="got-container"
        style={{ height: `${window.innerHeight * 6 + window.innerHeight}px` }}
      >
        {/* Sticky viewport */}
        <div ref={stickyRef} className="got-sticky">
          <video
            ref={videoRef}
            className="got-video"
            src="/video/one.mp4"
            playsInline
            muted
            preload="auto"
          />

          <div ref={vignetteRef} className="got-vignette" />
          <div ref={overlayRef}  className="got-overlay" />
          <div className="got-grain" />

          {/* Corner ornaments */}
          {['tl','tr','bl','br'].map(pos => (
            <div key={pos} className={`got-corner got-corner-${pos}`}>
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 2 L2 20 M2 2 L20 2" stroke="#c9a84c" strokeWidth="1" strokeOpacity="0.5"/>
                <path d="M2 2 L8 8" stroke="#c9a84c" strokeWidth="0.5" strokeOpacity="0.4"/>
                <rect x="1" y="1" width="4" height="4" fill="none" stroke="#c9a84c" strokeWidth="0.5" strokeOpacity="0.6"/>
              </svg>
            </div>
          ))}

          {/* Nav */}
          <nav className="got-nav">
            <div className="got-nav-logo">Game of Thrones</div>
            <ul className="got-nav-links">
              {['The World','Characters','Houses','History'].map(l => (
                <li key={l}><a href="#0">{l}</a></li>
              ))}
            </ul>
          </nav>

          {/* Rune bar */}
          <div ref={runeBarRef} className="got-rune-bar">
            {Array.from({ length: 80 }).map((_, i) => (
              <div key={i} className="rune-tick" />
            ))}
          </div>

          <div className="got-content">
            <span ref={sigilRef} className="got-sigil" />
            <div className="got-divider">
              <div className="got-divider-line" />
              <div className="got-divider-diamond" />
              <div className="got-divider-line right" />
            </div>
            <span ref={subtitleRef} className="got-subtitle" />
            <h1 ref={titleRef} className="got-title" />
            <p ref={bodyRef} className="got-body" />
            <div className="got-cta-row">
              <button className="got-cta-btn">Begin the Journey</button>
              <button className="got-cta-ghost">Explore the Realm</button>
            </div>
          </div>

          <div className="got-right-panel">
            <div ref={chapterLabelRef} className="got-chapter-label">01 / 06</div>
            <div className="got-vert-line" />
            <div className="got-dots">
              {CHAPTERS.map((_, i) => (
                <div
                  key={i}
                  className={`got-dot ${i === activeChapterIndex ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>

          {/* Scroll hint */}
          <div className="got-scroll-hint">
            <span>Scroll</span>
            <div className="arrow" />
          </div>

          {/* Progress bar */}
          <div className="got-progress-bar-wrap">
            <div ref={progressRef} className="got-progress-bar-fill" />
          </div>
        </div>
      </div>
    </>
  )
}

export default Hero
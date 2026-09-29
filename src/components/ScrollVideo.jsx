import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { scrollToSelector } from '../lib/smoothScroll'
import { videoSources, site } from '../config/site'

gsap.registerPlugin(ScrollTrigger)

export function ScrollVideo({ onComplete }) {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const overlayRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [canLoad, setCanLoad] = useState(false)
  const [error, setError] = useState(false)
  const reducedMotion = useReducedMotion()

  // Lazy-load the video asset only when the hero is near the viewport.
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCanLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '100px' }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  // Reduced-motion path: autoplay a short clip loop without scroll binding.
  useEffect(() => {
    const video = videoRef.current
    if (!video || !reducedMotion || !canLoad) return

    video.loop = true
    video.muted = true
    video.play().catch(() => {
      // Autoplay blocked or asset failed; poster remains visible.
    })
  }, [reducedMotion, canLoad])

  // Main scroll-driven timeline — bidirectional scrub with frame-throttled seek.
  useEffect(() => {
    if (reducedMotion || !loaded || !canLoad) return

    const video = videoRef.current
    const section = sectionRef.current
    const overlay = overlayRef.current
    if (!video || !section) return

    const duration = video.duration || 1
    const maxTime = Math.max(0, duration - 0.05)

    // Pause at the start so it is ready to be driven by scrolling.
    video.pause()
    video.currentTime = 0

    let rafId = null
    let targetTime = 0
    let lastUpdateTime = 0
    let stallFrames = 0
    const UPDATE_INTERVAL = 33 // ~30fps throttle to reduce decode load
    const SEEK_EPSILON = 0.03 // seconds — treat as settled within this
    const MAX_STALL_FRAMES = 20 // bail out if the decoder stops converging

    const updateVideo = () => {
      rafId = null
      const now = performance.now()
      const settled = Math.abs(video.currentTime - targetTime) <= SEEK_EPSILON

      if (settled || stallFrames > MAX_STALL_FRAMES) {
        stallFrames = 0
        return
      }

      if (now - lastUpdateTime < UPDATE_INTERVAL) {
        rafId = requestAnimationFrame(updateVideo)
        return
      }
      lastUpdateTime = now

      const before = video.currentTime

      if (video.readyState >= 2) {
        // Works in both directions: scrolling back up rewinds the clip.
        video.currentTime = targetTime
      }

      stallFrames = Math.abs(video.currentTime - before) < 0.001 ? stallFrames + 1 : 0

      rafId = requestAnimationFrame(updateVideo)
    }

    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=600%',
      pin: true,
      scrub: 0.35,
      onUpdate: (self) => {
        // Track progress in both directions — no forward-only ceiling.
        targetTime = Math.max(0, Math.min(self.progress * duration, maxTime))

        // Smooth overlay fade-out tied to scroll progress.
        if (overlay) {
          const p = Math.min(self.progress * 2, 1)
          overlay.style.opacity = `${1 - p}`
          overlay.style.transform = `translateY(${-40 * p}px)`
        }

        // Keep seeking until the decoder reaches the requested frame.
        if (!rafId && Math.abs(video.currentTime - targetTime) > SEEK_EPSILON) {
          rafId = requestAnimationFrame(updateVideo)
        }
      },
      onLeave: () => {
        onComplete?.(true)
        stopLoop()
      },
      onEnterBack: () => {
        onComplete?.(false)
        if (Math.abs(video.currentTime - targetTime) > SEEK_EPSILON) {
          rafId = requestAnimationFrame(updateVideo)
        }
      },
    })

    function stopLoop() {
      if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    }

    return () => {
      stopLoop()
      scrollTrigger.kill()
    }
  }, [loaded, canLoad, reducedMotion, onComplete])

  const handleLoadedMetadata = () => {
    setLoaded(true)
  }

  const handleError = () => {
    setError(true)
    setLoaded(true)
  }

  const handleAnchor = (event, href) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
    event.preventDefault()
    scrollToSelector(href)
  }

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-screen w-full overflow-hidden bg-charcoal"
      aria-label="Hero cinematic video"
    >
      {!canLoad ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${videoSources.poster})` }}
          role="img"
          aria-label="Aerial view of FLAVA Residences in Jardins de Carthage"
        />
      ) : error ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${videoSources.poster})` }}
          role="img"
          aria-label="Aerial view of FLAVA Residences in Jardins de Carthage"
        />
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
          style={{ transform: 'translateZ(0)' }}
          muted
          playsInline
          preload="auto"
          poster={videoSources.poster}
          onLoadedMetadata={handleLoadedMetadata}
          onError={handleError}
          aria-label="Aerial view of FLAVA Residences in Jardins de Carthage"
        >
          {videoSources.mp4 && <source src={videoSources.mp4} type="video/mp4" />}
          {videoSources.webm && <source src={videoSources.webm} type="video/webm" />}
        </video>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

      <div
        ref={overlayRef}
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white"
      >
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-gold sm:text-sm">
          {site.tagline}
        </p>
        <h1 className="font-serif text-5xl font-medium leading-[1.05] sm:text-7xl md:text-8xl lg:text-9xl">
          {site.title}
        </h1>
        <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-white/80 sm:text-base">
          Scroll to descend from the sky, orbit the residence, and step inside.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href="#about" onClick={(e) => handleAnchor(e, '#about')} className="btn btn-primary">
            <span>Discover FLAVA</span>
            <span className="btn-arrow" aria-hidden="true">
              ↓
            </span>
          </a>
          <a
            href="#contact"
            onClick={(e) => handleAnchor(e, '#contact')}
            className="btn btn-outline text-white"
          >
            <span>Book a viewing</span>
          </a>
        </div>
        <div className="mt-12 flex flex-col items-center gap-2 text-white/60">
          <span className="h-10 w-px animate-pulse bg-white/40" />
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        </div>
      </div>
    </section>
  )
}
import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../theme'
import { Reveal } from '../Reveal'

const DEFAULT_SLIDER_ITEMS = [
  { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', caption: 'نقل أثاث Cairo' },
  { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', caption: 'شقة جديدة' },
  { url: 'https://images.unsplash.com/photo-14c84b1521896436-2a19c22b5858?w=800', caption: 'منزل الإسكندريه' },
]

export default function HeroSection({ t, scrollTo }) {
  const th = useTheme()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [slideIdx, setSlideIdx] = useState(0)

  // Get valid slider items from CMS, fallback to defaults
  const sliderItems = (() => {
    const items = t.slider?.items
    if (items && Array.isArray(items) && items.length > 0) {
      const valid = items.filter(item => item?.url && item.url.startsWith('http'))
      if (valid.length > 0) return valid
    }
    return DEFAULT_SLIDER_ITEMS
  })()

  // Navigation functions
  const nextSlide = () => setSlideIdx((prev) => (prev + 1) % sliderItems.length)
  const prevSlide = () => setSlideIdx((prev) => (prev - 1 + sliderItems.length) % sliderItems.length)

  // Touch handling for mobile swipe
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchMove = (e) => { touchEndX.current = e.touches[0].clientX }
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide()
      else prevSlide()
    }
  }

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  // Auto-advance
  useEffect(() => {
    if (sliderItems.length <= 1) return
    const interval = setInterval(() => setSlideIdx((prev) => (prev + 1) % sliderItems.length), 5000)
    return () => clearInterval(interval)
  }, [sliderItems.length])

  return (
    <section style={{
      background: 'linear-gradient(135deg, #0a0a0a 0%, #111008 40%, #1a1200 70%, #0a0a0a 100%)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      padding: isMobile ? '3rem 0 5rem' : '2rem 0',
    }}>
      {/* Background effects */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(212, 160, 23, 0.03) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(184, 134, 11, 0.03) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: isMobile ? 200 : 500, height: isMobile ? 200 : 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212, 160, 23, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: isMobile ? 150 : 350, height: isMobile ? 150 : 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(184, 134, 11, 0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: isMobile ? '6rem 1rem 10rem' : '2rem 1.5rem 4rem',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? 20 : 40,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
        width: '100%',
        flex: 1,
        alignSelf: 'center',
      }}>
        {/* Text Content */}
        <div style={{ position: 'relative', order: isMobile ? 2 : 1 }}>
          <Reveal>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: 'rgba(212,160,23,0.12)', border: '1px solid rgba(212,160,23,0.35)', color: '#f5c842', fontSize: 11, fontWeight: 600, marginBottom: 16 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#D4A017', display: 'inline-block', animation: 'blink 2s infinite', boxShadow: '0 0 4px #D4A017' }} />
              {t.hero.badge}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1 style={{ fontSize: isMobile ? '1.8rem' : 'clamp(2.2rem, 4.5vw, 3.2rem)', fontWeight: 800, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.5px', marginBottom: 4 }}>{t.hero.headline.split('\n')[0]}</h1>
            <h1 style={{ fontSize: isMobile ? '1.8rem' : 'clamp(2.2rem, 4.5vw, 3.2rem)', fontWeight: 800, background: 'linear-gradient(90deg, #D4A017, #f5c842, #B8860B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.15, letterSpacing: '-0.5px', marginBottom: 20 }}>{t.hero.headline.split('\n')[1]}</h1>
          </Reveal>

          <Reveal delay={200}>
            <p style={{ color: '#94a3b8', fontSize: isMobile ? 14 : 16, lineHeight: 1.6, marginBottom: 24, maxWidth: 480 }}>{t.hero.sub}</p>
          </Reveal>

          <Reveal delay={300}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <button onClick={() => scrollTo('contact')} style={{ padding: isMobile ? '12px 28px' : '14px 36px', borderRadius: 12, background: 'linear-gradient(135deg, #D4A017, #B8860B)', color: '#000', fontSize: isMobile ? 14 : 16, fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 6px 24px rgba(212,160,23,0.5)' }}>
                {t.hero.cta}
              </button>
              <a href={`tel:${t.footer?.phone1 || ''}`} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#3b82f6', fontSize: 12, fontWeight: 600, textDecoration: 'none', padding: '10px 16px', borderRadius: 10, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                اتصل الآن
              </a>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div style={{ display: 'flex', gap: isMobile ? 16 : 32, marginTop: isMobile ? 20 : 36, paddingTop: isMobile ? 16 : 24, borderTop: '1px solid rgba(212,160,23,0.15)', flexWrap: 'wrap' }}>
              {t.hero.stats.map(([v, l], i) => (
                <div key={i} style={{ flex: '1 1 33%', textAlign: 'center', padding: '8px 0' }}>
                  <div style={{ fontSize: isMobile ? 18 : 24, fontWeight: 800, background: 'linear-gradient(135deg, #f5c842, #D4A017)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 4 }}>{v}</div>
                  <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Slider / Image */}
        <div style={{ position: 'relative', order: isMobile ? 1 : 2, direction: 'ltr' }}>
          <div style={{
            position: 'relative',
            width: '100%',
            height: isMobile ? 300 : 380,
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
            border: '1px solid rgba(212,160,23,0.2)',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          >
            {/* Slides - using transform for sliding effect */}
            <div style={{
              display: 'flex',
              width: `${sliderItems.length * 100}%`,
              height: '100%',
              transform: `translateX(-${slideIdx * (100 / sliderItems.length)}%)`,
              transition: 'transform 0.5s ease-in-out',
            }}>
              {sliderItems.map((img, i) => (
                <div key={i} style={{ width: `${100 / sliderItems.length}%`, height: '100%', flexShrink: 0 }}>
                  <img src={img.url} alt={img.caption || 'صورة'} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>

            {/* Navigation buttons */}
            {sliderItems.length > 1 && (
              <>
                <button onClick={prevSlide} style={{ position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)', width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', fontSize: 20, fontWeight: 700, cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
                <button onClick={nextSlide} style={{ position: 'absolute', top: '50%', right: 10, transform: 'translateY(-50%)', width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', fontSize: 20, fontWeight: 700, cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
                
                {/* Pagination dots */}
                <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, padding: '6px 12px', background: 'rgba(0,0,0,0.5)', borderRadius: 20, zIndex: 10 }}>
                  {sliderItems.map((_, i) => (
                    <div key={i} onClick={() => setSlideIdx(i)} style={{ width: slideIdx === i ? 16 : 8, height: 8, borderRadius: 10, background: slideIdx === i ? '#D4A017' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.3s' }} />
                  ))}
                </div>
              </>
            )}

            {/* Desktop overlay gradient */}
            {!isMobile && sliderItems.length > 0 && (
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </section>
  )
}
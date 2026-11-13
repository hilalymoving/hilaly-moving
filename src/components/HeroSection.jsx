import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../theme'
import Image from './Image'

const DEFAULT_SLIDER_ITEMS = [
  { url: 'https://res.cloudinary.com/dxvoir9oy/image/upload/v1778070015/hilaly-moving/gallery/v4kh2z8x8c9hirandkw9.jpg', caption: 'شركة الهلالى لنقل وتغليف الاثاث' },
  { url: 'https://res.cloudinary.com/dxvoir9oy/image/upload/v1778070020/hilaly-moving/gallery/qozcmv3ux1dgvyaws9bi.jpg', caption: 'خدمات نقل متكاملة' },
  { url: 'https://res.cloudinary.com/dxvoir9oy/image/upload/v1778070024/hilaly-moving/gallery/s0wubmfhvxv0epwo7ol1.jpg', caption: 'سيارات نقل مجهزة' },
  { url: 'https://res.cloudinary.com/dxvoir9oy/image/upload/v1781709082/hilaly-moving/gallery/fubw3xzxaj3go0v5vtwp.jpg', caption: 'تغليف احترافي للأثاث' },
]

export default function HeroSection({ t, scrollTo }) {
  const th = useTheme()
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

  // Auto-advance
  useEffect(() => {
    if (sliderItems.length <= 1) return
    const interval = setInterval(() => setSlideIdx((prev) => (prev + 1) % sliderItems.length), 6000)
    return () => clearInterval(interval)
  }, [sliderItems.length])

  return (
    <section className="hero-section">
      <style>{`
        .hero-section {
          background: linear-gradient(135deg, #0a0a0a 0%, #111008 40%, #1a1200 70%, #0a0a0a 100%);
          min-height: 90vh;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          padding: 2rem 0;
        }
        .hero-grid {
          max-width: 1100px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
          width: 100%;
          flex: 1;
        }
        .hero-text-col {
          position: relative;
          order: 1;
        }
        .hero-slider-col {
          position: relative;
          order: 2;
          direction: ltr;
        }
        .hero-slider-box {
          position: relative;
          width: 100%;
          height: 380px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 16px 48px rgba(0,0,0,0.5);
          border: 1px solid rgba(212,160,23,0.2);
        }
        .hero-h1 {
          font-size: clamp(2.2rem, 4.5vw, 3.2rem);
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.5px;
        }
        .hero-sub {
          color: #94a3b8;
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 24px;
          max-width: 480px;
        }
        .hero-btn-cta {
          padding: 14px 36px;
          border-radius: 12px;
          background: linear-gradient(135deg, #D4A017, #B8860B);
          color: #000;
          font-size: 16px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          box-shadow: 0 6px 24px rgba(212,160,23,0.5);
        }
        .hero-stats-row {
          display: flex;
          gap: 32px;
          margin-top: 36px;
          padding-top: 24px;
          border-top: 1px solid rgba(212,160,23,0.15);
          flex-wrap: wrap;
        }
        .hero-stat-val {
          font-size: 24px;
          font-weight: 800;
          background: linear-gradient(135deg, #f5c842, #D4A017);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 4px;
        }
        @media (max-width: 768px) {
          .hero-section {
            padding: 1rem 0 3rem;
            min-height: auto;
          }
          .hero-grid {
            display: flex;
            flex-direction: column;
            padding: 1rem 1rem 2.5rem;
            gap: 20px;
          }
          .hero-text-col {
            order: 2;
          }
          .hero-slider-col {
            order: 1;
            width: 100%;
          }
          .hero-slider-box {
            height: 260px;
            border-radius: 16px;
          }
          .hero-h1 {
            font-size: 1.85rem;
          }
          .hero-sub {
            font-size: 14px;
          }
          .hero-btn-cta {
            padding: 12px 28px;
            font-size: 14px;
          }
          .hero-stats-row {
            gap: 16px;
            margin-top: 20px;
            padding-top: 16px;
          }
          .hero-stat-val {
            font-size: 19px;
          }
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>

      {/* Background effects */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(212, 160, 23, 0.03) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(184, 134, 11, 0.03) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212, 160, 23, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(184, 134, 11, 0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="hero-grid">
        {/* Text Content - Instant static render for 0 CLS and rapid LCP */}
        <div className="hero-text-col">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: 'rgba(212,160,23,0.12)', border: '1px solid rgba(212,160,23,0.35)', color: '#f5c842', fontSize: 11, fontWeight: 600, marginBottom: 16 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#D4A017', display: 'inline-block', animation: 'blink 2s infinite', boxShadow: '0 0 4px #D4A017' }} />
            {t.hero.badge}
          </div>

          <div>
            <h1 className="hero-h1" style={{ color: '#fff', marginBottom: 4 }}>
              {t.hero.headline.split('\n')[0]}
            </h1>
            <h1 className="hero-h1" style={{ background: 'linear-gradient(90deg, #D4A017, #f5c842, #B8860B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 20 }}>
              {t.hero.headline.split('\n')[1]}
            </h1>
          </div>

          <p className="hero-sub">{t.hero.sub}</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => scrollTo('contact')} className="hero-btn-cta">
              {t.hero.cta}
            </button>
            <a href={`tel:${t.footer?.phone1 || '+201012345678'}`} aria-label="اتصل هاتفياً بشركة الهلالي لنقل الاثاث" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#93c5fd', fontSize: 13, fontWeight: 700, textDecoration: 'none', padding: '12px 18px', borderRadius: 10, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.35)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              📞 اتصل للحجز
            </a>
          </div>

          <div className="hero-stats-row">
            {t.hero.stats.map(([v, l], i) => (
              <div key={i} style={{ flex: '1 1 30%', textAlign: 'center', padding: '6px 0' }}>
                <div className="hero-stat-val">{v}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Slider / Image */}
        <div className="hero-slider-col">
          <div
            className="hero-slider-box"
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
                <div key={i} style={{ width: `${100 / sliderItems.length}%`, height: '100%', flexShrink: 0, position: 'relative' }}>
                  <Image
                    src={img.url}
                    alt={img.caption || 'شركة الهلالى لنقل وتغليف الاثاث'}
                    width={1200}
                    height={675}
                    priority={i === 0}
                    sizes="(max-width: 768px) 100vw, 600px"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>

            {/* Navigation buttons */}
            {sliderItems.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  aria-label="الشريحة السابقة"
                  style={{
                    position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)',
                    width: 44, height: 44, borderRadius: '50%', background: 'rgba(0,0,0,0.6)',
                    color: '#fff', border: 'none', fontSize: 24, fontWeight: 700,
                    cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  ‹
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="الشريحة التالية"
                  style={{
                    position: 'absolute', top: '50%', right: 10, transform: 'translateY(-50%)',
                    width: 44, height: 44, borderRadius: '50%', background: 'rgba(0,0,0,0.6)',
                    color: '#fff', border: 'none', fontSize: 24, fontWeight: 700,
                    cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  ›
                </button>
                
                {/* Pagination dots with 44px accessible touch targets */}
                <div style={{
                  position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
                  display: 'flex', alignItems: 'center', gap: 2, padding: '2px 8px',
                  background: 'rgba(0,0,0,0.6)', borderRadius: 24, zIndex: 10,
                }}>
                  {sliderItems.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSlideIdx(i)}
                      aria-label={`انتقال إلى الشريحة ${i + 1}`}
                      aria-current={slideIdx === i ? 'true' : undefined}
                      style={{
                        minWidth: 44, minHeight: 44, padding: 0,
                        background: 'transparent', border: 'none',
                        cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <span
                        style={{
                          width: slideIdx === i ? 20 : 8,
                          height: 8,
                          borderRadius: 99,
                          background: slideIdx === i ? '#D4A017' : 'rgba(255,255,255,0.5)',
                          display: 'block',
                          transition: 'background-color 0.2s, opacity 0.2s',
                        }}
                      />
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Overlay gradient */}
            {sliderItems.length > 0 && (
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', pointerEvents: 'none' }} />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

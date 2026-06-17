import { Helmet } from 'react-helmet-async'
import { useOutletContext } from 'react-router-dom'
import { Reveal } from '../Reveal'
import BookingForm from '../components/BookingForm'

export default function Services() {
  const { t, th } = useOutletContext()

  const services = t.services?.items || []

  return (
    <div>
      <Helmet>
        <title>خدمات نقل الأثاث - هلالي موفينج | فك، تركيب، تغليف، تخزين | القاهرة والإسكندرية</title>
        <meta name="description" content="خدمات نقل أثاث في القاهرة، مدينة نصر، مصر الجديدة، التجمع الخامس، الشيخ زايد، 6 أكتوبر، والإسكندرية. نقل من الباب للباب، تعبئة وتغليف احترافي، فك وتركيب، تخزين آمن. احجز الآن!" />
        <link rel="canonical" href="https://helalymoving.tryasp.net/services" />
      </Helmet>
      {/* Hero */}
      <div style={{ background: th.heroGradient || `linear-gradient(135deg, #0f172a, #1e1b4b)`, padding: 'clamp(3rem,8vw,5rem) 1.2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 900, color: '#fff', marginBottom: 16 }}>
          {t.services?.title || 'خدماتنا'}
        </h1>
        <p style={{ fontSize: 'clamp(14px,2vw,18px)', color: '#94a3b8', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
          {t.services?.sub || 'حلول نقل شاملة من الألف إلى الياء'}
        </p>
      </div>

      {/* Services Grid with Images */}
      <div style={{ padding: 'clamp(3rem,8vw,5rem) 1.2rem', background: th.bg, maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))', gap: 24 }}>
          {services.map((s, i) => (
            <Reveal key={i} delay={i * 100}>
              <div style={{ background: th.bgCard, borderRadius: 20, border: `1px solid ${th.border}`, boxShadow: th.shadow, overflow: 'hidden', transition: 'transform .3s, box-shadow .3s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.15)` }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = th.shadow }}>
                {s.image && (
                  <div style={{ width: '100%', height: 200, overflow: 'hidden' }}>
                    <img src={s.image} alt={s.title} loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                  </div>
                )}
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{s.icon}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, color: th.text }}>{s.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: th.textMuted }}>{s.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <BookingForm t={t} lang="ar" />
    </div>
  )
}

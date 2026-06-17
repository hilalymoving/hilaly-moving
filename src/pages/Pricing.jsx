import { Helmet } from 'react-helmet-async'
import { useOutletContext } from 'react-router-dom'
import { Reveal } from '../Reveal'
import BookingForm from '../components/BookingForm'

export default function Pricing() {
  const { t, th } = useOutletContext()

  const factors = t.pricing?.factors || []
  const offers = t.offers?.items || []

  return (
    <div>
      <Helmet>
        <title>أسعار نقل الأثاث في مصر - هلالي موفينج | عروض وخصم 15%</title>
        <meta name="description" content="أسعار نقل الأثاث في القاهرة، الإسكندرية، وجميع المحافظات. باقات تبدأ من 800 ج.م للاستوديو و 2500 ج.م للعائلة. شفافية تامة بدون رسوم مخفية. احصل على عرض سعر مجاني." />
        <link rel="canonical" href="https://helalymoving.tryasp.net/pricing" />
      </Helmet>
      <div style={{ background: th.heroGradient || `linear-gradient(135deg, #0f172a, #1e1b4b)`, padding: 'clamp(3rem,8vw,5rem) 1.2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 900, color: '#fff', marginBottom: 16 }}>الأسعار</h1>
        <p style={{ fontSize: 'clamp(14px,2vw,18px)', color: '#94a3b8', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
          {t.pricing?.sub || 'شفافية تامة. بدون رسوم مخفية.'}
        </p>
      </div>

      <div style={{ padding: 'clamp(3rem,8vw,5rem) 1.2rem', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(20px,2.5vw,28px)', fontWeight: 900, textAlign: 'center', marginBottom: 32, color: th.text }}>العروض الحالية</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 20, marginBottom: 48 }}>
          {offers.map((o, i) => {
            const isPopular = i === 1
            return (
              <Reveal key={i} delay={i * 100}>
                <div style={{ background: th.bgCard, borderRadius: 24, border: `2px solid ${isPopular ? o.color : th.border}`, overflow: 'hidden', boxShadow: isPopular ? `0 20px 60px ${o.color}33` : th.shadow, position: 'relative' }}>
                  {isPopular && <div style={{ position: 'absolute', top: 12, left: -28, background: o.color, color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 36px', transform: 'rotate(-45deg)', letterSpacing: 1 }}>الأفضل</div>}
                  <div style={{ height: 6, background: `linear-gradient(90deg, ${o.color}, ${o.color}99)` }} />
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: o.color, marginBottom: 8 }}>{o.badge}</div>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: th.text, marginBottom: 4 }}>{o.title}</h3>
                    <div style={{ fontSize: 28, fontWeight: 900, color: th.accent, marginBottom: 8 }}>{o.price}</div>
                    <p style={{ fontSize: 13, color: th.textMuted, lineHeight: 1.6, marginBottom: 16 }}>{o.desc}</p>
                    {o.features?.map((f, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: th.text, marginBottom: 6 }}>
                        <span style={{ color: '#10b981' }}>✓</span> {f}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>

        <h2 style={{ fontSize: 'clamp(20px,2.5vw,28px)', fontWeight: 900, textAlign: 'center', marginBottom: 32, color: th.text }}>كيف نسعّر؟</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,250px),1fr))', gap: 16 }}>
          {factors.map((f, i) => (
            <Reveal key={i} delay={i * 80}>
              <div style={{ background: th.bgCard, borderRadius: 20, padding: '1.5rem', border: `1px solid ${th.border}` }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{f.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: th.text, marginBottom: 4 }}>{f.label}</h3>
                <p style={{ fontSize: 12, color: th.textMuted }}>{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <BookingForm t={t} lang="ar" />
    </div>
  )
}

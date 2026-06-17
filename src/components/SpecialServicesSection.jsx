import { useTheme } from '../theme'
import { Reveal } from '../Reveal'
import SectionHeader from './SectionHeader'

export default function SpecialServicesSection({ t }) {
  const th = useTheme()
  const items = t.specialServices?.items || []
  if (!items.length) return null

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section style={{
      padding: 'clamp(3rem,8vw,6rem) 1.2rem',
      background: 'linear-gradient(135deg,#0a0a0a 0%,#111008 50%,#0a0a0a 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Gold dot grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(212,160,23,0.07) 1px, transparent 1px)', backgroundSize: '36px 36px', pointerEvents: 'none' }} />
      {/* Glow */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,160,23,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(28px,6vw,52px)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, background: 'rgba(212,160,23,0.12)', border: '1px solid rgba(212,160,23,0.3)', color: '#f5c842', fontSize: 12, fontWeight: 700, marginBottom: 16 }}>
              ✦ {t.specialServices?.sub || ''}
            </div>
            <h2 style={{ fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 900, color: '#fff', letterSpacing: '-.5px' }}>
              {t.specialServices?.title || ''}
            </h2>
          </div>
        </Reveal>

        {/* Cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,240px),1fr))', gap: 16 }}>
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 100}>
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(212,160,23,0.2)',
                borderRadius: 20, padding: 'clamp(18px,3vw,28px)',
                position: 'relative', overflow: 'hidden',
                transition: 'all .3s', cursor: 'default',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(212,160,23,0.07)'
                  e.currentTarget.style.borderColor = 'rgba(212,160,23,0.5)'
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(212,160,23,0.15)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                  e.currentTarget.style.borderColor = 'rgba(212,160,23,0.2)'
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* Corner glow */}
                <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,160,23,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

                {/* Tag */}
                {item.tag && (
                  <div style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 99, background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.3)', color: '#D4A017', fontSize: 10, fontWeight: 800, marginBottom: 14, letterSpacing: .5 }}>
                    {item.tag}
                  </div>
                )}

                {/* Icon */}
                <div style={{ fontSize: 'clamp(32px,5vw,44px)', marginBottom: 14, lineHeight: 1 }}>{item.icon}</div>

                {/* Title */}
                <h3 style={{ fontSize: 'clamp(15px,3vw,18px)', fontWeight: 900, color: '#fff', marginBottom: 10 }}>{item.title}</h3>

                {/* Desc */}
                <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.75, marginBottom: 18 }}>{item.desc}</p>

                {/* CTA */}
                <button onClick={() => scrollTo('contact')} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 10,
                  background: 'transparent', border: '1px solid rgba(212,160,23,0.4)',
                  color: '#D4A017', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  transition: 'all .2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,160,23,0.15)'; e.currentTarget.style.borderColor = '#D4A017' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(212,160,23,0.4)' }}
                >
                  احجز الآن
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

import { useState } from 'react'
import { useTheme } from '../theme'
import { Reveal } from '../Reveal'
import SectionHeader from './SectionHeader'

export default function FAQSection({ t }) {
  const th = useTheme()
  const [open, setOpen] = useState(null)

  if (!t?.faq) return null

  const toggle = i => setOpen(open === i ? null : i)

  return (
    <section style={{ padding: 'clamp(3rem,8vw,6rem) 1.2rem', background: th.bg }}>
      {/* Dynamic FAQ JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": t.faq.items.map(item => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": { "@type": "Answer", "text": item.a }
          }))
        }, null, 2)
      }} />
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <SectionHeader title={t.faq.title} sub={t.faq.sub} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {t.faq.items.map((item, i) => {
            const isOpen = open === i
            return (
              <Reveal key={i} delay={Math.min(i * 30, 300)}>
                <div style={{
                  background: th.bgCard,
                  border: `1px solid ${isOpen ? th.accent : th.border}`,
                  borderRadius: 14,
                  overflow: 'hidden',
                  boxShadow: isOpen ? `0 0 0 1px ${th.accent}33, ${th.shadowSm}` : th.shadowSm,
                  transition: 'border-color .25s, box-shadow .25s',
                }}>
                  <button onClick={() => toggle(i)} style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: 'clamp(14px,3vw,18px) clamp(14px,3vw,22px)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    textAlign: 'right', gap: 12,
                  }}>
                    <span style={{ fontSize: 'clamp(13px,3vw,15px)', fontWeight: 700, color: isOpen ? th.accent : th.text, lineHeight: 1.5, flex: 1, transition: 'color .2s' }}>
                      {item.q}
                    </span>
                    <span style={{
                      width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                      background: isOpen ? th.accent : th.accentLight,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all .25s',
                    }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke={isOpen ? '#000' : th.accentText}
                        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .25s' }}>
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </button>

                  <div style={{ maxHeight: isOpen ? 300 : 0, overflow: 'hidden', transition: 'max-height .35s ease' }}>
                    <div style={{ padding: 'clamp(10px,3vw,16px) clamp(14px,3vw,22px) clamp(14px,3vw,20px)', borderTop: `1px solid ${th.border}` }}>
                      <p style={{ color: th.textMuted, fontSize: 'clamp(13px,3vw,14px)', lineHeight: 1.8, margin: 0 }}>
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

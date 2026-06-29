import { useState, useEffect } from 'react'
import { useTheme } from '../theme'
import { Reveal } from '../Reveal'
import SectionHeader from './SectionHeader'

const mob = typeof window !== 'undefined' && window.innerWidth < 640

/* ── OFFERS ─────────────────────────────────────────────────────────────── */
export function OffersSection({ t }) {
  const th = useTheme()

  const icons = ['🏠', '👨‍👩‍👧‍👦', '🏰']

  return (
    <section id="offers" style={{ padding: 'clamp(3rem,8vw,6rem) 1.2rem', background: th.bgSection, position: 'relative', overflow: 'hidden' }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, ${th.accent}0a 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SectionHeader title={t.offers.title} sub={t.offers.sub} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 20 }}>
          {t.offers.items.map((o, i) => {
            const isPopular = i === 1
            const featureList = Array.isArray(o.features) ? o.features : []
            return (
              <Reveal key={i} delay={i * 120}>
                <div style={{
                  background: th.bgCard,
                  borderRadius: 24,
                  border: `2px solid ${isPopular ? o.color : th.border}`,
                  overflow: 'hidden',
                  boxShadow: isPopular ? `0 20px 60px ${o.color}33` : th.shadow,
                  transition: 'transform .3s, box-shadow .3s',
                  position: 'relative',
                  display: 'flex', flexDirection: 'column',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = `0 32px 80px ${o.color}44` }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = isPopular ? `0 20px 60px ${o.color}33` : th.shadow }}
                >
                  {/* Popular ribbon */}
                  {isPopular && (
                    <div style={{ position: 'absolute', top: 16, left: -28, background: o.color, color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 36px', transform: 'rotate(45deg)', letterSpacing: 1 }}>
                      الأفضل
                    </div>
                  )}

                  {/* Top color bar */}
                  <div style={{ height: 6, background: `linear-gradient(90deg, ${o.color}, ${o.color}99)` }} />

                  {/* Header */}
                  <div style={{ padding: '24px 24px 16px', borderBottom: `1px solid ${th.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ display: 'inline-block', padding: '5px 14px', borderRadius: 99, background: `${o.color}22`, color: o.color, fontSize: 11, fontWeight: 800, border: `1px solid ${o.color}44` }}>{o.badge}</span>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: `${o.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                        {icons[i] || '📦'}
                      </div>
                    </div>
                    <h3 style={{ fontSize: 'clamp(17px,3.5vw,21px)', fontWeight: 900, color: th.text, marginBottom: 6 }}>{o.title}</h3>
                    <p style={{ color: th.textMuted, fontSize: 13, lineHeight: 1.6 }}>{o.desc}</p>
                  </div>

                  {/* Price */}
                  <div style={{ padding: '16px 24px', background: `${o.color}0d`, borderBottom: `1px solid ${th.border}` }}>
                    <div style={{ fontSize: 'clamp(22px,4vw,28px)', fontWeight: 900, color: o.color }}>{o.price}</div>
                    <div style={{ fontSize: 11, color: th.textMuted, marginTop: 2 }}>شامل الضريبة • بدون رسوم خفية</div>
                  </div>

                  {/* Features list from CMS */}
                  {featureList.length > 0 && (
                    <div style={{ padding: '16px 24px', flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: th.textMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>ما يشمله العرض</div>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {featureList.map((feat, fi) => (
                          <li key={fi} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: th.text }}>
                            <span style={{ width: 18, height: 18, borderRadius: '50%', background: `${o.color}22`, border: `1px solid ${o.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6l3 3 5-5" stroke={o.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </span>
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/* CTA */}
                  <div style={{ padding: '16px 24px 24px' }}>
                    <a href="#contact" onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }} style={{
                      display: 'block', textAlign: 'center',
                      padding: '12px', borderRadius: 12,
                      background: isPopular ? o.color : 'transparent',
                      color: isPopular ? '#fff' : o.color,
                      border: `2px solid ${o.color}`,
                      fontWeight: 800, fontSize: 14, textDecoration: 'none',
                      transition: 'all .2s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = o.color; e.currentTarget.style.color = '#fff' }}
                      onMouseLeave={e => { e.currentTarget.style.background = isPopular ? o.color : 'transparent'; e.currentTarget.style.color = isPopular ? '#fff' : o.color }}
                    >
                      احجز هذه الباقة
                    </a>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>

        {/* Bottom trust note */}
        <Reveal delay={400}>
          <div style={{ textAlign: 'center', marginTop: 36, display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
            {[['🛡️', 'ضمان استرداد المال'], ['📞', 'دعم على مدار الساعة'], ['⚡', 'حجز فوري خلال دقائق']].map(([icon, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, color: th.textMuted, fontSize: 13, fontWeight: 600 }}>
                <span>{icon}</span>{label}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ── SERVICES ────────────────────────────────────────────────────────────── */
export function ServicesSection({ t }) {
  const th = useTheme()

  const COLORS = ['#D4A017', '#10b981', '#6366f1', '#f59e0b', '#e11d48', '#0ea5e9']

  return (
    <section id="services" style={{ padding: 'clamp(3rem,8vw,6rem) 1.2rem', background: th.bg, position: 'relative', overflow: 'hidden' }}>
      {/* AEO: Service schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": t.services.title,
          "description": t.services.sub,
          "provider": { "@type": "MovingCompany", "name": "هلالي موفينج" },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "خدمات نقل الأثاث",
            "itemListElement": t.services.items.map((s) => ({
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": s.title,
                "description": s.desc,
              },
            })),
          },
        }, null, 2)
      }} />
      {/* Decorative background */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle, ${th.accent}08 1px, transparent 1px)`, backgroundSize: '32px 32px', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SectionHeader title={t.services.title} sub={t.services.sub} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 20 }}>
          {t.services.items.map((s, i) => {
            const color = COLORS[i % COLORS.length]
            const points = s.features || []
            return (
              <Reveal key={i} delay={i * 100} style={{ height: '100%' }}>
                <div style={{
                  background: th.bgCard, borderRadius: 22,
                  border: `1px solid ${th.border}`,
                  overflow: 'hidden',
                  boxShadow: th.shadowSm,
                  transition: 'all .3s',
                  display: 'flex', flexDirection: 'column',
                  height: '100%',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 16px 48px ${color}28, 0 0 0 1px ${color}33` ; e.currentTarget.style.transform = 'translateY(-6px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = th.border; e.currentTarget.style.boxShadow = th.shadowSm; e.currentTarget.style.transform = 'none' }}
                >
                  {/* Service image */}
                  {s.image && (
                    <div style={{ width: '100%', height: 180, overflow: 'hidden', flexShrink: 0 }}>
                      <img src={s.image} alt={s.title} loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                    </div>
                  )}

                  {/* Header with icon */}
                  <div style={{ padding: '22px 22px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 14,
                        background: `${color}18`,
                        border: `1.5px solid ${color}33`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 24,
                      }}>
                        {s.icon}
                      </div>
                    </div>

                    <h3 style={{ fontSize: 'clamp(15px,3.5vw,18px)', fontWeight: 900, color: th.text, marginBottom: 8 }}>{s.title}</h3>
                    <p style={{ color: th.textMuted, fontSize: 13, lineHeight: 1.7 }}>{s.desc}</p>
                  </div>

                  {/* Divider */}
                  <div style={{ height: 1, background: `linear-gradient(90deg, ${color}44, transparent)`, margin: '0 22px' }} />

                  {/* Feature points */}
                  <div style={{ padding: '14px 22px 22px', flex: 1 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: th.textMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>يشمل الخدمة</div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {points.map((pt, pi) => (
                        <li key={pi} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: th.text }}>
                          <span style={{
                            width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                            background: `${color}20`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6l3 3 5-5" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom accent line */}
                  <div style={{ height: 3, background: `linear-gradient(90deg, ${color}, ${color}44)` }} />
                </div>
              </Reveal>
            )
          })}
        </div>

        {/* Bottom CTA banner */}
        <Reveal delay={450}>
          <div style={{
            marginTop: 40, borderRadius: 20, padding: 'clamp(20px,4vw,32px)',
            background: `linear-gradient(135deg, #111008, #1a1200)`,
            border: `1px solid ${th.accent}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 16,
          }}>
            <div>
              <div style={{ fontSize: 'clamp(15px,3vw,18px)', fontWeight: 900, color: '#fff', marginBottom: 4 }}>هل تحتاج خدمة مخصصة؟</div>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>تواصل معنا وسنصمم لك باقة تناسب احتياجاتك تماماً</div>
            </div>
            <a href="#contact" onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }} style={{
              padding: '12px 28px', borderRadius: 12,
              background: `linear-gradient(135deg, #D4A017, #B8860B)`,
              color: '#000', fontWeight: 800, fontSize: 14,
              textDecoration: 'none', whiteSpace: 'nowrap',
              boxShadow: '0 8px 24px rgba(212,160,23,0.35)',
            }}>
              احصل على عرض مخصص
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ── PRICING ─────────────────────────────────────────────────────────────── */
export function PricingSection({ t }) {
  const th = useTheme()

  const details = [
    { example: 'القاهرة → الإسكندرية، المنصورة، أسيوط وأكثر', note: 'يُحسب بالكيلومتر مع معامل المنطقة' },
    { example: 'الدور الثالث بدون مصعد يحتاج فريق أكبر', note: 'المصعد المتاح = وقت أقل وجهد أقل' },
    { example: 'شقة ٣ غرف تختلف عن استوديو أو فيلا', note: 'كلما زادت القطع زاد الوقت والفريق' },
    { example: 'تغليف، فك وتركيب، تخزين — كل خدمة منفصلة', note: 'اختر ما تحتاجه فقط' },
    { example: 'الحجز المبكر يضمن أفضل موعد وأولوية', note: 'العطلات والأعياد تحتاج حجزاً مسبقاً' },
    { example: 'تغطي أي ضرر محتمل أثناء النقل', note: 'راحة بال كاملة لمقتنياتك' },
  ]

  return (
    <section style={{ padding: 'clamp(3rem,8vw,6rem) 1.2rem', background: th.bgSection, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${th.accent}, ${th.accent}44, transparent)` }} />

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionHeader title={t.pricing.title} sub={t.pricing.sub} />

        {/* Factor cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 16, marginBottom: 40 }}>
          {t.pricing.factors.map((f, i) => (
            <Reveal key={i} delay={i * 80}>
              <div style={{
                background: th.bgCard, borderRadius: 20,
                border: `1px solid ${th.border}`,
                padding: 'clamp(18px,3vw,26px)',
                boxShadow: th.shadowSm,
                transition: 'all .3s',
                display: 'flex', gap: 16, alignItems: 'flex-start',
                position: 'relative', overflow: 'hidden',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = th.accent; e.currentTarget.style.boxShadow = `0 12px 36px ${th.accent}22` }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = th.border; e.currentTarget.style.boxShadow = th.shadowSm }}
              >
                {/* Subtle bg number */}
                <div style={{ position: 'absolute', bottom: -10, left: 12, fontSize: 72, fontWeight: 900, color: th.accent, opacity: 0.06, lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>{i + 1}</div>

                {/* Icon box */}
                <div style={{ width: 52, height: 52, borderRadius: 15, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, boxShadow: `0 4px 12px ${f.bg}` }}>
                  {f.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <div style={{ fontWeight: 900, fontSize: 15, color: th.text }}>{f.label}</div>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: `linear-gradient(135deg,#D4A017,#B8860B)`, color: '#000', fontSize: 10, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                  </div>
                  <div style={{ fontSize: 13, color: th.textMuted, lineHeight: 1.6, marginBottom: 10 }}>{f.desc}</div>
                  {/* Example */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 8, background: `${th.accent}12`, border: `1px solid ${th.accent}25` }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={th.accent} strokeWidth="2.5" strokeLinecap="round"><path d="M12 2v20M2 12h20"/></svg>
                    <span style={{ fontSize: 11, color: th.accent, fontWeight: 700 }}>{details[i].example}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* How it works row */}
        <Reveal delay={200}>
          <div style={{
            background: th.bgCard, borderRadius: 22,
            border: `1px solid ${th.border}`,
            padding: 'clamp(20px,4vw,32px)',
            boxShadow: th.shadowSm,
            marginBottom: 24,
          }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: th.text, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>🧮</span> كيف نحسب السعر النهائي؟
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,200px),1fr))', gap: 12 }}>
              {[
                { step: '١', title: 'تحديد المسافة', desc: 'نحسب المسافة بين العنوانين ونضرب في سعر الكيلومتر حسب المنطقة' },
                { step: '٢', title: 'تقييم الحجم', desc: 'نحدد عدد الغرف والقطع لتحديد حجم الشاحنة المطلوبة وعدد أفراد الفريق' },
                { step: '٣', title: 'إضافة الخدمات', desc: 'نضيف تكلفة أي خدمات إضافية كالتغليف والفك والتركيب والتخزين' },
                { step: '٤', title: 'العرض النهائي', desc: 'نرسل لك عرضاً شاملاً وشفافاً عبر واتساب خلال دقائق بدون أي رسوم مخفية' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg, #D4A017, #B8860B)`, color: '#000', fontSize: 13, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{item.step}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: th.text, marginBottom: 3 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: th.textMuted, lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Guarantee strip */}
        <Reveal delay={300}>
          <div style={{
            borderRadius: 16, padding: 'clamp(14px,3vw,20px) clamp(16px,4vw,28px)',
            background: `linear-gradient(135deg, #111008, #1a1200)`,
            border: `1px solid ${th.accent}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 12,
          }}>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {[['✅', 'لا رسوم خفية'], ['📋', 'عرض مكتوب مسبقاً'], ['🔒', 'سعر مثبت بعد الاتفاق'], ['💬', 'دفع بعد التسليم']].map(([icon, label]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>
                  <span>{icon}</span>{label}
                </div>
              ))}
            </div>
            <a href="#contact" onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }} style={{
              padding: '10px 22px', borderRadius: 10,
              background: `linear-gradient(135deg, #D4A017, #B8860B)`,
              color: '#000', fontWeight: 800, fontSize: 13,
              textDecoration: 'none', whiteSpace: 'nowrap',
            }}>
              احسب سعرك الآن
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ── GALLERY ─────────────────────────────────────────────────────────────── */
export function GallerySection({ t }) {
  const th = useTheme()
  const [lb, setLb] = useState(null)
  const [lbIdx, setLbIdx] = useState(0)
  const [hovered, setHovered] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  const openLb = (img, idx) => { setLb(img); setLbIdx(idx) }
  const prev = () => { const i = (lbIdx - 1 + t.gallery.items.length) % t.gallery.items.length; setLb(t.gallery.items[i]); setLbIdx(i) }
  const next = () => { const i = (lbIdx + 1) % t.gallery.items.length; setLb(t.gallery.items[i]); setLbIdx(i) }

  const items = t.gallery.items

  return (
    <section id="gallery" style={{ padding: 'clamp(3rem,8vw,6rem) 1.2rem', background: th.bg, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, right: 0, left: 0, height: 4, background: `linear-gradient(90deg, transparent, ${th.accent}, transparent)` }} />

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionHeader title={t.gallery.title} sub={t.gallery.sub} />

        {/* Stats bar */}
        <Reveal>
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 'clamp(16px,4vw,48px)',
            flexWrap: 'wrap', marginBottom: 32,
            padding: 'clamp(12px,3vw,18px) clamp(16px,4vw,36px)',
            background: th.bgCard, borderRadius: 16,
            border: `1px solid ${th.border}`, boxShadow: th.shadowSm,
          }}>
            {[['١٠٠٠٠+', 'عملية نقل ناجحة'], ['٤.٩ ⭐', 'متوسط التقييم'], ['٦+', 'محافظات'], ['٢٠١٨', 'سنة التأسيس']].map(([v, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(16px,3vw,22px)', fontWeight: 900, color: th.accent }}>{v}</div>
                <div style={{ fontSize: 11, color: th.textMuted, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Bento grid */}
        {isMobile ? (
          /* Mobile: simple 2-col grid */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {items.map((img, i) => (
              <Reveal key={i} delay={i * 60}>
                <GalleryCard img={img} i={i} hovered={hovered} setHovered={setHovered} openLb={openLb} th={th}
                  style={{ borderRadius: 14, aspectRatio: '4/3' }} />
              </Reveal>
            ))}
          </div>
        ) : (
          /* Desktop: bento layout */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridTemplateRows: 'repeat(2, 220px)', gap: 12 }}>
            {items.slice(0, 6).map((img, i) => {
              const spans = [
                { col: 'span 5', row: 'span 1' },
                { col: 'span 4', row: 'span 1' },
                { col: 'span 3', row: 'span 2' },
                { col: 'span 3', row: 'span 1' },
                { col: 'span 6', row: 'span 1' },
                { col: 'span 3', row: 'span 1' },
              ]
              const sp = spans[i] || { col: 'span 4', row: 'span 1' }
              return (
                <div key={i} style={{ gridColumn: sp.col, gridRow: sp.row }}>
                  <Reveal delay={i * 60} style={{ height: '100%' }}>
                    <GalleryCard img={img} i={i} hovered={hovered} setHovered={setHovered} openLb={openLb} th={th}
                      style={{ borderRadius: 18, height: '100%' }} featured={i === 0} />
                  </Reveal>
                </div>
              )
            })}
          </div>
        )}

        <Reveal delay={300}>
          <p style={{ textAlign: 'center', marginTop: 20, color: th.textMuted, fontSize: 12 }}>
            انقر على أي صورة لعرضها بالحجم الكامل
          </p>
        </Reveal>
      </div>

      {/* Lightbox */}
      {lb && (
        <div onClick={() => setLb(null)} style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,.96)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <button onClick={e => { e.stopPropagation(); prev() }} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
          <button onClick={e => { e.stopPropagation(); next() }} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
          <button onClick={() => setLb(null)} style={{ position: 'absolute', top: 14, right: 14, width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          <div style={{ maxWidth: 820, width: '100%', borderRadius: 18, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.8)' }} onClick={e => e.stopPropagation()}>
            <img src={lb.url} alt={lb.caption} style={{ width: '100%', display: 'block', maxHeight: '80vh', objectFit: 'contain', background: '#000' }} />
            <div style={{ background: '#0f172a', padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#cbd5e1', fontSize: 13, fontWeight: 600 }}>{lb.caption}</span>
              <span style={{ color: '#475569', fontSize: 12 }}>{lbIdx + 1} / {items.length}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function GalleryCard({ img, i, hovered, setHovered, openLb, th, style = {}, featured = false }) {
  return (
    <div
      onClick={() => openLb(img, i)}
      onMouseEnter={() => setHovered(i)}
      onMouseLeave={() => setHovered(null)}
      style={{
        position: 'relative', overflow: 'hidden', cursor: 'pointer',
        boxShadow: hovered === i ? `0 20px 50px rgba(0,0,0,0.4)` : th.shadowSm,
        transition: 'box-shadow .3s, transform .3s',
        transform: hovered === i ? 'scale(1.02)' : 'scale(1)',
        ...style,
      }}
    >
      <img src={img.url} alt={img.caption} loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .5s',
          transform: hovered === i ? 'scale(1.06)' : 'scale(1)' }} />

      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: hovered === i
          ? 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)'
          : 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)',
        transition: 'background .3s',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 14,
      }}>
        <div style={{ color: '#fff', fontSize: 13, fontWeight: 700, marginBottom: hovered === i ? 8 : 0, transition: 'margin .3s' }}>
          {img.caption}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          opacity: hovered === i ? 1 : 0,
          transform: hovered === i ? 'translateY(0)' : 'translateY(8px)',
          transition: 'all .3s',
        }}>
          <span style={{ padding: '4px 12px', borderRadius: 8, background: 'linear-gradient(135deg,#D4A017,#B8860B)', color: '#000', fontSize: 11, fontWeight: 800 }}>
            🔍 عرض
          </span>
        </div>
      </div>

      {featured && (
        <div style={{ position: 'absolute', top: 12, right: 12, padding: '4px 10px', borderRadius: 8, background: 'linear-gradient(135deg,#D4A017,#B8860B)', color: '#000', fontSize: 10, fontWeight: 800 }}>
          ⭐ مميز
        </div>
      )}
    </div>
  )
}

/* ── TESTIMONIALS ────────────────────────────────────────────────────────── */
export function TestimonialsSection({ t }) {
  const th = useTheme()
  const [idx, setIdx] = useState(0)
  const items = t.testimonials.items

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % items.length), 5000)
    return () => clearInterval(id)
  }, [items.length])

  return (
    <section style={{ padding: 'clamp(3rem,8vw,6rem) 1.2rem', background: th.bgSection }}>
      {/* AEO: Review + AggregateRating schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "هلالي موفينج - خدمات نقل الأثاث",
          "review": items.map(item => ({
            "@type": "Review",
            "reviewRating": { "@type": "Rating", "ratingValue": item.rating || 5, "bestRating": 5 },
            "author": { "@type": "Person", "name": item.name },
            "reviewBody": item.text,
          })),
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": items.length,
            "bestRating": "5",
          },
        }, null, 2)
      }} />
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <SectionHeader title={t.testimonials.title} sub={t.testimonials.sub} />
        <Reveal>
          <div style={{ background: th.bgCard, borderRadius: 22, border: `1px solid ${th.border}`, padding: 'clamp(20px,5vw,40px)', boxShadow: th.shadow, textAlign: 'center', minHeight: 220 }}>
            <div style={{ fontSize: 20, color: '#f59e0b', marginBottom: 14, letterSpacing: 2 }}>★★★★★</div>
            <p style={{ color: th.text, fontSize: 'clamp(14px,3.5vw,17px)', lineHeight: 1.75, fontStyle: 'italic', marginBottom: 22 }}>"{items[idx].text}"</p>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: th.accentLight, color: th.accentText, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, margin: '0 auto 8px' }}>{items[idx].name[0]}</div>
            <div style={{ fontWeight: 800, color: th.text, fontSize: 14 }}>{items[idx].name}</div>
            <div style={{ color: th.textMuted, fontSize: 12, marginTop: 3 }}>{items[idx].role}</div>
          </div>
        </Reveal>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
          {items.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 24 : 7, height: 7, borderRadius: 99, background: i === idx ? th.accent : th.border, border: 'none', cursor: 'pointer', transition: 'all .3s', padding: 0 }} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── SERVICE AREAS (GEO) ────────────────────────────────────────────────── */
export function ServiceAreasSection({ t }) {
  const th = useTheme()
  const [expanded, setExpanded] = useState(null)
  const [search, setSearch] = useState('')
  const areas = t.serviceAreas

  if (!areas?.cities?.length) return null

  const regions = areas.cities
  const totalAreas = regions.reduce((s, r) => s + r.areas.length, 0)
  const expandedAll = expanded === 'all'
  const searchLower = search.toLowerCase()

  const filteredRegions = search
    ? regions.filter(r =>
        r.region.includes(search) ||
        r.areas.some(a => a.includes(search))
      ).map(r => ({
        ...r,
        areas: r.areas.filter(a => a.includes(search)),
      }))
    : regions

  return (
    <section id="service-areas" style={{ padding: 'clamp(3rem,8vw,6rem) 1.2rem', background: th.bgSection, position: 'relative', overflow: 'hidden' }}>
      {/* Background effects */}
      <div style={{ position: 'absolute', top: '30%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${th.accent}08 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${th.accent}06 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle, ${th.accent}06 1px, transparent 1px)`, backgroundSize: '40px 40px', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SectionHeader title={areas.title} sub={areas.sub} />

        {/* Stats bar */}
        <Reveal>
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 'clamp(20px,5vw,60px)',
            flexWrap: 'wrap', marginBottom: 32,
            padding: 'clamp(16px,3vw,24px) clamp(20px,4vw,40px)',
            background: th.bgCard, borderRadius: 18,
            border: `1px solid ${th.border}`,
            boxShadow: th.shadowSm,
          }}>
            {[
              [`${totalAreas}+`, 'منطقة نخدمها', '📍'],
              [`${regions.length}`, 'محافظة رئيسية', '🏛️'],
              ['نفس اليوم', 'خدمة فورية متاحة', '⚡'],
              ['24/7', 'دعم متواصل', '🛡️'],
            ].map(([v, l, icon], i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 900, color: th.accent }}>{v}</div>
                <div style={{ fontSize: 11, color: th.textMuted, marginTop: 2 }}>{l}</div>
                <div style={{ fontSize: 18, marginTop: 2 }}>{icon}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Geo JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MovingCompany",
            "name": "الهلالي لنقل الاثاث",
            "alternateName": "Hilaly Moving",
            "url": "https://hilalymoving.com",
            "areaServed": regions.flatMap(r => r.areas.map(a => ({
              "@type": "City",
              "name": a,
              "containedInPlace": { "@type": "City", "name": r.region }
            }))),
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "خدمات نقل الأثاث حسب المنطقة",
              "itemListElement": regions.map(r => ({
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": `نقل أثاث في ${r.region}`,
                  "areaServed": r.areas.map(a => ({ "@type": "City", "name": a })),
                }
              }))
            }
          }, null, 2)
        }} />

        {/* Search */}
        <Reveal delay={80}>
          <div style={{ marginBottom: 28, position: 'relative', maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
            <input
              type="text"
              placeholder="ابحث عن منطقتك... (مثال: مدينة نصر، التجمع، سيدي بشر)"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={e => e.target.style.borderColor = th.accent}
              onBlur={e => e.target.style.borderColor = th.border}
              style={{
                width: '100%', padding: '12px 18px', paddingRight: 44,
                borderRadius: 14, border: `1.5px solid ${th.border}`,
                background: th.bgCard, color: th.text,
                fontSize: 14, outline: 'none', boxSizing: 'border-box',
                fontFamily: 'inherit', transition: 'border-color .2s',
              }}
            />
            <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18, opacity: 0.5 }}>🔍</span>
          </div>
        </Reveal>

        {/* Region cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))', gap: 20 }}>
          {(search ? filteredRegions : regions).map((region, i) => {
            const isExpanded = expanded === i || expandedAll
            return (
              <Reveal key={i} delay={i * 80}>
                <div style={{
                  background: th.bgCard, borderRadius: 20,
                  border: `1px solid ${isExpanded ? region.color : th.border}`,
                  boxShadow: isExpanded ? `0 8px 32px ${region.color}22` : th.shadowSm,
                  overflow: 'hidden', transition: 'all .3s',
                }}
                  onMouseEnter={e => { if (!isExpanded) { e.currentTarget.style.borderColor = region.color; e.currentTarget.style.boxShadow = `0 8px 28px ${region.color}18` } }}
                  onMouseLeave={e => { if (!isExpanded) { e.currentTarget.style.borderColor = th.border; e.currentTarget.style.boxShadow = th.shadowSm } }}
                >
                  {/* Color top bar */}
                  <div style={{ height: 4, background: `linear-gradient(90deg, ${region.color}, ${region.color}66)` }} />

                  {/* Header */}
                  <div style={{ padding: '1.2rem 1.2rem 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 12,
                          background: `${region.color}18`,
                          border: `1px solid ${region.color}33`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 20,
                        }}>
                          {region.icon || '📍'}
                        </div>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 800, color: region.color }}>{region.region}</div>
                          <div style={{ fontSize: 11, color: th.textMuted }}>{region.areas.length} منطقة</div>
                        </div>
                      </div>
                      <button onClick={() => {
                        if (expandedAll) setExpanded(null)
                        else setExpanded(expanded === i ? null : i)
                      }} style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: `${region.color}15`, border: `1px solid ${region.color}33`,
                        color: region.color, cursor: 'pointer', fontSize: 14,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all .2s',
                      }}>
                        {isExpanded ? '−' : '+'}
                      </button>
                    </div>

                    {/* Quick peek: first few areas */}
                    {!isExpanded && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                        {region.areas.slice(0, 6).map((area, j) => (
                          <span key={j} style={{
                            display: 'inline-block', padding: '3px 8px', borderRadius: 6,
                            background: `${region.color}12`, color: th.textMuted,
                            fontSize: 10, fontWeight: 600, border: `1px solid ${th.border}`,
                          }}>
                            {area}
                          </span>
                        ))}
                        {region.areas.length > 6 && (
                          <span style={{ fontSize: 10, color: th.textMuted, padding: '3px 6px' }}>
                            +{region.areas.length - 6}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Expanded area list */}
                  <div style={{
                    maxHeight: isExpanded ? 2000 : 0,
                    overflow: 'hidden',
                    transition: 'max-height .4s ease',
                  }}>
                    <div style={{ padding: '0 1.2rem 1.2rem' }}>
                      <div style={{
                        height: 1, background: `linear-gradient(90deg, ${region.color}44, transparent)`,
                        marginBottom: 12,
                      }} />
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {region.areas.map((area, j) => (
                          <span key={j} style={{
                            display: 'inline-block', padding: '6px 13px', borderRadius: 99,
                            background: `${region.color}12`,
                            color: th.text, fontSize: 12, fontWeight: 600,
                            border: `1px solid ${region.color}33`,
                            transition: 'all .2s',
                          }}
                            onMouseEnter={e => { e.currentTarget.style.background = `${region.color}25`; e.currentTarget.style.color = region.color; e.currentTarget.style.borderColor = region.color }}
                            onMouseLeave={e => { e.currentTarget.style.background = `${region.color}12`; e.currentTarget.style.color = th.text; e.currentTarget.style.borderColor = `${region.color}33` }}
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action footer */}
                  <div style={{
                    padding: '0 1.2rem 1rem',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    flexWrap: 'wrap', gap: 8,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: th.textMuted }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                      خدمة متاحة
                    </div>
                    <a href={`tel:${t.footer?.phone1 || ''}`} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '5px 12px', borderRadius: 8,
                      background: `${region.color}15`,
                      color: region.color, fontSize: 11, fontWeight: 800,
                      textDecoration: 'none', border: `1px solid ${region.color}33`,
                      transition: 'all .2s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = region.color; e.currentTarget.style.color = '#fff' }}
                      onMouseLeave={e => { e.currentTarget.style.background = `${region.color}15`; e.currentTarget.style.color = region.color }}
                    >
                      📞 احجز الآن
                    </a>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>

        {/* No results */}
        {search && filteredRegions.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: th.textMuted, fontSize: 15 }}>
            لم نعثر على "${search}" — اتصل بنا للاستفسار عن منطقتك
          </div>
        )}

        {/* Bottom CTA */}
        <Reveal delay={300}>
          <div style={{
            marginTop: 36, textAlign: 'center',
            padding: 'clamp(20px,4vw,32px)',
            borderRadius: 20,
            background: `linear-gradient(135deg, ${th.bgCard}, transparent)`,
            border: `1px solid ${th.border}`,
          }}>
            <p style={{ color: th.textMuted, fontSize: 14, marginBottom: 16, lineHeight: 1.7 }}>
              أينما كنت في مصر — فريق الهلالي يصل إليك. اتصل بنا الآن للحصول على عرض سعر فوري ومجاني.
            </p>
            <a href={`tel:${t.footer?.phone1 || ''}`} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', borderRadius: 12,
              background: `linear-gradient(135deg, #D4A017, #B8860B)`,
              color: '#000', fontWeight: 800, fontSize: 14,
              textDecoration: 'none', boxShadow: '0 8px 24px rgba(212,160,23,0.35)',
            }}>
              📞 اتصل بنا الآن
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

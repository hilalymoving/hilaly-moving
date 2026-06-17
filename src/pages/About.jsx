import { Helmet } from 'react-helmet-async'
import { useOutletContext } from 'react-router-dom'
import { Reveal } from '../Reveal'
import BookingForm from '../components/BookingForm'

export default function About() {
  const { t, th } = useOutletContext()

  const stats = [
    { num: '10,000+', label: 'عملية ناجحة', icon: '✅' },
    { num: '4.9 ⭐', label: 'متوسط التقييم', icon: '⭐' },
    { num: '7+', label: 'سنوات خبرة', icon: '📅' },
    { num: '24/7', label: 'دعم متواصل', icon: '🛡️' },
  ]

  const guarantees = t.trust?.guarantees || [
    { icon: '⏰', title: 'ضمان في الموعد', desc: 'أو نخصم 500 ج.م من الفاتورة' },
    { icon: '💯', title: 'ضمان عدم الأضرار', desc: 'نصلح مجاني أو نعوضك 100%' },
    { icon: '📞', title: 'دعم 24/7', desc: 'فريقنا متوفر دائما لأي طارئ' },
  ]

  return (
    <div>
      <Helmet>
        <title>من نحن - هلالي موفينج | خبراء نقل الأثاث في القاهرة والإسكندرية</title>
        <meta name="description" content="هلالي موفينج شركة نقل أثاث رائدة في القاهرة، الجيزة، الإسكندرية، وجميع المحافظات. أكثر من 10,000 عملية نقل ناجحة. نخدم مدينة نصر، المعادي، التجمع الخامس، الشيخ زايد." />
        <link rel="canonical" href="https://helalymoving.tryasp.net/about" />
      </Helmet>
      <div style={{ background: th.heroGradient || `linear-gradient(135deg, #0f172a, #1e1b4b)`, padding: 'clamp(3rem,8vw,5rem) 1.2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 900, color: '#fff', marginBottom: 16 }}>من نحن</h1>
        <p style={{ fontSize: 'clamp(14px,2vw,18px)', color: '#94a3b8', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
          خبراء نقل الأثاث في مصر منذ 2018
        </p>
      </div>

      {/* Story */}
      <div style={{ padding: 'clamp(3rem,8vw,5rem) 1.2rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,400px),1fr))', gap: 40, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 900, marginBottom: 20, color: th.text }}>قصتنا</h2>
            <p style={{ fontSize: 15, lineHeight: 1.9, color: th.textMuted, marginBottom: 16 }}>
              بدأنا قبل 7 سنوات مع شاحنة واحدة وفريق صغير. اليوم، هلالي موفينج هي واحدة من أسرع شركات نقل الأثاث نمواً في مصر،
              مع أكثر من 10,000 عملية نقل ناجحة وآلاف العملاء الراضين.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.9, color: th.textMuted, marginBottom: 16 }}>
              ما يميزنا هو التزامنا بالجودة والشفافية. كل عملية نقل نتعامل معها وكأنها منزلنا. نستخدم أفضل مواد التغليف،
              وأحدث الشاحنات، وندرب فريقنا باستمرار على أحدث تقنيات النقل والتغليف.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.9, color: th.textMuted }}>
              نخدم القاهرة، الإسكندرية، الجيزة، وجميع محافظات مصر. سواء كنت تنتقل داخل المدينة أو بين المحافظات،
              نحن هنا لجعل عملية نقلك سهلة وآمنة.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {stats.map((s, i) => (
              <Reveal key={i} delay={i * 80}>
                <div style={{ background: th.bgCard, borderRadius: 16, padding: '1.5rem', textAlign: 'center', border: `1px solid ${th.border}`, boxShadow: th.shadow }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: th.accent, marginBottom: 4 }}>{s.num}</div>
                  <div style={{ fontSize: 13, color: th.textMuted }}>{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* Guarantees */}
      <div style={{ background: th.bgSection }}>
        <div style={{ padding: 'clamp(3rem,8vw,5rem) 1.2rem', maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(22px,3vw,28px)', fontWeight: 900, textAlign: 'center', marginBottom: 12, color: th.text }}>لماذا تثق الآلاف فينا؟</h2>
          <p style={{ fontSize: 14, color: th.textMuted, textAlign: 'center', marginBottom: 32, lineHeight: 1.7 }}>معايير الجودة والضمان التي تجعلنا الخيار الأول</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,280px),1fr))', gap: 20 }}>
            {guarantees.map((g, i) => (
              <Reveal key={i} delay={i * 100}>
                <div style={{ background: th.bgCard, borderRadius: 20, padding: '2rem', textAlign: 'center', border: `1px solid ${th.border}`, boxShadow: th.shadow }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>{g.icon}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 8, color: th.text }}>{g.title}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: th.textMuted }}>{g.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <BookingForm t={t} lang="ar" />
    </div>
  )
}

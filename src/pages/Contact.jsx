import { Helmet } from 'react-helmet-async'
import { useOutletContext } from 'react-router-dom'
import BookingForm from '../components/BookingForm'
import { Reveal } from '../Reveal'

export default function Contact() {
  const { t, th } = useOutletContext()

  const contactMethods = [
    { icon: '📞', title: 'اتصل بنا', value: t.footer?.phone1 || '+20 10 12 34 56 78', href: `tel:${t.footer?.phone1}`, color: '#10b981' },
    { icon: '📞', title: 'رقم ثاني', value: t.footer?.phone2 || '+20 11 98 76 54 32', href: `tel:${t.footer?.phone2}`, color: '#10b981' },
    { icon: '💬', title: 'واتساب', value: t.footer?.phone1 || '+20 10 12 34 56 78', href: `https://wa.me/${(t.footer?.phone1 || '201012345678').replace(/\D/g, '')}`, color: '#25d366' },
    { icon: '✉️', title: 'البريد الإلكتروني', value: t.footer?.email || 'info@hilalymoving.eg', href: `mailto:${t.footer?.email}`, color: '#6366f1' },
    { icon: '📍', title: 'مناطق الخدمة', value: 'القاهرة، الإسكندرية، الجيزة، جميع المحافظات', href: '#', color: '#f59e0b' },
  ]

  return (
    <div>
      <Helmet>
        <title>اتصل بنا - هلالي موفينج | احصل على عرض سعر مجاني</title>
        <meta name="description" content="تواصل مع هلالي موفينج لنقل الأثاث. اتصل بنا أو أرسل واتساب للحصول على عرض سعر مجاني. فريقنا متاح 24/7 في القاهرة والإسكندرية." />
        <link rel="canonical" href="https://hilalymoving.com/contact" />
      </Helmet>
      <div style={{ background: th.heroGradient || `linear-gradient(135deg, #0f172a, #1e1b4b)`, padding: 'clamp(3rem,8vw,5rem) 1.2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 900, color: '#fff', marginBottom: 16 }}>اتصل بنا</h1>
        <p style={{ fontSize: 'clamp(14px,2vw,18px)', color: '#94a3b8', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
          فريقنا متاح 24/7 للرد على استفساراتك وتقديم عرض سعر مجاني
        </p>
      </div>

      <div style={{ padding: 'clamp(3rem,8vw,5rem) 1.2rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,220px),1fr))', gap: 16, marginBottom: 48 }}>
          {contactMethods.map((m, i) => (
            <Reveal key={i} delay={i * 80}>
              <a href={m.href} target={m.href.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <div style={{ background: th.bgCard, borderRadius: 16, padding: '1.5rem', textAlign: 'center', border: `1px solid ${th.border}`, boxShadow: th.shadow, transition: 'transform .3s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>{m.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: th.text, marginBottom: 4 }}>{m.title}</div>
                  <div style={{ fontSize: 12, color: m.color, fontWeight: 600 }}>{m.value}</div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <div id="booking">
          <BookingForm t={t} lang="ar" />
        </div>
      </div>
    </div>
  )
}

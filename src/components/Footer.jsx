import { useTheme } from '../theme'

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)
const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
)
const TikTokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
  </svg>
)

export default function Footer({ t }) {
  const th = useTheme()
  const social = t.footer.social || {}

  const socialLinks = [
    { key: 'facebook',  icon: <FacebookIcon />,  label: 'Facebook',  color: '#1877f2', bg: '#1877f222' },
    { key: 'instagram', icon: <InstagramIcon />, label: 'Instagram', color: '#e1306c', bg: '#e1306c22' },
    { key: 'whatsapp',  icon: <WhatsAppIcon />,  label: 'WhatsApp',  color: '#25d366', bg: '#25d36622' },
    { key: 'tiktok',    icon: <TikTokIcon />,    label: 'TikTok',    color: '#f1f5f9', bg: '#ffffff18' },
  ].filter(s => social[s.key])

  return (
    <footer style={{ background: th.bgCard, borderTop: `1px solid ${th.border}`, padding: 'clamp(2rem,5vw,3.5rem) 1.2rem', textAlign: 'center' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>

        {/* Brand */}
        <div style={{ fontSize: 'clamp(18px,4vw,22px)', fontWeight: 900, color: th.accent, marginBottom: 6 }}>{t.nav?.brand || 'الهلالي لنقل الاثاث'}</div>
        <p style={{ color: th.textMuted, fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>{t.footer.tag}</p>

        {/* Social icons */}
        {socialLinks.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
            {socialLinks.map(({ key, icon, label, color, bg }) => (
              <a key={key} href={social[key]} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '8px 16px', borderRadius: 12,
                  background: bg, border: `1px solid ${color}33`,
                  color, textDecoration: 'none', fontSize: 13, fontWeight: 700,
                  transition: 'all .2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${color}33`; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = bg; e.currentTarget.style.transform = 'none' }}
              >
                {icon} {label}
              </a>
            ))}
          </div>
        )}

        {/* Contact links */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, fontSize: 13, marginBottom: 20, flexWrap: 'wrap' }}>
          <a href={`tel:${t.footer.phone1}`} style={{ color: th.textMuted, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}
            onMouseEnter={e => e.currentTarget.style.color = th.accent}
            onMouseLeave={e => e.currentTarget.style.color = th.textMuted}>
            📞 {t.footer.phone1}
          </a>
          <a href={`tel:${t.footer.phone2}`} style={{ color: th.textMuted, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}
            onMouseEnter={e => e.currentTarget.style.color = th.accent}
            onMouseLeave={e => e.currentTarget.style.color = th.textMuted}>
            📞 {t.footer.phone2}
          </a>
          <a href={`tel:${t.footer.phone3}`} style={{ color: th.textMuted, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}
            onMouseEnter={e => e.currentTarget.style.color = th.accent}
            onMouseLeave={e => e.currentTarget.style.color = th.textMuted}>
            📞 {t.footer.phone3}
          </a>
          <a href={`tel:${t.footer.phone4}`} style={{ color: th.textMuted, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}
            onMouseEnter={e => e.currentTarget.style.color = th.accent}
            onMouseLeave={e => e.currentTarget.style.color = th.textMuted}>
            📞 {t.footer.phone4}
          </a>
          <a href={`mailto:${t.footer.email}`} style={{ color: th.textMuted, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}
            onMouseEnter={e => e.currentTarget.style.color = th.accent}
            onMouseLeave={e => e.currentTarget.style.color = th.textMuted}>
            ✉️ {t.footer.email}
          </a>
        </div>

        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${th.border}, transparent)`, marginBottom: 16 }} />
        <div style={{ fontSize: 11, color: th.textMuted, opacity: 0.5 }}>{t.footer.copy}</div>
      </div>
    </footer>
  )
}

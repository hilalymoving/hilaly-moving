import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../theme'

const FacebookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 0 1-1h3z"/>
  </svg>
)
const InstagramIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)
const WhatsAppIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)
const TikTokIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
  </svg>
)
const PhoneIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)

const SOCIAL_META = {
  facebook:  { icon: <FacebookIcon />,  label: 'Facebook' },
  instagram: { icon: <InstagramIcon />, label: 'Instagram' },
  whatsapp:  { icon: <WhatsAppIcon />,  label: 'WhatsApp' },
  tiktok:    { icon: <TikTokIcon />,    label: 'TikTok' },
}

export default function NavBar({ lang, dark, setDark, t, scrollTo }) {
  const th = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  const navItems = [
    { label: 'الرئيسية', icon: '🏠', href: '/' },
    { label: 'الخدمات', icon: '🛠️', href: '/services' },
    { label: 'العروض', icon: '💰', href: '/pricing' },
    { label: 'اتصل بنا', icon: '📞', href: '/contact', highlight: true },
  ]

  useEffect(() => {
    const h = () => { setScrolled(window.scrollY > 50); setIsMobile(window.innerWidth < 640) }
    window.addEventListener('scroll', h)
    window.addEventListener('resize', h)
    return () => { window.removeEventListener('scroll', h); window.removeEventListener('resize', h) }
  }, [])

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return
    const handleClick = (e) => {
      if (!e.target.closest('[data-menu]')) setMenuOpen(false)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [menuOpen])

  const social = t.footer?.social || {}
  const activeSocial = Object.entries(social).filter(([, v]) => v)

  // Build ticker items: phones + social links
  const tickerItems = [
    { type: 'phone', href: `tel:${t.footer.phone1}`, icon: <PhoneIcon />, label: t.footer.phone1 },
    { type: 'phone', href: `tel:${t.footer.phone2}`, icon: <PhoneIcon />, label: t.footer.phone2 },
    ...activeSocial.map(([key, url]) => ({
      type: 'social', href: url, icon: SOCIAL_META[key]?.icon, label: SOCIAL_META[key]?.label || key,
    })),
  ].filter(item => item.label)

  // Duplicate for seamless loop
  const loopItems = [...tickerItems, ...tickerItems, ...tickerItems]

  return (
    <>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, transition: 'all .4s' }}>
        {/* ── Ticker bar ── */}
        <div style={{
          background: th.accent,
          height: 34,
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* Fade edges */}
          <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: '100%', background: `linear-gradient(to left, ${th.accent}, transparent)`, zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, width: 60, height: '100%', background: `linear-gradient(to right, ${th.accent}, transparent)`, zIndex: 2, pointerEvents: 'none' }} />

          <div style={{
                display: 'flex', alignItems: 'center', height: '100%',
                animation: 'ticker 28s linear infinite',
                whiteSpace: 'nowrap',
                width: 'max-content',
              }}>
            {loopItems.map((item, i) => (
              <a key={i} href={item.href} target={item.type === 'social' ? '_blank' : '_self'}
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  color: '#000', fontSize: 12, fontWeight: 700,
                  textDecoration: 'none', padding: '0 24px',
                  opacity: 0.85, transition: 'opacity .2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.85'}
              >
                {item.icon}
                {item.label}
                {/* Separator dot */}
                <span style={{ marginRight: 16, opacity: 0.4, fontSize: 16 }}>•</span>
              </a>
            ))}
          </div>

          <style>{`
            @keyframes ticker {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-33.333%); }
            }
            @keyframes slideIn {
              from { transform: translateX(100%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
        </div>

        {/* ── Main nav ── */}
        <div style={{
          background: scrolled ? th.bgNav : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? `1px solid ${th.border}` : 'none',
          transition: 'all .4s',
        }}>
          <div style={{
            maxWidth: 1100, margin: '0 auto',
            padding: isMobile ? '0 1rem' : '0 1.5rem',
            height: isMobile ? 50 : 56,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            {/* Mobile: Hamburger + Logo together on left */}
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 10 }}>
              {isMobile && (
                <button data-menu onClick={() => setMenuOpen(!menuOpen)} style={{
                  display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4,
                  width: 36, height: 36, background: menuOpen ? th.accent : 'transparent', 
                  border: `1px solid ${th.accent}`,
                  borderRadius: 8, cursor: 'pointer', padding: 6,
                  transition: 'all .3s',
                }}>
                  <div style={{ 
                    height: 2, 
                    background: menuOpen ? '#000' : '#D4A017', 
                    borderRadius: 1, 
                    transition: 'all .3s',
                    transform: menuOpen ? 'rotate(45deg) translateY(6px)' : 'none',
                  }} />
                  <div style={{ 
                    height: 2, 
                    background: menuOpen ? '#000' : '#D4A017', 
                    borderRadius: 1, 
                    transition: 'all .3s',
                    opacity: menuOpen ? 0 : 1,
                  }} />
                  <div style={{ 
                    height: 2, 
                    background: menuOpen ? '#000' : '#D4A017', 
                    borderRadius: 1, 
                    transition: 'all .3s',
                    transform: menuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none',
                  }} />
                </button>
              )}

              {/* Logo + Brand */}
              {t.nav.logo ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img src={t.nav.logo} alt="Logo" style={{ height: isMobile ? 28 : 36, objectFit: 'contain', borderRadius: 4 }} />
                  <span style={{ fontSize: isMobile ? 14 : 18, fontWeight: 900, color: th.accent }}>{t.nav.brand}</span>
                </div>
              ) : (
                <span style={{ fontSize: isMobile ? 16 : 21, fontWeight: 900, color: th.accent }}>{t.nav.brand}</span>
              )}
            </div>

            <div style={{ display: 'flex', gap: isMobile ? 8 : 10, alignItems: 'center' }}>
              {/* Desktop nav links */}
              {!isMobile && (
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  {navItems.slice(0, -1).map((item, i) => (
                    <Link key={i} to={item.href} onClick={() => setMenuOpen(false)} style={{
                      fontSize: 13, fontWeight: 600, color: location.pathname === item.href ? '#D4A017' : th.text, textDecoration: 'none', cursor: 'pointer',
                      transition: 'color .2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#D4A017'}
                    onMouseLeave={e => e.currentTarget.style.color = location.pathname === item.href ? '#D4A017' : th.text}
                    >
                    {item.label}
                  </Link>
                  ))}
                </div>
              )}

              {/* Dark/Light toggle */}
              <button onClick={() => setDark(!dark)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '7px 10px', borderRadius: 10,
                border: `1px solid ${th.border}`,
                background: th.bgCard, color: th.text,
                cursor: 'pointer', transition: 'all .2s',
              }}>
                {dark ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                )}
              </button>

              {/* CTA Button */}
              <Link to="/contact" style={{
                padding: isMobile ? '7px 14px' : '8px 20px',
                borderRadius: 12,
                background: `linear-gradient(135deg,#D4A017,#B8860B)`,
                color: '#000', fontWeight: 800,
                fontSize: isMobile ? 12 : 14,
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(212,160,23,0.4)',
                transition: 'all .2s',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {t.nav.book}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay - Improved */}
      {isMobile && menuOpen && (
        <>
          {/* Backdrop */}
          <div 
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'fixed', 
              top: 84, 
              left: 0, 
              right: 0, 
              bottom: 0,
              background: 'rgba(0,0,0,0.7)', 
              zIndex: 98,
              animation: 'fadeIn 0.3s ease-out',
            }} 
          />
          
          {/* Menu panel */}
          <div data-menu style={{
            position: 'fixed', 
            top: 84, 
            right: 0, 
            width: '85%',
            maxWidth: 320,
            bottom: 0,
            background: th.bgCard,
            zIndex: 99,
            padding: '24px 0',
            display: 'flex', 
            flexDirection: 'column',
            boxShadow: '-4px 0 24px rgba(0,0,0,0.3)',
            animation: 'slideIn 0.3s ease-out',
            overflowY: 'auto',
          }}>
            {/* Menu items */}
            {navItems.map((item, i) => (
              <Link key={i} to={item.href} onClick={() => setMenuOpen(false)} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 16, 
                fontWeight: 600, 
                color: item.highlight ? th.accent : th.text,
                textDecoration: 'none', 
                cursor: 'pointer',
                padding: '16px 24px',
                borderBottom: `1px solid ${th.border}`,
                transition: 'all .2s',
                background: item.highlight ? `${th.accent}11` : 'transparent',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = item.highlight ? `${th.accent}22` : th.bgSection
                e.currentTarget.style.paddingRight = '28px'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = item.highlight ? `${th.accent}11` : 'transparent'
                e.currentTarget.style.paddingRight = '24px'
              }}
              >
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            
            {/* Quick contact section */}
            <div style={{ 
              padding: '24px', 
              marginTop: 'auto',
              borderTop: `1px solid ${th.border}`,
            }}>
              <div style={{ 
                fontSize: 11, 
                fontWeight: 700, 
                color: th.textMuted, 
                marginBottom: 12,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}>
                تواصل سريع
              </div>
              
              {/* WhatsApp button */}
              <a 
                href={`https://wa.me/${t.footer?.phone1?.replace(/\D/g, '') || ''}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '12px',
                  borderRadius: 12,
                  background: '#25D366',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: 'none',
                  marginBottom: 8,
                  transition: 'transform .2s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <WhatsAppIcon />
                واتساب مباشر
              </a>
              
              {/* Phone button */}
              <a 
                href={`tel:${t.footer?.phone1}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '12px',
                  borderRadius: 12,
                  background: th.bgSection,
                  color: th.text,
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: 'none',
                  border: `1px solid ${th.border}`,
                  transition: 'transform .2s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <PhoneIcon />
                اتصل الآن
              </a>
            </div>
          </div>
        </>
      )}
    </>
  )
}

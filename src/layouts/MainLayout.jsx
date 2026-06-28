import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeCtx, THEMES } from '../theme'
import { CMS } from '../cms'
import { loadSiteData } from '../firebase'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

function formatTime(ms) {
  const hours = Math.floor(ms / (1000 * 60 * 60))
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((ms % (1000 * 60)) / 1000)
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

function mergeCMS(saved) {
  if (!saved) return CMS
  return {
    ar: {
      ...CMS.ar,
      ...saved.ar,
      faq: CMS.ar.faq,
      nav: saved.ar?.nav !== undefined ? { ...CMS.ar.nav, ...saved.ar.nav } : CMS.ar.nav,
      services: saved.ar?.services || CMS.ar.services,
      popup: saved.ar?.popup !== undefined ? saved.ar.popup : CMS.ar.popup,
      slider: saved.ar?.slider !== undefined ? saved.ar.slider : CMS.ar.slider,
      footer: { ...CMS.ar.footer, ...saved.ar?.footer },
      specialServices: saved.ar?.specialServices || CMS.ar.specialServices,
      blog: saved.ar?.blog || CMS.ar.blog,
    }
  }
}

export default function MainLayout() {
  const lang = 'ar'
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('nq_dark') === 'true' } catch { return false }
  })
  const [content, setContent] = useState(CMS)
  const [video, setVideo] = useState({ src: '', poster: '', title: '', desc: '' })
  const [loading, setLoading] = useState(true)
  const [showPopup, setShowPopup] = useState(true)
  const [timerLeft, setTimerLeft] = useState(0)
  const location = useLocation()

  useEffect(() => {
    loadSiteData().then(data => {
      if (data) {
        setContent(mergeCMS(data.content))
        if (data.video) setVideo(data.video)
      } else {
        try {
          const saved = localStorage.getItem('nq_content')
          if (saved) setContent(mergeCMS(JSON.parse(saved)))
          const savedVideo = localStorage.getItem('nq_video')
          if (savedVideo) setVideo(JSON.parse(savedVideo))
        } catch {}
      }
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    try { localStorage.setItem('nq_dark', dark) } catch {}
  }, [dark])

  const closePopup = () => setShowPopup(false)

  useEffect(() => {
    if (loading) return
    const popup = content[lang]?.popup
    if (!popup?.enabled) return
    const hours = popup.timerHours || 3
    const defaultMs = (hours * 60 * 60 * 1000) + (43 * 60 * 1000) + (49 * 1000)
    setTimerLeft(defaultMs)
    setShowPopup(true)
    const interval = setInterval(() => {
      setTimerLeft(prev => {
        if (prev <= 1000) { clearInterval(interval); return 0 }
        return prev - 1000
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [loading])

  useEffect(() => {
    document.documentElement.dir = 'rtl'
    document.documentElement.lang = 'ar'
    const loader = document.getElementById('app-loading')
    if (loader) loader.style.display = 'none'
  }, [])

  const th = dark ? THEMES.dark : THEMES.light
  const t = content[lang]
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 32, fontWeight: 900, background: 'linear-gradient(135deg,#D4A017,#B8860B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{content.ar.nav?.brand || 'الهلالي لنقل الاثاث'}</div>
      <div style={{ width: 40, height: 40, border: '3px solid #D4A01733', borderTop: '3px solid #D4A017', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <HelmetProvider>
      <ThemeCtx.Provider value={th}>
        {showPopup && t?.popup?.enabled && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={closePopup}>
            <style>{`
              @keyframes popupEnter { 0% { opacity: 0; transform: scale(0.5) translateY(50px); } 70% { transform: scale(1.05) translateY(-10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
              @keyframes floatBadge { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
            `}</style>
            <div style={{ background: '#fff', padding: 40, borderRadius: 16, maxWidth: 440, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', border: '4px solid #D4A017', animation: 'popupEnter 0.5s ease-out forwards' }} onClick={e => e.stopPropagation()}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ background: '#D4A017', color: '#fff', padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 700, display: 'inline-block', marginBottom: 20, animation: 'floatBadge 2s ease-in-out infinite' }}>
                  ⏰ العرض ينتهي خلال: {formatTime(timerLeft)}
                </div>
                <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12, color: '#000' }}>{t.popup.title}</h2>
                <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 24, color: '#333' }}>{t.popup.desc}</p>
                <button onClick={() => { closePopup(); document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }) }} style={{ background: '#D4A017', color: '#fff', border: 'none', padding: '16px 40px', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer', width: '100%', marginBottom: 16 }}>{t.popup.button}</button>
                <button onClick={closePopup} style={{ background: 'none', border: 'none', color: '#666', fontSize: 13, cursor: 'pointer' }}>إغلاق</button>
              </div>
            </div>
          </div>
        )}
        <div style={{ background: th.bg, color: th.text, minHeight: '100vh', direction: 'rtl', fontFamily: "'Cairo','Segoe UI',sans-serif", transition: 'background .4s, color .4s' }}>
          <NavBar lang={lang} dark={dark} setDark={setDark} t={t} scrollTo={scrollTo} />
          <div style={{ paddingTop: '90px' }}>
            <Outlet context={{ t, th, lang, scrollTo, video }} />
          </div>
          <Footer t={t} />
        </div>
      </ThemeCtx.Provider>
    </HelmetProvider>
  )
}

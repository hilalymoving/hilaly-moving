import { useState, useEffect, useCallback } from 'react'
import { ADMIN_TOKENS as T, adminStyles as S } from './admin/AdminTheme'
import { Toast } from './admin/AdminUI'
import AdminSidebar, { TAB_META } from './admin/AdminSidebar'
import TrafficTab from './admin/TrafficTab'
import ContactsTab from './admin/tabs/ContactsTab'
import HeroTab from './admin/tabs/HeroTab'
import MediaTab from './admin/tabs/MediaTab'
import { PopupTab, SliderTab } from './admin/tabs/PopupAndSliderTabs'
import { ServicesTab, OffersTab } from './admin/tabs/ServicesAndOffersTabs'
import { PricingTab, TestimonialsTab, TrustTab, FaqTab, FormTab } from './admin/tabs/ContentMiscTabs'
import BlogTab from './admin/tabs/BlogTab'
import SettingsTab from './admin/tabs/SettingsTab'

export default function AdminPanel({ content, setContent, video, setVideo, onExit }) {
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [auth, setAuth] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [err, setErr] = useState('')
  const [logging, setLogging] = useState(false)

  const [tab, setTab] = useState('traffic')
  const [mobileMenu, setMobileMenu] = useState(false)

  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(content)))
  const [videoDraft, setVideoDraft] = useState(() => ({ ...video }))
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
  }, [])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(id)
  }, [toast])

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('hm_token') : null
    if (!token) {
      setAuthLoading(false)
      return
    }
    fetch('/api/auth', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.valid) {
          setAuth(true)
        } else {
          localStorage.removeItem('hm_token')
          setAuth(false)
        }
      })
      .catch(() => setAuth(false))
      .finally(() => setAuthLoading(false))
  }, [])

  const login = async () => {
    if (!email || !pwd) { setErr('يرجى إدخال البريد الإلكتروني وكلمة المرور'); return }
    setLogging(true); setErr('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pwd })
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل تسجيل الدخول')
      }
      localStorage.setItem('hm_token', data.token)
      setAuth(true)
    } catch (e) {
      setErr(e.message || 'فشل تسجيل الدخول')
    } finally {
      setLogging(false)
    }
  }

  const logout = async () => {
    try {
      localStorage.removeItem('hm_token')
      setAuth(false)
      setPwd('')
    } catch {}
  }

  const mutate = useCallback((fn) => {
    setDraft(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      fn(next)
      return next
    })
    setDirty(true)
  }, [])

  const updateVideo = useCallback((patch) => {
    setVideoDraft(prev => ({ ...prev, ...patch }))
    setDirty(true)
  }, [])

  const save = async () => {
    setSaving(true)
    setContent(draft)
    setVideo(videoDraft)
    const { saveSiteData } = await import('../api')
    const ok = await saveSiteData(draft, videoDraft)
    setSaving(false)
    if (ok) {
      setDirty(false)
      if (videoDraft.src?.startsWith('data:') && videoDraft.src.length > 500000) {
        showToast('تم الحفظ بدون الفيديو — الملف كبير جداً، استخدم رفع Cloudinary', 'warning')
      } else {
        showToast('تم حفظ التغييرات في قاعدة البيانات بنجاح', 'success')
      }
    } else {
      showToast('فشل الحفظ — تحقق من الاتصال أو الصلاحيات', 'error')
    }
  }

  const discard = () => {
    setDraft(JSON.parse(JSON.stringify(content)))
    setVideoDraft({ ...video })
    setDirty(false)
    showToast('تم تجاهل التغييرات غير المحفوظة', 'warning')
  }

  if (authLoading) return (
    <div dir="rtl" style={{ minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.textMuted, fontFamily: "'Cairo','Segoe UI',sans-serif" }}>
      جاري التحقق من الجلسة...
    </div>
  )

  if (!auth) return (
    <div dir="rtl" style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top right, rgba(212,160,23,0.14), transparent 45%), #09090b',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      fontFamily: "'Cairo','Segoe UI',sans-serif",
    }}>
      <div style={{
        background: T.surface, border: `1px solid ${T.borderStrong}`, borderRadius: 22,
        padding: '36px 32px', width: '100%', maxWidth: 400,
        boxShadow: '0 32px 80px rgba(0,0,0,0.65)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <div style={{
            width: 54, height: 54, borderRadius: 16, margin: '0 auto 14px',
            background: T.goldGradient, color: '#09090b',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 900, boxShadow: '0 8px 24px rgba(212,160,23,0.35)',
          }}>
            🔐
          </div>
          <h1 style={{ color: T.text, fontSize: 21, fontWeight: 900, marginBottom: 4 }}>لوحة تحكم الإدارة</h1>
          <p style={{ color: T.textDim, fontSize: 13 }}>{draft.ar.nav?.brand || 'الهلالي لنقل الاثاث'}</p>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <label style={S.label}>البريد الإلكتروني</label>
            <input
              type="email"
              placeholder="admin@hilalymoving.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ ...S.input, direction: 'ltr', textAlign: 'right' }}
            />
          </div>

          <div>
            <label style={S.label}>كلمة المرور</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                value={pwd}
                onChange={e => setPwd(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && login()}
                style={{ ...S.input, paddingLeft: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                style={{
                  position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: T.textMuted, cursor: 'pointer', fontSize: 14,
                }}
              >
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {err && (
            <div style={{ padding: '9px 12px', borderRadius: 10, background: T.redSoft, color: '#fca5a5', fontSize: 12.5, fontWeight: 600 }}>
              {err}
            </div>
          )}

          <button onClick={login} disabled={logging} style={{ ...S.primaryBtn, width: '100%', padding: 13, fontSize: 14.5, marginTop: 4, opacity: logging ? 0.65 : 1 }}>
            {logging ? '⏳ جارٍ تسجيل الدخول...' : 'دخول إلى لوحة التحكم'}
          </button>

          <button onClick={onExit} style={{ background: 'none', border: 'none', color: T.textDim, fontSize: 13, cursor: 'pointer', padding: 8 }}>
            ← العودة إلى الموقع الرئيسي
          </button>
        </div>
      </div>
    </div>
  )

  const currentTab = TAB_META[tab] || { icon: '⚙️', label: 'لوحة التحكم' }

  const renderTab = () => {
    switch (tab) {
      case 'traffic':      return <TrafficTab onToast={showToast} />
      case 'contacts':     return <ContactsTab draft={draft} mutate={mutate} />
      case 'hero':         return <HeroTab draft={draft} mutate={mutate} />
      case 'media':        return <MediaTab draft={draft} mutate={mutate} videoDraft={videoDraft} updateVideo={updateVideo} />
      case 'popup':        return <PopupTab draft={draft} mutate={mutate} />
      case 'slider':       return <SliderTab draft={draft} mutate={mutate} />
      case 'services':     return <ServicesTab draft={draft} mutate={mutate} />
      case 'offers':       return <OffersTab draft={draft} mutate={mutate} />
      case 'pricing':      return <PricingTab draft={draft} mutate={mutate} />
      case 'testimonials': return <TestimonialsTab draft={draft} mutate={mutate} />
      case 'trust':        return <TrustTab draft={draft} mutate={mutate} />
      case 'faq':          return <FaqTab draft={draft} mutate={mutate} />
      case 'form':         return <FormTab draft={draft} mutate={mutate} />
      case 'blog':         return <BlogTab draft={draft} mutate={mutate} />
      case 'settings':     return <SettingsTab onToast={showToast} />
      default:             return <TrafficTab onToast={showToast} />
    }
  }

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: T.bg, color: T.text, display: 'flex', fontFamily: "'Cairo','Segoe UI',sans-serif" }}>
      <style>{`
        .admin-mobile-only { display: none; }
        @media (max-width: 900px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-mobile-only { display: inline-flex !important; }
        }
      `}</style>

      <AdminSidebar
        activeTab={tab}
        onSelect={setTab}
        brand={draft.ar.nav?.brand}
        mobileOpen={mobileMenu}
        onClose={() => setMobileMenu(false)}
        dirty={dirty}
      />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Sticky Top Bar */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 40,
          background: 'rgba(9,9,11,0.86)', backdropFilter: 'blur(14px)',
          borderBottom: `1px solid ${T.border}`,
          padding: '12px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className="admin-mobile-only"
              onClick={() => setMobileMenu(true)}
              style={{ ...S.ghostBtn, padding: '8px 11px' }}
              aria-label="فتح القائمة"
            >
              ☰
            </button>
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: T.text, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>{currentTab.icon}</span>
                <span>{currentTab.label}</span>
              </div>
              <div style={{ fontSize: 11.5, color: T.textDim }}>لوحة التحكم / {currentTab.label}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {dirty && (
              <>
                <button onClick={discard} style={S.ghostBtn}>تجاهل</button>
                <button onClick={save} disabled={saving} style={{ ...S.primaryBtn, opacity: saving ? 0.65 : 1 }}>
                  💾 {saving ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
                </button>
              </>
            )}
            <a href="/" target="_blank" rel="noopener noreferrer" style={{ ...S.ghostBtn, textDecoration: 'none' }}>
              ↗ معاينة الموقع
            </a>
            <button onClick={logout} style={{ ...S.ghostBtn, color: '#fca5a5', borderColor: 'rgba(239,68,68,0.28)' }}>
              🚪 خروج
            </button>
          </div>
        </header>

        {/* Main Workspace */}
        <main style={{ padding: '24px', maxWidth: 1140, width: '100%', margin: '0 auto', boxSizing: 'border-box', flex: 1 }}>
          {renderTab()}
        </main>

        {/* Sticky unsaved bar */}
        {dirty && (
          <div style={{
            position: 'sticky', bottom: 16, margin: '0 24px 20px', zIndex: 35,
            padding: '13px 20px', borderRadius: 14,
            background: 'rgba(22,22,27,0.95)', backdropFilter: 'blur(12px)',
            border: `1px solid ${T.goldBorder}`,
            boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
          }}>
            <span style={{ fontSize: 13, color: T.goldBright, fontWeight: 800 }}>● لديك تغييرات غير محفوظة في مسودة الموقع</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={discard} style={S.ghostBtn}>تجاهل التغييرات</button>
              <button onClick={save} disabled={saving} style={S.primaryBtn}>
                💾 {saving ? 'جارٍ الحفظ...' : 'حفظ في قاعدة البيانات'}
              </button>
            </div>
          </div>
        )}
      </div>

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  )
}

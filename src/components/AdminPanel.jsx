import { useState, useEffect } from 'react'
import { saveSiteData } from '../firebase'
import { uploadToImageKit } from '../ikUpload'

const s = {
  page: { minHeight: '100vh', background: '#09090b', color: '#f1f5f9', padding: '24px 20px', fontFamily: "'Cairo','Segoe UI',sans-serif" },
  center: { minHeight: '100vh', background: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
  loginCard: { background: '#18181b', border: '1px solid #27272a', borderRadius: 20, padding: 40, width: '100%', maxWidth: 380, boxShadow: '0 32px 80px rgba(0,0,0,.7)' },
  section: { background: '#18181b', border: '1px solid #27272a', borderRadius: 16, padding: 24, marginBottom: 16 },
  sectionTitle: { color: '#D4A017', fontSize: 15, fontWeight: 800, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 },
  label: { display: 'block', fontSize: 11, color: '#71717a', fontWeight: 700, marginBottom: 5, textTransform: 'uppercase', letterSpacing: .5 },
  inp: { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #3f3f46', background: '#27272a', color: '#f1f5f9', fontSize: 14, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit', transition: 'border-color .2s' },
  saveBtn: { padding: '11px 28px', borderRadius: 12, background: 'linear-gradient(135deg,#D4A017,#B8860B)', border: 'none', color: '#000', fontWeight: 800, fontSize: 14, cursor: 'pointer' },
  cancelBtn: { padding: '11px 20px', borderRadius: 12, background: '#27272a', border: '1px solid #3f3f46', color: '#a1a1aa', fontWeight: 700, fontSize: 14, cursor: 'pointer' },
  dangerBtn: { padding: '5px 10px', borderRadius: 8, background: '#7f1d1d', border: '1px solid #991b1b', color: '#fca5a5', fontWeight: 700, fontSize: 12, cursor: 'pointer' },
  tab: (active) => ({
    padding: '9px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: 'none',
    background: active ? 'linear-gradient(135deg,#D4A017,#B8860B)' : '#27272a',
    color: active ? '#000' : '#a1a1aa',
    transition: 'all .2s',
  }),
}

function IKUploadBtn({ label, onSuccess, style = {}, multiple = false }) {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState('')
  const handle = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setLoading(true)
    try {
      for (let i = 0; i < files.length; i++) {
        if (files.length > 1) setProgress(`${i + 1}/${files.length}`)
        const result = await uploadToImageKit(files[i], '/hilaly-moving/gallery')
        onSuccess(result.url)
      }
    } catch (err) {
      alert('فشل الرفع: ' + err.message)
    } finally { setLoading(false); setProgress(''); e.target.value = '' }
  }
  return (
    <label style={{ ...style, opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
      {loading ? `⏳ جارٍ الرفع...${progress ? ` (${progress})` : ''}` : label}
      <input type="file" accept="image/*" multiple={multiple} style={{ display: 'none' }} onChange={handle} />
    </label>
  )
}

function IKVideoUploadBtn({ onSuccess, style = {} }) {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const handle = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setLoading(true)
    setProgress(0)
    try {
      const result = await uploadToImageKit(file, '/hilaly-moving/videos')
      onSuccess(result.url)
    } catch (err) {
      alert('فشل رفع الفيديو: ' + err.message)
    } finally { setLoading(false); setProgress(0); e.target.value = '' }
  }
  return (
    <label style={{ ...style, opacity: loading ? 0.8 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
      {loading ? `⏳ جارٍ الرفع إلى ImageKit...` : '📤 اختر ملف فيديو'}
      <input type="file" accept="video/*" style={{ display: 'none' }} onChange={handle} />
    </label>
  )
}

export default function AdminPanel({ content, setContent, video, setVideo, onExit }) {
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [auth, setAuth] = useState(false)
  const [err, setErr] = useState('')
  const [logging, setLogging] = useState(false)
  const [tab, setTab] = useState('contacts')
  const [saved, setSaved] = useState(false)

  // Draft state — nothing applies until Save is clicked
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(content)))
  const [videoDraft, setVideoDraft] = useState(() => ({ ...video }))
  const [dirty, setDirty] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  // Persistent auth session across page reloads
  useEffect(() => {
    (async () => {
      try {
        const { getAuth, onAuthStateChanged } = await import('firebase/auth')
        const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
          setAuth(!!user)
          setAuthLoading(false)
        })
        return unsubscribe
      } catch {
        setAuthLoading(false)
      }
    })()
  }, [])

  const go = async () => {
    if (!email || !pwd) { setErr('يرجى إدخال البريد الإلكتروني وكلمة المرور'); return }
    setLogging(true); setErr('')
    try {
      const { getAuth, signInWithEmailAndPassword } = await import('firebase/auth')
      await signInWithEmailAndPassword(getAuth(), email, pwd)
      setAuth(true)
    } catch (e) {
      const msgs = {
        'auth/user-not-found': 'لا يوجد حساب بهذا البريد',
        'auth/wrong-password': 'كلمة المرور غير صحيحة',
        'auth/invalid-credential': 'البريد أو كلمة المرور غير صحيحة',
        'auth/invalid-email': 'البريد الإلكتروني غير صالح',
        'auth/too-many-requests': 'تم حظر تسجيل الدخول مؤقتاً — حاول لاحقاً',
      }
      setErr(msgs[e.code] || 'فشل تسجيل الدخول: ' + e.message)
    } finally { setLogging(false) }
  }

  const updDraft = (path, val) => {
    const u = JSON.parse(JSON.stringify(draft))
    const keys = path.split('.')
    let obj = u
    for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]
    obj[keys[keys.length - 1]] = val
    setDraft(u)
    setDirty(true)
  }

  const save = async () => {
    setContent(draft)
    setVideo(videoDraft)
    setDirty(false)
    setSaved(false)
    const ok = await saveSiteData(draft, videoDraft)
    if (!ok && videoDraft.src?.startsWith('data:') && videoDraft.src.length > 500000) {
      setSaved('video_large')
    } else {
      setSaved(ok ? 'success' : 'error')
    }
    setTimeout(() => setSaved(false), 4000)
  }

  const discard = () => {
    setDraft(JSON.parse(JSON.stringify(content)))
    setVideoDraft({ ...video })
    setDirty(false)
  }

  if (authLoading) return (
    <div style={s.center}>
      <div style={{ color: '#71717a', fontSize: 14 }}>جاري التحقق من الجلسة...</div>
    </div>
  )

  if (!auth) return (
    <div style={s.center}>
      <div style={s.loginCard}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🔐</div>
          <h2 style={{ color: '#D4A017', fontSize: 22, fontWeight: 900, marginBottom: 4 }}>لوحة التحكم</h2>
          <p style={{ color: '#52525b', fontSize: 13 }}>Hilaly Moving — Admin</p>
        </div>
        <input type="email" placeholder="البريد الإلكتروني" value={email}
          onChange={e => setEmail(e.target.value)} style={{ ...s.inp, marginBottom: 10, fontSize: 15, direction: 'ltr' }}
          onFocus={e => e.target.style.borderColor = '#D4A017'}
          onBlur={e => e.target.style.borderColor = '#3f3f46'} />
        <input type="password" placeholder="كلمة المرور" value={pwd}
          onChange={e => setPwd(e.target.value)} onKeyDown={e => e.key === 'Enter' && go()}
          style={{ ...s.inp, marginBottom: 10, fontSize: 15 }} />
        {err && <p style={{ color: '#f87171', fontSize: 13, marginBottom: 10 }}>{err}</p>}
        <button onClick={go} disabled={logging} style={{ ...s.saveBtn, width: '100%', padding: 13, fontSize: 15, marginBottom: 10, opacity: logging ? 0.6 : 1 }}>
          {logging ? '⏳ جارٍ تسجيل الدخول...' : '🔐 دخول'}
        </button>
        <button onClick={onExit} style={{ width: '100%', padding: 9, background: 'none', border: 'none', color: '#52525b', fontSize: 13, cursor: 'pointer' }}>← العودة للموقع</button>
      </div>
    </div>
  )

  return (
    <div style={s.page}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid #27272a', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#D4A017' }}>⚙️ لوحة التحكم</h1>
            <p style={{ color: '#52525b', fontSize: 12, marginTop: 3 }}>Hilaly Moving — تعديل محتوى الموقع</p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            {dirty && <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 700 }}>● تغييرات غير محفوظة</span>}
            {saved === 'success' && <span style={{ fontSize: 12, color: '#4ade80', fontWeight: 700 }}>✓ تم الحفظ في قاعدة البيانات</span>}
            {saved === 'error' && <span style={{ fontSize: 12, color: '#f87171', fontWeight: 700 }}>✗ فشل الحفظ — تحقق من الاتصال</span>}
            {saved === 'video_large' && <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 700 }}>⚠️ تم الحفظ بدون الفيديو — الملف كبير جداً، استخدم رابط URL</span>}
            {dirty && <button onClick={discard} style={s.cancelBtn}>تجاهل</button>}
            <button onClick={save} style={{ ...s.saveBtn, opacity: dirty ? 1 : 0.5, cursor: dirty ? 'pointer' : 'default' }} disabled={!dirty}>
              💾 حفظ في قاعدة البيانات
            </button>
            <button onClick={onExit} style={s.cancelBtn}>← خروج</button>
          </div>
        </div>

         {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            {[['contacts', '📞 أرقام التواصل'], ['hero', '🎬 البطل الرئيسي'], ['media', '🖼️ الصور والفيديو'], ['popup', '🎁 عرض منبثق'], ['slider', '🖼️ عرض الشرائح'], ['services', '🛠️ خدماتنا'], ['offers', '💰 العروض'], ['special', '⭐ خدمات متخصصة'], ['testimonials', '💬 تقييمات العملاء'], ['pricing', '📊 كيفية التسعير'], ['trust', '🏆 الثقة والضمانات'], ['how', '📋 خطوات العمل'], ['faq', '❓ الأسئلة الشائعة'], ['form', '📝 نموذج الحجز'], ['footer', '📌 تذييل الموقع']].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} style={s.tab(tab === key)}>{label}</button>
            ))}
          </div>

        {/* ── TAB: CONTACTS ── */}
        {tab === 'contacts' && (
          <div style={{ display: 'grid', gap: 16 }}>
            {/* Header & Logo */}
            <div style={s.section}>
              <h2 style={s.sectionTitle}>🎨 الهيدر (الشعارات)</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
                <div>
                  <label style={s.label}>اسم الشركة</label>
                  <input style={s.inp} value={draft.ar.nav?.brand || ''}
                    onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.nav) u.ar.nav = { brand: '', logo: '', book: 'احجز الآن' }; u.ar.nav.brand = e.target.value; setDraft(u); setDirty(true) }}
                    onFocus={e => e.target.style.borderColor = '#D4A017'}
                    onBlur={e => e.target.style.borderColor = '#3f3f46'} />
                </div>
                <div>
                  <label style={s.label}>نص زر الحجز</label>
                  <input style={s.inp} value={draft.ar.nav?.book || ''}
                    onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.nav) u.ar.nav = { brand: '', logo: '', book: 'احجز الآن' }; u.ar.nav.book = e.target.value; setDraft(u); setDirty(true) }}
                    onFocus={e => e.target.style.borderColor = '#D4A017'}
                    onBlur={e => e.target.style.borderColor = '#3f3f46'} />
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <label style={s.label}>شعار (صورة) - اختياري</label>
                {draft.ar.nav?.logo ? (
                  <div style={{ position: 'relative', marginBottom: 8 }}>
                    <img src={draft.ar.nav.logo} alt="Logo" style={{ width: 120, height: 60, objectFit: 'contain', borderRadius: 8, background: '#fff' }} />
                    <button onClick={() => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.nav) u.ar.nav = {}; u.ar.nav.logo = ''; setDraft(u); setDirty(true) }}
                      style={{ position: 'absolute', top: 4, left: 4, width: 24, height: 24, borderRadius: '50%', background: '#7f1d1d', border: 'none', color: '#fca5a5', cursor: 'pointer', fontSize: 14 }}>×</button>
                  </div>
                ) : null}
                <IKUploadBtn
                  label="📤 رفع شعار"
                  onSuccess={url => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.nav) u.ar.nav = { brand: '', logo: '', book: 'احجز الآن' }; u.ar.nav.logo = url; setDraft(u); setDirty(true) }}
                  style={{ width: '100%', padding: 12, background: '#27272a', borderRadius: 10, color: '#a1a1aa', fontSize: 13, cursor: 'pointer', textAlign: 'center', border: '1px dashed #3f3f46', display: 'block' }}
                />
              </div>
            </div>

            {/* Phone numbers */}
            <div style={s.section}>
              <h2 style={s.sectionTitle}>📞 أرقام التواصل</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
                <div>
                  <label style={s.label}>رقم الهاتف الأول</label>
                  <input style={s.inp} value={draft.ar.footer.phone1} placeholder="+20 10 XXXX XXXX"
                    onChange={e => updDraft('ar.footer.phone1', e.target.value)}
                    onFocus={e => e.target.style.borderColor = '#D4A017'}
                    onBlur={e => e.target.style.borderColor = '#3f3f46'} />
                  <p style={{ fontSize: 11, color: '#52525b', marginTop: 4 }}>يظهر في الشريط العلوي والفوتر</p>
                </div>
                <div>
                  <label style={s.label}>رقم الهاتف الثاني</label>
                  <input style={s.inp} value={draft.ar.footer.phone2} placeholder="+20 11 XXXX XXXX"
                    onChange={e => updDraft('ar.footer.phone2', e.target.value)}
                    onFocus={e => e.target.style.borderColor = '#D4A017'}
                    onBlur={e => e.target.style.borderColor = '#3f3f46'} />
                  <p style={{ fontSize: 11, color: '#52525b', marginTop: 4 }}>يظهر في الشريط العلوي والفوتر</p>
                </div>
                <div>
                  <label style={s.label}>البريد الإلكتروني</label>
                  <input style={s.inp} value={draft.ar.footer.email} placeholder="info@example.com"
                    onChange={e => updDraft('ar.footer.email', e.target.value)}
                    onFocus={e => e.target.style.borderColor = '#D4A017'}
                    onBlur={e => e.target.style.borderColor = '#3f3f46'} />
                </div>
                <div>
                    <label style={s.label}>رقم واتساب للحجز</label>
                    <input style={s.inp} value={draft.ar.footer.social?.whatsapp || ''} placeholder="201012345678"
                      onChange={e => {
                        const u = JSON.parse(JSON.stringify(draft))
                        if (!u.ar.footer.social) u.ar.footer.social = {}
                        u.ar.footer.social.whatsapp = e.target.value
                        setDraft(u); setDirty(true)
                      }}
                      onFocus={e => e.target.style.borderColor = '#25d366'}
                      onBlur={e => e.target.style.borderColor = '#3f3f46'} />
                    <p style={{ fontSize: 11, color: '#52525b', marginTop: 4 }}>بدون + أو مسافات (مثال: 201012345678)</p>
                  </div>
              </div>

              {/* Preview */}
              <div style={{ marginTop: 20, padding: 16, borderRadius: 12, background: '#27272a', border: '1px solid #3f3f46' }}>
                <div style={{ fontSize: 11, color: '#71717a', fontWeight: 700, marginBottom: 10, textTransform: 'uppercase' }}>معاينة الشريط العلوي</div>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                  <span style={{ color: '#D4A017', fontSize: 13, fontWeight: 600 }}>📞 {draft.ar.footer.phone1 || '—'}</span>
                  <span style={{ color: '#D4A017', fontSize: 13, fontWeight: 600 }}>📞 {draft.ar.footer.phone2 || '—'}</span>
                </div>
              </div>
            </div>

            {/* Social media */}
            <div style={s.section}>
              <h2 style={s.sectionTitle}>🌐 روابط التواصل الاجتماعي</h2>
              <p style={{ fontSize: 12, color: '#52525b', marginBottom: 18 }}>اتركها فارغة إذا لم تكن تستخدم المنصة — لن تظهر في الموقع</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
                {[
                  { key: 'facebook',  label: 'Facebook',  icon: '📘', placeholder: 'https://facebook.com/yourpage', color: '#1877f2' },
                  { key: 'instagram', label: 'Instagram', icon: '📸', placeholder: 'https://instagram.com/yourprofile', color: '#e1306c' },
                  { key: 'whatsapp',  label: 'WhatsApp',  icon: '💬', placeholder: 'https://wa.me/201012345678', color: '#25d366' },
                  { key: 'tiktok',    label: 'TikTok',    icon: '🎵', placeholder: 'https://tiktok.com/@yourprofile', color: '#f1f5f9' },
                ].map(({ key, label, icon, placeholder, color }) => (
                  <div key={key}>
                    <label style={{ ...s.label, color }}>
                      {icon} {label}
                    </label>
                    <input
                      style={{ ...s.inp, borderColor: draft.ar.footer.social?.[key] ? color + '66' : '#3f3f46' }}
                      value={draft.ar.footer.social?.[key] || ''}
                      placeholder={placeholder}
                      onChange={e => {
                        const u = JSON.parse(JSON.stringify(draft))
                        if (!u.ar.footer.social) u.ar.footer.social = {}
                        u.ar.footer.social[key] = e.target.value
                        setDraft(u); setDirty(true)
                      }}
                      onFocus={e => e.target.style.borderColor = color}
                      onBlur={e => e.target.style.borderColor = draft.ar.footer.social?.[key] ? color + '66' : '#3f3f46'}
                    />
                  </div>
                ))}
              </div>

              {/* Social preview */}
              {Object.values(draft.ar.footer.social || {}).some(v => v) && (
                <div style={{ marginTop: 20, padding: 16, borderRadius: 12, background: '#27272a', border: '1px solid #3f3f46' }}>
                  <div style={{ fontSize: 11, color: '#71717a', fontWeight: 700, marginBottom: 12, textTransform: 'uppercase' }}>معاينة أيقونات السوشيال ميديا</div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {[
                      { key: 'facebook', label: 'Facebook', color: '#1877f2' },
                      { key: 'instagram', label: 'Instagram', color: '#e1306c' },
                      { key: 'whatsapp', label: 'WhatsApp', color: '#25d366' },
                      { key: 'tiktok', label: 'TikTok', color: '#f1f5f9' },
                    ].filter(s => draft.ar.footer.social?.[s.key]).map(({ key, label, color }) => (
                      <div key={key} style={{ padding: '6px 14px', borderRadius: 10, background: `${color}22`, border: `1px solid ${color}44`, color, fontSize: 12, fontWeight: 700 }}>
                        {label} ✓
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB: HERO ── */}
        {tab === 'hero' && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>🎬 البطل الرئيسي</h2>
            
            {/* Badge */}
            <div style={{ marginBottom: 16 }}>
              <label style={s.label}>الشارة</label>
              <input style={s.inp} value={draft.ar.hero?.badge || ''}
                onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.hero) u.ar.hero = {}; u.ar.hero.badge = e.target.value; setDraft(u); setDirty(true) }}
                onFocus={e => e.target.style.borderColor = '#D4A017'}
                onBlur={e => e.target.style.borderColor = '#3f3f46'} />
            </div>

            {/* Headline */}
            <div style={{ marginBottom: 16 }}>
              <label style={s.label}>العنوان (سطرين)</label>
              <textarea rows={2} style={{ ...s.inp, resize: 'vertical' }}
                value={(draft.ar.hero?.headline || '').replace(/\\n/g, '\n')}
                onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.hero) u.ar.hero = {}; u.ar.hero.headline = e.target.value; setDraft(u); setDirty(true) }}
                onFocus={e => e.target.style.borderColor = '#D4A017'}
                onBlur={e => e.target.style.borderColor = '#3f3f46'} />
              <p style={{ fontSize: 11, color: '#52525b', marginTop: 4 }}>استخدم \\n للفاصل بين السطرين</p>
            </div>

            {/* Sub */}
            <div style={{ marginBottom: 16 }}>
              <label style={s.label}>الوصف</label>
              <textarea rows={2} style={{ ...s.inp, resize: 'vertical' }}
                value={draft.ar.hero?.sub || ''}
                onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.hero) u.ar.hero = {}; u.ar.hero.sub = e.target.value; setDraft(u); setDirty(true) }}
                onFocus={e => e.target.style.borderColor = '#D4A017'}
                onBlur={e => e.target.style.borderColor = '#3f3f46'} />
            </div>

            {/* CTA Button Text */}
            <div style={{ marginBottom: 16 }}>
              <label style={s.label}>نص زر العرض (CTA)</label>
              <input style={s.inp} value={draft.ar.hero?.cta || ''}
                onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.hero) u.ar.hero = {}; u.ar.hero.cta = e.target.value; setDraft(u); setDirty(true) }}
                onFocus={e => e.target.style.borderColor = '#D4A017'}
                onBlur={e => e.target.style.borderColor = '#3f3f46'} />
            </div>

            {/* CTA Sub */}
            <div style={{ marginBottom: 16 }}>
              <label style={s.label}>نص فرعي للزر</label>
              <input style={s.inp} value={draft.ar.hero?.ctaSub || ''}
                onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.hero) u.ar.hero = {}; u.ar.hero.ctaSub = e.target.value; setDraft(u); setDirty(true) }}
                onFocus={e => e.target.style.borderColor = '#D4A017'}
                onBlur={e => e.target.style.borderColor = '#3f3f46'} />
            </div>

            {/* Stats */}
            <div>
              <label style={s.label}>الإحصائيات (3 عناصر)</label>
              {(draft.ar.hero?.stats || []).map(([v, l], i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                  <input style={s.inp} value={v} placeholder="القيمة"
                    onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.hero) u.ar.hero = { stats: [] }; u.ar.hero.stats[i][0] = e.target.value; setDraft(u); setDirty(true) }}
                    onFocus={e => e.target.style.borderColor = '#D4A017'}
                    onBlur={e => e.target.style.borderColor = '#3f3f46'} />
                  <input style={s.inp} value={l} placeholder="الوصف"
                    onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.hero) u.ar.hero = { stats: [] }; u.ar.hero.stats[i][1] = e.target.value; setDraft(u); setDirty(true) }}
                    onFocus={e => e.target.style.borderColor = '#D4A017'}
                    onBlur={e => e.target.style.borderColor = '#3f3f46'} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: MEDIA ── */}
        {tab === 'media' && (
          <div style={{ display: 'grid', gap: 16 }}>

            {/* Video */}
            <div style={s.section}>
              <h2 style={s.sectionTitle}>🎬 الفيديو التعريفي</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14, marginBottom: 16 }}>
                <div>
                  <label style={s.label}>رابط الفيديو (URL)</label>
                  <input style={s.inp} value={videoDraft.src || ''} placeholder="https://..."
                    onChange={e => { setVideoDraft(v => ({ ...v, src: e.target.value })); setDirty(true) }}
                    onFocus={e => e.target.style.borderColor = '#D4A017'}
                    onBlur={e => e.target.style.borderColor = '#3f3f46'} />
                </div>
                <div>
                  <label style={s.label}>أو رفع ملف فيديو إلى ImageKit</label>
                  <IKVideoUploadBtn
                    onSuccess={url => { setVideoDraft(v => ({ ...v, src: url })); setDirty(true) }}
                    style={{ ...s.inp, cursor: 'pointer', color: '#71717a', display: 'block', textAlign: 'center' }}
                  />
                </div>
                <div>
                  <label style={s.label}>عنوان الفيديو</label>
                  <input style={s.inp} value={videoDraft.title || ''} placeholder="شاهد كيف نعمل"
                    onChange={e => { setVideoDraft(v => ({ ...v, title: e.target.value })); setDirty(true) }}
                    onFocus={e => e.target.style.borderColor = '#D4A017'}
                    onBlur={e => e.target.style.borderColor = '#3f3f46'} />
                </div>
                <div>
                  <label style={s.label}>وصف الفيديو</label>
                  <input style={s.inp} value={videoDraft.desc || ''} placeholder="وصف قصير"
                    onChange={e => { setVideoDraft(v => ({ ...v, desc: e.target.value })); setDirty(true) }}
                    onFocus={e => e.target.style.borderColor = '#D4A017'}
                    onBlur={e => e.target.style.borderColor = '#3f3f46'} />
                </div>
              </div>
              {videoDraft.src && (
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ padding: '6px 14px', borderRadius: 8, background: '#14532d', border: '1px solid #16a34a', color: '#4ade80', fontSize: 12, fontWeight: 700 }}>✅ فيديو محدد</div>
                  <button onClick={() => { setVideoDraft({ src: '', poster: '', title: '', desc: '' }); setDirty(true) }} style={s.dangerBtn}>🗑️ حذف الفيديو</button>
                </div>
              )}
            </div>

            {/* Gallery */}
            <div style={s.section}>
              <h2 style={s.sectionTitle}>🖼️ معرض الصور <span style={{ fontSize: 12, color: '#52525b', fontWeight: 600 }}>({draft.ar.gallery.items.length} صورة)</span></h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 12 }}>
                {draft.ar.gallery.items.map((img, i) => (
                  <div key={i} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #3f3f46', background: '#27272a' }}>
                    <div style={{ position: 'relative' }}>
                      <img src={img.url} alt={img.caption} loading="lazy" style={{ width: '100%', height: 100, objectFit: 'cover', display: 'block' }} />
                      <button onClick={() => {
                        const u = JSON.parse(JSON.stringify(draft))
                        u.ar.gallery.items.splice(i, 1)
                        setDraft(u); setDirty(true)
                      }} style={{ position: 'absolute', top: 6, left: 6, width: 24, height: 24, borderRadius: '50%', background: '#7f1d1d', border: 'none', color: '#fca5a5', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                    </div>
                    <div style={{ padding: '8px' }}>
                      <input style={{ ...s.inp, fontSize: 11, padding: '5px 8px', marginBottom: 6 }}
                        value={img.caption}
                        onChange={e => {
                          const u = JSON.parse(JSON.stringify(draft))
                          u.ar.gallery.items[i].caption = e.target.value
                          setDraft(u); setDirty(true)
                        }} />
                      <IKUploadBtn label="🔄 تغيير"
                        onSuccess={url => {
                          const u = JSON.parse(JSON.stringify(draft))
                          u.ar.gallery.items[i].url = url
                          setDraft(u); setDirty(true)
                        }}
                        style={{ width: '100%', padding: '5px', background: '#3f3f46', borderRadius: 6, color: '#a1a1aa', fontSize: 11, cursor: 'pointer', textAlign: 'center', border: 'none', display: 'block' }}
                      />
                    </div>
                  </div>
                ))}

                {/* Add new */}
                <IKUploadBtn
                  label={<div style={{ textAlign: 'center' }}><div style={{ fontSize: 28, marginBottom: 4 }}>+</div><div style={{ fontSize: 12 }}>إضافة صورة (أو أكثر)</div></div>}
                  multiple={true}
                  onSuccess={url => {
                    const u = JSON.parse(JSON.stringify(draft))
                    u.ar.gallery.items.push({ url, caption: 'صورة جديدة' })
                    setDraft(u); setDirty(true)
                  }}
                  style={{ borderRadius: 12, border: '2px dashed #3f3f46', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, cursor: 'pointer', color: '#52525b', minHeight: 140, background: 'transparent' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: POPUP ── */}
        {tab === 'popup' && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>🎁 العرض المنبثق (البوب أب)</h2>
            <p style={{ fontSize: 13, color: '#52525b', marginBottom: 20 }}>
              هذا العرض يظهر لمرة واحدة لكل زائر عند دخوله للموقع
            </p>
            
            {/* Enable/Disable */}
            <div style={{ marginBottom: 24, padding: 16, borderRadius: 12, background: '#27272a', border: '1px solid #3f3f46' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                <input type="checkbox" checked={draft.ar.popup?.enabled || false}
                  onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.popup) u.ar.popup = {}; u.ar.popup.enabled = e.target.checked; setDraft(u); setDirty(true) }}
                  style={{ width: 20, height: 20, accentColor: '#D4A017' }} />
                <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>تفعيل العرض المنبثق</span>
              </label>
            </div>

            {/* Title */}
            <div style={{ marginBottom: 16 }}>
              <label style={s.label}>عنوان العرض</label>
              <input style={s.inp} value={draft.ar.popup?.title || ''}
                placeholder="مثال: خصم 15% على أول عملية نقل!"
                onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.popup) u.ar.popup = {}; u.ar.popup.title = e.target.value; setDraft(u); setDirty(true) }}
                onFocus={e => e.target.style.borderColor = '#D4A017'}
                onBlur={e => e.target.style.borderColor = '#3f3f46'} />
            </div>

            {/* Description */}
            <div style={{ marginBottom: 16 }}>
              <label style={s.label}>وصف العرض</label>
              <textarea rows={3} style={{ ...s.inp, resize: 'vertical' }}
                value={draft.ar.popup?.desc || ''}
                placeholder="اكتب وصفاً مختصراً وجذاباً للعرض..."
                onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.popup) u.ar.popup = {}; u.ar.popup.desc = e.target.value; setDraft(u); setDirty(true) }}
                onFocus={e => e.target.style.borderColor = '#D4A017'}
                onBlur={e => e.target.style.borderColor = '#3f3f46'} />
            </div>

            {/* Button text */}
            <div style={{ marginBottom: 16 }}>
              <label style={s.label}>نص الزر</label>
              <input style={s.inp} value={draft.ar.popup?.button || ''}
                placeholder="مثال: احجز الآن واحصل على الخصم"
                onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.popup) u.ar.popup = {}; u.ar.popup.button = e.target.value; setDraft(u); setDirty(true) }}
                onFocus={e => e.target.style.borderColor = '#D4A017'}
                onBlur={e => e.target.style.borderColor = '#3f3f46'} />
            </div>

            {/* Timer hours */}
            <div style={{ marginBottom: 16 }}>
              <label style={s.label}>مدة العرض (بالساعات)</label>
              <input type="number" min="1" max="168" style={s.inp}
                value={draft.ar.popup?.timerHours || 48}
                onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.popup) u.ar.popup = {}; u.ar.popup.timerHours = parseInt(e.target.value) || 48; setDraft(u); setDirty(true) }}
                onFocus={e => e.target.style.borderColor = '#D4A017'}
                onBlur={e => e.target.style.borderColor = '#3f3f46'} />
              <p style={{ fontSize: 11, color: '#52525b', marginTop: 4 }}>العد التنازلي يظهر للزائر استناداً إلى هذا الرقم</p>
            </div>

            {/* Background image */}
            <div>
              <label style={s.label}>صورة الخلفية (اختياري)</label>
              {draft.ar.popup?.bgImage ? (
                <div style={{ position: 'relative', marginBottom: 8 }}>
                  <img src={draft.ar.popup.bgImage} alt="Background" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 10 }} />
                  <button onClick={() => { const u = JSON.parse(JSON.stringify(draft)); u.ar.popup.bgImage = ''; setDraft(u); setDirty(true) }}
                    style={{ position: 'absolute', top: 6, left: 6, width: 28, height: 28, borderRadius: '50%', background: '#7f1d1d', border: 'none', color: '#fca5a5', cursor: 'pointer', fontSize: 16 }}>×</button>
                </div>
              ) : null}
              <IKUploadBtn
                label="📤 رفع صورة من الجهاز"
                onSuccess={url => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.popup) u.ar.popup = {}; u.ar.popup.bgImage = url; setDraft(u); setDirty(true) }}
                style={{ width: '100%', padding: 12, background: '#27272a', borderRadius: 10, color: '#a1a1aa', fontSize: 13, cursor: 'pointer', textAlign: 'center', border: '1px dashed #3f3f46', display: 'block' }}
              />
              <p style={{ fontSize: 11, color: '#52525b', marginTop: 4 }}>اتركه فارغاً لاستخدام الخلفية الافتراضية</p>
            </div>

            {/* Preview */}
            <div style={{ marginTop: 24, padding: 16, borderRadius: 12, background: '#27272a', border: '1px solid #3f3f46' }}>
              <div style={{ fontSize: 11, color: '#71717a', fontWeight: 700, marginBottom: 10, textTransform: 'uppercase' }}>معاينة</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 30, background: '#1a1a1a', borderRadius: 10 }}>
                <div style={{ textAlign: 'center', color: '#71717a', fontSize: 14 }}>
                  <div style={{ marginBottom: 8 }}>🎁</div>
                  <div>{draft.ar.popup?.title || 'عنوان العرض'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: SLIDER ── */}
        {tab === 'slider' && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>🖼️ عرض الشرائح (السلايدر)</h2>
            <p style={{ fontSize: 13, color: '#52525b', marginBottom: 20 }}>
              الصور التي تظهر في السلايدر الرئيسي بالموقع
            </p>

            {/* Section Title */}
            <div style={{ marginBottom: 16 }}>
              <label style={s.label}>عنوان القسم</label>
              <input style={s.inp} value={draft.ar.slider?.title || ''}
                onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.slider) u.ar.slider = {}; u.ar.slider.title = e.target.value; setDraft(u); setDirty(true) }}
                onFocus={e => e.target.style.borderColor = '#D4A017'}
                onBlur={e => e.target.style.borderColor = '#3f3f46'} />
            </div>

            {/* Slider Images */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 12 }}>
              {(draft.ar.slider?.items || []).map((img, i) => (
                <div key={i} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #3f3f46', background: '#27272a' }}>
                  <div style={{ position: 'relative' }}>
                    <img src={img.url} alt={img.caption} loading="lazy" style={{ width: '100%', height: 100, objectFit: 'cover', display: 'block' }} />
                    <button onClick={() => {
                      const u = JSON.parse(JSON.stringify(draft))
                      if (!u.ar.slider) u.ar.slider = { items: [] }
                      u.ar.slider.items.splice(i, 1)
                      setDraft(u); setDirty(true)
                    }} style={{ position: 'absolute', top: 6, left: 6, width: 24, height: 24, borderRadius: '50%', background: '#7f1d1d', border: 'none', color: '#fca5a5', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                  </div>
                  <div style={{ padding: '8px' }}>
                    <input style={{ ...s.inp, fontSize: 11, padding: '5px 8px', marginBottom: 6 }}
                      value={img.caption}
                      onChange={e => {
                        const u = JSON.parse(JSON.stringify(draft))
                        if (!u.ar.slider) u.ar.slider = { items: [] }
                        u.ar.slider.items[i].caption = e.target.value
                        setDraft(u); setDirty(true)
                      }} />
                    <IKUploadBtn label="🔄 تغيير"
                      onSuccess={url => {
                        const u = JSON.parse(JSON.stringify(draft))
                        if (!u.ar.slider) u.ar.slider = { items: [] }
                        u.ar.slider.items[i].url = url
                        setDraft(u); setDirty(true)
                      }}
                      style={{ width: '100%', padding: '5px', background: '#3f3f46', borderRadius: 6, color: '#a1a1aa', fontSize: 11, cursor: 'pointer', textAlign: 'center', border: 'none', display: 'block' }}
                    />
                  </div>
                </div>
              ))}

              {/* Add new */}
              <IKUploadBtn
                label={<div style={{ textAlign: 'center' }}><div style={{ fontSize: 28, marginBottom: 4 }}>+</div><div style={{ fontSize: 12 }}>إضافة صورة (أو أكثر)</div></div>}
                multiple={true}
                onSuccess={url => {
                  const u = JSON.parse(JSON.stringify(draft))
                  if (!u.ar.slider) u.ar.slider = { title: 'معرض الصور المتحرك', items: [] }
                  u.ar.slider.items.push({ url, caption: 'صورة جديدة' })
                  setDraft(u); setDirty(true)
                }}
                style={{ borderRadius: 12, border: '2px dashed #3f3f46', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, cursor: 'pointer', color: '#52525b', minHeight: 140, background: 'transparent' }}
              />
            </div>
          </div>
        )}

        {/* ── TAB: SERVICES ── */}
        {tab === 'services' && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>🛠️ خدماتنا</h2>
            
            {/* Section Title & Subtitle */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div>
                <label style={s.label}>عنوان القسم</label>
                <input style={s.inp} value={draft.ar.services?.title || ''}
                  onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.services) u.ar.services = { title: '', sub: '', items: [] }; u.ar.services.title = e.target.value; setDraft(u); setDirty(true) }}
                  onFocus={e => e.target.style.borderColor = '#D4A017'}
                  onBlur={e => e.target.style.borderColor = '#3f3f46'} />
              </div>
              <div>
                <label style={s.label}>النص الفرعي</label>
                <input style={s.inp} value={draft.ar.services?.sub || ''}
                  onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.services) u.ar.services = { title: '', sub: '', items: [] }; u.ar.services.sub = e.target.value; setDraft(u); setDirty(true) }}
                  onFocus={e => e.target.style.borderColor = '#D4A017'}
                  onBlur={e => e.target.style.borderColor = '#3f3f46'} />
              </div>
            </div>

            {/* Services Items */}
            <div style={{ display: 'grid', gap: 16 }}>
              {(draft.ar.services?.items || []).map((item, i) => (
                <div key={i} style={{ background: '#27272a', borderRadius: 14, padding: 18, border: '1px solid #3f3f46', position: 'relative' }}>
                  <button onClick={() => {
                    const u = JSON.parse(JSON.stringify(draft))
                    u.ar.services.items.splice(i, 1)
                    setDraft(u); setDirty(true)
                  }} style={{ ...s.dangerBtn, position: 'absolute', top: 12, left: 12 }}>حذف</button>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12 }}>
                    <div>
                      <label style={s.label}>الأيقونة (emoji)</label>
                      <input style={s.inp} value={item.icon}
                        onChange={e => { const u = JSON.parse(JSON.stringify(draft)); u.ar.services.items[i].icon = e.target.value; setDraft(u); setDirty(true) }}
                        onFocus={e => e.target.style.borderColor = '#D4A017'}
                        onBlur={e => e.target.style.borderColor = '#3f3f46'} />
                    </div>
                    <div>
                      <label style={s.label}>العنوان</label>
                      <input style={s.inp} value={item.title}
                        onChange={e => { const u = JSON.parse(JSON.stringify(draft)); u.ar.services.items[i].title = e.target.value; setDraft(u); setDirty(true) }}
                        onFocus={e => e.target.style.borderColor = '#D4A017'}
                        onBlur={e => e.target.style.borderColor = '#3f3f46'} />
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <label style={s.label}>الوصف</label>
                    <textarea rows={2} style={{ ...s.inp, resize: 'vertical' }} value={item.desc}
                      onChange={e => { const u = JSON.parse(JSON.stringify(draft)); u.ar.services.items[i].desc = e.target.value; setDraft(u); setDirty(true) }}
                      onFocus={e => e.target.style.borderColor = '#D4A017'}
                      onBlur={e => e.target.style.borderColor = '#3f3f46'} />
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <label style={s.label}>صورة الخدمة (اختياري)</label>
                    {item.image && (
                      <div style={{ position: 'relative', marginBottom: 8, display: 'inline-block' }}>
                        <img src={item.image} alt="" style={{ width: 200, height: 120, objectFit: 'cover', borderRadius: 10 }} />
                        <button onClick={() => { const u = JSON.parse(JSON.stringify(draft)); u.ar.services.items[i].image = ''; setDraft(u); setDirty(true) }}
                          style={{ position: 'absolute', top: 4, left: 4, width: 24, height: 24, borderRadius: '50%', background: '#7f1d1d', border: 'none', color: '#fca5a5', cursor: 'pointer', fontSize: 14 }}>×</button>
                      </div>
                    )}
                    <IKUploadBtn label="📤 رفع صورة"
                      onSuccess={url => {
                        const u = JSON.parse(JSON.stringify(draft))
                        u.ar.services.items[i].image = url
                        setDraft(u); setDirty(true)
                      }}
                      style={{ width: '100%', padding: 12, background: '#27272a', borderRadius: 10, color: '#a1a1aa', fontSize: 13, cursor: 'pointer', textAlign: 'center', border: '1px dashed #3f3f46', display: 'block' }}
                    />
                  </div>
                </div>
              ))}

              {/* Add new service */}
              <button onClick={() => {
                const u = JSON.parse(JSON.stringify(draft))
                if (!u.ar.services) u.ar.services = { title: 'خدماتنا', sub: 'حلول نقل شاملة', items: [] }
                u.ar.services.items.push({ icon: '🚛', title: 'خدمة جديدة', desc: 'وصف الخدمة هنا' })
                setDraft(u); setDirty(true)
              }} style={{ padding: 16, borderRadius: 14, border: '2px dashed #3f3f46', background: 'transparent', color: '#52525b', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
                + إضافة خدمة جديدة
              </button>
            </div>
          </div>
        )}

        {/* ── TAB: OFFERS ── */}
        {tab === 'offers' && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>💰 العروض والباقات</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div>
                <label style={s.label}>عنوان القسم</label>
                <input style={s.inp} value={draft.ar.offers?.title || ''}
                  onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.offers) u.ar.offers = {}; u.ar.offers.title = e.target.value; setDraft(u); setDirty(true) }} />
              </div>
              <div>
                <label style={s.label}>النص الفرعي</label>
                <input style={s.inp} value={draft.ar.offers?.sub || ''}
                  onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.offers) u.ar.offers = {}; u.ar.offers.sub = e.target.value; setDraft(u); setDirty(true) }} />
              </div>
            </div>
            <div style={{ display: 'grid', gap: 16 }}>
              {draft.ar.offers.items.map((o, i) => (
                <div key={i} style={{ background: '#27272a', borderRadius: 14, padding: 18, border: `1px solid ${o.color}44`, position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, left: 0, height: 3, borderRadius: '14px 14px 0 0', background: o.color }} />
                  <button onClick={() => {
                    const u = JSON.parse(JSON.stringify(draft))
                    u.ar.offers.items.splice(i, 1)
                    setDraft(u); setDirty(true)
                  }} style={{ ...s.dangerBtn, position: 'absolute', top: 12, left: 12 }}>حذف</button>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={s.label}>العنوان</label>
                      <input style={s.inp} value={o.title}
                        onChange={e => { const u = JSON.parse(JSON.stringify(draft)); u.ar.offers.items[i].title = e.target.value; setDraft(u); setDirty(true) }}
                        onFocus={e => e.target.style.borderColor = o.color}
                        onBlur={e => e.target.style.borderColor = '#3f3f46'} />
                    </div>
                    <div>
                      <label style={s.label}>الشارة</label>
                      <input style={s.inp} value={o.badge}
                        onChange={e => { const u = JSON.parse(JSON.stringify(draft)); u.ar.offers.items[i].badge = e.target.value; setDraft(u); setDirty(true) }}
                        onFocus={e => e.target.style.borderColor = o.color}
                        onBlur={e => e.target.style.borderColor = '#3f3f46'} />
                    </div>
                    <div>
                      <label style={s.label}>السعر / العرض</label>
                      <input style={s.inp} value={o.price}
                        onChange={e => { const u = JSON.parse(JSON.stringify(draft)); u.ar.offers.items[i].price = e.target.value; setDraft(u); setDirty(true) }}
                        onFocus={e => e.target.style.borderColor = o.color}
                        onBlur={e => e.target.style.borderColor = '#3f3f46'} />
                    </div>
                    <div>
                      <label style={s.label}>اللون</label>
                      <input type="color" style={{ width: '100%', height: 42, borderRadius: 10, border: 'none', cursor: 'pointer', background: 'none' }}
                        value={o.color}
                        onChange={e => { const u = JSON.parse(JSON.stringify(draft)); u.ar.offers.items[i].color = e.target.value; setDraft(u); setDirty(true) }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <label style={s.label}>الوصف المختصر</label>
                    <input style={s.inp} value={o.desc}
                      onChange={e => { const u = JSON.parse(JSON.stringify(draft)); u.ar.offers.items[i].desc = e.target.value; setDraft(u); setDirty(true) }}
                      onFocus={e => e.target.style.borderColor = o.color}
                      onBlur={e => e.target.style.borderColor = '#3f3f46'} />
                  </div>

                  <div>
                    <label style={s.label}>مميزات الباقة — سطر لكل ميزة</label>
                    <textarea rows={6} style={{ ...s.inp, resize: 'vertical', fontSize: 13, lineHeight: 1.9 }}
                      value={(o.features || []).join('\n')}
                      placeholder={'نقل الأثاث كاملاً\nشاحنة مجهزة\nفريق متدرب\nتسليم في نفس اليوم'}
                      onChange={e => {
                        const u = JSON.parse(JSON.stringify(draft))
                        u.ar.offers.items[i].features = e.target.value.split('\n').filter(f => f.trim())
                        setDraft(u); setDirty(true)
                      }}
                      onFocus={e => e.target.style.borderColor = o.color}
                      onBlur={e => e.target.style.borderColor = '#3f3f46'} />
                    <p style={{ fontSize: 11, color: '#52525b', marginTop: 4 }}>كل سطر = ميزة واحدة تظهر في الكارد</p>
                  </div>
                </div>
              ))}

              <button onClick={() => {
                const u = JSON.parse(JSON.stringify(draft))
                u.ar.offers.items.push({ badge: 'جديد', color: '#6366f1', title: 'عرض جديد', price: 'تواصل معنا', desc: 'وصف العرض هنا', features: ['ميزة ١', 'ميزة ٢'] })
                setDraft(u); setDirty(true)
              }} style={{ padding: 16, borderRadius: 14, border: '2px dashed #3f3f46', background: 'transparent', color: '#52525b', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
                + إضافة عرض جديد
              </button>
            </div>
          </div>
        )}

        {/* ── TAB: SPECIAL SERVICES ── */}
        {tab === 'special' && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>⭐ الخدمات المتخصصة</h2>
            <div style={{ display: 'grid', gap: 14 }}>
              {(draft.ar.specialServices?.items || []).map((item, i) => (
                <div key={i} style={{ background: '#27272a', borderRadius: 14, padding: 18, border: '1px solid #3f3f46', position: 'relative' }}>
                  <button onClick={() => {
                    const u = JSON.parse(JSON.stringify(draft))
                    u.ar.specialServices.items.splice(i, 1)
                    setDraft(u); setDirty(true)
                  }} style={{ ...s.dangerBtn, position: 'absolute', top: 12, left: 12 }}>حذف</button>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
                    <div>
                      <label style={s.label}>الأيقونة (emoji)</label>
                      <input style={s.inp} value={item.icon}
                        onChange={e => { const u = JSON.parse(JSON.stringify(draft)); u.ar.specialServices.items[i].icon = e.target.value; setDraft(u); setDirty(true) }}
                        onFocus={e => e.target.style.borderColor = '#D4A017'}
                        onBlur={e => e.target.style.borderColor = '#3f3f46'} />
                    </div>
                    <div>
                      <label style={s.label}>العنوان</label>
                      <input style={s.inp} value={item.title}
                        onChange={e => { const u = JSON.parse(JSON.stringify(draft)); u.ar.specialServices.items[i].title = e.target.value; setDraft(u); setDirty(true) }}
                        onFocus={e => e.target.style.borderColor = '#D4A017'}
                        onBlur={e => e.target.style.borderColor = '#3f3f46'} />
                    </div>
                    <div>
                      <label style={s.label}>الشارة (tag)</label>
                      <input style={s.inp} value={item.tag || ''}
                        placeholder="مثال: خدمة مميزة"
                        onChange={e => { const u = JSON.parse(JSON.stringify(draft)); u.ar.specialServices.items[i].tag = e.target.value; setDraft(u); setDirty(true) }}
                        onFocus={e => e.target.style.borderColor = '#D4A017'}
                        onBlur={e => e.target.style.borderColor = '#3f3f46'} />
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <label style={s.label}>الوصف</label>
                    <textarea rows={2} style={{ ...s.inp, resize: 'vertical' }} value={item.desc}
                      onChange={e => { const u = JSON.parse(JSON.stringify(draft)); u.ar.specialServices.items[i].desc = e.target.value; setDraft(u); setDirty(true) }}
                      onFocus={e => e.target.style.borderColor = '#D4A017'}
                      onBlur={e => e.target.style.borderColor = '#3f3f46'} />
                  </div>
                </div>
              ))}

              <button onClick={() => {
                const u = JSON.parse(JSON.stringify(draft))
                if (!u.ar.specialServices) u.ar.specialServices = { title: 'خدمات متخصصة', sub: 'نتعامل مع الحالات الخاصة باحترافية', items: [] }
                u.ar.specialServices.items.push({ icon: '⭐', title: 'خدمة جديدة', desc: 'وصف الخدمة هنا', tag: 'مميز' })
                setDraft(u); setDirty(true)
              }} style={{ padding: 16, borderRadius: 14, border: '2px dashed #3f3f46', background: 'transparent', color: '#52525b', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
                + إضافة خدمة متخصصة
              </button>
            </div>

            {/* Section title/subtitle control */}
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #3f3f46', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={s.label}>عنوان القسم</label>
                <input style={s.inp} value={draft.ar.specialServices?.title || ''}
                  onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.specialServices) u.ar.specialServices = { items: [] }; u.ar.specialServices.title = e.target.value; setDraft(u); setDirty(true) }}
                  onFocus={e => e.target.style.borderColor = '#D4A017'}
                  onBlur={e => e.target.style.borderColor = '#3f3f46'} />
              </div>
              <div>
                <label style={s.label}>النص الفرعي</label>
                <input style={s.inp} value={draft.ar.specialServices?.sub || ''}
                  onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.specialServices) u.ar.specialServices = { items: [] }; u.ar.specialServices.sub = e.target.value; setDraft(u); setDirty(true) }}
                  onFocus={e => e.target.style.borderColor = '#D4A017'}
                  onBlur={e => e.target.style.borderColor = '#3f3f46'} />
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: TESTIMONIALS ── */}
        {tab === 'testimonials' && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>⭐ تقييمات العملاء</h2>
            <div style={{ display: 'grid', gap: 14 }}>
              {draft.ar.testimonials.items.map((item, i) => (
                <div key={i} style={{ background: '#27272a', borderRadius: 14, padding: 18, border: '1px solid #3f3f46', position: 'relative' }}>
                  <button onClick={() => {
                    const u = JSON.parse(JSON.stringify(draft))
                    u.ar.testimonials.items.splice(i, 1)
                    setDraft(u); setDirty(true)
                  }} style={{ ...s.dangerBtn, position: 'absolute', top: 12, left: 12 }}>حذف</button>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={s.label}>اسم العميل</label>
                      <input style={s.inp} value={item.name}
                        onChange={e => {
                          const u = JSON.parse(JSON.stringify(draft))
                          u.ar.testimonials.items[i].name = e.target.value
                          setDraft(u); setDirty(true)
                        }}
                        onFocus={e => e.target.style.borderColor = '#D4A017'}
                        onBlur={e => e.target.style.borderColor = '#3f3f46'} />
                    </div>
                    <div>
                      <label style={s.label}>المنطقة / الدور</label>
                      <input style={s.inp} value={item.role}
                        onChange={e => {
                          const u = JSON.parse(JSON.stringify(draft))
                          u.ar.testimonials.items[i].role = e.target.value
                          setDraft(u); setDirty(true)
                        }}
                        onFocus={e => e.target.style.borderColor = '#D4A017'}
                        onBlur={e => e.target.style.borderColor = '#3f3f46'} />
                    </div>
                    <div>
                      <label style={s.label}>التقييم (١–٥)</label>
                      <select style={s.inp} value={item.rating}
                        onChange={e => {
                          const u = JSON.parse(JSON.stringify(draft))
                          u.ar.testimonials.items[i].rating = Number(e.target.value)
                          setDraft(u); setDirty(true)
                        }}>
                        {[5,4,3,2,1].map(n => <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={s.label}>نص التقييم</label>
                    <textarea rows={3} style={{ ...s.inp, resize: 'vertical' }} value={item.text}
                      onChange={e => {
                        const u = JSON.parse(JSON.stringify(draft))
                        u.ar.testimonials.items[i].text = e.target.value
                        setDraft(u); setDirty(true)
                      }}
                      onFocus={e => e.target.style.borderColor = '#D4A017'}
                      onBlur={e => e.target.style.borderColor = '#3f3f46'} />
                  </div>
                </div>
              ))}

              {/* Add new testimonial */}
              <button onClick={() => {
                const u = JSON.parse(JSON.stringify(draft))
                u.ar.testimonials.items.push({ name: 'عميل جديد', role: 'القاهرة', text: 'اكتب تقييم العميل هنا...', rating: 5 })
                setDraft(u); setDirty(true)
              }} style={{ padding: 16, borderRadius: 14, border: '2px dashed #3f3f46', background: 'transparent', color: '#52525b', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
                + إضافة تقييم جديد
              </button>
            </div>
          </div>
        )}

        {/* ── TAB: PRICING FACTORS ── */}
        {tab === 'pricing' && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>📊 كيفية التسعير</h2>
            <p style={{ fontSize: 13, color: '#52525b', marginBottom: 20 }}>العوامل التي نعتمد عليها في تحديد سعر النقل</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div>
                <label style={s.label}>عنوان القسم</label>
                <input style={s.inp} value={draft.ar.pricing?.title || ''}
                  onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.pricing) u.ar.pricing = {}; u.ar.pricing.title = e.target.value; setDraft(u); setDirty(true) }} />
              </div>
              <div>
                <label style={s.label}>النص الفرعي</label>
                <input style={s.inp} value={draft.ar.pricing?.sub || ''}
                  onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.pricing) u.ar.pricing = {}; u.ar.pricing.sub = e.target.value; setDraft(u); setDirty(true) }} />
              </div>
            </div>
            <div style={{ display: 'grid', gap: 14 }}>
              {(draft.ar.pricing?.factors || []).map((f, i) => (
                <div key={i} style={{ background: '#27272a', borderRadius: 14, padding: 16, border: '1px solid #3f3f46', position: 'relative' }}>
                  <button onClick={() => {
                    const u = JSON.parse(JSON.stringify(draft))
                    u.ar.pricing.factors.splice(i, 1)
                    setDraft(u); setDirty(true)
                  }} style={{ ...s.dangerBtn, position: 'absolute', top: 12, left: 12 }}>حذف</button>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12 }}>
                    <div>
                      <label style={s.label}>اﻷيقونة</label>
                      <input style={s.inp} value={f.icon} onChange={e => { const u = JSON.parse(JSON.stringify(draft)); u.ar.pricing.factors[i].icon = e.target.value; setDraft(u); setDirty(true) }} />
                    </div>
                    <div>
                      <label style={s.label}>العنوان</label>
                      <input style={s.inp} value={f.label} onChange={e => { const u = JSON.parse(JSON.stringify(draft)); u.ar.pricing.factors[i].label = e.target.value; setDraft(u); setDirty(true) }} />
                    </div>
                    <div>
                      <label style={s.label}>الوصف</label>
                      <input style={s.inp} value={f.desc} onChange={e => { const u = JSON.parse(JSON.stringify(draft)); u.ar.pricing.factors[i].desc = e.target.value; setDraft(u); setDirty(true) }} />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => {
                const u = JSON.parse(JSON.stringify(draft))
                if (!u.ar.pricing) u.ar.pricing = { title: '', sub: '', factors: [] }
                u.ar.pricing.factors.push({ icon: '📏', label: 'عامل جديد', desc: 'وصف العامل هنا', bg: '#eef2ff', col: '#4338ca' })
                setDraft(u); setDirty(true)
              }} style={{ padding: 12, borderRadius: 12, border: '2px dashed #3f3f46', background: 'transparent', color: '#52525b', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                + إضافة عامل تسعير
              </button>
            </div>
          </div>
        )}

        {/* ── TAB: TRUST ── */}
        {tab === 'trust' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={s.section}>
              <h2 style={s.sectionTitle}>🏆 شارات الثقة</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                <div>
                  <label style={s.label}>عنوان القسم</label>
                  <input style={s.inp} value={draft.ar.trust?.title || ''}
                    onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.trust) u.ar.trust = {}; u.ar.trust.title = e.target.value; setDraft(u); setDirty(true) }} />
                </div>
                <div>
                  <label style={s.label}>النص الفرعي</label>
                  <input style={s.inp} value={draft.ar.trust?.sub || ''}
                    onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.trust) u.ar.trust = {}; u.ar.trust.sub = e.target.value; setDraft(u); setDirty(true) }} />
                </div>
              </div>
              <p style={{ fontSize: 12, color: '#52525b', marginBottom: 14 }}>الشارات — تظهر في أعلى القسم</p>
              {(draft.ar.trust?.badges || []).map((b, i) => (
                <div key={i} style={{ background: '#27272a', borderRadius: 12, padding: 14, border: '1px solid #3f3f46', marginBottom: 10, position: 'relative' }}>
                  <button onClick={() => { const u = JSON.parse(JSON.stringify(draft)); u.ar.trust.badges.splice(i, 1); setDraft(u); setDirty(true) }}
                    style={{ ...s.dangerBtn, position: 'absolute', top: 10, left: 10 }}>حذف</button>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 10 }}>
                    <div>
                      <label style={s.label}>اﻷيقونة</label>
                      <input style={s.inp} value={b.icon} onChange={e => { const u = JSON.parse(JSON.stringify(draft)); u.ar.trust.badges[i].icon = e.target.value; setDraft(u); setDirty(true) }} />
                    </div>
                    <div>
                      <label style={s.label}>الرقم</label>
                      <input style={s.inp} value={b.num} onChange={e => { const u = JSON.parse(JSON.stringify(draft)); u.ar.trust.badges[i].num = e.target.value; setDraft(u); setDirty(true) }} />
                    </div>
                    <div>
                      <label style={s.label}>التسمية</label>
                      <input style={s.inp} value={b.label} onChange={e => { const u = JSON.parse(JSON.stringify(draft)); u.ar.trust.badges[i].label = e.target.value; setDraft(u); setDirty(true) }} />
                    </div>
                    <div>
                      <label style={s.label}>الوصف</label>
                      <input style={s.inp} value={b.desc} onChange={e => { const u = JSON.parse(JSON.stringify(draft)); u.ar.trust.badges[i].desc = e.target.value; setDraft(u); setDirty(true) }} />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => {
                const u = JSON.parse(JSON.stringify(draft))
                if (!u.ar.trust) u.ar.trust = { title: '', sub: '', badges: [], guarantees: [] }
                u.ar.trust.badges.push({ icon: '✅', num: '999+', label: 'جديد', desc: 'وصف' })
                setDraft(u); setDirty(true)
              }} style={{ padding: 10, borderRadius: 10, border: '2px dashed #3f3f46', background: 'transparent', color: '#52525b', cursor: 'pointer', fontSize: 13, fontWeight: 700, width: '100%', marginBottom: 20 }}>
                + إضافة شارة ثقة
              </button>
            </div>

            <div style={s.section}>
              <h2 style={s.sectionTitle}>🛡️ الضمانات</h2>
              <p style={{ fontSize: 12, color: '#52525b', marginBottom: 14 }}>الضمانات — تظهر أسفل شارات الثقة</p>
              {(draft.ar.trust?.guarantees || []).map((g, i) => (
                <div key={i} style={{ background: '#27272a', borderRadius: 12, padding: 14, border: '1px solid #3f3f46', marginBottom: 10, position: 'relative' }}>
                  <button onClick={() => { const u = JSON.parse(JSON.stringify(draft)); u.ar.trust.guarantees.splice(i, 1); setDraft(u); setDirty(true) }}
                    style={{ ...s.dangerBtn, position: 'absolute', top: 10, left: 10 }}>حذف</button>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 10 }}>
                    <div>
                      <label style={s.label}>اﻷيقونة</label>
                      <input style={s.inp} value={g.icon} onChange={e => { const u = JSON.parse(JSON.stringify(draft)); u.ar.trust.guarantees[i].icon = e.target.value; setDraft(u); setDirty(true) }} />
                    </div>
                    <div>
                      <label style={s.label}>العنوان</label>
                      <input style={s.inp} value={g.title} onChange={e => { const u = JSON.parse(JSON.stringify(draft)); u.ar.trust.guarantees[i].title = e.target.value; setDraft(u); setDirty(true) }} />
                    </div>
                    <div>
                      <label style={s.label}>الوصف</label>
                      <input style={s.inp} value={g.desc} onChange={e => { const u = JSON.parse(JSON.stringify(draft)); u.ar.trust.guarantees[i].desc = e.target.value; setDraft(u); setDirty(true) }} />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => {
                const u = JSON.parse(JSON.stringify(draft))
                if (!u.ar.trust) u.ar.trust = { title: '', sub: '', badges: [], guarantees: [] }
                u.ar.trust.guarantees.push({ icon: '⏰', title: 'ضمان جديد', desc: 'وصف الضمان هنا' })
                setDraft(u); setDirty(true)
              }} style={{ padding: 10, borderRadius: 10, border: '2px dashed #3f3f46', background: 'transparent', color: '#52525b', cursor: 'pointer', fontSize: 13, fontWeight: 700, width: '100%' }}>
                + إضافة ضمان
              </button>
            </div>
          </div>
        )}

        {/* ── TAB: HOW IT WORKS ── */}
        {tab === 'how' && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>📋 كيف تعمل العملية</h2>
            <p style={{ fontSize: 13, color: '#52525b', marginBottom: 20 }}>الخطوات التي يراها العميل من الحجز إلى الاستقرار</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div>
                <label style={s.label}>عنوان القسم</label>
                <input style={s.inp} value={draft.ar.howItWorks?.title || ''}
                  onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.howItWorks) u.ar.howItWorks = {}; u.ar.howItWorks.title = e.target.value; setDraft(u); setDirty(true) }} />
              </div>
              <div>
                <label style={s.label}>النص الفرعي</label>
                <input style={s.inp} value={draft.ar.howItWorks?.sub || ''}
                  onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.howItWorks) u.ar.howItWorks = {}; u.ar.howItWorks.sub = e.target.value; setDraft(u); setDirty(true) }} />
              </div>
            </div>
            <div style={{ display: 'grid', gap: 14 }}>
              {(draft.ar.howItWorks?.steps || []).map((step, i) => (
                <div key={i} style={{ background: '#27272a', borderRadius: 14, padding: 16, border: '1px solid #3f3f46', position: 'relative' }}>
                  <button onClick={() => {
                    const u = JSON.parse(JSON.stringify(draft))
                    u.ar.howItWorks.steps.splice(i, 1)
                    setDraft(u); setDirty(true)
                  }} style={{ ...s.dangerBtn, position: 'absolute', top: 12, left: 12 }}>حذف</button>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12 }}>
                    <div>
                      <label style={s.label}>الرقم</label>
                      <input style={s.inp} value={step.num} onChange={e => { const u = JSON.parse(JSON.stringify(draft)); u.ar.howItWorks.steps[i].num = e.target.value; setDraft(u); setDirty(true) }} />
                    </div>
                    <div>
                      <label style={s.label}>اﻷيقونة</label>
                      <input style={s.inp} value={step.icon} onChange={e => { const u = JSON.parse(JSON.stringify(draft)); u.ar.howItWorks.steps[i].icon = e.target.value; setDraft(u); setDirty(true) }} />
                    </div>
                    <div>
                      <label style={s.label}>العنوان</label>
                      <input style={s.inp} value={step.title} onChange={e => { const u = JSON.parse(JSON.stringify(draft)); u.ar.howItWorks.steps[i].title = e.target.value; setDraft(u); setDirty(true) }} />
                    </div>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <label style={s.label}>الوصف</label>
                    <textarea rows={2} style={{ ...s.inp, resize: 'vertical' }} value={step.desc}
                      onChange={e => { const u = JSON.parse(JSON.stringify(draft)); u.ar.howItWorks.steps[i].desc = e.target.value; setDraft(u); setDirty(true) }} />
                  </div>
                </div>
              ))}
              <button onClick={() => {
                const u = JSON.parse(JSON.stringify(draft))
                if (!u.ar.howItWorks) u.ar.howItWorks = { title: '', sub: '', steps: [] }
                u.ar.howItWorks.steps.push({ num: String(u.ar.howItWorks.steps.length + 1), icon: '📦', title: 'خطوة جديدة', desc: 'وصف الخطوة هنا' })
                setDraft(u); setDirty(true)
              }} style={{ padding: 12, borderRadius: 12, border: '2px dashed #3f3f46', background: 'transparent', color: '#52525b', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                + إضافة خطوة
              </button>
            </div>
          </div>
        )}

        {/* ── TAB: FAQ ── */}
        {tab === 'faq' && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>❓ الأسئلة الشائعة</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div>
                <label style={s.label}>عنوان القسم</label>
                <input style={s.inp} value={draft.ar.faq?.title || ''}
                  onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.faq) u.ar.faq = {}; u.ar.faq.title = e.target.value; setDraft(u); setDirty(true) }} />
              </div>
              <div>
                <label style={s.label}>النص الفرعي</label>
                <input style={s.inp} value={draft.ar.faq?.sub || ''}
                  onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.faq) u.ar.faq = {}; u.ar.faq.sub = e.target.value; setDraft(u); setDirty(true) }} />
              </div>
            </div>
            <div style={{ display: 'grid', gap: 14 }}>
              {(draft.ar.faq?.items || []).map((item, i) => (
                <div key={i} style={{ background: '#27272a', borderRadius: 14, padding: 16, border: '1px solid #3f3f46', position: 'relative' }}>
                  <button onClick={() => {
                    const u = JSON.parse(JSON.stringify(draft))
                    u.ar.faq.items.splice(i, 1)
                    setDraft(u); setDirty(true)
                  }} style={{ ...s.dangerBtn, position: 'absolute', top: 12, left: 12 }}>حذف</button>
                  <div>
                    <label style={s.label}>السؤال</label>
                    <input style={s.inp} value={item.q} placeholder="السؤال هنا"
                      onChange={e => { const u = JSON.parse(JSON.stringify(draft)); u.ar.faq.items[i].q = e.target.value; setDraft(u); setDirty(true) }} />
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <label style={s.label}>الإجابة</label>
                    <textarea rows={3} style={{ ...s.inp, resize: 'vertical' }} value={item.a} placeholder="الإجابة هنا"
                      onChange={e => { const u = JSON.parse(JSON.stringify(draft)); u.ar.faq.items[i].a = e.target.value; setDraft(u); setDirty(true) }} />
                  </div>
                </div>
              ))}
              <button onClick={() => {
                const u = JSON.parse(JSON.stringify(draft))
                if (!u.ar.faq) u.ar.faq = { title: '', sub: '', items: [] }
                u.ar.faq.items.push({ q: 'سؤال جديد', a: 'إجابة السؤال هنا...' })
                setDraft(u); setDirty(true)
              }} style={{ padding: 12, borderRadius: 12, border: '2px dashed #3f3f46', background: 'transparent', color: '#52525b', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                + إضافة سؤال
              </button>
            </div>
          </div>
        )}

        {/* ── TAB: FORM ── */}
        {tab === 'form' && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>📝 نموذج الحجز</h2>
            <p style={{ fontSize: 13, color: '#52525b', marginBottom: 20 }}>تسميات الحقول والنصوص التفاعلية في نموذج طلب عرض السعر</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div>
                <label style={s.label}>عنوان النموذج</label>
                <input style={s.inp} value={draft.ar.form?.title || ''}
                  onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.form) u.ar.form = {}; u.ar.form.title = e.target.value; setDraft(u); setDirty(true) }} />
              </div>
              <div>
                <label style={s.label}>النص الفرعي</label>
                <input style={s.inp} value={draft.ar.form?.sub || ''}
                  onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.form) u.ar.form = {}; u.ar.form.sub = e.target.value; setDraft(u); setDirty(true) }} />
              </div>
            </div>
            <div style={{ display: 'grid', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12, padding: 16, background: '#27272a', borderRadius: 12, border: '1px solid #3f3f46' }}>
                <div>
                  <label style={s.label}>تسمية الاسم</label>
                  <input style={s.inp} value={draft.ar.form?.name || ''} onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.form) u.ar.form = {}; u.ar.form.name = e.target.value; setDraft(u); setDirty(true) }} />
                </div>
                <div>
                  <label style={s.label}>مكان الاسم</label>
                  <input style={s.inp} value={draft.ar.form?.namePh || ''} onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.form) u.ar.form = {}; u.ar.form.namePh = e.target.value; setDraft(u); setDirty(true) }} />
                </div>
                <div>
                  <label style={s.label}>تسمية الهاتف</label>
                  <input style={s.inp} value={draft.ar.form?.phone || ''} onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.form) u.ar.form = {}; u.ar.form.phone = e.target.value; setDraft(u); setDirty(true) }} />
                </div>
                <div>
                  <label style={s.label}>مكان الهاتف</label>
                  <input style={s.inp} value={draft.ar.form?.phonePh || ''} onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.form) u.ar.form = {}; u.ar.form.phonePh = e.target.value; setDraft(u); setDirty(true) }} />
                </div>
                <div>
                  <label style={s.label}>تسمية "النقل من"</label>
                  <input style={s.inp} value={draft.ar.form?.from || ''} onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.form) u.ar.form = {}; u.ar.form.from = e.target.value; setDraft(u); setDirty(true) }} />
                </div>
                <div>
                  <label style={s.label}>مكان "النقل من"</label>
                  <input style={s.inp} value={draft.ar.form?.fromPh || ''} onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.form) u.ar.form = {}; u.ar.form.fromPh = e.target.value; setDraft(u); setDirty(true) }} />
                </div>
                <div>
                  <label style={s.label}>تسمية "النقل إلى"</label>
                  <input style={s.inp} value={draft.ar.form?.to || ''} onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.form) u.ar.form = {}; u.ar.form.to = e.target.value; setDraft(u); setDirty(true) }} />
                </div>
                <div>
                  <label style={s.label}>مكان "النقل إلى"</label>
                  <input style={s.inp} value={draft.ar.form?.toPh || ''} onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.form) u.ar.form = {}; u.ar.form.toPh = e.target.value; setDraft(u); setDirty(true) }} />
                </div>
                <div>
                  <label style={s.label}>تسمية التاريخ</label>
                  <input style={s.inp} value={draft.ar.form?.date || ''} onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.form) u.ar.form = {}; u.ar.form.date = e.target.value; setDraft(u); setDirty(true) }} />
                </div>
                <div>
                  <label style={s.label}>تسمية الغرف</label>
                  <input style={s.inp} value={draft.ar.form?.rooms || ''} onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.form) u.ar.form = {}; u.ar.form.rooms = e.target.value; setDraft(u); setDirty(true) }} />
                </div>
                <div>
                  <label style={s.label}>تسمية الطابق</label>
                  <input style={s.inp} value={draft.ar.form?.floor || ''} onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.form) u.ar.form = {}; u.ar.form.floor = e.target.value; setDraft(u); setDirty(true) }} />
                </div>
                <div>
                  <label style={s.label}>مكان الطابق</label>
                  <input style={s.inp} value={draft.ar.form?.floorPh || ''} onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.form) u.ar.form = {}; u.ar.form.floorPh = e.target.value; setDraft(u); setDirty(true) }} />
                </div>
                <div>
                  <label style={s.label}>تسمية الخدمات</label>
                  <input style={s.inp} value={draft.ar.form?.services || ''} onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.form) u.ar.form = {}; u.ar.form.services = e.target.value; setDraft(u); setDirty(true) }} />
                </div>
                <div>
                  <label style={s.label}>تسمية الملاحظات</label>
                  <input style={s.inp} value={draft.ar.form?.notes || ''} onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.form) u.ar.form = {}; u.ar.form.notes = e.target.value; setDraft(u); setDirty(true) }} />
                </div>
                <div>
                  <label style={s.label}>مكان الملاحظات</label>
                  <input style={s.inp} value={draft.ar.form?.notesPh || ''} onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.form) u.ar.form = {}; u.ar.form.notesPh = e.target.value; setDraft(u); setDirty(true) }} />
                </div>
                <div>
                  <label style={s.label}>نص زر الإرسال</label>
                  <input style={s.inp} value={draft.ar.form?.submit || ''} onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.form) u.ar.form = {}; u.ar.form.submit = e.target.value; setDraft(u); setDirty(true) }} />
                </div>
                <div>
                  <label style={s.label}>نص جارٍ الإرسال</label>
                  <input style={s.inp} value={draft.ar.form?.submitting || ''} onChange={e => { const u = JSON.parse(JSON.stringify(draft)); if (!u.ar.form) u.ar.form = {}; u.ar.form.submitting = e.target.value; setDraft(u); setDirty(true) }} />
                </div>
              </div>

              {/* Rooms options */}
              <div style={{ padding: 16, background: '#27272a', borderRadius: 12, border: '1px solid #3f3f46' }}>
                <label style={s.label}>خيارات عدد الغرف — سطر لكل خيار</label>
                <textarea rows={5} style={{ ...s.inp, resize: 'vertical', lineHeight: 1.9 }}
                  value={(draft.ar.form?.roomsOpts || []).join('\n')}
                  onChange={e => {
                    const u = JSON.parse(JSON.stringify(draft))
                    if (!u.ar.form) u.ar.form = {}
                    u.ar.form.roomsOpts = e.target.value.split('\n').filter(x => x.trim())
                    setDraft(u); setDirty(true)
                  }} />
                <p style={{ fontSize: 11, color: '#52525b', marginTop: 4 }}>كل سطر = خيار واحد في القائمة المنسدلة</p>
              </div>

              {/* Services options */}
              <div style={{ padding: 16, background: '#27272a', borderRadius: 12, border: '1px solid #3f3f46' }}>
                <label style={s.label}>خيارات الخدمات الإضافية — سطر لكل خيار</label>
                <textarea rows={5} style={{ ...s.inp, resize: 'vertical', lineHeight: 1.9 }}
                  value={(draft.ar.form?.servicesOpts || []).join('\n')}
                  onChange={e => {
                    const u = JSON.parse(JSON.stringify(draft))
                    if (!u.ar.form) u.ar.form = {}
                    u.ar.form.servicesOpts = e.target.value.split('\n').filter(x => x.trim())
                    setDraft(u); setDirty(true)
                  }} />
                <p style={{ fontSize: 11, color: '#52525b', marginTop: 4 }}>كل سطر = خيار واحد في القائمة المنسدلة</p>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: FOOTER ── */}
        {tab === 'footer' && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>📌 تذييل الموقع</h2>
            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={s.label}>الشعار الوصفي (tagline)</label>
                <textarea rows={2} style={{ ...s.inp, resize: 'vertical' }} value={draft.ar.footer?.tag || ''}
                  placeholder='مثال: ننقل العائلات والشركات في جميع أنحاء مصر منذ ٢٠١٨.'
                  onChange={e => updDraft('ar.footer.tag', e.target.value)} />
                <p style={{ fontSize: 11, color: '#52525b', marginTop: 4 }}>يظهر أسفل الشعار في تذييل الموقع</p>
              </div>
              <div>
                <label style={s.label}>حقوق النشر</label>
                <input style={s.inp} value={draft.ar.footer?.copy || ''}
                  placeholder='مثال: © 2026 Hilaly Moving. جميع الحقوق محفوظة.'
                  onChange={e => updDraft('ar.footer.copy', e.target.value)} />
                <p style={{ fontSize: 11, color: '#52525b', marginTop: 4 }}>يظهر في أسفل التذييل</p>
              </div>
            </div>
          </div>
        )}

        {/* Save bar — sticky at bottom */}
        {dirty && (
          <div style={{ position: 'sticky', bottom: 16, marginTop: 24, padding: '14px 20px', borderRadius: 14, background: '#18181b', border: '1px solid #D4A01755', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: 13, color: '#f59e0b', fontWeight: 700 }}>● لديك تغييرات غير محفوظة</span>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={discard} style={s.cancelBtn}>تجاهل التغييرات</button>
              <button onClick={save} style={s.saveBtn}>💾 حفظ في قاعدة البيانات</button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

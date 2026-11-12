import { useState } from 'react'
import { uploadToImageKit } from '../../ikUpload'
import { ADMIN_TOKENS as T, adminStyles as S } from './AdminTheme'

export function SectionCard({ title, subtitle, action, children, style = {} }) {
  return (
    <div style={{ ...S.card, marginBottom: 18, ...style }}>
      {(title || action) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: subtitle ? 6 : 18, flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: 15.5, fontWeight: 800, color: T.goldBright, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            {title}
          </h2>
          {action}
        </div>
      )}
      {subtitle && (
        <p style={{ fontSize: 12.5, color: T.textDim, marginBottom: 18, marginTop: 0, lineHeight: 1.6 }}>{subtitle}</p>
      )}
      {children}
    </div>
  )
}

export function Field({ label, hint, children, style = {} }) {
  return (
    <div style={style}>
      {label && <label style={S.label}>{label}</label>}
      {children}
      {hint && <p style={S.hint}>{hint}</p>}
    </div>
  )
}

export function TextInput({ value, onChange, accent = T.gold, style = {}, ...props }) {
  return (
    <input
      value={value ?? ''}
      onChange={onChange}
      style={{ ...S.input, ...style }}
      onFocus={e => {
        e.target.style.borderColor = accent
        e.target.style.boxShadow = `0 0 0 3px ${accent}22`
      }}
      onBlur={e => {
        e.target.style.borderColor = T.borderStrong
        e.target.style.boxShadow = 'none'
      }}
      {...props}
    />
  )
}

export function TextArea({ value, onChange, rows = 3, accent = T.gold, style = {}, ...props }) {
  return (
    <textarea
      rows={rows}
      value={value ?? ''}
      onChange={onChange}
      style={{ ...S.input, resize: 'vertical', lineHeight: 1.7, ...style }}
      onFocus={e => {
        e.target.style.borderColor = accent
        e.target.style.boxShadow = `0 0 0 3px ${accent}22`
      }}
      onBlur={e => {
        e.target.style.borderColor = T.borderStrong
        e.target.style.boxShadow = 'none'
      }}
      {...props}
    />
  )
}

export function DeleteBtn({ onConfirm, label = 'حذف', style = {} }) {
  const [confirming, setConfirming] = useState(false)

  return confirming ? (
    <div style={{ display: 'inline-flex', gap: 6, ...style }}>
      <button
        type="button"
        onClick={() => { setConfirming(false); onConfirm() }}
        style={{
          padding: '5px 10px', borderRadius: 8, background: '#dc2626', border: 'none',
          color: '#fff', fontWeight: 800, fontSize: 11.5, cursor: 'pointer',
        }}
      >
        تأكيد الحذف
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        style={{
          padding: '5px 8px', borderRadius: 8, background: T.surface, border: `1px solid ${T.borderStrong}`,
          color: T.textMuted, fontWeight: 700, fontSize: 11.5, cursor: 'pointer',
        }}
      >
        إلغاء
      </button>
    </div>
  ) : (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      style={{
        padding: '5px 10px', borderRadius: 8, background: T.redSoft,
        border: '1px solid rgba(239,68,68,0.35)', color: '#fca5a5',
        fontWeight: 700, fontSize: 11.5, cursor: 'pointer', ...style,
      }}
    >
      🗑️ {label}
    </button>
  )
}

export function UploadImageBtn({ label = '📤 رفع صورة', folder = '/hilaly-moving/gallery', onSuccess, multiple = false, style = {} }) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  const handle = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setLoading(true)
    try {
      for (let i = 0; i < files.length; i++) {
        setStatus(files.length > 1 ? `${i + 1}/${files.length}` : '')
        const result = await uploadToImageKit(files[i], folder, 'image', (pct) => {
          setStatus(files.length > 1 ? `${i + 1}/${files.length} (${pct}%)` : `${pct}%`)
        })
        onSuccess(result.url)
      }
    } catch (err) {
      alert('فشل الرفع: ' + err.message)
    } finally {
      setLoading(false)
      setStatus('')
      e.target.value = ''
    }
  }

  return (
    <label style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      padding: '10px 14px', borderRadius: 10,
      background: '#0f0f13', border: `1px dashed ${T.borderStrong}`,
      color: T.textMuted, fontSize: 12.5, fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
      opacity: loading ? 0.7 : 1, pointerEvents: loading ? 'none' : 'auto',
      transition: 'border-color .2s, color .2s',
      ...style,
    }}>
      {loading ? `⏳ جارٍ الرفع إلى Cloudinary... ${status}` : label}
      <input type="file" accept="image/*" multiple={multiple} style={{ display: 'none' }} onChange={handle} />
    </label>
  )
}

export function UploadVideoBtn({ onSuccess, style = {} }) {
  const [loading, setLoading] = useState(false)
  const [pct, setPct] = useState(0)

  const handle = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    setPct(0)
    try {
      const result = await uploadToImageKit(file, '/hilaly-moving/videos', 'video', setPct)
      onSuccess(result.url)
    } catch (err) {
      alert('فشل رفع الفيديو: ' + err.message)
    } finally {
      setLoading(false)
      setPct(0)
      e.target.value = ''
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <label style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '10px 14px', borderRadius: 10,
        background: '#0f0f13', border: `1px dashed ${T.borderStrong}`,
        color: T.textMuted, fontSize: 13, fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
        opacity: loading ? 0.85 : 1, pointerEvents: loading ? 'none' : 'auto',
        ...style,
      }}>
        {loading ? `⏳ جارٍ الرفع إلى Cloudinary (${pct}%)` : '📤 اختر ملف فيديو (حتى 100MB)'}
        <input type="file" accept="video/*" style={{ display: 'none' }} onChange={handle} />
      </label>
      {loading && (
        <div style={{ marginTop: 8, height: 5, borderRadius: 99, background: T.surfaceAlt, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: T.goldGradient, transition: 'width .2s' }} />
        </div>
      )}
    </div>
  )
}

export function Toast({ message, type = 'success', onClose }) {
  if (!message) return null
  const map = {
    success: { bg: '#052e16', border: '#16a34a', color: '#86efac', icon: '✓' },
    error: { bg: '#450a0a', border: '#dc2626', color: '#fca5a5', icon: '✕' },
    warning: { bg: '#451a03', border: '#d97706', color: '#fcd34d', icon: '⚠' },
  }
  const c = map[type] || map.success

  return (
    <div style={{
      position: 'fixed', bottom: 24, left: 24, zIndex: 1000,
      background: c.bg, border: `1px solid ${c.border}`, color: c.color,
      padding: '12px 18px', borderRadius: 12, fontSize: 13.5, fontWeight: 700,
      boxShadow: '0 16px 40px rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', gap: 10, maxWidth: 420,
    }}>
      <span>{c.icon}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: c.color, cursor: 'pointer', fontSize: 15, opacity: 0.7 }}>×</button>
    </div>
  )
}

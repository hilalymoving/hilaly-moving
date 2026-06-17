import { useState, useEffect } from 'react'
import { useTheme } from '../theme'
import { Reveal } from '../Reveal'
import { buildWAMessage } from '../whatsapp'

export default function BookingForm({ t, lang }) {
  const th = useTheme()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)
  const [f, setF] = useState({ name: '', phone: '', from: '', to: '', date: '', rooms: '', floor: '', services: [], notes: '' })
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  const set = (k, v) => setF(p => ({ ...p, [k]: v }))
  const tog = s => set('services', f.services.includes(s) ? f.services.filter(x => x !== s) : [...f.services, s])
  const ok = f.name && f.phone && f.from && f.to && f.date

  // Use phone number from CMS (admin-controlled), strip all non-digits
  const waNumber = (t.footer?.phone1 || '201012345678').replace(/\D/g, '')

  const inp = {
    width: '100%', padding: '10px 12px', borderRadius: 10,
    border: `1.5px solid ${th.border}`, background: th.bg, color: th.text,
    fontSize: 14, outline: 'none', boxSizing: 'border-box',
    transition: 'border-color .2s', fontFamily: 'inherit',
  }

  const submit = () => {
    if (!ok) return
    setBusy(true)
    setTimeout(() => {
      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(buildWAMessage(f, lang))}`, '_blank')
      setBusy(false)
    }, 700)
  }

  return (
    <section id="contact" style={{ padding: 'clamp(3rem,8vw,6rem) 1.2rem', background: 'linear-gradient(135deg,#111008,#1a1200)' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h2 style={{ fontSize: 'clamp(1.5rem,5vw,2.4rem)', fontWeight: 900, color: '#fff', marginBottom: 8 }}>{t.form.title}</h2>
            <p style={{ color: 'rgba(255,255,255,.72)', fontSize: 14 }}>{t.form.sub}</p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div style={{ background: th.bgCard, borderRadius: 22, padding: isMobile ? 18 : 32, boxShadow: '0 32px 80px rgba(0,0,0,.3)', border: `1px solid ${th.border}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>

              {[['name', 'namePh'], ['phone', 'phonePh'], ['from', 'fromPh'], ['to', 'toPh']].map(([k, ph]) => (
                <div key={k}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: th.textMuted, marginBottom: 5 }}>{t.form[k]}</label>
                  <input style={inp} placeholder={t.form[ph]} value={f[k]} onChange={e => set(k, e.target.value)}
                    onFocus={e => e.target.style.borderColor = th.accent}
                    onBlur={e => e.target.style.borderColor = th.border} />
                </div>
              ))}

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: th.textMuted, marginBottom: 5 }}>{t.form.date}</label>
                <input type="date" style={inp} value={f.date} onChange={e => set('date', e.target.value)}
                  onFocus={e => e.target.style.borderColor = th.accent}
                  onBlur={e => e.target.style.borderColor = th.border} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: th.textMuted, marginBottom: 5 }}>{t.form.rooms}</label>
                <select style={inp} value={f.rooms} onChange={e => set('rooms', e.target.value)}>
                  <option value="">—</option>
                  {t.form.roomsOpts.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div style={{ gridColumn: isMobile ? '1' : '1/-1' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: th.textMuted, marginBottom: 5 }}>{t.form.floor}</label>
                <input style={inp} placeholder={t.form.floorPh} value={f.floor} onChange={e => set('floor', e.target.value)}
                  onFocus={e => e.target.style.borderColor = th.accent}
                  onBlur={e => e.target.style.borderColor = th.border} />
              </div>

              <div style={{ gridColumn: isMobile ? '1' : '1/-1' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: th.textMuted, marginBottom: 8 }}>{t.form.services}</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {t.form.servicesOpts.map(s => {
                    const on = f.services.includes(s)
                    return (
                      <button key={s} type="button" onClick={() => tog(s)} style={{
                        padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all .2s',
                        background: on ? th.accent : th.bgSection,
                        color: on ? '#000' : th.text,
                        border: `1.5px solid ${on ? th.accent : th.border}`,
                      }}>
                        {on ? '✓ ' : ''}{s}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div style={{ gridColumn: isMobile ? '1' : '1/-1' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: th.textMuted, marginBottom: 5 }}>{t.form.notes}</label>
                <textarea rows={3} style={{ ...inp, resize: 'vertical' }} placeholder={t.form.notesPh} value={f.notes} onChange={e => set('notes', e.target.value)}
                  onFocus={e => e.target.style.borderColor = th.accent}
                  onBlur={e => e.target.style.borderColor = th.border} />
              </div>
            </div>

            <button onClick={submit} disabled={busy || !ok} style={{
              marginTop: 18, width: '100%', padding: 14, borderRadius: 12,
              background: ok ? 'linear-gradient(135deg,#D4A017,#B8860B)' : th.border,
              color: ok ? '#000' : th.textMuted,
              fontSize: 16, fontWeight: 800, border: 'none',
              cursor: ok ? 'pointer' : 'not-allowed',
              boxShadow: ok ? '0 8px 28px rgba(212,160,23,0.4)' : 'none',
              transition: 'all .3s',
            }}>
              {busy ? t.form.submitting : t.form.submit}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

import Image from '../../Image'
import { ADMIN_TOKENS as T, adminStyles as S } from '../AdminTheme'
import { SectionCard, Field, TextInput, UploadImageBtn } from '../AdminUI'

export default function ContactsTab({ draft, mutate }) {
  const nav = draft.ar.nav || {}
  const footer = draft.ar.footer || {}
  const social = footer.social || {}

  return (
    <div>
      <SectionCard title="🎨 الهيدر والشعار">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 16 }}>
          <Field label="اسم الشركة">
            <TextInput
              value={nav.brand}
              onChange={e => mutate(d => { d.ar.nav = { ...d.ar.nav, brand: e.target.value } })}
            />
          </Field>
          <Field label="نص زر الحجز">
            <TextInput
              value={nav.book}
              onChange={e => mutate(d => { d.ar.nav = { ...d.ar.nav, book: e.target.value } })}
            />
          </Field>
        </div>

        <Field label="شعار الشركة (اختياري)">
          {nav.logo && (
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 10 }}>
              <Image src={nav.logo} alt="شعار الشركة" width={140} height={60} style={{ objectFit: 'contain', borderRadius: 8, background: '#fff', padding: 4 }} />
              <button
                type="button"
                onClick={() => mutate(d => { d.ar.nav = { ...d.ar.nav, logo: '' } })}
                style={{ position: 'absolute', top: -6, left: -6, width: 22, height: 22, borderRadius: '50%', background: '#dc2626', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 13 }}
              >
                ×
              </button>
            </div>
          )}
          <UploadImageBtn
            label="📤 رفع شعار الشركة"
            folder="/hilaly-moving/brand"
            onSuccess={url => mutate(d => { d.ar.nav = { ...d.ar.nav, logo: url } })}
          />
        </Field>
      </SectionCard>

      <SectionCard title="📞 أرقام الهاتف والبريد الإلكتروني">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
          {[
            ['phone1', 'رقم الهاتف الأول (الأساسي والواتساب)', 'يظهر في الشريط العلوي، الفوتر، ويُستخدم لإرسال طلبات الحجز'],
            ['phone2', 'رقم الهاتف الثاني', 'يظهر في الشريط العلوي والفوتر'],
            ['phone3', 'رقم الهاتف الثالث', 'يظهر في الشريط العلوي والفوتر'],
            ['phone4', 'رقم الهاتف الرابع', 'يظهر في الشريط العلوي والفوتر'],
          ].map(([key, label, hint]) => (
            <Field key={key} label={label} hint={hint}>
              <TextInput
                value={footer[key]}
                placeholder="+20 10 XXXX XXXX"
                style={{ direction: 'ltr', textAlign: 'right' }}
                onChange={e => mutate(d => { d.ar.footer[key] = e.target.value })}
              />
            </Field>
          ))}

          <Field label="البريد الإلكتروني">
            <TextInput
              value={footer.email}
              placeholder="info@hilalymoving.eg"
              style={{ direction: 'ltr', textAlign: 'right' }}
              onChange={e => mutate(d => { d.ar.footer.email = e.target.value })}
            />
          </Field>

          <Field label="رابط واتساب المباشر (اختياري)" hint="مثال: https://wa.me/201012345678">
            <TextInput
              value={social.whatsapp}
              placeholder="https://wa.me/201012345678"
              style={{ direction: 'ltr', textAlign: 'right' }}
              onChange={e => mutate(d => {
                if (!d.ar.footer.social) d.ar.footer.social = {}
                d.ar.footer.social.whatsapp = e.target.value
              })}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="🌐 روابط التواصل الاجتماعي" subtitle="اترك أي منصة فارغة لإخفائها تلقائياً من الشريط العلوي والفوتر">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
          {[
            { key: 'facebook', label: '📘 Facebook', ph: 'https://facebook.com/yourpage', color: '#1877f2' },
            { key: 'instagram', label: '📸 Instagram', ph: 'https://instagram.com/yourprofile', color: '#e1306c' },
            { key: 'tiktok', label: '🎵 TikTok', ph: 'https://tiktok.com/@yourprofile', color: '#e4e4e7' },
          ].map(({ key, label, ph, color }) => (
            <Field key={key} label={label}>
              <TextInput
                accent={color}
                value={social[key]}
                placeholder={ph}
                style={{ direction: 'ltr', textAlign: 'right' }}
                onChange={e => mutate(d => {
                  if (!d.ar.footer.social) d.ar.footer.social = {}
                  d.ar.footer.social[key] = e.target.value
                })}
              />
            </Field>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="📌 نصوص التذييل (Footer)">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          <Field label="الوصف التعريفي أسفل الشعار">
            <TextInput
              value={footer.tag}
              onChange={e => mutate(d => { d.ar.footer.tag = e.target.value })}
            />
          </Field>
          <Field label="نص حقوق النشر">
            <TextInput
              value={footer.copy}
              onChange={e => mutate(d => { d.ar.footer.copy = e.target.value })}
            />
          </Field>
        </div>
      </SectionCard>
    </div>
  )
}

import Image from '../../Image'
import { adminStyles as S } from '../AdminTheme'
import { SectionCard, Field, TextInput, TextArea, UploadImageBtn, DeleteBtn } from '../AdminUI'

export function PopupTab({ draft, mutate }) {
  const popup = draft.ar.popup || {}

  return (
    <SectionCard title="🎁 العرض المنبثق (Popup)" subtitle="نافذة العرض الترويجي التي تظهر للزائر عند فتح الموقع">
      <div style={{ ...S.subCard, marginBottom: 16 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={Boolean(popup.enabled)}
            onChange={e => mutate(d => {
              if (!d.ar.popup) d.ar.popup = {}
              d.ar.popup.enabled = e.target.checked
            })}
            style={{ width: 19, height: 19, accentColor: '#D4A017' }}
          />
          <span style={{ fontSize: 14, fontWeight: 800 }}>تفعيل العرض المنبثق على الموقع</span>
        </label>
      </div>

      <div style={{ display: 'grid', gap: 14 }}>
        <Field label="عنوان العرض">
          <TextInput
            value={popup.title}
            placeholder="مثال: خصم 15% على أول عملية نقل!"
            onChange={e => mutate(d => { d.ar.popup.title = e.target.value })}
          />
        </Field>
        <Field label="وصف العرض">
          <TextArea
            rows={3}
            value={popup.desc}
            onChange={e => mutate(d => { d.ar.popup.desc = e.target.value })}
          />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          <Field label="نص الزر">
            <TextInput
              value={popup.button}
              onChange={e => mutate(d => { d.ar.popup.button = e.target.value })}
            />
          </Field>
          <Field label="مدة العد التنازلي (بالساعات)">
            <TextInput
              type="number"
              min="1"
              max="168"
              value={popup.timerHours ?? 48}
              onChange={e => mutate(d => { d.ar.popup.timerHours = parseInt(e.target.value, 10) || 48 })}
            />
          </Field>
        </div>
        <Field label="صورة الخلفية (اختياري)">
          {popup.bgImage && (
            <div style={{ position: 'relative', marginBottom: 10 }}>
              <Image src={popup.bgImage} alt="خلفية العرض" width={500} height={120} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 10 }} />
              <div style={{ position: 'absolute', top: 6, left: 6 }}>
                <DeleteBtn label="إزالة" onConfirm={() => mutate(d => { d.ar.popup.bgImage = '' })} />
              </div>
            </div>
          )}
          <UploadImageBtn
            label="📤 رفع صورة خلفية"
            folder="/hilaly-moving/popup"
            onSuccess={url => mutate(d => { d.ar.popup.bgImage = url })}
          />
        </Field>
      </div>
    </SectionCard>
  )
}

export function SliderTab({ draft, mutate }) {
  const slider = draft.ar.slider || { title: '', items: [] }

  return (
    <SectionCard title="🎞️ عرض الشرائح (السلايدر)" subtitle="الصور المتحركة المعروضة في القسم الرئيسي (Hero)">
      <Field label="عنوان السلايدر" style={{ marginBottom: 18 }}>
        <TextInput
          value={slider.title}
          onChange={e => mutate(d => {
            if (!d.ar.slider) d.ar.slider = { items: [] }
            d.ar.slider.title = e.target.value
          })}
        />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: 14 }}>
        {(slider.items || []).map((img, i) => (
          <div key={i} style={{ ...S.subCard, padding: 0, overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: 115 }}>
              <Image src={img.url} alt={img.caption} width={220} height={115} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', top: 6, left: 6 }}>
                <DeleteBtn label="" onConfirm={() => mutate(d => { d.ar.slider.items.splice(i, 1) })} />
              </div>
            </div>
            <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <TextInput
                value={img.caption}
                placeholder="عنوان الشريحة"
                style={{ fontSize: 12, padding: '6px 9px' }}
                onChange={e => mutate(d => { d.ar.slider.items[i].caption = e.target.value })}
              />
              <UploadImageBtn
                label="🔄 تغيير الصورة"
                folder="/hilaly-moving/slider"
                style={{ padding: '6px 8px', fontSize: 11.5 }}
                onSuccess={url => mutate(d => { d.ar.slider.items[i].url = url })}
              />
            </div>
          </div>
        ))}

        <UploadImageBtn
          multiple
          folder="/hilaly-moving/slider"
          label={<div style={{ textAlign: 'center' }}><div style={{ fontSize: 26, marginBottom: 4 }}>+</div><div>إضافة شريحة</div></div>}
          style={{ minHeight: 185, borderWidth: 2 }}
          onSuccess={url => mutate(d => {
            if (!d.ar.slider) d.ar.slider = { title: 'معرض الصور المتحرك', items: [] }
            d.ar.slider.items.push({ url, caption: 'صورة جديدة' })
          })}
        />
      </div>
    </SectionCard>
  )
}

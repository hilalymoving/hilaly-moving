import Image from '../../Image'
import { adminStyles as S } from '../AdminTheme'
import { SectionCard, Field, TextInput, TextArea, DeleteBtn, UploadImageBtn } from '../AdminUI'

export function ServicesTab({ draft, mutate }) {
  const services = draft.ar.services || { title: '', sub: '', items: [] }

  return (
    <SectionCard title={`🛠️ خدماتنا (${services.items?.length || 0})`}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 18 }}>
        <Field label="عنوان القسم">
          <TextInput value={services.title} onChange={e => mutate(d => { d.ar.services.title = e.target.value })} />
        </Field>
        <Field label="النص الفرعي">
          <TextInput value={services.sub} onChange={e => mutate(d => { d.ar.services.sub = e.target.value })} />
        </Field>
      </div>

      <div style={{ display: 'grid', gap: 14 }}>
        {(services.items || []).map((item, i) => (
          <div key={i} style={S.subCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontWeight: 800, fontSize: 14 }}>{item.icon} {item.title || `خدمة #${i + 1}`}</span>
              <DeleteBtn onConfirm={() => mutate(d => { d.ar.services.items.splice(i, 1) })} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 12 }}>
              <Field label="الأيقونة (Emoji)">
                <TextInput value={item.icon} onChange={e => mutate(d => { d.ar.services.items[i].icon = e.target.value })} />
              </Field>
              <Field label="عنوان الخدمة">
                <TextInput value={item.title} onChange={e => mutate(d => { d.ar.services.items[i].title = e.target.value })} />
              </Field>
            </div>

            <Field label="الوصف" style={{ marginBottom: 12 }}>
              <TextArea rows={2} value={item.desc} onChange={e => mutate(d => { d.ar.services.items[i].desc = e.target.value })} />
            </Field>

            <Field label="نقاط الخدمة (سطر لكل نقطة)" style={{ marginBottom: 12 }}>
              <TextArea
                rows={4}
                value={(item.features || []).join('\n')}
                onChange={e => mutate(d => { d.ar.services.items[i].features = e.target.value.split('\n') })}
              />
            </Field>

            <Field label="صورة الخدمة (اختياري)">
              {item.image && (
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: 8 }}>
                  <Image src={item.image} alt={item.title} width={200} height={110} style={{ objectFit: 'cover', borderRadius: 10 }} />
                  <div style={{ position: 'absolute', top: 6, left: 6 }}>
                    <DeleteBtn label="" onConfirm={() => mutate(d => { d.ar.services.items[i].image = '' })} />
                  </div>
                </div>
              )}
              <UploadImageBtn
                label="📤 رفع صورة الخدمة"
                folder="/hilaly-moving/services"
                onSuccess={url => mutate(d => { d.ar.services.items[i].image = url })}
              />
            </Field>
          </div>
        ))}

        <button
          type="button"
          style={S.addDashedBtn}
          onClick={() => mutate(d => {
            if (!d.ar.services) d.ar.services = { title: 'خدماتنا', sub: '', items: [] }
            d.ar.services.items.push({ icon: '🚛', title: 'خدمة جديدة', desc: 'وصف الخدمة هنا', features: ['ميزة ١', 'ميزة ٢'] })
          })}
        >
          + إضافة خدمة جديدة
        </button>
      </div>
    </SectionCard>
  )
}

export function OffersTab({ draft, mutate }) {
  const offers = draft.ar.offers || { title: '', sub: '', items: [] }

  return (
    <SectionCard title={`💰 العروض والباقات (${offers.items?.length || 0})`}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 18 }}>
        <Field label="عنوان القسم">
          <TextInput value={offers.title} onChange={e => mutate(d => { d.ar.offers.title = e.target.value })} />
        </Field>
        <Field label="النص الفرعي">
          <TextInput value={offers.sub} onChange={e => mutate(d => { d.ar.offers.sub = e.target.value })} />
        </Field>
      </div>

      <div style={{ display: 'grid', gap: 14 }}>
        {(offers.items || []).map((o, i) => (
          <div key={i} style={{ ...S.subCard, borderTop: `3px solid ${o.color || '#D4A017'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontWeight: 800, fontSize: 14 }}>{o.title || `باقة #${i + 1}`}</span>
              <DeleteBtn onConfirm={() => mutate(d => { d.ar.offers.items.splice(i, 1) })} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12, marginBottom: 12 }}>
              <Field label="العنوان">
                <TextInput accent={o.color} value={o.title} onChange={e => mutate(d => { d.ar.offers.items[i].title = e.target.value })} />
              </Field>
              <Field label="الشارة">
                <TextInput accent={o.color} value={o.badge} onChange={e => mutate(d => { d.ar.offers.items[i].badge = e.target.value })} />
              </Field>
              <Field label="السعر">
                <TextInput accent={o.color} value={o.price} onChange={e => mutate(d => { d.ar.offers.items[i].price = e.target.value })} />
              </Field>
              <Field label="لون الباقة">
                <input
                  type="color"
                  value={o.color || '#6366f1'}
                  onChange={e => mutate(d => { d.ar.offers.items[i].color = e.target.value })}
                  style={{ width: '100%', height: 40, borderRadius: 10, border: 'none', cursor: 'pointer', background: 'transparent' }}
                />
              </Field>
            </div>

            <Field label="الوصف المختصر" style={{ marginBottom: 12 }}>
              <TextInput accent={o.color} value={o.desc} onChange={e => mutate(d => { d.ar.offers.items[i].desc = e.target.value })} />
            </Field>

            <Field label="مميزات الباقة (سطر لكل ميزة)">
              <TextArea
                rows={5}
                accent={o.color}
                value={(o.features || []).join('\n')}
                onChange={e => mutate(d => { d.ar.offers.items[i].features = e.target.value.split('\n') })}
              />
            </Field>
          </div>
        ))}

        <button
          type="button"
          style={S.addDashedBtn}
          onClick={() => mutate(d => {
            d.ar.offers.items.push({ badge: 'جديد', color: '#6366f1', title: 'باقة جديدة', price: 'تواصل معنا', desc: 'وصف الباقة هنا', features: ['ميزة ١', 'ميزة ٢'] })
          })}
        >
          + إضافة باقة جديدة
        </button>
      </div>
    </SectionCard>
  )
}

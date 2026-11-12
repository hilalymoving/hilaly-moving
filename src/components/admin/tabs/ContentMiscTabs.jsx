import { adminStyles as S } from '../AdminTheme'
import { SectionCard, Field, TextInput, TextArea, DeleteBtn } from '../AdminUI'

export function PricingTab({ draft, mutate }) {
  const pricing = draft.ar.pricing || { title: '', sub: '', factors: [] }

  return (
    <SectionCard title="📐 كيفية التسعير" subtitle="العوامل التي يعتمد عليها تسعير عملية النقل">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 18 }}>
        <Field label="عنوان القسم">
          <TextInput value={pricing.title} onChange={e => mutate(d => { d.ar.pricing.title = e.target.value })} />
        </Field>
        <Field label="النص الفرعي">
          <TextInput value={pricing.sub} onChange={e => mutate(d => { d.ar.pricing.sub = e.target.value })} />
        </Field>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {(pricing.factors || []).map((f, i) => (
          <div key={i} style={S.subCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontWeight: 800, fontSize: 13.5 }}>{f.icon} {f.label || `عامل #${i + 1}`}</span>
              <DeleteBtn onConfirm={() => mutate(d => { d.ar.pricing.factors.splice(i, 1) })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
              <Field label="الأيقونة">
                <TextInput value={f.icon} onChange={e => mutate(d => { d.ar.pricing.factors[i].icon = e.target.value })} />
              </Field>
              <Field label="العنوان">
                <TextInput value={f.label} onChange={e => mutate(d => { d.ar.pricing.factors[i].label = e.target.value })} />
              </Field>
              <Field label="الوصف">
                <TextInput value={f.desc} onChange={e => mutate(d => { d.ar.pricing.factors[i].desc = e.target.value })} />
              </Field>
            </div>
          </div>
        ))}

        <button
          type="button"
          style={S.addDashedBtn}
          onClick={() => mutate(d => {
            if (!d.ar.pricing) d.ar.pricing = { title: '', sub: '', factors: [] }
            d.ar.pricing.factors.push({ icon: '📏', label: 'عامل جديد', desc: 'وصف العامل هنا', bg: '#eef2ff', col: '#4338ca' })
          })}
        >
          + إضافة عامل تسعير
        </button>
      </div>
    </SectionCard>
  )
}

export function TestimonialsTab({ draft, mutate }) {
  const items = draft.ar.testimonials?.items || []

  return (
    <SectionCard title={`💬 تقييمات العملاء (${items.length})`}>
      <div style={{ display: 'grid', gap: 14 }}>
        {items.map((item, i) => (
          <div key={i} style={S.subCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontWeight: 800, fontSize: 14 }}>{item.name} — {'★'.repeat(item.rating || 5)}</span>
              <DeleteBtn onConfirm={() => mutate(d => { d.ar.testimonials.items.splice(i, 1) })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 12 }}>
              <Field label="اسم العميل">
                <TextInput value={item.name} onChange={e => mutate(d => { d.ar.testimonials.items[i].name = e.target.value })} />
              </Field>
              <Field label="المنطقة / الصفة">
                <TextInput value={item.role} onChange={e => mutate(d => { d.ar.testimonials.items[i].role = e.target.value })} />
              </Field>
              <Field label="التقييم">
                <select
                  value={item.rating}
                  onChange={e => mutate(d => { d.ar.testimonials.items[i].rating = Number(e.target.value) })}
                  style={S.input}
                >
                  {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>)}
                </select>
              </Field>
            </div>
            <Field label="نص التقييم">
              <TextArea rows={2} value={item.text} onChange={e => mutate(d => { d.ar.testimonials.items[i].text = e.target.value })} />
            </Field>
          </div>
        ))}

        <button
          type="button"
          style={S.addDashedBtn}
          onClick={() => mutate(d => {
            d.ar.testimonials.items.push({ name: 'عميل جديد', role: 'القاهرة', text: 'اكتب تقييم العميل هنا...', rating: 5 })
          })}
        >
          + إضافة تقييم جديد
        </button>
      </div>
    </SectionCard>
  )
}

export function TrustTab({ draft, mutate }) {
  const guarantees = draft.ar.trust?.guarantees || []

  return (
    <SectionCard title="🛡️ الضمانات (صفحة من نحن)" subtitle="الضمانات المعروضة في صفحة من نحن (/about)">
      <div style={{ display: 'grid', gap: 12 }}>
        {guarantees.map((g, i) => (
          <div key={i} style={S.subCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontWeight: 800, fontSize: 13.5 }}>{g.icon} {g.title}</span>
              <DeleteBtn onConfirm={() => mutate(d => { d.ar.trust.guarantees.splice(i, 1) })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
              <Field label="الأيقونة">
                <TextInput value={g.icon} onChange={e => mutate(d => { d.ar.trust.guarantees[i].icon = e.target.value })} />
              </Field>
              <Field label="العنوان">
                <TextInput value={g.title} onChange={e => mutate(d => { d.ar.trust.guarantees[i].title = e.target.value })} />
              </Field>
              <Field label="الوصف">
                <TextInput value={g.desc} onChange={e => mutate(d => { d.ar.trust.guarantees[i].desc = e.target.value })} />
              </Field>
            </div>
          </div>
        ))}

        <button
          type="button"
          style={S.addDashedBtn}
          onClick={() => mutate(d => {
            if (!d.ar.trust) d.ar.trust = { title: '', sub: '', badges: [], guarantees: [] }
            d.ar.trust.guarantees.push({ icon: '⏰', title: 'ضمان جديد', desc: 'وصف الضمان هنا' })
          })}
        >
          + إضافة ضمان جديد
        </button>
      </div>
    </SectionCard>
  )
}

export function FaqTab({ draft, mutate }) {
  const faq = draft.ar.faq || { title: '', sub: '', items: [] }

  return (
    <SectionCard title={`❓ الأسئلة الشائعة (${faq.items?.length || 0})`}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 18 }}>
        <Field label="عنوان القسم">
          <TextInput value={faq.title} onChange={e => mutate(d => { d.ar.faq.title = e.target.value })} />
        </Field>
        <Field label="النص الفرعي">
          <TextInput value={faq.sub} onChange={e => mutate(d => { d.ar.faq.sub = e.target.value })} />
        </Field>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {(faq.items || []).map((item, i) => (
          <div key={i} style={S.subCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontWeight: 800, fontSize: 13 }}>سؤال #{i + 1}</span>
              <DeleteBtn onConfirm={() => mutate(d => { d.ar.faq.items.splice(i, 1) })} />
            </div>
            <Field label="السؤال" style={{ marginBottom: 10 }}>
              <TextInput value={item.q} onChange={e => mutate(d => { d.ar.faq.items[i].q = e.target.value })} />
            </Field>
            <Field label="الإجابة">
              <TextArea rows={2} value={item.a} onChange={e => mutate(d => { d.ar.faq.items[i].a = e.target.value })} />
            </Field>
          </div>
        ))}

        <button
          type="button"
          style={S.addDashedBtn}
          onClick={() => mutate(d => {
            if (!d.ar.faq) d.ar.faq = { title: 'أسئلة شائعة', sub: '', items: [] }
            d.ar.faq.items.push({ q: 'سؤال جديد', a: 'إجابة السؤال هنا...' })
          })}
        >
          + إضافة سؤال جديد
        </button>
      </div>
    </SectionCard>
  )
}

export function FormTab({ draft, mutate }) {
  const form = draft.ar.form || {}
  const textFields = [
    ['name', 'تسمية الاسم'], ['namePh', 'مثال الاسم'],
    ['phone', 'تسمية الهاتف'], ['phonePh', 'مثال الهاتف'],
    ['from', 'تسمية "من"'], ['fromPh', 'مثال "من"'],
    ['to', 'تسمية "إلى"'], ['toPh', 'مثال "إلى"'],
    ['date', 'تسمية التاريخ'], ['rooms', 'تسمية الغرف'],
    ['floor', 'تسمية الطابق'], ['floorPh', 'مثال الطابق'],
    ['services', 'تسمية الخدمات'], ['notes', 'تسمية الملاحظات'],
    ['notesPh', 'مثال الملاحظات'], ['submit', 'نص زر الإرسال'],
    ['submitting', 'نص جارٍ الإرسال'],
  ]

  return (
    <SectionCard title="📋 نموذج الحجز" subtitle="تخصيص تسميات الحقول والخيارات الظاهرة للعميل">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 16 }}>
        <Field label="عنوان النموذج">
          <TextInput value={form.title} onChange={e => mutate(d => { d.ar.form.title = e.target.value })} />
        </Field>
        <Field label="النص الفرعي">
          <TextInput value={form.sub} onChange={e => mutate(d => { d.ar.form.sub = e.target.value })} />
        </Field>
      </div>

      <div style={{ ...S.subCard, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12, marginBottom: 16 }}>
        {textFields.map(([key, label]) => (
          <Field key={key} label={label}>
            <TextInput value={form[key]} onChange={e => mutate(d => { d.ar.form[key] = e.target.value })} />
          </Field>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
        <Field label="خيارات عدد الغرف (سطر لكل خيار)">
          <TextArea
            rows={5}
            value={(form.roomsOpts || []).join('\n')}
            onChange={e => mutate(d => { d.ar.form.roomsOpts = e.target.value.split('\n').filter(x => x.trim()) })}
          />
        </Field>
        <Field label="خيارات الخدمات الإضافية (سطر لكل خيار)">
          <TextArea
            rows={5}
            value={(form.servicesOpts || []).join('\n')}
            onChange={e => mutate(d => { d.ar.form.servicesOpts = e.target.value.split('\n').filter(x => x.trim()) })}
          />
        </Field>
      </div>
    </SectionCard>
  )
}

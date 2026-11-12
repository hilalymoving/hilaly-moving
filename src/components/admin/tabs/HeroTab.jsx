import { ADMIN_TOKENS as T, adminStyles as S } from '../AdminTheme'
import { SectionCard, Field, TextInput, TextArea } from '../AdminUI'

export default function HeroTab({ draft, mutate }) {
  const hero = draft.ar.hero || {}
  const stats = Array.isArray(hero.stats) ? hero.stats : []

  return (
    <div>
      <SectionCard title="🎬 القسم الرئيسي (Hero)" subtitle="النصوص والأزرار الظاهرة في أعلى الصفحة الرئيسية">
        <div style={{ display: 'grid', gap: 14 }}>
          <Field label="الشارة العلوية">
            <TextInput
              value={hero.badge}
              onChange={e => mutate(d => { d.ar.hero.badge = e.target.value })}
            />
          </Field>

          <Field label="العنوان الرئيسي (سطرين)" hint="السطر الأول يظهر بالأبيض والسطر الثاني بالذهبي المتدرج">
            <TextArea
              rows={2}
              value={(hero.headline || '').replace(/\\n/g, '\n')}
              onChange={e => mutate(d => { d.ar.hero.headline = e.target.value })}
            />
          </Field>

          <Field label="النص الفرعي">
            <TextArea
              rows={3}
              value={hero.sub}
              onChange={e => mutate(d => { d.ar.hero.sub = e.target.value })}
            />
          </Field>

          <Field label="نص زر الحجز (CTA)">
            <TextInput
              value={hero.cta}
              onChange={e => mutate(d => { d.ar.hero.cta = e.target.value })}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="📊 إحصائيات القسم الرئيسي" subtitle="الأرقام الثلاثة التي تظهر أسفل زر الحجز">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {stats.map((pair, i) => (
            <div key={i} style={S.subCard}>
              <Field label={`القيمة #${i + 1}`} style={{ marginBottom: 10 }}>
                <TextInput
                  value={pair[0]}
                  onChange={e => mutate(d => { d.ar.hero.stats[i][0] = e.target.value })}
                />
              </Field>
              <Field label={`التسمية #${i + 1}`}>
                <TextInput
                  value={pair[1]}
                  onChange={e => mutate(d => { d.ar.hero.stats[i][1] = e.target.value })}
                />
              </Field>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

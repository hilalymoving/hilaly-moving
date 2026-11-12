import Image from '../../Image'
import { ADMIN_TOKENS as T, adminStyles as S } from '../AdminTheme'
import { SectionCard, Field, TextInput, DeleteBtn, UploadImageBtn, UploadVideoBtn } from '../AdminUI'

export default function MediaTab({ draft, mutate, videoDraft, updateVideo }) {
  const galleryItems = draft.ar.gallery?.items || []

  return (
    <div>
      <SectionCard title="🎬 الفيديو التعريفي" subtitle="يتم رفع الفيديوهات إلى Cloudinary (حتى 100MB) أو لصق رابط خارجي مباشر">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 14 }}>
          <Field label="رابط الفيديو (URL)">
            <TextInput
              value={videoDraft.src}
              placeholder="https://res.cloudinary.com/..."
              style={{ direction: 'ltr', textAlign: 'right' }}
              onChange={e => updateVideo({ src: e.target.value })}
            />
          </Field>
          <Field label="أو رفع فيديو من الجهاز">
            <UploadVideoBtn onSuccess={url => updateVideo({ src: url })} />
          </Field>
          <Field label="عنوان الفيديو">
            <TextInput
              value={videoDraft.title}
              placeholder="شاهد كيف نعمل"
              onChange={e => updateVideo({ title: e.target.value })}
            />
          </Field>
          <Field label="وصف الفيديو">
            <TextInput
              value={videoDraft.desc}
              placeholder="وصف قصير"
              onChange={e => updateVideo({ desc: e.target.value })}
            />
          </Field>
        </div>

        {videoDraft.src && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', padding: '10px 14px', borderRadius: 10, background: T.greenSoft, border: '1px solid rgba(16,185,129,0.3)' }}>
            <span style={{ color: T.green, fontSize: 12.5, fontWeight: 700 }}>✅ الفيديو جاهز للعرض</span>
            <span style={{ fontSize: 11, color: T.textMuted, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', direction: 'ltr' }}>{videoDraft.src}</span>
            <DeleteBtn label="حذف الفيديو" onConfirm={() => updateVideo({ src: '', poster: '', title: '', desc: '' })} />
          </div>
        )}
      </SectionCard>

      <SectionCard title={`🖼️ معرض الأعمال (${galleryItems.length} صورة)`} subtitle="الصور التي تظهر في قسم أعمالنا على الصفحة الرئيسية">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: 14 }}>
          {galleryItems.map((img, i) => (
            <div key={i} style={{ ...S.subCard, padding: 0, overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: 115 }}>
                <Image src={img.url} alt={img.caption} width={220} height={115} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', top: 6, left: 6 }}>
                  <DeleteBtn
                    label=""
                    onConfirm={() => mutate(d => { d.ar.gallery.items.splice(i, 1) })}
                  />
                </div>
              </div>
              <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <TextInput
                  value={img.caption}
                  placeholder="وصف الصورة"
                  style={{ fontSize: 12, padding: '6px 9px' }}
                  onChange={e => mutate(d => { d.ar.gallery.items[i].caption = e.target.value })}
                />
                <UploadImageBtn
                  label="🔄 تغيير الصورة"
                  folder="/hilaly-moving/gallery"
                  style={{ padding: '6px 8px', fontSize: 11.5 }}
                  onSuccess={url => mutate(d => { d.ar.gallery.items[i].url = url })}
                />
              </div>
            </div>
          ))}

          <UploadImageBtn
            multiple
            folder="/hilaly-moving/gallery"
            label={<div style={{ textAlign: 'center' }}><div style={{ fontSize: 26, marginBottom: 4 }}>+</div><div>إضافة صورة (أو أكثر)</div></div>}
            style={{ minHeight: 185, borderWidth: 2 }}
            onSuccess={url => mutate(d => { d.ar.gallery.items.push({ url, caption: 'صورة جديدة' }) })}
          />
        </div>
      </SectionCard>
    </div>
  )
}

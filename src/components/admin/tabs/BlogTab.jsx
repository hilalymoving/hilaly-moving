import Image from '../../Image'
import { adminStyles as S } from '../AdminTheme'
import { SectionCard, Field, TextInput, TextArea, DeleteBtn, UploadImageBtn } from '../AdminUI'

export default function BlogTab({ draft, mutate }) {
  const blog = draft.ar.blog || { title: '', sub: '', items: [] }

  return (
    <SectionCard title={`📝 مقالات المدونة (${blog.items?.length || 0})`} subtitle="تظهر المقالات في صفحة /blog و /blog/:slug">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 18 }}>
        <Field label="عنوان المدونة">
          <TextInput value={blog.title} onChange={e => mutate(d => { d.ar.blog.title = e.target.value })} />
        </Field>
        <Field label="النص الفرعي">
          <TextInput value={blog.sub} onChange={e => mutate(d => { d.ar.blog.sub = e.target.value })} />
        </Field>
      </div>

      <div style={{ display: 'grid', gap: 14 }}>
        {(blog.items || []).map((post, i) => (
          <div key={i} style={S.subCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontWeight: 800, fontSize: 14 }}>{post.title || `مقال #${i + 1}`}</span>
              <DeleteBtn onConfirm={() => mutate(d => { d.ar.blog.items.splice(i, 1) })} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12, marginBottom: 12 }}>
              <Field label="عنوان المقال">
                <TextInput value={post.title} onChange={e => mutate(d => { d.ar.blog.items[i].title = e.target.value })} />
              </Field>
              <Field label="الرابط (slug)" hint={`/blog/${post.slug || 'example-slug'}`}>
                <TextInput value={post.slug} onChange={e => mutate(d => { d.ar.blog.items[i].slug = e.target.value })} />
              </Field>
              <Field label="التاريخ">
                <TextInput type="date" value={post.date} onChange={e => mutate(d => { d.ar.blog.items[i].date = e.target.value })} />
              </Field>
              <Field label="الكاتب">
                <TextInput value={post.author} onChange={e => mutate(d => { d.ar.blog.items[i].author = e.target.value })} />
              </Field>
            </div>

            <Field label="صورة المقال" style={{ marginBottom: 12 }}>
              {post.image && (
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: 8 }}>
                  <Image src={post.image} alt={post.title} width={220} height={120} style={{ objectFit: 'cover', borderRadius: 10 }} />
                  <div style={{ position: 'absolute', top: 6, left: 6 }}>
                    <DeleteBtn label="" onConfirm={() => mutate(d => { d.ar.blog.items[i].image = '' })} />
                  </div>
                </div>
              )}
              <UploadImageBtn
                label="📤 رفع صورة المقال"
                folder="/hilaly-moving/blog"
                onSuccess={url => mutate(d => { d.ar.blog.items[i].image = url })}
              />
            </Field>

            <Field label="الملخص (Excerpt)" style={{ marginBottom: 12 }}>
              <TextArea rows={2} value={post.excerpt} onChange={e => mutate(d => { d.ar.blog.items[i].excerpt = e.target.value })} />
            </Field>

            <Field label="محتوى المقال">
              <TextArea rows={7} value={post.content} onChange={e => mutate(d => { d.ar.blog.items[i].content = e.target.value })} />
            </Field>
          </div>
        ))}

        <button
          type="button"
          style={S.addDashedBtn}
          onClick={() => mutate(d => {
            if (!d.ar.blog) d.ar.blog = { title: 'المدونة', sub: '', items: [] }
            d.ar.blog.items.push({
              title: 'مقال جديد',
              slug: 'مقال-جديد-' + (d.ar.blog.items.length + 1),
              date: new Date().toISOString().slice(0, 10),
              image: '',
              excerpt: '',
              content: '',
              author: 'فريق الهلالي',
            })
          })}
        >
          + إضافة مقال جديد
        </button>
      </div>
    </SectionCard>
  )
}

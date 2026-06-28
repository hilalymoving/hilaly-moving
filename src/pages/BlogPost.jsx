import { Helmet } from 'react-helmet-async'
import { Link, useParams, useOutletContext } from 'react-router-dom'
import { useTheme } from '../theme'

export default function BlogPost() {
  const { slug } = useParams()
  const { t, scrollTo } = useOutletContext()
  const th = useTheme()

  const posts = t.blog?.items || []
  const post = posts.find(p => p.slug === slug)

  if (!post) return (
    <section style={{ padding: '6rem 1.2rem', textAlign: 'center', background: th.bg, minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
      <h1 style={{ fontSize: 24, fontWeight: 900, color: th.text, marginBottom: 12 }}>المقال غير موجود</h1>
      <p style={{ color: th.textMuted, marginBottom: 24, fontSize: 15 }}>عذراً، المقال الذي تبحث عنه غير متوفر</p>
      <Link to="/blog" style={{
        padding: '12px 28px', borderRadius: 12,
        background: `linear-gradient(135deg,#D4A017,#B8860B)`,
        color: '#000', fontWeight: 800, fontSize: 14,
        textDecoration: 'none',
      }}>← العودة إلى المدونة</Link>
    </section>
  )

  const paragraphs = (post.content || '').split('\n').filter(p => p.trim())

  return (
    <>
      <Helmet>
        <title>{post.title} — الهلالي لنقل الاثاث</title>
        <meta name="description" content={post.excerpt || `اقرأ عن ${post.title} في مدونة الهلالي لنقل الاثاث`} />
        <link rel="canonical" href={`https://hilalymoving.com/blog/${post.slug}`} />
      </Helmet>

      <article style={{ padding: 'clamp(2rem,6vw,5rem) 1.2rem', background: th.bg, minHeight: '60vh' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {/* Back link */}
          <Link to="/blog" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: th.accent, fontWeight: 700, fontSize: 14,
            textDecoration: 'none', marginBottom: 28,
            transition: 'opacity .2s',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <span>→</span> العودة إلى المدونة
          </Link>

          {/* Post header */}
          <header style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: th.textMuted, marginBottom: 14, flexWrap: 'wrap' }}>
              {post.date && <span>📅 {post.date}</span>}
              {post.author && <span>✍️ {post.author}</span>}
            </div>

            <h1 style={{
              fontSize: 'clamp(22px,5vw,32px)', fontWeight: 900,
              color: th.text, lineHeight: 1.3, marginBottom: 16,
            }}>
              {post.title}
            </h1>

            {post.excerpt && (
              <p style={{ fontSize: 16, color: th.textMuted, lineHeight: 1.7 }}>
                {post.excerpt}
              </p>
            )}
          </header>

          {/* Featured image */}
          {post.image && (
            <div style={{
              borderRadius: 20, overflow: 'hidden', marginBottom: 32,
              boxShadow: `0 8px 32px rgba(0,0,0,0.15)`,
            }}>
              <img src={post.image} alt={post.title}
                style={{ width: '100%', maxHeight: 420, objectFit: 'cover', display: 'block' }} />
            </div>
          )}

          {/* Post content */}
          <div style={{ fontSize: 'clamp(15px,3vw,17px)', lineHeight: 2, color: th.text }}>
            {paragraphs.map((p, i) => (
              <p key={i} style={{ marginBottom: 20 }}>{p}</p>
            ))}
          </div>

          {/* Footer actions */}
          <div style={{
            marginTop: 48, paddingTop: 28,
            borderTop: `1px solid ${th.border}`,
            display: 'flex', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 16,
          }}>
            <Link to="/blog" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: th.accent, fontWeight: 700, fontSize: 14,
              textDecoration: 'none',
            }}>
              <span>→</span> مقالات أخرى
            </Link>

            <a href={`https://wa.me/${t.footer?.phone1?.replace(/\D/g, '') || ''}?text=${encodeURIComponent('أريد استفسار عن: ' + post.title)}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '10px 20px', borderRadius: 10,
                background: '#25D366', color: '#fff',
                fontWeight: 700, fontSize: 13, textDecoration: 'none',
              }}>
              💬 استفسر عبر واتساب
            </a>
          </div>
        </div>
      </article>
    </>
  )
}
import { Helmet } from 'react-helmet-async'
import { Link, useOutletContext } from 'react-router-dom'
import { useTheme } from '../theme'
import { Reveal } from '../Reveal'
import SectionHeader from '../components/SectionHeader'

export default function Blog() {
  const { t } = useOutletContext()
  const th = useTheme()

  const posts = t.blog?.items || []

  return (
    <>
      <Helmet>
        <title>مدونة الهلالي لنقل الاثاث — نصائح وإرشادات للنقل</title>
        <meta name="description" content="مدونة الهلالي لنقل الاثاث: نصائح وحيل لنقل أثاثك بسهولة، أدلة المناطق، وإجابات لأسئلتك الشائعة عن خدمات النقل في مصر." />
        <link rel="canonical" href="https://hilalymoving.com/blog" />
      </Helmet>

      <section style={{ padding: 'clamp(3rem,8vw,6rem) 1.2rem', background: th.bg, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${th.accent}, ${th.accent}44, transparent)` }} />
        <div style={{ position: 'absolute', top: '30%', right: '-10%', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${th.accent}08 0%, transparent 70%)`, pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <SectionHeader title={t.blog.title} sub={t.blog.sub} />

          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: th.textMuted, fontSize: 16 }}>
              لا توجد مقالات بعد — قم بإضافة مقالات من لوحة التحكم
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))', gap: 24 }}>
              {posts.map((post, i) => (
                <Reveal key={i} delay={i * 100}>
                  <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <div style={{
                      background: th.bgCard, borderRadius: 20, overflow: 'hidden',
                      border: `1px solid ${th.border}`, boxShadow: th.shadowSm,
                      transition: 'all .3s', height: '100%', display: 'flex', flexDirection: 'column',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 16px 48px ${th.accent}22`; e.currentTarget.style.borderColor = th.accent }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = th.shadowSm; e.currentTarget.style.borderColor = th.border }}
                    >
                      {post.image && (
                        <div style={{ width: '100%', height: 200, overflow: 'hidden', flexShrink: 0 }}>
                          <img src={post.image} alt={post.title} loading="lazy"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s' }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                        </div>
                      )}

                      <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, fontSize: 12, color: th.textMuted }}>
                          {post.date && <span>📅 {post.date}</span>}
                          {post.author && <span>✍️ {post.author}</span>}
                        </div>

                        <h2 style={{ fontSize: 'clamp(16px,3.5vw,19px)', fontWeight: 900, color: th.text, marginBottom: 10, lineHeight: 1.4 }}>
                          {post.title}
                        </h2>

                        {post.excerpt && (
                          <p style={{ fontSize: 13, color: th.textMuted, lineHeight: 1.7, flex: 1 }}>{post.excerpt}</p>
                        )}

                        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, color: th.accent, fontWeight: 800, fontSize: 13 }}>
                          اقرأ المزيد
                          <span style={{ fontSize: 16 }}>←</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminPanel from '../components/AdminPanel'
import { CMS } from '../cms'

// Same merge as MainLayout — ensures Firestore data is never missing CMS fields
function mergeAdminCMS(saved) {
  if (!saved) return CMS
  return {
    ar: {
      ...CMS.ar,
      ...saved.ar,
      faq: CMS.ar.faq,
      nav: saved.ar?.nav !== undefined ? { ...CMS.ar.nav, ...saved.ar.nav } : CMS.ar.nav,
      services: saved.ar?.services || CMS.ar.services,
      popup: saved.ar?.popup !== undefined ? saved.ar.popup : CMS.ar.popup,
      slider: saved.ar?.slider !== undefined ? saved.ar.slider : CMS.ar.slider,
      footer: { ...CMS.ar.footer, ...saved.ar?.footer },
      specialServices: saved.ar?.specialServices || CMS.ar.specialServices,
      blog: saved.ar?.blog || CMS.ar.blog,
    }
  }
}

export default function AdminPage() {
  const navigate = useNavigate()
  const [content, setContent] = useState(CMS)
  const [video, setVideo] = useState({ src: '', poster: '', title: '', desc: '' })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    import('../firebase').then(({ loadSiteData }) => loadSiteData()).then(data => {
      if (data) {
        setContent(mergeAdminCMS(data.content))
        if (data.video) setVideo(data.video)
      }
      setReady(true)
    })
  }, [])

  if (!ready) return (
    <div style={{ minHeight: '100vh', background: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 40, height: 40, border: '3px solid #D4A01733', borderTop: '3px solid #D4A017', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return <AdminPanel content={content} setContent={setContent} video={video} setVideo={setVideo} onExit={() => navigate('/')} />
}

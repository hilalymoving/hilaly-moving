import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Services from './pages/Services'
import Contact from './pages/Contact'
import About from './pages/About'
import Pricing from './pages/Pricing'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'

const AdminPage = lazy(() => import('./pages/AdminPage'))

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Route>
      <Route path="/admin" element={
        <Suspense fallback={<div dir="rtl" style={{ minHeight: '100vh', background: '#09090b', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cairo','Segoe UI',sans-serif" }}>جاري تحميل لوحة التحكم...</div>}>
          <AdminPage />
        </Suspense>
      } />
    </Routes>
  )
}

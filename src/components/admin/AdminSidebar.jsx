import { useState } from 'react'
import { ADMIN_TOKENS as T } from './AdminTheme'

export const ADMIN_NAV_GROUPS = [
  {
    group: 'التحليلات والترافيك',
    items: [
      { key: 'traffic', icon: '📊', label: 'الزيارات والمدن', badge: 'جديد' },
    ],
  },
  {
    group: 'المحتوى الرئيسي',
    items: [
      { key: 'hero', icon: '🎬', label: 'القسم الرئيسي' },
      { key: 'services', icon: '🛠️', label: 'خدماتنا' },
      { key: 'offers', icon: '💰', label: 'العروض والباقات' },
      { key: 'pricing', icon: '📐', label: 'كيفية التسعير' },
      { key: 'media', icon: '🖼️', label: 'المعرض والفيديو' },
      { key: 'slider', icon: '🎞️', label: 'عرض الشرائح' },
    ],
  },
  {
    group: 'التسويق والتفاعل',
    items: [
      { key: 'popup', icon: '🎁', label: 'العرض المنبثق' },
      { key: 'testimonials', icon: '💬', label: 'تقييمات العملاء' },
      { key: 'trust', icon: '🛡️', label: 'الضمانات' },
      { key: 'faq', icon: '❓', label: 'الأسئلة الشائعة' },
      { key: 'blog', icon: '📝', label: 'المدونة' },
      { key: 'form', icon: '📋', label: 'نموذج الحجز' },
    ],
  },
  {
    group: 'التواصل والإعدادات',
    items: [
      { key: 'contacts', icon: '📞', label: 'الهيدر والتواصل' },
      { key: 'settings', icon: '🔐', label: 'إعدادات الدخول' },
    ],
  },
]

export const TAB_META = ADMIN_NAV_GROUPS.flatMap(g => g.items).reduce((acc, item) => {
  acc[item.key] = item
  return acc
}, {})

export default function AdminSidebar({ activeTab, onSelect, brand, mobileOpen, onClose, dirty }) {
  const [filter, setFilter] = useState('')
  const q = filter.trim().toLowerCase()

  const sidebarBody = (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: T.sidebar, borderLeft: `1px solid ${T.border}`,
      padding: '18px 14px', boxSizing: 'border-box',
    }}>
      {/* Brand header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 6px 16px', borderBottom: `1px solid ${T.border}`, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: T.goldGradient, color: '#09090b',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 17, boxShadow: '0 4px 14px rgba(212,160,23,0.35)',
          }}>
            هـ
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 900, color: T.text }}>{brand || 'الهلالي لنقل الاثاث'}</div>
            <div style={{ fontSize: 11, color: T.textDim }}>لوحة الإدارة والتحكم</div>
          </div>
        </div>
        {mobileOpen && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: T.textMuted, fontSize: 20, cursor: 'pointer', padding: 4 }}>✕</button>
        )}
      </div>

      {/* Quick search */}
      <div style={{ marginBottom: 14 }}>
        <input
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="🔍 بحث في الأقسام..."
          style={{
            width: '100%', padding: '8px 11px', borderRadius: 9,
            border: `1px solid ${T.border}`, background: '#09090b',
            color: T.text, fontSize: 12.5, outline: 'none', boxSizing: 'border-box',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Navigation groups */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {ADMIN_NAV_GROUPS.map((grp) => {
          const items = q
            ? grp.items.filter(it => it.label.toLowerCase().includes(q) || it.key.includes(q))
            : grp.items
          if (!items.length) return null

          return (
            <div key={grp.group}>
              <div style={{ fontSize: 10.5, fontWeight: 800, color: T.textDim, padding: '0 8px 6px', letterSpacing: 0.4 }}>
                {grp.group}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {items.map((item) => {
                  const active = activeTab === item.key
                  return (
                    <button
                      key={item.key}
                      onClick={() => { onSelect(item.key); onClose?.() }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        width: '100%', padding: '9px 11px', borderRadius: 10,
                        border: active ? `1px solid ${T.goldBorder}` : '1px solid transparent',
                        background: active ? T.goldSoft : 'transparent',
                        color: active ? T.goldBright : T.textMuted,
                        fontSize: 13, fontWeight: active ? 800 : 600,
                        cursor: 'pointer', textAlign: 'right', fontFamily: 'inherit',
                        transition: 'all .15s',
                      }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <span style={{ fontSize: 15 }}>{item.icon}</span>
                        <span>{item.label}</span>
                      </span>
                      {item.badge && (
                        <span style={{
                          fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 99,
                          background: active ? T.gold : T.greenSoft,
                          color: active ? '#09090b' : T.green,
                        }}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Status footer */}
      <div style={{ paddingTop: 12, borderTop: `1px solid ${T.border}`, marginTop: 10, fontSize: 11.5, color: dirty ? T.amber : T.textDim, display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: dirty ? T.amber : T.green, display: 'inline-block' }} />
        {dirty ? 'توجد تعديلات غير محفوظة' : 'جميع التغييرات محفوظة'}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop fixed rail */}
      <aside className="admin-sidebar-desktop" style={{ width: 256, flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>
        {sidebarBody}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 90, display: 'flex' }}>
          <div style={{ width: 270, maxWidth: '85vw', height: '100%', zIndex: 2 }}>
            {sidebarBody}
          </div>
          <div onClick={onClose} style={{ flex: 1, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }} />
        </div>
      )}
    </>
  )
}

import { useState, useEffect, useMemo } from 'react'
import { fetchTrafficData, aggregateTraffic, clearTrafficLogs, getPageLabel } from '../../analytics'
import { ADMIN_TOKENS as T, adminStyles as S } from './AdminTheme'
import { SectionCard, TextInput } from './AdminUI'

const RANGES = [
  { key: 'today', label: 'اليوم' },
  { key: '7d', label: 'آخر 7 أيام' },
  { key: '30d', label: 'آخر 30 يوم' },
  { key: 'all', label: 'الكل' },
]

function formatRelative(iso) {
  if (!iso) return '—'
  const diffSec = Math.max(0, Math.floor((Date.now() - Date.parse(iso)) / 1000))
  if (diffSec < 60) return 'الآن'
  if (diffSec < 3600) return `منذ ${Math.floor(diffSec / 60)} د`
  if (diffSec < 86400) return `منذ ${Math.floor(diffSec / 3600)} س`
  return new Date(iso).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function DailyChart({ series }) {
  const [hovered, setHovered] = useState(null)
  const maxVal = Math.max(1, ...series.map(d => d.count))

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: series.length > 16 ? 4 : 8, height: 185, padding: '20px 6px 8px', borderBottom: `1px solid ${T.border}` }}>
        {series.map((d, i) => {
          const pct = Math.max(d.count > 0 ? 6 : 2, Math.round((d.count / maxVal) * 100))
          const isHov = hovered === i
          return (
            <div
              key={d.date}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', position: 'relative', cursor: 'pointer' }}
            >
              {isHov && (
                <div style={{
                  position: 'absolute', top: -8, transform: 'translateY(-100%)',
                  background: '#09090b', border: `1px solid ${T.goldBorder}`,
                  color: T.text, padding: '6px 10px', borderRadius: 8,
                  fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', zIndex: 10,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.45)',
                }}>
                  <div style={{ color: T.goldBright }}>{d.date}</div>
                  <div>{d.count} زيارة ({d.sessions} جلسة)</div>
                </div>
              )}
              <div style={{
                width: '100%', maxWidth: 28, height: `${pct}%`,
                borderRadius: '6px 6px 2px 2px',
                background: d.count > 0
                  ? (isHov ? T.goldBright : 'linear-gradient(180deg, #f5c842 0%, #B8860B 100%)')
                  : 'rgba(255,255,255,0.06)',
                transition: 'height .3s ease, background .15s',
              }} />
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, fontSize: 10.5, color: T.textDim, direction: 'ltr' }}>
        <span>{series[0]?.label || ''}</span>
        <span>{series[Math.floor(series.length / 2)]?.label || ''}</span>
        <span>{series[series.length - 1]?.label || ''}</span>
      </div>
    </div>
  )
}

export default function TrafficTab({ onToast }) {
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [range, setRange] = useState('30d')
  const [citySearch, setCitySearch] = useState('')
  const [clearing, setClearing] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchTrafficData(2000)
      setVisits(data)
    } catch (e) {
      if (e.code === 'permission-denied') {
        setError('صلاحيات القراءة لمجموعة visits غير مفعّلة في Firestore بعد. يرجى نشر ملف firestore.rules المحدّث إلى مشروع Firebase.')
      } else {
        setError('تعذر تحميل بيانات الزيارات: ' + (e.message || 'خطأ غير معروف'))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const stats = useMemo(() => aggregateTraffic(visits, range), [visits, range])

  const filteredCities = useMemo(() => {
    const q = citySearch.trim().toLowerCase()
    if (!q) return stats.cities
    return stats.cities.filter(c =>
      c.city.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
    )
  }, [stats.cities, citySearch])

  const exportCsv = () => {
    const rows = [['المدينة', 'الدولة', 'عدد الزيارات', 'الجلسات الفريدة', 'النسبة %']]
    stats.cities.forEach(c => {
      rows.push([c.city, c.country, String(c.count), String(c.sessions), `${c.pct}%`])
    })
    const csv = '\uFEFF' + rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hilaly-traffic-${range}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    onToast?.('تم تصدير تقرير المدن بصيغة CSV', 'success')
  }

  const handleClear = async () => {
    setClearing(true)
    try {
      const deleted = await clearTrafficLogs()
      setVisits([])
      setConfirmClear(false)
      onToast?.(`تم حذف ${deleted} سجل زيارة`, 'success')
    } catch (e) {
      onToast?.('فشل مسح السجل: ' + e.message, 'error')
    } finally {
      setClearing(false)
    }
  }

  const kpis = [
    { label: 'إجمالي الزيارات', value: stats.totalVisits.toLocaleString('en-US'), sub: `${stats.pages.length} صفحة نشطة`, icon: '👁️', color: T.goldBright, bg: T.goldSoft },
    { label: 'الجلسات الفريدة', value: stats.uniqueSessions.toLocaleString('en-US'), sub: stats.totalVisits ? `${Math.round((stats.uniqueSessions / stats.totalVisits) * 100)}% زوار جدد بالجلسة` : 'لا توجد بيانات', icon: '🧭', color: T.green, bg: T.greenSoft },
    { label: 'أعلى مدينة زيارة', value: stats.topCity ? stats.topCity.city : '—', sub: stats.topCity ? `${stats.topCity.count} زيارة (${stats.topCity.pct}%)` : `${stats.citiesCount} مدينة مسجلة`, icon: '📍', color: T.blue, bg: T.blueSoft },
    { label: 'الأجهزة المستخدمة', value: `${stats.deviceStats.mobile.pct}% جوال`, sub: `${stats.deviceStats.desktop.pct}% كمبيوتر • ${stats.deviceStats.tablet.pct}% تابلت`, icon: '📱', color: T.amber, bg: T.amberSoft },
  ]

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, background: T.surface, padding: 5, borderRadius: 12, border: `1px solid ${T.border}` }}>
          {RANGES.map(r => {
            const active = range === r.key
            return (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                style={{
                  padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontSize: 12.5, fontWeight: 700, fontFamily: 'inherit',
                  background: active ? T.goldGradient : 'transparent',
                  color: active ? '#09090b' : T.textMuted,
                  transition: 'all .15s',
                }}
              >
                {r.label}
              </button>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={load} disabled={loading} style={S.ghostBtn}>
            🔄 {loading ? 'جاري التحديث...' : 'تحديث'}
          </button>
          <button onClick={exportCsv} disabled={!stats.cities.length} style={{ ...S.ghostBtn, opacity: stats.cities.length ? 1 : 0.5 }}>
            ⬇️ تصدير CSV
          </button>
          {!confirmClear ? (
            <button onClick={() => setConfirmClear(true)} disabled={!visits.length} style={{ ...S.ghostBtn, color: '#fca5a5', borderColor: 'rgba(239,68,68,0.28)', opacity: visits.length ? 1 : 0.5 }}>
              🗑️ مسح السجل
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={handleClear} disabled={clearing} style={{ ...S.ghostBtn, background: '#dc2626', color: '#fff', borderColor: '#dc2626' }}>
                {clearing ? 'جاري المسح...' : 'تأكيد مسح الكل'}
              </button>
              <button onClick={() => setConfirmClear(false)} style={S.ghostBtn}>إلغاء</button>
            </div>
          )}
        </div>
      </div>

      {/* Permission / Error banner */}
      {error && (
        <div style={{ ...S.card, borderColor: 'rgba(239,68,68,0.45)', background: 'rgba(127,29,29,0.22)', marginBottom: 18 }}>
          <div style={{ fontWeight: 800, color: '#fca5a5', marginBottom: 6 }}>⚠️ تنبيه إعداد Firestore</div>
          <div style={{ fontSize: 13, color: '#fecaca', lineHeight: 1.7 }}>{error}</div>
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14, marginBottom: 18 }}>
        {kpis.map((k, i) => (
          <div key={i} style={{ ...S.card, padding: 18, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: T.textMuted, fontWeight: 700, marginBottom: 6 }}>{k.label}</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: T.text, fontVariantNumeric: 'tabular-nums', marginBottom: 4 }}>{k.value}</div>
              <div style={{ fontSize: 11.5, color: T.textDim }}>{k.sub}</div>
            </div>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: k.bg, color: k.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
              {k.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main Analytics Grid: Cities + Daily Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: 16, marginBottom: 18 }}>
        {/* Cities Breakdown */}
        <SectionCard
          title={`📍 الترافيك حسب المدينة (${stats.cities.length})`}
          subtitle="توزيع الزيارات والجلسات حسب المدينة المكتشفة لكل زائر"
          style={{ marginBottom: 0 }}
        >
          <div style={{ marginBottom: 14 }}>
            <TextInput
              value={citySearch}
              onChange={e => setCitySearch(e.target.value)}
              placeholder="ابحث باسم المدينة أو الدولة..."
            />
          </div>

          {loading ? (
            <div style={{ padding: 36, textAlign: 'center', color: T.textDim, fontSize: 13 }}>جاري تحميل بيانات المدن...</div>
          ) : filteredCities.length === 0 ? (
            <div style={{ padding: 36, textAlign: 'center', color: T.textDim, fontSize: 13 }}>
              {visits.length === 0 ? 'لا توجد زيارات مسجلة حتى الآن — افتح صفحات الموقع لتسجيل أول زيارة.' : 'لا توجد نتائج مطابقة للبحث'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 340, overflowY: 'auto', paddingLeft: 4 }}>
              {filteredCities.map((c, idx) => (
                <div key={`${c.city}-${c.country}-${idx}`} style={{ padding: '10px 12px', borderRadius: 11, background: T.surfaceAlt, border: `1px solid ${T.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        width: 22, height: 22, borderRadius: 7, fontSize: 11, fontWeight: 800,
                        background: idx === 0 ? T.goldSoft : 'rgba(255,255,255,0.06)',
                        color: idx === 0 ? T.goldBright : T.textMuted,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {idx + 1}
                      </span>
                      <span style={{ fontWeight: 800, fontSize: 13.5, color: T.text }}>{c.city}</span>
                      {c.country && c.country !== c.city && (
                        <span style={{ fontSize: 11, color: T.textDim }}>({c.country})</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontVariantNumeric: 'tabular-nums' }}>
                      <span style={{ fontSize: 12.5, fontWeight: 800, color: T.goldBright }}>{c.count} زيارة</span>
                      <span style={{ fontSize: 11, color: T.textMuted, minWidth: 34, textAlign: 'left' }}>{c.pct}%</span>
                    </div>
                  </div>
                  <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.max(c.pct, 3)}%`, height: '100%', background: idx === 0 ? T.goldGradient : T.blue, borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Daily Visits Chart + Top Pages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectionCard
            title="📈 حركة الزيارات اليومية"
            subtitle="مرّر المؤشر فوق أي عمود لعرض عدد الزيارات والجلسات"
            style={{ marginBottom: 0 }}
          >
            <DailyChart series={stats.dailySeries} />
          </SectionCard>

          <SectionCard title="📄 أكثر الصفحات زيارة" style={{ marginBottom: 0 }}>
            {stats.pages.length === 0 ? (
              <div style={{ color: T.textDim, fontSize: 13, textAlign: 'center', padding: 16 }}>لا توجد بيانات</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {stats.pages.slice(0, 6).map((p) => (
                  <div key={p.path} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 10, background: T.surfaceAlt, fontSize: 13 }}>
                    <div>
                      <span style={{ fontWeight: 700, color: T.text }}>{p.label}</span>
                      <span style={{ fontSize: 11, color: T.textDim, marginRight: 8, direction: 'ltr', display: 'inline-block' }}>{p.path}</span>
                    </div>
                    <span style={{ fontWeight: 800, color: T.goldBright, fontVariantNumeric: 'tabular-nums' }}>{p.count} ({p.pct}%)</span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      </div>

      {/* Recent Visits Log */}
      <SectionCard title="🕒 أحدث الزيارات المسجلة" subtitle="آخر 25 زيارة واردة للموقع (يتم استبعاد زيارات لوحة التحكم /admin تلقائياً)" style={{ marginBottom: 0 }}>
        {stats.recent.length === 0 ? (
          <div style={{ padding: 28, textAlign: 'center', color: T.textDim, fontSize: 13 }}>لا توجد زيارات في النطاق الزمني المحدد</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${T.border}`, color: T.textDim, textAlign: 'right' }}>
                  <th style={{ padding: '10px 8px' }}>المدينة</th>
                  <th style={{ padding: '10px 8px' }}>الصفحة</th>
                  <th style={{ padding: '10px 8px' }}>الجهاز</th>
                  <th style={{ padding: '10px 8px' }}>المصدر</th>
                  <th style={{ padding: '10px 8px' }}>النوع</th>
                  <th style={{ padding: '10px 8px' }}>الوقت</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((v, idx) => (
                  <tr key={v.id || idx} style={{ borderBottom: `1px solid ${T.border}` }}>
                    <td style={{ padding: '10px 8px', fontWeight: 700, color: T.text }}>
                      {v.city || 'غير محدد'}
                      {v.country ? <span style={{ color: T.textDim, fontWeight: 400 }}> — {v.country}</span> : ''}
                    </td>
                    <td style={{ padding: '10px 8px', color: T.textMuted }}>{getPageLabel(v.path)}</td>
                    <td style={{ padding: '10px 8px', color: T.textMuted }}>
                      {v.device === 'mobile' ? '📱 جوال' : v.device === 'tablet' ? '📲 تابلت' : '💻 كمبيوتر'}
                    </td>
                    <td style={{ padding: '10px 8px', color: T.textDim }}>{v.referrer || 'مباشر'}</td>
                    <td style={{ padding: '10px 8px' }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 700,
                        background: v.isNewSession ? T.greenSoft : 'rgba(255,255,255,0.06)',
                        color: v.isNewSession ? T.green : T.textMuted,
                      }}>
                        {v.isNewSession ? 'جلسة جديدة' : 'تصفح'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 8px', color: T.textDim }}>{formatRelative(v.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  )
}

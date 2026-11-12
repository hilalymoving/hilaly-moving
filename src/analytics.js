import { collection, addDoc, getDocs, query, orderBy, limit, writeBatch } from 'firebase/firestore'
import { db } from './firebase'

const GEO_CACHE_KEY = 'hm_geo_cache'
const SESSION_KEY = 'hm_visit_session'

let lastTrackedPath = ''
let lastTrackedAt = 0

function getDeviceType() {
  if (typeof window === 'undefined') return 'desktop'
  const w = window.innerWidth
  if (w < 640) return 'mobile'
  if (w < 1024) return 'tablet'
  return 'desktop'
}

function getCleanReferrer() {
  try {
    if (!document.referrer) return 'مباشر'
    const refHost = new URL(document.referrer).hostname
    if (!refHost || refHost === window.location.hostname) return 'داخلي'
    return refHost.slice(0, 120)
  } catch {
    return 'مباشر'
  }
}

async function resolveGeo() {
  try {
    const cached = sessionStorage.getItem(GEO_CACHE_KEY)
    if (cached) return JSON.parse(cached)
  } catch {}

  const fallback = { city: 'غير محدد', region: '', country: 'غير محدد' }

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 2500)
    const res = await fetch('https://ipwho.is/?fields=success,city,region,country', {
      signal: controller.signal,
    })
    clearTimeout(timer)
    if (!res.ok) return fallback
    const data = await res.json()
    if (data && data.success !== false) {
      const geo = {
        city: (data.city || 'غير محدد').slice(0, 100),
        region: (data.region || '').slice(0, 100),
        country: (data.country || 'غير محدد').slice(0, 100),
      }
      try { sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(geo)) } catch {}
      return geo
    }
  } catch {}

  return fallback
}

export async function trackVisit(path) {
  if (typeof window === 'undefined') return
  if (!path || path.startsWith('/admin')) return

  const now = Date.now()
  if (path === lastTrackedPath && now - lastTrackedAt < 2000) return
  lastTrackedPath = path
  lastTrackedAt = now

  let isNewSession = false
  try {
    if (!sessionStorage.getItem(SESSION_KEY)) {
      sessionStorage.setItem(SESSION_KEY, String(now))
      isNewSession = true
    }
  } catch {
    isNewSession = true
  }

  try {
    const geo = await resolveGeo()
    await addDoc(collection(db, 'visits'), {
      city: geo.city,
      region: geo.region,
      country: geo.country,
      path: path.slice(0, 200),
      device: getDeviceType(),
      referrer: getCleanReferrer(),
      isNewSession,
      createdAt: new Date().toISOString(),
    })
  } catch {
    // Silent fail if offline or rules block writes
  }
}

export async function fetchTrafficData(maxDocs = 2000) {
  const q = query(
    collection(db, 'visits'),
    orderBy('createdAt', 'desc'),
    limit(maxDocs)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function clearTrafficLogs() {
  const snap = await getDocs(query(collection(db, 'visits'), limit(500)))
  if (snap.empty) return 0
  const batch = writeBatch(db)
  snap.docs.forEach(d => batch.delete(d.ref))
  await batch.commit()
  return snap.size
}

const PAGE_LABELS = {
  '/': 'الرئيسية',
  '/services': 'الخدمات',
  '/pricing': 'العروض والأسعار',
  '/about': 'من نحن',
  '/contact': 'اتصل بنا',
  '/blog': 'المدونة',
}

export function getPageLabel(path) {
  if (PAGE_LABELS[path]) return PAGE_LABELS[path]
  if (path?.startsWith('/blog/')) {
    try {
      return 'مقال: ' + decodeURIComponent(path.replace('/blog/', ''))
    } catch {
      return path
    }
  }
  return path || '/'
}

export function aggregateTraffic(visits, range = '30d') {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()

  let cutoff = 0
  let daysCount = 14
  if (range === 'today') {
    cutoff = startOfToday
    daysCount = 1
  } else if (range === '7d') {
    cutoff = now.getTime() - 7 * 24 * 60 * 60 * 1000
    daysCount = 7
  } else if (range === '30d') {
    cutoff = now.getTime() - 30 * 24 * 60 * 60 * 1000
    daysCount = 30
  } else {
    daysCount = 14
  }

  const filtered = cutoff
    ? visits.filter(v => {
        const ts = Date.parse(v.createdAt)
        return !Number.isNaN(ts) && ts >= cutoff
      })
    : visits

  const totalVisits = filtered.length
  let uniqueSessions = 0
  const cityMap = new Map()
  const pageMap = new Map()
  const refMap = new Map()
  const devices = { mobile: 0, tablet: 0, desktop: 0 }
  const dayMap = new Map()

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    dayMap.set(key, {
      date: key,
      label: `${d.getDate()}/${d.getMonth() + 1}`,
      count: 0,
      sessions: 0,
    })
  }

  for (const v of filtered) {
    if (v.isNewSession) uniqueSessions += 1

    const cityName = (v.city || 'غير محدد').trim()
    const countryName = (v.country || '').trim()
    const cityKey = `${cityName}||${countryName}`
    const prevCity = cityMap.get(cityKey) || { city: cityName, country: countryName, count: 0, sessions: 0 }
    prevCity.count += 1
    if (v.isNewSession) prevCity.sessions += 1
    cityMap.set(cityKey, prevCity)

    const p = v.path || '/'
    pageMap.set(p, (pageMap.get(p) || 0) + 1)

    const r = v.referrer || 'مباشر'
    refMap.set(r, (refMap.get(r) || 0) + 1)

    if (devices[v.device] !== undefined) devices[v.device] += 1
    else devices.desktop += 1

    const dayKey = (v.createdAt || '').slice(0, 10)
    if (dayMap.has(dayKey)) {
      const bucket = dayMap.get(dayKey)
      bucket.count += 1
      if (v.isNewSession) bucket.sessions += 1
    }
  }

  const cities = Array.from(cityMap.values())
    .sort((a, b) => b.count - a.count)
    .map(c => ({
      ...c,
      pct: totalVisits ? Math.round((c.count / totalVisits) * 100) : 0,
    }))

  const pages = Array.from(pageMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([path, count]) => ({
      path,
      label: getPageLabel(path),
      count,
      pct: totalVisits ? Math.round((count / totalVisits) * 100) : 0,
    }))

  const referrers = Array.from(refMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([source, count]) => ({
      source,
      count,
      pct: totalVisits ? Math.round((count / totalVisits) * 100) : 0,
    }))

  const deviceStats = {
    mobile: { count: devices.mobile, pct: totalVisits ? Math.round((devices.mobile / totalVisits) * 100) : 0 },
    tablet: { count: devices.tablet, pct: totalVisits ? Math.round((devices.tablet / totalVisits) * 100) : 0 },
    desktop: { count: devices.desktop, pct: totalVisits ? Math.round((devices.desktop / totalVisits) * 100) : 0 },
  }

  return {
    totalVisits,
    uniqueSessions,
    citiesCount: cities.length,
    topCity: cities[0] || null,
    cities,
    pages,
    referrers,
    deviceStats,
    dailySeries: Array.from(dayMap.values()),
    recent: filtered.slice(0, 25),
  }
}

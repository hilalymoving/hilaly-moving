// Cloudflare D1 Backend Client
import { CMS, CMS_VIDEO } from './cms'

export async function loadSiteData() {
  try {
    const res = await fetch('/api/site')
    if (!res.ok) return null
    const data = await res.json()
    if (data && data.success && data.content) {
      return {
        content: data.content,
        video: data.video || CMS_VIDEO,
      }
    }
    return null
  } catch (err) {
    return null
  }
}

export async function saveSiteData(content, video) {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('hm_token') : null
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }

    const res = await fetch('/api/site', {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        content,
        video: video || {}
      })
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      console.error('Save failed:', err.error || res.statusText)
      return false
    }

    const data = await res.json()
    return Boolean(data.success)
  } catch (err) {
    console.error('Save error:', err)
    return false
  }
}

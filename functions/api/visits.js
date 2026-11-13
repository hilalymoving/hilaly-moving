import { getAuthUser } from './_auth.js'

export async function onRequestPost(context) {
  const { env, request } = context
  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'Database binding missing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const path = (body.path || '/').slice(0, 200)
    if (path.startsWith('/admin')) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const device = (body.device || 'desktop').slice(0, 20)
    const referrer = (body.referrer || 'مباشر').slice(0, 150)
    const isNewSession = body.isNewSession ? 1 : 0

    // Native Cloudflare Edge Geo (0ms latency, zero external API calls!)
    const cf = request.cf || {}
    const city = (body.city || cf.city || 'غير محدد').slice(0, 100)
    const region = (body.region || cf.region || '').slice(0, 100)
    const country = (body.country || cf.country || 'EG').slice(0, 50)
    const createdAt = new Date().toISOString()

    await env.DB.prepare(`
      INSERT INTO visits (city, region, country, path, device, referrer, is_new_session, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(city, region, country, path, device, referrer, isNewSession, createdAt).run()

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function onRequestGet(context) {
  const { env, request } = context
  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'Database binding missing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const user = await getAuthUser(request, env)
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized: Admin login required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const url = new URL(request.url)
    const max = Math.min(parseInt(url.searchParams.get('limit') || '2000', 10), 5000)

    const { results } = await env.DB.prepare(`
      SELECT id, city, region, country, path, device, referrer, is_new_session as isNewSession, created_at as createdAt
      FROM visits
      ORDER BY created_at DESC
      LIMIT ?
    `).bind(max).all()

    return new Response(JSON.stringify({
      success: true,
      visits: results || []
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function onRequestDelete(context) {
  const { env, request } = context
  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'Database binding missing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const user = await getAuthUser(request, env)
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    await env.DB.prepare('DELETE FROM visits').run()
    return new Response(JSON.stringify({ success: true, message: 'All traffic logs cleared' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

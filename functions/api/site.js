import { getAuthUser } from './_auth.js'

export async function onRequestGet(context) {
  const { env } = context
  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'Database binding missing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const row = await env.DB.prepare(
      'SELECT content, video, updated_at, updated_by FROM site_data WHERE id = ?'
    ).bind('site').first()

    if (!row) {
      return new Response(JSON.stringify({ success: false, content: null, video: null }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const content = JSON.parse(row.content)
    const video = JSON.parse(row.video)

    return new Response(JSON.stringify({
      success: true,
      content,
      video,
      updatedAt: row.updated_at,
      updatedBy: row.updated_by
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=600',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function onRequestPut(context) {
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
    const body = await request.json()
    const { content, video } = body

    if (!content) {
      return new Response(JSON.stringify({ error: 'Content is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const contentJson = JSON.stringify(content)
    const videoJson = JSON.stringify(video || {})
    const now = new Date().toISOString()
    const updatedBy = user.email || 'admin'

    await env.DB.prepare(`
      INSERT INTO site_data (id, content, video, updated_at, updated_by)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        content = excluded.content,
        video = excluded.video,
        updated_at = excluded.updated_at,
        updated_by = excluded.updated_by
    `).bind('site', contentJson, videoJson, now, updatedBy).run()

    return new Response(JSON.stringify({ success: true, updatedAt: now }), {
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

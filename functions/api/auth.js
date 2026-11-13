import { generateSalt, hashPassword, verifyPassword, createJwt, getAuthUser } from './_auth.js'

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
    const email = (body.email || '').trim().toLowerCase()
    const password = body.password || ''

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check if any admin exists
    const adminCountRow = await env.DB.prepare('SELECT COUNT(*) as count FROM admins').first()
    const count = adminCountRow?.count || 0

    if (count === 0) {
      // First-time setup: automatically initialize this admin
      const salt = generateSalt()
      const passwordHash = await hashPassword(password, salt)
      const now = new Date().toISOString()

      await env.DB.prepare(`
        INSERT INTO admins (email, password_hash, salt, created_at)
        VALUES (?, ?, ?, ?)
      `).bind(email, passwordHash, salt, now).run()

      const token = await createJwt({
        sub: email,
        email,
        role: 'admin',
        exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days
      }, env.JWT_SECRET)

      return new Response(JSON.stringify({
        success: true,
        token,
        user: { email, role: 'admin' },
        message: 'تم إعداد حساب المسؤول بنجاح'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Find admin by email
    const admin = await env.DB.prepare('SELECT * FROM admins WHERE email = ?').bind(email).first()
    if (!admin) {
      return new Response(JSON.stringify({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const isValid = await verifyPassword(password, admin.salt, admin.password_hash)
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'كلمة المرور غير صحيحة' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const token = await createJwt({
      sub: admin.email,
      email: admin.email,
      role: 'admin',
      exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days
    }, env.JWT_SECRET)

    return new Response(JSON.stringify({
      success: true,
      token,
      user: { email: admin.email, role: 'admin' }
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

export async function onRequestGet(context) {
  const { env, request } = context
  const user = await getAuthUser(request, env)
  if (!user) {
    return new Response(JSON.stringify({ valid: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({ valid: true, user }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

export async function onRequestPut(context) {
  const { env, request } = context
  const user = await getAuthUser(request, env)
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const { currentPassword, newEmail, newPassword } = body

    if (!currentPassword) {
      return new Response(JSON.stringify({ error: 'كلمة المرور الحالية مطلوبة للتأكيد' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const admin = await env.DB.prepare('SELECT * FROM admins WHERE email = ?').bind(user.email).first()
    if (!admin) {
      return new Response(JSON.stringify({ error: 'المستخدم غير موجود' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const isValid = await verifyPassword(currentPassword, admin.salt, admin.password_hash)
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'كلمة المرور الحالية غير صحيحة' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    let updatedEmail = admin.email
    if (newEmail && newEmail.trim()) {
      updatedEmail = newEmail.trim().toLowerCase()
    }

    let updatedHash = admin.password_hash
    let updatedSalt = admin.salt
    if (newPassword && newPassword.trim().length >= 6) {
      updatedSalt = generateSalt()
      updatedHash = await hashPassword(newPassword.trim(), updatedSalt)
    }

    await env.DB.prepare(`
      UPDATE admins SET email = ?, password_hash = ?, salt = ? WHERE id = ?
    `).bind(updatedEmail, updatedHash, updatedSalt, admin.id).run()

    const newToken = await createJwt({
      sub: updatedEmail,
      email: updatedEmail,
      role: 'admin',
      exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60)
    }, env.JWT_SECRET)

    return new Response(JSON.stringify({
      success: true,
      token: newToken,
      user: { email: updatedEmail, role: 'admin' },
      message: 'تم تحديث بيانات الدخول بنجاح'
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

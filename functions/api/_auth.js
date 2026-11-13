const DEFAULT_JWT_SECRET = 'hilaly-moving-jwt-secret-secure-key-2026'

// Convert ArrayBuffer to Hex String
function buf2hex(buffer) {
  return [...new Uint8Array(buffer)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('')
}

// Convert ArrayBuffer to Base64URL
function buf2base64url(buffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function base64url2buf(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) str += '='
  const binary = atob(str)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

export function generateSalt() {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return buf2hex(bytes)
}

export async function hashPassword(password, saltHex) {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  )

  const saltBytes = new Uint8Array(
    saltHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
  )

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  )

  return buf2hex(derivedBits)
}

export async function verifyPassword(password, saltHex, storedHashHex) {
  const computedHashHex = await hashPassword(password, saltHex)
  return computedHashHex === storedHashHex
}

export async function createJwt(payload, secret = DEFAULT_JWT_SECRET) {
  const enc = new TextEncoder()
  const header = { alg: 'HS256', typ: 'JWT' }
  
  const headerB64 = buf2base64url(enc.encode(JSON.stringify(header)))
  const payloadB64 = buf2base64url(enc.encode(JSON.stringify(payload)))
  const data = `${headerB64}.${payloadB64}`

  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(data))
  const signatureB64 = buf2base64url(signature)

  return `${data}.${signatureB64}`
}

export async function verifyJwt(token, secret = DEFAULT_JWT_SECRET) {
  if (!token || typeof token !== 'string') return null
  const parts = token.split('.')
  if (parts.length !== 3) return null

  const [headerB64, payloadB64, signatureB64] = parts
  const data = `${headerB64}.${payloadB64}`
  const enc = new TextEncoder()

  try {
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      base64url2buf(signatureB64),
      enc.encode(data)
    )

    if (!isValid) return null

    const payloadJson = new TextDecoder().decode(base64url2buf(payloadB64))
    const payload = JSON.parse(payloadJson)

    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return null // Expired
    }

    return payload
  } catch {
    return null
  }
}

export async function getAuthUser(request, env) {
  const authHeader = request.headers.get('Authorization') || ''
  if (!authHeader.startsWith('Bearer ')) return null
  const token = authHeader.slice(7).trim()
  const secret = env.JWT_SECRET || DEFAULT_JWT_SECRET
  return verifyJwt(token, secret)
}

// Cloudinary configuration

export const IK_CONFIG = {
  cloudName: 'dxvoir9oy',
  apiKey: 'SOipLMq61OSi8lMQQwYTIf3BFpE',
}

// Build an optimized Cloudinary URL
export function ikUrl(path, transforms = {}) {
  if (!path) return ''

  // If it's already a Cloudinary URL, return as-is
  if (path.includes('cloudinary.com')) return path

  // If it's a base64 data URL, return as-is
  if (path.startsWith('data:')) return path

  const base = `https://res.cloudinary.com/${IK_CONFIG.cloudName}/image/upload`

  // Build transformation string
  const parts = []
  if (transforms.width)   parts.push(`w_${transforms.width}`)
  if (transforms.height)  parts.push(`h_${transforms.height}`)
  if (transforms.quality) parts.push(`q_${transforms.quality}`)
  if (transforms.format)  parts.push(`f_${transforms.format}`)
  if (transforms.crop)    parts.push(`c_${transforms.crop}`)

  const tr = parts.length ? `/${parts.join(',')}` : ''

  return `${base}${tr}/${path}`
}

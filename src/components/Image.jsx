export function optimizeCloudinaryUrl(url, { width, quality = 'auto', format = 'auto' } = {}) {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com') || !url.includes('/image/upload/')) {
    return url
  }
  const parts = url.split('/image/upload/')
  const prefix = parts[0] + '/image/upload/'
  const rest = parts[1]

  let path = rest
  const match = rest.match(/^([a-z0-9_,:-]+)\/(.+)$/i)
  if (match && !/^v\d+$/i.test(match[1]) && !match[1].includes('.')) {
    if (/[_,]/.test(match[1]) || /^(w|h|c|f|q|e|b|l|o|r|t|g|x|y|a|co|dpr)_/i.test(match[1])) {
      path = match[2]
    }
  }

  const transforms = [`f_${format}`, `q_${quality}`]
  if (width) {
    transforms.push(`w_${Math.round(width)}`, 'c_limit')
  }
  return `${prefix}${transforms.join(',')}/${path}`
}

export function optimizeImageUrl(url, { width, quality = 'auto', format = 'auto' } = {}) {
  if (!url || typeof url !== 'string') return url

  if (url.includes('res.cloudinary.com') && url.includes('/image/upload/')) {
    return optimizeCloudinaryUrl(url, { width, quality, format })
  }

  if (url.includes('images.unsplash.com')) {
    try {
      const u = new URL(url)
      u.searchParams.set('auto', 'format')
      u.searchParams.set('fit', 'crop')
      if (width) u.searchParams.set('w', String(Math.round(width)))
      u.searchParams.set('q', quality === 'auto' ? '80' : quality)
      return u.toString()
    } catch {
      return url
    }
  }

  return url
}

export default function Image({
  src,
  alt = '',
  width,
  height,
  priority = false,
  sizes,
  style = {},
  className,
  ...props
}) {
  if (!src) return null

  const isCloudinary = typeof src === 'string' && src.includes('res.cloudinary.com') && src.includes('/image/upload/')
  const isUnsplash = typeof src === 'string' && src.includes('images.unsplash.com')

  // Meaningful alt fallback
  const safeAlt = (!alt || alt === 'صورة جديدة' || alt.trim() === '')
    ? 'هلالي موفينج - شركة نقل وتغليف أثاث في مصر'
    : alt

  let optimizedSrc = src
  let srcSet = undefined
  let effectiveSizes = sizes

  if (isCloudinary) {
    const isSmall = width && width <= 200
    if (isSmall) {
      // For icons & logos (e.g. 120px logo)
      optimizedSrc = optimizeCloudinaryUrl(src, { width: width * 2 })
      srcSet = `${optimizeCloudinaryUrl(src, { width })} 1x, ${optimizeCloudinaryUrl(src, { width: width * 2 })} 2x`
    } else {
      // Responsive widths for banners, hero, gallery
      const targetWidth = width || 800
      optimizedSrc = optimizeCloudinaryUrl(src, { width: targetWidth })

      const candidateWidths = [400, 640, 800, 1080, 1200].filter(w => !width || w <= Math.max(width * 1.5, 600))
      if (candidateWidths.length > 1) {
        srcSet = candidateWidths
          .map(w => `${optimizeCloudinaryUrl(src, { width: w })} ${w}w`)
          .join(', ')
        effectiveSizes = sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 1200px'
      }
    }
  } else if (isUnsplash) {
    optimizedSrc = optimizeImageUrl(src, { width: width || 800 })
  }

  const computedStyle = {
    display: 'block',
    ...(width && height && !style.aspectRatio ? { aspectRatio: `${width} / ${height}` } : {}),
    ...style,
  }

  return (
    <img
      src={optimizedSrc}
      srcSet={srcSet}
      sizes={srcSet ? effectiveSizes : undefined}
      alt={safeAlt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding={priority ? 'sync' : 'async'}
      style={computedStyle}
      className={className}
      {...props}
    />
  )
}

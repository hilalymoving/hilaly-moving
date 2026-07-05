export default function Image({
  src,
  alt = '',
  width,
  height,
  priority = false,
  style = {},
  className,
  ...props
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      fetchpriority={priority ? 'high' : undefined}
      decoding={priority ? 'sync' : 'async'}
      style={{ display: 'block', ...style }}
      className={className}
      {...props}
    />
  )
}

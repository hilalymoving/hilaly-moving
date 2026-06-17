import { useState, useEffect, useRef } from 'react'

export function useReveal() {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect() } },
      { threshold: 0.1 }
    )
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return [ref, vis]
}

const DIRS = {
  up: 'translateY(36px)',
  down: 'translateY(-36px)',
  left: 'translateX(-36px)',
  right: 'translateX(36px)',
}

export function Reveal({ children, delay = 0, dir = 'up', style = {} }) {
  const [ref, vis] = useReveal()
  return (
    <div
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'none' : DIRS[dir],
        transition: `opacity .65s ease ${delay}ms, transform .65s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

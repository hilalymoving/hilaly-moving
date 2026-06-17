import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../theme'
import { Reveal } from '../Reveal'

export default function VideoSection({ video }) {
  const th = useTheme()
  const [playing, setPlaying] = useState(false)
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false)
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)
  const videoRef = useRef(null)
  const sectionRef = useRef(null)

  if (!video?.src) return null

  const toggle = () => {
    if (!videoRef.current) return
    if (playing) { 
      videoRef.current.pause()
      setPlaying(false)
    } else { 
      videoRef.current.play()
        .then(() => setPlaying(true))
        .catch(() => setAutoplayBlocked(true))
    }
  }

  // Autoplay when video comes into view
  useEffect(() => {
    if (!videoRef.current || !sectionRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When video is 50% visible and hasn't autoplayed yet
          if (entry.isIntersecting && !hasAutoPlayed && videoRef.current) {
            // Try to autoplay
            const playPromise = videoRef.current.play()
            
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  setPlaying(true)
                  setHasAutoPlayed(true)
                  setAutoplayBlocked(false)
                })
                .catch((err) => {
                  // Autoplay blocked by browser (common on iOS)
                  console.log('Autoplay prevented - user interaction required')
                  setAutoplayBlocked(true)
                  setHasAutoPlayed(true) // Don't try again
                })
            }
          }
        })
      },
      { threshold: 0.3 } // Lower threshold for better mobile experience
    )

    observer.observe(sectionRef.current)

    return () => observer.disconnect()
  }, [hasAutoPlayed])

  return (
    <section ref={sectionRef} style={{
      padding: 'clamp(3rem,8vw,6rem) 1.2rem',
      background: th.bg,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle gold glow blobs */}
      <div style={{ position: 'absolute', top: '0%', right: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(212,160,23,0.07) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '0%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(212,160,23,0.05) 0%,transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1, width: '100%' }}>

        {/* Header */}
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '7px 18px', borderRadius: 999,
              background: 'rgba(212,160,23,0.12)',
              border: '1px solid rgba(212,160,23,0.3)',
              color: th.accentText, fontSize: 13, fontWeight: 700,
              marginBottom: 20,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              شاهد كيف نعمل
            </span>

            {video.title && (
              <h2 style={{
                fontSize: 'clamp(1.7rem,3.5vw,2.3rem)', fontWeight: 900,
                color: th.text, letterSpacing: '-.5px', marginBottom: 10,
              }}>{video.title}</h2>
            )}
            {video.desc && (
              <p style={{ color: th.textMuted, fontSize: 15, maxWidth: 520, margin: '0 auto' }}>{video.desc}</p>
            )}
          </div>
        </Reveal>

        {/* Video card */}
        <Reveal delay={100}>
          <div style={{ position: 'relative' }}>
            {/* Gold glow ring */}
            <div style={{
              position: 'absolute', inset: -2, borderRadius: 28, zIndex: 0,
              background: 'linear-gradient(135deg, rgba(212,160,23,0.4), transparent 55%, rgba(184,134,11,0.2))',
              filter: 'blur(10px)',
            }} />

            <div style={{
              position: 'relative', zIndex: 1,
              borderRadius: 24, overflow: 'hidden',
              background: '#000',
              border: '1px solid rgba(212,160,23,0.2)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.4)',
            }}>
              <video
                ref={videoRef}
                src={video.src}
                controls
                muted
                playsInline
                preload="metadata"
                webkit-playsinline="true"
                x5-playsinline="true"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
                style={{ width: '100%', display: 'block', maxHeight: 520, objectFit: 'contain' }}
              />

              {/* Play overlay - show if not playing OR if autoplay was blocked */}
              {(!playing || autoplayBlocked) && (
                <div
                  onClick={toggle}
                  style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.45)', cursor: 'pointer', transition: 'background .2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.25)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.45)'}
                >
                  <div style={{
                    width: 76, height: 76, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #D4A017, #B8860B)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 40px rgba(212,160,23,0.6)',
                    transition: 'transform .2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="#000" style={{ marginRight: -3 }}>
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  
                  {/* Tap to play hint for mobile */}
                  {autoplayBlocked && (
                    <div style={{
                      position: 'absolute',
                      bottom: 30,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'rgba(0,0,0,0.8)',
                      color: '#fff',
                      padding: '8px 16px',
                      borderRadius: 20,
                      fontSize: 13,
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}>
                      👆 اضغط للتشغيل
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  )
}

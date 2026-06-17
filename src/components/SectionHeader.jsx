import { useTheme } from '../theme'
import { Reveal } from '../Reveal'

export default function SectionHeader({ title, sub }) {
  const th = useTheme()
  return (
    <Reveal>
      <div style={{ textAlign: 'center', marginBottom: 'clamp(28px,6vw,52px)' }}>
        <h2 style={{
          fontSize: 'clamp(1.5rem,5vw,2.4rem)', fontWeight: 900,
          color: th.text, letterSpacing: '-.5px', marginBottom: 10,
        }}>
          {title}
        </h2>
        <p style={{ color: th.textMuted, fontSize: 'clamp(13px,3vw,16px)', maxWidth: 460, margin: '0 auto', lineHeight: 1.6 }}>{sub}</p>
      </div>
    </Reveal>
  )
}

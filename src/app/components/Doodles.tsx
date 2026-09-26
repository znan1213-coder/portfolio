// ── Doodles — hand-drawn red stars, sparkles and squiggles shared across pages ──
// Red ink, thicker stroke; the 'doodle-rough' filter (defined once in DoodleDefs) roughens the
// edges so the line weight wobbles like a marker instead of a clean vector stroke
export const DOODLE_RED = '#FD1E20'
export const INK = { fill: 'none', stroke: DOODLE_RED, strokeWidth: 2.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, filter: 'url(#doodle-rough)' }

export function DoodleDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
      <defs>
        <filter id="doodle-rough" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  )
}

export function Star({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path {...INK} d="M12,2.5 L14.6,9.2 L21.3,9.6 L16.1,13.9 L17.9,20.8 L12.1,16.9 L6.2,20.6 L8.1,13.8 L2.8,9.5 L9.5,9.1 Z" />
    </svg>
  )
}
export function Sparkle({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path {...INK} d="M12,2 C12.6,8.5 15.2,11.3 22,12 C15.3,12.8 12.7,15.4 12,22 C11.2,15.5 8.6,12.8 2,12 C8.8,11.2 11.3,8.6 12,2 Z" />
    </svg>
  )
}
export function Squiggle({ width = 34 }: { width?: number }) {
  return (
    <svg width={width} height={width * 0.35} viewBox="0 0 40 14" aria-hidden="true">
      <path {...INK} d="M2,8 C6,2 9,2 11,7 C13,12 17,12 19,7 C21,2 25,2 27,7 C29,12 33,12 38,5" />
    </svg>
  )
}
export function Loop({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 34 24" aria-hidden="true">
      <path {...INK} d="M2,18 C8,19 14,15 15,9 C16,3 10,2 9,7 C8,13 16,17 22,13 C26,10 29,6 32,5" />
    </svg>
  )
}
export function Burst({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path {...INK} d="M12,3 L12.5,8 M20,6 L16.5,9.5 M21.5,14 L16.8,13.2 M4,6.5 L7.8,9.8 M2.8,14.5 L7.4,13.4" />
    </svg>
  )
}
export function Dot() {
  return <span aria-hidden="true" style={{ display: 'block', width: 6, height: 5, borderRadius: '50% 45% 55% 50%', background: DOODLE_RED }} />
}


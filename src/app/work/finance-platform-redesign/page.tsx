'use client'

import { useEffect, useRef, useState } from 'react'
import Nav from '../../components/Nav'

// ── Wobbly border ─────────────────────────────────────────────────────────────
function seg(x1: number, y1: number, x2: number, y2: number, wobble: number, n: number) {
  const dx = x2 - x1, dy = y2 - y1
  const len = Math.hypot(dx, dy)
  if (!len) return ''
  const nx = -dy / len, ny = dx / len
  let d = ''
  for (let i = 0; i < n; i++) {
    const mid = (i + 0.5) / n, t1 = (i + 1) / n
    const off = (Math.random() - 0.5) * wobble * 2
    d += ` Q ${(x1 + dx * mid + nx * off).toFixed(1)} ${(y1 + dy * mid + ny * off).toFixed(1)}`
       + ` ${(x1 + dx * t1).toFixed(1)} ${(y1 + dy * t1).toFixed(1)}`
  }
  return d
}

function buildPath(W: number, H: number): string {
  const r = 5, wb = 1.8
  const sh = Math.max(3, Math.floor(W / 80))
  const sv = Math.max(2, Math.floor(H / 60))
  return `M ${r} 0`
    + seg(r, 0, W - r, 0, wb, sh) + ` A ${r} ${r} 0 0 1 ${W} ${r}`
    + seg(W, r, W, H - r, wb, sv) + ` A ${r} ${r} 0 0 1 ${W - r} ${H}`
    + seg(W - r, H, r, H, wb, sh) + ` A ${r} ${r} 0 0 1 0 ${H - r}`
    + seg(0, H - r, 0, r, wb, sv) + ` A ${r} ${r} 0 0 1 ${r} 0 Z`
}

function buildPillPath(W: number, H: number): string {
  const r = Math.floor(H / 2), wb = 1.2
  const sh = Math.max(2, Math.floor((W - 2 * r) / 40))
  return `M ${r} 0`
    + seg(r, 0, W - r, 0, wb, sh) + ` A ${r} ${r} 0 0 1 ${W} ${r}`
    + ` A ${r} ${r} 0 0 1 ${W - r} ${H}`
    + seg(W - r, H, r, H, wb, sh) + ` A ${r} ${r} 0 0 1 0 ${H - r}`
    + ` A ${r} ${r} 0 0 1 ${r} 0 Z`
}

function WobblyPillBorder() {
  const ref = useRef<SVGSVGElement>(null)
  const [path, setPath] = useState('')
  const prev = useRef({ w: 0, h: 0 })

  useEffect(() => {
    if (!ref.current) return
    const update = () => {
      const { width: w, height: h } = ref.current!.getBoundingClientRect()
      const [rw, rh] = [Math.round(w), Math.round(h)]
      if (rw === prev.current.w && rh === prev.current.h) return
      prev.current = { w: rw, h: rh }
      if (rw && rh) setPath(buildPillPath(rw, rh))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  return (
    <svg ref={ref} aria-hidden="true" style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      pointerEvents: 'none', overflow: 'visible',
    }}>
      {path && <path d={path} fill="none" stroke="#1A1A1A" strokeWidth="1"
        strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  )
}

function WobblyBorder({ strokeColor = '#1A1A1A' }: { strokeColor?: string }) {
  const ref = useRef<SVGSVGElement>(null)
  const [path, setPath] = useState('')
  const prev = useRef({ w: 0, h: 0 })

  useEffect(() => {
    if (!ref.current) return
    const update = () => {
      const { width: w, height: h } = ref.current!.getBoundingClientRect()
      const [rw, rh] = [Math.round(w), Math.round(h)]
      if (rw === prev.current.w && rh === prev.current.h) return
      prev.current = { w: rw, h: rh }
      if (rw && rh) setPath(buildPath(rw, rh))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  return (
    <svg ref={ref} aria-hidden="true" style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      pointerEvents: 'none', overflow: 'visible',
    }}>
      {path && <path d={path} fill="none" stroke={strokeColor} strokeWidth="1"
        strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  )
}

// ── Placeholder image ─────────────────────────────────────────────────────────
function PlaceholderImage({ aspect = '16/9', bg = '#EAE3DA', label = 'screenshot placeholder' }: {
  aspect?: string; bg?: string; label?: string
}) {
  return (
    <div style={{ position: 'relative', aspectRatio: aspect, width: '100%', background: bg, overflow: 'hidden' }}>
      <WobblyBorder strokeColor="#CCCCCC" />
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.14,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />
      <span style={{
        position: 'absolute', bottom: '1.25rem', left: 0, right: 0,
        textAlign: 'center',
        fontFamily: 'var(--sans)',
        fontSize: '0.7rem',
        color: '#A89688',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}>
        {label}
      </span>
    </div>
  )
}

// ── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: 'var(--sans)',
      fontSize: '0.8125rem',
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: 'var(--terracotta)',
      marginBottom: '1.25rem',
      fontWeight: 500,
    }}>
      {children}
    </p>
  )
}

// ── Nav ───────────────────────────────────────────────────────────────────────
// ── Page ──────────────────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  { id: 'problem', label: 'Problem' },
  { id: 'design', label: 'Approach' },
  { id: 'final-design', label: 'Final Design' },
  { id: 'impact', label: 'Impact' },
]

// ── Final Design tabs ─────────────────────────────────────────────────────────
const TABS = [
  {
    label: 'Tab 1',
    image: '',
    title: '[PLACEHOLDER: heading]',
    subtitle: '[PLACEHOLDER: body copy]',
    inactiveBg: '#EAE3DA', inactiveColor: '#7A3A1A',
  },
  {
    label: 'Tab 2',
    image: '',
    title: '[PLACEHOLDER: heading]',
    subtitle: '[PLACEHOLDER: body copy]',
    inactiveBg: '#C5CEA0', inactiveColor: '#4A5E35',
  },
  {
    label: 'Tab 3',
    image: '',
    title: '[PLACEHOLDER: heading]',
    subtitle: '[PLACEHOLDER: body copy]',
    inactiveBg: '#D4B8C7', inactiveColor: '#6B3D5E',
  },
]

// ── Pillar rows ───────────────────────────────────────────────────────────────
const PILLARS = [
  {
    name: '[PLACEHOLDER: heading]',
    desc: '[PLACEHOLDER: body copy]',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="8.5" stroke="#B05A2B" strokeWidth="1.4" strokeLinecap="round"
          strokeDasharray="2 0" strokeLinejoin="round"
          style={{ strokeDashoffset: 0 }} />
        <circle cx="11" cy="11" r="3.5" stroke="#B05A2B" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    name: '[PLACEHOLDER: heading]',
    desc: '[PLACEHOLDER: body copy]',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M11 2.5 C11 2.5 4 5 4 11 C4 15.5 7 18.5 11 19.5 C15 18.5 18 15.5 18 11 C18 5 11 2.5 11 2.5Z"
          stroke="#B05A2B" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 11 L10 13 L14 9" stroke="#B05A2B" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: '[PLACEHOLDER: heading]',
    desc: '[PLACEHOLDER: body copy]',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="8.5" stroke="#B05A2B" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="11" cy="11" r="2" fill="#B05A2B" />
        <line x1="11" y1="2.5" x2="11" y2="5" stroke="#B05A2B" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="11" y1="17" x2="11" y2="19.5" stroke="#B05A2B" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="2.5" y1="11" x2="5" y2="11" stroke="#B05A2B" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="17" y1="11" x2="19.5" y2="11" stroke="#B05A2B" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
]

function WobblyHRule() {
  return (
    <svg width="100%" height="8" viewBox="0 0 600 8" preserveAspectRatio="none" aria-hidden="true" style={{ display: 'block' }}>
      <path d="M0,4 C80,2.5 160,5.5 260,4 C360,2.5 460,5.5 540,4 C565,3.5 585,4.5 600,4"
        fill="none" stroke="#E0D8D0" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

const PILLAR_ICONS = [
  <svg key="0" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M10,1.2 C13.8,1.0 18.4,4.6 18.8,9.2 C19.2,13.9 16.1,18.5 11.2,18.9 C6.3,19.3 1.4,16.0 1.1,10.8 C0.8,5.7 4.8,1.4 10,1.2 Z" fill="#A0522D" />
    <path d="M6.2 10.2 L8.8 12.8 L13.8 7.2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg key="1" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M9.5,0.9 C13.5,0.6 18.6,4.2 18.9,9.5 C19.2,14.4 15.8,19.1 10.5,19.2 C5.6,19.3 0.8,15.5 0.9,10.2 C1.0,5.0 5.2,1.2 9.5,0.9 Z" fill="#A0522D" />
    <path d="M6.2 10.2 L8.8 12.8 L13.8 7.2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg key="2" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M10.2,1.1 C14.2,1.3 19.0,5.2 18.7,9.8 C18.4,14.7 14.5,19.2 9.8,18.9 C5.0,18.6 0.7,14.8 1.0,10.0 C1.3,5.2 5.8,0.9 10.2,1.1 Z" fill="#A0522D" />
    <path d="M6.2 10.2 L8.8 12.8 L13.8 7.2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
]

function PillarRows() {
  return (
    <div className="pillar-cols" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem', marginBottom: '4rem' }}>
      {PILLARS.map((p, i) => (
        <div key={p.name + i}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
            {PILLAR_ICONS[i]}
            <span style={{
              fontFamily: 'var(--serif)', fontSize: '1.125rem',
              fontWeight: 400, color: '#1a1a1a', lineHeight: 1.2,
            }}>
              {p.name}
            </span>
          </div>
          <p style={{
            fontFamily: 'var(--sans)', fontSize: '0.9375rem',
            fontWeight: 400, color: '#555', lineHeight: 1.7, margin: 0,
          }}>
            {p.desc}
          </p>
        </div>
      ))}
    </div>
  )
}

const DIMENSION_CARDS = [
  { title: '[PLACEHOLDER: heading]', desc: '[PLACEHOLDER: body copy]' },
  { title: '[PLACEHOLDER: heading]', desc: '[PLACEHOLDER: body copy]' },
  { title: '[PLACEHOLDER: heading]', desc: '[PLACEHOLDER: body copy]' },
]

function DesignDetailsShowcase() {
  const [activeTab, setActiveTab] = useState(0)
  const [direction, setDirection] = useState<'up' | 'down'>('up')
  const [animKey, setAnimKey] = useState(0)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const handleTabChange = (i: number) => {
    if (i === activeTab) return
    setDirection(i > activeTab ? 'up' : 'down')
    setActiveTab(i)
    setAnimKey(k => k + 1)
  }

  const animName = direction === 'up' ? 'slideLeftIn' : 'slideRightIn'

  return (
    <div>
      <style>{SLIDE_CSS}</style>

      {/* Clickable framework boxes */}
      <div className="approach-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '3rem' }}>
        {DIMENSION_CARDS.map((card, i) => {
          const active = i === activeTab
          const hovered = hoveredCard === i
          return (
            <div
              key={i}
              onClick={() => handleTabChange(i)}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                position: 'relative', padding: '1.5rem 1.5rem 1.75rem',
                cursor: 'pointer',
                background: active ? '#FDF5F0' : hovered ? '#FDF5F0' : '#fff',
                transition: 'background 0.15s',
              }}
            >
              <WobblyBorder strokeColor={active ? '#A0522D' : '#1A1A1A'} />
              <p style={{
                fontFamily: 'var(--serif)', fontSize: '1.1rem',
                fontWeight: active ? 600 : 400, color: active ? '#A0522D' : 'var(--ink)', marginBottom: '0.5rem',
                transition: 'color 0.15s',
              }}>
                {card.title}
              </p>
              <p style={{
                fontFamily: 'var(--sans)', fontSize: '0.875rem',
                fontWeight: 300, color: '#555', lineHeight: 1.65, margin: 0,
              }}>
                {card.desc}
              </p>
            </div>
          )
        })}
      </div>

      {/* Tab content */}
      <div style={{ overflow: 'hidden' }}>
        <div key={animKey} style={{ animation: `${animName} 320ms ease-in-out both` }}>

          {/* ── CONTENT ── */}
          {activeTab === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2, marginBottom: '0.6rem' }}>
                    [PLACEHOLDER: heading]
                  </h3>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 400, color: 'var(--terracotta)', lineHeight: 1.7, margin: '0 0 0.6rem', maxWidth: 900 }}>
                    → [PLACEHOLDER: body copy]
                  </p>
                </div>
                <div style={{ position: 'relative', width: '100%', height: 350, background: '#EAE3DA' }}>
                  <WobblyBorder strokeColor="#CCCCCC" />
                </div>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 300, color: '#444', lineHeight: 1.7, margin: '0.5rem 0 0', maxWidth: 900 }}>
                  [PLACEHOLDER: body copy]
                </p>
              </div>

              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2, marginBottom: '0.6rem' }}>
                    [PLACEHOLDER: heading]
                  </h3>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 400, color: 'var(--terracotta)', lineHeight: 1.7, margin: '0 0 0.6rem', maxWidth: 900 }}>
                    → [PLACEHOLDER: body copy]
                  </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '0.75rem', alignItems: 'start' }}>
                  <div>
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', background: '#EAE3DA' }}>
                      <WobblyBorder strokeColor="#CCCCCC" />
                    </div>
                    <p style={{ fontFamily: 'var(--sans)', fontSize: '0.8rem', fontStyle: 'italic', color: '#999', marginTop: '0.5rem', marginBottom: 0 }}>
                      [PLACEHOLDER: caption]
                    </p>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <div style={{ position: 'relative', width: 290, aspectRatio: '9/16', background: '#EAE3DA' }}>
                        <WobblyBorder strokeColor="#CCCCCC" />
                      </div>
                    </div>
                    <p style={{ fontFamily: 'var(--sans)', fontSize: '0.8rem', fontStyle: 'italic', color: '#999', marginTop: '0.5rem', marginBottom: 0 }}>
                      [PLACEHOLDER: caption]
                    </p>
                  </div>
                </div>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 300, color: '#444', lineHeight: 1.7, margin: '0.5rem 0 0', maxWidth: 900 }}>
                  [PLACEHOLDER: body copy]
                </p>
              </div>
            </div>
          )}

          {/* ── FLOW ── */}
          {activeTab === 1 && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2, marginBottom: '0.6rem' }}>
                  [PLACEHOLDER: heading]
                </h3>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 400, color: 'var(--terracotta)', lineHeight: 1.7, margin: '0 0 0.6rem', maxWidth: 900 }}>
                  → [PLACEHOLDER: body copy]
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '60% 40%', gap: '1.25rem', alignItems: 'start', paddingRight: '2px', maxWidth: 800 }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#EAE3DA' }}>
                  <WobblyBorder strokeColor="#CCCCCC" />
                </div>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '9/16', background: '#EAE3DA' }}>
                  <WobblyBorder strokeColor="#CCCCCC" />
                </div>
              </div>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 300, color: '#444', lineHeight: 1.7, margin: '0.5rem 0 0', maxWidth: 900 }}>
                [PLACEHOLDER: body copy]
              </p>
            </div>
          )}

          {/* ── LAYOUT ── */}
          {activeTab === 2 && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2, marginBottom: '0.6rem' }}>
                  [PLACEHOLDER: heading]
                </h3>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 400, color: 'var(--terracotta)', lineHeight: 1.7, margin: '0 0 0.6rem', maxWidth: 900 }}>
                  → [PLACEHOLDER: body copy]
                </p>
              </div>
              <div style={{ width: '80%', position: 'relative', aspectRatio: '16/9', background: '#EAE3DA' }}>
                <WobblyBorder strokeColor="#CCCCCC" />
              </div>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 300, color: '#444', lineHeight: 1.7, margin: '0.5rem 0 0', maxWidth: 900 }}>
                [PLACEHOLDER: body copy]
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

const SLIDE_CSS = `
  @keyframes slideLeftIn  { from { transform: translateX(60px);  opacity: 0 } to { transform: translateX(0); opacity: 1 } }
  @keyframes slideRightIn { from { transform: translateX(-60px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
`

function FinalDesignShowcase() {
  const [activeTab, setActiveTab] = useState(0)
  const [direction, setDirection] = useState<'up' | 'down'>('up')
  const [animKey, setAnimKey] = useState(0)

  const handleTabChange = (i: number) => {
    if (i === activeTab) return
    setDirection(i > activeTab ? 'up' : 'down')
    setActiveTab(i)
    setAnimKey(k => k + 1)
  }

  const tab = TABS[activeTab]
  const animName = direction === 'up' ? 'slideLeftIn' : 'slideRightIn'

  return (
    <div>
      <style>{SLIDE_CSS}</style>

      {/* Pill tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem', overflow: 'hidden' }}>
        {TABS.map((t, i) => {
          const active = i === activeTab
          return (
            <button key={t.label} onClick={() => handleTabChange(i)}
              style={{
                position: 'relative',
                fontFamily: 'var(--sans)', fontSize: '0.75rem',
                fontWeight: 500,
                color: active ? '#fff' : '#1a1a1a',
                background: active ? 'var(--terracotta)' : '#fff',
                border: 'none', borderRadius: 999, cursor: 'pointer',
                padding: '0.45rem 1rem',
                letterSpacing: '0.02em',
                transition: 'background 0.2s, color 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {!active && <WobblyPillBorder />}
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Instruction */}
      <p style={{
        fontFamily: 'var(--sans)', fontSize: '0.75rem', fontStyle: 'italic',
        color: '#bbb', marginBottom: '3rem',
      }}>
        Click each tab to explore the screens →
      </p>

      {/* Two-column content — clipped so sliding content doesn't overflow */}
      <div style={{ overflow: 'hidden', minHeight: 620 }}>
        <div
          key={animKey}
          style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center',
            animation: `${animName} 320ms ease-in-out both`,
          }}
        >
          {/* Left — placeholder image */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: 400, aspectRatio: '9/16', background: '#EAE3DA', position: 'relative' }}>
              <WobblyBorder strokeColor="#CCCCCC" />
            </div>
          </div>

          {/* Right — title + description */}
          <div>
            <h3 style={{
              fontFamily: 'var(--serif)', fontSize: '1.75rem',
              fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2, marginBottom: '1rem',
            }}>
              {tab.title}
            </h3>
            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1rem',
              fontWeight: 300, color: '#444', lineHeight: 1.8, margin: 0,
            }}>
              {tab.subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FinancePlatformRedesign() {
  const [activeSection, setActiveSection] = useState('problem')
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const sectionEls = NAV_SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveSection(entry.target.id)
      })
    }, { rootMargin: '-35% 0px -60% 0px', threshold: 0 })

    sectionEls.forEach(el => observer.observe(el))

    const onScroll = () => {
      const doc = document.documentElement
      const progress = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100
      setScrollProgress(Math.min(progress, 100))
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <style>{`
        @media (max-width: 768px) {
          .cs-layout { grid-template-columns: 1fr !important; }
          .cs-sidenav { display: none !important; }
          .cs-progress { display: block !important; }
          .cs-content { padding: 0 1.25rem !important; }
          .problem-cols { grid-template-columns: 1fr !important; }
          .approach-cards { grid-template-columns: 1fr !important; }
          .design-row { grid-template-columns: 1fr !important; }
          .stat-row { grid-template-columns: 1fr !important; }
          .pillar-cols { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Nav />

      {/* Mobile progress bar */}
      <div className="cs-progress" style={{
        display: 'none', position: 'fixed', top: 56, left: 0, right: 0,
        zIndex: 99, height: 3, background: '#F0EBE4',
      }}>
        <div style={{
          height: '100%', background: 'var(--terracotta)',
          width: `${scrollProgress}%`, transition: 'width 0.1s linear',
        }} />
      </div>

      {/* ── Full-bleed cream hero ──────────────────────────────────────────── */}
      <div style={{ background: '#FAF8F4', borderBottom: '1px solid #E4DDD4', paddingTop: 56 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', paddingLeft: 'calc(200px + 3rem)', paddingRight: '3rem' }}>
          <section id="overview" style={{ paddingTop: '4rem', paddingBottom: '5rem', scrollMarginTop: '90px' }}>
            {/* Meta pills */}
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {['[PLACEHOLDER]', '[PLACEHOLDER]', '[PLACEHOLDER]'].map(tag => (
                <span key={tag} style={{
                  fontFamily: 'var(--sans)', fontSize: '0.7rem',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'var(--terracotta)', fontWeight: 500,
                  border: '1px solid #E8C9B4', borderRadius: 999,
                  padding: '0.3rem 0.85rem',
                }}>
                  {tag}
                </span>
              ))}
            </div>
            <h1 style={{
              fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 400, lineHeight: 1.05, color: 'var(--ink)',
              letterSpacing: '-0.01em', marginBottom: '1.5rem',
            }}>
              Finance Platform Redesign
            </h1>
            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.075rem', fontWeight: 300,
              color: '#1a1a1a', lineHeight: 1.7, maxWidth: 900, marginBottom: '3.5rem',
            }}>
              [PLACEHOLDER: subtitle]
            </p>
            <img
              src="/case%20studies/finance%20platform%20redesign/hero.png"
              alt="Finance Platform Redesign hero"
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '0.75rem' }}
            />
          </section>
        </div>
      </div>

      {/* Page layout */}
      <div className="cs-layout" style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'grid', gridTemplateColumns: '200px 1fr',
      }}>

        {/* Sticky side nav */}
        <aside className="cs-sidenav" style={{
          position: 'sticky', top: 56, height: 'calc(100vh - 56px)',
          display: 'flex', flexDirection: 'column',
          padding: '1.2rem 1.5rem 2rem 2rem',
          borderRight: '1px solid #F0EBE4',
          background: '#fff',
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
            {NAV_SECTIONS.map(s => {
              const active = activeSection === s.id
              return (
                <a key={s.id} href={`#${s.id}`}
                  style={{
                    position: 'relative',
                    display: 'block',
                    fontFamily: 'var(--sans)', fontSize: '0.9rem',
                    fontWeight: active ? 700 : 400,
                    color: active ? 'var(--terracotta)' : '#999',
                    textDecoration: 'none', letterSpacing: '0.01em',
                    padding: '0.65rem 0 0.65rem 1.25rem',
                    lineHeight: 1.4,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--ink)' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#999' }}
                >
                  {active && (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 6 40"
                      preserveAspectRatio="none"
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 6,
                        height: 'calc(100% - 12px)',
                        overflow: 'visible',
                      }}
                    >
                      <path
                        d="M 3 1 C 4.5 8, 1.5 16, 3 22 C 4.5 28, 1.8 34, 3 39"
                        stroke="var(--terracotta)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  )}
                  {s.label}
                </a>
              )
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="cs-content" style={{ padding: '0 3rem 0 3rem', minWidth: 0 }}>

          {/* ── Problem ────────────────────────────────────────────────── */}
          <section id="problem" style={{ paddingTop: '1.85rem', paddingBottom: '5rem', scrollMarginTop: '80px' }}>
            <SectionLabel>Problem</SectionLabel>
            <h2 style={{
              fontFamily: 'var(--serif)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 400, lineHeight: 1.15, color: 'var(--ink)',
              letterSpacing: '-0.01em', marginBottom: '0.85rem', maxWidth: 900,
            }}>
              [PLACEHOLDER: heading]
            </h2>
            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1rem', fontStyle: 'italic',
              color: '#555', marginBottom: '2.5rem', fontWeight: 300, maxWidth: 900,
            }}>
              [PLACEHOLDER: body copy]
            </p>

            {/* Two problem cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3.5rem' }}>
              {[
                {
                  label: '[PLACEHOLDER]',
                  tag: 'USER', tagBg: '#F2DFA0', tagColor: '#8B6914',
                  items: ['[PLACEHOLDER: body copy]', '[PLACEHOLDER: body copy]', '[PLACEHOLDER: body copy]'],
                },
                {
                  label: '[PLACEHOLDER]',
                  tag: 'BUSINESS', tagBg: '#B8CED4', tagColor: '#2A5A6A',
                  items: ['[PLACEHOLDER: body copy]', '[PLACEHOLDER: body copy]', '[PLACEHOLDER: body copy]'],
                },
              ].map(card => (
                <div key={card.label} style={{ position: 'relative', padding: '1.75rem 1.75rem 1.5rem' }}>
                  <WobblyBorder />
                  <span style={{
                    display: 'inline-block',
                    background: card.tagBg, color: card.tagColor,
                    fontFamily: 'var(--sans)', fontSize: '0.6rem',
                    fontWeight: 600, letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 999,
                    marginBottom: '0.6rem',
                  }}>
                    {card.tag}
                  </span>
                  <p style={{
                    fontFamily: 'var(--sans)', fontSize: '0.7rem',
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: 'var(--terracotta)', fontWeight: 700, marginBottom: '1.25rem',
                  }}>
                    {card.label}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                    {card.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'baseline' }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" style={{ flexShrink: 0, marginTop: 3 }}>
                          <path d="M1,5 C2.5,4 4,5.5 5,4.8 C6,4.1 7.5,5.2 9,5"
                            fill="none" stroke="#B05A2B" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                        <p style={{
                          fontFamily: 'var(--sans)', fontSize: '0.9rem',
                          fontWeight: 300, color: '#1a1a1a', lineHeight: 1.65, margin: 0,
                        }}>
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Pull quote */}
            <div style={{ textAlign: 'left', padding: '0' }}>
              <p style={{
                fontFamily: 'var(--serif)', fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)',
                fontStyle: 'italic', fontWeight: 400,
                color: 'var(--terracotta)', lineHeight: 1.5,
                marginBottom: '1rem', maxWidth: 900,
              }}>
                ⁈ [PLACEHOLDER: HMW question]
              </p>
              <svg width="220" height="8" viewBox="0 0 220 8" aria-hidden="true" style={{ display: 'block' }}>
                <path
                  d="M4,5 C22,3 45,6 70,4.5 C95,3 118,6 142,4 C166,2.5 188,5.5 216,4"
                  fill="none" stroke="#B05A2B" strokeWidth="1.2" strokeLinecap="round"
                />
              </svg>
            </div>
          </section>

          {/* ── Approach ───────────────────────────────────────────────── */}
          <section id="design" style={{ paddingTop: '2rem', paddingBottom: '5rem', scrollMarginTop: '80px' }}>
            <SectionLabel>Approach</SectionLabel>
            <h2 style={{
              fontFamily: 'var(--serif)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 400, lineHeight: 1.15, color: 'var(--ink)',
              letterSpacing: '-0.01em', marginBottom: '1.25rem', maxWidth: 900,
            }}>
              [PLACEHOLDER: heading]
            </h2>
            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
              color: '#1a1a1a', lineHeight: 1.7, maxWidth: 900, marginBottom: '1.75rem',
            }}>
              [PLACEHOLDER: body copy]
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem', paddingLeft: '1.25rem' }}>
              {[
                { label: '[PLACEHOLDER]', desc: '[PLACEHOLDER: body copy]' },
                { label: '[PLACEHOLDER]', desc: '[PLACEHOLDER: body copy]' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: '0.75rem', alignItems: 'baseline' }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" style={{ flexShrink: 0, marginTop: 3 }}>
                    <path d="M1,5 C2.5,4 4,5.5 5,4.8 C6,4.1 7.5,5.2 9,5"
                      fill="none" stroke="#B05A2B" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300, color: '#1a1a1a', lineHeight: 1.7, margin: 0, maxWidth: 900 }}>
                    <strong style={{ fontWeight: 500 }}>{item.label}</strong> — {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
              color: '#1a1a1a', lineHeight: 1.7, maxWidth: 900, marginBottom: '3rem',
            }}>
              [PLACEHOLDER: body copy]
            </p>

            {/* Design pillars — row layout */}
            <PillarRows />

            {/* Design details heading */}
            <h3 style={{
              fontFamily: 'var(--serif)', fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
              fontWeight: 400, lineHeight: 1.2, color: 'var(--ink)',
              letterSpacing: '-0.01em', marginBottom: '2rem', maxWidth: 900,
            }}>
              [PLACEHOLDER: heading]
            </h3>

            <DesignDetailsShowcase />

            <div style={{ textAlign: 'left', padding: '0', marginTop: '2.5rem' }}>
              <p style={{
                fontFamily: 'var(--serif)', fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)',
                fontStyle: 'italic', fontWeight: 400,
                color: 'var(--terracotta)', lineHeight: 1.5,
                marginBottom: '1rem', maxWidth: 900,
              }}>
                ✦ [PLACEHOLDER: body copy]
              </p>
              <svg width="220" height="8" viewBox="0 0 220 8" aria-hidden="true" style={{ display: 'block' }}>
                <path
                  d="M4,5 C22,3 45,6 70,4.5 C95,3 118,6 142,4 C166,2.5 188,5.5 216,4"
                  fill="none" stroke="#B05A2B" strokeWidth="1.2" strokeLinecap="round"
                />
              </svg>
            </div>
          </section>

          {/* ── Final Design ───────────────────────────────────────────── */}
          <section id="final-design" style={{ paddingTop: '2rem', paddingBottom: '5rem', scrollMarginTop: '80px' }}>
            <SectionLabel>Final Design</SectionLabel>
            <h2 style={{
              fontFamily: 'var(--serif)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 400, lineHeight: 1.15, color: 'var(--ink)',
              letterSpacing: '-0.01em', marginBottom: '1rem', maxWidth: 900,
            }}>
              [PLACEHOLDER: heading]
            </h2>
            <FinalDesignShowcase />
          </section>

          {/* ── Impact ─────────────────────────────────────────────────── */}
          <section id="impact" style={{ paddingTop: '2rem', paddingBottom: '5rem', scrollMarginTop: '80px' }}>
            <SectionLabel>Impact</SectionLabel>
            <h2 style={{
              fontFamily: 'var(--serif)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 400, lineHeight: 1.15, color: 'var(--ink)',
              letterSpacing: '-0.01em', marginBottom: '3.5rem', maxWidth: 900,
            }}>
              [PLACEHOLDER: heading]
            </h2>

            <div className="stat-row" style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2rem', marginBottom: '3.5rem',
            }}>
              {[
                { stat: '[#]', detail: '[PLACEHOLDER: body copy]' },
                { stat: '[#]', detail: '[PLACEHOLDER: body copy]' },
                { stat: '[#]', detail: '[PLACEHOLDER: body copy]' },
              ].map((s, i) => (
                <div key={i} style={{
                  position: 'relative', padding: '2.5rem 2rem',
                  background: '#FAF6F1',
                }}>
                  <WobblyBorder strokeColor="#D4CBC2" />
                  <p style={{
                    fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                    fontWeight: 400, color: 'var(--terracotta)',
                    lineHeight: 1, marginBottom: '0.75rem',
                  }}>
                    {s.stat}
                  </p>
                  <p style={{
                    fontFamily: 'var(--sans)', fontSize: '0.875rem',
                    fontWeight: 300, color: '#444', lineHeight: 1.6, margin: 0,
                  }}>
                    {s.detail}
                  </p>
                </div>
              ))}
            </div>

            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
              color: '#1a1a1a', lineHeight: 1.8, maxWidth: 900,
            }}>
              [PLACEHOLDER: body copy]
            </p>
          </section>

          {/* ── Prev / Next case study ──────────────────────────────────── */}
          <div style={{
            borderTop: '1px solid #EBEBEB',
            padding: '3rem 0 5rem',
            display: 'flex', justifyContent: 'space-between',
          }}>
            <a href="/work/digital-loan-application" style={{
              fontFamily: 'var(--sans)', fontSize: '0.875rem',
              fontWeight: 400, color: 'var(--terracotta)',
              textDecoration: 'none', letterSpacing: '0.03em',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              borderBottom: '1px solid transparent',
              paddingBottom: '2px',
              transition: 'border-color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--terracotta)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
            >
              <span style={{ fontFamily: 'var(--serif)', fontSize: '0.95rem', fontStyle: 'italic', color: '#999', marginRight: '0.25rem' }}>
                Prev
              </span>
              ← Digital Loan Application
            </a>
            <a href="#" style={{
              fontFamily: 'var(--sans)', fontSize: '0.875rem',
              fontWeight: 400, color: 'var(--terracotta)',
              textDecoration: 'none', letterSpacing: '0.03em',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              borderBottom: '1px solid transparent',
              paddingBottom: '2px',
              transition: 'border-color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--terracotta)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
            >
              <span style={{ fontFamily: 'var(--serif)', fontSize: '0.95rem', fontStyle: 'italic', color: '#999', marginRight: '0.25rem' }}>
                Next
              </span>
              [PLACEHOLDER: next case study] →
            </a>
          </div>

        </main>
      </div>

      {/* Footer */}
      <footer style={{
        background: '#fff',
        borderTop: '1px solid #EBEBEB', maxWidth: 1200,
        margin: '0 auto', padding: '2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '1rem',
      }}>
        <span style={{ fontFamily: 'var(--serif)', fontSize: '0.95rem', color: 'var(--ink)' }}>
          Zhu Nan
        </span>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[{ label: 'LinkedIn', href: '#' }, { label: 'Resume', href: '#' }].map(link => (
            <a key={link.label} href={link.href} style={{
              fontFamily: 'var(--sans)', fontSize: '0.75rem', color: 'var(--muted)',
              textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase',
              transition: 'color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--terracotta)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
            >{link.label}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}

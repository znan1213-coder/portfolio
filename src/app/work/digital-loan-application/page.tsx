'use client'

import { useEffect, useRef, useState } from 'react'
import Nav from '../../components/Nav'
import { DoodleDefs } from '../../components/Doodles'
import PageMenu from '../../components/PageMenu'

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
      <span className="shot-frame" aria-hidden="true" />
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
      fontFamily: 'var(--font-organic-hand), var(--sans)',
      fontSize: '1.05rem',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--ink)',
      marginBottom: '1.25rem',
      fontWeight: 400,
    }}>
      {children}
    </p>
  )
}

// ── Nav ───────────────────────────────────────────────────────────────────────
// ── Page ──────────────────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  { id: 'problem', label: 'Problem' },
  { id: 'design', label: 'Strategy' },
  { id: 'form-design', label: 'Design' },
  { id: 'final-design', label: 'Final design' },
  { id: 'impact', label: 'Impact' },
]

// ── Final Design tabs ─────────────────────────────────────────────────────────
const TABS = [
  {
    label: 'Eligibility',
    image: '/case studies/digital loan application/Eligibility.png',
    title: 'Eligibility check',
    subtitle: 'Farmers confirm minimum requirements before starting. This prevents unqualified applications and reduces noise for the loan team.',
    inactiveBg: '#EAE3DA', inactiveColor: '#7A3A1A',
  },
  {
    label: 'Application',
    image: '/case studies/digital loan application/App form.gif',
    title: 'Application form',
    subtitle: 'A guided, save-anytime experience with a progress bar for clear visibility and flexibility to navigate back to any section.',
    inactiveBg: '#C5CEA0', inactiveColor: '#4A5E35',
  },
  {
    label: 'Co-applicant',
    image: '/case studies/digital loan application/Co-app.gif',
    title: 'Co-applicant',
    subtitle: 'The primary applicant can either fill in co-applicant details themselves or invite the co-applicant to complete their own section independently.',
    inactiveBg: '#D4B8C7', inactiveColor: '#6B3D5E',
  },
  {
    label: 'ID Verification',
    image: '/case studies/digital loan application/ID verification.gif',
    title: 'ID verification',
    subtitle: 'Identity is verified before submission in under 1 minute, ensuring accuracy and preventing fraud without adding friction.',
    inactiveBg: '#B8CED4', inactiveColor: '#2A5A6A',
  },
  {
    label: 'Task Management',
    image: '/case studies/digital loan application/Task mgmt.gif',
    title: 'Task management',
    subtitle: "A centralized hub for all post-submission tasks, giving farmers clarity on what's needed to move their application forward.",
    inactiveBg: '#E8C4A8', inactiveColor: '#7A3A1A',
  },
]

// ── Pillar rows ───────────────────────────────────────────────────────────────
const PILLARS = [
  {
    name: 'Self service',
    desc: 'Simplified flow, eliminated unnecessary questions, and provided contextual help throughout the application',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="8.5" stroke="#FD1E20" strokeWidth="1.4" strokeLinecap="round"
          strokeDasharray="2 0" strokeLinejoin="round"
          style={{ strokeDashoffset: 0 }} />
        <circle cx="11" cy="11" r="3.5" stroke="#FD1E20" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    name: 'Application security',
    desc: 'Early identity verification and centralized document upload to prevent fraud and reduce email exchanges',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M11 2.5 C11 2.5 4 5 4 11 C4 15.5 7 18.5 11 19.5 C15 18.5 18 15.5 18 11 C18 5 11 2.5 11 2.5Z"
          stroke="#FD1E20" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 11 L10 13 L14 9" stroke="#FD1E20" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Data accuracy',
    desc: 'Real-time error feedback and plain language over jargon to reduce mistakes',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="8.5" stroke="#FD1E20" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="11" cy="11" r="2" fill="#FD1E20" />
        <line x1="11" y1="2.5" x2="11" y2="5" stroke="#FD1E20" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="11" y1="17" x2="11" y2="19.5" stroke="#FD1E20" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="2.5" y1="11" x2="5" y2="11" stroke="#FD1E20" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="17" y1="11" x2="19.5" y2="11" stroke="#FD1E20" strokeWidth="1.3" strokeLinecap="round" />
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
  // Slightly wider on the left, a bit flat at the bottom
  <svg key="0" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M10,1.2 C13.8,1.0 18.4,4.6 18.8,9.2 C19.2,13.9 16.1,18.5 11.2,18.9 C6.3,19.3 1.4,16.0 1.1,10.8 C0.8,5.7 4.8,1.4 10,1.2 Z" fill="#FD1E20" />
    <path d="M6.2 10.2 L8.8 12.8 L13.8 7.2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  // Slightly taller, nudged left at top
  <svg key="1" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M9.5,0.9 C13.5,0.6 18.6,4.2 18.9,9.5 C19.2,14.4 15.8,19.1 10.5,19.2 C5.6,19.3 0.8,15.5 0.9,10.2 C1.0,5.0 5.2,1.2 9.5,0.9 Z" fill="#FD1E20" />
    <path d="M6.2 10.2 L8.8 12.8 L13.8 7.2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  // Slightly irregular, bumpy on the right
  <svg key="2" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M10.2,1.1 C14.2,1.3 19.0,5.2 18.7,9.8 C18.4,14.7 14.5,19.2 9.8,18.9 C5.0,18.6 0.7,14.8 1.0,10.0 C1.3,5.2 5.8,0.9 10.2,1.1 Z" fill="#FD1E20" />
    <path d="M6.2 10.2 L8.8 12.8 L13.8 7.2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
]

function PillarRows() {
  return (
    <div className="pillar-cols" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '1rem' }}>
      {PILLARS.map((p, i) => (
        <div key={p.name} style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {PILLAR_ICONS[i]}
            <span style={{
              fontFamily: 'var(--heading)', fontSize: '1.1rem',
              fontWeight: 500, color: 'var(--ink)', letterSpacing: '-0.01em',
            }}>
              {p.name}
            </span>
          </div>
          <p style={{
            fontFamily: 'var(--sans)', fontSize: '1rem',
            fontWeight: 400, color: 'var(--ink)', lineHeight: 1.6, margin: 0,
          }}>
            {p.desc}
          </p>
        </div>
      ))}
    </div>
  )
}

const DIMENSION_CARDS = [
  { title: 'Content', desc: 'What questions to ask, how to phrase them, and in what order' },
  { title: 'Flow',    desc: 'How users navigate through the application step by step' },
  { title: 'Layout',  desc: 'How information is revealed and presented on each screen' },
]

function DesignDetailsShowcase() {
  const [activeTab, setActiveTab] = useState(1)
  const [direction, setDirection] = useState<'up' | 'down'>('up')
  const [animKey, setAnimKey] = useState(0)

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

      {/* Pill tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '3rem' }}>
        {DIMENSION_CARDS.map((card, i) => {
          const active = i === activeTab
          return (
            <button key={card.title} onClick={() => handleTabChange(i)}
              style={{
                position: 'relative',
                fontFamily: 'var(--heading)', fontSize: '0.95rem',
                fontWeight: 500,
                color: active ? '#fff' : 'var(--ink)',
                background: active ? '#FD1E20' : '#fff',
                border: '1.4px solid #1A1A1A', borderRadius: 8, cursor: 'pointer',
                boxShadow: active ? '3px 3px 0 #1A1A1A' : 'none',
                padding: '0.45rem 1.1rem',
                transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {card.title}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div style={{ overflow: 'hidden' }}>
        <div key={animKey} style={{ animation: `${animName} 320ms ease-in-out both` }}>

          {/* ── CONTENT ── */}
          {activeTab === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
              {/* Subsection 1 */}
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontFamily: 'var(--heading)', fontSize: '1.5rem', fontWeight: 500, letterSpacing: '-0.015em', color: 'var(--ink)', lineHeight: 1.2, marginBottom: '0.6rem' }}>
                    Eliminated 23% of redundant questions
                  </h3>
                  <p style={{ fontFamily: 'var(--heading)', fontSize: '1.05rem', fontWeight: 500, color: '#FD1E20', lineHeight: 1.55, margin: '0 0 0.6rem', maxWidth: 900 }}>
                    → Farmers reached the end without being stopped by unfamiliar or irrelevant questions.
                  </p>
                </div>
                <div style={{ position: 'relative', width: '100%', height: 350, overflow: 'hidden' }}>
                  <span className="shot-frame" aria-hidden="true" />
                  <img
                    src="/case studies/digital loan application/eliminate redundent questions.png"
                    alt="Form field documentation spreadsheet"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
                  />
                </div>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.7, margin: '0.9rem 0 0', maxWidth: 900 }}>
                  To manage complexity, I documented every form field with its conditions, helper text, and API endpoints in a shared spreadsheet — this became the single source of truth for the entire application.
                </p>
              </div>

              {/* Subsection 2 */}
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontFamily: 'var(--heading)', fontSize: '1.5rem', fontWeight: 500, letterSpacing: '-0.015em', color: 'var(--ink)', lineHeight: 1.2, marginBottom: '0.6rem' }}>
                    Building trust through credibility & transparency
                  </h3>
                  <p style={{ fontFamily: 'var(--heading)', fontSize: '1.05rem', fontWeight: 500, color: '#FD1E20', lineHeight: 1.55, margin: '0 0 0.6rem', maxWidth: 900 }}>
                    → Farmers knew who they were dealing with and why each step mattered before committing.
                  </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '0.75rem', alignItems: 'start' }}>
                  <div>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <span className="shot-frame" aria-hidden="true" />
                      <img src="/case studies/digital loan application/transparency 1.png" alt="Start page showing FBN credibility stats" style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>
                    <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9rem', color: 'rgba(0,0,0,0.55)', marginTop: '0.6rem', marginBottom: 0 }}>
                      Start page — right rail highlights what FBN offers to build credibility upfront
                    </p>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <div style={{ position: 'relative', width: 290 }}>
                        <span className="shot-frame" aria-hidden="true" />
                        <img src="/case studies/digital loan application/transparency 2.png" alt="ID Verification screen" style={{ width: '100%', height: 'auto', display: 'block' }} />
                      </div>
                    </div>
                    <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9rem', color: 'rgba(0,0,0,0.55)', marginTop: '0.6rem', marginBottom: 0 }}>
                      ID Verification — we explained why identity verification is needed before submission
                    </p>
                  </div>
                </div>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.7, margin: '0.9rem 0 0', maxWidth: 900 }}>
                  FBN's credibility and data usage policy are surfaced at the very start of the flow — and identity verification is explained before it's requested.
                </p>
              </div>
            </div>
          )}

          {/* ── FLOW ── */}
          {activeTab === 1 && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'var(--heading)', fontSize: '1.5rem', fontWeight: 500, letterSpacing: '-0.015em', color: 'var(--ink)', lineHeight: 1.2, marginBottom: '0.6rem' }}>
                  Progress bar for transparency
                </h3>
                <p style={{ fontFamily: 'var(--heading)', fontSize: '1.05rem', fontWeight: 500, color: '#FD1E20', lineHeight: 1.55, margin: '0 0 0.6rem', maxWidth: 900 }}>
                  → Abandonment reduced — users knew how much was left and felt in control of the process.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '60% 40%', gap: '1.25rem', alignItems: 'start', paddingRight: '2px', maxWidth: 800 }}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <span className="shot-frame" aria-hidden="true" />
                  <img src="/case studies/digital loan application/stepper:desktop.gif" alt="Progress bar — desktop" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
                <div style={{ position: 'relative', width: '100%' }}>
                  <span className="shot-frame" aria-hidden="true" />
                  <img src="/case studies/digital loan application/stepper:mobile.gif" alt="Progress bar — mobile" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
              </div>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.7, margin: '0.9rem 0 0', maxWidth: 900 }}>
                A persistent stepper shows exactly where farmers are and lets them navigate back freely.
              </p>
            </div>
          )}

          {/* ── LAYOUT ── */}
          {activeTab === 2 && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'var(--heading)', fontSize: '1.5rem', fontWeight: 500, letterSpacing: '-0.015em', color: 'var(--ink)', lineHeight: 1.2, marginBottom: '0.6rem' }}>
                  Progressive disclosure
                </h3>
                <p style={{ fontFamily: 'var(--heading)', fontSize: '1.05rem', fontWeight: 500, color: '#FD1E20', lineHeight: 1.55, margin: '0 0 0.6rem', maxWidth: 900 }}>
                  → Cognitive load dropped significantly — farmers never felt overwhelmed mid-application.
                </p>
              </div>
              <div style={{ width: '80%', position: 'relative' }}>
                <span className="shot-frame" aria-hidden="true" />
                <img src="/case studies/digital loan application/progressive disclosure.gif" alt="Progressive Disclosure" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.7, margin: '0.9rem 0 0', maxWidth: 900 }}>
                Questions are revealed based on previous answers, keeping each screen focused and scannable.
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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
      {TABS.map((tab, i) => {
        const imageLeft = i % 2 === 0
        return (
          <div key={tab.label} className="final-design-row" style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center',
          }}>
            {imageLeft ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img src={tab.image} alt={tab.title}
                    style={{ maxHeight: 560, width: 'auto', maxWidth: '100%', display: 'block' }} />
                </div>
                <div>
                  <h3 style={{
                    fontFamily: 'var(--heading)', fontSize: '1.5rem',
                    fontWeight: 500, letterSpacing: '-0.015em', color: 'var(--ink)', lineHeight: 1.2, marginBottom: '1rem',
                  }}>
                    {tab.title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--sans)', fontSize: '1.125rem',
                    fontWeight: 400, color: 'var(--ink)', lineHeight: 1.7, margin: 0,
                  }}>
                    {tab.subtitle}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3 style={{
                    fontFamily: 'var(--heading)', fontSize: '1.5rem',
                    fontWeight: 500, letterSpacing: '-0.015em', color: 'var(--ink)', lineHeight: 1.2, marginBottom: '1rem',
                  }}>
                    {tab.title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--sans)', fontSize: '1.125rem',
                    fontWeight: 400, color: 'var(--ink)', lineHeight: 1.7, margin: 0,
                  }}>
                    {tab.subtitle}
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img src={tab.image} alt={tab.title}
                    style={{ maxHeight: 560, width: 'auto', maxWidth: '100%', display: 'block' }} />
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function DigitalLoanApplication() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const progress = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100
      setScrollProgress(Math.min(progress, 100))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#fff', ['--terracotta' as any]: '#FD1E20' }}>
      <style>{`
        /* Spacing system (8px rhythm) for the case study body — overrides the per-element inline
           margins so every section follows the same rules:
           eyebrow → title 8 · title → body 24 · paragraph → paragraph 24 · bullet → bullet 16
           content → subheading 48 · subheading → content 16 · section → section 120 */
        main.cs-content > section { padding-top: 0 !important; padding-bottom: 120px !important; }
        main.cs-content > section#problem { padding-top: 88px !important; }
        main.cs-content > section > p:first-child { margin-bottom: 8px !important; }
        main.cs-content > section > h2 { margin-top: 0 !important; margin-bottom: 24px !important; }
        main.cs-content > section > p:not(:first-child) { margin-top: 0 !important; margin-bottom: 24px !important; }
        main.cs-content > section > h3 { margin-top: 48px !important; margin-bottom: 16px !important; }
        main.cs-content > section > div[style*="flex-direction: column"] { margin-bottom: 24px !important; }
        main.cs-content section div[style*="gap: 1rem"][style*="padding-left"] { gap: 16px !important; }
        main.cs-content section div[style*="gap: 2rem"][style*="flex-direction: column"] { gap: 24px !important; }
        main.cs-content section div[style*="gap: 2rem"][style*="flex-direction: column"] h3 { margin-bottom: 8px !important; }
        .pillar-cols { margin-bottom: 0 !important; }
        .pillar-cols > div > div:first-child { margin-bottom: 8px !important; }

        /* "Sticker" surfaces — thin black outline + solid red offset shadow (matches About buttons) */
        .sticker { background: #FFFFFF; border: 1.6px solid #1A1A1A; border-radius: 12px; box-shadow: 5px 5px 0 #FD1E20; }
        .sticker-chip { background: #FFFFFF; border: 1.4px solid #1A1A1A; border-radius: 8px; box-shadow: 3px 3px 0 #FD1E20; }
        .shot-frame { position: absolute; inset: 0; border: 1px solid rgba(0,0,0,0.12); border-radius: 6px; pointer-events: none; z-index: 1; }
        .cs-print { background: #FFFFFF; padding: 14px 14px 16px; box-shadow: 0 10px 28px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06); }
        @media (max-width: 768px) {
          .cs-layout { grid-template-columns: 1fr !important; }
          .cs-progress { display: block !important; }
          .cs-content { padding: 0 1.25rem !important; }
          .problem-cols { grid-template-columns: 1fr !important; }
          .design-row { grid-template-columns: 1fr !important; }
          .final-design-row { grid-template-columns: 1fr !important; }
          .stat-row { grid-template-columns: 1fr !important; }
          .pillar-cols { grid-template-columns: 1fr !important; }
          .hero-wrapper { padding-left: 1.25rem !important; padding-right: 1.25rem !important; }
          .hero-section { padding-top: 2.5rem !important; padding-bottom: 2.5rem !important; }
          .hero-h1 { font-size: 2rem !important; }
          .hero-subtitle { max-width: 100% !important; font-size: 1rem !important; }
          .hero-tags { flex-wrap: wrap !important; flex-direction: row !important; }
          .hero-cover { width: 100% !important; }
          .meta-row { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <DoodleDefs />
      <Nav heroBg="#F6F5F1" />
      <PageMenu sections={NAV_SECTIONS} />

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
      <div data-nav-hero style={{ background: '#F6F5F1', paddingTop: 56, minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <div className="hero-wrapper" style={{ maxWidth: 1200, width: '100%', margin: '0 auto', paddingLeft: '3rem', paddingRight: '3rem' }}>
          <section id="overview" className="hero-section text-center" style={{ paddingTop: '3rem', paddingBottom: '4rem', scrollMarginTop: '90px' }}>
            <div className="max-w-2xl mx-auto">
            {/* Meta pills */}
            <div className="hero-tags flex flex-wrap gap-2" style={{ marginBottom: '2rem', justifyContent: 'center' }}>
              {['Consumer Facing', 'Responsive', 'Agtech'].map(tag => (
                <span key={tag} className="sticker-chip" style={{
                  fontFamily: 'var(--sans)', fontSize: '0.75rem',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'var(--ink)', fontWeight: 600,
                  padding: '0.3rem 0.8rem',
                }}>
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="hero-h1" style={{
              fontFamily: 'var(--heading)', fontSize: 'clamp(2.1rem, 4vw, 3.25rem)',
              fontWeight: 400, lineHeight: 1.05, color: 'var(--ink)',
              letterSpacing: '-0.01em', marginBottom: '1.5rem',
            }}>
              Digital loan application
            </h1>
            <p className="hero-subtitle" style={{
              fontFamily: 'var(--sans)', fontSize: '1.075rem', fontWeight: 400,
              color: '#1a1a1a', lineHeight: 1.7, marginBottom: '2rem',
            }}>
              From paper forms to a fully self-serve digital loan experience.
            </p>

            {/* Project metadata */}
            <div className="meta-row mb-20" style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, auto)', justifyContent: 'center',
              gap: '0 3rem', marginBottom: 0, textAlign: 'left',
            }}>
              {[
                { label: 'Role', value: 'End-to-end design, design research, design strategy' },
                { label: 'Team', value: '1 PM, 1 Designer, 4 Engineers' },
                { label: 'Timeline', value: 'May 2021 – Dec. 2023' },
              ].map(item => (
                <div key={item.label}>
                  <p style={{
                    fontFamily: 'var(--sans)', fontSize: '0.75rem',
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'rgba(0,0,0,0.55)', fontWeight: 600, marginBottom: '0.35rem',
                  }}>
                    {item.label}
                  </p>
                  <p style={{
                    fontFamily: 'var(--sans)', fontSize: '1rem',
                    fontWeight: 400, color: 'var(--ink)', lineHeight: 1.5, margin: 0,
                    maxWidth: 260,
                  }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            </div>
            <img
              src="/case studies/digital loan application/Cover.png"
              alt="Digital Loan Application cover"
              className="hero-cover"
              style={{ width: '65%', height: 'auto', display: 'block', margin: '2.5rem auto 0' }}
            />
          </section>
        </div>
      </div>

      {/* Page layout */}
      {/* Page layout — single centered column; section links live in the PageMenu */}
      <div className="cs-layout" style={{ maxWidth: 820, margin: '0 auto' }}>

        <main className="cs-content" style={{ padding: '0 2rem', minWidth: 0 }}>

          {/* ── Problem ────────────────────────────────────────────────── */}
          <section id="problem" style={{ paddingTop: '1.85rem', paddingBottom: '5rem', scrollMarginTop: '80px' }}>
            <SectionLabel>Problem</SectionLabel>
            <h2 style={{
              fontFamily: 'var(--heading)', fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
              fontWeight: 400, lineHeight: 1.15, color: 'var(--ink)',
              letterSpacing: '-0.01em', marginBottom: '0.85rem', maxWidth: 900,
            }}>
              Farmers are struggling with the outdated loan process
            </h2>
            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.125rem',
              color: 'var(--ink)', marginBottom: '2.5rem', fontWeight: 400, maxWidth: 900,
            }}>
              The existing DocuSign-based process was inefficient for both farmers and FBN Finance.
            </p>

            {/* Problem — who it hurt, stacked as short paragraphs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '2rem', maxWidth: 720 }}>
              {[
                {
                  label: 'For farmers',
                  text: 'Farmers struggled to complete applications without assistance. Errors led to delays, denials, or increased rates, and complex sections like collateral had no digital guidance.',
                },
                {
                  label: 'For FBN',
                  text: 'Human touchpoints were required at nearly every stage, which made the process impossible to scale during high-volume periods. The team also had no visibility into application status or bottlenecks.',
                },
              ].map(block => (
                <div key={block.label}>
                  <h3 style={{
                    fontFamily: 'var(--heading)', fontSize: '1.35rem', fontWeight: 500,
                    letterSpacing: '-0.015em', color: 'var(--ink)', margin: '0 0 0.5rem',
                  }}>
                    {block.label}
                  </h3>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: '1.125rem', color: 'var(--ink)', lineHeight: 1.7, margin: 0 }}>
                    {block.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Pull quote */}
            <div style={{ textAlign: 'left', padding: '0' }}>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '1.125rem', color: 'var(--ink)', lineHeight: 1.7, margin: '0 0 1.25rem', maxWidth: 720 }}>
                Together, these gaps shaped the question at the heart of the project:
              </p>
              <p style={{
                fontFamily: 'var(--heading)', fontSize: 'clamp(1.35rem, 2.5vw, 1.85rem)',
                fontWeight: 500, letterSpacing: '-0.015em',
                color: 'var(--ink)', lineHeight: 1.35,
                margin: 0, maxWidth: 900,
                background: '#F6F5F1', borderRadius: 8, padding: '1.5rem 1.75rem',
              }}>
                How might we empower farmers to apply independently, while giving FBN the tools to scale?
              </p>
            </div>
          </section>

          {/* ── Approach ───────────────────────────────────────────────── */}
          {/* ── Design (merged) ────────────────────────────────────────── */}
          <section id="design" style={{ paddingTop: '2rem', paddingBottom: '5rem', scrollMarginTop: '80px' }}>
            <SectionLabel>Strategy</SectionLabel>
            <h2 style={{
              fontFamily: 'var(--heading)', fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
              fontWeight: 400, lineHeight: 1.15, color: 'var(--ink)',
              letterSpacing: '-0.01em', marginBottom: '1.25rem', maxWidth: 900,
            }}>
              From pillars to decisions
            </h2>
            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 400,
              color: '#1a1a1a', lineHeight: 1.7, maxWidth: 900, marginBottom: '1.75rem',
            }}>
              With a project this foundational, scope creep was a real risk, and we had a hard deadline: the product needed to ship before the spring planting season, when farmers would be actively seeking financing. To stay focused on the MVP, my PM and I led two key activities:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem', paddingLeft: '1.25rem' }}>
              {[
                { label: 'Competitor analysis', desc: 'we studied loan platforms across retail and ag to identify what worked and what patterns we could adapt' },
                { label: 'Stakeholder workshops', desc: "we also gathered input from across the business to surface priorities and ensure design decisions would serve both farmers and FBN's operational needs" },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: '0.75rem', alignItems: 'baseline' }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" style={{ flexShrink: 0, marginTop: 3 }}>
                    <path d="M1,5 C2.5,4 4,5.5 5,4.8 C6,4.1 7.5,5.2 9,5"
                      fill="none" stroke="#FD1E20" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 400, color: '#1a1a1a', lineHeight: 1.7, margin: 0, maxWidth: 900 }}>
                    <strong style={{ fontWeight: 700 }}>{item.label}:</strong> {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 400,
              color: '#1a1a1a', lineHeight: 1.7, maxWidth: 900, marginBottom: '3rem',
            }}>
              From these two activities, we built a now, next, and later list at the feature level, prioritized by feasibility from product, tech, design, and business perspectives. We also established three design principles to apply across the experience. These became critical later in the process, helping us filter feedback, stay focused, and make faster decisions.
            </p>

            {/* Design pillars — row layout */}
            <h3 style={{
              fontFamily: 'var(--heading)', fontSize: '1.35rem', fontWeight: 500,
              letterSpacing: '-0.015em', color: 'var(--ink)', margin: '0 0 1.25rem',
            }}>
              Guiding design principles:
            </h3>
            <PillarRows />

          </section>

          {/* ── Design ─────────────────────────────────────────────────── */}
          <section id="form-design" style={{ paddingTop: '2rem', paddingBottom: '5rem', scrollMarginTop: '80px' }}>
            <SectionLabel>Design</SectionLabel>
            <h2 style={{
              fontFamily: 'var(--heading)', fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
              fontWeight: 400, lineHeight: 1.15, color: 'var(--ink)',
              letterSpacing: '-0.01em', marginBottom: '1.25rem', maxWidth: 900,
            }}>
              Key dimensions of form UX
            </h2>
            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 400,
              color: 'var(--ink)', lineHeight: 1.7, maxWidth: 900, marginBottom: '2rem',
            }}>
              With these principles in place, I broke the form experience into three dimensions to design against.
            </p>

            <DesignDetailsShowcase />

            <div style={{ textAlign: 'left', padding: '0', marginTop: '2.5rem' }}>
              <p style={{
                fontFamily: 'var(--heading)', fontSize: 'clamp(1.35rem, 2.5vw, 1.85rem)',
                fontWeight: 500, letterSpacing: '-0.015em',
                color: 'var(--ink)', lineHeight: 1.35,
                margin: 0, maxWidth: 900,
                background: '#F6F5F1', borderRadius: 8, padding: '1.5rem 1.75rem',
              }}>
                The UX patterns built for this project (steppers, forms, and complex accordions) were later adopted by other teams and added to FBN's company design library, Harvest.
              </p>
            </div>
          </section>

          {/* ── Final Design ───────────────────────────────────────────── */}
          <section id="final-design" style={{ paddingTop: '2rem', paddingBottom: '5rem', scrollMarginTop: '80px' }}>
            <SectionLabel>Final Design</SectionLabel>
            <h2 style={{
              fontFamily: 'var(--heading)', fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
              fontWeight: 400, lineHeight: 1.15, color: 'var(--ink)',
              letterSpacing: '-0.01em', marginBottom: '1rem', maxWidth: 900, marginTop: '2rem',
            }}>
              The finished experience
            </h2>
            <FinalDesignShowcase />
          </section>

          {/* ── Impact ─────────────────────────────────────────────────── */}
          <section id="impact" style={{ paddingTop: '2rem', paddingBottom: '5rem', scrollMarginTop: '80px' }}>
            <SectionLabel>Impact</SectionLabel>
            <h2 style={{
              fontFamily: 'var(--heading)', fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
              fontWeight: 400, lineHeight: 1.15, color: 'var(--ink)',
              letterSpacing: '-0.01em', marginBottom: '3.5rem', maxWidth: 900,
            }}>
              What it changed
            </h2>

            <div className="stat-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '3.5rem' }}>
              {[
                { stat: '23%', detail: 'of redundant questions eliminated' },
                { stat: '10,000+', detail: 'Farmers reached at launch' },
                { stat: '87%', detail: 'Customer satisfaction score (CSAT)' },
              ].map((s, i) => (
                <div key={i} className="sticker" style={{ position: 'relative', padding: '2.25rem 2rem' }}>
                  <p style={{ fontFamily: 'var(--heading)', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 500, letterSpacing: '-0.03em', color: '#FD1E20', lineHeight: 1, marginBottom: '0.75rem' }}>
                    {s.stat}
                  </p>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: '1.05rem', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.5, margin: 0 }}>
                    {s.detail}
                  </p>
                </div>
              ))}
            </div>

          </section>

          {/* ── Next case study ────────────────────────────────────────── */}
          <div style={{
            borderTop: '1px solid #EBEBEB',
            padding: '3rem 0 5rem',
            display: 'flex', justifyContent: 'flex-end',
          }}>
            <a href="/work/finance-platform-redesign" style={{
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
              <span style={{ fontFamily: 'var(--heading)', fontSize: '0.95rem', color: 'rgba(0,0,0,0.5)', marginRight: '0.25rem' }}>
                Next
              </span>
              Finance Platform Redesign →
            </a>
          </div>

        </main>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #EBEBEB', maxWidth: 1200,
        margin: '0 auto', padding: '2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '1rem',
      }}>
        <span style={{ fontFamily: 'var(--font-organic-hand), var(--heading)', textTransform: 'uppercase', fontSize: '1.4rem', letterSpacing: '0.02em', color: 'var(--ink)' }}>
          Zhu Nan
        </span>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/zhunan/' }, { label: 'Resume', href: '/Zhu_Nan_Resume_2025.html' }].map(link => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" style={{
              fontFamily: 'var(--heading)', fontSize: '0.95rem', fontWeight: 500, color: '#FD1E20',
              textDecoration: 'none', transition: 'color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C8141A')}
              onMouseLeave={e => (e.currentTarget.style.color = '#FD1E20')}
            >{link.label}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}

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
    label: 'Eligibility',
    image: '/case studies/digital loan application/Eligibility.png',
    title: 'Eligibility Check',
    subtitle: 'Farmers confirm minimum requirements before starting. This prevents unqualified applications and reduces noise for the loan team.',
    inactiveBg: '#EAE3DA', inactiveColor: '#7A3A1A',
  },
  {
    label: 'Application',
    image: '/case studies/digital loan application/App form.gif',
    title: 'Application Form',
    subtitle: 'A guided, save-anytime experience with a progress bar for clear visibility and flexibility to navigate back to any section.',
    inactiveBg: '#C5CEA0', inactiveColor: '#4A5E35',
  },
  {
    label: 'Co-applicant',
    image: '/case studies/digital loan application/Co-app.gif',
    title: 'Co-Applicant',
    subtitle: 'The primary applicant can either fill in co-applicant details themselves or invite the co-applicant to complete their own section independently.',
    inactiveBg: '#D4B8C7', inactiveColor: '#6B3D5E',
  },
  {
    label: 'ID Verification',
    image: '/case studies/digital loan application/ID verification.gif',
    title: 'ID Verification',
    subtitle: 'Identity is verified before submission in under 1 minute, ensuring accuracy and preventing fraud without adding friction.',
    inactiveBg: '#B8CED4', inactiveColor: '#2A5A6A',
  },
  {
    label: 'Task Management',
    image: '/case studies/digital loan application/Task mgmt.gif',
    title: 'Task Management',
    subtitle: "A centralized hub for all post-submission tasks, giving farmers clarity on what's needed to move their application forward.",
    inactiveBg: '#E8C4A8', inactiveColor: '#7A3A1A',
  },
]

// ── Pillar rows ───────────────────────────────────────────────────────────────
const PILLARS = [
  {
    name: 'Self Service',
    desc: 'Simplified flow, eliminated unnecessary questions, and provided contextual help throughout the application',
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
    name: 'Application Security',
    desc: 'Early identity verification and centralized document upload to prevent fraud and reduce email exchanges',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M11 2.5 C11 2.5 4 5 4 11 C4 15.5 7 18.5 11 19.5 C15 18.5 18 15.5 18 11 C18 5 11 2.5 11 2.5Z"
          stroke="#B05A2B" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 11 L10 13 L14 9" stroke="#B05A2B" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Data Accuracy',
    desc: 'Real-time error feedback and plain language over jargon to reduce mistakes',
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
  // Slightly wider on the left, a bit flat at the bottom
  <svg key="0" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M10,1.2 C13.8,1.0 18.4,4.6 18.8,9.2 C19.2,13.9 16.1,18.5 11.2,18.9 C6.3,19.3 1.4,16.0 1.1,10.8 C0.8,5.7 4.8,1.4 10,1.2 Z" fill="#A0522D" />
    <path d="M6.2 10.2 L8.8 12.8 L13.8 7.2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  // Slightly taller, nudged left at top
  <svg key="1" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M9.5,0.9 C13.5,0.6 18.6,4.2 18.9,9.5 C19.2,14.4 15.8,19.1 10.5,19.2 C5.6,19.3 0.8,15.5 0.9,10.2 C1.0,5.0 5.2,1.2 9.5,0.9 Z" fill="#A0522D" />
    <path d="M6.2 10.2 L8.8 12.8 L13.8 7.2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  // Slightly irregular, bumpy on the right
  <svg key="2" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M10.2,1.1 C14.2,1.3 19.0,5.2 18.7,9.8 C18.4,14.7 14.5,19.2 9.8,18.9 C5.0,18.6 0.7,14.8 1.0,10.0 C1.3,5.2 5.8,0.9 10.2,1.1 Z" fill="#A0522D" />
    <path d="M6.2 10.2 L8.8 12.8 L13.8 7.2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
]

function PillarRows() {
  return (
    <div className="pillar-cols" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem', marginBottom: '4rem' }}>
      {PILLARS.map((p, i) => (
        <div key={p.name}>
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
  { title: 'Content', desc: 'What questions to ask, how to phrase them, and in what order' },
  { title: 'Flow',    desc: 'How users navigate through the application step by step' },
  { title: 'Layout',  desc: 'How information is revealed and presented on each screen' },
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

      {/* Mobile pill tabs — hidden on desktop */}
      <div className="approach-pills" style={{ display: 'none', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {DIMENSION_CARDS.map((card, i) => {
          const active = i === activeTab
          return (
            <button key={card.title} onClick={() => handleTabChange(i)}
              style={{
                position: 'relative',
                fontFamily: 'var(--sans)', fontSize: '0.75rem',
                fontWeight: 500,
                color: active ? '#fff' : '#1a1a1a',
                background: active ? '#A0522D' : '#fff',
                border: 'none', borderRadius: 999, cursor: 'pointer',
                padding: '0.45rem 1rem',
                letterSpacing: '0.02em',
                transition: 'background 0.2s, color 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {!active && <WobblyPillBorder />}
              {card.title}
            </button>
          )
        })}
      </div>

      {/* Clickable framework boxes — hidden on mobile */}
      <div className="approach-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '3rem' }}>
        {DIMENSION_CARDS.map((card, i) => {
          const active = i === activeTab
          const hovered = hoveredCard === i
          return (
            <div
              key={card.title}
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
              {/* Subsection 1 */}
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2, marginBottom: '0.6rem' }}>
                    Eliminated 23% of Redundant Questions
                  </h3>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 400, color: 'var(--terracotta)', lineHeight: 1.7, margin: '0 0 0.6rem', maxWidth: 900 }}>
                    → Farmers reached the end without being stopped by unfamiliar or irrelevant questions.
                  </p>
                </div>
                <div style={{ position: 'relative', width: '100%', height: 350, overflow: 'hidden' }}>
                  <WobblyBorder strokeColor="#CCCCCC" />
                  <img
                    src="/case studies/digital loan application/eliminate redundent questions.png"
                    alt="Form field documentation spreadsheet"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
                  />
                </div>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 300, color: '#444', lineHeight: 1.7, margin: '0.5rem 0 0', maxWidth: 900 }}>
                  To manage complexity, I documented every form field with its conditions, helper text, and API endpoints in a shared spreadsheet — this became the single source of truth for the entire application.
                </p>
              </div>

              {/* Subsection 2 */}
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2, marginBottom: '0.6rem' }}>
                    Building Trust Through Credibility & Transparency
                  </h3>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 400, color: 'var(--terracotta)', lineHeight: 1.7, margin: '0 0 0.6rem', maxWidth: 900 }}>
                    → Farmers knew who they were dealing with and why each step mattered before committing.
                  </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '0.75rem', alignItems: 'start' }}>
                  <div>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <WobblyBorder strokeColor="#CCCCCC" />
                      <img src="/case studies/digital loan application/transparency 1.png" alt="Start page showing FBN credibility stats" style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>
                    <p style={{ fontFamily: 'var(--sans)', fontSize: '0.8rem', fontStyle: 'italic', color: '#999', marginTop: '0.5rem', marginBottom: 0 }}>
                      Start page — right rail highlights what FBN offers to build credibility upfront
                    </p>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <div style={{ position: 'relative', width: 290 }}>
                        <WobblyBorder strokeColor="#CCCCCC" />
                        <img src="/case studies/digital loan application/transparency 2.png" alt="ID Verification screen" style={{ width: '100%', height: 'auto', display: 'block' }} />
                      </div>
                    </div>
                    <p style={{ fontFamily: 'var(--sans)', fontSize: '0.8rem', fontStyle: 'italic', color: '#999', marginTop: '0.5rem', marginBottom: 0 }}>
                      ID Verification — we explained why identity verification is needed before submission
                    </p>
                  </div>
                </div>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 300, color: '#444', lineHeight: 1.7, margin: '0.5rem 0 0', maxWidth: 900 }}>
                  FBN's credibility and data usage policy are surfaced at the very start of the flow — and identity verification is explained before it's requested.
                </p>
              </div>
            </div>
          )}

          {/* ── FLOW ── */}
          {activeTab === 1 && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2, marginBottom: '0.6rem' }}>
                  Progress Bar for Transparency
                </h3>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 400, color: 'var(--terracotta)', lineHeight: 1.7, margin: '0 0 0.6rem', maxWidth: 900 }}>
                  → Abandonment reduced — users knew how much was left and felt in control of the process.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '60% 40%', gap: '1.25rem', alignItems: 'start', paddingRight: '2px', maxWidth: 800 }}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <WobblyBorder strokeColor="#CCCCCC" />
                  <img src="/case studies/digital loan application/stepper:desktop.gif" alt="Progress bar — desktop" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
                <div style={{ position: 'relative', width: '100%' }}>
                  <WobblyBorder strokeColor="#CCCCCC" />
                  <img src="/case studies/digital loan application/stepper:mobile.gif" alt="Progress bar — mobile" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
              </div>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 300, color: '#444', lineHeight: 1.7, margin: '0.5rem 0 0', maxWidth: 900 }}>
                A persistent stepper shows exactly where farmers are and lets them navigate back freely.
              </p>
            </div>
          )}

          {/* ── LAYOUT ── */}
          {activeTab === 2 && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2, marginBottom: '0.6rem' }}>
                  Progressive Disclosure
                </h3>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 400, color: 'var(--terracotta)', lineHeight: 1.7, margin: '0 0 0.6rem', maxWidth: 900 }}>
                  → Cognitive load dropped significantly — farmers never felt overwhelmed mid-application.
                </p>
              </div>
              <div style={{ width: '80%', position: 'relative' }}>
                <WobblyBorder strokeColor="#CCCCCC" />
                <img src="/case studies/digital loan application/progressive disclosure.gif" alt="Progressive Disclosure" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 300, color: '#444', lineHeight: 1.7, margin: '0.5rem 0 0', maxWidth: 900 }}>
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
          {/* Left — phone image */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={tab.image} alt={tab.title}
              style={{ maxHeight: 580, width: 'auto', maxWidth: '100%', display: 'block' }} />
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

export default function DigitalLoanApplication() {
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
          .approach-cards { display: none !important; }
          .approach-pills { display: flex !important; }
          .design-row { grid-template-columns: 1fr !important; }
          .stat-row { grid-template-columns: 1fr !important; }
          .pillar-cols { grid-template-columns: 1fr !important; }
          .hero-wrapper { padding-left: 1.25rem !important; padding-right: 1.25rem !important; }
          .hero-section { padding-top: 2.5rem !important; padding-bottom: 2.5rem !important; }
          .hero-h1 { font-size: 2.25rem !important; }
          .hero-subtitle { max-width: 100% !important; font-size: 1rem !important; }
          .hero-tags { flex-wrap: wrap !important; flex-direction: row !important; }
          .hero-cover { width: 100% !important; }
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
      <div style={{ background: '#E8EDE8', borderBottom: '1px solid #E4DDD4', paddingTop: 56 }}>
        <div className="hero-wrapper" style={{ maxWidth: 1200, margin: '0 auto', paddingLeft: 'calc(200px + 3rem)', paddingRight: '3rem' }}>
          <section id="overview" className="hero-section" style={{ paddingTop: '4rem', paddingBottom: '5rem', scrollMarginTop: '90px' }}>
            {/* Meta pills */}
            <div className="hero-tags flex flex-wrap gap-2" style={{ marginBottom: '2rem' }}>
              {['Consumer Facing', 'Mobile', 'End-to-End'].map(tag => (
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
            <h1 className="hero-h1" style={{
              fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 400, lineHeight: 1.05, color: 'var(--ink)',
              letterSpacing: '-0.01em', marginBottom: '1.5rem',
            }}>
              Digital Loan Application
            </h1>
            <p className="hero-subtitle" style={{
              fontFamily: 'var(--sans)', fontSize: '1.075rem', fontWeight: 300,
              color: '#1a1a1a', lineHeight: 1.7, maxWidth: 900, marginBottom: '3.5rem',
            }}>
              Redesigning the loan application experience for American farmers — from paper forms to a guided digital flow.
            </p>
            <img
              src="/case studies/digital loan application/Cover.png"
              alt="Digital Loan Application cover"
              className="hero-cover"
              style={{ width: '85%', height: 'auto', display: 'block', borderRadius: '0.75rem' }}
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
              Farmers Are Struggling With the Outdated Loan Process
            </h2>
            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1rem', fontStyle: 'italic',
              color: '#555', marginBottom: '2.5rem', fontWeight: 300, maxWidth: 900,
            }}>
              The existing DocuSign-based process was inefficient for both farmers and FBN Finance.
            </p>

            {/* Two problem cards */}
            <div className="problem-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3.5rem' }}>
              {[
                {
                  label: 'For Farmers',
                  tag: 'USER', tagBg: '#F2DFA0', tagColor: '#8B6914',
                  items: [
                    'Struggled to complete applications without assistance',
                    'Errors led to delays, denials, or increased rates',
                    'Complex sections like collateral had no digital guidance',
                  ],
                },
                {
                  label: 'For FBN',
                  tag: 'BUSINESS', tagBg: '#B8CED4', tagColor: '#2A5A6A',
                  items: [
                    'Human touchpoints required at nearly every stage',
                    'Impossible to scale during high-volume periods',
                    'No visibility into application status or bottlenecks',
                  ],
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
                ⁈ How might we empower farmers to apply independently — while giving FBN the tools to scale?
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
          {/* ── Design (merged) ────────────────────────────────────────── */}
          <section id="design" style={{ paddingTop: '2rem', paddingBottom: '5rem', scrollMarginTop: '80px' }}>
            <SectionLabel>Approach</SectionLabel>
            <h2 style={{
              fontFamily: 'var(--serif)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 400, lineHeight: 1.15, color: 'var(--ink)',
              letterSpacing: '-0.01em', marginBottom: '1.25rem', maxWidth: 900,
            }}>
              From Pillars to Decisions
            </h2>
            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
              color: '#1a1a1a', lineHeight: 1.7, maxWidth: 900, marginBottom: '1.75rem',
            }}>
              With a project this foundational, scope creep was a real risk. To stay focused on the MVP, my PM and I led two key activities:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem', paddingLeft: '1.25rem' }}>
              {[
                { label: 'Competitor analysis', desc: 'studied loan platforms across retail and ag to identify what worked and what patterns we could adapt' },
                { label: 'Stakeholder workshops', desc: "gathered input from across the business to surface priorities and ensure design decisions would serve both farmers and FBN's operational needs" },
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
              From these sessions, I distilled the findings into three design pillars — guiding principles that helped us filter feedback, stay focused, and make faster decisions throughout the project.
            </p>

            {/* Design pillars — row layout */}
            <PillarRows />

            {/* Design details heading */}
            <h3 style={{
              fontFamily: 'var(--serif)', fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
              fontWeight: 400, lineHeight: 1.2, color: 'var(--ink)',
              letterSpacing: '-0.01em', marginBottom: '2rem', maxWidth: 900,
            }}>
              Design Details — Key Dimensions of Form UX
            </h3>

            <DesignDetailsShowcase />

            <div style={{ textAlign: 'left', padding: '0', marginTop: '2.5rem' }}>
              <p style={{
                fontFamily: 'var(--serif)', fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)',
                fontStyle: 'italic', fontWeight: 400,
                color: 'var(--terracotta)', lineHeight: 1.5,
                marginBottom: '1rem', maxWidth: 900,
              }}>
                ✦ The UX patterns built for this project — steppers, forms, and complex accordions — were later adopted by other teams and added to FBN's company design library, Harvest.
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
              The Finished Experience
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
              What It Changed
            </h2>

            <div className="stat-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '3.5rem' }}>
              {[
                { stat: '23%', detail: 'of redundant questions eliminated' },
                { stat: '10,000+', detail: 'Farmers reached at launch' },
                { stat: '87%', detail: 'Customer satisfaction score (CSAT)' },
              ].map((s, i) => (
                <div key={i} style={{ position: 'relative', padding: '2.5rem 2rem', background: '#FAF6F1' }}>
                  <WobblyBorder strokeColor="#D4CBC2" />
                  <p style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 400, color: 'var(--terracotta)', lineHeight: 1, marginBottom: '0.75rem' }}>
                    {s.stat}
                  </p>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: '0.875rem', fontWeight: 300, color: '#444', lineHeight: 1.6, margin: 0 }}>
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
              <span style={{ fontFamily: 'var(--serif)', fontSize: '0.95rem', fontStyle: 'italic', color: '#999', marginRight: '0.25rem' }}>
                Next
              </span>
              Finance Platform Redesign →
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

'use client'

import { useEffect, useRef, useState } from 'react'
import Nav from '../../components/Nav'
import BackToTop from '../../components/BackToTop'
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
  { id: 'form-design', label: 'Design', children: [
    { id: 'form-design', label: 'Content' },
    { id: 'design-flow', label: 'Flow' },
  ] },
  { id: 'final-design', label: 'Result' },
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

// Hand-drawn red circle around a key number (uses the shared doodle-rough filter)
function HandCircle({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', padding: '0 0.3em', margin: '0 0.15em', whiteSpace: 'nowrap' }}>
      {children}
      <svg aria-hidden="true" viewBox="0 0 100 50" preserveAspectRatio="none"
        style={{ position: 'absolute', left: '-8%', top: '-30%', width: '116%', height: '160%', overflow: 'visible', pointerEvents: 'none' }}>
        <path d="M58,5 C80,4 97,14 96,26 C95,40 72,47 48,46 C24,45 4,37 4,24 C4,12 22,5 44,4 C54,3.6 66,5 74,8"
          fill="none" stroke="#FD1E20" strokeWidth="2.4" strokeLinecap="round" vectorEffect="non-scaling-stroke" filter="url(#doodle-rough)" />
      </svg>
    </span>
  )
}

// Impact stat — big red number with a short label (no card)
function ImpactStat({ stat, detail }: { stat: string; detail: string }) {
  return (
    <div>
      <p style={{ fontFamily: 'var(--heading)', fontSize: 'clamp(2.1rem, 4vw, 2.75rem)', fontWeight: 500, letterSpacing: '-0.03em', color: '#FD1E20', lineHeight: 1, margin: '0 0 0.6rem' }}>
        {stat}
      </p>
      <p style={{ fontFamily: 'var(--sans)', fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.5, margin: 0 }}>
        {detail}
      </p>
    </div>
  )
}

// Design · Content — the four content steps
function ContentSteps() {
  return (
    <div className="dimension-block">
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      <div>
        <h4 style={{ fontFamily: 'var(--heading)', fontSize: '1.35rem', fontWeight: 500, letterSpacing: '-0.015em', color: 'var(--ink)', lineHeight: 1.3, margin: '0 0 0.5rem' }}>
          Trim to the essentials
        </h4>
        <p style={{ fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.7, margin: 0, maxWidth: 900 }}>
          Using insights from the audit and working sessions with the loan sales team, we re-evaluated every question for each loan type and sorted them into must-haves and nice-to-haves. We then reviewed the cuts with credit and underwriting to make sure nothing vital was lost. In the end, we removed <HandCircle>23%</HandCircle> of questions, so farmers could reach the end without getting stuck on unfamiliar or irrelevant ones.
        </p>
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ position: 'relative', width: '100%', height: 350, overflow: 'hidden' }}>
            <span className="shot-frame" aria-hidden="true" />
            <img
              src="/case studies/digital loan application/eliminate redundent questions.png"
              alt="Form field documentation spreadsheet"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
            />
          </div>
        </div>
        <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9rem', color: 'rgba(0,0,0,0.55)', margin: '0.6rem 0 0', maxWidth: 900 }}>
          Every field was documented with its conditions, helper text, and API endpoints in a shared spreadsheet, which became the single source of truth for the application.
        </p>
      </div>
      <div>
        <h4 style={{ fontFamily: 'var(--heading)', fontSize: '1.35rem', fontWeight: 500, letterSpacing: '-0.015em', color: 'var(--ink)', lineHeight: 1.3, margin: '0 0 0.5rem' }}>
          Say it plainly
        </h4>
        <p style={{ fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.7, margin: 0, maxWidth: 900 }}>
          With a leaner set of questions, we rewrote them in plain language, removed financial jargon, and added helper text wherever farmers needed more context.
        </p>
      </div>
      <div>
        <h4 style={{ fontFamily: 'var(--heading)', fontSize: '1.35rem', fontWeight: 500, letterSpacing: '-0.015em', color: 'var(--ink)', lineHeight: 1.3, margin: '0 0 0.5rem' }}>
          Easy first, complex later
        </h4>
        <p style={{ fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.7, margin: 0, maxWidth: 900 }}>
          We tested several question orders and landed on one that starts with simple, familiar questions and builds toward the complex ones, like financials and land details.
        </p>
      </div>
      <div>
        <h4 style={{ fontFamily: 'var(--heading)', fontSize: '1.35rem', fontWeight: 500, letterSpacing: '-0.015em', color: 'var(--ink)', lineHeight: 1.3, margin: '0 0 0.5rem' }}>
          Earn trust up front
        </h4>
        <p style={{ fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.7, margin: 0, maxWidth: 900 }}>
          Trust came through as a key theme in research. FBN wasn't a household name in lending, so trust had to be earned from the very first screen. We built credibility by highlighting FBN's lending track record before the application starts, and transparency by explaining why each step matters, especially sensitive ones like sharing an SSN or verifying identity. As a result, farmers knew who they were working with, and why each step mattered, before committing.
        </p>
        <div style={{ marginTop: '1.5rem' }}>
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
        </div>
      </div>
    </div>
    </div>
  )
}

// Design · Flow — linear vs non-linear, and the navigable progress bar
function FlowSteps() {
  return (
    <div className="dimension-block">
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      <div>
        <h4 style={{ fontFamily: 'var(--heading)', fontSize: '1.35rem', fontWeight: 500, letterSpacing: '-0.015em', color: 'var(--ink)', lineHeight: 1.3, margin: '0 0 0.5rem' }}>
          Linear or non-linear?
        </h4>
        <p style={{ fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.7, margin: '0 0 1rem', maxWidth: 900 }}>
          One of the biggest early debates was whether the application should be linear or non-linear. The loan team strongly favored non-linear. It mirrored the flexibility farmers had with DocuSign and paper applications, where they could skip around and fill out sections in any order, and they worried that a strict sequence would frustrate users and drive up drop-off.
        </p>
        <p style={{ fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.7, margin: '0 0 1rem', maxWidth: 900 }}>
          I advocated for a linear flow. A fixed sequence unlocked progressive disclosure, revealing questions only when they're relevant, which reduces cognitive load and makes a long form feel far less overwhelming. It also let us tailor follow-up questions to earlier answers, scale more easily to new loan types, and gave engineering a simpler system to build and maintain.
        </p>
        <div style={{ margin: '0.5rem 0 1.5rem' }}>
          <div style={{ width: '80%', position: 'relative', margin: '0 auto' }}>
                <span className="shot-frame" aria-hidden="true" />
                <img src="/case studies/digital loan application/progressive disclosure.gif" alt="Progressive Disclosure" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9rem', color: 'rgba(0,0,0,0.55)', margin: '0.6rem auto 0', width: '80%' }}>
            Progressive disclosure: follow-up questions appear only when an earlier answer calls for them.
          </p>
        </div>
        <p style={{ fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.7, margin: '0 0 1rem', maxWidth: 900 }}>
          Informed by research and testing, we landed on the best of both: a linear flow at its core, with non-linear elements that let farmers go back and revisit any previous section whenever they needed to.
        </p>
      </div>
      <div>
        <h4 style={{ fontFamily: 'var(--heading)', fontSize: '1.35rem', fontWeight: 500, letterSpacing: '-0.015em', color: 'var(--ink)', lineHeight: 1.3, margin: '0 0 0.5rem' }}>
          Staying oriented in a long application
        </h4>
        <p style={{ fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.7, margin: '0 0 1rem', maxWidth: 900 }}>
          Some loan applications are lengthy, so the question became: how might we keep farmers oriented from start to finish? I explored several progress bar concepts and worked closely with engineering to build one that does double duty. It shows exactly where farmers are and how much is left, and it also works as navigation, so they can jump back to any completed section. This is where the non-linear flexibility lives.
        </p>
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '60% 40%', gap: '1.25rem', alignItems: 'start', maxWidth: 740, margin: '0 auto' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <span className="shot-frame" aria-hidden="true" />
              <img src="/case studies/digital loan application/stepper:desktop.gif" alt="Progress bar — desktop" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
            <div style={{ position: 'relative', width: '100%' }}>
              <span className="shot-frame" aria-hidden="true" />
              <img src="/case studies/digital loan application/stepper:mobile.gif" alt="Progress bar — mobile" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

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
        main.cs-content > section#problem { padding-top: 64px !important; }
        main.cs-content > section > p:first-child { margin-bottom: 8px !important; }
        main.cs-content > section > h2 { margin-top: 0 !important; margin-bottom: 24px !important; }
        main.cs-content > section > p:not(:first-child) { margin-top: 0 !important; margin-bottom: 24px !important; }
        main.cs-content > section > h3 { margin-top: 48px !important; margin-bottom: 16px !important; }
        main.cs-content > section > div[style*="flex-direction: column"] { margin-bottom: 24px !important; }
        main.cs-content section div[style*="gap: 1rem"][style*="padding-left"] { gap: 16px !important; }
        main.cs-content section div[style*="gap: 2rem"][style*="flex-direction: column"] { gap: 24px !important; }
        main.cs-content section div[style*="gap: 2rem"][style*="flex-direction: column"] h3 { margin-bottom: 8px !important; }
        .pillar-cols { margin-bottom: 0 !important; }
        /* Result section is a visual showcase — centered opener, extra room before the first screen */
        main.cs-content > section#final-design > p:first-child,
        main.cs-content > section#final-design > h2 { text-align: center; margin-left: auto !important; margin-right: auto !important; }
        main.cs-content > section#final-design > h2 { margin-bottom: 64px !important; }
        .pillar-cols > div > div:first-child { margin-bottom: 8px !important; }

        /* "Sticker" surfaces — thin black outline + solid red offset shadow (matches About buttons) */
        .sticker { background: #FFFFFF; border: 1.6px solid #1A1A1A; border-radius: 12px; box-shadow: 5px 5px 0 #FD1E20; }
        .sticker-chip { background: #FFFFFF; border: 1.4px solid #1A1A1A; border-radius: 8px; box-shadow: 3px 3px 0 #FD1E20; }
        .dimension-block { scroll-margin-top: 90px; }
        .exp-company-link { color: inherit; text-decoration: underline; text-decoration-color: rgba(253,30,32,0.55); text-decoration-thickness: 1.5px; text-underline-offset: 4px; transition: color 0.15s ease, text-decoration-color 0.15s ease; }
        .exp-company-link:hover { color: #C8141A; text-decoration-color: #C8141A; }
        .story-card { display: flex; align-items: stretch; gap: 1rem; margin-top: 1.25rem; background: #FFFFFF; border: 1px solid rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; text-decoration: none; color: inherit; transition: box-shadow 0.2s ease, border-color 0.2s ease; }
        .story-card:hover { border-color: rgba(0,0,0,0.2); box-shadow: 0 6px 18px rgba(0,0,0,0.08); }
        .story-card-img { width: 180px; flex-shrink: 0; object-fit: cover; display: block; background: #E8EDE8; }
        .story-card-body { display: flex; flex-direction: column; justify-content: center; gap: 0.3rem; padding: 0.85rem 1rem 0.85rem 0; min-width: 0; }
        .story-card-source { font-family: var(--sans); font-size: 0.8rem; color: rgba(0,0,0,0.5); }
        .story-card-title { font-family: var(--heading); font-size: 1rem; font-weight: 500; line-height: 1.35; color: var(--ink); }
        .story-card-cta { font-family: var(--heading); font-size: 0.9rem; font-weight: 500; color: #FD1E20; transition: color 0.15s ease; }
        .story-card-cta::after { content: ' →'; }
        .story-card:hover .story-card-cta { color: #C8141A; }
        @media (max-width: 560px) { .story-card { flex-direction: column; gap: 0; } .story-card-img { width: 100%; aspect-ratio: 1200 / 628; } .story-card-body { padding: 0.85rem 1rem; } }
        .field-photos { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; max-width: 600px; margin: 0 auto; }
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
      <BackToTop />
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
                <span key={tag} style={{
                  fontFamily: 'var(--sans)', fontSize: '0.75rem',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'rgba(0,0,0,0.65)', fontWeight: 500,
                  background: 'rgba(0,0,0,0.06)', borderRadius: 999,
                  padding: '0.3rem 0.85rem',
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

      {/* Page layout — single centered column; section links live in the PageMenu */}
      <div className="cs-layout" style={{ maxWidth: 820, margin: '0 auto' }}>

        <main className="cs-content" style={{ padding: '0 2rem', minWidth: 0 }}>

          {/* ── Project snapshot — role / team / timeline, just below the hero ── */}
          <div className="meta-row" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem',
            borderTop: '1px solid rgba(0,0,0,0.12)', borderBottom: '1px solid rgba(0,0,0,0.12)',
            padding: '1.5rem 0', marginTop: 64,
          }}>
            {[
              { label: 'My role', value: 'Design research, strategy,\nend-to-end UI & UX' },
              { label: 'Team', value: '1 PM, 1 Designer,\n4 Engineers' },
              { label: 'Timeline', value: 'V1: May – Oct 2021\nV2: Nov – Dec 2023' },
            ].map(item => (
              <div key={item.label}>
                <p style={{
                  fontFamily: 'var(--sans)', fontSize: '0.75rem', letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: 'rgba(0,0,0,0.5)', fontWeight: 600, margin: '0 0 0.35rem',
                }}>
                  {item.label}
                </p>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.5, margin: 0, whiteSpace: 'pre-line' }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>


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
              Aligning with stakeholders early
            </h2>
            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 400,
              color: '#1a1a1a', lineHeight: 1.7, maxWidth: 900, marginBottom: '1.75rem',
            }}>
              With a project this foundational, scope creep was a real risk, and we had a hard deadline: the product needed to ship before the spring planting season, when farmers would be actively seeking financing. To stay focused on the MVP, my PM and I led three key activities:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem', paddingLeft: '1.25rem' }}>
              {[
                { label: 'Current experience gap analysis', desc: "we audited the existing paper-based loan process and interviewed 7 of FBN's top-performing loan agents to understand pain points from both the farmers' and the agents' perspectives." },
                { label: 'Competitor analysis', desc: 'we studied loan platforms across retail and ag to identify what worked and what patterns we could adapt.' },
                { label: 'Stakeholder workshops', desc: "we also gathered input from across the business to surface priorities and ensure design decisions would serve both farmers and FBN's operational needs." },
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

            {/* Field research photos */}
            <figure style={{ margin: '0 0 24px' }}>
              <div className="field-photos">
                {[
                  { src: 'field-research-1.jpg', alt: 'Zhu standing in a cornfield during a farm visit', pos: 'center' },
                  { src: 'field-research-2.jpg', alt: 'Zhu with a farmer in his tractor cab', pos: '78% center' },
                  { src: 'field-research-3.jpg', alt: 'Zhu with a herd of cattle on a ranch visit', pos: 'center' },
                ].map(photo => (
                  <div key={photo.src} className="cs-print" style={{ padding: 8 }}>
                    <img
                      src={`/case%20studies/digital%20loan%20application/${photo.src}`}
                      alt={photo.alt}
                      style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', objectPosition: photo.pos, display: 'block' }}
                    />
                  </div>
                ))}
              </div>
              <figcaption style={{ marginTop: '0.9rem', textAlign: 'center', fontFamily: 'var(--font-organic-hand), var(--heading)', fontSize: '1.1rem', letterSpacing: '0.02em', color: 'var(--ink)' }}>
                Out in the field: visiting farms to see where and how farmers actually work
              </figcaption>
            </figure>

            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 400,
              color: '#1a1a1a', lineHeight: 1.7, maxWidth: 900, marginBottom: '3rem',
            }}>
              From these three activities, we built a now, next, and later list at the feature level, prioritized by feasibility from product, tech, design, and business perspectives. We also established three design principles to apply across the experience. These became critical later in the process, helping us filter feedback, stay focused, and make faster decisions.
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
            <SectionLabel>Design · Content</SectionLabel>
            <h2 style={{
              fontFamily: 'var(--heading)', fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
              fontWeight: 400, lineHeight: 1.15, color: 'var(--ink)',
              letterSpacing: '-0.01em', marginBottom: '1.25rem', maxWidth: 900,
            }}>
              What we asked, and how we asked it
            </h2>
            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 400,
              color: 'var(--ink)', lineHeight: 1.7, maxWidth: 900, marginBottom: '2rem',
            }}>
              With the principles in place, content was the natural place to start, since we had an existing application to work from.
            </p>

            <ContentSteps />
          </section>

          {/* ── Design · Flow ───────────────────────────────────────────── */}
          <section id="design-flow" style={{ paddingTop: '2rem', paddingBottom: '5rem', scrollMarginTop: '80px' }}>
            <SectionLabel>Design · Flow</SectionLabel>
            <h2 style={{
              fontFamily: 'var(--heading)', fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
              fontWeight: 400, lineHeight: 1.15, color: 'var(--ink)',
              letterSpacing: '-0.01em', marginBottom: '1.25rem', maxWidth: 900,
            }}>
              Guiding farmers through a long application
            </h2>
            <FlowSteps />

          </section>

          {/* ── Final Design ───────────────────────────────────────────── */}
          <section id="final-design" style={{ paddingTop: '2rem', paddingBottom: '5rem', scrollMarginTop: '80px' }}>
            <SectionLabel>Result</SectionLabel>
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

            <p style={{ fontFamily: 'var(--sans)', fontSize: '1.0625rem', color: 'var(--ink)', lineHeight: 1.7, margin: '0 0 1.25rem', maxWidth: 900 }}>
              The redesign answered both sides of our &ldquo;How might we&rdquo; question: farmers could apply on their own, and FBN could finally scale.
            </p>

            <div className="stat-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
              {[
                { stat: '87%', detail: 'Customer satisfaction score (CSAT)' },
                { stat: '23%', detail: 'Fewer questions to answer' },
                { stat: '10,000+', detail: 'Farmers reached at launch' },
              ].map(s => <ImpactStat key={s.stat} {...s} />)}
            </div>

            {/* Farmer quote */}
            <figure style={{ margin: '48px 0 0', padding: '1.75rem 2rem', background: '#F6F5F1', borderRadius: 8 }}>
              <blockquote style={{ margin: 0, fontFamily: 'var(--heading)', fontSize: 'clamp(1.15rem, 2vw, 1.35rem)', fontWeight: 400, lineHeight: 1.55, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
                &ldquo;The application was relatively easy. We did most of it online, if not all of it. And you could do it at your own pace, which was nice.&rdquo;
              </blockquote>
              <figcaption style={{ marginTop: '1rem', fontFamily: 'var(--font-organic-hand), var(--heading)', fontSize: '1.2rem', letterSpacing: '0.02em', color: 'var(--ink)' }}>
                  Andy, 4th-generation farmer
                </figcaption>

                {/* Link preview — the published article this quote comes from */}
                <a href="https://www.fbn.com/community/blog/fourth-generation-farm-fbn-finance" target="_blank" rel="noopener noreferrer" className="story-card">
                  <img
                    src="https://www.fbn.com/vo1m91j96iq4/4N8IODdelKca7sOAtblhNE/03c58ddff63abf76c6403ce588b42261/Copy_of_NEW_Blog_Header_Template_-_2025-12-11T143415.603.png?fm=png&w=600&h=314&fit=fill&f=center"
                    alt=""
                    className="story-card-img"
                  />
                  <span className="story-card-body">
                    <span className="story-card-source">fbn.com · FBN Community</span>
                    <span className="story-card-title">Why a Fourth-Generation Family Farm Is &lsquo;Very, Very Glad&rsquo; They Work with FBN Finance</span>
                    <span className="story-card-cta">Read Andy&apos;s story</span>
                  </span>
                </a>
            </figure>

            <div style={{ textAlign: 'left', padding: '0', marginTop: 40 }}>
              <p style={{
                fontFamily: 'var(--sans)', fontSize: '1.125rem', fontWeight: 400,
                color: 'var(--ink)', lineHeight: 1.7, margin: 0, maxWidth: 900,
              }}>
                Beyond this launch, the UX patterns built for this project (steppers, forms, and complex accordions) were later adopted by other teams and added to FBN's company design library, Harvest.
              </p>
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

'use client'

import { useEffect, useRef, useState } from 'react'
import Nav from '../../components/Nav'

// ── Wobbly border ─────────────────────────────────────────────────────────────
function seg(x1: number, y1: number, x2: number, y2: number, wobble: number, n: number) {
  const dx = x2 - x1, dy = y2 - y1
  const len = Math.hypot(dx, dy)
  if (!len) return ''
  const nx = -dy / len
  let d = ''
  for (let i = 0; i < n; i++) {
    const mid = (i + 0.5) / n, t1 = (i + 1) / n
    const off = (Math.random() - 0.5) * wobble * 2
    d += ` Q ${(x1 + dx * mid + nx * off).toFixed(1)} ${(y1 + dy * mid + (dx / len) * off * 0).toFixed(1)}`
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

function WobblyHRule() {
  return (
    <svg width="100%" height="8" viewBox="0 0 600 8" preserveAspectRatio="none" aria-hidden="true" style={{ display: 'block' }}>
      <path d="M0,4 C80,2.5 160,5.5 260,4 C360,2.5 460,5.5 540,4 C565,3.5 585,4.5 600,4"
        fill="none" stroke="#E0D8D0" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}


// ── Archetype showcase ────────────────────────────────────────────────────────
const SLIDE_CSS = `
  @keyframes slideLeftIn  { from { transform: translateX(60px);  opacity: 0 } to { transform: translateX(0); opacity: 1 } }
  @keyframes slideRightIn { from { transform: translateX(-60px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
`

const ARCHETYPE_PROFILES = [
  { src: '/case studies/fbn finance archetypes/achetype category 1 -1.png', caption: 'The Rooted' },
  { src: '/case studies/fbn finance archetypes/achetype category 1 -2.png', caption: 'The Practical' },
  { src: '/case studies/fbn finance archetypes/achetype category 1 -3.png', caption: 'The Improver' },
  { src: '/case studies/fbn finance archetypes/achetype category 1 -4.png', caption: 'The Strategist' },
]

const ARCHETYPE_JOURNEYS = [
  '/case studies/fbn finance archetypes/achetype category 2 -1.png',
  '/case studies/fbn finance archetypes/achetype category 2 -2.png',
  '/case studies/fbn finance archetypes/achetype category 2 -3.png',
  '/case studies/fbn finance archetypes/achetype category 2 -4.png',
]

function ArchetypeShowcase() {
  const [activeTab, setActiveTab] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right'>('left')
  const [animKey, setAnimKey] = useState(0)

  const handleTabChange = (i: number) => {
    if (i === activeTab) return
    setDirection(i > activeTab ? 'left' : 'right')
    setActiveTab(i)
    setAnimKey(k => k + 1)
  }

  const animName = direction === 'left' ? 'slideLeftIn' : 'slideRightIn'

  return (
    <div>
      <style>{SLIDE_CSS}</style>

      {/* Pill tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem', overflow: 'hidden' }}>
        {['Archetypes', 'Behaviors'].map((label, i) => {
          const active = i === activeTab
          return (
            <button key={label} onClick={() => handleTabChange(i)}
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
              {label}
            </button>
          )
        })}
      </div>

      {/* Instruction */}
      <p style={{
        fontFamily: 'var(--sans)', fontSize: '0.75rem', fontStyle: 'italic',
        color: '#bbb', marginBottom: '3rem',
      }}>
        Click each tab to explore →
      </p>

      {/* Tab content */}
      <div style={{ overflow: 'hidden' }}>
        <div key={animKey} style={{ animation: `${animName} 320ms ease-in-out both` }}>

          {/* Tab 0 — Archetypes: 2×2 profile grid */}
          {activeTab === 0 && (
            <div className="archetype-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '3rem', padding: '0 2.5rem' }}>
              {ARCHETYPE_PROFILES.map((p, i) => (
                <div key={i}>
                  <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
                    <WobblyBorder strokeColor="#1A1A1A" />
                    <img
                      src={p.src}
                      alt={p.caption}
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </div>
                  <p style={{
                    fontFamily: 'var(--sans)', fontSize: '0.8rem',
                    fontStyle: 'italic', fontWeight: 300,
                    color: '#999', lineHeight: 1.5,
                    marginTop: '0.5rem', marginBottom: 0,
                  }}>
                    {p.caption}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Tab 1 — Behaviors: stacked full-width journey images */}
          {activeTab === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {ARCHETYPE_JOURNEYS.map((src, i) => (
                <div key={i} style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
                  <WobblyBorder strokeColor="#1A1A1A" />
                  <img
                    src={src}
                    alt={`Archetype ${i + 1} behaviors`}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

// ── Nav sections ──────────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  { id: 'context',    label: 'Context' },
  { id: 'research',   label: 'Research' },
  { id: 'archetypes', label: 'Archetypes' },
  { id: 'design',     label: 'Design & Impact' },
]

// ── Page ──────────────────────────────────────────────────────────────────────
export default function FBNFinanceArchetypes() {
  const [activeSection, setActiveSection] = useState('context')
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
          .before-after-cols { grid-template-columns: 1fr !important; }
          .research-photos { grid-template-columns: 1fr !important; }
          .archetype-grid { grid-template-columns: 1fr !important; }
          .stat-row { grid-template-columns: 1fr !important; }
          .meta-row { grid-template-columns: 1fr !important; }
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

      {/* ── Full-bleed hero ───────────────────────────────────────────────── */}
      <div style={{ background: '#F5EFE6', borderBottom: '1px solid #E8E0D4', paddingTop: 56, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Text block — flex-grows to fill remaining height, centers content vertically */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <div className="hero-wrapper" style={{ maxWidth: 1200, width: '100%', margin: '0 auto', paddingLeft: '3rem', paddingRight: '3rem' }}>
            <section id="overview" className="hero-section text-center" style={{ paddingTop: '2rem', paddingBottom: '2rem', scrollMarginTop: '90px' }}>
              <div className="max-w-2xl mx-auto">
                {/* Meta pills */}
                <div className="hero-tags flex flex-wrap gap-2" style={{ marginBottom: '2rem', justifyContent: 'center' }}>
                  {['AgTech · Research', 'Generative', 'Mixed Methods'].map(tag => (
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
                  Research to Roadmap: Defining FBN's First Finance Archetypes
                </h1>

                <p className="hero-subtitle" style={{
                  fontFamily: 'var(--sans)', fontSize: '1.075rem', fontWeight: 300,
                  color: '#1a1a1a', lineHeight: 1.7, marginBottom: '2rem',
                }}>
                  How generative research closed a critical knowledge gap and became the foundation for FBN's finance design decisions.
                </p>

                {/* Project metadata */}
                <div className="meta-row" style={{
                  display: 'grid', gridTemplateColumns: 'repeat(3, auto)', justifyContent: 'center',
                  gap: '0 3rem', marginBottom: 0, textAlign: 'left',
                }}>
                  {[
                    { label: 'Role', value: 'Product Designer — research collaboration, synthesis facilitation, design' },
                    { label: 'Team', value: '1 UX Researcher, 2 PMs, 2 Designers' },
                    { label: 'Timeline', value: 'Oct 2022 – Feb 2023' },
                  ].map(item => (
                    <div key={item.label}>
                      <p style={{
                        fontFamily: 'var(--sans)', fontSize: '0.6rem',
                        letterSpacing: '0.14em', textTransform: 'uppercase',
                        color: 'var(--terracotta)', fontWeight: 700, marginBottom: '0.3rem',
                      }}>
                        {item.label}
                      </p>
                      <p style={{
                        fontFamily: 'var(--sans)', fontSize: '0.875rem',
                        fontWeight: 300, color: '#1a1a1a', lineHeight: 1.5, margin: 0,
                        maxWidth: 260,
                      }}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Cover image — anchored at the bottom of the hero area */}
        <div className="hero-wrapper" style={{ maxWidth: 1200, width: '100%', margin: '0 auto', paddingLeft: '3rem', paddingRight: '3rem', paddingBottom: '3rem' }}>
          <div className="hero-cover" style={{ width: '85%', overflow: 'hidden', borderRadius: '0.75rem', margin: '0 auto' }}>
            <img
              src="/case studies/fbn finance archetypes/Hero.png"
              alt="FBN Finance Archetypes cover"
              style={{ width: '100%', height: '240px', display: 'block', objectFit: 'cover', objectPosition: 'center 30%' }}
            />
          </div>
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
                        position: 'absolute', left: 0, top: '50%',
                        transform: 'translateY(-50%)',
                        width: 6, height: 'calc(100% - 12px)',
                        overflow: 'visible',
                      }}
                    >
                      <path
                        d="M 3 1 C 4.5 8, 1.5 16, 3 22 C 4.5 28, 1.8 34, 3 39"
                        stroke="var(--terracotta)" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" fill="none"
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

          {/* ── Context ───────────────────────────────────────────────────── */}
          <section id="context" style={{ paddingTop: '1.85rem', paddingBottom: '5rem', scrollMarginTop: '80px' }}>
            <SectionLabel>Context</SectionLabel>
            <h2 style={{
              fontFamily: 'var(--serif)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 400, lineHeight: 1.15, color: 'var(--ink)',
              letterSpacing: '-0.01em', marginBottom: '0.85rem', maxWidth: 900,
            }}>
              The Knowledge Gap
            </h2>
            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1rem', fontStyle: 'italic',
              color: '#555', marginBottom: '2.5rem', fontWeight: 300, maxWidth: 900,
            }}>
              Core finance features had shipped — but the team building them had never deeply understood who was using them.
            </p>

            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
              color: '#1a1a1a', lineHeight: 1.75, maxWidth: 900, marginBottom: '2rem',
            }}>
              FBN had launched core finance features, but the team lacked a grounded understanding of who our farmers actually were. We didn't know their goals, their frustrations, or how they thought about borrowing — and without that, product and design decisions were being made on assumption.
            </p>
            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
              color: '#1a1a1a', lineHeight: 1.75, maxWidth: 900, marginBottom: '0',
            }}>
              To close that gap, we partnered with a UX researcher to conduct generative research across 17 farmers in key agricultural regions, combining on-farm interviews, remote sessions, and focus groups at the Farmer-2-Farmer conference.
            </p>
          </section>

          <WobblyHRule />

          {/* ── Research Process ──────────────────────────────────────────── */}
          <section id="research" style={{ paddingTop: '2rem', paddingBottom: '5rem', scrollMarginTop: '80px' }}>
            <SectionLabel>Research Process</SectionLabel>
            <h2 style={{
              fontFamily: 'var(--serif)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 400, lineHeight: 1.15, color: 'var(--ink)',
              letterSpacing: '-0.01em', marginBottom: '1.25rem', maxWidth: 900,
            }}>
              My Role in the Research
            </h2>
            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
              color: '#1a1a1a', lineHeight: 1.7, maxWidth: 900, marginBottom: '1.75rem',
            }}>
              I worked alongside the UX researcher throughout, contributing as the design voice in three key moments:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3.5rem', paddingLeft: '1.25rem' }}>
              {[
                {
                  label: 'Kick-off Workshops',
                  desc: 'Co-facilitated sessions to surface knowledge gaps and align product, design, business, and marketing on research priorities.',
                },
                {
                  label: 'Fieldwork & Interviews',
                  desc: 'Traveled to the Midwest to conduct on-farm interviews directly alongside the UX researcher — sitting with farmers in their homes and fields to hear firsthand how they thought about borrowing and managing their operations.',
                },
                {
                  label: 'Synthesis & Naming',
                  desc: 'After compiling themes with the researcher, I facilitated a workshop where stakeholders collaboratively named each archetype using dot voting — turning raw data into something the whole team could own.',
                },
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

            {/* Research photo gallery */}
            <div className="research-photos" style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 0.85fr 1.05fr',
              gap: '1.25rem',
              marginBottom: '3.5rem',
              alignItems: 'start',
            }}>
              {[
                {
                  src: '/case studies/fbn finance archetypes/research-photo-1.png',
                  alt: 'Driving to a farm in Kansas',
                  caption: 'Driving to a customer\'s farm in Kansas for the interview',
                },
                {
                  src: '/case studies/fbn finance archetypes/research-photo-2.jpg',
                  alt: 'Feeding a lamb after an interview',
                  caption: 'It was feeding time right after an interview, and the farmer asked if we wanted to feed the lamb!',
                },
                {
                  src: '/case studies/fbn finance archetypes/research-photo-3.JPG',
                  alt: 'Team at the Farmer-2-Farmer conference',
                  caption: 'The awesome team that helped with focus groups during the conference',
                },
              ].map((photo, i) => (
                <div key={i}>
                  <div style={{ position: 'relative', width: '100%', height: 350, overflow: 'hidden' }}>
                    <WobblyBorder strokeColor="#1A1A1A" />
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
                    />
                  </div>
                  <p style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '0.775rem',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    color: '#999',
                    lineHeight: 1.5,
                    marginTop: '0.6rem',
                    marginBottom: 0,
                  }}>
                    {photo.caption}
                  </p>
                </div>
              ))}
            </div>

            {/* Why archetypes callout */}
            <div style={{ position: 'relative', padding: '1.75rem 1.75rem 1.5rem', marginBottom: '0', background: '#FAF8F6' }}>
              <WobblyBorder strokeColor="#D4CBC2" />
              <h3 style={{
                fontFamily: 'var(--serif)', fontSize: '1.25rem',
                fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2,
                marginBottom: '0.75rem',
              }}>
                Why archetypes, not personas?
              </h3>
              <p style={{
                fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 300,
                color: '#444', lineHeight: 1.7, margin: 0, maxWidth: 820,
              }}>
                In the finance space, what farmers <em>do</em> and <em>want</em> matters more than who they are demographically. Archetypes let us focus on shared behaviors and decision-making patterns — a more actionable foundation for design and product.
              </p>
            </div>
          </section>

          <WobblyHRule />

          {/* ── Meet the Archetypes ───────────────────────────────────────── */}
          <section id="archetypes" style={{ paddingTop: '2rem', paddingBottom: '5rem', scrollMarginTop: '80px' }}>
            <SectionLabel>Meet the Archetypes</SectionLabel>
            <h2 style={{
              fontFamily: 'var(--serif)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 400, lineHeight: 1.15, color: 'var(--ink)',
              letterSpacing: '-0.01em', marginBottom: '1.25rem', maxWidth: 900,
            }}>
              Meet the Archetypes
            </h2>

            <div style={{ marginBottom: '2.5rem' }}>
              <ArchetypeShowcase />
            </div>

            {/* Closing line */}
            <div style={{ textAlign: 'left', padding: '0' }}>
              <p style={{
                fontFamily: 'var(--serif)', fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)',
                fontStyle: 'italic', fontWeight: 400,
                color: 'var(--terracotta)', lineHeight: 1.5,
                marginBottom: '1rem', maxWidth: 900,
              }}>
                ✦ These archetypes became the shared language across product, design, and marketing — and the direct input for our design roadmap.
              </p>
              <svg width="220" height="8" viewBox="0 0 220 8" aria-hidden="true" style={{ display: 'block' }}>
                <path
                  d="M4,5 C22,3 45,6 70,4.5 C95,3 118,6 142,4 C166,2.5 188,5.5 216,4"
                  fill="none" stroke="#B05A2B" strokeWidth="1.2" strokeLinecap="round"
                />
              </svg>
            </div>
          </section>

          <WobblyHRule />

          {/* ── Design ────────────────────────────────────────────────────── */}
          <section id="design" style={{ paddingTop: '2rem', paddingBottom: '5rem', scrollMarginTop: '80px' }}>
            <SectionLabel>Design</SectionLabel>
            <h2 style={{
              fontFamily: 'var(--serif)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 400, lineHeight: 1.15, color: 'var(--ink)',
              letterSpacing: '-0.01em', marginBottom: '1.25rem', maxWidth: 900,
            }}>
              From Research to Roadmap
            </h2>
            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
              color: '#1a1a1a', lineHeight: 1.7, maxWidth: 900, marginBottom: '4rem',
            }}>
              The archetypes directly shaped three design outcomes — each one addressing a pattern we heard consistently across our farmer conversations.
            </p>

            {/* ── Design outcome 1: Enable Easier Access to Funds ── */}
            <div style={{ marginBottom: '5rem' }}>
              <h3 style={{
                fontFamily: 'var(--serif)', fontSize: '1.5rem',
                fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2, marginBottom: '1rem',
              }}>
                1. Enable Easier Access to Funds
              </h3>

              <p style={{
                fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 300,
                color: '#1a1a1a', lineHeight: 1.7, maxWidth: 900, marginBottom: '1.25rem',
              }}>
                <strong style={{ fontWeight: 500 }}>Research finding —</strong> Across all four archetypes, farmers were frustrated by how slow the operating line process was — especially in time-sensitive moments like cattle auctions or co-op discounts. Waiting days to access funds meant missing opportunities.
              </p>

              <p style={{
                fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 300,
                color: '#1a1a1a', lineHeight: 1.7, maxWidth: 900, marginBottom: '2.5rem',
              }}>
                <strong style={{ fontWeight: 500 }}>What we designed —</strong> We digitized the bank account linkage and fund request process, eliminating DocuSign entirely. Farmers can now link their bank account in under 3 minutes and request draws anytime through the app.
              </p>

              {/* Before/after: Setting up Direct Deposit */}
              <h4 className="text-center" style={{
                fontFamily: 'var(--sans)', fontSize: '0.8rem',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--terracotta)', fontWeight: 800,
                marginTop: '4rem', marginBottom: '1.5rem',
              }}>
                Setting up Direct Deposit
              </h4>

              {/* Image comparison */}
              <div className="before-after-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2.5rem', alignItems: 'start' }}>

                {/* Before — full-width document */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{
                    display: 'inline-block',
                    background: '#F0EBE4', color: '#6B5040',
                    fontFamily: 'var(--sans)', fontSize: '0.6rem',
                    fontWeight: 600, letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 999,
                    marginBottom: '0.75rem',
                  }}>
                    Before
                  </span>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 300, color: '#1a1a1a', lineHeight: 1.6, marginBottom: '1rem', textAlign: 'center' }}>
                    A DocuSign is emailed to the farmer and the loan team needs to manually verify the bank info — takes up to{' '}
                    <span style={{ position: 'relative', display: 'inline-block', fontWeight: 500 }}>
                      5 business days
                      <svg aria-hidden="true" viewBox="0 0 100 5" preserveAspectRatio="none"
                        style={{ position: 'absolute', bottom: -2, left: 0, width: '100%', height: 5, overflow: 'visible' }}>
                        <path d="M0,2.5 C20,0.5 40,4.5 60,2.5 C80,0.5 90,4 100,2.5"
                          fill="none" stroke="#B05A2B" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>.
                  </p>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <WobblyBorder strokeColor="#CCCCCC" />
                    <img
                      src="/case studies/fbn finance archetypes/direct deposit - before.png"
                      alt="DocuSign form for bank account setup"
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </div>
                </div>

                {/* After — centered phone GIF */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{
                    display: 'inline-block',
                    background: '#C5CEA0', color: '#4A5E35',
                    fontFamily: 'var(--sans)', fontSize: '0.6rem',
                    fontWeight: 600, letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 999,
                    marginBottom: '0.75rem',
                  }}>
                    After
                  </span>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 300, color: '#1a1a1a', lineHeight: 1.6, marginBottom: '1rem', textAlign: 'center' }}>
                    Farmer can link their bank account on the FBN app in under{' '}
                    <span style={{ position: 'relative', display: 'inline-block', fontWeight: 500 }}>
                      3 minutes
                      <svg aria-hidden="true" viewBox="0 0 100 5" preserveAspectRatio="none"
                        style={{ position: 'absolute', bottom: -2, left: 0, width: '100%', height: 5, overflow: 'visible' }}>
                        <path d="M0,2.5 C20,0.5 40,4.5 60,2.5 C80,0.5 90,4 100,2.5"
                          fill="none" stroke="#B05A2B" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>.
                  </p>
                  <div style={{ width: 290 }}>
                    <img
                      src="/case studies/fbn finance archetypes/direct deposit - after.gif"
                      alt="Bank account linking flow in the FBN app"
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </div>
                </div>

              </div>{/* end before-after-cols grid */}

              {/* Before/after: Requesting Draws */}
              <h4 className="text-center" style={{
                fontFamily: 'var(--sans)', fontSize: '0.8rem',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--terracotta)', fontWeight: 800,
                marginTop: '4rem', marginBottom: '1.5rem',
              }}>
                Requesting Draws
              </h4>

              <div className="before-after-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '0.5rem', alignItems: 'start' }}>

                {/* Before — full-width document */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{
                    display: 'inline-block',
                    background: '#F0EBE4', color: '#6B5040',
                    fontFamily: 'var(--sans)', fontSize: '0.6rem',
                    fontWeight: 600, letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 999,
                    marginBottom: '0.75rem',
                  }}>
                    Before
                  </span>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 300, color: '#1a1a1a', lineHeight: 1.6, marginBottom: '1rem', textAlign: 'center' }}>
                    Farmer needs to fill out a DocuSign every time they need access to funds, and the loan team needs to manually review it — often processed late during the busy season.
                  </p>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <WobblyBorder strokeColor="#CCCCCC" />
                    <img
                      src="/case studies/fbn finance archetypes/draw - before.png"
                      alt="DocuSign form for requesting a draw"
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </div>
                </div>

                {/* After — centered phone GIF */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{
                    display: 'inline-block',
                    background: '#C5CEA0', color: '#4A5E35',
                    fontFamily: 'var(--sans)', fontSize: '0.6rem',
                    fontWeight: 600, letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 999,
                    marginBottom: '0.75rem',
                  }}>
                    After
                  </span>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 300, color: '#1a1a1a', lineHeight: 1.6, marginBottom: '1rem', textAlign: 'center' }}>
                    Farmer can now request draws through the app using a simplified digital form,{' '}
                    <span style={{ position: 'relative', display: 'inline-block', fontWeight: 500 }}>
                      anytime and anywhere
                      <svg aria-hidden="true" viewBox="0 0 100 5" preserveAspectRatio="none"
                        style={{ position: 'absolute', bottom: -2, left: 0, width: '100%', height: 5, overflow: 'visible' }}>
                        <path d="M0,2.5 C20,0.5 40,4.5 60,2.5 C80,0.5 90,4 100,2.5"
                          fill="none" stroke="#B05A2B" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>.
                  </p>
                  <div style={{ width: 290 }}>
                    <img
                      src="/case studies/fbn finance archetypes/draw - after.gif"
                      alt="Draw request flow in the FBN app"
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </div>
                </div>

              </div>{/* end before-after-cols grid */}

              <div style={{ textAlign: 'left', padding: '0', marginTop: '2rem' }}>
                <p style={{
                  fontFamily: 'var(--serif)', fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)',
                  fontStyle: 'italic', fontWeight: 400,
                  color: 'var(--terracotta)', lineHeight: 1.5,
                  marginBottom: '1rem', maxWidth: 900,
                }}>
                  ✦ Reduced fund access time from 5 business days to 2.
                </p>
                <svg width="220" height="8" viewBox="0 0 220 8" aria-hidden="true" style={{ display: 'block' }}>
                  <path
                    d="M4,5 C22,3 45,6 70,4.5 C95,3 118,6 142,4 C166,2.5 188,5.5 216,4"
                    fill="none" stroke="#B05A2B" strokeWidth="1.2" strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* ── Design outcome 2: Digital Payment Capability ── */}
            <div style={{ marginBottom: '5rem' }}>
              <h3 style={{
                fontFamily: 'var(--serif)', fontSize: '1.5rem',
                fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2, marginBottom: '1rem',
              }}>
                2. Digital Payment Capability
              </h3>

              <p style={{
                fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 300,
                color: '#1a1a1a', lineHeight: 1.7, maxWidth: 900, marginBottom: '1.25rem',
              }}>
                <strong style={{ fontWeight: 500 }}>Research finding —</strong> Paper check repayment was causing real financial harm. Lost checks went unnoticed for over a week. Inaccurate amounts meant back-and-forth corrections. Farmers were mailing multiple smaller checks just to avoid the anxiety of sending one large one.
              </p>

              <p style={{
                fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 300,
                color: '#1a1a1a', lineHeight: 1.7, maxWidth: 900, marginBottom: '2rem',
              }}>
                <strong style={{ fontWeight: 500 }}>What we designed —</strong> Using FBN's existing Stripe integration, I designed a digital payment flow that replaced the paper check process entirely — prioritizing simplicity, security, and real-time feedback so farmers could pay with confidence from anywhere.
              </p>

              <div style={{ width: '30%' }}>
                <img
                  src="/case studies/fbn finance archetypes/Digital Payment.gif"
                  alt="Digital payment flow"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>

              <div style={{ textAlign: 'left', padding: '0', marginTop: '2rem' }}>
                <p style={{
                  fontFamily: 'var(--serif)', fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)',
                  fontStyle: 'italic', fontWeight: 400,
                  color: 'var(--terracotta)', lineHeight: 1.5,
                  marginBottom: '1rem', maxWidth: 900,
                }}>
                  ✦ Payment processing reduced to 1 business day.
                </p>
                <svg width="220" height="8" viewBox="0 0 220 8" aria-hidden="true" style={{ display: 'block' }}>
                  <path
                    d="M4,5 C22,3 45,6 70,4.5 C95,3 118,6 142,4 C166,2.5 188,5.5 216,4"
                    fill="none" stroke="#B05A2B" strokeWidth="1.2" strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* ── Design outcome 3: Highlighting Agricultural Expertise ── */}
            <div style={{ marginBottom: '0' }}>
              <h3 style={{
                fontFamily: 'var(--serif)', fontSize: '1.5rem',
                fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2, marginBottom: '1rem',
              }}>
                3. Highlighting Agricultural Expertise
              </h3>

              {/* Research finding */}
              <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 300, color: '#1a1a1a', lineHeight: 1.7, maxWidth: 900, marginBottom: '1.25rem' }}>
                <strong style={{ fontWeight: 500 }}>Research finding —</strong> Three of our four archetypes expressed hesitation about working with lenders who didn't understand agriculture — specifically around challenges like weather-related delays affecting repayments. They trusted and preferred lenders who understood their world.
              </p>

              {/* What we designed */}
              <p style={{
                fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 300,
                color: '#444', lineHeight: 1.7, maxWidth: 900, marginBottom: '2rem',
              }}>
                <strong style={{ fontWeight: 500 }}>What we designed —</strong> Working with marketing, we surfaced FBN's agricultural expertise directly on the financing pages and created a dedicated loan team page where farmers could find and connect with their specific loan advisor — building trust from the very first touchpoint.
              </p>

              <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
                <WobblyBorder strokeColor="#1A1A1A" />
                <img
                  src="/case studies/fbn finance archetypes/loan agent.png"
                  alt="Loan agent page"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>

              <div style={{ textAlign: 'left', padding: '0', marginTop: '2rem' }}>
                <p style={{
                  fontFamily: 'var(--serif)', fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)',
                  fontStyle: 'italic', fontWeight: 400,
                  color: 'var(--terracotta)', lineHeight: 1.5,
                  marginBottom: '1rem', maxWidth: 900,
                }}>
                  ✦ Built early trust in the lending process, reinforcing FBN's positioning as an agriculture-first lender.
                </p>
                <svg width="220" height="8" viewBox="0 0 220 8" aria-hidden="true" style={{ display: 'block' }}>
                  <path
                    d="M4,5 C22,3 45,6 70,4.5 C95,3 118,6 142,4 C166,2.5 188,5.5 216,4"
                    fill="none" stroke="#B05A2B" strokeWidth="1.2" strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </section>

          {/* ── Next case study ───────────────────────────────────────────── */}
          <div style={{
            borderTop: '1px solid #EBEBEB',
            padding: '3rem 0 5rem',
            display: 'flex', justifyContent: 'flex-end',
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
                Next
              </span>
              Digital Loan Application →
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

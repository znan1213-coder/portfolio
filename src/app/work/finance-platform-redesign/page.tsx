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

// ── Bullet ────────────────────────────────────────────────────────────────────
function Bullet() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" style={{ flexShrink: 0, marginTop: 3 }}>
      <path d="M1,5 C2.5,4 4,5.5 5,4.8 C6,4.1 7.5,5.2 9,5"
        fill="none" stroke="#B05A2B" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

// ── Wobbly pill border ────────────────────────────────────────────────────────
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

// ── Final Design tab component ────────────────────────────────────────────────
const SLIDE_CSS = `
  @keyframes slideLeftIn  { from { transform: translateX(60px);  opacity: 0 } to { transform: translateX(0); opacity: 1 } }
  @keyframes slideRightIn { from { transform: translateX(-60px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
`

const FD_TABS = ['Dashboard', 'Navigation', 'Layout']

function FinalDesignTabs() {
  const [activeTab, setActiveTab] = useState(0)
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

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '3rem' }}>
        {FD_TABS.map((label, i) => {
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

      <div style={{ overflow: 'hidden' }}>
        <div key={animKey} style={{ animation: `${animName} 320ms ease-in-out both` }}>

          {activeTab === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
              <div>
                <div role="img" aria-label="Dashboard before" style={{ position: 'relative', width: '100%', maxWidth: 800, height: 500, background: '#e8e8e8', marginBottom: '1rem' }}>
                  <WobblyBorder strokeColor="#CCCCCC" />
                </div>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 300, color: '#444', lineHeight: 1.7, margin: 0, maxWidth: 900 }}>
                  The original dashboard rendered every run as an undifferentiated list, with no way to filter or prioritize. Users maintained a separate Excel sheet to track what actually mattered to them.
                </p>
              </div>
              <div>
                <div role="img" aria-label="Dashboard after" style={{ position: 'relative', width: '100%', maxWidth: 800, height: 500, background: '#e8e8e8', marginBottom: '1rem' }}>
                  <WobblyBorder strokeColor="#CCCCCC" />
                </div>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 300, color: '#444', lineHeight: 1.7, margin: 0, maxWidth: 900 }}>
                  The redesigned dashboard surfaces the runs and data statuses users actually care about, eliminating the need for the Excel workaround and giving analysts a meaningful starting point each session.
                </p>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
              <div>
                <div role="img" aria-label="Navigation concept exploration" style={{ position: 'relative', width: '100%', maxWidth: 800, height: 500, background: '#e8e8e8', marginBottom: '1rem' }}>
                  <WobblyBorder strokeColor="#CCCCCC" />
                </div>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 300, color: '#444', lineHeight: 1.7, margin: 0, maxWidth: 900 }}>
                  Early concepts explored how to represent the hierarchical relationships between data layers — the core challenge was making dependencies legible without adding steps.
                </p>
              </div>
              <div>
                <div role="img" aria-label="Navigation final design" style={{ position: 'relative', width: '100%', maxWidth: 800, height: 500, background: '#e8e8e8', marginBottom: '1rem' }}>
                  <WobblyBorder strokeColor="#CCCCCC" />
                </div>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 300, color: '#444', lineHeight: 1.7, margin: 0, maxWidth: 900 }}>
                  The final navigation gives analysts a clear sense of where they are within the data hierarchy and how layers relate, reducing the clicking and reorientation that characterized the old experience.
                </p>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
              <div>
                <div role="img" aria-label="Layout before" style={{ position: 'relative', width: '100%', maxWidth: 800, height: 500, background: '#e8e8e8', marginBottom: '1rem' }}>
                  <WobblyBorder strokeColor="#CCCCCC" />
                </div>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 300, color: '#444', lineHeight: 1.7, margin: 0, maxWidth: 900 }}>
                  The original layout didn&rsquo;t account for the large-monitor, data-dense environment analysts work in — leaving significant screen real estate unused.
                </p>
              </div>
              <div>
                <div role="img" aria-label="Layout after" style={{ position: 'relative', width: '100%', maxWidth: 800, height: 500, background: '#e8e8e8', marginBottom: '1rem' }}>
                  <WobblyBorder strokeColor="#CCCCCC" />
                </div>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9375rem', fontWeight: 300, color: '#444', lineHeight: 1.7, margin: 0, maxWidth: 900 }}>
                  The new layout is designed for the actual context of use — responsive to larger screens and structured to surface more data without adding cognitive load.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

// ── Nav sections ──────────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  { id: 'background',          label: 'Background' },
  { id: 'opportunity',         label: 'Opportunity' },
  { id: 'research-planning',   label: 'Research & Planning' },
  { id: 'what-we-found',       label: 'What We Found' },
  { id: 'approach',            label: 'Approach' },
  { id: 'final-design',        label: 'Final Design' },
  { id: 'outcome',             label: 'Outcome' },
]

// ── Page ──────────────────────────────────────────────────────────────────────
export default function FinancePlatformRedesign() {
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
      <div style={{ background: '#B0C4D4', borderBottom: '1px solid #9DB4C6', paddingTop: 56, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Text block — flex-grows to fill remaining height, centers content vertically */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <div className="hero-wrapper" style={{ maxWidth: 1200, width: '100%', margin: '0 auto', paddingLeft: '3rem', paddingRight: '3rem' }}>
            <section id="overview" className="hero-section text-center" style={{ paddingTop: '2rem', paddingBottom: '2rem', scrollMarginTop: '90px' }}>
              <div className="max-w-2xl mx-auto">
                {/* Meta pills */}
                <div className="hero-tags flex flex-wrap gap-2" style={{ marginBottom: '2rem', justifyContent: 'center' }}>
                  {['Enterprise · Web Design', 'Capital One', 'Internal Tool'].map(tag => (
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
                  Finance Platform Redesign
                </h1>

                <p className="hero-subtitle" style={{
                  fontFamily: 'var(--sans)', fontSize: '1.075rem', fontWeight: 300,
                  color: '#1a1a1a', lineHeight: 1.7, marginBottom: '2rem',
                }}>
                  Turning a visual refresh request into a research-driven redesign, and shipping results that transformed how Capital One finance analysts work.
                </p>

                {/* Project metadata */}
                <div className="meta-row" style={{
                  display: 'grid', gridTemplateColumns: 'repeat(3, auto)', justifyContent: 'center',
                  gap: '0 3rem', marginBottom: 0, textAlign: 'left',
                }}>
                  {[
                    { label: 'Role', value: 'Solo Designer — UX research, interaction design, usability testing' },
                    { label: 'Team', value: 'Engineering, Product' },
                    { label: 'Timeline', value: '2024' },
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

        {/* Cover image anchored at the bottom */}
        <div className="hero-wrapper" style={{ maxWidth: 1200, width: '100%', margin: '0 auto', paddingLeft: '3rem', paddingRight: '3rem', paddingBottom: '3rem' }}>
          <div className="hero-cover" style={{ width: '80%', overflow: 'hidden', borderRadius: '0.75rem', margin: '0 auto' }}>
            <img
              src="/case%20studies/finance%20platform%20redesign/hero.png"
              alt="Finance Platform Redesign hero"
              style={{ width: '100%', height: 'auto', display: 'block' }}
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
              Background
            </h2>

            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
              color: '#1a1a1a', lineHeight: 1.75, maxWidth: 900, marginBottom: '2.5rem',
            }}>
              Finance Platform is an internal tool used by Capital One finance and data analysts to transform and manage data across early critical steps in a larger multi-step pipeline, work that ultimately feeds into forecasting, reporting, and financial planning at scale.
            </p>

            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
              color: '#1a1a1a', lineHeight: 1.75, maxWidth: 900, marginBottom: '2.5rem',
            }}>
              The tool had been in use for years. It worked fine. But the bar for internal tools at large organizations is often just &ldquo;good enough to get through the day,&rdquo; and Finance Platform had accumulated years of usability debt that users had quietly worked around.
            </p>

            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
              color: '#1a1a1a', lineHeight: 1.75, maxWidth: 900, marginBottom: '1.5rem',
            }}>
              When a backend overhaul created a rare window for a design intervention, I made sure we used it well.
            </p>
          </section>

          <WobblyHRule />

          {/* ── Opportunity ───────────────────────────────────────────────── */}
          <section id="opportunity" style={{ paddingTop: '2rem', paddingBottom: '5rem', scrollMarginTop: '80px' }}>
            <SectionLabel>Opportunity</SectionLabel>
            <h2 style={{
              fontFamily: 'var(--serif)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 400, lineHeight: 1.15, color: 'var(--ink)',
              letterSpacing: '-0.01em', marginBottom: '1.25rem', maxWidth: 900,
            }}>
              The Opportunity
            </h2>

            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
              color: '#1a1a1a', lineHeight: 1.75, maxWidth: 900, marginBottom: '1.75rem',
            }}>
              It started as a visual refresh.
            </p>

            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
              color: '#1a1a1a', lineHeight: 1.75, maxWidth: 900, marginBottom: '1.75rem',
            }}>
              The ask that came to design was straightforward: the platform was getting a backend overhaul, and the team wanted to clean up the UI to match. Make it look better, use the most updated design system.
            </p>

            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
              color: '#1a1a1a', lineHeight: 1.75, maxWidth: 900, marginBottom: '1.75rem',
            }}>
              I asked for one week before we started designing anything.
            </p>

            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
              color: '#1a1a1a', lineHeight: 1.75, maxWidth: 900, marginBottom: '1.75rem',
            }}>
              Within that week, I ran an audit of the existing experience and conducted 2 contextual inquiry sessions with real users, watching them work through their actual tasks in their actual environment. I also recorded clips of those sessions and brought them to stakeholders.
            </p>

            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
              color: '#1a1a1a', lineHeight: 1.75, maxWidth: 900, marginBottom: '1.75rem',
            }}>
              Seeing users navigate the platform in real time, including the clicking, the workarounds, the friction, speaks better than a synthesis deck. After stakeholders saw it themselves, the conversation shifted from &ldquo;how it looks&rdquo; to &ldquo;how it works.&rdquo;
            </p>

            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
              color: '#1a1a1a', lineHeight: 1.75, maxWidth: 900, marginBottom: '1.5rem',
            }}>
              Eventually we aligned on the actual timeline requirements, scoped the work, and got buy-in for a proper redesign instead of a facelift.
            </p>
          </section>

          <WobblyHRule />

          {/* ── Research & Planning ───────────────────────────────────────── */}
          <section id="research-planning" style={{ paddingTop: '2rem', paddingBottom: '5rem', scrollMarginTop: '80px' }}>
            <SectionLabel>Research &amp; Planning</SectionLabel>
            <h2 style={{
              fontFamily: 'var(--serif)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 400, lineHeight: 1.15, color: 'var(--ink)',
              letterSpacing: '-0.01em', marginBottom: '1.25rem', maxWidth: 900,
            }}>
              Research &amp; Planning
            </h2>

            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
              color: '#1a1a1a', lineHeight: 1.75, maxWidth: 900, marginBottom: '1.75rem',
            }}>
              With buy-in secured, I built a design plan around the technical timeline and engineering constraints. Given the complexity of the platform and the pace of the backend work, I made sure to be deliberate about sequencing — what to research, what to design, and when.
            </p>

            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
              color: '#1a1a1a', lineHeight: 1.75, maxWidth: 900, marginBottom: '1.5rem',
            }}>
              A tool this layered and high-stakes required coverage across all three user types before I could be confident in what we were solving for. So I expanded the research to include a broader set of contextual inquiries covering:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', maxWidth: 900 }}>
              {[
                'Power users who lived in the tool daily and had developed deep workarounds',
                'General users with more occasional workflows',
                'Managers who needed visibility into the work their teams were doing',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'baseline' }}>
                  <Bullet />
                  <p style={{ fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300, color: '#1a1a1a', lineHeight: 1.7, margin: 0 }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <WobblyHRule />

          {/* ── What We Found ─────────────────────────────────────────────── */}
          <section id="what-we-found" style={{ paddingTop: '2rem', paddingBottom: '5rem', scrollMarginTop: '80px' }}>
            <SectionLabel>What We Found</SectionLabel>
            <h2 style={{
              fontFamily: 'var(--serif)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 400, lineHeight: 1.15, color: 'var(--ink)',
              letterSpacing: '-0.01em', marginBottom: '2rem', maxWidth: 900,
            }}>
              What We Found
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: 900 }}>
              <div>
                <h3 style={{
                  fontFamily: 'var(--serif)', fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                  fontWeight: 400, lineHeight: 1.2, color: 'var(--ink)',
                  letterSpacing: '-0.01em', marginBottom: '1rem',
                }}>
                  A dashboard that wasn&rsquo;t doing its job
                </h3>
                <p style={{
                  fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
                  color: '#1a1a1a', lineHeight: 1.75, margin: 0,
                }}>
                  The dashboard, ideally the place where users get oriented and see what needs their attention, was rendered as a massive undifferentiated list of runs for all users. It wasn&rsquo;t surfacing what mattered most based on user role. In fact, they created a separate Excel spreadsheet to track the specific data they actually cared about. A user-maintained workaround is one of the clearest signals that a feature has failed.
                </p>
              </div>

              <div>
                <h3 style={{
                  fontFamily: 'var(--serif)', fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                  fontWeight: 400, lineHeight: 1.2, color: 'var(--ink)',
                  letterSpacing: '-0.01em', marginBottom: '1rem',
                }}>
                  Navigation through dependent data layers
                </h3>
                <p style={{
                  fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
                  color: '#1a1a1a', lineHeight: 1.75, margin: 0,
                }}>
                  Finance Platform manages multiple layers of hierarchical data where each layer depends on the one above it. But the interface gave users no efficient way to move between those layers or use them as reference when needed. Finding, comparing, and managing related data meant clicking through multiple levels with no shortcuts and no sense of location. Users were losing time just orienting themselves.
                </p>
              </div>

              <div>
                <h3 style={{
                  fontFamily: 'var(--serif)', fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                  fontWeight: 400, lineHeight: 1.2, color: 'var(--ink)',
                  letterSpacing: '-0.01em', marginBottom: '1rem',
                }}>
                  A layout that didn&rsquo;t match the environment
                </h3>
                <p style={{
                  fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
                  color: '#1a1a1a', lineHeight: 1.75, margin: 0,
                }}>
                  Finance analysts work on large monitors with data-dense workflows. The existing layout wasn&rsquo;t designed for that context — it wasted screen real estate and forced users to work harder to see what they needed.
                </p>
              </div>
            </div>
          </section>

          <WobblyHRule />

          {/* ── Approach ──────────────────────────────────────────────────── */}
          <section id="approach" style={{ paddingTop: '2rem', paddingBottom: '5rem', scrollMarginTop: '80px' }}>
            <SectionLabel>Approach</SectionLabel>
            <h2 style={{
              fontFamily: 'var(--serif)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 400, lineHeight: 1.15, color: 'var(--ink)',
              letterSpacing: '-0.01em', marginBottom: '1.25rem', maxWidth: 900,
            }}>
              Approach
            </h2>

            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
              color: '#1a1a1a', lineHeight: 1.75, maxWidth: 900, marginBottom: '1.75rem',
            }}>
              This project had a different rhythm than a typical corporate engagement. The team operated more like a startup — frequent working sessions, fast decisions, and fewer formal sign-offs. As the solo designer, I had significant ownership over the direction while staying in close collaboration with engineering and product to move quickly.
            </p>

            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
              color: '#1a1a1a', lineHeight: 1.75, maxWidth: 900, marginBottom: '1.75rem',
            }}>
              The design focused on three things: rebuilding the dashboard around the data statuses users actually needed to track, restructuring navigation to match how the data actually relates, and redesigning the layout to take advantage of the monitor environment analysts work in.
            </p>

            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
              color: '#1a1a1a', lineHeight: 1.75, maxWidth: 900, marginBottom: '1.5rem',
            }}>
              Testing was built into every major milestone. At each significant concept stage, I brought work back to users to pressure-test the direction before investing further — catching misalignments early when they were cheapest to fix. Then again at hi-fi, I ran usability testing to validate that the interactions held up under real task conditions. For a tool this complex, with users this experienced, that feedback loop was essential.
            </p>
          </section>

          <WobblyHRule />

          {/* ── Final Design ──────────────────────────────────────────────── */}
          <section id="final-design" style={{ paddingTop: '2rem', paddingBottom: '5rem', scrollMarginTop: '80px' }}>
            <SectionLabel>Final Design</SectionLabel>
            <h2 style={{
              fontFamily: 'var(--serif)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 400, lineHeight: 1.15, color: 'var(--ink)',
              letterSpacing: '-0.01em', marginBottom: '2.5rem', maxWidth: 900,
            }}>
              Final Design
            </h2>
            <FinalDesignTabs />
          </section>

          <WobblyHRule />

          {/* ── Outcome ───────────────────────────────────────────────────── */}
          <section id="outcome" style={{ paddingTop: '2rem', paddingBottom: '5rem', scrollMarginTop: '80px' }}>
            <SectionLabel>Outcome</SectionLabel>
            <h2 style={{
              fontFamily: 'var(--serif)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 400, lineHeight: 1.15, color: 'var(--ink)',
              letterSpacing: '-0.01em', marginBottom: '1.25rem', maxWidth: 900,
            }}>
              The Results
            </h2>

            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
              color: '#1a1a1a', lineHeight: 1.75, maxWidth: 900, marginBottom: '3.5rem',
            }}>
              The bi-annual product survey results came in mid-migration — not ideal timing, with active bug-bashing and a learning curve for users adjusting to the new backend.
            </p>

            <div className="stat-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: '3.5rem' }}>
              {[
                { stat: '60', detail: 'NPS — up from 8 in April 2025' },
                { stat: '50', detail: 'OSAT — up from 23 in April 2025' },
                { stat: '80', detail: 'Ease of Use' },
                { stat: '86', detail: 'UMUX Lite' },
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

            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
              color: '#1a1a1a', lineHeight: 1.75, maxWidth: 900,
            }}>
              These scores arrived while the product was still mid-rollout. The redesign didn&rsquo;t just improve the experience — it made a case for what design can do for internal tools that have long been treated as a lower priority.
            </p>
          </section>

          {/* ── Prev / Next ───────────────────────────────────────────────── */}
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
              borderBottom: '1px solid transparent', paddingBottom: '2px',
              transition: 'border-color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--terracotta)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
            >
              <span style={{ fontFamily: 'var(--serif)', fontSize: '0.95rem', fontStyle: 'italic', color: '#999', marginRight: '0.25rem' }}>Prev</span>
              ← Digital Loan Application
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

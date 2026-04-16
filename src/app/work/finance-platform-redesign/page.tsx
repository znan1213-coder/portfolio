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

// ── Nav sections ──────────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  { id: 'context',       label: 'Context' },
  { id: 'approach',      label: 'Approach' },
  { id: 'design-pillars', label: 'Design Pillars' },
  { id: 'final-design',  label: 'Final Design' },
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
                  Redesigning an internal enterprise tool to centralize workflows, modernize the UI, and improve usability for Finance and Data users at Capital One.
                </p>

                {/* Project metadata */}
                <div className="meta-row" style={{
                  display: 'grid', gridTemplateColumns: 'repeat(3, auto)', justifyContent: 'center',
                  gap: '0 3rem', marginBottom: 0, textAlign: 'left',
                }}>
                  {[
                    { label: 'Role', value: 'Product Designer — UX audit, interaction design, design systems' },
                    { label: 'Team', value: 'Design, Product, Engineering, Research' },
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
              The Problem Space
            </h2>

            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
              color: '#1a1a1a', lineHeight: 1.75, maxWidth: 900, marginBottom: '2.5rem',
            }}>
              Finance Platform is an internal enterprise tool that enables Finance and Data users to onboard, manage, process, and monitor critical financial datasets across Capital One.
            </p>

            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
              color: '#1a1a1a', lineHeight: 1.75, maxWidth: 900, marginBottom: '1.5rem',
            }}>
              Before the redesign, users faced four key pain points:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', maxWidth: 900 }}>
              {[
                { label: 'Fragmented workflows', desc: 'Finance secrets were managed outside the platform, causing disconnected workflows.' },
                { label: 'Navigation & usability friction', desc: 'Known usability issues made it difficult for users to locate and manage workflows efficiently.' },
                { label: 'Inconsistent design system', desc: 'The legacy platform did not align with Gravity and enterprise UI standards.' },
                { label: 'Non-responsive layout', desc: 'The interface did not adapt to larger screens or data-dense workflows, reducing efficiency.' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: '0.75rem', alignItems: 'baseline' }}>
                  <Bullet />
                  <p style={{ fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300, color: '#1a1a1a', lineHeight: 1.7, margin: 0 }}>
                    <strong style={{ fontWeight: 500 }}>{item.label}</strong> — {item.desc}
                  </p>
                </div>
              ))}
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
              How We Worked
            </h2>

            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
              color: '#1a1a1a', lineHeight: 1.75, maxWidth: 900, marginBottom: '1.75rem',
            }}>
              This redesign was part of a broader efficiency initiative where engineering re-architected the backend. The design team used this opportunity to centralize secret management, align the UI with the new architecture, and modernize the experience using Gravity and XMod.
            </p>

            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
              color: '#1a1a1a', lineHeight: 1.75, maxWidth: 900, marginBottom: '1.5rem',
            }}>
              We adopted an agile, user-centered approach:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', marginBottom: '3.5rem', maxWidth: 900 }}>
              {[
                'Conducted a holistic UX audit and stakeholder interviews to identify friction points.',
                'Partnered with product to phase scope and prioritize highest-impact areas.',
                'Used low-fidelity prototyping to align early and reduce design churn.',
                'Ran rapid concept tests with key user groups before investing in high-fidelity design.',
                'Established a recurring feedback loop across design, engineering, and product.',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'baseline' }}>
                  <Bullet />
                  <p style={{ fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300, color: '#1a1a1a', lineHeight: 1.7, margin: 0 }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>

            {/* Sub-section: Collaboration */}
            <h3 style={{
              fontFamily: 'var(--serif)', fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
              fontWeight: 400, lineHeight: 1.2, color: 'var(--ink)',
              letterSpacing: '-0.01em', marginBottom: '1.25rem', maxWidth: 900,
            }}>
              Collaboration &amp; Ways of Working
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', maxWidth: 900 }}>
              {[
                { label: 'Design × Product', desc: 'Scoped and prioritized work through rapid prototyping and review cycles.' },
                { label: 'Design × Engineering', desc: 'Defined reusable UI patterns and collaborated in refinement sessions to reduce ambiguity.' },
                { label: 'Shared Rituals', desc: 'Weekly critiques, refinement sessions, ad-hoc co-working, and QA sessions.' },
                { label: 'Design × Research', desc: 'Consulted on testing methods to ensure solutions reflected real user needs.' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: '0.75rem', alignItems: 'baseline' }}>
                  <Bullet />
                  <p style={{ fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300, color: '#1a1a1a', lineHeight: 1.7, margin: 0 }}>
                    <strong style={{ fontWeight: 500 }}>{item.label}</strong> — {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <WobblyHRule />

          {/* ── Design Pillars ────────────────────────────────────────────── */}
          <section id="design-pillars" style={{ paddingTop: '2rem', paddingBottom: '5rem', scrollMarginTop: '80px' }}>
            <SectionLabel>Design Pillars</SectionLabel>
            <h2 style={{
              fontFamily: 'var(--serif)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 400, lineHeight: 1.15, color: 'var(--ink)',
              letterSpacing: '-0.01em', marginBottom: '1.25rem', maxWidth: 900,
            }}>
              Guiding Principles
            </h2>

            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
              color: '#1a1a1a', lineHeight: 1.75, maxWidth: 900, marginBottom: '2.5rem',
            }}>
              These principles were shaped through early user interviews, experience audits, and partner alignment — and served as anchors throughout the redesign.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: 900 }}>
              {[
                {
                  number: '1.',
                  label: 'Clarity & Data-Driven Efficiency',
                  desc: 'Simplify complex data layers and surface what matters most to help users make faster, confident decisions.',
                },
                {
                  number: '2.',
                  label: 'Trust & Transparency',
                  desc: 'Reinforce user confidence by providing guidance and clear feedback when managing and processing financial datasets.',
                },
                {
                  number: '3.',
                  label: 'Unified & Scalable Foundations',
                  desc: 'Establish an extensible design framework built on Gravity and reusable patterns to enable intuitive, self-service workflows.',
                },
              ].map(item => (
                <div key={item.label}>
                  <h3 style={{
                    fontFamily: 'var(--serif)', fontSize: '1.5rem',
                    fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2, marginBottom: '0.6rem',
                  }}>
                    {item.number} {item.label}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
                    color: '#1a1a1a', lineHeight: 1.75, margin: 0,
                  }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <WobblyHRule />

          {/* ── Final Design ──────────────────────────────────────────────── */}
          <section id="final-design" style={{ paddingTop: '2rem', paddingBottom: '5rem', scrollMarginTop: '80px' }}>
            <SectionLabel>Final Design</SectionLabel>
            <h2 style={{
              fontFamily: 'var(--serif)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 400, lineHeight: 1.15, color: 'var(--ink)',
              letterSpacing: '-0.01em', marginBottom: '1.25rem', maxWidth: 900,
            }}>
              Final Design
            </h2>
            <p style={{
              fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
              color: '#999', lineHeight: 1.75, maxWidth: 900, fontStyle: 'italic',
            }}>
              High-fidelity designs and annotated specs coming soon.
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

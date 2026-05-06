'use client'

import { useEffect, useRef, useState } from 'react'
import Nav from './components/Nav'

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

function WobblyBorder() {
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
      {path && <path d={path} fill="none" stroke="#1A1A1A" strokeWidth="1"
        strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  )
}


// ── Projects ──────────────────────────────────────────────────────────────────
const projects = [
  {
    id: 1,
    category: 'AgTech · End-to-End',
    title: 'Digital Loan Application',
    description: 'From paper forms to a fully self-serve digital loan experience.',
    bg: '#E8EDE8',
    image: '/case%20studies/digital%20loan%20application/Cover.png',
    href: '/work/digital-loan-application',
  },
  {
    id: 2,
    category: 'Enterprise · Web Design',
    title: 'Finance Platform Redesign',
    description: 'Redesigning an internal enterprise tool to centralize workflows, modernize the UI, and improve usability for Finance and Data users at Capital One.',
    bg: '#B0C4D4',
    image: '/case%20studies/finance%20platform%20redesign/hero.png',
    imageFill: true,
    imagePadding: '1.5rem 1.5rem 0',
    imageAlign: 'flex-end',
    imagePosition: 'bottom',
    imageTranslateY: '20px',
    href: '/work/finance-platform-redesign',
  },
  {
    id: 3,
    category: 'AgTech · Research',
    title: "Research to Roadmap: Defining FBN's First Finance Archetypes",
    description: "How generative research closed a critical knowledge gap and became the foundation for FBN's finance design decisions.",
    bg: '#E8EDE8',
    image: '/case studies/fbn finance archetypes/Hero.png',
    imageFill: true,
    href: '/work/fbn-finance-archetypes',
  },
  {
    id: 4,
    category: 'Fintech · Web · Data Visualization',
    title: 'Bank Reconciliation',
    description: 'Redesigning the bank reconciliation feature that cut reconcile time by 35%.',
    bg: '#DAE0E5',
    image: '/case studies/bank reconciliation/cover.png',
    imageFill: true,
    href: 'https://www.figma.com/proto/2Kys8Q12zNKQzmreAhvLxr/Bank-Reconciliation?page-id=0%3A1&node-id=0-202&node-type=canvas&viewport=2285%2C258%2C0.13&t=iULq9RIBfJr5Vadz-1&scaling=contain&content-scaling=fixed',
    target: '_blank',
  },
]

function CaseStudyCard({ project }: { project: typeof projects[number] }) {
  const [hovered, setHovered] = useState(false)
  const Tag = project.href ? 'a' : 'div'
  return (
    <Tag
      {...(project.href ? { href: project.href } : {})}
      {...(project.target ? { target: project.target, rel: 'noopener noreferrer' } : {})}
      className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'transform 0.45s ease, box-shadow 0.45s ease',
        transform: hovered ? 'translateY(-7px)' : 'translateY(0)',
        boxShadow: hovered ? '0 16px 48px rgba(0,0,0,0.07)' : '0 0 0 rgba(0,0,0,0)',
      }}>
      <WobblyBorder />
      {/* Thumbnail */}
      <div style={{
        position: 'relative', width: '100%', height: '280px', overflow: 'hidden',
        background: project.image ? (project.bg || '#E8EDE8') : project.bg,
        display: 'flex', alignItems: project.imageAlign ?? 'center', justifyContent: 'center',
        padding: project.imagePadding ?? (project.imageFill ? 0 : '2.5rem'), boxSizing: 'border-box',
      }}>
        {project.image ? (
          <img src={project.image} alt={project.title}
            style={{ width: '100%', height: '100%', objectFit: (project.imageFill && !project.imagePadding) ? 'cover' : 'contain', objectPosition: project.imagePosition ?? 'center', display: 'block', borderRadius: '0.5rem', transform: project.imageTranslateY ? `translateY(${project.imageTranslateY})` : undefined }} />
        ) : (
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.18,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }} />
        )}
      </div>
      <div style={{ padding: '1.5rem 1.5rem 1rem' }}>
        <p style={{
          fontFamily: 'var(--sans)',
          fontSize: '0.6rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase' as const,
          color: 'var(--terracotta)',
          marginBottom: '0.6rem',
        }}>
          {project.category}
        </p>
        <h3 style={{
          fontFamily: 'var(--serif)',
          fontSize: '1.25rem',
          fontWeight: 500,
          lineHeight: 1.3,
          color: 'var(--ink)',
          marginBottom: '0.5rem',
        }}>
          {project.title}
        </h3>
        <p style={{
          fontFamily: 'var(--sans)',
          fontSize: '0.875rem',
          color: '#222',
          lineHeight: 1.65,
          marginBottom: '0.75rem',
        }}>
          {project.description}
        </p>
        <span
          className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
          style={{
            display: 'inline-block',
            padding: '0.35rem 0.9rem',
            borderRadius: 999,
            background: 'var(--terracotta)',
            color: '#fff',
            fontFamily: 'var(--sans)',
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.02em',
          }}>
          Read more →
        </span>
      </div>
    </Tag>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const [catWobble, setCatWobble] = useState(0)
  const [catHovered, setCatHovered] = useState(false)

  useEffect(() => {
    const onScroll = () => setCatWobble(Math.sin(window.scrollY * 0.018) * 4)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
        @media (max-width: 767px) {
          .hero-section { padding: 5rem 1.5rem 2.5rem !important; }
          .hero-grid { gap: 1rem !important; }
          .hero-h1 { font-size: 2.5rem !important; margin-bottom: 0.75rem !important; }
          .hero-subtitle { margin-bottom: 1.25rem !important; }
          .hero-subtitle-text { font-size: 0.875rem !important; }
          .hero-bullet-text { font-size: 0.8rem !important; }
          .hero-cat { width: 120px !important; margin-left: 0 !important; }
        }
      `}</style>

      <Nav />

      {/* Hero */}
      <section className="hero-section" style={{ maxWidth: 1100, margin: '0 auto', padding: '7rem 2rem 5rem' }}>
        <div className="hero-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '2rem',
          alignItems: 'flex-end',
        }}>
          {/* Left */}
          <div>
            <h1 className="hero-h1" style={{
              fontFamily: 'var(--serif)',
              fontSize: '4rem',
              fontWeight: 400,
              lineHeight: 1.0,
              letterSpacing: '-0.01em',
              color: 'var(--ink)',
              marginBottom: '1.25rem',
            }}>
              Zhu Nan
            </h1>

            <div className="hero-subtitle" style={{ marginBottom: '2.75rem' }}>
              <p className="hero-subtitle-text" style={{
                fontFamily: 'var(--sans)',
                fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                fontWeight: 300,
                color: '#222',
                letterSpacing: '0.01em',
                display: 'inline-block',
              }}>
                Principal Product Designer
              </p>
            </div>


            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {[
                'Currently at Capital One, San Francisco',
                'Experience in Fintech, AgTech',
                '10 years of experience',
              ].map(line => (
                <div key={line} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  {/* Sketchy dash bullet */}
                  <svg width="14" height="8" viewBox="0 0 14 8" aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }}>
                    <path d="M1,5 C3,3.5 6,5.5 9,4 C11,3 12.5,4.5 13,4"
                      fill="none" stroke="#B05A2B" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  <p className="hero-bullet-text" style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '0.875rem',
                    fontWeight: 300,
                    color: '#222',
                    lineHeight: 1.6,
                    margin: 0,
                  }}>
                    {line}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — cat drawing */}
          <div className="hero-cat" style={{ width: 'clamp(160px, 22vw, 300px)', flexShrink: 0, marginLeft: '-5rem' }}>
            <img
              src="/two cats new.png"
              alt="Two cats"
              onMouseEnter={() => setCatHovered(true)}
              onMouseLeave={() => setCatHovered(false)}
              style={{
                width: '100%', height: 'auto', display: 'block',
                transform: catHovered ? undefined : `rotate(${catWobble}deg)`,
                transformOrigin: 'bottom center',
                transition: catHovered ? undefined : 'transform 0.3s ease-out',
                animation: catHovered ? 'wiggle 0.4s ease-in-out infinite' : undefined,
                cursor: 'pointer',
              }}
            />
          </div>
        </div>
      </section>

      {/* Work */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem 9rem' }}>
        <div style={{ marginBottom: '3rem', display: 'inline-block' }}>
          <h2 style={{
            fontFamily: 'var(--serif)',
            fontSize: '1rem',
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'var(--muted)',
            marginBottom: '0.4rem',
            letterSpacing: '0.01em',
          }}>
            Selected work
          </h2>
          <svg width="96" height="6" viewBox="0 0 96 6" aria-hidden="true" style={{ display: 'block' }}>
            <path
              d="M2,4 C14,2 28,5 42,3.5 C56,2 68,5 82,3 C88,2.5 92,4 94,3.5"
              fill="none" stroke="#C0AFA4" strokeWidth="1" strokeLinecap="round"
            />
          </svg>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 440px), 1fr))',
          gap: '2rem',
        }}>
          {projects.map(p => <CaseStudyCard key={p.id} project={p} />)}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #EBEBEB',
        maxWidth: 1100,
        margin: '0 auto',
        padding: '2rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap' as const,
        gap: '1rem',
      }}>
        <span style={{ fontFamily: 'var(--serif)', fontSize: '0.95rem', color: 'var(--ink)' }}>
          Zhu Nan
        </span>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[{ label: 'LinkedIn', href: '#' }, { label: 'Resume', href: '#' }].map(link => (
            <a key={link.label} href={link.href}
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '0.75rem',
                color: 'var(--muted)',
                textDecoration: 'none',
                letterSpacing: '0.06em',
                textTransform: 'uppercase' as const,
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--terracotta)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
            >
              {link.label}
            </a>
          ))}
        </div>
      </footer>

    </div>
  )
}

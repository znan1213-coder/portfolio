'use client'

import { useEffect, useRef, useState } from 'react'
import Nav from '../components/Nav'

// ── Wobbly circle border ──────────────────────────────────────────────────────
function WobblyCircle() {
  return (
    <svg viewBox="0 0 300 300" aria-hidden="true" style={{
      position: 'absolute', inset: '-4px', width: 'calc(100% + 8px)', height: 'calc(100% + 8px)',
      pointerEvents: 'none', overflow: 'visible', zIndex: 1,
    }}>
      <path
        d="M 150 4 C 204 1, 262 50, 288 106 C 314 162, 294 228, 250 262 C 204 298, 138 306, 86 278 C 32 250, 2 194, 4 142 C 6 84, 54 14, 112 4 C 126 2, 138 3, 150 4 Z"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ── Wobbly rect border ────────────────────────────────────────────────────────
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

function WobblyBorder({ color = '#1A1A1A' }: { color?: string }) {
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
      {path && <path d={path} fill="none" stroke={color} strokeWidth="1"
        strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  )
}

// ── Hand-drawn circle portrait ────────────────────────────────────────────────
function SketchPortrait() {
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
      <svg viewBox="0 0 300 300" width="100%" height="100%" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        {/* Slightly wobbly circle border */}
        <path
          d="M 150 28 C 196 24, 242 58, 264 102 C 288 150, 278 208, 242 244 C 206 280, 148 292, 100 272 C 50 250, 18 198, 22 148 C 26 94, 66 46, 112 32 C 124 28, 138 27, 150 28 Z"
          fill="#F0EBE4"
          stroke="#1A1A1A"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <text x="150" y="142" textAnchor="middle"
          style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, fill: '#C0AFA4' }}>
          photo
        </text>
        <text x="150" y="160" textAnchor="middle"
          style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, fill: '#C0AFA4' }}>
          coming soon
        </text>
      </svg>
    </div>
  )
}

// ── Yarn photo placeholder ────────────────────────────────────────────────────
function YarnPhoto({ bg, rotate = 0, label }: { bg: string; rotate?: number; label: string }) {
  return (
    <div style={{
      position: 'relative',
      transform: `rotate(${rotate}deg)`,
      flex: '1 1 0',
      minWidth: 0,
    }}>
      <WobblyBorder />
      <div style={{
        background: bg,
        aspectRatio: '4/5',
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.15,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />
        <span style={{
          position: 'absolute', bottom: '1rem', left: 0, right: 0,
          textAlign: 'center',
          fontFamily: 'var(--sans)',
          fontSize: '0.7rem',
          color: '#A89688',
          letterSpacing: '0.06em',
        }}>
          {label}
        </span>
      </div>
    </div>
  )
}

// ── Contact tag ───────────────────────────────────────────────────────────────
function ContactTag({ icon, label, href, rotate, bg, textColor, wobble = 0 }: {
  icon: React.ReactNode; label: string; href: string; rotate: number; bg: string; textColor: string; wobble?: number
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        padding: '0.85rem 1.4rem',
        background: bg,
        textDecoration: 'none',
        transform: hovered ? 'rotate(0deg) translateY(-3px)' : `rotate(${rotate + wobble}deg)`,
        transformOrigin: 'right center',
        boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.07)' : 'none',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      }}
    >
      <WobblyBorder />
      {icon}
      <span style={{
        fontFamily: 'var(--sans)', fontSize: '0.875rem',
        fontWeight: 400, color: textColor, letterSpacing: '0.01em',
      }}>
        {label}
      </span>
    </a>
  )
}

const EmailIcon = ({ color }: { color: string }) => (
  <svg width="14" height="11" viewBox="0 0 14 11" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M1 1 L13 1 L13 10 L1 10 Z" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1 1 L7 6.5 L13 1" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const PersonIcon = ({ color }: { color: string }) => (
  <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M6 1 C4 1 2.5 2.5 2.5 4.5 C2.5 6.5 4 8 6 8 C8 8 9.5 6.5 9.5 4.5 C9.5 2.5 8 1 6 1 Z" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    <path d="M1 13 C1 10.5 3 8.5 6 8.5 C9 8.5 11 10.5 11 13" stroke={color} strokeWidth="1" strokeLinecap="round"/>
  </svg>
)
const PageIcon = ({ color }: { color: string }) => (
  <svg width="11" height="14" viewBox="0 0 11 14" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M1.5 1 L7 1 L10 4 L10 13 L1.5 13 Z" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 1 L7 4 L10 4" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.5 6.5 L8 6.5 M3.5 8.5 L8 8.5 M3.5 10.5 L6 10.5" stroke={color} strokeWidth="0.8" strokeLinecap="round"/>
  </svg>
)

// ── Nav ───────────────────────────────────────────────────────────────────────
// ── Page ──────────────────────────────────────────────────────────────────────
export default function About() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const wobbleEmail    = Math.sin(scrollY * 0.012) * 3
  const wobbleLinkedIn = Math.sin(scrollY * 0.009 + 1.2) * 3
  const wobbleResume   = Math.sin(scrollY * 0.015 + 2.5) * 3

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Nav activePage="about" />

      {/* About — two column */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '7rem 2rem 5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr clamp(200px, 28%, 320px)',
          gap: '5rem',
          alignItems: 'stretch',
        }}>
          {/* Left */}
          <div>
            <h1 style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 400,
              lineHeight: 1.05,
              color: 'var(--ink)',
              marginBottom: '2.5rem',
              letterSpacing: '-0.01em',
            }}>
              About Me
            </h1>
            <p style={{
              fontFamily: 'var(--sans)',
              fontSize: '1rem',
              fontWeight: 300,
              color: '#222',
              lineHeight: 1.8,
              marginBottom: '1.5rem',
            }}>
              I&apos;m Zhu, a product designer in the Bay Area. I&apos;m currently designing on Capital One&apos;s Enterprise Finance team, where I focus on making complex workflows clearer and easier for our financial analysts to use every day.
            </p>
            <p style={{
              fontFamily: 'var(--sans)',
              fontSize: '1rem',
              fontWeight: 300,
              color: '#222',
              lineHeight: 1.8,
            }}>
              I started my career in startups, which taught me to move fast, be scrappy and stay close to users, and only design what truly matters. Working in a large enterprise has expanded that perspective — I&apos;ve learned how to design for scale, collaborate across many teams, and create solutions that last.
            </p>

            {/* Experience — inside left column so it sits naturally below bio */}
            <div style={{ marginTop: '3rem' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{
                  fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 400,
                  fontStyle: 'italic', color: '#555', marginBottom: '0.4rem', letterSpacing: '0.01em',
                }}>
                  Experience
                </h2>
                <svg width="80" height="6" viewBox="0 0 80 6" aria-hidden="true" style={{ display: 'block' }}>
                  <path d="M2,4 C12,2 22,5 34,3.5 C46,2 56,5 68,3 C72,2.5 76,4 78,3.5"
                    fill="none" stroke="#C0AFA4" strokeWidth="1" strokeLinecap="round" />
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                {[
                  { years: '2024 – Present', role: 'Principal Designer', company: 'Capital One' },
                  { years: '2021 – 2024', role: 'Senior Product Designer', company: 'Farmers Business Network' },
                  { years: '2015 – 2019', role: 'Product Designer', company: 'MegiChina' },
                  { years: '2013 – 2015', role: 'Visual Designer', company: 'Various Startups' },
                ].map(entry => (
                  <div key={entry.company} style={{ display: 'flex', gap: '3rem', alignItems: 'baseline' }}>
                    <span style={{
                      fontFamily: 'var(--sans)', fontSize: '0.825rem', color: '#8B4513',
                      letterSpacing: '0.05em', whiteSpace: 'nowrap', minWidth: 120,
                    }}>
                      {entry.years}
                    </span>
                    <div>
                      <span style={{ fontFamily: 'var(--serif)', fontSize: '1.15rem', fontWeight: 400, color: 'var(--ink)' }}>
                        {entry.role}
                      </span>
                      <span style={{ fontFamily: 'var(--sans)', fontSize: '0.875rem', fontWeight: 300, color: '#444', marginLeft: '0.6rem' }}>
                        @ {entry.company}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — portrait at top, tags float down alongside experience */}
          <div style={{ paddingTop: '0.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative' }}>
              <WobblyCircle />
              <img
                src="/my face.JPG"
                alt="Zhu Nan"
                style={{ width: '100%', height: 'auto', display: 'block', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '50%' }}
              />
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.9rem', alignItems: 'flex-end' }}>
              <ContactTag icon={<EmailIcon color="#8B6914" />} label="Email" href="mailto:zhu@example.com" rotate={-2} bg="#F2DFA0" textColor="#8B6914" wobble={wobbleEmail} />
              <ContactTag icon={<PersonIcon color="#4A5E35" />} label="LinkedIn" href="#" rotate={1.5} bg="#C5CEA0" textColor="#4A5E35" wobble={wobbleLinkedIn} />
              <ContactTag icon={<PageIcon color="#6B3D5E" />} label="Resume" href="#" rotate={-1} bg="#D4B8C7" textColor="#6B3D5E" wobble={wobbleResume} />
            </div>
          </div>
        </div>
      </section>

      {/* Yarn section */}
      <section style={{ background: '#FAF6F1', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(2rem, 4vw, 3.25rem)',
            fontWeight: 400,
            color: 'var(--ink)',
            marginBottom: '1.25rem',
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
          }}>
            I work so I can buy nice yarns
          </h2>
          <p style={{
            fontFamily: 'var(--sans)',
            fontSize: '0.95rem',
            fontWeight: 300,
            color: '#222',
            lineHeight: 1.8,
            maxWidth: 560,
            marginBottom: '3.5rem',
          }}>
            I am a wannabe knitwear designer. If you look into my bag, there&apos;s a good chance you&apos;ll find a work-in-progress knitting project in there.
          </p>

          <div style={{
            display: 'flex',
            gap: '1.5rem',
            alignItems: 'flex-end',
          }}>
            {[
              { src: '/about 1.jpg', rotate: -1.5 },
              { src: '/about 3.jpg', rotate: 0.8 },
              { src: '/about 2.JPG', rotate: -0.5 },
            ].map((photo) => (
              <div key={photo.src} style={{
                position: 'relative',
                transform: `rotate(${photo.rotate}deg)`,
                flex: '1 1 0',
                minWidth: 0,
              }}>
                <WobblyBorder />
                <img
                  src={photo.src}
                  alt=""
                  style={{ width: '100%', height: 'auto', display: 'block', aspectRatio: '4/5', objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #EBEBEB',
        maxWidth: 1100,
        margin: '0 auto',
        padding: '2rem',
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

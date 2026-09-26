'use client'

import { useEffect, useRef, useState } from 'react'

// ── Wobbly border (reused for dropdown) ───────────────────────────────────────
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

// ── Wobbly divider (hand-drawn line under the nav, content-width) ──────────────
function WobblyDivider() {
  const ref = useRef<SVGSVGElement>(null)
  const [vw, setVw] = useState(0)
  const [path, setPath] = useState('')
  const prev = useRef(0)

  useEffect(() => {
    if (!ref.current) return
    const update = () => {
      const { width: w } = ref.current!.getBoundingClientRect()
      const rw = Math.round(w)
      if (rw === prev.current) return
      prev.current = rw
      if (rw) {
        const wb = 1.4
        const n = Math.max(4, Math.floor(rw / 70))
        setPath('M 0 3' + seg(0, 3, rw, 3, wb, n))
        setVw(rw)
      }
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  return (
    <svg ref={ref} width="100%" height="6" viewBox={`0 0 ${vw || 1} 6`} preserveAspectRatio="none"
      aria-hidden="true" style={{ display: 'block' }}>
      {path && <path d={path} fill="none" stroke="var(--border)" strokeWidth="1"
        strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  )
}

// ── Case studies ──────────────────────────────────────────────────────────────
const CASE_STUDIES = [
  { title: 'Digital Loan Application',           href: '/work/digital-loan-application',   live: true  },
  { title: 'Finance Platform Redesign',           href: '/work/finance-platform-redesign',  live: true  },
  { title: "Define FBN's First Finance Archetype", href: '/work/fbn-finance-archetypes',    live: true  },
  { title: 'Bank Reconciliation',                 href: 'https://www.figma.com/proto/2Kys8Q12zNKQzmreAhvLxr/Bank-Reconciliation?page-id=0%3A1&node-id=0-202&node-type=canvas&viewport=2285%2C258%2C0.13&t=iULq9RIBfJr5Vadz-1&scaling=contain&content-scaling=fixed', live: true  },
  { title: 'Logo Design',                         href: '/work/logo-design',                live: true  },
]

const DROPDOWN_CSS = `
  @keyframes dropdownIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes overlayIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  /* Logo hover — each letter hops on its own when the cursor touches it */
  @keyframes logoHop {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    35%      { transform: translateY(-7px) rotate(-4deg); }
    60%      { transform: translateY(1px) rotate(2deg); }
  }
  .nav-logo-letter { display: inline-block; }
  .nav-logo-letter.is-hopping { animation: logoHop 480ms cubic-bezier(.3,.7,.4,1.4) both; }
  @media (prefers-reduced-motion: reduce) {
    .nav-logo-letter.is-hopping { animation: none; }
  }
  .nav-desktop-links { display: none; }
  .nav-hamburger { display: flex; }
  .nav-grid { column-gap: 1rem; }
  .nav-left { justify-self: start; }
  .nav-right { justify-self: end; }
  @media (min-width: 768px) {
    .nav-desktop-links { display: flex; }
    .nav-hamburger { display: none; }
    /* Desktop: Work and About sit snug on either side of the centered logo */
    .nav-grid { column-gap: 3rem; }
    .nav-left { justify-self: end; }
    .nav-right { justify-self: start; }
  }
`

function WorkDropdown({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <div style={{
      position: 'absolute',
      top: 'calc(100% + 10px)',
      left: 0,
      background: 'var(--background)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
      borderRadius: 6,
      padding: '0.4rem 0',
      minWidth: 300,
      zIndex: 200,
      animation: 'dropdownIn 200ms ease-in-out both',
    }}>
      <style>{DROPDOWN_CSS}</style>
      <WobblyBorder />
      {CASE_STUDIES.map((cs) => (
        <div key={cs.title}>
          {cs.live ? (
            <a href={cs.href} {...(cs.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} style={{
              display: 'block',
              padding: '0.85rem 1.4rem',
              textDecoration: 'none',
              transition: 'background 0.12s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#D5D4CF')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{
                fontFamily: 'var(--sans)', fontSize: '0.9rem',
                fontWeight: 400, color: 'var(--ink)',
              }}>
                {cs.title}
              </span>
            </a>
          ) : (
            <div style={{
              padding: '0.85rem 1.4rem',
              cursor: 'default',
            }}>
              <span style={{
                fontFamily: 'var(--sans)', fontSize: '0.9rem',
                fontWeight: 400, color: '#bbb',
              }}>
                {cs.title}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Hand-drawn icons ──────────────────────────────────────────────────────────
function HamburgerIcon() {
  return (
    <svg width="28" height="20" viewBox="0 0 28 20" fill="none" aria-hidden="true">
      <path d="M1,3 C5,2.5 10,3.5 15,3 C19,2.5 23,3.5 27,3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M1,10 C6,9.5 12,10.5 16,10 C20,9.5 24,10.5 27,10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M1,17 C4,16.5 9,17.5 14,17 C19,16.5 23,17.5 27,17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M2,2 C6,5.5 10,9 11,11 C12,13 16,17 20,20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M20,2 C16,5.5 12,9 11,11 C10,13 6,17 2,20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

// ── Mobile overlay menu ───────────────────────────────────────────────────────
const MOBILE_WORK_ITEMS = [
  { title: 'Digital Loan Application',           href: '/work/digital-loan-application'  },
  { title: 'Finance Platform Redesign',           href: '/work/finance-platform-redesign' },
  { title: "Define FBN's First Finance Archetype", href: '/work/fbn-finance-archetypes'  },
  { title: 'Bank Reconciliation',                 href: 'https://www.figma.com/proto/2Kys8Q12zNKQzmreAhvLxr/Bank-Reconciliation?page-id=0%3A1&node-id=0-202&node-type=canvas&viewport=2285%2C258%2C0.13&t=iULq9RIBfJr5Vadz-1&scaling=contain&content-scaling=fixed' },
  { title: 'Logo Design',                         href: '/work/logo-design'               },
]

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [workExpanded, setWorkExpanded] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (!open) setWorkExpanded(false)
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const linkStyle: React.CSSProperties = {
    fontFamily: 'var(--heading)', fontSize: '2.25rem', fontWeight: 400,
    color: '#FD1E20', textDecoration: 'none', letterSpacing: '-0.01em', lineHeight: 1,
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'var(--background)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      animation: 'overlayIn 200ms ease both',
    }}>

      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close menu"
        style={{
          position: 'absolute', top: 16, right: 20,
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--ink)', padding: '0.5rem',
        }}
      >
        <CloseIcon />
      </button>

      {/* Nav items */}
      <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2.5rem', paddingLeft: '2.5rem', width: '100%' }}>

        <a href="/" onClick={onClose} style={linkStyle}>Home</a>

        {/* Work toggle */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <button
            onClick={() => setWorkExpanded(v => !v)}
            aria-expanded={workExpanded}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              ...linkStyle,
            }}
          >
            Work
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true"
              style={{
                flexShrink: 0, marginTop: 4,
                transition: 'transform 0.2s ease',
                transform: workExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              }}>
              <path d="M1,1.5 C3,1 5,2.5 6,2 C7,1.5 9,1 11,1.5"
                stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Sub-items — height animates open/closed */}
          <div style={{
            overflow: 'hidden',
            maxHeight: workExpanded ? '180px' : '0',
            opacity: workExpanded ? 1 : 0,
            transition: 'max-height 0.25s ease, opacity 0.2s ease',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.6rem',
            marginTop: workExpanded ? '1rem' : '0',
          }}>
            {MOBILE_WORK_ITEMS.map(item => (
              <a key={item.href} href={item.href} onClick={onClose} style={{
                fontFamily: 'var(--sans)', fontSize: '1rem', fontWeight: 400,
                color: '#888', textDecoration: 'none', letterSpacing: '0.01em',
              }}>
                {item.title}
              </a>
            ))}
          </div>
        </div>

        <a href="/about" onClick={onClose} style={linkStyle}>About</a>

      </nav>

      <img src="/menu.png" alt="" className="absolute bottom-6 right-6 w-32 opacity-80 md:hidden pointer-events-none" />
    </div>
  )
}

// ── Nav ───────────────────────────────────────────────────────────────────────
export default function Nav({ activePage, variant = 'bar' }: {
  activePage?: 'home' | 'about' | 'work'
  /** 'bar' = fixed white bar with divider (default, used on inner pages).
   *  'embedded' = sits inline in normal flow with no background/divider — for
   *  dropping the nav directly onto a colored section like the homepage hero. */
  variant?: 'bar' | 'embedded'
}) {
  const [workOpen, setWorkOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openWork  = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setWorkOpen(true) }
  const closeWork = () => { closeTimer.current = setTimeout(() => setWorkOpen(false), 120) }

  const isEmbedded = variant === 'embedded'
  const NAV_RED = '#FD1E20'
  const NAV_RED_HOVER = '#C8141A'

  return (
    <>
      <style>{DROPDOWN_CSS}</style>
      <nav style={{
        position: isEmbedded ? 'relative' : 'fixed',
        top: isEmbedded ? undefined : 0,
        left: isEmbedded ? undefined : 0,
        right: isEmbedded ? undefined : 0,
        zIndex: isEmbedded ? undefined : 100,
        background: isEmbedded ? 'transparent' : 'var(--background)',
      }}>
        {/* Work · logo · About — clustered around the centered logo on desktop; hamburger at far right on mobile */}
        <div className="nav-grid" style={{
          maxWidth: 1100, margin: '0 auto', padding: '1rem 2rem 1.6rem',
          display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center',
        }}>
          {/* Left — Work with dropdown (desktop only) */}
          <div className="nav-left">
            <div
              className="nav-desktop-links"
              style={{ position: 'relative' }}
              onMouseEnter={openWork}
              onMouseLeave={closeWork}
            >
              <a href="/#work"
                style={{ fontFamily: 'var(--heading)', fontSize: '0.95rem', fontWeight: 500, color: NAV_RED, textDecoration: 'none', letterSpacing: '0.04em', transition: 'color 0.15s', display: 'block' }}
                onMouseEnter={e => (e.currentTarget.style.color = NAV_RED_HOVER)}
                onMouseLeave={e => (e.currentTarget.style.color = NAV_RED)}
              >
                Work
              </a>
              <WorkDropdown visible={workOpen} />
            </div>
          </div>

          {/* Center — logo, links home */}
          <a href="/" aria-label="Zhu Nan — home" className="nav-logo" style={{ textDecoration: 'none', justifySelf: 'center', position: 'relative', lineHeight: 1 }}>
            <span aria-hidden="true" style={{ fontFamily: 'var(--font-organic-hand), var(--heading)', textTransform: 'uppercase', fontSize: '1.6rem', color: 'var(--ink)', letterSpacing: '0.02em', lineHeight: 1, whiteSpace: 'nowrap' }}>
              {'Zhu Nan'.split('').map((ch, i) => (
                <span key={i} className="nav-logo-letter"
                  // Class is added on contact and removed when the hop finishes, so the
                  // letter can't retrigger mid-jump as it moves away from the cursor
                  onMouseEnter={e => e.currentTarget.classList.add('is-hopping')}
                  onAnimationEnd={e => e.currentTarget.classList.remove('is-hopping')}
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              ))}
            </span>
            {/* Hand-drawn smile hangs below the name (absolutely positioned, so the links align to the
                letters, not the smile) — two slightly offset strokes + a roughen filter
                so the line weight feels uneven, like a marker */}
            <svg aria-hidden="true" viewBox="0 0 120 24" preserveAspectRatio="none"
              style={{ position: 'absolute', left: '-4%', bottom: -18, width: '108%', height: 20, overflow: 'visible', pointerEvents: 'none' }}>
              <defs>
                <filter id="logo-smile-rough" x="-10%" y="-50%" width="120%" height="200%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.35" numOctaves="1" seed="11" result="n" />
                  <feDisplacementMap in="SourceGraphic" in2="n" scale="1" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </defs>
              <g fill="none" stroke="#1A1A1A" strokeLinecap="round" filter="url(#logo-smile-rough)">
                <path d="M5,3 C18,17 42,23 62,22 C82,21 102,14 115,2" strokeWidth="2.2" />
                <path d="M10,6 C24,17 46,21.5 64,20.5 C82,19.5 99,13.5 110,5" strokeWidth="1" opacity="0.8" />
              </g>
            </svg>
          </a>

          {/* Right — About (desktop) / hamburger (mobile) */}
          <div className="nav-right" style={{ display: 'flex', alignItems: 'center' }}>
            <a href="/about"
              className="nav-desktop-links"
              style={{ fontFamily: 'var(--heading)', fontSize: '0.95rem', fontWeight: 500, color: NAV_RED, textDecoration: 'none', letterSpacing: '0.04em', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = NAV_RED_HOVER)}
              onMouseLeave={e => (e.currentTarget.style.color = NAV_RED)}
            >
              About
            </a>

            <button
              className="nav-hamburger"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '0.5rem', color: 'var(--ink)',
              }}
            >
              <HamburgerIcon />
            </button>
          </div>
        </div>

        {/* Divider — hand-drawn wobbly line, constrained to content width */}
        {!isEmbedded && (
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem' }}>
            <WobblyDivider />
          </div>
        )}
      </nav>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}

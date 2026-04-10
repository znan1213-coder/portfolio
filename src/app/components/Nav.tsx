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

// ── Case studies ──────────────────────────────────────────────────────────────
const CASE_STUDIES = [
  { title: 'Digital Loan Application',           href: '/work/digital-loan-application',   live: true  },
  { title: 'Finance Platform Redesign',           href: '/work/finance-platform-redesign',  live: true  },
  { title: "Define FBN's First Finance Archetype", href: '/work/fbn-finance-archetypes',    live: true  },
  { title: 'Bank Reconciliation',                 href: '/work/bank-reconciliation',        live: false },
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
  .nav-desktop-links { display: none; }
  .nav-hamburger { display: flex; }
  @media (min-width: 768px) {
    .nav-desktop-links { display: flex; }
    .nav-hamburger { display: none; }
  }
`

function WorkDropdown({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <div style={{
      position: 'absolute',
      top: 'calc(100% + 10px)',
      right: 0,
      background: '#fff',
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
            <a href={cs.href} style={{
              display: 'block',
              padding: '0.85rem 1.4rem',
              textDecoration: 'none',
              transition: 'background 0.12s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#FAF9F7')}
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
    fontFamily: 'var(--serif)', fontSize: '2.25rem', fontWeight: 400,
    color: 'var(--ink)', textDecoration: 'none', letterSpacing: '-0.01em', lineHeight: 1,
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: '#fff',
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
                stroke="var(--terracotta)" strokeWidth="1.4" strokeLinecap="round"/>
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
export default function Nav({ activePage }: { activePage?: 'home' | 'about' | 'work' }) {
  const [rotation, setRotation] = useState(0)
  const [workOpen, setWorkOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => setRotation(window.scrollY * 0.5)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openWork  = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setWorkOpen(true) }
  const closeWork = () => { closeTimer.current = setTimeout(() => setWorkOpen(false), 120) }

  const linkColor = (href: string) => {
    if (activePage === 'about' && href === '/about') return 'var(--ink)'
    return 'var(--muted)'
  }
  const leaveColor = (href: string) => {
    if (activePage === 'about' && href === '/about') return 'var(--ink)'
    return 'var(--muted)'
  }

  return (
    <>
      <style>{DROPDOWN_CSS}</style>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #EBEBEB',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto', padding: '0 2rem',
          height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
            <img src="/yarn black.png" alt="Logo"
              style={{ height: 46, width: 'auto', transform: `rotate(${rotation}deg)`, transition: 'transform 0.05s linear' }} />
            <span style={{ fontFamily: 'var(--serif)', fontSize: '1rem', color: 'var(--ink)', letterSpacing: '0.01em' }}>
              Zhu Nan
            </span>
          </a>

          {/* Desktop links — hidden on mobile */}
          <div className="nav-desktop-links" style={{ gap: '2.5rem', alignItems: 'center' }}>
            <a href="/"
              style={{ fontFamily: 'var(--sans)', fontSize: '0.8rem', fontWeight: 400, color: 'var(--muted)', textDecoration: 'none', letterSpacing: '0.04em', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
            >
              Home
            </a>

            {/* Work with dropdown */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={openWork}
              onMouseLeave={closeWork}
            >
              <a href="/#work"
                style={{ fontFamily: 'var(--sans)', fontSize: '0.8rem', fontWeight: 400, color: 'var(--muted)', textDecoration: 'none', letterSpacing: '0.04em', transition: 'color 0.15s', display: 'block' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
              >
                Work
              </a>
              <WorkDropdown visible={workOpen} />
            </div>

            <a href="/about"
              style={{ fontFamily: 'var(--sans)', fontSize: '0.8rem', fontWeight: 400, color: linkColor('/about'), textDecoration: 'none', letterSpacing: '0.04em', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
              onMouseLeave={e => (e.currentTarget.style.color = leaveColor('/about'))}
            >
              About
            </a>
          </div>

          {/* Hamburger — visible on mobile only */}
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
      </nav>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}

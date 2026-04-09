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
  { title: 'Digital Loan Application',           href: '/work/digital-loan-application', live: true  },
  { title: 'Finance Platform Redesign',           href: '/work/finance-platform',         live: false },
  { title: "Define FBN's First Finance Archetype", href: '/work/archetype',               live: false },
  { title: 'Bank Reconciliation',                 href: '/work/bank-reconciliation',      live: false },
]

const DROPDOWN_CSS = `
  @keyframes dropdownIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
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

// ── Nav ───────────────────────────────────────────────────────────────────────
export default function Nav({ activePage }: { activePage?: 'home' | 'about' | 'work' }) {
  const [rotation, setRotation] = useState(0)
  const [workOpen, setWorkOpen] = useState(false)
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

        {/* Links */}
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
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
      </div>
    </nav>
  )
}

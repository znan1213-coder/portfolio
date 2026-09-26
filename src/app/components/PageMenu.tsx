'use client'

import { useEffect, useState } from 'react'

// ── Page menu — "On this page" card fixed to the top-right corner ─────────────
// Appears once the reader scrolls past the hero (the element marked data-nav-hero)
// and highlights the section currently in view. On wide screens it's an open card in
// the right margin; on narrower screens it collapses to a small tab that opens on click.
export default function PageMenu({ sections }: { sections: { id: string; label: string }[] }) {
  const [visible, setVisible] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const hero = document.querySelector('[data-nav-hero]') as HTMLElement | null
      setVisible(hero ? hero.getBoundingClientRect().bottom < 120 : window.scrollY > 300)
      let current: string | null = null
      for (const s of sections) {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top < 200) current = s.id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [sections])

  useEffect(() => { if (!visible) setOpen(false) }, [visible])

  const activeLabel = sections.find(s => s.id === active)?.label ?? sections[0]?.label

  return (
    <>
      <style>{PAGE_MENU_CSS}</style>
      <div className={`page-menu ${visible ? 'is-visible' : ''} ${open ? 'is-open' : ''}`}>
        {/* Compact tab — only shown on narrower screens */}
        <button type="button" className="page-menu-tab" aria-expanded={open} onClick={() => setOpen(o => !o)}>
          <span className="page-menu-tab-label">{activeLabel}</span>
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className="page-menu-chevron">
            <path d="M1.5 3.5 L5 7 L8.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <nav className="page-menu-card" aria-label="On this page">
          <p className="page-menu-title">On this page</p>
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'is-active' : ''} onClick={() => setOpen(false)}>
              <span className="page-menu-dot" aria-hidden="true" />
              {s.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  )
}

const PAGE_MENU_CSS = `
  .page-menu { position: fixed; top: 92px; right: 24px; z-index: 90; opacity: 0; transform: translateY(-6px); pointer-events: none; transition: opacity 0.25s ease, transform 0.25s ease; }
  .page-menu.is-visible { opacity: 1; transform: translateY(0); pointer-events: auto; }
  .page-menu-card { background: #FFFFFF; border: 1px solid rgba(0,0,0,0.1); border-radius: 10px; box-shadow: 0 6px 20px rgba(0,0,0,0.06); padding: 0.85rem 1rem 0.9rem; min-width: 170px; }
  .page-menu-title { font-family: var(--sans); font-size: 0.72rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(0,0,0,0.45); margin: 0 0 0.4rem; }
  .page-menu-card a { display: flex; align-items: center; gap: 0.5rem; font-family: var(--heading); font-size: 0.92rem; font-weight: 500; color: rgba(0,0,0,0.5); text-decoration: none; padding: 0.28rem 0; transition: color 0.15s ease; }
  .page-menu-card a:hover { color: #1A1A1A; }
  .page-menu-card a.is-active { color: #FD1E20; }
  .page-menu-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; opacity: 0; flex-shrink: 0; }
  .page-menu-card a.is-active .page-menu-dot { opacity: 1; }
  .page-menu-tab { display: none; }

  /* Not enough margin beside the content: collapse to a tab that opens the card */
  @media (max-width: 1240px) {
    .page-menu { top: 84px; right: 16px; }
    .page-menu-tab { display: inline-flex; align-items: center; gap: 0.45rem; margin-left: auto; cursor: pointer; background: #FFFFFF; border: 1px solid rgba(0,0,0,0.12); border-radius: 999px; box-shadow: 0 4px 14px rgba(0,0,0,0.06); padding: 0.4rem 0.8rem 0.4rem 0.95rem; font-family: var(--heading); font-size: 0.85rem; font-weight: 500; color: #FD1E20; }
    .page-menu-chevron { color: rgba(0,0,0,0.5); transition: transform 0.2s ease; }
    .page-menu.is-open .page-menu-chevron { transform: rotate(180deg); }
    .page-menu { display: flex; flex-direction: column; align-items: flex-end; }
    .page-menu-card { display: none; margin-top: 0.5rem; }
    .page-menu.is-open .page-menu-card { display: block; }
  }
`

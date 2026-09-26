'use client'

import { useEffect, useState } from 'react'

// Small "back to top" button, bottom-right. Fades in once the reader has scrolled
// a screen's worth down the page.
export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <style>{`
        .back-to-top { position: fixed; right: 24px; bottom: 24px; z-index: 90; width: 44px; height: 44px; border-radius: 999px;
          display: flex; align-items: center; justify-content: center; background: #fff; color: #1A1A1A;
          border: 1px solid rgba(0,0,0,0.12); box-shadow: 0 4px 14px rgba(0,0,0,0.08); cursor: pointer;
          transition: opacity 0.2s ease, transform 0.2s ease, color 0.15s ease, border-color 0.15s ease; }
        .back-to-top:hover { color: #FD1E20; border-color: rgba(253,30,32,0.4); }
        .back-to-top[data-visible="false"] { opacity: 0; transform: translateY(8px); pointer-events: none; }
        @media (max-width: 768px) { .back-to-top { right: 16px; bottom: 16px; } }
      `}</style>
      <button
        type="button"
        className="back-to-top"
        data-visible={visible}
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </>
  )
}

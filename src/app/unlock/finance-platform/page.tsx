'use client'

import { useActionState, useState } from 'react'
import Nav from '../../components/Nav'
import { unlockFinancePlatform } from './actions'

export default function UnlockFinancePlatform() {
  const [state, action, pending] = useActionState(unlockFinancePlatform, null)
  const [value, setValue] = useState('')
  const empty = value.trim() === ''
  const disabled = pending || empty

  return (
    <div style={{ minHeight: '100vh', background: '#F6F5F1' }}>
      <Nav heroBg="#F6F5F1" />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 1.25rem 3rem' }}>
        <div style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ display: 'block', margin: '0 auto 20px' }}>
            <rect x="4.5" y="10.5" width="15" height="10" rx="2" stroke="#1A1A1A" strokeWidth="1.5" />
            <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="15.5" r="1.3" fill="#FD1E20" />
          </svg>
          <p style={{ fontFamily: 'var(--font-organic-hand), var(--sans)', fontSize: '1.05rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink)', margin: '0 0 8px' }}>
            Protected case study
          </p>
          <h1 style={{ fontFamily: 'var(--heading)', fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 400, lineHeight: 1.15, color: 'var(--ink)', margin: '0 0 16px' }}>
            Finance platform redesign
          </h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '1.05rem', lineHeight: 1.6, color: 'rgba(0,0,0,0.65)', margin: '0 0 32px' }}>
            Please reach out to me for the password.
          </p>

          <form action={action} onSubmit={() => (document.activeElement as HTMLElement | null)?.blur()} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="off"
              autoFocus
              value={value}
              onChange={e => setValue(e.target.value)}
              aria-label="Password"
              style={{
                fontFamily: 'var(--sans)', fontSize: '1rem', color: '#1A1A1A', background: '#fff',
                border: '1px solid rgba(0,0,0,0.15)', borderRadius: 8, padding: '0.8rem 1rem',
                outline: 'none', width: '100%', boxSizing: 'border-box',
              }}
            />
            {state?.error && (
              <p role="alert" style={{ fontFamily: 'var(--sans)', fontSize: '0.9rem', color: '#C8141A', margin: 0 }}>
                {state.error}
              </p>
            )}
            <button
              type="submit"
              disabled={disabled}
              style={{
                fontFamily: 'var(--heading)', fontSize: '1rem', fontWeight: 500,
                background: empty ? 'rgba(0,0,0,0.12)' : pending ? '#C8141A' : '#FD1E20', border: 'none', borderRadius: 8,
                color: empty ? 'rgba(0,0,0,0.4)' : '#fff',
                padding: '0.8rem 1.5rem', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background 0.15s, color 0.15s',
              }}
            >
              {pending ? 'Checking…' : 'View case study'}
            </button>
          </form>

          <a href="/" style={{ display: 'inline-block', marginTop: 24, fontFamily: 'var(--sans)', fontSize: '0.95rem', color: 'rgba(0,0,0,0.6)', textDecoration: 'none' }}>
            ← Back to all work
          </a>
        </div>
      </div>
    </div>
  )
}

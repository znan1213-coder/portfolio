'use client'

import { useActionState, useState } from 'react'
import { authenticate } from './actions'

export default function PasswordPage() {
  const [state, action, pending] = useActionState(authenticate, null)
  const [value, setValue] = useState('')
  const empty = value.trim() === ''
  const disabled = pending || empty

  return (
    <div style={{
      minHeight: '100vh', background: '#F6F5F1',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.25rem',
    }}>
      <div style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
        {/* Logo — same Organic Hand wordmark + smile as the nav */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 40 }}>
          <span style={{ fontFamily: 'var(--font-organic-hand), var(--heading)', textTransform: 'uppercase', fontSize: '2.4rem', letterSpacing: '0.02em', color: 'var(--ink)', lineHeight: 1 }}>
            Zhu Nan
          </span>
          <svg aria-hidden="true" viewBox="0 0 100 24" width="110" height="26" fill="none"
            style={{ position: 'absolute', left: '50%', bottom: -26, transform: 'translateX(-50%)', overflow: 'visible' }}>
            <path d="M6,6 C26,24 74,24 94,6" stroke="#1A1A1A" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </div>

        <h1 style={{ fontFamily: 'var(--heading)', fontSize: 'clamp(1.6rem, 3vw, 2rem)', fontWeight: 400, lineHeight: 1.2, color: 'var(--ink)', margin: '0 0 12px' }}>
          Welcome to my portfolio
        </h1>
        <p style={{ fontFamily: 'var(--sans)', fontSize: '1.05rem', lineHeight: 1.6, color: 'rgba(0,0,0,0.65)', margin: '0 0 32px' }}>
          Enter the password to take a look around.
        </p>

        <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            autoFocus
            aria-label="Password"
            value={value}
            onChange={e => setValue(e.target.value)}
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
              color: empty ? 'rgba(0,0,0,0.4)' : '#fff',
              background: empty ? 'rgba(0,0,0,0.12)' : pending ? '#C8141A' : '#FD1E20',
              border: 'none', borderRadius: 8, padding: '0.8rem 1.5rem',
              cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background 0.15s, color 0.15s',
            }}
          >
            {pending ? 'Checking…' : 'Enter'}
          </button>
        </form>

        <p style={{ fontFamily: 'var(--sans)', fontSize: '0.95rem', color: 'rgba(0,0,0,0.55)', margin: '28px 0 0' }}>
          Don&rsquo;t have the password?{' '}
          <a href="https://www.linkedin.com/in/zhunan/" target="_blank" rel="noopener noreferrer" style={{ color: '#FD1E20', textDecoration: 'none', fontWeight: 500 }}>
            Reach out on LinkedIn
          </a>
        </p>
      </div>
    </div>
  )
}

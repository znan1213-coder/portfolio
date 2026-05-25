'use client'

import { useActionState } from 'react'
import { authenticate } from './actions'

export default function PasswordPage() {
  const [state, action, pending] = useActionState(authenticate, null)

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FAF6F1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: 380, textAlign: 'center' }}>
        <h1 style={{
          fontFamily: 'var(--serif)',
          fontSize: '2rem',
          fontWeight: 400,
          color: '#1A1A1A',
          letterSpacing: '-0.01em',
          marginBottom: '0.5rem',
        }}>
          Zhu Nan
        </h1>
        <p style={{
          fontFamily: 'var(--sans)',
          fontSize: '0.9375rem',
          fontWeight: 300,
          color: '#666',
          marginBottom: '2.5rem',
        }}>
          Enter the password to view this portfolio.
        </p>

        <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '1rem',
              fontWeight: 300,
              color: '#1A1A1A',
              background: '#fff',
              border: '1px solid #DEDAD5',
              borderRadius: 4,
              padding: '0.75rem 1rem',
              outline: 'none',
              width: '100%',
              boxSizing: 'border-box',
            }}
          />

          {state?.error && (
            <p style={{
              fontFamily: 'var(--sans)',
              fontSize: '0.875rem',
              fontWeight: 400,
              color: '#A0522D',
              margin: 0,
            }}>
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '0.875rem',
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#fff',
              background: pending ? '#C4845A' : '#A0522D',
              border: 'none',
              borderRadius: 4,
              padding: '0.75rem 1.5rem',
              cursor: pending ? 'default' : 'pointer',
              transition: 'background 0.15s',
            }}
          >
            {pending ? 'Checking…' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  )
}

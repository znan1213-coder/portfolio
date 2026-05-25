'use client'

import Nav from '../../components/Nav'

export default function LogoDesign() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <style>{`
        @media (max-width: 768px) {
          .hero-wrapper { padding-left: 1.25rem !important; padding-right: 1.25rem !important; }
          .hero-section { padding-top: 2.5rem !important; padding-bottom: 2.5rem !important; }
          .hero-h1 { font-size: 2.25rem !important; }
          .hero-subtitle { max-width: 100% !important; font-size: 1rem !important; }
          .hero-tags { flex-wrap: wrap !important; flex-direction: row !important; }
          .logo-grid { grid-template-columns: repeat(1, 1fr) !important; }
          .cs-main { padding: 0 1.25rem !important; }
        }
      `}</style>

      <Nav />

      {/* ── Full-bleed hero ───────────────────────────────────────────────── */}
      <div style={{
        background: '#F2EDE6',
        borderBottom: '1px solid #E4DDD4',
        paddingTop: 56,
        minHeight: '50vh',
        display: 'flex',
        alignItems: 'center',
      }}>
        <div className="hero-wrapper" style={{
          maxWidth: 1200, width: '100%', margin: '0 auto',
          paddingLeft: '3rem', paddingRight: '3rem',
        }}>
          <section id="overview" className="hero-section text-center" style={{
            paddingTop: '3rem', paddingBottom: '3rem', scrollMarginTop: '90px',
          }}>
            <div className="max-w-2xl mx-auto">
              {/* Meta pills */}
              <div className="hero-tags flex flex-wrap gap-2" style={{ marginBottom: '2rem', justifyContent: 'center' }}>
                {['Branding', 'Identity'].map(tag => (
                  <span key={tag} style={{
                    fontFamily: 'var(--sans)', fontSize: '0.7rem',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'var(--terracotta)', fontWeight: 500,
                    border: '1px solid #E8C9B4', borderRadius: 999,
                    padding: '0.3rem 0.85rem',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="hero-h1" style={{
                fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 400, lineHeight: 1.05, color: 'var(--ink)',
                letterSpacing: '-0.01em', marginBottom: '1.5rem',
              }}>
                Logo Design
              </h1>

              <p className="hero-subtitle" style={{
                fontFamily: 'var(--sans)', fontSize: '1.075rem', fontWeight: 300,
                color: '#1a1a1a', lineHeight: 1.7,
              }}>
                A collection of logo and brand mark work across personal projects and freelance clients.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <main className="cs-main" style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '0 3rem',
      }}>

        {/* ── Intro ─────────────────────────────────────────────────────────── */}
        <section style={{ paddingTop: '4rem', paddingBottom: '4rem', textAlign: 'center' }}>
          <p style={{
            fontFamily: 'var(--sans)', fontSize: '1.0625rem', fontWeight: 300,
            color: '#1a1a1a', lineHeight: 1.75,
            maxWidth: 640, margin: '0 auto',
          }}>
            Logo design is where I return to the basics — form, balance, and the challenge of saying
            something meaningful in a single mark. These are logos created across freelance work and
            personal projects over the years.
          </p>
        </section>

        {/* ── Image grid ────────────────────────────────────────────────────── */}
        <section style={{ paddingBottom: '5rem' }}>
          <div
            className="logo-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2rem',
              justifyItems: 'center',
              maxWidth: 900,
              margin: '0 auto',
            }}
          >
            {[
              'logo_startupweekend_chengdu.png',
              'logo_megi.png',
              'logo_EA.png',
              'logo_lightning expense.png',
              'logo_acheva.png',
              'logo_pospal.png',
              'logo_taxably.png',
              'logo_integra_group.png',
            ].map(filename => (
              <div
                key={filename}
                style={{
                  width: 256,
                  height: 256,
                  background: '#fff',
                  borderRadius: '0.75rem',
                  border: '1px solid #f3f4f6',
                  padding: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxSizing: 'border-box',
                }}
              >
                <img
                  src={`/case%20studies/logo%20design/${encodeURIComponent(filename)}`}
                  alt={filename.replace(/logo_|\.png$/g, '').replace(/_/g, ' ')}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── Prev / Next ────────────────────────────────────────────────────── */}
        <div style={{
          borderTop: '1px solid #EBEBEB',
          padding: '3rem 0 5rem',
          display: 'flex',
          justifyContent: 'flex-start',
        }}>
          <a
            href="/work/bank-reconciliation"
            style={{
              fontFamily: 'var(--sans)', fontSize: '0.875rem',
              fontWeight: 400, color: 'var(--terracotta)',
              textDecoration: 'none', letterSpacing: '0.03em',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              borderBottom: '1px solid transparent', paddingBottom: '2px',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--terracotta)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
          >
            <span style={{
              fontFamily: 'var(--serif)', fontSize: '0.95rem',
              fontStyle: 'italic', color: '#999', marginRight: '0.25rem',
            }}>Prev</span>
            ← Bank Reconciliation
          </a>
        </div>

      </main>

      {/* Footer */}
      <footer style={{
        background: '#fff',
        borderTop: '1px solid #EBEBEB', maxWidth: 1200,
        margin: '0 auto', padding: '2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '1rem',
      }}>
        <span style={{ fontFamily: 'var(--serif)', fontSize: '0.95rem', color: 'var(--ink)' }}>
          Zhu Nan
        </span>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[{ label: 'LinkedIn', href: '#' }, { label: 'Resume', href: '#' }].map(link => (
            <a key={link.label} href={link.href} style={{
              fontFamily: 'var(--sans)', fontSize: '0.75rem', color: 'var(--muted)',
              textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase',
              transition: 'color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--terracotta)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
            >{link.label}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}

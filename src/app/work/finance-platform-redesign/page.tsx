'use client'

import { useEffect, useState } from 'react'
import Nav from '../../components/Nav'
import { DoodleDefs } from '../../components/Doodles'
import PageMenu from '../../components/PageMenu'

// ── Shared text styles (match the Digital Loan template) ─────────────────────
const BODY: React.CSSProperties = {
  fontFamily: 'var(--sans)', fontSize: '1.125rem', fontWeight: 400,
  color: 'var(--ink)', lineHeight: 1.7, maxWidth: 900, margin: 0,
}
const H2: React.CSSProperties = {
  fontFamily: 'var(--heading)', fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
  fontWeight: 400, lineHeight: 1.15, color: 'var(--ink)',
  letterSpacing: '-0.01em', maxWidth: 900,
}
const H3: React.CSSProperties = {
  fontFamily: 'var(--heading)', fontSize: '1.35rem', fontWeight: 500,
  letterSpacing: '-0.015em', color: 'var(--ink)', lineHeight: 1.3,
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: 'var(--font-organic-hand), var(--sans)', fontSize: '1.05rem',
      letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink)',
      fontWeight: 400, margin: 0,
    }}>
      {children}
    </p>
  )
}

function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1.25rem' }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'baseline' }}>
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" style={{ flexShrink: 0, marginTop: 3 }}>
            <path d="M1,5 C2.5,4 4,5.5 5,4.8 C6,4.1 7.5,5.2 9,5" fill="none" stroke="#FD1E20" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <p style={BODY}>{item}</p>
        </div>
      ))}
    </div>
  )
}

// Soft screenshot placeholder until real before/after images are added
function Shot({ label }: { label: string }) {
  return (
    <div role="img" aria-label={label} style={{
      width: '100%', aspectRatio: '16 / 10', background: '#F6F5F1', borderRadius: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--sans)', fontSize: '0.8rem', letterSpacing: '0.1em',
      textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)',
    }}>
      {label}
    </div>
  )
}

// Big red number with a short label (no card)
function ImpactStat({ stat, detail }: { stat: string; detail: string }) {
  return (
    <div>
      <p style={{ fontFamily: 'var(--heading)', fontSize: 'clamp(2.1rem, 4vw, 2.75rem)', fontWeight: 500, letterSpacing: '-0.03em', color: '#FD1E20', lineHeight: 1, margin: '0 0 0.6rem' }}>
        {stat}
      </p>
      <p style={{ fontFamily: 'var(--sans)', fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.5, margin: 0 }}>
        {detail}
      </p>
    </div>
  )
}

// ── Result — before / after for each of the three focus areas ────────────────
const RESULTS = [
  {
    title: 'A dashboard built around what matters',
    before: 'The original dashboard rendered every run as an undifferentiated list, with no way to filter or prioritize. Users maintained a separate Excel sheet to track what actually mattered to them.',
    after: 'The redesigned dashboard surfaces the runs and data statuses users actually care about, eliminating the need for the Excel workaround and giving analysts a meaningful starting point each session.',
  },
  {
    title: 'Navigation that follows the data',
    before: 'Early concepts explored how to represent the hierarchical relationships between data layers. The core challenge was making dependencies legible without adding steps.',
    after: 'The final navigation gives analysts a clear sense of where they are within the data hierarchy and how layers relate, reducing the clicking and reorientation of the old experience.',
  },
  {
    title: 'A layout made for big screens',
    before: "The original layout didn't account for the large-monitor, data-dense environment analysts work in, leaving significant screen space unused.",
    after: 'The new layout is designed for the actual context of use: responsive to larger screens and structured to surface more data without adding cognitive load.',
  },
]

function ResultShowcase() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
      {RESULTS.map(r => (
        <div key={r.title}>
          <h3 style={{ ...H3, fontSize: '1.5rem', margin: '0 0 24px' }}>{r.title}</h3>
          <div className="before-after" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {[{ tag: 'Before', text: r.before }, { tag: 'After', text: r.after }].map(side => (
              <div key={side.tag}>
                <Shot label={`${side.tag} screenshot`} />
                <p style={{ fontFamily: 'var(--font-organic-hand), var(--heading)', fontSize: '1.15rem', letterSpacing: '0.02em', color: 'var(--ink)', margin: '16px 0 8px' }}>
                  {side.tag}
                </p>
                <p style={{ ...BODY, fontSize: '1rem', lineHeight: 1.6 }}>{side.text}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Page menu sections ───────────────────────────────────────────────────────
const NAV_SECTIONS = [
  { id: 'context',      label: 'Context' },
  { id: 'research',     label: 'Research' },
  { id: 'findings',     label: 'Findings' },
  { id: 'approach',     label: 'Approach' },
  { id: 'final-design', label: 'Result' },
  { id: 'impact',       label: 'Impact' },
]

// ── Page ──────────────────────────────────────────────────────────────────────
export default function FinancePlatformRedesign() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const progress = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100
      setScrollProgress(Math.min(progress, 100))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#fff', ['--terracotta' as any]: '#FD1E20' }}>
      <style>{`
        /* Spacing system (8px rhythm) — same rules as the Digital Loan case study:
           eyebrow → title 8 · title → body 24 · paragraph → paragraph 24 · bullet → bullet 16
           content → subheading 48 · subheading → content 16 · section → section 120 */
        main.cs-content > section { padding-top: 0 !important; padding-bottom: 120px !important; scroll-margin-top: 80px; }
        main.cs-content > section#context { padding-top: 64px !important; }
        main.cs-content > section > p:first-child { margin-bottom: 8px !important; }
        main.cs-content > section > h2 { margin-top: 0 !important; margin-bottom: 24px !important; }
        main.cs-content > section > p:not(:first-child) { margin-top: 0 !important; margin-bottom: 24px !important; }
        main.cs-content > section > h3 { margin-top: 48px !important; margin-bottom: 16px !important; }
        main.cs-content > section > div { margin-bottom: 24px; }
        /* Result is a visual showcase — centered opener, extra room before the first screen */
        main.cs-content > section#final-design > p:first-child,
        main.cs-content > section#final-design > h2 { text-align: center; margin-left: auto !important; margin-right: auto !important; }
        main.cs-content > section#final-design > h2 { margin-bottom: 64px !important; }
        @media (max-width: 768px) {
          .cs-progress { display: block !important; }
          .cs-content { padding: 0 1.25rem !important; }
          .stat-row { grid-template-columns: 1fr 1fr !important; }
          .before-after { grid-template-columns: 1fr !important; }
          .hero-wrapper { padding-left: 1.25rem !important; padding-right: 1.25rem !important; }
          .hero-section { padding-top: 2.5rem !important; padding-bottom: 2.5rem !important; }
          .hero-h1 { font-size: 2rem !important; }
          .hero-subtitle { max-width: 100% !important; font-size: 1rem !important; }
          .hero-cover { width: 100% !important; }
          .hero-pair { grid-template-columns: 1fr !important; }
          .meta-row { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <DoodleDefs />
      <Nav heroBg="#F6F5F1" />
      <PageMenu sections={NAV_SECTIONS} />

      {/* Mobile progress bar */}
      <div className="cs-progress" style={{ display: 'none', position: 'fixed', top: 56, left: 0, right: 0, zIndex: 99, height: 3, background: '#F0EBE4' }}>
        <div style={{ height: '100%', background: 'var(--terracotta)', width: `${scrollProgress}%`, transition: 'width 0.1s linear' }} />
      </div>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div data-nav-hero style={{ background: '#F6F5F1', paddingTop: 56, minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <div className="hero-wrapper" style={{ maxWidth: 1200, width: '100%', margin: '0 auto', paddingLeft: '3rem', paddingRight: '3rem' }}>
          <section id="overview" className="hero-section text-center" style={{ paddingTop: '3rem', paddingBottom: '4rem', scrollMarginTop: '90px' }}>
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-wrap gap-2" style={{ marginBottom: '2rem', justifyContent: 'center' }}>
                {['Enterprise', 'Internal tool', 'Fintech'].map(tag => (
                  <span key={tag} style={{
                    fontFamily: 'var(--sans)', fontSize: '0.75rem', letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: 'rgba(0,0,0,0.65)', fontWeight: 500,
                    background: 'rgba(0,0,0,0.06)', borderRadius: 999, padding: '0.3rem 0.85rem',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="hero-h1" style={{
                fontFamily: 'var(--heading)', fontSize: 'clamp(2.1rem, 4vw, 3.25rem)',
                fontWeight: 400, lineHeight: 1.05, color: 'var(--ink)',
                letterSpacing: '-0.01em', marginBottom: '1.5rem',
              }}>
                Finance platform redesign
              </h1>
              <p className="hero-subtitle" style={{
                fontFamily: 'var(--sans)', fontSize: '1.075rem', fontWeight: 400,
                color: '#1a1a1a', lineHeight: 1.7, marginBottom: '2rem',
              }}>
                Improving the everyday experience for finance associates on an internal data platform.
              </p>
            </div>
            {/* Two hero screenshots side by side (second is a placeholder for now) */}
            <div className="hero-cover hero-pair" style={{ width: '92%', margin: '2.5rem auto 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
              <img
                src="/case%20studies/finance%20platform%20redesign/hero.png"
                alt="Finance Platform redesign screen"
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }}
              />
              <div role="img" aria-label="Second screenshot placeholder" style={{
                width: '100%', aspectRatio: '2880 / 2070', borderRadius: 8,
                background: 'rgba(0,0,0,0.05)', border: '1px dashed rgba(0,0,0,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--sans)', fontSize: '0.75rem', letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)',
              }}>
                Screenshot 2
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="cs-layout" style={{ maxWidth: 820, margin: '0 auto' }}>
        <main className="cs-content" style={{ padding: '0 2rem', minWidth: 0 }}>

          {/* ── Project snapshot ─────────────────────────────────────────── */}
          <div className="meta-row" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem',
            borderTop: '1px solid rgba(0,0,0,0.12)', borderBottom: '1px solid rgba(0,0,0,0.12)',
            padding: '1.5rem 0', marginTop: 64,
          }}>
            {[
              { label: 'My role', value: 'Design research,\nend-to-end UI & UX' },
              { label: 'Team', value: '1 PM,\n2 Engineering teams' },
              { label: 'Timeline', value: 'Feb – Sep 2025' },
            ].map(item => (
              <div key={item.label}>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.5)', fontWeight: 600, margin: '0 0 0.35rem' }}>
                  {item.label}
                </p>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.5, margin: 0, whiteSpace: 'pre-line' }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* ── Context ──────────────────────────────────────────────────── */}
          <section id="context">
            <SectionLabel>Context</SectionLabel>
            <h2 style={H2}>A tool that worked, but only just</h2>
            <p style={BODY}>
              Finance Platform is an internal tool used by Capital One finance and data analysts to transform and manage data across early critical steps in a larger multi-step pipeline, work that ultimately feeds into forecasting, reporting, and financial planning at scale.
            </p>
            <p style={BODY}>
              The tool had been in use for years. It worked fine. But the bar for internal tools at large organizations is often just &ldquo;good enough to get through the day,&rdquo; and Finance Platform had accumulated years of usability debt that users had quietly worked around.
            </p>
            <figure style={{ margin: '0 0 24px' }}>
            <div role="img" aria-label="Context screenshot placeholder" style={{
              width: '80%', maxWidth: 640, margin: '0 auto', aspectRatio: '16 / 10', borderRadius: 8,
              background: 'rgba(0,0,0,0.05)', border: '1px dashed rgba(0,0,0,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--sans)', fontSize: '0.75rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)',
            }}>
              Screenshot placeholder
            </div>
              <figcaption style={{ fontFamily: 'var(--sans)', fontSize: '0.9rem', color: 'rgba(0,0,0,0.55)', margin: '0.6rem auto 0', width: '80%', maxWidth: 640, textAlign: 'center' }}>
                The original Finance Platform, before the redesign
              </figcaption>
            </figure>

            <h3 style={H3}>It started as a visual refresh</h3>
            <p style={BODY}>
              With a backend overhaul underway, the team wanted a UI refresh to match the latest design system. Before designing anything, I asked for one week to audit the existing experience and run 2 contextual inquiries, watching real users work through their actual tasks.
            </p>
            <div className="before-after" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {['Auditing the existing experience', 'Contextual inquiry with a finance associate'].map(cap => (
                <figure key={cap} style={{ margin: 0 }}>
                  <div role="img" aria-label={`${cap} (placeholder)`} style={{
                    width: '100%', aspectRatio: '4 / 3', borderRadius: 8,
                    background: 'rgba(0,0,0,0.05)', border: '1px dashed rgba(0,0,0,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--sans)', fontSize: '0.75rem', letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)',
                  }}>
                    Screenshot placeholder
                  </div>
                  <figcaption style={{ fontFamily: 'var(--sans)', fontSize: '0.9rem', color: 'rgba(0,0,0,0.55)', marginTop: '0.6rem', textAlign: 'center' }}>
                    {cap}
                  </figcaption>
                </figure>
              ))}
            </div>
            <p style={BODY}>
              The research showed how much time users were losing to extra clicks, workarounds, and reorienting themselves. We quantified that time and translated it into a dollar amount, which shifted the conversation from &ldquo;how it looks&rdquo; to &ldquo;how it works.&rdquo; We got buy-in for a real redesign instead of a facelift.
            </p>
          </section>

          {/* ── Research ─────────────────────────────────────────────────── */}
          <section id="research">
            <SectionLabel>Research</SectionLabel>
            <h2 style={H2}>Covering every kind of user</h2>
            <p style={BODY}>
              With buy-in secured, I built a design plan around the technical timeline and engineering constraints, being deliberate about sequencing: what to research, what to design, and when.
            </p>
            <p style={BODY}>
              A tool this layered and high-stakes needed coverage across all three user types before I could be confident in what we were solving for. So I expanded the contextual inquiries to include:
            </p>
            <Bullets items={[
              <><strong style={{ fontWeight: 700 }}>Power users</strong> who lived in the tool daily and had developed deep workarounds.</>,
              <><strong style={{ fontWeight: 700 }}>General users</strong> with more occasional workflows.</>,
              <><strong style={{ fontWeight: 700 }}>Managers</strong> who needed visibility into the work their teams were doing.</>,
            ]} />
          </section>

          {/* ── Findings ─────────────────────────────────────────────────── */}
          <section id="findings">
            <SectionLabel>Findings</SectionLabel>
            <h2 style={H2}>Where the experience was falling short</h2>

            <h3 style={H3}>A dashboard that wasn&rsquo;t doing its job</h3>
            <p style={BODY}>
              The dashboard, ideally the place where users get oriented and see what needs their attention, was a massive undifferentiated list of runs for all users. It didn&rsquo;t surface what mattered based on role, so users kept a separate Excel spreadsheet to track the data they actually cared about. A user-maintained workaround is one of the clearest signals that a feature has failed.
            </p>

            <h3 style={H3}>Navigation through dependent data layers</h3>
            <p style={BODY}>
              Finance Platform manages multiple layers of hierarchical data, where each layer depends on the one above it. But the interface gave users no efficient way to move between those layers or use them as reference. Finding, comparing, and managing related data meant clicking through multiple levels with no shortcuts and no sense of location.
            </p>

            <h3 style={H3}>A layout that didn&rsquo;t match the environment</h3>
            <p style={BODY}>
              Finance analysts work on large monitors with data-dense workflows. The existing layout wasn&rsquo;t designed for that context. It wasted screen space and made users work harder to see what they needed.
            </p>
          </section>

          {/* ── Approach ─────────────────────────────────────────────────── */}
          <section id="approach">
            <SectionLabel>Approach</SectionLabel>
            <h2 style={H2}>Moving fast, testing at every milestone</h2>
            <p style={BODY}>
              This project had a different rhythm than a typical corporate engagement. The team operated more like a startup, with frequent working sessions, fast decisions, and fewer formal sign-offs. As the solo designer, I had significant ownership over the direction while staying in close collaboration with engineering and product.
            </p>
            <p style={BODY}>
              The design focused on three things: rebuilding the dashboard around the data statuses users needed to track, restructuring navigation to match how the data actually relates, and redesigning the layout for the monitor environment analysts work in.
            </p>
            <p style={BODY}>
              Testing was built into every major milestone. At each concept stage, I brought work back to users to pressure-test the direction before investing further, catching misalignments early when they were cheapest to fix. At hi-fi, I ran usability testing to validate that the interactions held up under real task conditions.
            </p>
          </section>

          {/* ── Result ───────────────────────────────────────────────────── */}
          <section id="final-design">
            <SectionLabel>Result</SectionLabel>
            <h2 style={H2}>The redesigned platform</h2>
            <ResultShowcase />
          </section>

          {/* ── Impact ───────────────────────────────────────────────────── */}
          <section id="impact">
            <SectionLabel>Impact</SectionLabel>
            <h2 style={H2}>What it changed</h2>
            <p style={BODY}>
              The bi-annual product survey results came in April 2026, mid-migration. Not ideal timing, with active bug-bashing and a learning curve as users adjusted to the new backend. Even so:
            </p>
            <div className="stat-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: 48 }}>
              {[
                { stat: '60', detail: 'NPS, up from 8 in April 2025' },
                { stat: '50', detail: 'OSAT, up from 23 in April 2025' },
                { stat: '80', detail: 'Ease of use' },
                { stat: '86', detail: 'UMUX-Lite' },
              ].map(s => <ImpactStat key={s.detail} {...s} />)}
            </div>
            <p style={BODY}>
              The redesign didn&rsquo;t just improve the experience. It made a case for what design can do for internal tools that have long been treated as a lower priority.
            </p>
          </section>

          {/* ── Prev / Next ──────────────────────────────────────────────── */}
          <div style={{ borderTop: '1px solid #EBEBEB', padding: '3rem 0 5rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            {[
              { href: '/work/digital-loan-application', kicker: 'Prev', label: '← Digital Loan Application' },
              { href: '/work/fbn-finance-archetypes', kicker: 'Next', label: 'FBN Finance Archetypes →' },
            ].map(l => (
              <a key={l.href} href={l.href} style={{
                fontFamily: 'var(--sans)', fontSize: '0.875rem', color: 'var(--terracotta)',
                textDecoration: 'none', letterSpacing: '0.03em', display: 'flex', alignItems: 'center', gap: '0.5rem',
                borderBottom: '1px solid transparent', paddingBottom: 2, transition: 'border-color 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--terracotta)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
              >
                <span style={{ fontFamily: 'var(--heading)', fontSize: '0.95rem', color: 'rgba(0,0,0,0.5)', marginRight: '0.25rem' }}>{l.kicker}</span>
                {l.label}
              </a>
            ))}
          </div>

        </main>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #EBEBEB', maxWidth: 1200, margin: '0 auto', padding: '2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
      }}>
        <span style={{ fontFamily: 'var(--font-organic-hand), var(--heading)', textTransform: 'uppercase', fontSize: '1.4rem', letterSpacing: '0.02em', color: 'var(--ink)' }}>
          Zhu Nan
        </span>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/zhunan/' }, { label: 'Resume', href: '/Zhu_Nan_Resume_2025.html' }].map(link => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" style={{
              fontFamily: 'var(--heading)', fontSize: '0.95rem', fontWeight: 500, color: '#FD1E20',
              textDecoration: 'none', transition: 'color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C8141A')}
              onMouseLeave={e => (e.currentTarget.style.color = '#FD1E20')}
            >{link.label}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}

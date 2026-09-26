'use client'

import { useEffect, useState } from 'react'
import Nav from '../../components/Nav'
import BackToTop from '../../components/BackToTop'
import { DoodleDefs } from '../../components/Doodles'
import PageMenu from '../../components/PageMenu'

const IMG = '/case studies/fbn finance archetypes/'

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
const CAPTION: React.CSSProperties = {
  fontFamily: 'var(--sans)', fontSize: '0.9rem', color: 'rgba(0,0,0,0.55)',
  lineHeight: 1.5, margin: '0.6rem 0 0',
}
const SMALL_LABEL: React.CSSProperties = {
  fontFamily: 'var(--sans)', fontSize: '0.75rem', letterSpacing: '0.12em',
  textTransform: 'uppercase', color: 'rgba(0,0,0,0.5)', fontWeight: 600, margin: '0 0 8px',
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

function BulletIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" style={{ flexShrink: 0, marginTop: 3 }}>
      <path d="M1,5 C2.5,4 4,5.5 5,4.8 C6,4.1 7.5,5.2 9,5" fill="none" stroke="#FD1E20" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

// Hand-drawn red underline for a key number or phrase
function Underline({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', fontWeight: 600 }}>
      {children}
      <svg aria-hidden="true" viewBox="0 0 100 5" preserveAspectRatio="none"
        style={{ position: 'absolute', bottom: -3, left: 0, width: '100%', height: 5, overflow: 'visible' }}>
        <path d="M0,2.5 C20,0.5 40,4.5 60,2.5 C80,0.5 90,4 100,2.5" fill="none" stroke="#FD1E20" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </span>
  )
}

// Hand-drawn red zigzag underline for a key phrase
function Zigzag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', whiteSpace: 'nowrap' }}>
      {children}
      <svg aria-hidden="true" viewBox="0 0 120 8" preserveAspectRatio="none"
        style={{ position: 'absolute', left: 0, bottom: -2, width: '100%', height: 4, overflow: 'visible', pointerEvents: 'none' }}>
        <path d="M1,5 L5,2 L9,5.5 L13,2.2 L17,5.3 L21,2 L25,5.6 L29,2.3 L33,5.2 L37,2 L41,5.5 L45,2.2 L49,5.4 L53,2 L57,5.6 L61,2.3 L65,5.2 L69,2 L73,5.5 L77,2.2 L81,5.3 L85,2 L89,5.6 L93,2.3 L97,5.2 L101,2 L105,5.5 L109,2.2 L113,5.3 L117,2.4 L119,4"
          fill="none" stroke="#FD1E20" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
    </span>
  )
}

// Framed screenshot (thin outline, like the Digital Loan screens)
function Shot({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) {
  return (
    <div style={{ position: 'relative', ...style }}>
      <span className="shot-frame" aria-hidden="true" />
      <img src={src} alt={alt} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 6 }} />
    </div>
  )
}

// Big red number with a short label (no card)
function ImpactStat({ stat, detail }: { stat: string; detail: string }) {
  return (
    <div style={{ marginTop: 48 }}>
      <p style={{ fontFamily: 'var(--heading)', fontSize: 'clamp(2.1rem, 4vw, 2.75rem)', fontWeight: 500, letterSpacing: '-0.03em', color: '#FD1E20', lineHeight: 1, margin: '0 0 0.6rem' }}>
        {stat}
      </p>
      <p style={{ fontFamily: 'var(--sans)', fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.5, margin: 0, maxWidth: 420 }}>
        {detail}
      </p>
    </div>
  )
}

// Before / after pair: metric headline, then two matching soft panels with captions
function BeforeAfter({ label, headline, before, after }: {
  label: string
  headline: React.ReactNode
  before?: { src: string; alt: string; caption: string }
  after: { src: string; alt: string; caption: string; tag?: string; framed?: boolean; link?: { href: string; label: string } }
}) {
  return (
    <div style={{ marginTop: 48 }}>
      <p style={SMALL_LABEL}>{label}</p>
      <h4 style={{ fontFamily: 'var(--heading)', fontSize: '1.3rem', fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 1.3, color: 'var(--ink)', margin: '0 0 20px' }}>
        {headline}
      </h4>
      <div className="before-after-cols" style={{ display: 'grid', gridTemplateColumns: before ? '1fr 1fr' : '1fr', gap: 20 }}>
        {[...(before ? [{ ...before, doc: true, tag: 'Before', link: undefined }] : []), { ...after, doc: !!after.framed, tag: after.tag ?? 'After', link: after.link }].map(side => (
          <figure key={side.src} style={{ margin: 0, background: '#F6F5F1', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={side.src} alt={side.alt} style={{
              height: 380, width: 'auto', maxWidth: '100%', objectFit: 'contain', display: 'block',
              ...(side.doc ? { borderRadius: 4, boxShadow: '0 6px 18px rgba(0,0,0,0.10)' } : {}),
            }} />
            <figcaption style={{ ...CAPTION, color: 'var(--ink)', textAlign: 'center', marginTop: 16 }}>
              <span style={{ display: 'block', fontWeight: 600, marginBottom: 2 }}>{side.tag}</span>
              {side.caption}
              {side.link && (
                <a href={side.link.href} target="_blank" rel="noopener noreferrer" className="live-link">{side.link.label}</a>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}

// Research → design bridge: 17 farmers → 4 archetypes → 3 features
function BridgeArrow() {
  return (
    <svg className="bridge-arrow" width="56" height="20" viewBox="0 0 56 20" fill="none" aria-hidden="true">
      <path d="M2,11 C14,8 30,13 50,10" stroke="#FD1E20" strokeWidth="2" strokeLinecap="round" />
      <path d="M42,4 L51,10 L43,16" stroke="#FD1E20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ResearchBridge() {
  const steps = [
    { n: '17', label: 'farmers interviewed' },
    { n: '4', label: 'archetypes defined' },
    { n: '3', label: 'features shipped' },
  ]
  return (
    <>
    <div id="design" className="bridge" style={{ background: '#F6F5F1', borderRadius: 12, padding: '40px 36px', scrollMarginTop: 100 }}>
      <p style={{ fontFamily: 'var(--font-organic-hand), var(--heading)', fontSize: 'clamp(1.6rem, 3vw, 2.1rem)', letterSpacing: '0.04em', textTransform: 'uppercase', textAlign: 'center', color: 'var(--ink)', margin: '0 0 32px', lineHeight: 1.1 }}>
        From research to design
      </p>
      <div className="bridge-row" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', alignItems: 'center', gap: 12, textAlign: 'center' }}>
        {steps.map((st, i) => (
          <div key={st.n} style={{ display: 'contents' }}>
            {i > 0 && <BridgeArrow />}
            <div>
              <p style={{ fontFamily: 'var(--heading)', fontSize: '3rem', fontWeight: 500, letterSpacing: '-0.03em', color: '#FD1E20', lineHeight: 1, margin: 0 }}>{st.n}</p>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '1rem', color: 'var(--ink)', margin: '8px 0 0' }}>{st.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    {/* Handwritten hand-off into the Design section */}
    <div style={{ textAlign: 'center', margin: '32px 0 72px' }}>
      <p style={{ fontFamily: 'var(--font-organic-hand), var(--heading)', fontSize: '1.15rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink)', margin: 0 }}>
        And here&rsquo;s what we designed &amp; built
      </p>
      <svg width="48" height="72" viewBox="0 0 48 72" fill="none" aria-hidden="true" style={{ display: 'block', margin: '10px auto 0' }}>
        <path d="M24,3 C10,18 38,30 22,46 C17,51 20,59 24,66" stroke="#FD1E20" strokeWidth="2" strokeLinecap="round" />
        <path d="M16,57 L24,67 L31,56" stroke="#FD1E20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    </>
  )
}

// ── Archetypes ────────────────────────────────────────────────────────────────
const ARCHETYPE_PROFILES = [
  { src: IMG + 'achetype category 1 -1.png', caption: 'The Rooted' },
  { src: IMG + 'achetype category 1 -2.png', caption: 'The Practical' },
  { src: IMG + 'achetype category 1 -3.png', caption: 'The Improver' },
  { src: IMG + 'achetype category 1 -4.png', caption: 'The Strategist' },
]
const ARCHETYPE_JOURNEYS = [1, 2, 3, 4].map(i => IMG + `achetype category 2 -${i}.png`)

function ArchetypeRow() {
  const [view, setView] = useState<'Profiles' | 'Behaviors'>('Profiles')
  const [modalSrc, setModalSrc] = useState<string | null>(null)

  return (
    <div>
      {/* Soft segmented toggle */}
      <div style={{ display: 'inline-flex', gap: 4, padding: 4, borderRadius: 999, background: 'rgba(0,0,0,0.06)', marginBottom: 24 }}>
        {(['Profiles', 'Behaviors'] as const).map(label => {
          const active = view === label
          return (
            <button key={label} onClick={() => setView(label)} style={{
              fontFamily: 'var(--sans)', fontSize: '0.9rem', fontWeight: 600,
              color: active ? 'var(--ink)' : 'rgba(0,0,0,0.55)',
              background: active ? '#fff' : 'transparent',
              boxShadow: active ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
              border: 'none', borderRadius: 999, cursor: 'pointer',
              padding: '0.4rem 1.1rem', transition: 'background 0.2s, color 0.2s',
            }}>
              {label}
            </button>
          )
        })}
      </div>

      {view === 'Profiles' ? (
        <div className="archetype-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {ARCHETYPE_PROFILES.map(p => (
            <button key={p.src} onClick={() => setModalSrc(p.src)} style={{ all: 'unset', cursor: 'zoom-in', display: 'block' }}>
              <Shot src={p.src} alt={p.caption} />
              <p style={{ ...CAPTION, textAlign: 'center', color: 'var(--ink)', fontWeight: 600 }}>{p.caption}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="archetype-row-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {ARCHETYPE_JOURNEYS.map((src, i) => (
            <button key={src} onClick={() => setModalSrc(src)} style={{ all: 'unset', cursor: 'zoom-in', display: 'block' }}>
              <Shot src={src} alt={`Archetype ${i + 1} behaviors`} />
            </button>
          ))}
        </div>
      )}
      <p style={{ ...CAPTION, textAlign: 'center', marginTop: 16 }}>Click an archetype to see it larger</p>

      {modalSrc && (
        <div onClick={() => setModalSrc(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
        }}>
          <button onClick={() => setModalSrc(null)} aria-label="Close" style={{
            position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none',
            color: '#fff', fontSize: '1.75rem', cursor: 'pointer', lineHeight: 1,
          }}>×</button>
          <img src={modalSrc} alt="" onClick={e => e.stopPropagation()}
            style={{ maxWidth: 'min(1000px, 100%)', maxHeight: '90vh', objectFit: 'contain', display: 'block', borderRadius: 6 }} />
        </div>
      )}
    </div>
  )
}

// ── Page menu ─────────────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  { id: 'context',    label: 'Context' },
  { id: 'archetypes', label: 'Archetypes' },
  {
    id: 'design', label: 'Design',
    children: [
      { id: 'design-funds',     label: 'Access to funds' },
      { id: 'design-payment',   label: 'Digital payments' },
      { id: 'design-expertise', label: 'Ag expertise' },
    ],
  },
]

// ── Page ──────────────────────────────────────────────────────────────────────
export default function FBNFinanceArchetypes() {
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
        /* Spacing system (8px rhythm) — same rules as the Digital Loan case study */
        main.cs-content > section { padding-top: 0 !important; padding-bottom: 120px !important; scroll-margin-top: 80px; }
        main.cs-content > section#context { padding-top: 64px !important; }
        main.cs-content > section > p:first-child { margin-bottom: 8px !important; }
        main.cs-content > section > h2 { margin-top: 0 !important; margin-bottom: 24px !important; }
        main.cs-content.cs-content > section > :is(p, div, figure, h3):last-child { margin-bottom: 0 !important; }
        main.cs-content > section > p:not(:first-child) { margin-top: 0 !important; margin-bottom: 24px !important; }
        main.cs-content > section > h3 { margin-top: 48px !important; margin-bottom: 16px !important; }
        main.cs-content > section > div, main.cs-content > section > figure { margin-bottom: 24px; }
        .outcome { scroll-margin-top: 90px; margin-top: 72px; }
        .outcome:first-child { margin-top: 0; }
        .live-link { display: block; margin-top: 8px; font-family: var(--heading); font-weight: 500; font-size: 0.95rem; color: #FD1E20; text-decoration: none; transition: color 0.15s; }
        .live-link::after { content: ' →'; }
        .live-link:hover { color: #C8141A; }
        .outcome > p:first-child { margin: 0 0 8px !important; }
        .outcome > p:not(:first-child) { margin-top: 0 !important; margin-bottom: 24px !important; }
        .shot-frame { position: absolute; inset: 0; border: 1px solid rgba(0,0,0,0.12); border-radius: 6px; pointer-events: none; z-index: 1; }
        .cs-print { background: #FFFFFF; padding: 8px; box-shadow: 0 10px 28px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06); }
        .research-photos { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; max-width: 720px; margin: 0 auto; }
        @media (max-width: 768px) {
          .cs-progress { display: block !important; }
          .cs-content { padding: 0 1.25rem !important; }
          .before-after-cols { grid-template-columns: 1fr !important; }
          .research-photos { grid-template-columns: 1fr !important; max-width: 360px; }
          .archetype-row { grid-template-columns: 1fr 1fr !important; }
          .archetype-row-2 { grid-template-columns: 1fr !important; }
          .bridge-row { grid-template-columns: 1fr !important; gap: 20px !important; }
          .bridge-arrow { transform: rotate(90deg); margin: 0 auto; }
          .bridge { padding: 32px 20px !important; }
          .hero-wrapper { padding-left: 1.25rem !important; padding-right: 1.25rem !important; }
          .hero-section { padding-top: 2.5rem !important; padding-bottom: 2.5rem !important; }
          .hero-h1 { font-size: 2rem !important; }
          .hero-subtitle { max-width: 100% !important; font-size: 1rem !important; }
          .hero-cover { width: 100% !important; }
          .meta-row { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <DoodleDefs />
      <Nav heroBg="#F6F5F1" />
      <BackToTop />
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
                {['Agtech', 'Generative research', 'Mixed methods'].map(tag => (
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
                fontWeight: 400, lineHeight: 1.1, color: 'var(--ink)',
                letterSpacing: '-0.01em', marginBottom: '1.5rem', textWrap: 'balance' as any,
              }}>
                Research to roadmap: defining FBN&rsquo;s first finance archetypes
              </h1>
              <p className="hero-subtitle" style={{
                fontFamily: 'var(--sans)', fontSize: '1.075rem', fontWeight: 400,
                color: '#1a1a1a', lineHeight: 1.7, marginBottom: '2rem',
              }}>
                How generative research closed a critical knowledge gap and became the foundation for FBN&rsquo;s finance design decisions.
              </p>
            </div>
            <img
              src={IMG + 'Hero.png'}
              alt="FBN Finance Archetypes cover"
              className="hero-cover"
              style={{ width: '65%', aspectRatio: '16 / 8', objectFit: 'cover', objectPosition: 'center 30%', display: 'block', margin: '2.5rem auto 0', borderRadius: 8 }}
            />
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
              { label: 'My role', value: 'Research collaboration,\nsynthesis, design' },
              { label: 'Team', value: '1 UX researcher, 2 PMs,\n2 Designers' },
              { label: 'Timeline', value: 'Oct 2022 – Feb 2023' },
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

          {/* ── Research ─────────────────────────────────────────────────── */}
          <section id="context">
            <SectionLabel>Context</SectionLabel>
            <h2 style={H2}>Closing the knowledge gap</h2>
            <p style={BODY}>
              FBN had launched core finance features, but the team lacked a grounded understanding of who our farmers actually were. We didn&rsquo;t know their goals, their frustrations, or how they thought about borrowing, and without that, product and design decisions were being made on assumption.
            </p>
            <p style={BODY}>
              To close that gap, we partnered with a UX researcher to conduct generative research across 17 farmers in key agricultural regions, combining on-farm interviews, remote sessions, and focus groups at the Farmer-2-Farmer conference.
            </p>
            <p style={BODY}>
              Our main goal was to <Zigzag>define a set of farmer archetypes</Zigzag>, giving product, design, and business a shared language for who we&rsquo;re building for whenever new features come up for discussion.
            </p>
            {/* Why archetypes — soft highlight block */}
            <div style={{ background: '#F6F5F1', borderRadius: 8, padding: '1.5rem 1.75rem' }}>
              <h3 style={{ ...H3, margin: '0 0 8px' }}>Why archetypes, not personas?</h3>
              <p style={BODY}>
                In the finance space, what farmers <em>do</em> and <em>want</em> matters more than who they are demographically. Archetypes let us focus on shared behaviors and decision-making patterns, a more actionable foundation for design and product.
              </p>
            </div>

            <h3 style={H3}>My role in the research</h3>
            <p style={BODY}>
              I worked alongside the UX researcher throughout, contributing as the design voice in two key moments:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingLeft: '1.25rem' }}>
              {[
                { label: 'Kick-off workshops', desc: 'I designed the workshop activities and facilitated the sessions to surface knowledge gaps and align product, design, business, and marketing on research priorities.' },
                { label: 'Fieldwork and interviews', desc: 'We split into 3 teams to cover our major customer regions across the US. My PM and I covered part of the Midwest, sitting with farmers in their homes and fields to hear firsthand how they thought about borrowing and managing their operations.' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: '0.75rem', alignItems: 'baseline' }}>
                  <BulletIcon />
                  <p style={BODY}><strong style={{ fontWeight: 700 }}>{item.label}:</strong> {item.desc}</p>
                </div>
              ))}
            </div>

            {/* Field research photos */}
            <figure style={{ margin: '24px 0' }}>
              <div className="research-photos">
                {[
                  { src: IMG + 'research-photo-1.png', alt: 'Driving to a farm in Kansas', caption: 'Driving to a customer’s farm in Kansas for an interview' },
                  { src: IMG + 'research-photo-2.jpg', alt: 'Feeding a lamb after an interview', caption: 'It was feeding time after an interview, and the farmer let us feed the lamb!' },
                  { src: IMG + 'research-photo-3.JPG', alt: 'Team at the Farmer-2-Farmer conference', caption: 'The team that helped run focus groups at the conference' },
                ].map(photo => (
                  <div key={photo.src}>
                    <div className="cs-print">
                      <img src={photo.src} alt={photo.alt} style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block' }} />
                    </div>
                    <p style={{ ...CAPTION, textAlign: 'center', fontSize: '0.85rem', marginTop: '0.75rem' }}>{photo.caption}</p>
                  </div>
                ))}
              </div>
            </figure>

          </section>

          {/* ── Archetypes ───────────────────────────────────────────────── */}
          <section id="archetypes">
            <SectionLabel>Archetypes</SectionLabel>
            <h2 style={H2}>Four ways farmers approach borrowing</h2>
            <p style={BODY}>
              From the research, we identified four farmer archetypes, each representing a distinct relationship with borrowing and financial decision-making.
            </p>
            <ArchetypeRow />
          </section>

          {/* ── Research → design bridge ─────────────────────────────────── */}
          <ResearchBridge />

          {/* ── Design ───────────────────────────────────────────────────── */}
          <section id="design-features">
            {/* Outcome 1 */}
            <div id="design-funds" className="outcome">
              <SectionLabel>Feature 1</SectionLabel>
              <h3 style={{ ...H3, fontSize: '1.5rem', margin: '0 0 16px' }}>Enable easier access to funds</h3>
              <p style={BODY}>
                <strong style={{ fontWeight: 700 }}>Research finding:</strong>{' '}Across all four archetypes, farmers were frustrated by how slow the operating line process was, especially in time-sensitive moments like cattle auctions or co-op discounts. Waiting days to access funds meant missing opportunities.
              </p>
              <p style={BODY}>
                <strong style={{ fontWeight: 700 }}>What we designed:</strong>{' '}We digitized the bank account linkage and fund request process, eliminating DocuSign entirely. Farmers can now link their bank account in under 3 minutes and request draws anytime through the app.
              </p>
              <BeforeAfter
                label="Setting up direct deposit"
                headline={<>From 5 business days to <span style={{ color: '#FD1E20' }}>3 minutes</span></>}
                before={{ src: IMG + 'direct deposit - before.png', alt: 'DocuSign form for bank account setup', caption: 'DocuSign emailed, then manually verified by the loan team' }}
                after={{ src: IMG + 'direct deposit - after.gif', alt: 'Bank account linking flow in the FBN app', caption: 'Farmers link their bank account in the app' }}
              />
              <BeforeAfter
                label="Requesting draws"
                headline={<>From a DocuSign every time to <span style={{ color: '#FD1E20' }}>anytime, anywhere</span></>}
                before={{ src: IMG + 'draw - before.png', alt: 'DocuSign form for requesting a draw', caption: 'A DocuSign for every draw, reviewed manually' }}
                after={{ src: IMG + 'draw - after.gif', alt: 'Draw request flow in the FBN app', caption: 'A simplified draw request in the app' }}
              />
            </div>

            {/* Outcome 2 */}
            <div id="design-payment" className="outcome">
              <SectionLabel>Feature 2</SectionLabel>
              <h3 style={{ ...H3, fontSize: '1.5rem', margin: '0 0 16px' }}>Digital payment capability</h3>
              <p style={BODY}>
                <strong style={{ fontWeight: 700 }}>Research finding:</strong>{' '}Paper check repayment was causing real financial harm. Lost checks went unnoticed for over a week. Inaccurate amounts meant back-and-forth corrections. Farmers were mailing multiple smaller checks just to avoid the anxiety of sending one large one.
              </p>
              <p style={BODY}>
                <strong style={{ fontWeight: 700 }}>What we designed:</strong>{' '}Using FBN&rsquo;s existing Stripe integration, I designed a digital payment flow that replaced paper checks entirely, prioritizing simplicity, security, and real-time feedback so farmers could pay with confidence from anywhere.
              </p>
              <BeforeAfter
                label="Making a payment"
                headline={<>From mailed paper checks to <span style={{ color: '#FD1E20' }}>1-day processing</span></>}
                after={{ src: IMG + 'Digital Payment.gif', alt: 'Digital payment flow in the FBN app', caption: 'Farmers pay digitally in the app, with payments processed in 1 day' }}
              />
            </div>

            {/* Outcome 3 */}
            <div id="design-expertise" className="outcome">
              <SectionLabel>Feature 3</SectionLabel>
              <h3 style={{ ...H3, fontSize: '1.5rem', margin: '0 0 16px' }}>Highlighting agricultural expertise</h3>
              <p style={BODY}>
                <strong style={{ fontWeight: 700 }}>Research finding:</strong>{' '}Three of our four archetypes hesitated to work with lenders who didn&rsquo;t understand agriculture, especially around challenges like weather-related delays affecting repayments. They trusted lenders who understood their world.
              </p>
              <p style={BODY}>
                <strong style={{ fontWeight: 700 }}>What we designed:</strong>{' '}Working with marketing, we surfaced FBN&rsquo;s agricultural expertise directly on the financing pages and created a dedicated loan team page where farmers could find and connect with their loan advisor, building trust from the very first touchpoint.
              </p>
              <BeforeAfter
                label="Meeting the loan team"
                headline={<>From an unknown lender to <span style={{ color: '#FD1E20' }}>a team that knows agriculture</span></>}
                after={{ src: IMG + 'loan agent.png', alt: 'FBN finance team page', tag: 'Finance team page', framed: true, caption: 'Farmers can find and connect with their own loan advisor', link: { href: 'https://www.fbn.com/financing/finance-team', label: 'See the live page' } }}
              />
            </div>
          </section>

          {/* ── Prev / Next ──────────────────────────────────────────────── */}
          <div style={{ borderTop: '1px solid #EBEBEB', padding: '3rem 0 5rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            {[
              { href: '/work/finance-platform-redesign', kicker: 'Prev', label: '← Finance Platform Redesign' },
              { href: '/work/logo-design', kicker: 'Next', label: 'Logo Design →' },
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

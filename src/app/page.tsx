'use client'

import { useEffect, useRef, useState } from 'react'
import Nav from './components/Nav'

// ── Hero doodles — hand-drawn stars, sparkles and squiggles around the cats ──
// Red ink, thicker stroke; the 'doodle-rough' filter (defined once in DoodleDefs) roughens the
// edges so the line weight wobbles like a marker instead of a clean vector stroke
const DOODLE_RED = '#FD1E20'
const INK = { fill: 'none', stroke: DOODLE_RED, strokeWidth: 2.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, filter: 'url(#doodle-rough)' }

function DoodleDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
      <defs>
        <filter id="doodle-rough" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  )
}

function Star({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path {...INK} d="M12,2.5 L14.6,9.2 L21.3,9.6 L16.1,13.9 L17.9,20.8 L12.1,16.9 L6.2,20.6 L8.1,13.8 L2.8,9.5 L9.5,9.1 Z" />
    </svg>
  )
}
function Sparkle({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path {...INK} d="M12,2 C12.6,8.5 15.2,11.3 22,12 C15.3,12.8 12.7,15.4 12,22 C11.2,15.5 8.6,12.8 2,12 C8.8,11.2 11.3,8.6 12,2 Z" />
    </svg>
  )
}
function Squiggle({ width = 34 }: { width?: number }) {
  return (
    <svg width={width} height={width * 0.35} viewBox="0 0 40 14" aria-hidden="true">
      <path {...INK} d="M2,8 C6,2 9,2 11,7 C13,12 17,12 19,7 C21,2 25,2 27,7 C29,12 33,12 38,5" />
    </svg>
  )
}
function Loop({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 34 24" aria-hidden="true">
      <path {...INK} d="M2,18 C8,19 14,15 15,9 C16,3 10,2 9,7 C8,13 16,17 22,13 C26,10 29,6 32,5" />
    </svg>
  )
}
function Burst({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path {...INK} d="M12,3 L12.5,8 M20,6 L16.5,9.5 M21.5,14 L16.8,13.2 M4,6.5 L7.8,9.8 M2.8,14.5 L7.4,13.4" />
    </svg>
  )
}
function Dot() {
  return <span aria-hidden="true" style={{ display: 'block', width: 6, height: 5, borderRadius: '50% 45% 55% 50%', background: DOODLE_RED }} />
}

// Each doodle is placed relative to its cat (percent of the cat box) with its own tilt
const DOODLES = {
  left: [
    { el: <Star size={21} />,     top: '-34%', left: '-30%', rotate: -17 },
    { el: <Sparkle size={14} />,  top: '-44%', left: '58%',  rotate: 11 },
    { el: <Squiggle width={32} />, top: '104%', left: '-46%', rotate: -24 },
    { el: <Burst size={18} />,    top: '-20%', left: '98%',  rotate: 28 },
  ],
  right: [
    { el: <Sparkle size={18} />,  top: '-40%', left: '92%',  rotate: 13 },
    { el: <Star size={13} />,     top: '-8%',  left: '-38%', rotate: 22 },
    { el: <Loop size={27} />,     top: '108%', left: '58%',  rotate: 9 },
    { el: <Burst size={16} />,    top: '-38%', left: '10%',  rotate: -32 },
  ],
}

function DoodledCat({ side, src }: { side: 'left' | 'right'; src: string }) {
  return (
    <div className={`hero-cat hero-cat-${side}`} style={{ position: 'relative' }}>
      <img src={src} alt="" aria-hidden="true" style={{ width: '100%', height: 'auto', display: 'block' }} />
      {DOODLES[side].map((d, i) => (
        <span key={i} className="hero-doodle" style={{ position: 'absolute', top: d.top, left: d.left, transform: `rotate(${d.rotate}deg)`, lineHeight: 0 }}>
          {d.el}
        </span>
      ))}
    </div>
  )
}

// CTA hover doodles — hand-picked "random" arrangements, one per card (fixed, so server and
// client render the same thing)
const CTA_DOODLE_SETS: { el: React.ReactNode; pos: React.CSSProperties; rotate: number; delay: number }[][] = [
  [
    { el: <Burst size={16} />,   pos: { top: -4, left: -24 },     rotate: -70, delay: 0 },
    { el: <Sparkle size={13} />, pos: { top: -20, right: -12 },   rotate: 8,   delay: 80 },
    { el: <Squiggle width={20} />, pos: { bottom: -12, right: -22 }, rotate: -16, delay: 140 },
  ],
  [
    { el: <Star size={13} />,     pos: { top: -20, left: '30%' },  rotate: 18,  delay: 40 },
    { el: <Squiggle width={24} />, pos: { bottom: -14, right: -8 }, rotate: -10, delay: 0 },
    { el: <Dot />,                pos: { top: 2, right: -16 },     rotate: 0,   delay: 110 },
    { el: <Sparkle size={9} />,   pos: { top: -4, left: -16 },     rotate: 8,   delay: 80 },
  ],
  [
    { el: <Burst size={16} />,   pos: { top: -18, left: -20 },     rotate: -28, delay: 0 },
    { el: <Sparkle size={14} />, pos: { top: -14, right: -22 },    rotate: 12,  delay: 90 },
    { el: <Dot />,               pos: { bottom: -10, left: '55%' }, rotate: 0,  delay: 140 },
  ],
  [
    { el: <Loop size={24} />,    pos: { top: -18, right: -30 },    rotate: -6,  delay: 30 },
    { el: <Star size={10} />,    pos: { bottom: -10, left: -18 },  rotate: -20, delay: 0 },
    { el: <Sparkle size={11} />, pos: { top: -16, left: '12%' },   rotate: 20,  delay: 100 },
    { el: <Dot />,               pos: { bottom: -8, right: '20%' }, rotate: 0,  delay: 150 },
  ],
  [
    { el: <Sparkle size={15} />, pos: { top: -18, right: -18 },    rotate: -8,  delay: 0 },
    { el: <Star size={12} />,    pos: { top: -12, left: -22 },     rotate: 26,  delay: 70 },
    { el: <Burst size={13} />,   pos: { bottom: -14, right: '35%' }, rotate: 180, delay: 120 },
  ],
]

// ── Projects ──────────────────────────────────────────────────────────────────
const projects = [
  {
    id: 1,
    category: 'AgTech · End-to-End',
    title: 'Digital Loan Application',
    description: 'From paper forms to a fully self-serve digital loan experience.',
    bg: '#D8EBD2',
    image: '/case%20studies/digital%20loan%20application/Cover.png',
    imagePos: 'center',
    imageFit: 'contain', // show the whole row of phones instead of cropping the outer ones
    href: '/work/digital-loan-application',
  },
  {
    id: 2,
    category: 'Enterprise · Web Design',
    title: 'Finance Platform Redesign',
    description: 'Redesigning an internal enterprise tool to centralize workflows, modernize the UI, and improve usability for Finance and Data users at Capital One.',
    bg: '#D2E8EA',
    image: '/case%20studies/finance%20platform%20redesign/hero.png',
    imagePos: 'center',
    imageFit: 'contain',
    imagePad: '7%',
    href: '/work/finance-platform-redesign',
  },
  {
    id: 3,
    category: 'AgTech · Research',
    title: "Research to Roadmap: Defining FBN's First Finance Archetypes",
    description: "How generative research closed a critical knowledge gap and became the foundation for FBN's finance design decisions.",
    bg: '#E8EDE8',
    image: '/case studies/fbn finance archetypes/Hero.png',
    imagePos: 'top center',
    href: '/work/fbn-finance-archetypes',
  },
  {
    id: 4,
    category: 'Fintech · Web · Data Visualization',
    title: 'Bank Reconciliation',
    description: 'Redesigning the bank reconciliation feature that cut reconcile time by 35%.',
    bg: '#E0DCF0',
    image: '/case studies/bank reconciliation/cover.png',
    imagePos: 'center',
    href: 'https://www.figma.com/proto/2Kys8Q12zNKQzmreAhvLxr/Bank-Reconciliation?page-id=0%3A1&node-id=0-202&node-type=canvas&viewport=2285%2C258%2C0.13&t=iULq9RIBfJr5Vadz-1&scaling=contain&content-scaling=fixed',
    target: '_blank',
  },
  {
    id: 5,
    category: 'Branding · Identity',
    title: 'Logo Design',
    description: 'A collection of logo and brand mark work across personal projects and freelance clients.',
    bg: '#F5ECCB',
    // Cover: a 3×2 wall of logos on white tiles
    customContent: (
      <div style={{
        position: 'absolute', inset: 0, padding: '17% 19%',
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: 10,
      }}>
        {['logo_megi.png', 'logo_acheva.png', 'logo_lightning expense.png', 'logo_EA.png', 'logo_pospal.png', 'logo_startupweekend_chengdu.png'].map(file => (
          <div key={file} style={{ background: '#FFFFFF', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12%', overflow: 'hidden' }}>
            <img
              src={`/case%20studies/logo%20design/${encodeURIComponent(file)}`}
              alt=""
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
            />
          </div>
        ))}
      </div>
    ),
    href: '/work/logo-design',
  },
]

// ── Tile — "print": white-bordered image, zigzag rows ──

function ProjectTile({
  project,
  index,
}: {
  project: typeof projects[number]
  index: number
}) {
  const [hovered, setHovered] = useState(false)
  const p = project as any
  const Tag: any = p.href ? 'a' : 'div'
  const imageRight = index % 2 === 1

  return (
    <Tag
      href={p.href}
      target={p.target}
      rel={p.target ? 'noopener noreferrer' : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`tile ${imageRight ? 'tile--flip' : ''}`}
      style={{ textDecoration: 'none', cursor: 'pointer', color: 'inherit' }}
    >
      {/* Print — white border, soft shadow */}
      <div className="tile-print" style={{
        background: '#FFFFFF',
        padding: '12px 12px 14px',
        boxShadow: '0 6px 18px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06)',
      }}>
        <div style={{
          width: '100%',
          aspectRatio: '4 / 3',
          background: p.bg || '#E8EDE8',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {'customContent' in project && project.customContent
            ? project.customContent
            : p.image
              ? (
                <img
                  src={p.image}
                  alt={project.title}
                  style={{ width: '100%', height: '100%', objectFit: p.imageFit ?? 'cover', objectPosition: p.imagePos ?? 'center', display: 'block', padding: p.imageFit === 'contain' ? (p.imagePad ?? '4%') : 0, boxSizing: 'border-box' }}
                />
              )
              : null
          }
        </div>
      </div>

      {/* Text */}
      <div className="tile-text">
        <p style={{
          fontFamily: 'var(--sans)',
          fontSize: '0.85rem',
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
          color: 'rgba(0,0,0,0.5)',
          margin: '0 0 0.6rem',
        }}>
          {project.category}
        </p>
        <h3 style={{
          fontFamily: 'var(--heading)',
          fontSize: 'clamp(1.6rem, 2.6vw, 2.15rem)',
          fontWeight: 500,
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          color: 'var(--ink)',
          margin: 0,
        }}>
          {project.title}
        </h3>
        <p style={{
          fontFamily: 'var(--sans)',
          fontSize: '1.125rem',
          color: 'var(--ink)',
          lineHeight: 1.6,
          margin: '0.75rem 0 1.25rem',
        }}>
          {project.description}
        </p>
        <span className="tile-cta" style={{
          fontFamily: 'var(--heading)',
          fontSize: '1.05rem',
          fontWeight: 500,
          color: hovered ? '#C8141A' : '#FD1E20',
          transition: 'color 0.2s ease',
        }}>
          {p.target ? 'View prototype' : 'View case study'}
          {/* Doodles that pop in around the link on hover — a different arrangement per card */}
          {CTA_DOODLE_SETS[index % CTA_DOODLE_SETS.length].map((d, i) => (
            <span key={i} className="cta-doodle" style={{ ...d.pos, ['--r' as any]: `${d.rotate}deg`, transitionDelay: `${d.delay}ms` }}>{d.el}</span>
          ))}
        </span>
      </div>
    </Tag>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <style>{`
        /* Organic Hand needs its own spacing — override the global h1 heading rule */
        h1.hero-title, h2.hand-heading { font-weight: 400 !important; letter-spacing: 0.02em !important; }
        /* Case study tiles — zigzag two-column rows, stacked on phones */
        .tile { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr); gap: clamp(2rem, 5vw, 4.5rem); align-items: center; }
        .tile--flip { grid-template-columns: minmax(0, 1fr) minmax(0, 1.35fr); }
        .tile--flip .tile-print { order: 2; }
        .tile--flip .tile-text { order: 1; text-align: right; }
        @media (max-width: 760px) {
          .tile, .tile--flip { grid-template-columns: 1fr; gap: 1.75rem; }
          .tile--flip .tile-print { order: 0; }
          .tile--flip .tile-text { text-align: left; }
        }
        /* CTA hover — doodles pop in around the link, text gives a little wiggle */
        .tile-cta { position: relative; display: inline-block; }
        .cta-doodle { position: absolute; line-height: 0; pointer-events: none; opacity: 0; transform: scale(0.3) rotate(var(--r)); transition: opacity 0.2s ease, transform 0.35s cubic-bezier(.3,.7,.4,1.6); }
        .tile:hover .cta-doodle { opacity: 1; transform: scale(1) rotate(var(--r)); }
        /* Match the CTA's hover red (hero doodles stay the brighter nav red) */
        .cta-doodle path { stroke: #C8141A; }
        .cta-doodle > span { background: #C8141A !important; }
        @keyframes ctaWiggle {
          0%, 100% { transform: rotate(0deg); }
          30% { transform: rotate(-2.5deg) translateY(-1px); }
          65% { transform: rotate(1.5deg); }
        }
        .tile:hover .tile-cta { animation: ctaWiggle 420ms ease-in-out; }
        @media (prefers-reduced-motion: reduce) {
          .tile:hover .tile-cta { animation: none; }
          .cta-doodle { transition: none; }
        }
        /* Centered hero: one cat on each side of the text */
        .hero-row { display: flex; align-items: center; justify-content: center; gap: clamp(3rem, 8vw, 7rem); text-align: center; }
        .hero-text { display: flex; flex-direction: column; align-items: center; max-width: 720px; order: 2; }
        /* Balance centered lines so no word is left alone on the last line */
        .hero-text p, .hero-text h1 { text-wrap: balance; }
        .hero-cat { width: clamp(66px, 7.8vw, 102px); flex-shrink: 0; }
        .hero-cat-left { order: 1; transform: translate(clamp(-4rem, -4vw, -1rem), -6px) rotate(-9deg); }
        .hero-cat-right { order: 3; transform: translate(clamp(1rem, 4vw, 4rem), 10px) rotate(6deg); }
        @media (max-width: 760px) {
          /* Phone: both cats side by side above the text */
          .hero-row { flex-wrap: wrap; align-items: center; gap: 2.75rem 2.5rem; }
          .hero-text { order: 3; width: 100%; }
          .hero-cat { width: 58px; }
          .hero-cat-left { transform: rotate(-9deg); }
          .hero-cat-right { order: 2; transform: rotate(6deg) translateY(4px); }
          .hero-br, .hero-sep { display: none; }
          .hero-meta { flex-direction: column; }
        }
      `}</style>

      {/* Hero */}
      <section style={{ position: 'relative', background: 'var(--background)', overflowX: 'clip' }}>
        <Nav variant="embedded" />

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '6rem 2rem 5rem' }}>
          <div className="hero-row">
          <div className="hero-text">

            <p style={{
              fontFamily: 'var(--heading)',
              fontSize: 'clamp(1.15rem, 1.8vw, 1.4rem)',
              fontWeight: 300,
              lineHeight: 1.5,
              color: 'var(--ink)',
              margin: '0 0 0.75rem',
            }}>
              Hi, I&apos;m Zhu.
            </p>

            <h1 className="hero-title" style={{
              fontFamily: 'var(--font-organic-hand), var(--heading)',
              fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
              lineHeight: 1.2,
              color: 'var(--ink)',
              textTransform: 'uppercase',
              margin: 0,
            }}>
              A product designer with<br className="hero-br" /> 10 years of experience.
            </h1>

            <p style={{
              fontFamily: 'var(--heading)',
              fontSize: 'clamp(1.15rem, 1.8vw, 1.4rem)',
              fontWeight: 300,
              lineHeight: 1.5,
              color: 'var(--ink)',
              margin: '1.5rem 0 0',
              maxWidth: 480,
            }}>
              Simplicity is my superpower. I turn complex ideas into experiences users love and partners trust.
            </p>

            <p className="hero-meta" style={{
              display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',
              columnGap: '0.75rem', rowGap: '0.25rem',
              fontFamily: 'var(--heading)', fontSize: '1rem', fontWeight: 300, color: 'var(--ink)',
              margin: '2rem 0 0',
            }}>
              <span>Currently at Capital One, San Francisco</span>
              <span aria-hidden="true" className="hero-sep">·</span>
              <span>Experience in Fintech, AgTech</span>
            </p>

          </div>

          <DoodleDefs />
          <DoodledCat side="left" src="/cat-left.png" />
          <DoodledCat side="right" src="/cat-right.png" />
          </div>
        </div>
      </section>

      {/* Case study grid */}
      <section id="work" style={{ maxWidth: 1100, margin: '0 auto', padding: '7rem 2rem 8rem' }}>
        <div style={{ marginBottom: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h2 className="hand-heading" style={{
            fontFamily: 'var(--font-organic-hand), var(--heading)',
            textTransform: 'uppercase',
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            fontWeight: 400,
            color: 'var(--ink)',
            marginBottom: '0.6rem',
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
          }}>
            Selected Work
          </h2>
          <svg width="140" height="6" viewBox="0 0 140 6" aria-hidden="true" style={{ display: 'block' }}>
            <path
              d="M2,4 C20,2 42,5 64,3.5 C86,2 108,5 128,3 C133,2.5 137,4 138,3.5"
              fill="none" stroke="var(--border)" strokeWidth="1" strokeLinecap="round"
            />
          </svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7rem' }}>
          {projects.map((project, i) => (
            <ProjectTile key={project.id} project={project} index={i} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        maxWidth: 1100,
        margin: '0 auto',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap' as const,
        gap: '1rem',
      }}>
        <span style={{ fontFamily: 'var(--heading)', fontSize: '0.95rem', color: 'var(--ink)' }}>
          Zhu Nan
        </span>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[{ label: 'LinkedIn', href: '#' }, { label: 'Resume', href: '#' }].map(link => (
            <a key={link.label} href={link.href}
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '0.75rem',
                color: 'var(--muted)',
                textDecoration: 'none',
                letterSpacing: '0.06em',
                textTransform: 'uppercase' as const,
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
            >
              {link.label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  )
}

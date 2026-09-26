'use client'

import { useEffect, useRef, useState } from 'react'
import Nav from './components/Nav'
import { DoodleDefs, Star, Sparkle, Squiggle, Loop, Burst, Dot } from './components/Doodles'

// ── Hero doodles — placement of the shared doodles around the cats ──
// Each doodle is placed relative to its cat (percent of the cat box) with its own tilt
const DOODLES = {
  left: [
    { el: <Star size={21} />,     top: '-34%', left: '-30%', rotate: -17 },
    { el: <Sparkle size={14} />,  top: '-44%', left: '58%',  rotate: 11 },
    { el: <Squiggle width={32} />, top: '104%', left: '-46%', rotate: -24 },
  ],
  right: [
    { el: <Sparkle size={18} />,  top: '-40%', left: '92%',  rotate: 13 },
    { el: <Star size={13} />,     top: '-8%',  left: '-38%', rotate: 22 },
    { el: <Loop size={27} />,     top: '108%', left: '58%',  rotate: 9 },
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
          {p.image
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
  // Always land at the very top (nav + hero). On phones, arriving from the password page
  // could keep the scroll offset from the keyboard/focused field and start just below the nav.
  useEffect(() => {
    if (window.location.hash) return
    window.scrollTo(0, 0)
    const t = setTimeout(() => window.scrollTo(0, 0), 60)
    return () => clearTimeout(t)
  }, [])
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
              maxWidth: 640,
            }}>
              I turn complex ideas into simple, trusted experiences.
            </p>

            <p className="hero-meta" style={{
              display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',
              columnGap: '0.75rem', rowGap: '0.25rem',
              fontFamily: 'var(--heading)', fontSize: '1rem', fontWeight: 300, color: 'var(--ink)',
              margin: '2rem 0 0',
            }}>
              <span>Principal Designer at Capital One</span>
              <span aria-hidden="true" className="hero-sep">·</span>
              <span>Fintech &amp; AgTech</span>
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
          {[{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/zhunan/' }, { label: 'Resume', href: '/Zhu_Nan_Resume_2025.html' }].map(link => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
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

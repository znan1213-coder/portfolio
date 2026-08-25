'use client'

import { useEffect, useRef, useState } from 'react'
import Nav from './components/Nav'

// ── Hero tag chip — flat rectangle, slight rotation, washi-tape corner accent ───
function TagChip({
  label, bg, textColor, fontFamily, fontWeight, rotate, tapeColor, tapeRotate,
}: {
  label: string
  bg: string
  textColor: string
  fontFamily: string
  fontWeight: number
  rotate: number
  tapeColor: string
  tapeRotate: number
}) {
  return (
    <div style={{ position: 'relative', display: 'inline-block', transform: `rotate(${rotate}deg)` }}>
      {/* Washi tape accent — overlaps the top-left corner at an opposing angle */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: -8, left: 10, width: 38, height: 14,
        background: tapeColor, opacity: 0.88,
        transform: `rotate(${tapeRotate}deg)`,
        boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
        zIndex: 2,
      }} />
      <div style={{
        position: 'relative', zIndex: 1,
        background: bg, color: textColor,
        padding: '0.55rem 1.1rem',
        fontFamily, fontWeight,
        fontSize: '0.8rem', letterSpacing: '0.02em',
        boxShadow: '0 4px 10px rgba(0,0,0,0.18)',
        whiteSpace: 'nowrap' as const,
      }}>
        {label}
      </div>
    </div>
  )
}

// ── Hero bottom wave — hand-drawn transition into the white content below ───────
function HeroWave() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 'clamp(50px, 8vw, 100px)', display: 'block' }}
    >
      {/* Diagonal brush-stroke sweep — deep gold on the left, tapering shallow toward the right,
          with small irregular wobbles layered on top of the overall tilt (not a centered dip) */}
      <path
        d="M0,90
           C90,80 140,72 180,75
           C230,79 300,88 340,82
           C420,72 480,58 560,55
           C640,52 700,64 760,60
           C860,54 930,40 980,35
           C1060,28 1120,22 1180,20
           C1260,16 1340,10 1440,8
           L1440,100 L0,100 Z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

// ── Projects ──────────────────────────────────────────────────────────────────
const projects = [
  {
    id: 1,
    category: 'AgTech · End-to-End',
    title: 'Digital Loan Application',
    description: 'From paper forms to a fully self-serve digital loan experience.',
    bg: '#E8EDE8',
    image: '/case%20studies/digital%20loan%20application/Cover.png',
    imagePos: 'top center',
    href: '/work/digital-loan-application',
  },
  {
    id: 2,
    category: 'Enterprise · Web Design',
    title: 'Finance Platform Redesign',
    description: 'Redesigning an internal enterprise tool to centralize workflows, modernize the UI, and improve usability for Finance and Data users at Capital One.',
    bg: '#B0C4D4',
    image: '/case%20studies/finance%20platform%20redesign/hero.png',
    imagePos: 'top center',
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
    bg: '#DAE0E5',
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
    bg: '#F5EFE6',
    customContent: (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '6rem', color: 'var(--accent)', lineHeight: 1 }}>✦</span>
      </div>
    ),
    href: '/work/logo-design',
  },
]

// ── Tile — one per row, ivory card with a washi-tape corner accent ──────────────
const TAPE_COLORS = ['#B5522A', '#0B1E3F', '#4B5A24'] // terracotta, navy, olive — cycles per card
const TAPE_ROTATIONS = [-4, 3] // alternates per card

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
  const tapeColor = TAPE_COLORS[index % TAPE_COLORS.length]
  const tapeRotate = TAPE_ROTATIONS[index % TAPE_ROTATIONS.length]

  return (
    <Tag
      href={p.href}
      target={p.target}
      rel={p.target ? 'noopener noreferrer' : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexWrap: 'wrap' as const,
        alignItems: 'flex-start',
        gap: '2rem',
        textDecoration: 'none',
        cursor: 'pointer',
      }}
    >
      {/* Image card — left column. The tape sits on this OUTER wrapper (no overflow:hidden
          here), while the border/radius/overflow-clip lives on the INNER box around just the
          image — otherwise the card's own clipping cuts off the tape poking past its edge. */}
      <div style={{ position: 'relative', flex: '1 1 640px', maxWidth: 820 }}>
        <div aria-hidden="true" style={{
          position: 'absolute', top: -13, left: 22, width: 76, height: 26,
          background: tapeColor, opacity: 0.9,
          transform: `rotate(${tapeRotate}deg)`,
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          zIndex: 2,
        }} />
        <div style={{
          position: 'relative',
          background: '#F7F3E3',
          border: '1px solid #000000',
          borderRadius: 4,
          overflow: 'hidden',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: hovered ? '0 10px 22px rgba(0,0,0,0.12)' : '0 2px 6px rgba(0,0,0,0.05)',
        }}>
          <div style={{
            width: '100%',
            height: 'clamp(420px, 62vh, 660px)',
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
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: p.imagePos ?? 'center',
                      display: 'block',
                    }}
                  />
                )
                : null
            }
          </div>
        </div>
      </div>

      {/* Text — right column, outside the card */}
      <div style={{ flex: '1 1 320px', paddingTop: '0.5rem' }}>
        <p style={{
          fontFamily: 'var(--sans)',
          fontSize: '0.65rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase' as const,
          color: 'var(--muted)',
          marginBottom: '0.5rem',
        }}>
          {project.category}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
          <h3 style={{
            fontFamily: 'var(--playfair)',
            fontSize: '1.5rem',
            fontWeight: 600,
            fontStyle: 'normal',
            lineHeight: 1.25,
            color: 'var(--ink)',
            margin: 0,
            flex: 1,
          }}>
            {project.title}
          </h3>
          <span style={{
            fontFamily: 'var(--sans)',
            fontSize: '1.1rem',
            color: hovered ? '#B5522A' : 'var(--border)',
            transition: 'color 0.2s ease',
            flexShrink: 0,
            marginTop: '0.2rem',
            lineHeight: 1,
          }}>
            →
          </span>
        </div>
        <p style={{
          fontFamily: 'var(--sans)',
          fontSize: '0.9rem',
          color: '#555',
          lineHeight: 1.65,
          marginTop: '0.6rem',
          marginBottom: 0,
        }}>
          {project.description}
        </p>
      </div>
    </Tag>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <style>{`
        .hero-cat {
          /* Base position solved from the HeroWave bezier at this x (~79.6% of the section
             width, curve tangent ~-3.2deg), then nudged further down from that point per
             request to sit closer into the wave rather than floating above it. */
          position: absolute; left: 79.6%; z-index: 3;
          width: clamp(96px, 13vw, 150px);
          bottom: calc(clamp(50px, 8vw, 100px) * 0.29);
          transform: translateX(-50%) rotate(-3.2deg);
          pointer-events: none;
        }
        @media (max-width: 760px) {
          .hero-cat { display: none; }
        }
      `}</style>

      {/* Hero — full-bleed gold section */}
      <section style={{ position: 'relative', background: 'var(--accent)', overflow: 'hidden' }}>

        {/* Subtle grain — takes the flat gold off "perfectly digital", same noise SVG technique
            used for the yarn photo texture on the about page, just much lower opacity here */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, opacity: 0.05, mixBlendMode: 'overlay', pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />

        <Nav variant="embedded" />

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '6rem 2rem 16.5rem', position: 'relative' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4rem', maxWidth: 720 }}>

            <h1 style={{
              fontFamily: 'var(--serif)',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: 'clamp(1.65rem, 3.5vw, 2.75rem)',
              lineHeight: 1.18,
              letterSpacing: '-0.01em',
              margin: 0,
            }}>
              {/* Marcellus only ships in one static weight (400, same as "Selected Work"), so the
                  lighter second line reads lighter via reduced-contrast color instead of font-weight */}
              <span style={{ color: '#000000' }}>Currently designing finance products at Capital One.</span>{' '}
              <span style={{ color: 'rgba(0,0,0,0.62)' }}>Previously at Farmers Business Network and Megi, across fintech and agtech.</span>
            </h1>

            <div style={{ display: 'flex', flexWrap: 'wrap' as const, alignItems: 'center', gap: '0.9rem 0.85rem' }}>
              <TagChip
                label="Principal Product Designer, Capital One"
                bg="#B5522A" textColor="#FFFFFF"
                fontFamily="var(--mono)" fontWeight={400}
                rotate={-2} tapeColor="var(--muted)" tapeRotate={7}
              />
              <TagChip
                label="10 yrs · fintech + agtech"
                bg="#4B5A24" textColor="#FFFFFF"
                fontFamily="var(--mono)" fontWeight={400}
                rotate={2} tapeColor="var(--muted)" tapeRotate={6}
              />
              <TagChip
                label="Bay Area"
                bg="#0B1E3F" textColor="#FFFFFF"
                fontFamily="var(--mono)" fontWeight={400}
                rotate={-2} tapeColor="#7A2361" tapeRotate={-7}
              />
            </div>

          </div>
        </div>

        <HeroWave />

        {/* Cat illustration (reused from the mobile nav overlay) — draped over the wave edge,
            paws hanging over the curve, layered above both the gold bg and the wave shape */}
        <div className="hero-cat">
          <img src="/menu.png" alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
      </section>

      {/* Case study grid */}
      <section id="work" style={{ maxWidth: 1100, margin: '0 auto', padding: '5rem 2rem 8rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontFamily: 'var(--serif)',
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
        <span style={{ fontFamily: 'var(--serif)', fontSize: '0.95rem', color: 'var(--ink)' }}>
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

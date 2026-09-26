'use client'

import { useState } from 'react'
import Nav from '../components/Nav'
import { DoodleDefs, Star, Sparkle, Squiggle, Burst, Dot } from '../components/Doodles'

// ── Contact links — red text links; doodles pop in around each one on hover ──
const CONTACTS: { label: string; href: string; external?: boolean; copy?: string; doodles: { el: React.ReactNode; pos: React.CSSProperties; rotate: number; delay: number }[] }[] = [
  {
    label: 'Email', href: 'mailto:zhunan08@gmail.com', copy: 'zhunan08@gmail.com',
    doodles: [
      { el: <Sparkle size={11} />, pos: { top: -14, left: -14 }, rotate: -10, delay: 0 },
      { el: <Dot />,               pos: { bottom: -6, right: -12 }, rotate: 0, delay: 80 },
    ],
  },
  {
    label: 'LinkedIn', href: 'https://www.linkedin.com/in/zhunan/', external: true,
    doodles: [
      { el: <Burst size={14} />,   pos: { top: -16, right: -16 }, rotate: 20, delay: 0 },
      { el: <Squiggle width={18} />, pos: { bottom: -12, left: -6 }, rotate: -8, delay: 90 },
    ],
  },
  {
    label: 'Resume', href: '/Zhu_Nan_Resume_2025.html', external: true,
    doodles: [
      { el: <Star size={11} />,    pos: { top: -14, right: -14 }, rotate: 14, delay: 0 },
      { el: <Sparkle size={9} />,  pos: { bottom: -8, left: -14 }, rotate: 8, delay: 70 },
    ],
  },
]

// Email button — reads "Email"; hovering (or tapping) reveals a small card with the
// address and a copy action. Clicking the button itself also copies.
function CopyEmail({ email, children }: { email: string; children: React.ReactNode }) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
    } catch {
      // Fallback for browsers that block the clipboard API
      const t = document.createElement('textarea'); t.value = email; document.body.appendChild(t); t.select()
      document.execCommand('copy'); t.remove()
    }
    setCopied(true)
    setOpen(true)
    setTimeout(() => setCopied(false), 1600)
  }
  return (
    <span className={`email-wrap ${open ? 'is-open' : ''}`} onMouseLeave={() => setOpen(false)}>
      <button type="button" onClick={copy} className="contact-link contact-btn copy-btn" aria-describedby="email-pop">
        Email
        {children}
      </button>
      <span id="email-pop" role="tooltip" className="email-pop">
        <span style={{ fontFamily: 'var(--sans)', fontSize: '0.95rem', color: 'var(--ink)' }}>{email}</span>
        <button type="button" onClick={copy} className="email-pop-copy" aria-label={`Copy ${email}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {copied
              ? <path d="M4,12.5 L9.5,18 L20,6" />
              : <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16,8 L16,5 C16,4.4 15.6,4 15,4 L5,4 C4.4,4 4,4.4 4,5 L4,15 C4,15.6 4.4,16 5,16 L8,16" /></>}
          </svg>
          <span aria-live="polite">{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </span>
    </span>
  )
}

const EXPERIENCE: { years: string; role: string; company: string; url?: string }[] = [
  { years: '2024 – Present', role: 'Principal Designer', company: 'Capital One' },
  { years: '2021 – 2024', role: 'Senior Product Designer', company: 'Farmers Business Network', url: 'https://www.fbn.com/financing' },
  { years: '2015 – 2019', role: 'Product Designer', company: 'MegiChina', url: 'https://www.megichina.com/' },
  { years: '2013 – 2015', role: 'Visual Designer', company: 'Various Startups' },
]

const YARN_PHOTOS = ['/about 1.jpg', '/about 3.jpg', '/about 2.JPG']

// Doodles around the portrait print — same shared red ink as the homepage cats
const PORTRAIT_DOODLES = [
  { el: <Star size={20} />,     top: '-5%', left: '-9%',  rotate: -14 },
  { el: <Sparkle size={15} />,  top: '-8%', left: '88%',  rotate: 10 },
  { el: <Squiggle width={30} />, top: '98%', left: '72%', rotate: 12 },
  { el: <Burst size={16} />,    top: '84%', left: '-10%', rotate: -30 },
]

// Organic Hand heading style (caps); its own weight/spacing override the global h1/h2 rule
const HAND_HEADING: React.CSSProperties = {
  fontFamily: 'var(--font-organic-hand), var(--heading)',
  textTransform: 'uppercase',
  fontWeight: 400,
  color: 'var(--ink)',
  lineHeight: 1.15,
  margin: 0,
}

const PRINT: React.CSSProperties = {
  background: '#FFFFFF',
  padding: '12px 12px 14px',
  boxShadow: '0 6px 18px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06)',
}

export default function About() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <style>{`
        h1.hand-heading, h2.hand-heading { font-weight: 400 !important; letter-spacing: 0.02em !important; }

        .about-hero { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); gap: clamp(2.5rem, 6vw, 5.5rem); align-items: start; }
        .about-side { justify-self: end; width: 100%; max-width: 290px; }
        .about-portrait { position: relative; width: 100%; }
        .about-portrait .hero-doodle { position: absolute; line-height: 0; }
        @media (max-width: 760px) {
          .about-hero { grid-template-columns: 1fr; gap: 2.5rem; }
          /* Phone: photo first, then bio, then contact links */
          .about-side { display: contents; }
          .about-portrait { order: -1; max-width: 220px; }
          .about-contact { margin-top: 0 !important; }
        }

        .contact-link { position: relative; display: inline-block; font-family: var(--heading); font-size: 1.05rem; font-weight: 500; color: #FD1E20; text-decoration: none; transition: color 0.2s ease; }
        .contact-link:hover { color: #C8141A; }
        .contact-doodle { position: absolute; line-height: 0; pointer-events: none; opacity: 0; transform: scale(0.3) rotate(var(--r)); transition: opacity 0.2s ease, transform 0.35s cubic-bezier(.3,.7,.4,1.6); }
        .contact-link:hover .contact-doodle { opacity: 1; transform: scale(1) rotate(var(--r)); }
        .contact-doodle path { stroke: #C8141A; }
        .contact-doodle > span { background: #C8141A !important; }
        @keyframes contactWiggle { 0%, 100% { transform: rotate(0deg); } 30% { transform: rotate(-2.5deg) translateY(-1px); } 65% { transform: rotate(1.5deg); } }
        .contact-link:hover { animation: contactWiggle 420ms ease-in-out; }
        @media (prefers-reduced-motion: reduce) {
          .contact-link:hover { animation: none; }
          .contact-doodle { transition: none; }
        }

        /* Hero contact links — "sticker": thin black outline + solid red offset shadow that presses in on hover */
        .contact-btn { padding: 0.45rem 0.95rem; font-size: 1rem; background: #FFFFFF; border: 1.6px solid #1A1A1A; border-radius: 10px; box-shadow: 4px 4px 0 #FD1E20; transition: transform 0.15s ease, box-shadow 0.15s ease, color 0.2s ease; }
        .copy-btn { cursor: pointer; font-family: var(--heading); font-weight: 500; line-height: normal; }
        /* Email hover card — sits above the button; a transparent bridge keeps it open while moving onto it */
        .email-wrap { position: relative; display: inline-block; }
        .email-pop { position: absolute; bottom: calc(100% + 12px); left: 0; z-index: 20; display: flex; align-items: center; gap: 0.75rem; white-space: nowrap;
          background: #FFFFFF; border: 1.6px solid #1A1A1A; border-radius: 10px; box-shadow: 4px 4px 0 #FD1E20; padding: 0.5rem 0.6rem 0.5rem 0.9rem;
          opacity: 0; transform: translateY(6px); pointer-events: none; transition: opacity 0.18s ease, transform 0.18s ease; }
        .email-pop::after { content: ''; position: absolute; left: 0; right: 0; top: 100%; height: 14px; }
        .email-wrap:hover .email-pop, .email-wrap:focus-within .email-pop, .email-wrap.is-open .email-pop { opacity: 1; transform: translateY(0); pointer-events: auto; }
        .email-pop-copy { display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer; border: 0; border-radius: 7px; background: #FD1E20; color: #FFFFFF;
          font-family: var(--heading); font-size: 0.85rem; font-weight: 500; padding: 0.3rem 0.6rem; transition: background 0.15s ease; }
        .email-pop-copy:hover { background: #C8141A; }
        .contact-btn:hover { transform: translate(2px, 2px); box-shadow: 2px 2px 0 #C8141A; animation: none; }
        @media (prefers-reduced-motion: reduce) { .contact-btn:hover { transform: none; } }

        .exp-company-link { color: var(--ink); text-decoration: underline; text-decoration-color: rgba(253,30,32,0.55); text-decoration-thickness: 1.5px; text-underline-offset: 4px; transition: color 0.15s ease, text-decoration-color 0.15s ease; }
        .exp-company-link:hover { color: #C8141A; text-decoration-color: #C8141A; }

        .exp-row { display: grid; grid-template-columns: 160px 1fr; gap: 1.5rem; align-items: baseline; padding: 1.1rem 0; border-top: 1px solid rgba(0,0,0,0.08); }
        .exp-row:last-child { border-bottom: 1px solid rgba(0,0,0,0.08); }
        @media (max-width: 760px) { .exp-row { grid-template-columns: 1fr; gap: 0.25rem; } }

        .yarn-photos { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(1rem, 3vw, 2rem); }
        @media (max-width: 760px) { .yarn-photos { grid-template-columns: 1fr 1fr; } .yarn-photos > :last-child { grid-column: 1 / span 2; } }
      `}</style>
      <DoodleDefs />
      <Nav activePage="about" />

      {/* ── Intro ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '7.5rem 2rem 3rem', overflowX: 'clip' }}>
        <div className="about-hero">
          <div>
            <h1 className="hand-heading" style={{ ...HAND_HEADING, fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', margin: '0.75rem 0 2rem' }}>
              About me
            </h1>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '1.125rem', color: 'var(--ink)', lineHeight: 1.75, margin: '0 0 1.25rem' }}>
              I&apos;m Zhu, a product designer in the Bay Area. I&apos;m currently designing on Capital One&apos;s Enterprise Finance team, where I focus on making complex workflows clearer and easier for our financial analysts to use every day.
            </p>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '1.125rem', color: 'var(--ink)', lineHeight: 1.75, margin: 0 }}>
              I started my career in startups, which taught me to move fast, be scrappy and stay close to users, and only design what truly matters. Working in a large enterprise has expanded that perspective, I&apos;ve learned how to design for scale, collaborate across many teams, and create solutions that last.
            </p>
          </div>

          {/* Right column — portrait print, then contact links */}
          <div className="about-side">
            <div className="about-portrait">
              <div style={PRINT}>
                <img src="/my face.JPG" alt="Zhu Nan" style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', objectPosition: '55% 48%', display: 'block' }} />
              </div>
              {PORTRAIT_DOODLES.map((d, i) => (
                <span key={i} className="hero-doodle" style={{ top: d.top, left: d.left, transform: `rotate(${d.rotate}deg)` }}>{d.el}</span>
              ))}
            </div>

            <div className="about-contact" style={{ marginTop: '1.75rem' }}>
              <p style={{ fontFamily: 'var(--font-organic-hand), var(--heading)', fontSize: '1.35rem', letterSpacing: '0.02em', color: 'var(--ink)', margin: '0 0 1rem' }}>
                Get in touch :)
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.9rem 0.8rem' }}>
                {CONTACTS.map(c => {
                  const doodles = c.doodles.map((d, i) => (
                    <span key={i} className="contact-doodle" style={{ ...d.pos, ['--r' as any]: `${d.rotate}deg`, transitionDelay: `${d.delay}ms` }}>{d.el}</span>
                  ))
                  return c.copy ? (
                    <CopyEmail key={c.label} email={c.copy}>{doodles}</CopyEmail>
                  ) : (
                    <a key={c.label} href={c.href} className="contact-link contact-btn"
                      {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                      {c.label}
                      {doodles}
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Experience ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 2rem 7rem' }}>
        <h2 className="hand-heading" style={{ ...HAND_HEADING, fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', marginBottom: '1.75rem' }}>
          Experience
        </h2>
        <div>
          {EXPERIENCE.map(e => (
            <div key={e.company} className="exp-row">
              <span style={{ fontFamily: 'var(--sans)', fontSize: '1.05rem', color: 'rgba(0,0,0,0.55)', whiteSpace: 'nowrap' }}>
                {e.years}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '0.25rem 0.75rem' }}>
                <span style={{ fontFamily: 'var(--heading)', fontSize: '1.25rem', fontWeight: 500, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
                  {e.role}
                </span>
                {e.url ? (
                  <a href={e.url} target="_blank" rel="noopener noreferrer" className="exp-company-link"
                    style={{ fontFamily: 'var(--sans)', fontSize: '1.05rem' }}>
                    {e.company}
                  </a>
                ) : (
                  <span style={{ fontFamily: 'var(--sans)', fontSize: '1.05rem', color: 'var(--ink)' }}>
                    {e.company}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Yarn ── */}
      <section style={{ background: '#FAF4DF', padding: 'clamp(4rem, 8vw, 6.5rem) 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 className="hand-heading" style={{ ...HAND_HEADING, fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', marginBottom: '1.25rem' }}>
            I work so I can buy nice yarns
          </h2>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '1.125rem', color: 'var(--ink)', lineHeight: 1.75, maxWidth: 580, margin: '0 0 3.5rem' }}>
            I am a wannabe knitwear designer. If you look into my bag, there&apos;s a good chance you&apos;ll find a work-in-progress knitting project in there.
          </p>
          <div className="yarn-photos">
            {YARN_PHOTOS.map(src => (
              <div key={src} style={PRINT}>
                <img src={src} alt="" style={{ width: '100%', aspectRatio: '4 / 5', objectFit: 'cover', display: 'block' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        maxWidth: 1100, margin: '0 auto', padding: '2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
      }}>
        <span style={{ fontFamily: 'var(--font-organic-hand), var(--heading)', textTransform: 'uppercase', fontSize: '1.4rem', letterSpacing: '0.02em', color: 'var(--ink)' }}>
          Zhu Nan
        </span>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/zhunan/' }, { label: 'Resume', href: '/Zhu_Nan_Resume_2025.html' }].map(link => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="contact-link" style={{ fontSize: '0.95rem' }}>
              {link.label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  )
}

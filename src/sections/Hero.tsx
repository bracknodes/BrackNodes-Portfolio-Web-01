import React, { useEffect, useRef } from 'react';
import { ArrowDown, ArrowUpRight, Code2, Cpu, Globe, Zap } from 'lucide-react';
import gsap from 'gsap';
import { HeroScene } from '../three/HeroScene';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useCMS } from '../context/CMSContext';
import { useTheme } from '../hooks/useTheme';

const MARQUEE_ITEMS = [
  'DISCORD BOT HOSTING',
  'NVME CPANEL HOSTING',
  '99.99% UPTIME SLA',
  'PTERODACTYL PANEL',
  'DDOS SHIELD PROTECTION',
  'CLOUD VPS COMPUTE',
  'STARTING AT ₹29/MO',
  '24/7 TECHNICAL SUPPORT',
];

const STAT_CARDS = [
  { icon: <Zap size={14} />,   value: '₹29/mo', label: 'Starter Price' },
  { icon: <Globe size={14} />, value: '99.99%', label: 'Uptime SLA' },
  { icon: <Cpu size={14} />,   value: '< 15ms',  label: 'India Latency' },
  { icon: <Code2 size={14} />, value: '24/7/365', label: 'Active Support' },
];

export const Hero: React.FC = () => {
  const { siteSettings } = useCMS();
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef   = useRef<HTMLDivElement>(null);
  const headRef    = useRef<HTMLHeadingElement>(null);
  const introRef   = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const statsRef   = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(badgeRef.current,   { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.05, clearProps: 'opacity,transform' })
        .fromTo(headRef.current,    { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, clearProps: 'opacity,transform' }, '-=0.35')
        .fromTo(introRef.current,   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, clearProps: 'opacity,transform' }, '-=0.45')
        .fromTo(actionsRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, clearProps: 'opacity,transform' }, '-=0.4')
        .fromTo(statsRef.current,   { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, clearProps: 'opacity,transform' }, '-=0.35');
    }, containerRef);
    return () => ctx.revert();
  }, [prefersReduced]);

  const hSettings = siteSettings.heroSettings;
  const primaryCtaText = hSettings?.primaryCtaText || 'View Hosting Plans';
  const primaryCtaLink = hSettings?.primaryCtaLink || '#projects';
  const secondaryCtaText = hSettings?.secondaryCtaText || 'Get Started Now';
  const secondaryCtaLink = hSettings?.secondaryCtaLink || '#contact';

  const activeStats = (hSettings?.stats && hSettings.stats.length > 0)
    ? hSettings.stats
    : STAT_CARDS;

  const activeMarquee = (hSettings?.marqueeItems && hSettings.marqueeItems.length > 0)
    ? hSettings.marqueeItems
    : MARQUEE_ITEMS;

  const headlineText = siteSettings.tagline || 'RELIABLE HOSTING FOR EVERYONE.';

  const renderHeadline = (text: string) => {
    // If user explicitly wrapped word in *word* or [word], render with gradient-text
    const parts = text.split(/(\*[^*]+\*|\[[^\]]+\])/g);
    if (parts.length > 1) {
      return parts.map((part, i) => {
        if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('[') && part.endsWith(']'))) {
          const clean = part.slice(1, -1);
          return <span key={i} className="gradient-text">{clean}</span>;
        }
        return <span key={i}>{part}</span>;
      });
    }

    // Default formatting for standard BrackNodes phrase: "RELIABLE HOSTING FOR EVERYONE."
    if (text.trim().toUpperCase() === 'RELIABLE HOSTING FOR EVERYONE.') {
      return (
        <>
          RELIABLE
          <br />
          <span className="gradient-text">HOSTING</span> FOR
          <br />
          EVERYONE.
        </>
      );
    }

    // Default formatting for legacy phrase if still present
    if (text.trim().toUpperCase() === 'IDEAS INTO DIGITAL REALITY.') {
      return (
        <>
          IDEAS
          <br />
          INTO{' '}
          <span className="gradient-text">DIGITAL</span>
          <br />
          REALITY.
        </>
      );
    }

    // If text has newline breaks, respect them:
    if (text.includes('\n')) {
      return text.split('\n').map((line, idx, arr) => (
        <React.Fragment key={idx}>
          {line}
          {idx < arr.length - 1 && <br />}
        </React.Fragment>
      ));
    }

    // If it's a multi-word phrase:
    const words = text.split(' ');
    if (words.length <= 2) return text;

    const mid = Math.floor(words.length / 2);
    return words.map((word, idx) => (
      <React.Fragment key={idx}>
        {idx === mid ? <span className="gradient-text">{word}</span> : word}
        {idx < words.length - 1 ? ' ' : ''}
      </React.Fragment>
    ));
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 'var(--header-height)',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-primary)',
      }}
    >
      {/* Background Layers */}
      <div className="tech-grid-bg" />

      {/* Ambient glows */}
      <div
        className="glow-aurora glow-lime"
        style={{ width: '50vw', height: '50vw', top: '-10%', left: '-8%' }}
      />
      <div
        className="glow-aurora glow-blue"
        style={{ width: '40vw', height: '40vw', bottom: '5%', right: '-5%' }}
      />

      {/* Main two-column layout */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 2,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          paddingTop: 'clamp(1rem, 1.5vw, 1.5rem)',
          paddingBottom: 'clamp(1rem, 1.5vw, 1.5rem)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: 'clamp(2rem, 4vw, 4rem)',
            alignItems: 'center',
            width: '100%',
            maxWidth: '100%',
          }}
        >
          {/* ── Left: Editorial Copy ─────────────────────────── */}
          <div style={{ maxWidth: '680px', minWidth: 0, width: '100%' }}>

            {/* Status Badge */}
            <div ref={badgeRef} style={{ display: 'inline-flex', marginBottom: '1.25rem' }}>
              <span className="badge badge-live">
                <span className="badge-dot" />
                <span style={{ color: 'var(--accent-lime)' }}>
                  {siteSettings.statusBadge || 'All Server Nodes Operational — 99.99% Uptime SLA'}
                </span>
              </span>
            </div>

            {/* Headline */}
            <h1
              ref={headRef}
              className="hero-headline"
              style={{
                fontSize: 'clamp(2rem, 6.5vw, 4.85rem)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
                marginBottom: '1.125rem',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              {renderHeadline(headlineText)}
            </h1>

            {/* Subheading */}
            <p
              ref={introRef}
              style={{
                fontSize: 'clamp(0.9375rem, 1.2vw, 1.1rem)',
                color: 'var(--text-secondary)',
                lineHeight: 1.65,
                maxWidth: '500px',
                marginBottom: '1.75rem',
              }}
            >
              {siteSettings.subheading ||
                'High-speed NVMe cPanel Web Hosting, 24/7 Discord Bot Hosting, and low-latency cloud infrastructure engineered for developers, communities, and businesses. Starting at just ₹29/month.'}
            </p>

            {/* CTA Buttons */}
            <div
              ref={actionsRef}
              className="hero-actions"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                alignItems: 'center',
                marginBottom: 'clamp(1.75rem, 3.5vw, 3rem)',
              }}
            >
              <a href={primaryCtaLink} className="btn btn-primary">
                <span>{primaryCtaText}</span>
                <ArrowDown size={14} />
              </a>
              <a href={secondaryCtaLink} className="btn btn-secondary">
                <span>{secondaryCtaText}</span>
                <ArrowUpRight size={14} />
              </a>
            </div>

            {/* Micro Stats Row */}
            <div
              ref={statsRef}
              className="hero-stats-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${activeStats.length}, 1fr)`,
                gap: '1px',
                background: 'var(--border-subtle)',
                borderRadius: '4px',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {activeStats.map((s, i) => (
                <div
                  key={i}
                  style={{
                    padding: '0.75rem 0.625rem',
                    background: 'var(--bg-elevated)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    textAlign: 'center',
                    transition: 'background var(--t-fast)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-card-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                >
                  <span style={{ color: 'var(--accent-lime)' }}>
                    {'icon' in s ? (s as any).icon : <Zap size={14} />}
                  </span>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      fontSize: 'clamp(1.15rem, 1.8vw, 1.45rem)',
                      color: 'var(--text-primary)',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.1,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    className="mono"
                    style={{
                      fontSize: '0.625rem',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: 3D Canvas ──────────────────────────────── */}
          <div
            className="hero-3d-wrapper"
            style={{
              position: 'relative',
              height: 'clamp(280px, 38vh, 480px)',
              width: '100%',
              maxWidth: '100%',
              minWidth: 0,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              touchAction: 'pan-y',
            }}
          >
            {/* Corner accents */}
            <span className="cyber-crosshair corner-tl" />
            <span className="cyber-crosshair corner-tr" />
            <span className="cyber-crosshair corner-bl" />
            <span className="cyber-crosshair corner-br" />

            {/* Subtle inner glow ring in dark mode */}
            {isDark && (
              <div
                style={{
                  position: 'absolute',
                  inset: '5%',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, var(--accent-lime-muted) 0%, transparent 70%)',
                  pointerEvents: 'none',
                  animation: 'aurora-drift 8s ease-in-out infinite alternate',
                }}
              />
            )}

            <ErrorBoundary>
              <HeroScene />
            </ErrorBoundary>
          </div>
        </div>
      </div>

      {/* ── Marquee Ribbon ─────────────────────────────────────── */}
      <div className="marquee-container" aria-hidden="true">
        <div className="marquee-track">
          {[...activeMarquee, ...activeMarquee].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <span
                className="mono"
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.14em',
                }}
              >
                {item}
              </span>
              <span style={{ color: 'var(--accent-lime)', fontSize: '10px', opacity: 0.7 }}>✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

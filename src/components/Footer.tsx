import React, { useState, useEffect } from 'react';
import { ArrowUp, Terminal } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { useTheme } from '../hooks/useTheme';
import { SocialIcon } from './SocialIcon';

const NAV_LINKS = ['Work', 'About', 'Services', 'Skills', 'Process', 'Contact'];

export const Footer: React.FC = () => {
  const { siteSettings } = useCMS();
  const { isDark } = useTheme();
  const [currentTime, setCurrentTime] = useState('');
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  const currentLogoUrl = isDark
    ? (siteSettings.logoSettings?.darkImageUrl || siteSettings.logoSettings?.imageUrl)
    : (siteSettings.logoSettings?.lightImageUrl || siteSettings.logoSettings?.darkImageUrl || siteSettings.logoSettings?.imageUrl);

  useEffect(() => {
    const update = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      );
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, []);

  const activeSocials = siteSettings.socialLinks && siteSettings.socialLinks.length > 0
    ? siteSettings.socialLinks.filter((s) => s.isEnabled !== false && s.url)
    : [
        { id: 'github', platform: 'github', label: 'GitHub', url: siteSettings.socials?.github || 'https://github.com/bracknodes', color: 'var(--accent-lime)' },
        { id: 'linkedin', platform: 'linkedin', label: 'LinkedIn', url: siteSettings.socials?.linkedin || 'https://www.linkedin.com/company/bracknodes', color: 'var(--accent-blue)' },
        { id: 'instagram', platform: 'instagram', label: 'Instagram', url: siteSettings.socials?.instagram || 'https://www.instagram.com/bracknodes', color: '#E1306C' },
        { id: 'x', platform: 'x', label: 'X/Twitter', url: siteSettings.socials?.x || 'https://x.com/bracknodes', color: 'var(--text-primary)' },
      ].filter((s) => Boolean(s.url));

  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-elevated)',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: 'clamp(2rem, 4vw, 3.5rem)',
        paddingBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background var(--t-slow)',
      }}
    >
      {/* Subtle top glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--accent-lime) 30%, var(--accent-blue) 70%, transparent)',
          opacity: 0.3,
        }}
      />

      <div className="container">
        {/* Main 3-column footer grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'clamp(2rem, 4vw, 4rem)',
            paddingBottom: 'clamp(1.5rem, 3.5vw, 3rem)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          {/* Col 1: Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '1rem' }}>
              {currentLogoUrl &&
              siteSettings.logoSettings?.mode !== 'icon-wordmark' &&
              siteSettings.logoSettings?.showInFooter !== false ? (
                <img
                  src={currentLogoUrl}
                  alt={siteSettings.logoSettings?.altText || siteSettings.wordmark || 'Logo'}
                  style={{
                    height: `${Math.min(siteSettings.logoSettings?.heightPx || 32, 38)}px`,
                    width: 'auto',
                    maxHeight: '40px',
                    objectFit: 'contain',
                    display: 'block',
                    borderRadius: 'var(--radius-sm)',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    background: 'var(--accent-lime-muted)',
                    border: '1px solid var(--border-highlight)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-lime)',
                    flexShrink: 0,
                  }}
                >
                  <Terminal size={15} />
                </div>
              )}
              {(!currentLogoUrl ||
                siteSettings.logoSettings?.mode !== 'image-only' ||
                siteSettings.logoSettings?.showInFooter === false) && (
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '1.15rem',
                    letterSpacing: '-0.02em',
                    color: 'var(--text-primary)',
                  }}
                >
                  {siteSettings.wordmark || 'BRACKNODES'}
                </span>
              )}
            </div>

            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                lineHeight: 1.65,
                maxWidth: '300px',
                marginBottom: '1.5rem',
              }}
            >
              {siteSettings.footerText}
            </p>

            <span className="badge badge-live">
              <span className="badge-dot" />
              <span>{(siteSettings.footerSettings?.statusBadgeText || 'STUDIO ONLINE').toUpperCase()} · {currentTime || '00:00:00'} IST</span>
            </span>
          </div>

          {/* Col 2: Nav Index */}
          <div>
            <div
              className="mono"
              style={{
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                marginBottom: '1.25rem',
              }}
            >
              Navigation
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {NAV_LINKS.map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="mono"
                    style={{
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'color var(--t-fast)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-lime)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>//</span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact & Socials */}
          <div>
            <div
              className="mono"
              style={{
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                marginBottom: '1.25rem',
              }}
            >
              Direct Channels
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px' }}>
                Project Discussions
              </div>
              <a
                href={`mailto:${siteSettings.email}`}
                className="mono"
                style={{
                  color: 'var(--accent-lime)',
                  textDecoration: 'none',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  transition: 'opacity var(--t-fast)',
                  display: 'inline-block',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                {siteSettings.email}
              </a>
            </div>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {activeSocials.map((item) => {
                const accent = item.color || 'var(--accent-lime)';
                const isHovered = hoveredSocial === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    title={item.label}
                    style={{
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${isHovered ? accent : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-sm)',
                      color: isHovered ? accent : 'var(--text-secondary)',
                      backgroundColor: isHovered ? 'var(--bg-input)' : 'transparent',
                      transition: 'all var(--t-fast)',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={() => setHoveredSocial(item.id)}
                    onMouseLeave={() => setHoveredSocial(null)}
                  >
                    <SocialIcon platform={item.platform || item.label} color={isHovered ? accent : 'currentColor'} size={16} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="footer-bottom-bar"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            paddingTop: '1.25rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {siteSettings.copyrightText || `© ${new Date().getFullYear()} BRACKNODES. ALL RIGHTS RESERVED.`}
            </span>
            <span style={{ color: 'var(--border-medium)', fontSize: '0.75rem' }}>•</span>
            <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              Designed by{' '}
              <a
                href="https://bracknodes.in"
                target="_blank"
                rel="noopener"
                title="BrackNodes — Digital Agency & Software Architecture"
                style={{
                  color: 'var(--accent-lime)',
                  fontWeight: 600,
                  textDecoration: 'none',
                  borderBottom: '1px solid var(--accent-lime-muted)',
                  transition: 'all var(--t-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderBottomColor = 'var(--accent-lime)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderBottomColor = 'var(--accent-lime-muted)';
                  e.currentTarget.style.color = 'var(--accent-lime)';
                }}
              >
                Bracknodes
              </a>
            </span>
          </div>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mono"
            aria-label="Scroll back to top"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              transition: 'all var(--t-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-lime)';
              e.currentTarget.style.color = 'var(--accent-lime)';
              e.currentTarget.style.background = 'var(--accent-lime-muted)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.background = 'var(--bg-input)';
            }}
          >
            <span>{siteSettings.footerSettings?.backToTopText || 'Back to Top'}</span>
            <ArrowUp size={11} />
          </button>
        </div>
      </div>
    </footer>
  );
};

import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Terminal, Sun, Moon } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { useTheme } from '../hooks/useTheme';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const { siteSettings } = useCMS();
  const { toggleTheme, isDark, isToggleAllowed } = useTheme();

  /* ── Scroll detection ─────────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Active section tracking via IntersectionObserver ─────────── */
  useEffect(() => {
    const ids = ['hero', 'projects', 'about', 'services', 'skills', 'process', 'testimonials', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveSection(visible[visible.length - 1].target.id);
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const nSettings = siteSettings.navbarSettings;
  const logoSettings = siteSettings.logoSettings;
  const currentLogoUrl = isDark
    ? (logoSettings?.darkImageUrl || logoSettings?.imageUrl)
    : (logoSettings?.lightImageUrl || logoSettings?.darkImageUrl || logoSettings?.imageUrl);
  const hasCustomLogo = Boolean(
    currentLogoUrl &&
    logoSettings?.mode !== 'icon-wordmark' &&
    logoSettings?.showInNavbar !== false
  );
  const showWordmark = !hasCustomLogo || logoSettings?.mode !== 'image-only';
  const logoHeight = logoSettings?.heightPx || 34;

  const navLinks = [
    { label: nSettings?.workLabel || 'Work', href: '#projects', id: 'projects' },
    { label: nSettings?.aboutLabel || 'About', href: '#about', id: 'about' },
    { label: nSettings?.servicesLabel || 'Services', href: '#services', id: 'services' },
    { label: nSettings?.skillsLabel || 'Skills', href: '#skills', id: 'skills' },
    { label: nSettings?.processLabel || 'Process', href: '#process', id: 'process' },
    { label: nSettings?.contactLabel || 'Contact', href: '#contact', id: 'contact' },
  ];

  const ctaText = nSettings?.ctaText || 'Inquire';
  const ctaLink = nSettings?.ctaLink || '#contact';

  const handleLink = () => setMobileOpen(false);

  return (
    <header
      className="nav-header"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 'var(--header-height)',
        transition: `background-color var(--t-normal), border-color var(--t-normal), backdrop-filter var(--t-normal)`,
        backgroundColor: scrolled
          ? isDark ? 'rgba(8,10,15,0.9)' : 'rgba(247,248,250,0.92)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(18px) saturate(150%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(18px) saturate(150%)' : 'none',
        borderBottom: scrolled
          ? `1px solid var(--border-subtle)`
          : '1px solid transparent',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        {/* ── Brand Wordmark & Logo ───────────────────────────── */}
        <a
          href="#"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: 'var(--text-primary)',
            flexShrink: 0,
          }}
        >
          {hasCustomLogo ? (
            <img
              src={currentLogoUrl!}
              alt={logoSettings!.altText || siteSettings.wordmark || 'Logo'}
              style={{
                height: `${logoHeight}px`,
                width: 'auto',
                maxHeight: '48px',
                objectFit: 'contain',
                display: 'block',
                borderRadius: 'var(--radius-sm)',
              }}
            />
          ) : (
            <div
              style={{
                width: '34px',
                height: '34px',
                background: 'var(--accent-lime-muted)',
                border: '1px solid var(--border-highlight)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--accent-lime)',
                transition: 'all var(--t-fast)',
                flexShrink: 0,
              }}
            >
              <Terminal size={17} strokeWidth={2.2} />
            </div>
          )}
          {showWordmark && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  color: 'var(--text-primary)',
                }}
              >
                {siteSettings.wordmark || 'BRACKNODES'}
              </span>
              <span
                className="mono"
                style={{
                  fontSize: '0.575rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                {siteSettings.role || 'Next-Gen Cloud & Discord Bot Hosting'}
              </span>
            </div>
          )}
        </a>

        {/* ── Desktop Navigation ────────────────────────────────── */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          <ul
            style={{
              display: 'flex',
              listStyle: 'none',
              gap: '0.125rem',
              margin: 0,
              padding: 0,
            }}
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="mono"
                    style={{
                      display: 'block',
                      color: isActive ? 'var(--accent-lime)' : 'var(--text-secondary)',
                      textDecoration: 'none',
                      fontSize: 'var(--text-xs)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      transition: 'color var(--t-fast)',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                      position: 'relative',
                      fontWeight: isActive ? 600 : 400,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = isActive
                        ? 'var(--accent-lime)'
                        : 'var(--text-secondary)')
                    }
                  >
                    {link.label}
                    {isActive && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '-2px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '18px',
                          height: '2px',
                          borderRadius: '1px',
                          background: 'var(--accent-lime)',
                        }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Theme Toggle */}
            {isToggleAllowed && (
              <button
                type="button"
                className="theme-toggle"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                onClick={toggleTheme}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            )}

            {/* Inquire CTA */}
            <a href={ctaLink} className="btn btn-secondary" style={{ padding: '0.55rem 1.125rem', fontSize: '0.7rem' }}>
              <span>{ctaText}</span>
              <ArrowUpRight size={13} />
            </a>
          </div>
        </nav>

        {/* ── Mobile Controls ───────────────────────────────────── */}
        <div
          style={{ alignItems: 'center', gap: '8px' }}
          className="mobile-menu-toggle"
        >
          {isToggleAllowed && (
            <button
              type="button"
              className="theme-toggle"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={toggleTheme}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          )}

          <button
            type="button"
            aria-label={mobileOpen ? 'Close Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-primary)',
              padding: '7px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ─────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 'var(--header-height)',
          left: 0,
          right: 0,
          backgroundColor: isDark ? 'rgba(8,10,15,0.97)' : 'rgba(247,248,250,0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '1.25rem 1.5rem 1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          boxShadow: 'var(--shadow-xl)',
          transform: mobileOpen ? 'translateY(0)' : 'translateY(-8px)',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'all' : 'none',
          transition: 'opacity var(--t-normal), transform var(--t-normal)',
        }}
      >
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={handleLink}
            style={{
              color: activeSection === link.id ? 'var(--accent-lime)' : 'var(--text-primary)',
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '12px 0',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: activeSection === link.id ? 600 : 400,
              transition: 'color var(--t-fast)',
            }}
          >
            <span>{link.label}</span>
            <ArrowUpRight size={14} color="var(--accent-lime)" />
          </a>
        ))}
        <a
          href={ctaLink}
          onClick={handleLink}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '1rem' }}
        >
          <span>{ctaText}</span>
          <ArrowUpRight size={14} />
        </a>
      </div>
    </header>
  );
};

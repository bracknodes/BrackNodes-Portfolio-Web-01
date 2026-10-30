import React, { useState } from 'react';
import { Server, Zap, ExternalLink, X, ShieldCheck } from 'lucide-react';

interface BrackNodesAdBannerProps {
  isDismissed?: boolean;
  onDismiss?: () => void;
}

export const BrackNodesAdBanner: React.FC<BrackNodesAdBannerProps> = ({
  isDismissed: controlledDismissed,
  onDismiss: controlledOnDismiss,
}) => {
  const [internalDismissed, setInternalDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('bracknodes_ad_banner_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const isDismissed = controlledDismissed !== undefined ? controlledDismissed : internalDismissed;

  const handleDismiss = () => {
    try {
      localStorage.setItem('bracknodes_ad_banner_dismissed', 'true');
    } catch {
      // ignore
    }
    if (controlledOnDismiss) {
      controlledOnDismiss();
    } else {
      setInternalDismissed(true);
    }
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div
      className="bracknodes-ad-container"
      style={{
        margin: '1.25rem 2rem 0',
        padding: '0.875rem 1.25rem',
        background: 'linear-gradient(90deg, rgba(13, 19, 31, 0.98) 0%, rgba(18, 26, 44, 0.95) 50%, rgba(11, 16, 26, 0.98) 100%)',
        border: '1px solid rgba(199, 255, 107, 0.28)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35), inset 0 0 16px rgba(199, 255, 107, 0.04)',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Left Column: Brand, Tag & Pitch */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '280px', flex: '1 1 auto' }}>
        {/* Glowing Node Icon */}
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '6px',
            background: 'rgba(199, 255, 107, 0.1)',
            border: '1px solid rgba(199, 255, 107, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: 'var(--accent-lime)',
          }}
        >
          <Server size={22} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '2px' }}>
            <span
              className="mono"
              style={{
                fontSize: '0.625rem',
                textTransform: 'uppercase',
                padding: '1px 6px',
                borderRadius: '2px',
                backgroundColor: 'rgba(199, 255, 107, 0.15)',
                color: 'var(--accent-lime)',
                fontWeight: 700,
                letterSpacing: '0.06em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Zap size={10} /> SPONSORED HOSTING
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
              BrackNodes Cloud Infrastructure
            </span>
            <span
              className="mono"
              style={{
                fontSize: '0.6875rem',
                color: 'var(--accent-blue)',
                backgroundColor: 'rgba(92, 179, 255, 0.12)',
                padding: '1px 6px',
                borderRadius: '2px',
                border: '1px solid rgba(92, 179, 255, 0.25)',
                fontWeight: 600,
              }}
            >
              From ₹29/month
            </span>
          </div>

          <p style={{ margin: 0, fontSize: '0.78125rem', color: '#94A3B8', lineHeight: 1.4 }}>
            High-speed NVMe cPanel Web Hosting & 24/7 Discord Bot Servers. 99.99% Uptime SLA • Instant Setup • DDoS Shield.
          </p>
        </div>
      </div>

      {/* Right Column: Key Feature, CTA & Dismiss Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        {/* Specs Pill */}
        <span
          className="mono"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(199, 255, 107, 0.25)',
            borderRadius: '4px',
            padding: '6px 10px',
            color: '#CBD5E1',
            fontSize: '0.71875rem',
            fontWeight: 600,
          }}
        >
          <ShieldCheck size={13} color="var(--accent-lime)" />
          <span>99.99% UPTIME SLA</span>
        </span>

        {/* View / Deploy CTA */}
        <a
          href="https://bracknodes.in"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: 'var(--accent-lime)',
            color: '#090B10',
            padding: '6px 13px',
            borderRadius: '3px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textDecoration: 'none',
            letterSpacing: '0.02em',
            boxShadow: '0 0 10px rgba(199, 255, 107, 0.2)',
          }}
        >
          <span>Get Started</span>
          <ExternalLink size={12} />
        </a>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={handleDismiss}
          title="Dismiss ad (won't show again)"
          style={{
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#64748B',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#64748B';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}
          aria-label="Close BrackNodes advertisement"
        >
          <X size={15} />
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .bracknodes-ad-container {
            margin: 0.75rem 1rem 0 !important;
            padding: 0.75rem 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export const BrackNodesSidebarCard: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('bracknodes_sidebar_card_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem('bracknodes_sidebar_card_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div
      style={{
        margin: '0.5rem 0.75rem',
        padding: '0.75rem',
        backgroundColor: '#0f1420',
        border: '1px solid rgba(199, 255, 107, 0.2)',
        borderRadius: '4px',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Zap size={11} color="var(--accent-lime)" />
          <span className="mono" style={{ fontSize: '0.625rem', color: 'var(--accent-lime)', fontWeight: 700 }}>
            BRACKNODES CLOUD
          </span>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          title="Dismiss promo"
          style={{
            background: 'none',
            border: 'none',
            color: '#5E6980',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <X size={12} />
        </button>
      </div>

      <div style={{ fontSize: '0.71875rem', color: '#CBD5E1', lineHeight: 1.35, marginBottom: '8px' }}>
        Ultra-low ping Discord Bot & NVMe cPanel hosting from ₹29/mo.
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="mono" style={{ fontSize: '0.5625rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '3px' }}>
          <ShieldCheck size={10} color="var(--accent-lime)" /> DDoS Guarded
        </span>
        <a
          href="https://bracknodes.in"
          target="_blank"
          rel="noopener noreferrer"
          className="mono"
          style={{
            fontSize: '0.65rem',
            color: 'var(--accent-lime)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            fontWeight: 600,
          }}
        >
          <span>Explore</span>
          <ExternalLink size={9} />
        </a>
      </div>
    </div>
  );
};

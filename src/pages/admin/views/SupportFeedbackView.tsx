import React from 'react';
import { useCMS } from '../../../context/CMSContext';
import {
  Headphones,
  MessageSquare,
  LifeBuoy,
  Server,
  Zap,
  ShieldCheck,
  ExternalLink,
  Bot,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';

export const SupportFeedbackView: React.FC = () => {
  const { siteSettings } = useCMS();

  const discordSocial = siteSettings.socialLinks?.find((s) => s.platform.toLowerCase() === 'discord');
  const discordUrl = discordSocial?.url || 'https://discord.gg/bracknodes';
  const bracknodesUrl = 'https://bracknodes.in';

  return (
    <div style={{ maxWidth: '1200px' }}>
      {/* View Header */}
      <div
        style={{
          padding: '1.75rem 2rem',
          backgroundColor: '#11151f',
          border: '1px solid var(--border-subtle)',
          borderRadius: '6px',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span
            className="mono"
            style={{
              fontSize: '0.625rem',
              textTransform: 'uppercase',
              padding: '2px 8px',
              borderRadius: '2px',
              backgroundColor: 'rgba(199, 255, 107, 0.12)',
              color: 'var(--accent-lime)',
              fontWeight: 700,
              letterSpacing: '0.06em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <Headphones size={12} /> OFFICIAL SUPPORT &amp; FEEDBACK
          </span>
          <span className="mono" style={{ fontSize: '0.6875rem', color: '#5E6980' }}>
            ● 24/7 ACTIVE ASSISTANCE
          </span>
        </div>

        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 8px 0', color: '#FFFFFF' }}>
          Support &amp; Feedback
        </h1>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#94A3B8', maxWidth: '820px', lineHeight: 1.55 }}>
          Need technical assistance with your website, bot deployments, database configurations, or want to share platform feedback?
          Join our active Discord community or submit a ticket directly on the BrackNodes website.
        </p>
      </div>

      {/* 2 Main Action Cards: Discord & Ticket Portal */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* Card 1: Discord Community Support & Feedback */}
        <div
          className="card-surface"
          style={{
            padding: '1.75rem',
            borderRadius: '6px',
            backgroundColor: '#0d121e',
            border: '1px solid rgba(88, 101, 242, 0.4)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35), inset 0 0 20px rgba(88, 101, 242, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(88, 101, 242, 0.15)',
                  border: '1px solid rgba(88, 101, 242, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#5865F2',
                }}
              >
                <MessageSquare size={22} />
              </div>
              <span
                className="mono"
                style={{
                  fontSize: '0.625rem',
                  color: '#5865F2',
                  backgroundColor: 'rgba(88, 101, 242, 0.12)',
                  border: '1px solid rgba(88, 101, 242, 0.3)',
                  padding: '2px 8px',
                  borderRadius: '2px',
                  fontWeight: 700,
                }}
              >
                LIVE CHAT &amp; FEEDBACK
              </span>
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 8px 0' }}>
              Join Discord for Support &amp; Feedback
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#94A3B8', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
              Connect with our active team of developers and community members. Share suggestions, report bugs, ask deployment questions, and receive instant real-time assistance.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.75rem' }}>
              <div className="mono" style={{ fontSize: '0.75rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} color="#5865F2" />
                <span>Direct interaction with developers &amp; staff</span>
              </div>
              <div className="mono" style={{ fontSize: '0.75rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} color="#5865F2" />
                <span>Real-time node maintenance &amp; status alerts</span>
              </div>
              <div className="mono" style={{ fontSize: '0.75rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} color="#5865F2" />
                <span>Community help channels for Discord bots &amp; web apps</span>
              </div>
            </div>
          </div>

          <a
            href={discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: '#5865F2',
              color: '#FFFFFF',
              padding: '11px 18px',
              borderRadius: '4px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              boxShadow: '0 4px 15px rgba(88, 101, 242, 0.3)',
            }}
          >
            <span>Join Discord for Support &amp; Feedback</span>
            <ExternalLink size={14} />
          </a>
        </div>

        {/* Card 2: Open Ticket on BrackNodes Website */}
        <div
          className="card-surface"
          style={{
            padding: '1.75rem',
            borderRadius: '6px',
            backgroundColor: '#0c121e',
            border: '1px solid rgba(199, 255, 107, 0.4)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35), inset 0 0 20px rgba(199, 255, 107, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(199, 255, 107, 0.12)',
                  border: '1px solid rgba(199, 255, 107, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-lime)',
                }}
              >
                <LifeBuoy size={22} />
              </div>
              <span
                className="mono"
                style={{
                  fontSize: '0.625rem',
                  color: 'var(--accent-lime)',
                  backgroundColor: 'rgba(199, 255, 107, 0.1)',
                  border: '1px solid rgba(199, 255, 107, 0.25)',
                  padding: '2px 8px',
                  borderRadius: '2px',
                  fontWeight: 700,
                }}
              >
                OFFICIAL HELP DESK
              </span>
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 8px 0' }}>
              Open Ticket on BrackNodes Website
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#94A3B8', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
              Need server migration, custom database setup, billing assistance, or dedicated compute scaling? Submit a formal ticket on our portal for prioritized resolution.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.75rem' }}>
              <div className="mono" style={{ fontSize: '0.75rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} color="var(--accent-lime)" />
                <span>Average ticket response under 15 minutes</span>
              </div>
              <div className="mono" style={{ fontSize: '0.75rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} color="var(--accent-lime)" />
                <span>Tier-2 infrastructure engineer assignment</span>
              </div>
              <div className="mono" style={{ fontSize: '0.75rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} color="var(--accent-lime)" />
                <span>Secure server credentials &amp; migration handling</span>
              </div>
            </div>
          </div>

          <a
            href={bracknodesUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: 'var(--accent-lime)',
              color: '#090B10',
              padding: '11px 18px',
              borderRadius: '4px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              boxShadow: '0 4px 15px rgba(199, 255, 107, 0.25)',
            }}
          >
            <span>Open Support Ticket on BrackNodes</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* NON-SKIPPABLE, ALWAYS VISIBLE BRACKNODES ADVERTISEMENT SHOWCASE     */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          padding: '2.25rem',
          backgroundColor: '#0a0e17',
          border: '1px solid rgba(199, 255, 107, 0.3)',
          borderRadius: '6px',
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(10, 14, 23, 0.98) 0%, rgba(16, 24, 38, 0.95) 50%, rgba(10, 14, 23, 0.98) 100%)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(199, 255, 107, 0.03)',
        }}
      >
        {/* Header of Ad Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span
                className="mono"
                style={{
                  fontSize: '0.625rem',
                  textTransform: 'uppercase',
                  padding: '2px 8px',
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
                <Zap size={10} /> SPONSORED CLOUD INFRASTRUCTURE
              </span>
              <span
                className="mono"
                style={{
                  fontSize: '0.625rem',
                  color: 'var(--accent-blue)',
                  backgroundColor: 'rgba(92, 179, 255, 0.1)',
                  border: '1px solid rgba(92, 179, 255, 0.25)',
                  padding: '2px 8px',
                  borderRadius: '2px',
                }}
              >
                PERMANENT HOSTING PARTNER
              </span>
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px 0', letterSpacing: '-0.01em' }}>
              ⚡ Deploy on BrackNodes High-Speed NVMe &amp; Bot Cloud
            </h3>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: '#94A3B8', maxWidth: '780px', lineHeight: 1.5 }}>
              Engineered for maximum speed and uptime. Whether you need an affordable cPanel portfolio hosting plan, a 24/7 continuous Discord bot server, or dedicated cloud VPS, BrackNodes delivers industry-leading latency and 99.99% reliability.
            </p>
          </div>

          <a
            href={bracknodesUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--accent-lime)',
              color: '#090B10',
              padding: '10px 18px',
              borderRadius: '4px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 0 14px rgba(199, 255, 107, 0.25)',
            }}
          >
            <span>Visit BrackNodes.in</span>
            <ExternalLink size={13} />
          </a>
        </div>

        {/* 3 Hosting Products Grid (Non-skippable Ad Cards) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {/* Ad 1: Web Hosting */}
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: '#070a11',
              border: '1px solid #1c2438',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Server size={16} color="var(--accent-lime)" />
                  <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#F7F7F2' }}>
                    NVMe cPanel Hosting
                  </span>
                </div>
                <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--accent-lime)', fontWeight: 700 }}>
                  From ₹29/mo
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#8B97B0', lineHeight: 1.4, margin: '0 0 10px 0' }}>
                Pure Enterprise NVMe SSD storage with lightning load speeds, free SSL, PHP/Node support, and unlimited bandwidth.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                <span className="mono" style={{ fontSize: '0.65625rem', color: '#94A3B8' }}>• 100% NVMe SSD Storage</span>
                <span className="mono" style={{ fontSize: '0.65625rem', color: '#94A3B8' }}>• Free AutoSSL &amp; Backups</span>
                <span className="mono" style={{ fontSize: '0.65625rem', color: '#94A3B8' }}>• 1-Click Softaculous Apps</span>
              </div>
            </div>
            <a
              href={bracknodesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mono"
              style={{
                fontSize: '0.71875rem',
                color: 'var(--accent-lime)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 600,
              }}
            >
              <span>Deploy Web Hosting</span>
              <ArrowUpRight size={12} />
            </a>
          </div>

          {/* Ad 2: Discord Bot Hosting */}
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: '#070a11',
              border: '1px solid #1c2438',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Bot size={16} color="var(--accent-blue)" />
                  <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#F7F7F2' }}>
                    Discord Bot Hosting
                  </span>
                </div>
                <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--accent-blue)', fontWeight: 700 }}>
                  From ₹29/mo
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#8B97B0', lineHeight: 1.4, margin: '0 0 10px 0' }}>
                Keep your bot online 24/7 on dedicated Pterodactyl panels. Zero sleeping, sub-15ms ping, and instant restarts.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                <span className="mono" style={{ fontSize: '0.65625rem', color: '#94A3B8' }}>• Node.js, Python, Java &amp; Go</span>
                <span className="mono" style={{ fontSize: '0.65625rem', color: '#94A3B8' }}>• 24/7 Always-On Pterodactyl</span>
                <span className="mono" style={{ fontSize: '0.65625rem', color: '#94A3B8' }}>• Low Latency Asia-South Nodes</span>
              </div>
            </div>
            <a
              href={bracknodesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mono"
              style={{
                fontSize: '0.71875rem',
                color: 'var(--accent-blue)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 600,
              }}
            >
              <span>Deploy Bot Server</span>
              <ArrowUpRight size={12} />
            </a>
          </div>

          {/* Ad 3: DDoS Guarded Infrastructure */}
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: '#070a11',
              border: '1px solid #1c2438',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} color="var(--accent-lime)" />
                  <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#F7F7F2' }}>
                    Anti-DDoS Shield
                  </span>
                </div>
                <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--accent-lime)', fontWeight: 700 }}>
                  99.99% SLA
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#8B97B0', lineHeight: 1.4, margin: '0 0 10px 0' }}>
                Enterprise Layer 3/4/7 volumetric attack mitigation filters hostile traffic with zero downtime for your apps.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                <span className="mono" style={{ fontSize: '0.65625rem', color: '#94A3B8' }}>• Advanced Traffic Scrubbing</span>
                <span className="mono" style={{ fontSize: '0.65625rem', color: '#94A3B8' }}>• 1Gbps Redundant Network Uplinks</span>
                <span className="mono" style={{ fontSize: '0.65625rem', color: '#94A3B8' }}>• 24/7 Human Security Team</span>
              </div>
            </div>
            <a
              href={bracknodesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mono"
              style={{
                fontSize: '0.71875rem',
                color: 'var(--accent-lime)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 600,
              }}
            >
              <span>View Infrastructure</span>
              <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Mail, Clock, ShieldCheck, Copy, Check, ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { ContactForm } from '../components/ContactForm';
import { useCMS } from '../context/CMSContext';
import { SocialIcon } from '../components/SocialIcon';

export const Contact: React.FC = () => {
  const { siteSettings } = useCMS();
  const [copied, setCopied] = useState(false);

  const inquire = siteSettings.inquireForm || {
    sectionTag: '07 // Host With BrackNodes',
    sectionTitle: 'GET IN TOUCH',
    sectionSubtitle: "Need a custom cloud deployment, Discord bot hosting, or migration help? Talk to our team.",
    pitchHeadline: 'Enterprise-grade hosting with direct human support.',
    pitchDescription:
      'Have questions regarding our NVMe web hosting, Discord bot plans, or dedicated compute? Reach out anytime. Our technical support team is available 24/7.',
    projectTypes: ['Discord Bot Hosting', 'cPanel Web Hosting', 'Cloud VPS / Dedicated', 'Server Migration', 'Custom Infrastructure'],
    budgetOptions: ['₹29 – ₹99 /mo', '₹99 – ₹299 /mo', '₹299 – ₹999 /mo', '₹999+ /mo'],
    submitButtonText: 'Send Inquiry',
    successMessage: 'Thank you! Your inquiry has been received. Our team will respond shortly.',
    responseSla: '24/7 SUPPORT RESPONSE',
    confidentialityNotice: '99.99% UPTIME GUARANTEE',
  };

  const contactEmail = siteSettings.email || 'support@bracknodes.in';

  const copyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const TRUST_ITEMS = [
    { icon: <Clock size={15} />, label: inquire.responseSla || '24-Hour Response SLA', accent: 'var(--accent-blue)' },
    { icon: <ShieldCheck size={15} />, label: inquire.confidentialityNotice || '100% NDA & IP Integrity', accent: 'var(--accent-lime)' },
  ];

  return (
    <section id="contact" className="section-wrapper" style={{ backgroundColor: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      <div className="glow-aurora glow-blue" style={{ width: '50vw', height: '50vw', bottom: '-20%', left: '-15%', opacity: 0.07 }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeading
          tag={inquire.sectionTag || '07 // Commence an Engagement'}
          title={inquire.sectionTitle || 'START A PROJECT'}
          subtitle={inquire.sectionSubtitle || "Have a new product or idea? Let's connect."}
          badgeColor="lime"
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 'clamp(2rem, 4vw, 4rem)',
            alignItems: 'start',
          }}
        >
          {/* ── Left: Pitch & Direct Channels ──────────────────── */}
          <div>
            <h3
              style={{
                fontSize: 'clamp(1.5rem, 2.5vw, 2.125rem)',
                marginBottom: '1.125rem',
                lineHeight: 1.18,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
              }}
            >
              {inquire.pitchHeadline || 'Direct partnership. No middle layers.'}
            </h3>

            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1rem',
                lineHeight: 1.75,
                marginBottom: '2.5rem',
              }}
            >
              {inquire.pitchDescription || ''}
            </p>

            {/* Email Card */}
            <div
              style={{
                padding: '1rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '14px',
                marginBottom: '1rem',
                transition: 'border-color var(--t-fast)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-medium)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    padding: '10px',
                    background: 'var(--accent-lime-muted)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--accent-lime)',
                    flexShrink: 0,
                  }}
                >
                  <Mail size={18} />
                </div>
                <div>
                  <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '2px' }}>
                    Primary Email
                  </div>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="mono"
                    style={{
                      color: 'var(--text-primary)',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'color var(--t-fast)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-lime)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                  >
                    {contactEmail}
                  </a>
                </div>
              </div>

              <button
                type="button"
                onClick={copyEmail}
                className="mono"
                title="Copy email"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: copied ? 'var(--accent-lime-muted)' : 'var(--bg-input)',
                  border: `1px solid ${copied ? 'var(--accent-lime)' : 'var(--border-subtle)'}`,
                  color: copied ? 'var(--accent-lime)' : 'var(--text-secondary)',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontSize: '0.7rem',
                  transition: 'all var(--t-fast)',
                  flexShrink: 0,
                }}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span>{copied ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '1.5rem' }}>
              {TRUST_ITEMS.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 1rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <span style={{ color: item.accent, flexShrink: 0 }}>{item.icon}</span>
                  <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(siteSettings.socialLinks && siteSettings.socialLinks.length > 0
                ? siteSettings.socialLinks.filter((s) => s.isEnabled !== false && s.url)
                : [
                    { id: 'github', platform: 'github', label: 'GitHub', url: siteSettings.socials?.github || 'https://github.com/bracknodes', color: 'var(--accent-lime)' },
                    { id: 'linkedin', platform: 'linkedin', label: 'LinkedIn', url: siteSettings.socials?.linkedin || 'https://www.linkedin.com/company/bracknodes', color: 'var(--accent-blue)' },
                    { id: 'instagram', platform: 'instagram', label: 'Instagram', url: siteSettings.socials?.instagram || 'https://www.instagram.com/bracknodes', color: '#E1306C' },
                    { id: 'x', platform: 'x', label: 'X / Twitter', url: siteSettings.socials?.x || 'https://x.com/bracknodes', color: 'var(--text-primary)' },
                  ]
              ).map((s) => (
                <a
                  key={s.id || s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono btn btn-ghost"
                  style={{ fontSize: '0.7rem', padding: '0.5rem 0.875rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = s.color || 'var(--accent-lime)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  <SocialIcon platform={s.platform || s.label} size={13} color="currentColor" />
                  <span>{s.label}</span>
                  <ArrowUpRight size={11} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Right: Contact Form ─────────────────────────────── */}
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

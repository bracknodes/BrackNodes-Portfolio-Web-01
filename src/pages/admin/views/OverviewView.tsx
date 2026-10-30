import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import { useAuth } from '../../../context/AuthContext';
import type { AdminTab } from '../AdminLayout';
import {
  FolderGit2,
  Briefcase,
  Inbox,
  Palette,
  ArrowUpRight,
  Plus,
  Globe,
  Zap,
  Server,
  ShieldCheck,
  X,
  ExternalLink,
} from 'lucide-react';

export const OverviewView: React.FC<{ onNavigate: (tab: AdminTab) => void }> = ({ onNavigate }) => {
  const { siteSettings, projects, services, inquiries, media } = useCMS();
  const { isLiveSupabase } = useAuth();
  const [isAdDismissed, setIsAdDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('bracknodes_overview_ad_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const unreadInquiries = inquiries.filter((inq) => inq.status === 'new');

  const stats = [
    {
      title: 'Published Projects',
      value: projects.filter((p) => p.isPublished).length,
      total: projects.length,
      icon: <FolderGit2 size={20} color="var(--accent-lime)" />,
      tab: 'projects' as AdminTab,
      detail: `${projects.length} Total Registered`,
    },
    {
      title: 'Active Services',
      value: services.filter((s) => s.isPublished).length,
      total: services.length,
      icon: <Briefcase size={20} color="var(--accent-blue)" />,
      tab: 'services' as AdminTab,
      detail: 'Freelance Offerings',
    },
    {
      title: 'Client Inquiries',
      value: unreadInquiries.length,
      total: inquiries.length,
      icon: <Inbox size={20} color="var(--accent-lime)" />,
      tab: 'inquiries' as AdminTab,
      detail: `${unreadInquiries.length} New Unread Leads`,
    },
    {
      title: 'Active Theme',
      value: siteSettings.designTheme?.themeName || 'Cyber Dark',
      icon: <Palette size={20} color="var(--accent-blue)" />,
      tab: 'design' as AdminTab,
      detail: 'CSS Custom Tokens',
    },
  ];

  return (
    <div style={{ maxWidth: '1200px' }}>
      {/* Top Banner Greeting */}
      <div
        style={{
          padding: '1.75rem',
          backgroundColor: '#11151f',
          border: '1px solid var(--border-subtle)',
          borderRadius: '4px',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          position: 'relative',
        }}
      >
        <span className="cyber-crosshair corner-tl" />
        <span className="cyber-crosshair corner-tr" />

        <div>
          <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-lime)', marginBottom: '4px' }}>
            STUDIO CMS // DASHBOARD OVERVIEW
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '6px', color: '#F7F7F2' }}>
            Welcome back, {siteSettings.brandName}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
            Manage public portfolio copy, create projects, adjust CSS design tokens, and review inbound client inquiries.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => onNavigate('projects')}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.75rem' }}
          >
            <Plus size={14} />
            <span>Add Project</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('content')}
            className="btn btn-secondary"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.75rem' }}
          >
            <span>Edit Content</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('seo')}
            className="btn btn-secondary"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Globe size={13} color="var(--accent-lime)" />
            <span>SEO &amp; Ranking</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        {stats.map((s, idx) => (
          <div
            key={idx}
            onClick={() => onNavigate(s.tab)}
            className="card-surface"
            style={{
              padding: '1.5rem',
              borderRadius: '4px',
              backgroundColor: '#11151F',
              border: '1px solid #1C2438',
              color: '#F7F7F2',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="mono" style={{ fontSize: '0.75rem', color: '#8B97B0' }}>
                {s.title}
              </span>
              {s.icon}
            </div>

            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#F7F7F2', marginBottom: '4px' }}>
              {s.value}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: '0.6875rem', color: '#8B97B0' }}>
                {s.detail}
              </span>
              <ArrowUpRight size={14} color="var(--accent-lime)" />
            </div>
          </div>
        ))}
      </div>

      {/* 2-Column Split: Recent Leads & Database Architecture Status */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Recent Client Inquiries */}
        <div
          className="card-surface"
          style={{
            padding: '1.5rem',
            borderRadius: '4px',
            backgroundColor: '#11151F',
            border: '1px solid #1C2438',
            color: '#F7F7F2',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Recent Client Inquiries</h3>
            <button
              type="button"
              onClick={() => onNavigate('inquiries')}
              className="mono"
              style={{ background: 'none', border: 'none', color: 'var(--accent-lime)', fontSize: '0.75rem', cursor: 'pointer' }}
            >
              View All ({inquiries.length})
            </button>
          </div>

          {inquiries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
              <Inbox size={32} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
              <p className="mono" style={{ fontSize: '0.8125rem' }}>No client inquiries received yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {inquiries.slice(0, 4).map((inq) => (
                <div
                  key={inq.id}
                  style={{
                    padding: '10px 14px',
                    backgroundColor: '#0c0f17',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '2px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      {inq.name}
                    </div>
                    <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                      {inq.email} • {inq.projectType}
                    </div>
                  </div>

                  <span
                    className="mono"
                    style={{
                      fontSize: '0.625rem',
                      padding: '2px 8px',
                      borderRadius: '2px',
                      backgroundColor: inq.status === 'new' ? 'var(--accent-lime-muted)' : 'rgba(255,255,255,0.05)',
                      color: inq.status === 'new' ? 'var(--accent-lime)' : 'var(--text-secondary)',
                    }}
                  >
                    {inq.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Backend & Deployment Status */}
        <div
          className="card-surface"
          style={{
            padding: '1.5rem',
            borderRadius: '4px',
            backgroundColor: '#11151F',
            border: '1px solid #1C2438',
            color: '#F7F7F2',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Infrastructure & Security</h3>
            <button
              type="button"
              onClick={() => onNavigate('security')}
              className="mono"
              style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', fontSize: '0.75rem', cursor: 'pointer' }}
            >
              Configure
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', borderRadius: '2px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>DATABASE LAYER</span>
                <span className="mono" style={{ fontSize: '0.75rem', color: isLiveSupabase ? 'var(--accent-lime)' : 'var(--accent-blue)' }}>
                  {isLiveSupabase ? 'SUPABASE POSTGRESQL (LIVE)' : 'LOCAL PERSISTENCE (READY)'}
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
                {isLiveSupabase
                  ? 'All changes synchronize directly with your cloud Supabase database with RLS policies enabled.'
                  : 'Running seamlessly in offline/local mode. Connect your VITE_SUPABASE_URL in .env to sync to cloud.'}
              </p>
            </div>

            <div style={{ padding: '12px', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', borderRadius: '2px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>MEDIA STORAGE</span>
                <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-lime)' }}>
                  {media.length} ASSETS REGISTERED
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
                Supports image and project file asset uploads with zero external dependency blocks.
              </p>
            </div>

            <div style={{ padding: '12px', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', borderRadius: '2px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>PUBLIC DOMAIN &amp; SEO</span>
                <button
                  type="button"
                  onClick={() => onNavigate('seo')}
                  className="mono"
                  style={{ background: 'none', border: 'none', color: 'var(--accent-lime)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <span>{siteSettings.seo?.canonicalDomain || 'bracknodes.in'}</span>
                  <ArrowUpRight size={11} />
                </button>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
                Manage search keywords, Schema.org rich snippets, XML sitemap, and Google Search Console indexing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BrackNodes Promotional Card (Removable & Non-intrusive) */}
      {!isAdDismissed && (
        <div
          style={{
            marginTop: '2rem',
            padding: '1.25rem 1.5rem',
            backgroundColor: '#0c101a',
            border: '1px solid rgba(199, 255, 107, 0.22)',
            borderRadius: '4px',
            position: 'relative',
            background: 'linear-gradient(135deg, rgba(12, 16, 26, 0.95) 0%, rgba(18, 26, 42, 0.85) 100%)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', maxWidth: '750px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(199, 255, 107, 0.1)',
                  border: '1px solid rgba(199, 255, 107, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-lime)',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                <Server size={20} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <span
                    className="mono"
                    style={{
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      color: 'var(--accent-lime)',
                      backgroundColor: 'rgba(199, 255, 107, 0.12)',
                      padding: '1px 6px',
                      borderRadius: '2px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                    }}
                  >
                    <Zap size={10} /> RECOMMENDED HOSTING PARTNER
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#FFFFFF' }}>
                    Need High-Speed Web or Bot Hosting?
                  </span>
                  <span
                    className="mono"
                    style={{
                      fontSize: '0.6875rem',
                      color: 'var(--accent-blue)',
                      backgroundColor: 'rgba(92, 179, 255, 0.1)',
                      padding: '1px 6px',
                      borderRadius: '2px',
                    }}
                  >
                    Starts at ₹29/mo
                  </span>
                </div>

                <p style={{ margin: '0 0 10px 0', fontSize: '0.8125rem', color: '#94A3B8', lineHeight: 1.45 }}>
                  Power your Discord bots, portfolio, and client websites on BrackNodes NVMe infrastructure. Features 99.99% Uptime, cPanel controls, automated backups, and 24/7 dedicated support.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span className="mono" style={{ fontSize: '0.6875rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={12} color="var(--accent-lime)" /> Advanced DDoS Defense
                  </span>
                  <span className="mono" style={{ fontSize: '0.6875rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Zap size={12} color="var(--accent-lime)" /> Sub-15ms India Latency
                  </span>
                  <span
                    className="mono"
                    style={{
                      fontSize: '0.6875rem',
                      color: 'var(--accent-lime)',
                      backgroundColor: 'rgba(199, 255, 107, 0.08)',
                      padding: '2px 8px',
                      borderRadius: '2px',
                      border: '1px solid rgba(199, 255, 107, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Server size={11} /> Instant Auto-Provisioning
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <a
                href="https://bracknodes.in"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{
                  padding: '7px 14px',
                  fontSize: '0.75rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                <span>Deploy on BrackNodes</span>
                <ExternalLink size={12} />
              </a>

              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.setItem('bracknodes_overview_ad_dismissed', 'true');
                  } catch {}
                  setIsAdDismissed(true);
                }}
                title="Dismiss ad"
                style={{
                  background: 'none',
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
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

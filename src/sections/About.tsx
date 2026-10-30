import React, { useState } from 'react';
import { ShieldCheck, CornerDownRight } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { PORTFOLIO_DATA } from '../data/portfolio';
import { useCMS } from '../context/CMSContext';

const TABS = ['principles', 'stack', 'runtime'] as const;
type Tab = typeof TABS[number];

const STUDIO_STATS = [
  { value: '₹29/mo', label: 'Starting Price', sub: 'Most Affordable in India' },
  { value: '99.99%', label: 'Uptime SLA', sub: 'High Availability Nodes' },
  { value: '10 Gbps+', label: 'Anti-DDoS Shield', sub: 'Always-On Mitigation' },
  { value: '100% Pure', label: 'Enterprise NVMe', sub: 'High IOPS Read/Write' },
];

export const About: React.FC = () => {
  const { siteSettings } = useCMS();
  const [activeTab, setActiveTab]         = useState<Tab>('principles');
  const [customCmd, setCustomCmd]         = useState('');
  const [history, setHistory]             = useState<string[]>([
    '» System initialized. Type a command or click a chip below.',
  ]);

  const aSettings = siteSettings.aboutSettings;
  const sectionTag = siteSettings.sectionHeadings?.about?.tag || '02 // Platform Overview';
  const sectionTitle = siteSettings.sectionHeadings?.about?.title || 'WHY CHOOSE BRACKNODES';
  const sectionSubtitle = siteSettings.sectionHeadings?.about?.subtitle || 'High-availability NVMe cloud architecture, 99.99% uptime SLA, and India’s most budget-friendly server infrastructure.';

  const activeStats = (aSettings?.stats && aSettings.stats.length > 0) ? aSettings.stats : STUDIO_STATS;
  const narrativeHeading = aSettings?.narrativeHeading || 'Enterprise cloud performance at prices everyone can afford.';
  const narrativeParagraph1 = aSettings?.narrativeParagraph1 || 'BrackNodes was engineered to eliminate overpriced hosting in India. We provide developers, gaming communities, and businesses with reliable cloud solutions starting from just ₹29/month, backed by tier-1 low-latency networking.';
  const narrativeParagraph2 = aSettings?.narrativeParagraph2 || 'From lightweight Discord bots running on high-performance Pterodactyl panels to high-traffic WordPress websites powered by pure NVMe SSDs and cPanel, we keep your digital services active 24/7 with zero sleep cycles.';
  const activePillars = (aSettings?.pillars && aSettings.pillars.length > 0) ? aSettings.pillars : PORTFOLIO_DATA.philosophy;
  const terminalPrompt = aSettings?.terminalPrompt || 'root@bracknodes-node01:~$ ';
  const terminalLines = (aSettings?.terminalLines && aSettings.terminalLines.length > 0) ? aSettings.terminalLines : [
    { key: 'DATACENTER_NODES', val: 'Asia-South1 (India Tier-3 Facilities)' },
    { key: 'DDOS_MITIGATION', val: '10Gbps+ L3/L4/L7 Auto Shield' },
    { key: 'HARDWARE_PROFILE', val: 'Enterprise Multi-Core + Pure NVMe SSDs' },
    { key: 'SUPPORT_SLA', val: '24/7 Discord Ticket & Ticket Portal' },
  ];

  const runCommand = (cmd: string) => {
    const c = cmd.trim().toLowerCase();
    let output = '';
    if (c === 'npm test')        output = '✓ 48 test suites passed. 0 failed. Coverage: 98.4%.';
    else if (c === 'git status') output = 'On branch main. Working tree clean. Latest: feat(core): 60fps WebGL pipeline.';
    else if (c === 'cat stack.json') output = '{"frontend":"React 19 / TS 5.8","graphics":"Three.js / GSAP","perf":"Lighthouse 98"}';
    else if (c === 'help')       output = 'Available: npm test, git status, cat stack.json, clear';
    else if (c === 'clear')      { setHistory([]); return; }
    else                         output = `bash: ${cmd}: command not found. Try 'help'.`;
    setHistory(prev => [...prev.slice(-6), `$ ${cmd}`, output]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCmd.trim()) return;
    runCommand(customCmd);
    setCustomCmd('');
  };

  return (
    <section id="about" className="section-wrapper" style={{ backgroundColor: 'var(--bg-elevated)', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient */}
      <div className="glow-aurora glow-lime" style={{ width: '40vw', height: '40vw', bottom: '-10%', left: '-10%', opacity: 0.06 }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeading
          tag={sectionTag}
          title={sectionTitle}
          subtitle={sectionSubtitle}
          badgeColor="blue"
        />

        {/* Stats Grid */}
        <div
          className="about-stats-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))',
            gap: '1px',
            background: 'var(--border-subtle)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            marginBottom: 'clamp(1.75rem, 3.5vw, 3rem)',
          }}
        >
          {activeStats.map((s, i) => (
            <div
              key={i}
              style={{
                padding: '1.25rem 1.25rem',
                background: 'var(--bg-card)',
                transition: 'background var(--t-fast)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-card-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-card)')}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                  fontWeight: 800,
                  color: i % 2 === 0 ? 'var(--accent-lime)' : 'var(--accent-blue)',
                  lineHeight: 1,
                  marginBottom: '6px',
                  letterSpacing: '-0.01em',
                }}
              >
                {s.value}
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '3px' }}>
                {s.label}
              </div>
              <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {s.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Two-Column Split */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'clamp(2rem, 4vw, 3.5rem)',
            alignItems: 'start',
          }}
        >
          {/* Column 1: Narrative */}
          <div>
            <h3 style={{ fontSize: 'clamp(1.4rem, 2.2vw, 1.875rem)', marginBottom: '1.125rem', lineHeight: 1.22 }}>
              {narrativeHeading}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '0.875rem' }}>
              {narrativeParagraph1}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.75, marginBottom: '2.5rem' }}>
              {narrativeParagraph2}
            </p>

            {/* Philosophy Pillars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {activePillars.map((item, idx) => {
                const colors = ['var(--accent-lime)', 'var(--accent-blue)', 'var(--accent-purple)'];
                return (
                  <div
                    key={idx}
                    className="card-surface"
                    style={{
                      padding: '1.25rem 1.5rem',
                      borderLeft: `3px solid ${colors[idx % colors.length] || colors[0]}`,
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                      <span className="mono" style={{ color: colors[idx % colors.length] || colors[0], fontSize: '0.75rem', fontWeight: 700 }}>
                        0{idx + 1}.
                      </span>
                      <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{item.title}</h4>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.65, margin: 0 }}>
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Terminal Console */}
          <div
            className="card-surface"
            style={{
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            {/* Terminal Title Bar */}
            <div
              style={{
                backgroundColor: 'var(--bg-primary)',
                padding: '11px 16px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
                <span className="mono" style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                  {terminalPrompt}
                </span>
              </div>
              {/* Tab Switcher */}
              <div style={{ display: 'flex', gap: '2px' }}>
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className="mono"
                    style={{
                      fontSize: '0.6rem',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: activeTab === tab ? 'var(--accent-lime-muted)' : 'transparent',
                      color: activeTab === tab ? 'var(--accent-lime)' : 'var(--text-muted)',
                      border: `1px solid ${activeTab === tab ? 'var(--border-highlight)' : 'transparent'}`,
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      transition: 'all var(--t-fast)',
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Terminal Body */}
            <div
              style={{
                padding: '1.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                lineHeight: 1.75,
                background: 'var(--bg-primary)',
                minHeight: '220px',
              }}
            >
              {activeTab === 'principles' && (
                <div>
                  <div style={{ color: 'var(--accent-blue)', marginBottom: '8px' }}>$ inspect --principles</div>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '10px', fontSize: '0.75rem' }}>[i] Loading active architecture manifesto...</div>
                  {terminalLines.map((line) => (
                    <div key={line.key} style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>
                      &gt; <span style={{ color: 'var(--accent-lime)' }}>{line.key}:</span> {line.val}
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'stack' && (
                <div>
                  <div style={{ color: 'var(--accent-blue)', marginBottom: '8px' }}>$ bracknodes-cli stack --active</div>
                  {[
                    '[COMPUTE]  : High-Availability Tier-3 Indian Datacenters',
                    '[PANEL]    : Pterodactyl v1.11 / cPanel & WHM Suite',
                    '[STORAGE]  : Enterprise Pure NVMe SSDs (RAID 10)',
                    '[NETWORK]  : 1Gbps Uplink / Low-Latency Routing',
                    '[SECURITY] : Anycast L3/L4/L7 10Gbps+ DDoS Protection',
                    '[RUNTIMES] : Node.js, Python, PHP 8.x, Java, Go, MariaDB',
                  ].map((line, i) => (
                    <div key={i} style={{ color: 'var(--text-secondary)', marginBottom: '3px' }}>{line}</div>
                  ))}
                </div>
              )}
              {activeTab === 'runtime' && (
                <div>
                  <div style={{ color: 'var(--accent-blue)', marginBottom: '8px' }}>$ bracknodes-cli runtime --telemetry</div>
                  {[
                    'HOSTING_SLA     : 99.99% Node Availability Guarantee',
                    'DATACENTER_LOC  : Asia-South (Mumbai / Delhi Nodes)',
                    'ACTIVATION_TIME : Instant Automated 60-Second Provisioning',
                    'SUPPORT_CHANNELS: 24/7 Discord Community & Help Desk',
                  ].map((line, i) => (
                    <div key={i} style={{ color: 'var(--text-secondary)', marginBottom: '3px' }}>{line}</div>
                  ))}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '14px', color: 'var(--accent-lime)' }}>
                    <ShieldCheck size={13} />
                    <span>VERIFIED INFRASTRUCTURE PROVIDER</span>
                  </div>
                </div>
              )}

              {/* Interactive history */}
              {history.length > 0 && (
                <div style={{ marginTop: '14px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                  {history.map((line, i) => (
                    <div
                      key={i}
                      style={{
                        color: line.startsWith('$') ? 'var(--accent-lime)' : 'var(--text-muted)',
                        fontSize: '0.75rem',
                        lineHeight: 1.5,
                      }}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Chips */}
            <div
              style={{
                background: 'var(--bg-elevated)',
                padding: '8px 14px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '5px',
                alignItems: 'center',
              }}
            >
              <span className="mono" style={{ fontSize: '0.575rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Quick:
              </span>
              {['cat stack.json', 'npm test', 'git status', 'clear'].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => runCommand(chip)}
                  className="mono"
                  style={{
                    fontSize: '0.65rem',
                    padding: '2px 8px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--accent-blue)',
                    cursor: 'pointer',
                    transition: 'all var(--t-fast)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-blue)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                backgroundColor: 'var(--bg-primary)',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ padding: '8px 12px', color: 'var(--accent-lime)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>›</div>
              <input
                type="text"
                value={customCmd}
                onChange={(e) => setCustomCmd(e.target.value)}
                placeholder="type a command and press Enter..."
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  padding: '8px 0',
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--accent-lime)',
                  padding: '0 14px',
                  cursor: 'pointer',
                }}
              >
                <CornerDownRight size={13} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

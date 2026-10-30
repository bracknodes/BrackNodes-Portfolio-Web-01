import React, { useState } from 'react';
import { Layers, Box, Cpu, GitBranch, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { useCMS } from '../context/CMSContext';

const ARCH_NOTES = [
  {
    title: 'Pterodactyl Daemon (Wings) Runtime',
    code: `// High-density containerized Discord Bot isolation
docker run -d --name pterodactyl-wings --restart=always \\
  -v /var/lib/pterodactyl/:/var/lib/pterodactyl/ \\
  -v /var/run/docker.sock:/var/run/docker.sock ...`,
  },
  {
    title: 'NVMe I/O Performance Benchmark',
    code: `// Enterprise NVMe read/write speed benchmark
fio --name=randwrite --ioengine=libaio --iodepth=1 \\
  --rw=randwrite --bs=4k --direct=1 --size=256M \\
  // Result: 450,000+ IOPS sustained write`,
  },
  {
    title: 'Automated Anycast Anti-DDoS Filter',
    code: `// Real-time edge packet filtering & rate limiting
iptables -A PREROUTING -p udp -m length --length 0:28 -j DROP
iptables -A INPUT -p tcp --dport 80,443 -m connlimit ...`,
  },
  {
    title: 'cPanel Instant Provisioning Pipeline',
    code: `// Instant provisioning via WHM API v1
whmapi1 createacct username=client domain=app.in \\
  plan=NVMe-Starter ssl=1 ip=dedicated ...`,
  },
];

const CATEGORY_ICONS = [
  <Layers size={14} />,
  <Box size={14} />,
  <Cpu size={14} />,
  <GitBranch size={14} />,
];

export const Skills: React.FC = () => {
  const { skills, siteSettings } = useCMS();
  const [activeCategory, setActiveCategory] = useState(0);

  const headingConfig = siteSettings.sectionHeadings?.skills;
  const sectionTag = headingConfig?.tag ?? '04 // Hardware & Stack';
  const sectionTitle = headingConfig?.title ?? 'INFRASTRUCTURE STACK';
  const sectionSubtitle = headingConfig?.subtitle ?? 'Modern enterprise hardware, industry-standard virtualization, and low-latency network uplinks.';

  const current = skills[activeCategory] || skills[0] || { name: 'Skills', description: '', skills: [] };

  const activeNotes = (siteSettings.architectureNotes && siteSettings.architectureNotes.length > 0)
    ? siteSettings.architectureNotes
    : ARCH_NOTES;
  const currentNote = activeNotes[activeCategory] || activeNotes[0] || { title: 'Architecture Standard', code: '// Production verified' };

  return (
    <section id="skills" className="section-wrapper" style={{ backgroundColor: 'var(--bg-elevated)', position: 'relative', overflow: 'hidden' }}>
      <div className="glow-aurora glow-blue" style={{ width: '38vw', height: '38vw', bottom: '-12%', right: '-10%', opacity: 0.07 }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeading
          tag={sectionTag}
          title={sectionTitle}
          subtitle={sectionSubtitle}
          badgeColor="blue"
        />

        {/* Category Tabs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginBottom: '2rem',
            padding: '4px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            width: 'fit-content',
          }}
        >
          {skills.map((cat, idx) => {
            const isActive = activeCategory === idx;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => setActiveCategory(idx)}
                className="mono"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: 'calc(var(--radius-md) - 2px)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  border: 'none',
                  background: isActive ? 'var(--accent-lime-muted)' : 'transparent',
                  color: isActive ? 'var(--accent-lime)' : 'var(--text-secondary)',
                  transition: 'all var(--t-fast)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontWeight: isActive ? 600 : 400,
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <span style={{ color: isActive ? 'var(--accent-lime)' : 'var(--text-muted)' }}>
                  {CATEGORY_ICONS[idx % CATEGORY_ICONS.length]}
                </span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Category Display */}
        <div
          className="card-surface"
          style={{
            padding: 'clamp(1.375rem, 2.5vw, 2.25rem)',
            borderRadius: 'var(--radius-lg)',
            position: 'relative',
          }}
        >
          <span className="cyber-crosshair corner-tl" />
          <span className="cyber-crosshair corner-tr" />

          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.375rem', color: 'var(--text-primary)' }}>
              {current?.name || 'Skills'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
              {current?.description || ''}
            </p>
          </div>

          {/* Skill Pills Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '0.75rem',
              marginBottom: '2rem',
            }}
          >
            {current?.skills.map((skill) => (
              <div
                key={skill.name}
                style={{
                  padding: '0.875rem 1.125rem',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all var(--t-fast)',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-lime)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={12} color="var(--accent-lime)" />
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {skill.name}
                  </span>
                </div>
                <span
                  className="mono"
                  style={{
                    fontSize: '0.625rem',
                    color: 'var(--accent-blue)',
                    backgroundColor: 'var(--accent-blue-muted)',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-sm)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {skill.tag}
                </span>
              </div>
            ))}
          </div>

          {/* Code Architecture Snippet */}
          <div
            style={{
              padding: '1rem 1.25rem',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              overflow: 'hidden',
            }}
          >
            <div style={{ color: 'var(--accent-blue)', marginBottom: '8px', fontWeight: 600, fontSize: '0.75rem' }}>
              // {currentNote.title}
            </div>
            <pre
              style={{
                margin: 0,
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}
            >
              <code>{currentNote.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};

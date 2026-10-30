import React, { useState } from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { ProjectCard } from '../components/ProjectCard';
import { useCMS } from '../context/CMSContext';

const DEFAULT_FILTERS = [
  { label: 'All', key: 'All' },
  { label: 'Discord Bots', key: 'Discord' },
  { label: 'cPanel Hosting', key: 'cPanel' },
  { label: 'Cloud VPS', key: 'Cloud' },
];

export const Projects: React.FC = () => {
  const { projects, siteSettings } = useCMS();
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const headingConfig = siteSettings.sectionHeadings?.projects;
  const sectionTag = headingConfig?.tag ?? '01 // Hosting Plans';
  const sectionTitle = headingConfig?.title ?? 'FEATURED HOSTING TIERS';
  const sectionSubtitle = headingConfig?.subtitle ?? 'High-performance Discord bot hosting, pure NVMe cPanel packages, and scalable cloud compute engineered for reliability.';

  const filterTabs = headingConfig?.filterTabs && headingConfig.filterTabs.length > 0
    ? headingConfig.filterTabs
    : DEFAULT_FILTERS;

  const published = projects.filter((p) => p.isPublished);
  const activeTabObj = filterTabs.find((f) => f.key === activeFilter || f.label === activeFilter);
  const isAll = !activeTabObj || activeTabObj.key.toLowerCase() === 'all' || activeTabObj.label.toLowerCase() === 'all';
  const filterKeyLower = activeTabObj ? activeTabObj.key.toLowerCase() : '';

  const filtered = isAll
    ? published
    : published.filter((p) => {
        return (
          p.category.toLowerCase().includes(filterKeyLower) ||
          p.title.toLowerCase().includes(filterKeyLower) ||
          p.tags.some((t) => t.toLowerCase().includes(filterKeyLower))
        );
      });

  return (
    <section id="projects" className="section-wrapper" style={{ backgroundColor: 'var(--bg-primary)', overflow: 'hidden' }}>
      {/* Ambient glow */}
      <div
        className="glow-aurora glow-blue"
        style={{ width: '45vw', height: '45vw', top: '10%', right: '-15%', opacity: 0.07 }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Heading + Filter Row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '1.5rem',
            marginBottom: '1.75rem',
          }}
        >
          <SectionHeading
            tag={sectionTag}
            title={sectionTitle}
            subtitle={sectionSubtitle}
            badgeColor="lime"
          />

          {/* Filter Pills */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              alignSelf: 'flex-start',
              marginTop: '0.5rem',
            }}
          >
            {filterTabs.map((tab) => {
              const active = activeFilter === tab.key;
              return (
                <button
                  key={tab.key + tab.label}
                  type="button"
                  onClick={() => setActiveFilter(tab.key)}
                  className="mono"
                  style={{
                    fontSize: '0.7rem',
                    padding: '5px 13px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    border: `1px solid ${active ? 'var(--accent-lime)' : 'var(--border-subtle)'}`,
                    backgroundColor: active ? 'var(--accent-lime-muted)' : 'var(--bg-input)',
                    color: active ? 'var(--accent-lime)' : 'var(--text-secondary)',
                    fontWeight: active ? 700 : 500,
                    transition: 'all var(--t-fast)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.borderColor = 'var(--border-medium)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {filtered.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
          {filtered.length === 0 && (
            <div
              className="card-surface"
              style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}
            >
              <p className="mono" style={{ fontSize: '0.85rem', letterSpacing: '0.1em' }}>
                NO PROJECTS IN THIS CATEGORY YET
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

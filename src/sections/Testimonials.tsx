import React from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { useCMS } from '../context/CMSContext';
import { Quote, Star } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const { testimonials, siteSettings } = useCMS();

  const published = testimonials.filter((t) => t.isPublished);

  const displayList =
    published.length > 0
      ? published
      : [
          {
            id: 'sample-1',
            name: 'Rohan Verma',
            role: 'Lead Developer',
            company: 'Nexus Bot Community',
            content:
              'BrackNodes has kept our 10,000+ member Discord bot online 24/7 without a single crash. The Pterodactyl panel is super responsive, and at ₹29/mo it is truly unbeatable value in India.',
            rating: 5,
            isPublished: true,
            displayOrder: 0,
          },
          {
            id: 'sample-2',
            name: 'Aman Sharma',
            role: 'Founder & Tech Lead',
            company: 'CodeCraft Web Agency',
            content:
              'Migrated 12 client WordPress websites to BrackNodes NVMe cPanel hosting. TTFB dropped below 200ms instantly and page load times are blazing fast. Exceptional 24/7 support!',
            rating: 5,
            isPublished: true,
            displayOrder: 1,
          },
          {
            id: 'sample-3',
            name: 'Priya Patel',
            role: 'Infrastructure Architect',
            company: 'IndieDevs India',
            content:
              'The lowest ping server nodes in India! Full root VPS access and DDoS mitigation worked out of the box with zero downtime during traffic spikes. Highly recommended.',
            rating: 5,
            isPublished: true,
            displayOrder: 2,
          },
        ];

  if (siteSettings.navVisibility?.testimonials === false) {
    return null;
  }

  const headingConfig = siteSettings.sectionHeadings?.testimonials;
  const sectionTag = headingConfig?.tag ?? '06 // Community Feedback';
  const sectionTitle = headingConfig?.title ?? 'CUSTOMER REVIEWS';
  const sectionSubtitle = headingConfig?.subtitle ?? 'Verified testimonials from Discord bot developers, community owners, and webmasters hosting on BrackNodes.';

  return (
    <section id="testimonials" className="section-wrapper" style={{ backgroundColor: 'var(--bg-elevated)', position: 'relative', overflow: 'hidden' }}>
      <div className="glow-aurora glow-lime" style={{ width: '35vw', height: '35vw', top: '20%', right: '-10%', opacity: 0.05 }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeading
          tag={sectionTag}
          title={sectionTitle}
          subtitle={sectionSubtitle}
          badgeColor="lime"
          align="center"
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '1.25rem',
          }}
        >
          {displayList.map((item, idx) => {
            const accentColors = [
              'var(--accent-lime)',
              'var(--accent-blue)',
              'var(--accent-purple)',
            ];
            const accent = accentColors[idx % accentColors.length];

            return (
              <div
                key={item.id}
                className="card-surface"
                style={{
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all var(--t-normal)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                {/* Accent top-border line */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: accent,
                    opacity: 0.7,
                    borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                  }}
                />

                <div>
                  {/* Quote + Stars */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                    <Quote size={26} style={{ color: accent, opacity: 0.75, flexShrink: 0 }} />
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {Array.from({ length: item.rating || 5 }).map((_, i) => (
                        <Star key={i} size={13} style={{ color: accent, fill: accent }} />
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <p
                    style={{
                      color: 'var(--text-primary)',
                      fontSize: '0.9375rem',
                      lineHeight: 1.75,
                      marginBottom: '1.375rem',
                      fontStyle: 'normal',
                    }}
                  >
                    &ldquo;{item.content}&rdquo;
                  </p>
                </div>

                {/* Author */}
                <div
                  style={{
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${accent}22, ${accent}44)`,
                      border: `1px solid ${accent}55`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: accent,
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      fontFamily: 'var(--font-display)',
                      flexShrink: 0,
                    }}
                  >
                    {item.name.charAt(0)}
                  </div>

                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                      {item.name}
                    </div>
                    <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      {item.role} · <span style={{ color: accent }}>{item.company}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { ServiceCard } from '../components/ServiceCard';
import { useCMS } from '../context/CMSContext';

export const Services: React.FC = () => {
  const { services, siteSettings } = useCMS();
  const published = services.filter((s) => s.isPublished);

  const headingConfig = siteSettings.sectionHeadings?.services;
  const sectionTag = headingConfig?.tag ?? '03 // Cloud Infrastructure';
  const sectionTitle = headingConfig?.title ?? 'HOSTING CAPABILITIES';
  const sectionSubtitle = headingConfig?.subtitle ?? 'Engineered hosting solutions tailored to developers, gaming communities, and high-growth digital brands.';

  return (
    <section id="services" className="section-wrapper" style={{ backgroundColor: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient */}
      <div className="glow-aurora glow-purple" style={{ width: '42vw', height: '42vw', top: '20%', left: '-15%', opacity: 0.06 }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeading
          tag={sectionTag}
          title={sectionTitle}
          subtitle={sectionSubtitle}
          badgeColor="lime"
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 'clamp(1.25rem, 2.5vw, 2rem)',
          }}
        >
          {published.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

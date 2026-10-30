import React, { useState } from 'react';
import { Check, Sparkles, ArrowUpRight } from 'lucide-react';
import type { Service } from '../data/portfolio';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="card-surface service-card"
      style={{
        padding: 'clamp(1.375rem, 2.2vw, 2.125rem)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 'var(--radius-lg)',
        borderColor: hovered ? 'var(--border-medium)' : 'var(--border-subtle)',
        boxShadow: hovered ? 'var(--shadow-lg)' : 'none',
        transform: hovered ? 'translateY(-4px)' : 'none',
        transition: 'all var(--t-normal)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Number + Highlight tag */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <span
          className="mono"
          style={{
            fontSize: '2.25rem',
            fontWeight: 800,
            color: 'var(--accent-lime)',
            letterSpacing: '0',
            lineHeight: 1,
            opacity: 0.9,
          }}
        >
          {service.number}
        </span>
        <span
          className="badge badge-blue"
          style={{ flexShrink: 0 }}
        >
          <Sparkles size={10} />
          <span>{service.highlight}</span>
        </span>
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: 'clamp(1.1rem, 1.8vw, 1.4rem)',
          marginBottom: '0.375rem',
          lineHeight: 1.2,
          color: 'var(--text-primary)',
        }}
      >
        {service.title}
      </h3>

      {/* Tagline */}
      <p
        className="mono"
        style={{
          fontSize: '0.8125rem',
          color: 'var(--accent-blue)',
          marginBottom: '0.875rem',
          letterSpacing: '0.02em',
        }}
      >
        {service.tagline}
      </p>

      {/* Description */}
      <p
        style={{
          fontSize: '0.9375rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          marginBottom: '1.75rem',
          flex: 1,
        }}
      >
        {service.description}
      </p>

      {/* Deliverables */}
      <div style={{ marginBottom: '1.375rem' }}>
        <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>
          Scope & Deliverables
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {service.deliverables.map((item, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <Check size={13} color="var(--accent-lime)" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Bar */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ flex: 1, minWidth: '160px' }}>
          <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--accent-lime)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '3px' }}>
            Target Impact
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
            {service.outcomes.join(' · ')}
          </p>
        </div>

        <a
          href="#contact"
          className="btn btn-ghost"
          style={{ padding: '0.5rem 1rem', fontSize: '0.7rem' }}
        >
          <span>Select</span>
          <ArrowUpRight size={12} />
        </a>
      </div>
    </div>
  );
};

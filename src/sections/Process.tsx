import React, { useState } from 'react';
import { CheckCircle, Calendar } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { PORTFOLIO_DATA } from '../data/portfolio';
import { useCMS } from '../context/CMSContext';

export const Process: React.FC = () => {
  const { siteSettings, processSteps } = useCMS();
  const [activeStep, setActiveStep] = useState(0);

  const activeSteps = (processSteps && processSteps.length > 0) ? processSteps : PORTFOLIO_DATA.process;
  const current = activeSteps[activeStep] || activeSteps[0] || { step: '01', title: 'Phase', phase: 'Stage', description: '', outputs: [] };

  const headingConfig = siteSettings.sectionHeadings?.process;
  const sectionTag = headingConfig?.tag ?? '05 // Instant Setup Workflow';
  const sectionTitle = headingConfig?.title ?? 'PROVISIONING PROCESS';
  const sectionSubtitle = headingConfig?.subtitle ?? 'From plan selection to full deployment in less than 60 seconds with automated instant activation.';

  return (
    <section id="process" className="section-wrapper" style={{ backgroundColor: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      <div className="glow-aurora glow-lime" style={{ width: '36vw', height: '36vw', top: '-5%', right: '-8%', opacity: 0.06 }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeading
          tag={sectionTag}
          title={sectionTitle}
          subtitle={sectionSubtitle}
          badgeColor="lime"
        />

        {/* Timeline Step Selector */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '8px',
            marginBottom: '2.5rem',
          }}
        >
          {activeSteps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={step.step}
                type="button"
                onClick={() => setActiveStep(idx)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '1rem',
                  backgroundColor: isActive ? 'var(--accent-lime-muted)' : 'var(--bg-card)',
                  border: `1px solid ${isActive ? 'var(--accent-lime)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all var(--t-normal)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.borderColor = 'var(--border-medium)'; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
              >
                {/* Phase number */}
                <span
                  className="mono"
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: isActive ? 'var(--accent-lime)' : 'var(--text-muted)',
                    lineHeight: 1,
                    marginBottom: '6px',
                    letterSpacing: '-0.01em',
                    transition: 'color var(--t-fast)',
                  }}
                >
                  {step.step}
                </span>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    lineHeight: 1.3,
                    transition: 'color var(--t-fast)',
                  }}
                >
                  {step.title.split('&')[0].trim()}
                </span>
                <span
                  className="mono"
                  style={{
                    fontSize: '0.6rem',
                    color: isActive ? 'var(--accent-lime)' : 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginTop: '4px',
                    transition: 'color var(--t-fast)',
                  }}
                >
                  {step.phase}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Phase Detail */}
        <div
          className="card-surface"
          style={{
            padding: 'clamp(1.5rem, 3vw, 2.75rem)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--accent-lime)',
            boxShadow: '0 0 40px var(--accent-lime-glow)',
            position: 'relative',
            marginBottom: 0,
          }}
        >
          <span className="cyber-crosshair corner-tl" />
          <span className="cyber-crosshair corner-tr" />
          <span className="cyber-crosshair corner-bl" />
          <span className="cyber-crosshair corner-br" />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 'clamp(1.5rem, 3vw, 3rem)',
              alignItems: 'start',
            }}
          >
            {/* Left: Phase info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
                <span
                  className="mono"
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    color: 'var(--accent-lime)',
                    letterSpacing: '-0.01em',
                    lineHeight: 1,
                  }}
                >
                  {current.step}
                </span>
                <span className="badge badge-live">
                  <Calendar size={11} />
                  <span>{current.phase}</span>
                </span>
              </div>

              <h3
                style={{
                  fontSize: 'clamp(1.5rem, 2.5vw, 2.125rem)',
                  marginBottom: '1rem',
                  color: 'var(--text-primary)',
                  lineHeight: 1.18,
                }}
              >
                {current.title}
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.75, margin: 0 }}>
                {current.description}
              </p>
            </div>

            {/* Right: Deliverable checklist */}
            <div
              style={{
                padding: '1.125rem',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: '0.65rem',
                  color: 'var(--accent-lime)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <CheckCircle size={12} />
                Phase Deliverable Checklist
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {current.outputs.map((out, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      fontSize: '0.9rem',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <div
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent-blue)',
                        marginTop: '6px',
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ lineHeight: 1.5 }}>{out}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

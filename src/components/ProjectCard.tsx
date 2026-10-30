import React, { useState } from 'react';
import { ExternalLink, Play, Sliders, Radio } from 'lucide-react';
import type { Project } from '../types/cms';
import { useTheme } from '../hooks/useTheme';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const { isDark } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const isEven = index % 2 === 0;

  // Interactive sandbox state for Project 1: Kinetic Synth
  const [synthPulse, setSynthPulse] = useState(false);
  const [activeFrequency, setActiveFrequency] = useState(440);

  // Interactive sandbox state for Project 2: Synthesis Tokens
  const [themeMode, setThemeMode] = useState<'lime' | 'cyan' | 'stealth'>('lime');
  const [buttonVariant, setButtonVariant] = useState<'solid' | 'ghost'>('solid');
  const [borderRadius, setBorderRadius] = useState<number>(2);

  // Interactive sandbox state for Project 3: Orbital Telemetry
  const [activeSatellite, setActiveSatellite] = useState<'SAT-01' | 'SAT-02' | 'SAT-03'>('SAT-01');

  // Trigger pulse wave on Kinetic
  const handlePulse = () => {
    setSynthPulse(true);
    setActiveFrequency(prev => (prev === 440 ? 880 : prev === 880 ? 1200 : 440));
    setTimeout(() => setSynthPulse(false), 800);
  };

  const renderInteractivePreview = () => {
    switch (project.previewType) {
      case 'none':
        return null;

      case 'interactive-canvas':
        return (
          <div
            style={{
              width: '100%',
              minHeight: '290px',
              backgroundColor: isDark ? '#090c15' : '#f8fafc',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '1.25rem',
            }}
          >
            {/* Top Bar HUD */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  className="badge-dot"
                  style={{
                    backgroundColor: isDark ? '#C7FF6B' : '#16a34a',
                    boxShadow: isDark ? '0 0 8px #C7FF6B' : '0 0 6px rgba(22, 163, 74, 0.4)',
                  }}
                />
                <span
                  className="mono"
                  style={{
                    fontSize: '0.6875rem',
                    color: isDark ? '#C7FF6B' : '#15803d',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                  }}
                >
                  AUDIO-DSP // {activeFrequency} HZ SYNTH
                </span>
              </div>
              <button
                type="button"
                onClick={handlePulse}
                className="mono"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: isDark ? 'rgba(199, 255, 107, 0.15)' : 'rgba(22, 163, 74, 0.12)',
                  border: `1px solid ${isDark ? '#C7FF6B' : '#16a34a'}`,
                  color: isDark ? '#C7FF6B' : '#15803d',
                  padding: '4px 12px',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  transition: 'all 0.2s ease',
                }}
              >
                <Play size={10} fill="currentColor" />
                <span>TRIGGER WAVE</span>
              </button>
            </div>

            {/* Interactive Dynamic Frequency Waveform */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '7px',
                height: '130px',
                padding: '10px 0',
              }}
            >
              {[32, 64, 48, 96, 72, 120, 84, 52, 108, 68, 44, 90, 60, 115, 75, 40].map((baseHeight, i) => {
                const waveHeight = synthPulse
                  ? Math.min(130, baseHeight * 1.45)
                  : isHovered
                  ? baseHeight * (1 + (i % 4) * 0.15)
                  : baseHeight;
                const isLime = i % 2 === 0;
                const barColor = isLime
                  ? (isDark ? '#C7FF6B' : '#16a34a')
                  : (isDark ? '#70B9FF' : '#2563eb');
                const barShadow = isLime
                  ? (isDark ? '0 0 12px rgba(199, 255, 107, 0.6)' : '0 2px 8px rgba(22, 163, 74, 0.25)')
                  : (isDark ? '0 0 12px rgba(112, 185, 255, 0.6)' : '0 2px 8px rgba(37, 99, 235, 0.25)');

                return (
                  <div
                    key={i}
                    style={{
                      width: '6px',
                      height: `${waveHeight}px`,
                      backgroundColor: barColor,
                      borderRadius: '3px',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: barShadow,
                    }}
                  />
                );
              })}
            </div>

            {/* Bottom HUD metrics */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: `1px solid ${isDark ? '#1c263c' : '#e2e8f0'}`,
                paddingTop: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: isDark ? '#8b97b0' : '#64748b',
                letterSpacing: '0.05em',
              }}
            >
              <span>CH: STEREO 32-BIT</span>
              <span style={{ color: isDark ? '#C7FF6B' : '#15803d', fontWeight: 700 }}>BUFFER: 512 SAMPLES</span>
              <span>LATENCY: 4.8 MS</span>
            </div>
          </div>
        );

      case 'code-visualizer':
        const themeColor = isDark
          ? (themeMode === 'lime' ? '#C7FF6B' : themeMode === 'cyan' ? '#70B9FF' : '#FFFFFF')
          : (themeMode === 'lime' ? '#65a30d' : themeMode === 'cyan' ? '#0284c7' : '#0f172a');

        return (
          <div
            style={{
              width: '100%',
              minHeight: '290px',
              backgroundColor: isDark ? '#090c15' : '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '1.25rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
            }}
          >
            {/* Live Controls Toolbar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: `1px solid ${isDark ? '#1c263c' : '#e2e8f0'}`,
                paddingBottom: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={14} color={isDark ? '#70B9FF' : '#2563eb'} />
                <span
                  style={{
                    color: isDark ? '#f0f2f5' : '#0f172a',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                  }}
                >
                  INTERACTIVE COMPONENT LAB
                </span>
              </div>

              {/* Theme Selector Pills */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {(['lime', 'cyan', 'stealth'] as const).map(t => {
                  const tColor = isDark
                    ? (t === 'lime' ? '#C7FF6B' : t === 'cyan' ? '#70B9FF' : '#FFFFFF')
                    : (t === 'lime' ? '#15803d' : t === 'cyan' ? '#0284c7' : '#0f172a');
                  const isSelected = themeMode === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setThemeMode(t)}
                      style={{
                        background: isSelected
                          ? (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)')
                          : 'transparent',
                        border: `1px solid ${isSelected ? tColor : (isDark ? '#25324b' : '#cbd5e1')}`,
                        color: isSelected ? tColor : (isDark ? '#8b97b0' : '#64748b'),
                        fontSize: '0.625rem',
                        padding: '3px 8px',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        fontWeight: isSelected ? 700 : 500,
                      }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Component Preview Sandbox Area */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.25rem',
                backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : '#ffffff',
                borderRadius: '4px',
                border: `1px dashed ${isDark ? '#25324b' : '#cbd5e1'}`,
                boxShadow: isDark ? 'none' : 'inset 0 1px 3px rgba(0,0,0,0.03)',
                gap: '12px',
              }}
            >
              <button
                type="button"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  padding: '9px 22px',
                  borderRadius: `${borderRadius}px`,
                  backgroundColor: buttonVariant === 'solid' ? themeColor : 'transparent',
                  color: buttonVariant === 'solid' ? (isDark ? '#090B10' : '#ffffff') : themeColor,
                  border: `1px solid ${themeColor}`,
                  boxShadow: isDark ? `0 0 20px ${themeColor}55` : `0 2px 10px ${themeColor}44`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                SampleButton.tsx
              </button>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setButtonVariant(buttonVariant === 'solid' ? 'ghost' : 'solid')}
                  style={{
                    fontSize: '0.625rem',
                    color: isDark ? '#cbd5e1' : '#334155',
                    background: isDark ? '#151d2c' : '#f1f5f9',
                    border: `1px solid ${isDark ? '#283750' : '#cbd5e1'}`,
                    padding: '3px 9px',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  STYLE: {buttonVariant.toUpperCase()}
                </button>

                <button
                  type="button"
                  onClick={() => setBorderRadius(borderRadius === 2 ? 8 : borderRadius === 8 ? 24 : 2)}
                  style={{
                    fontSize: '0.625rem',
                    color: isDark ? '#cbd5e1' : '#334155',
                    background: isDark ? '#151d2c' : '#f1f5f9',
                    border: `1px solid ${isDark ? '#283750' : '#cbd5e1'}`,
                    padding: '3px 9px',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  RADIUS: {borderRadius}PX
                </button>
              </div>
            </div>

            {/* Code Output Snippet */}
            <div
              style={{
                color: isDark ? '#94a3b8' : '#334155',
                fontSize: '0.6875rem',
                lineHeight: 1.6,
                backgroundColor: isDark ? 'transparent' : '#f1f5f9',
                padding: isDark ? 0 : '8px 12px',
                borderRadius: '3px',
              }}
            >
              <div>
                <span style={{ color: isDark ? '#ff7b72' : '#cf222e', fontWeight: 600 }}>const</span>{' '}
                <span style={{ color: isDark ? '#79c0ff' : '#0550ae' }}>activeToken</span> = &#123;
              </div>
              <div style={{ paddingLeft: '1rem' }}>
                <span style={{ color: isDark ? '#7ee787' : '#116329' }}>theme</span>:{' '}
                <span style={{ color: themeColor, fontWeight: 600 }}>"{themeMode}"</span>,{' '}
                <span style={{ color: isDark ? '#7ee787' : '#116329' }}>radius</span>:{' '}
                <span style={{ color: isDark ? '#C7FF6B' : '#15803d', fontWeight: 600 }}>{borderRadius}</span>,{' '}
                <span style={{ color: isDark ? '#7ee787' : '#116329' }}>wcag</span>:{' '}
                <span style={{ color: isDark ? '#C7FF6B' : '#15803d', fontWeight: 600 }}>"AAA"</span>
              </div>
              <div>&#125;;</div>
            </div>
          </div>
        );

      case 'telemetry-dashboard':
        const satDetails = {
          'SAT-01': { alt: '540 KM', vel: '7.62 KM/S', latency: '2.4 MS', status: 'OPTIMAL' },
          'SAT-02': { alt: '680 KM', vel: '7.45 KM/S', latency: '4.1 MS', status: 'SYNCING' },
          'SAT-03': { alt: '490 KM', vel: '7.81 KM/S', latency: '1.9 MS', status: 'LOCKED' },
        }[activeSatellite];

        return (
          <div
            style={{
              width: '100%',
              minHeight: '290px',
              backgroundColor: isDark ? '#090c15' : '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '1.25rem',
            }}
          >
            {/* Telemetry Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Radio size={14} color={isDark ? '#C7FF6B' : '#15803d'} />
                <span
                  className="mono"
                  style={{
                    fontSize: '0.75rem',
                    color: isDark ? '#f0f2f5' : '#0f172a',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                  }}
                >
                  ORBITAL SPATIAL FEED
                </span>
              </div>

              {/* Satellite Selector Chips */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {(['SAT-01', 'SAT-02', 'SAT-03'] as const).map(sat => {
                  const isSelected = activeSatellite === sat;
                  return (
                    <button
                      key={sat}
                      type="button"
                      onClick={() => setActiveSatellite(sat)}
                      className="mono"
                      style={{
                        fontSize: '0.625rem',
                        padding: '3px 8px',
                        backgroundColor: isSelected
                          ? (isDark ? 'rgba(199, 255, 107, 0.18)' : 'rgba(22, 163, 74, 0.12)')
                          : 'transparent',
                        border: `1px solid ${isSelected ? (isDark ? '#C7FF6B' : '#16a34a') : (isDark ? '#223048' : '#cbd5e1')}`,
                        color: isSelected ? (isDark ? '#C7FF6B' : '#15803d') : (isDark ? '#8b97b0' : '#64748b'),
                        borderRadius: '2px',
                        cursor: 'pointer',
                        fontWeight: isSelected ? 700 : 500,
                      }}
                    >
                      {sat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Radar / Geospatial Grid Graphic */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '8px 0', position: 'relative' }}>
              <svg width="220" height="96" viewBox="0 0 220 96">
                <circle cx="110" cy="48" r="44" stroke={isDark ? '#23324d' : '#cbd5e1'} strokeWidth="1.5" fill="none" />
                <circle cx="110" cy="48" r="28" stroke={isDark ? '#23324d' : '#cbd5e1'} strokeWidth="1" strokeDasharray="3 3" fill="none" />
                <line x1="110" y1="4" x2="110" y2="92" stroke={isDark ? '#23324d' : '#cbd5e1'} strokeWidth="1" />
                <line x1="22" y1="48" x2="198" y2="48" stroke={isDark ? '#23324d' : '#cbd5e1'} strokeWidth="1" />
                {/* Active Satellite Node */}
                <circle cx={activeSatellite === 'SAT-01' ? 135 : activeSatellite === 'SAT-02' ? 85 : 120} cy={activeSatellite === 'SAT-01' ? 32 : activeSatellite === 'SAT-02' ? 58 : 65} r="5" fill={isDark ? '#C7FF6B' : '#16a34a'} />
                <circle cx={activeSatellite === 'SAT-01' ? 135 : activeSatellite === 'SAT-02' ? 85 : 120} cy={activeSatellite === 'SAT-01' ? 32 : activeSatellite === 'SAT-02' ? 58 : 65} r="10" stroke={isDark ? '#C7FF6B' : '#16a34a'} strokeWidth="1.5" fill="none" opacity="0.6" />
              </svg>
            </div>

            {/* Live Metrics Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '6px',
                borderTop: `1px solid ${isDark ? '#1c263c' : '#e2e8f0'}`,
                paddingTop: '8px',
              }}
            >
              <div>
                <div className="mono" style={{ fontSize: '0.625rem', color: isDark ? '#8290a8' : '#64748b', letterSpacing: '0.05em' }}>ALTITUDE</div>
                <div className="mono" style={{ fontSize: '0.8125rem', color: isDark ? '#f0f2f5' : '#0f172a', fontWeight: 700 }}>{satDetails.alt}</div>
              </div>
              <div>
                <div className="mono" style={{ fontSize: '0.625rem', color: isDark ? '#8290a8' : '#64748b', letterSpacing: '0.05em' }}>VELOCITY</div>
                <div className="mono" style={{ fontSize: '0.8125rem', color: isDark ? '#f0f2f5' : '#0f172a', fontWeight: 700 }}>{satDetails.vel}</div>
              </div>
              <div>
                <div className="mono" style={{ fontSize: '0.625rem', color: isDark ? '#8290a8' : '#64748b', letterSpacing: '0.05em' }}>LATENCY</div>
                <div className="mono" style={{ fontSize: '0.8125rem', color: isDark ? '#C7FF6B' : '#15803d', fontWeight: 700 }}>{satDetails.latency}</div>
              </div>
              <div>
                <div className="mono" style={{ fontSize: '0.625rem', color: isDark ? '#8290a8' : '#64748b', letterSpacing: '0.05em' }}>LINK</div>
                <div className="mono" style={{ fontSize: '0.8125rem', color: isDark ? '#70B9FF' : '#0284c7', fontWeight: 700 }}>{satDetails.status}</div>
              </div>
            </div>
          </div>
        );

      case 'custom-image':
        return (
          <div
            style={{
              width: '100%',
              minHeight: '290px',
              backgroundColor: isDark ? '#090c15' : '#f8fafc',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {project.previewImage ? (
              <img
                src={project.previewImage}
                alt={project.title}
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: '290px',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                  transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                }}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                <span className="mono" style={{ fontSize: '0.8rem' }}>[ No Preview Image Provided ]</span>
              </div>
            )}
            <div
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: isDark ? 'rgba(9,12,21,0.85)' : 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(8px)',
                padding: '4px 10px',
                borderRadius: '2px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <span className="mono" style={{ fontSize: '0.65rem', color: resolvedAccent, fontWeight: 700 }}>
                SNAPSHOT // {project.category.split('/')[0].trim().toUpperCase()}
              </span>
            </div>
          </div>
        );

      case 'custom-code':
        return (
          <div
            style={{
              width: '100%',
              minHeight: '290px',
              backgroundColor: isDark ? '#090c15' : '#f8fafc',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '1.25rem',
            }}
            dangerouslySetInnerHTML={{
              __html:
                project.customPreviewCode ||
                `<div style="text-align:center;color:var(--text-muted);font-family:var(--font-mono);font-size:0.8rem;">[ Custom Code Sandbox Empty ]</div>`,
            }}
          />
        );
    }
  };

  const resolvedAccent =
    project.accentColor === '#C7FF6B' || project.accentColor === '#b8f04a'
      ? 'var(--accent-lime)'
      : project.accentColor === '#70B9FF' || project.accentColor === '#60a8f8'
      ? 'var(--accent-blue)'
      : project.accentColor;

  const hasPreview = Boolean(project.previewType && project.previewType !== 'none');
  const hasTags = Boolean(project.tags && project.tags.filter((t) => t && t.trim()).length > 0);
  const descText = project.longDescription?.trim() || project.description?.trim();

  return (
    <article
      className="card-surface project-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: hasPreview ? (isEven ? '1.15fr 1fr' : '1fr 1.15fr') : '1fr',
        gap: 'clamp(1.25rem, 2.5vw, 2rem)',
        padding: 'clamp(1.25rem, 2vw, 2rem)',
        marginBottom: 'clamp(1rem, 1.5vw, 1.5rem)',
        alignItems: 'center',
        border: `1px solid ${isHovered ? resolvedAccent : 'var(--border-subtle)'}`,
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
      }}
    >
      {/* Cybernetic Corner Crosshairs */}
      <span className="cyber-crosshair corner-tl" />
      <span className="cyber-crosshair corner-tr" />
      <span className="cyber-crosshair corner-bl" />
      <span className="cyber-crosshair corner-br" />

      {/* Column 1: Details & Meta (Auto-settles tightly to content) */}
      <div
        style={{
          order: isEven ? 1 : 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 'clamp(0.75rem, 1.5vw, 1rem)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="mono" style={{ color: resolvedAccent, fontSize: '0.75rem', fontWeight: 700 }}>
            0{index + 1} // {project.category}
          </span>
          <span style={{ color: 'var(--border-subtle)' }}>•</span>
          <span className="mono" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            {project.year}
          </span>
        </div>

        <h3
          style={{
            fontSize: 'clamp(1.5rem, 2.5vw, 2.15rem)',
            margin: 0,
            color: 'var(--text-primary)',
            lineHeight: 1.25,
          }}
        >
          {project.title}
        </h3>

        {descText && (
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {descText}
          </p>
        )}

        {/* Technical Specs / Metrics */}
        {project.metrics && project.metrics.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 95px), 1fr))',
              gap: '10px',
              padding: '12px 14px',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '2px',
              margin: 0,
            }}
          >
            {project.metrics.map((m, i) => (
              <div key={i}>
                <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {m.label}
                </div>
                <div className="mono" style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tech Tags (Only rendered if tags exist) */}
        {hasTags && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: 0 }}>
            {project.tags
              .filter((tag) => tag && tag.trim())
              .map((tag) => (
                <span
                  key={tag}
                  className="mono"
                  style={{
                    fontSize: '0.7rem',
                    padding: '4px 10px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    borderRadius: '2px',
                  }}
                >
                  {tag}
                </span>
              ))}
          </div>
        )}

        {/* Action Links */}
        {(project.liveUrl || project.repoUrl) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', margin: 0 }}>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ padding: '0.6875rem 1.35rem', fontSize: '0.8125rem' }}
              >
                <span>Launch Live</span>
                <ExternalLink size={14} />
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ padding: '0.6875rem 1.35rem', fontSize: '0.8125rem' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
                <span>View Source</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Column 2: Simulated Interactive Sandbox Preview */}
      {hasPreview && (
        <div
          style={{
            order: isEven ? 2 : 1,
            border: isDark ? '1px solid #1c263c' : '1px solid #e2e8f0',
            borderRadius: '4px',
            overflow: 'hidden',
            boxShadow: isDark
              ? (isHovered ? `0 14px 35px ${project.accentColor}25` : '0 10px 28px rgba(0,0,0,0.5)')
              : (isHovered ? '0 12px 30px rgba(0,0,0,0.08)' : '0 4px 16px rgba(0,0,0,0.04)'),
            transition: 'all 0.35s ease',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {renderInteractivePreview()}
        </div>
      )}
    </article>
  );
};

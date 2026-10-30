import React from 'react';

interface SectionHeadingProps {
  tag: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  badgeColor?: 'lime' | 'blue' | 'purple';
  /** Wrap the title — array of parts, each optionally highlighted */
  titleParts?: Array<{ text: string; highlight?: boolean }>;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  tag,
  title,
  subtitle,
  align = 'left',
  badgeColor = 'lime',
  titleParts,
}) => {
  const accentVar = badgeColor === 'blue'
    ? 'var(--accent-blue)'
    : badgeColor === 'purple'
    ? 'var(--accent-purple)'
    : 'var(--accent-lime)';

  return (
    <div
      style={{
        marginBottom: 'clamp(1rem, 2vw, 1.5rem)',
        textAlign: align,
        maxWidth: align === 'center' ? '820px' : '900px',
        marginInline: align === 'center' ? 'auto' : undefined,
      }}
    >
      {/* Section Tag */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '0.875rem',
        }}
      >
        <div
          style={{
            width: '24px',
            height: '2px',
            background: accentVar,
            flexShrink: 0,
          }}
        />
        <span
          className="mono"
          style={{
            fontSize: '0.725rem',
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            color: accentVar,
            fontWeight: 700,
          }}
        >
          {tag}
        </span>
      </div>

      {/* Section Title */}
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.75rem, 3.6vw, 2.85rem)',
          fontWeight: 800,
          letterSpacing: '-0.015em',
          lineHeight: 1.12,
          marginBottom: subtitle ? '0.875rem' : '0',
          textTransform: 'uppercase',
          color: 'var(--text-primary)',
        }}
      >
        {titleParts
          ? titleParts.map((part, i) =>
              part.highlight ? (
                <span key={i} className="gradient-text">
                  {part.text}
                </span>
              ) : (
                <span key={i}>{part.text}</span>
              ),
            )
          : title}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p
          style={{
            fontSize: 'clamp(0.9375rem, 1.2vw, 1.0625rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.65,
            maxWidth: align === 'center' ? '560px' : '600px',
            marginInline: align === 'center' ? 'auto' : undefined,
            fontWeight: 400,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

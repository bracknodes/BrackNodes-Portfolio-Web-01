import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import type { DesignTheme } from '../../../types/cms';
import { Check, Type, Code2, ArrowRight, Box } from 'lucide-react';

interface DesignViewProps {
  onNavigateToTypography?: () => void;
  onNavigateToCustomCode?: () => void;
  onNavigateToHero3D?: () => void;
}

export const DesignView: React.FC<DesignViewProps> = ({ onNavigateToTypography, onNavigateToCustomCode, onNavigateToHero3D }) => {
  const { siteSettings, updateSiteSettings, applyTheme } = useCMS();

  const currentTheme = siteSettings.designTheme || {
    primaryAccent: '#C7FF6B',
    secondaryAccent: '#70B9FF',
    bgPrimary: '#090B10',
    bgElevated: '#11151F',
    textPrimary: '#F7F7F2',
    textSecondary: '#9FA8BC',
    borderRadius: '3px',
    themeName: 'Cyber Dark Lime',
  };

  const [theme, setTheme] = useState<DesignTheme>(currentTheme);
  const [themeMode, setThemeMode] = useState<'both' | 'dark-only' | 'light-only'>(
    siteSettings.themeSettings?.themeMode || 'both'
  );
  const [defaultTheme, setDefaultTheme] = useState<'dark' | 'light'>(
    siteSettings.themeSettings?.defaultTheme || 'dark'
  );
  const [saveAlert, setSaveAlert] = useState(false);

  const presets: DesignTheme[] = [
    {
      themeName: 'Cyber Dark Lime',
      primaryAccent: '#C7FF6B',
      secondaryAccent: '#70B9FF',
      bgPrimary: '#090B10',
      bgElevated: '#11151F',
      textPrimary: '#F7F7F2',
      textSecondary: '#9FA8BC',
      borderRadius: '3px',
    },
    {
      themeName: 'Electric Cyan',
      primaryAccent: '#70B9FF',
      secondaryAccent: '#C7FF6B',
      bgPrimary: '#080C14',
      bgElevated: '#0F1626',
      textPrimary: '#F5F8FF',
      textSecondary: '#8CA0C0',
      borderRadius: '4px',
    },
    {
      themeName: 'Monochrome Stealth',
      primaryAccent: '#FFFFFF',
      secondaryAccent: '#9FA8BC',
      bgPrimary: '#0A0A0A',
      bgElevated: '#141414',
      textPrimary: '#EDEDED',
      textSecondary: '#888888',
      borderRadius: '2px',
    },
    {
      themeName: 'Midnight Aurora',
      primaryAccent: '#FF70C7',
      secondaryAccent: '#70B9FF',
      bgPrimary: '#0D0914',
      bgElevated: '#181224',
      textPrimary: '#FDF7FF',
      textSecondary: '#B09FBF',
      borderRadius: '6px',
    },
  ];

  const handleSelectPreset = (p: DesignTheme) => {
    setTheme(p);
    applyTheme(p);
  };

  const handleColorChange = (key: keyof DesignTheme, val: string) => {
    const updated = { ...theme, [key]: val, themeName: 'Custom Palette' };
    setTheme(updated);
    applyTheme(updated);
  };

  const handleSaveTheme = async () => {
    await updateSiteSettings({
      designTheme: theme,
      themeSettings: {
        themeMode,
        defaultTheme,
      },
    });
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 2500);
  };

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Design Customization &amp; Themes</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
          Fine-tune global CSS tokens, brand accents, background tones, and color harmony.
        </p>
      </div>

      {/* Quick Navigation Banners */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {onNavigateToHero3D && (
          <div
            onClick={onNavigateToHero3D}
            style={{
              padding: '1.25rem 1.5rem',
              backgroundColor: '#0c0f17',
              border: '1px solid #1c2438',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'border-color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-lime)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1c2438')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(199, 255, 107, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-lime)',
                }}
              >
                <Box size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#F7F7F2', marginBottom: '2px' }}>
                  3D Hero Object &amp; Scene Studio
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                  Change 3D shape, rotation speed, orbit rings &amp; materials.
                </div>
              </div>
            </div>
            <ArrowRight size={16} style={{ color: 'var(--accent-lime)' }} />
          </div>
        )}

        {onNavigateToTypography && (
          <div
            onClick={onNavigateToTypography}
            style={{
              padding: '1.25rem 1.5rem',
              backgroundColor: '#0c0f17',
              border: '1px solid #1c2438',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'border-color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-lime)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1c2438')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(199, 255, 107, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-lime)',
                }}
              >
                <Type size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#F7F7F2', marginBottom: '2px' }}>
                  Section Typography &amp; Fonts
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                  Choose custom Google Fonts for every section.
                </div>
              </div>
            </div>
            <ArrowRight size={16} style={{ color: 'var(--accent-lime)' }} />
          </div>
        )}

        {onNavigateToCustomCode && (
          <div
            onClick={onNavigateToCustomCode}
            style={{
              padding: '1.25rem 1.5rem',
              backgroundColor: '#0c0f17',
              border: '1px solid #1c2438',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'border-color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-blue)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1c2438')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(112, 185, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-blue)',
                }}
              >
                <Code2 size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#F7F7F2', marginBottom: '2px' }}>
                  Custom Code (CSS &amp; JS)
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                  Inject custom stylesheets and analytics scripts.
                </div>
              </div>
            </div>
            <ArrowRight size={16} style={{ color: 'var(--accent-blue)' }} />
          </div>
        )}
      </div>

      {/* Theme Availability & Default Mode Strategy */}
      <div className="card-surface" style={{ padding: '1.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
        <h3 className="mono" style={{ fontSize: '0.9rem', color: 'var(--accent-lime)', marginBottom: '1.25rem' }}>
          // 01. THEME MODE &amp; AVAILABILITY STRATEGY
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Theme Mode Option */}
          <div>
            <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              THEME MODE AVAILABILITY
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { id: 'both', label: 'Both Dark & Light (Visitor Can Toggle)', desc: 'Navbar shows sun/moon button allowing users to switch.' },
                { id: 'dark-only', label: 'Dark Mode Only (Locked)', desc: 'Site is permanently in Cyber Dark mode; toggle button hidden.' },
                { id: 'light-only', label: 'Light Mode Only (Locked)', desc: 'Site is permanently in Clean Light mode; toggle button hidden.' },
              ].map((opt) => (
                <label
                  key={opt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '10px 12px',
                    backgroundColor: themeMode === opt.id ? 'var(--accent-lime-muted)' : '#0c0f17',
                    border: `1px solid ${themeMode === opt.id ? 'var(--accent-lime)' : 'var(--border-subtle)'}`,
                    borderRadius: '3px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <input
                    type="radio"
                    name="themeMode"
                    checked={themeMode === opt.id}
                    onChange={() => setThemeMode(opt.id as any)}
                    style={{ marginTop: '3px' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: themeMode === opt.id ? 'var(--accent-lime)' : 'var(--text-primary)' }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {opt.desc}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Default Theme For New Visitors */}
          <div>
            <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              DEFAULT THEME FOR NEW VISITORS
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { id: 'dark', label: 'Dark Theme (Default)', desc: 'New visitors first land on Cyber Dark palette.' },
                { id: 'light', label: 'Light Theme (Default)', desc: 'New visitors first land on Clean Editorial Light palette.' },
              ].map((opt) => (
                <label
                  key={opt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '10px 12px',
                    backgroundColor: defaultTheme === opt.id ? 'var(--accent-blue-muted)' : '#0c0f17',
                    border: `1px solid ${defaultTheme === opt.id ? 'var(--accent-blue)' : 'var(--border-subtle)'}`,
                    borderRadius: '3px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <input
                    type="radio"
                    name="defaultTheme"
                    checked={defaultTheme === opt.id}
                    onChange={() => setDefaultTheme(opt.id as any)}
                    style={{ marginTop: '3px' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: defaultTheme === opt.id ? 'var(--accent-blue)' : 'var(--text-primary)' }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {opt.desc}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveTheme}
          className="btn btn-primary"
          style={{ padding: '8px 18px', fontSize: '0.75rem' }}
        >
          Save Theme Settings
        </button>
      </div>

      {/* Preset Palette Chooser */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
          CURATED PALETTE PRESETS
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {presets.map((p) => {
            const isSelected = theme.themeName === p.themeName;
            return (
              <button
                key={p.themeName}
                type="button"
                onClick={() => handleSelectPreset(p)}
                style={{
                  padding: '1.25rem',
                  backgroundColor: p.bgElevated,
                  border: `2px solid ${isSelected ? p.primaryAccent : '#1c2438'}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? `0 0 20px ${p.primaryAccent}33` : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: p.textPrimary }}>
                    {p.themeName}
                  </span>
                  {isSelected && <Check size={16} color={p.primaryAccent} />}
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: p.primaryAccent }} />
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: p.secondaryAccent }} />
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: p.bgPrimary, border: '1px solid #333' }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Custom Token Controls */}
      <div className="card-surface" style={{ padding: '1.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: 'var(--accent-lime)' }}>
          // Fine-Grain Color Customization
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          {/* Primary Accent */}
          <div>
            <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              PRIMARY ACCENT
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="color"
                value={theme.primaryAccent}
                onChange={(e) => handleColorChange('primaryAccent', e.target.value)}
                style={{ width: '40px', height: '38px', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}
              />
              <input
                type="text"
                value={theme.primaryAccent}
                onChange={(e) => handleColorChange('primaryAccent', e.target.value)}
                style={{ flex: 1, padding: '0.65rem', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}
              />
            </div>
          </div>

          {/* Secondary Accent */}
          <div>
            <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              SECONDARY ACCENT
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="color"
                value={theme.secondaryAccent}
                onChange={(e) => handleColorChange('secondaryAccent', e.target.value)}
                style={{ width: '40px', height: '38px', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}
              />
              <input
                type="text"
                value={theme.secondaryAccent}
                onChange={(e) => handleColorChange('secondaryAccent', e.target.value)}
                style={{ flex: 1, padding: '0.65rem', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}
              />
            </div>
          </div>

          {/* Background Primary */}
          <div>
            <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              BACKGROUND BASE
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="color"
                value={theme.bgPrimary}
                onChange={(e) => handleColorChange('bgPrimary', e.target.value)}
                style={{ width: '40px', height: '38px', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}
              />
              <input
                type="text"
                value={theme.bgPrimary}
                onChange={(e) => handleColorChange('bgPrimary', e.target.value)}
                style={{ flex: 1, padding: '0.65rem', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}
              />
            </div>
          </div>

          {/* Surface Elevated */}
          <div>
            <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              SURFACE ELEVATED
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="color"
                value={theme.bgElevated}
                onChange={(e) => handleColorChange('bgElevated', e.target.value)}
                style={{ width: '40px', height: '38px', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}
              />
              <input
                type="text"
                value={theme.bgElevated}
                onChange={(e) => handleColorChange('bgElevated', e.target.value)}
                style={{ flex: 1, padding: '0.65rem', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}
              />
            </div>
          </div>
        </div>

        {/* Live UI Component Sandbox Preview */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
          <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
            LIVE SYSTEM PREVIEW
          </div>
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: theme.bgElevated,
              border: `1px solid ${theme.primaryAccent}44`,
              borderRadius: theme.borderRadius,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: theme.textPrimary, marginBottom: '4px' }}>
                Interactive UI Component
              </div>
              <div style={{ fontSize: '0.85rem', color: theme.textSecondary }}>
                Reflecting real-time token changes on public website.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                style={{
                  padding: '8px 18px',
                  backgroundColor: theme.primaryAccent,
                  color: theme.bgPrimary,
                  border: 'none',
                  borderRadius: theme.borderRadius,
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                }}
              >
                Primary Trigger
              </button>
              <button
                type="button"
                style={{
                  padding: '8px 18px',
                  backgroundColor: 'transparent',
                  color: theme.secondaryAccent,
                  border: `1px solid ${theme.secondaryAccent}`,
                  borderRadius: theme.borderRadius,
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                }}
              >
                Secondary
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          {saveAlert && (
            <span className="mono" style={{ color: 'var(--accent-lime)', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={16} /> THEME SAVED TO CMS &amp; APPLIED TO SITE
            </span>
          )}
        </div>

        <button type="button" onClick={handleSaveTheme} className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
          <Check size={16} />
          <span>Save Active Theme</span>
        </button>
      </div>
    </div>
  );
};

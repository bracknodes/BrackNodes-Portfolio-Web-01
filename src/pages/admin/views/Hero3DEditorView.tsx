import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import type { Hero3DSettings, Hero3DGeometry } from '../../../types/cms';
import { HeroScene } from '../../../three/HeroScene';
import {
  Box,
  Sparkles,
  Palette,
  Sliders,
  Check,
  RotateCcw,
} from 'lucide-react';

interface PresetOption {
  name: string;
  desc: string;
  settings: Hero3DSettings;
}

const PRESETS: PresetOption[] = [
  {
    name: 'Cyber Crystal (Default)',
    desc: 'High-tech faceted icosahedron with dual neon orbit rings',
    settings: {
      geometry: 'icosahedron',
      wireframeOnly: false,
      wireframeOverlay: true,
      showRings: true,
      showParticles: true,
      particleCount: 220,
      rotationSpeed: 1.0,
      autoSpin: true,
      mouseReactivity: true,
      primaryColor: '#c7ff6b',
      secondaryColor: '#70b9ff',
      accentColor: '#c7ff6b',
      roughness: 0.22,
      metalness: 0.88,
      scale: 1.0,
    },
  },
  {
    name: 'Quantum Torus Knot',
    desc: 'Twisted cybernetic continuous knot with electric cyan rings',
    settings: {
      geometry: 'torus_knot',
      wireframeOnly: false,
      wireframeOverlay: true,
      showRings: true,
      showParticles: true,
      particleCount: 280,
      rotationSpeed: 1.2,
      autoSpin: true,
      mouseReactivity: true,
      primaryColor: '#00f2fe',
      secondaryColor: '#4facfe',
      accentColor: '#c7ff6b',
      roughness: 0.15,
      metalness: 0.95,
      scale: 1.0,
    },
  },
  {
    name: 'Neon Violet Portal',
    desc: 'Futuristic Torus portal with neon magenta and ultraviolet aura',
    settings: {
      geometry: 'torus',
      wireframeOnly: false,
      wireframeOverlay: true,
      showRings: true,
      showParticles: true,
      particleCount: 300,
      rotationSpeed: 1.1,
      autoSpin: true,
      mouseReactivity: true,
      primaryColor: '#c084fc',
      secondaryColor: '#f43f5e',
      accentColor: '#a855f7',
      roughness: 0.2,
      metalness: 0.9,
      scale: 1.05,
    },
  },
  {
    name: 'Sacred Dodecahedron',
    desc: 'Mathematical 12-sided golden geometry with starry constellation',
    settings: {
      geometry: 'dodecahedron',
      wireframeOnly: false,
      wireframeOverlay: true,
      showRings: true,
      showParticles: true,
      particleCount: 240,
      rotationSpeed: 0.9,
      autoSpin: true,
      mouseReactivity: true,
      primaryColor: '#fbbf24',
      secondaryColor: '#f59e0b',
      accentColor: '#60a5fa',
      roughness: 0.28,
      metalness: 0.82,
      scale: 1.0,
    },
  },
  {
    name: 'Stealth Wireframe Cube',
    desc: 'Monochrome cubic wireframe with pure technical aesthetics',
    settings: {
      geometry: 'box',
      wireframeOnly: true,
      wireframeOverlay: false,
      showRings: false,
      showParticles: true,
      particleCount: 160,
      rotationSpeed: 0.8,
      autoSpin: true,
      mouseReactivity: true,
      primaryColor: '#ffffff',
      secondaryColor: '#71717a',
      accentColor: '#a1a1aa',
      roughness: 0.1,
      metalness: 1.0,
      scale: 0.95,
    },
  },
  {
    name: 'Emerald Geo-Sphere',
    desc: 'Polygonal sphere radiating high-frequency emerald light',
    settings: {
      geometry: 'sphere',
      wireframeOnly: false,
      wireframeOverlay: true,
      showRings: true,
      showParticles: true,
      particleCount: 250,
      rotationSpeed: 1.0,
      autoSpin: true,
      mouseReactivity: true,
      primaryColor: '#10b981',
      secondaryColor: '#06b6d4',
      accentColor: '#34d399',
      roughness: 0.2,
      metalness: 0.85,
      scale: 1.0,
    },
  },
];

const GEOMETRY_OPTIONS: { id: Hero3DGeometry; label: string; desc: string }[] = [
  { id: 'icosahedron', label: 'Icosahedron', desc: 'Faceted 20-sided cyber crystal' },
  { id: 'torus_knot', label: 'Torus Knot', desc: 'Continuous mathematical knot' },
  { id: 'dodecahedron', label: 'Dodecahedron', desc: '12-sided sacred geometry' },
  { id: 'octahedron', label: 'Octahedron', desc: 'Diamond dual-pyramid prism' },
  { id: 'sphere', label: 'Neo-Sphere', desc: 'Tessellated polygonal geosphere' },
  { id: 'box', label: 'Hypercube', desc: 'Architectural monolithic cube' },
  { id: 'torus', label: 'Torus Ring', desc: 'Futuristic portal ring' },
];

export const Hero3DEditorView: React.FC = () => {
  const { siteSettings, updateSiteSettings } = useCMS();

  const defaultHero3D: Hero3DSettings = {
    geometry: 'icosahedron',
    wireframeOnly: false,
    wireframeOverlay: true,
    showRings: true,
    showParticles: true,
    particleCount: 220,
    rotationSpeed: 1.0,
    autoSpin: true,
    mouseReactivity: true,
    primaryColor: '#c7ff6b',
    secondaryColor: '#70b9ff',
    accentColor: '#c7ff6b',
    roughness: 0.22,
    metalness: 0.88,
    scale: 1.0,
  };

  const [settings, setSettings] = useState<Hero3DSettings>(
    siteSettings.hero3D ? { ...defaultHero3D, ...siteSettings.hero3D } : defaultHero3D
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleApplyPreset = (preset: PresetOption) => {
    setSettings(preset.settings);
  };

  const handleSave = async () => {
    await updateSiteSettings({
      hero3D: settings,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Reset 3D Hero Object settings back to studio defaults?')) {
      setSettings(defaultHero3D);
    }
  };

  return (
    <div style={{ maxWidth: '1360px', paddingBottom: '4rem' }}>
      {/* View Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginBottom: '2rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid #1C2438',
        }}
      >
        <div>
          <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-lime)', marginBottom: '6px' }}>
            STUDIO ENGINE // 3D PROCEDURAL SCENE
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#F7F7F2', margin: 0 }}>
            3D Object & Scene Studio
          </h2>
          <p style={{ color: '#8B97B0', fontSize: '0.9rem', marginTop: '6px', maxWidth: '640px' }}>
            Customize the 3D geometry shape, orbit rings, lighting specular colors, particle constellation, and rotation physics displayed in the Hero section.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-secondary"
            style={{ padding: '0.65rem 1.15rem', fontSize: '0.75rem' }}
          >
            <RotateCcw size={14} />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.4rem', fontSize: '0.75rem' }}
          >
            {saveSuccess ? <Check size={14} /> : <Sparkles size={14} />}
            <span>{saveSuccess ? 'Changes Saved!' : 'Save 3D Object'}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Split: Controls + Real-Time Live Preview */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '2rem',
          alignItems: 'start',
        }}
      >
        {/* ── Left Column: Controls & Configuration ───────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Quick Style Presets */}
          <div
            className="card-surface"
            style={{
              padding: '1.5rem',
              borderRadius: '4px',
              backgroundColor: '#11151F',
              border: '1px solid #1C2438',
              color: '#F7F7F2',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <Sparkles size={17} color="var(--accent-lime)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Curated Style Presets</h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#8B97B0', marginBottom: '1rem' }}>
              Apply complete shader, color, and geometry combinations with one click:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
              {PRESETS.map((p, idx) => {
                const isActive = settings.geometry === p.settings.geometry && settings.primaryColor === p.settings.primaryColor;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    style={{
                      padding: '10px 12px',
                      backgroundColor: isActive ? 'rgba(199,255,107,0.08)' : '#0C0F17',
                      border: `1px solid ${isActive ? 'var(--accent-lime)' : '#1C2438'}`,
                      borderRadius: '4px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.825rem', fontWeight: 700, color: isActive ? 'var(--accent-lime)' : '#F7F7F2' }}>
                        {p.name}
                      </span>
                      {isActive && <Check size={14} color="var(--accent-lime)" />}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: '#8B97B0', lineHeight: 1.3 }}>
                      {p.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Geometry Selector */}
          <div
            className="card-surface"
            style={{
              padding: '1.5rem',
              borderRadius: '4px',
              backgroundColor: '#11151F',
              border: '1px solid #1C2438',
              color: '#F7F7F2',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <Box size={17} color="var(--accent-blue)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Procedural Geometry Shape</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
              {GEOMETRY_OPTIONS.map((geom) => {
                const isSelected = settings.geometry === geom.id;
                return (
                  <button
                    key={geom.id}
                    type="button"
                    onClick={() => setSettings({ ...settings, geometry: geom.id })}
                    style={{
                      padding: '12px 10px',
                      backgroundColor: isSelected ? 'rgba(96,168,248,0.12)' : '#0C0F17',
                      border: `1px solid ${isSelected ? 'var(--accent-blue)' : '#1C2438'}`,
                      borderRadius: '4px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isSelected ? 'var(--accent-blue)' : '#F7F7F2' }}>
                      {geom.label}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: '#8B97B0' }}>
                      {geom.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color & Material Palette */}
          <div
            className="card-surface"
            style={{
              padding: '1.5rem',
              borderRadius: '4px',
              backgroundColor: '#11151F',
              border: '1px solid #1C2438',
              color: '#F7F7F2',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              <Palette size={17} color="var(--accent-lime)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Colors & Specular Lighting</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '1.5rem' }}>
              {/* Primary Color */}
              <div style={{ padding: '12px', backgroundColor: '#0C0F17', borderRadius: '4px', border: '1px solid #1C2438' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#8B97B0', marginBottom: '8px' }}>
                  PRIMARY ACCENT (Core & Glow)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="color"
                    value={settings.primaryColor || '#c7ff6b'}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    style={{ width: '38px', height: '38px', borderRadius: '4px', border: 'none', cursor: 'pointer', background: 'none' }}
                  />
                  <input
                    type="text"
                    value={settings.primaryColor || '#c7ff6b'}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="mono"
                    style={{
                      width: '90px',
                      padding: '6px 8px',
                      backgroundColor: '#11151F',
                      border: '1px solid #1C2438',
                      borderRadius: '3px',
                      color: '#F7F7F2',
                      fontSize: '0.75rem',
                    }}
                  />
                </div>
              </div>

              {/* Secondary Color */}
              <div style={{ padding: '12px', backgroundColor: '#0C0F17', borderRadius: '4px', border: '1px solid #1C2438' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#8B97B0', marginBottom: '8px' }}>
                  ORBIT RING 1 (Secondary)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="color"
                    value={settings.secondaryColor || '#70b9ff'}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    style={{ width: '38px', height: '38px', borderRadius: '4px', border: 'none', cursor: 'pointer', background: 'none' }}
                  />
                  <input
                    type="text"
                    value={settings.secondaryColor || '#70b9ff'}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    className="mono"
                    style={{
                      width: '90px',
                      padding: '6px 8px',
                      backgroundColor: '#11151F',
                      border: '1px solid #1C2438',
                      borderRadius: '3px',
                      color: '#F7F7F2',
                      fontSize: '0.75rem',
                    }}
                  />
                </div>
              </div>

              {/* Accent Color */}
              <div style={{ padding: '12px', backgroundColor: '#0C0F17', borderRadius: '4px', border: '1px solid #1C2438' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#8B97B0', marginBottom: '8px' }}>
                  ORBIT RING 2 & SATELLITES
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="color"
                    value={settings.accentColor || '#c7ff6b'}
                    onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                    style={{ width: '38px', height: '38px', borderRadius: '4px', border: 'none', cursor: 'pointer', background: 'none' }}
                  />
                  <input
                    type="text"
                    value={settings.accentColor || '#c7ff6b'}
                    onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                    className="mono"
                    style={{
                      width: '90px',
                      padding: '6px 8px',
                      backgroundColor: '#11151F',
                      border: '1px solid #1C2438',
                      borderRadius: '3px',
                      color: '#F7F7F2',
                      fontSize: '0.75rem',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Sliders for Scale, Metalness, Roughness */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.75rem' }}>
                  <span style={{ color: '#8B97B0', fontWeight: 600 }}>OBJECT SCALE</span>
                  <span className="mono" style={{ color: 'var(--accent-lime)' }}>{settings.scale?.toFixed(2) || '1.00'}x</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.5"
                  step="0.05"
                  value={settings.scale ?? 1.0}
                  onChange={(e) => setSettings({ ...settings, scale: parseFloat(e.target.value) })}
                  style={{ width: '100%', accentColor: 'var(--accent-lime)' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.75rem' }}>
                  <span style={{ color: '#8B97B0', fontWeight: 600 }}>SURFACE METALNESS</span>
                  <span className="mono" style={{ color: 'var(--accent-lime)' }}>{Math.round((settings.metalness ?? 0.88) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.metalness ?? 0.88}
                  onChange={(e) => setSettings({ ...settings, metalness: parseFloat(e.target.value) })}
                  style={{ width: '100%', accentColor: 'var(--accent-lime)' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.75rem' }}>
                  <span style={{ color: '#8B97B0', fontWeight: 600 }}>SURFACE ROUGHNESS</span>
                  <span className="mono" style={{ color: 'var(--accent-lime)' }}>{Math.round((settings.roughness ?? 0.22) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.roughness ?? 0.22}
                  onChange={(e) => setSettings({ ...settings, roughness: parseFloat(e.target.value) })}
                  style={{ width: '100%', accentColor: 'var(--accent-lime)' }}
                />
              </div>
            </div>
          </div>

          {/* Structure, Wireframe & Animation Toggles */}
          <div
            className="card-surface"
            style={{
              padding: '1.5rem',
              borderRadius: '4px',
              backgroundColor: '#11151F',
              border: '1px solid #1C2438',
              color: '#F7F7F2',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              <Sliders size={17} color="var(--accent-blue)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Structure & Animation Physics</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Wireframe Only Mode</div>
                  <div style={{ fontSize: '0.75rem', color: '#8B97B0' }}>Hides solid core and renders purely architectural wireframe lattice</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.wireframeOnly ?? false}
                  onChange={(e) => setSettings({ ...settings, wireframeOnly: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-lime)', cursor: 'pointer' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Wireframe Cage Overlay</div>
                  <div style={{ fontSize: '0.75rem', color: '#8B97B0' }}>Overlays glowing wireframe outer shell on top of solid core</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.wireframeOverlay ?? true}
                  disabled={settings.wireframeOnly}
                  onChange={(e) => setSettings({ ...settings, wireframeOverlay: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-lime)', cursor: 'pointer' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Counter-Angled Orbit Rings</div>
                  <div style={{ fontSize: '0.75rem', color: '#8B97B0' }}>Renders two multi-axis spinning rings with orbiting satellite nodes</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showRings ?? true}
                  onChange={(e) => setSettings({ ...settings, showRings: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-lime)', cursor: 'pointer' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Floating Constellation Particles</div>
                  <div style={{ fontSize: '0.75rem', color: '#8B97B0' }}>Scatters dynamic ambient glowing particle points in 3D depth field</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showParticles ?? true}
                  onChange={(e) => setSettings({ ...settings, showParticles: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-lime)', cursor: 'pointer' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Auto-Spin Rotation</div>
                  <div style={{ fontSize: '0.75rem', color: '#8B97B0' }}>Continuous multi-axis rotation of core mesh, rings and particles</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoSpin ?? true}
                  onChange={(e) => setSettings({ ...settings, autoSpin: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-lime)', cursor: 'pointer' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Mouse Parallax Reactivity</div>
                  <div style={{ fontSize: '0.75rem', color: '#8B97B0' }}>Tilts and tracks mouse movement with smooth kinetic interpolation</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.mouseReactivity ?? true}
                  onChange={(e) => setSettings({ ...settings, mouseReactivity: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-lime)', cursor: 'pointer' }}
                />
              </label>
            </div>

            {/* Sliders for Rotation Speed & Particle Count */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.75rem' }}>
                  <span style={{ color: '#8B97B0', fontWeight: 600 }}>ROTATION VELOCITY</span>
                  <span className="mono" style={{ color: 'var(--accent-lime)' }}>{settings.rotationSpeed?.toFixed(1) || '1.0'}x</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.1"
                  value={settings.rotationSpeed ?? 1.0}
                  onChange={(e) => setSettings({ ...settings, rotationSpeed: parseFloat(e.target.value) })}
                  style={{ width: '100%', accentColor: 'var(--accent-lime)' }}
                />
              </div>

              {settings.showParticles !== false && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.75rem' }}>
                    <span style={{ color: '#8B97B0', fontWeight: 600 }}>PARTICLE DENSITY</span>
                    <span className="mono" style={{ color: 'var(--accent-lime)' }}>{settings.particleCount ?? 220} nodes</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="10"
                    value={settings.particleCount ?? 220}
                    onChange={(e) => setSettings({ ...settings, particleCount: parseInt(e.target.value, 10) })}
                    style={{ width: '100%', accentColor: 'var(--accent-lime)' }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Right Column: Sticky Real-Time Live 3D Preview ──────────── */}
        <div style={{ position: 'sticky', top: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div
            className="card-surface"
            style={{
              padding: '1.25rem',
              borderRadius: '6px',
              backgroundColor: '#11151F',
              border: '1px solid #1C2438',
              color: '#F7F7F2',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-lime)', animation: 'pulse 2s infinite' }} />
                <span className="mono" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-lime)' }}>
                  LIVE REAL-TIME SANDBOX
                </span>
              </div>
              <span className="mono" style={{ fontSize: '0.7rem', color: '#8B97B0', textTransform: 'uppercase' }}>
                {settings.geometry}
              </span>
            </div>

            {/* Live 3D Canvas Box */}
            <div
              style={{
                width: '100%',
                height: '440px',
                backgroundColor: '#07090D',
                borderRadius: '4px',
                border: '1px solid #1C2438',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <HeroScene overrideSettings={settings} />
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div className="mono" style={{ fontSize: '0.725rem', color: '#8B97B0' }}>
                Move mouse over 3D model to test specular lighting & physics
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span className="mono" style={{ fontSize: '0.65rem', padding: '2px 6px', backgroundColor: '#1C2438', borderRadius: '2px', color: '#8B97B0' }}>
                  THREE.JS v0.160+
                </span>
                <span className="mono" style={{ fontSize: '0.65rem', padding: '2px 6px', backgroundColor: '#1C2438', borderRadius: '2px', color: 'var(--accent-lime)' }}>
                  WEBGL HW ACCEL
                </span>
              </div>
            </div>
          </div>

          {/* Quick Info Box */}
          <div
            style={{
              padding: '1rem 1.25rem',
              backgroundColor: '#0C0F17',
              borderRadius: '4px',
              border: '1px solid #1C2438',
            }}
          >
            <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#F7F7F2', marginBottom: '4px' }}>
              💡 Zero Impact on Page Speed
            </div>
            <p style={{ fontSize: '0.775rem', color: '#8B97B0', margin: 0, lineHeight: 1.5 }}>
              All 3D procedural shapes are mathematically generated directly in the browser using WebGL shaders. No heavy external 3D files (.gltf/.obj) need to be downloaded by your visitors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

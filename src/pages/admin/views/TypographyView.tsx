import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import type { FontItem, SectionFonts, TypographySettings } from '../../../types/cms';
import {
  Type,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  Eye,
  Sliders,
  ExternalLink,
} from 'lucide-react';

export const TypographyView: React.FC = () => {
  const { siteSettings, updateSiteSettings, applyTypography } = useCMS();

  // Initialize with current settings or fallback
  const currentTypography: TypographySettings = siteSettings.typography || {
    customFonts: [
      { id: 'font-plus-jakarta', name: 'Plus Jakarta Sans', family: "'Plus Jakarta Sans', sans-serif", category: 'sans-serif', source: 'google' },
      { id: 'font-jetbrains', name: 'JetBrains Mono', family: "'JetBrains Mono', monospace", category: 'monospace', source: 'google' },
      { id: 'font-inter', name: 'Inter', family: "'Inter', sans-serif", category: 'sans-serif', source: 'google' },
      { id: 'font-space-grotesk', name: 'Space Grotesk', family: "'Space Grotesk', sans-serif", category: 'sans-serif', source: 'google' },
      { id: 'font-outfit', name: 'Outfit', family: "'Outfit', sans-serif", category: 'sans-serif', source: 'google' },
      { id: 'font-playfair', name: 'Playfair Display', family: "'Playfair Display', serif", category: 'serif', source: 'google' },
      { id: 'font-cinzel', name: 'Cinzel', family: "'Cinzel', serif", category: 'serif', source: 'google' },
      { id: 'font-bebas-neue', name: 'Bebas Neue', family: "'Bebas Neue', display", category: 'display', source: 'google' },
      { id: 'font-fira-code', name: 'Fira Code', family: "'Fira Code', monospace", category: 'monospace', source: 'google' },
      { id: 'font-sora', name: 'Sora', family: "'Sora', sans-serif", category: 'sans-serif', source: 'google' },
      { id: 'font-montserrat', name: 'Montserrat', family: "'Montserrat', sans-serif", category: 'sans-serif', source: 'google' },
    ],
    sectionFonts: {
      globalBody: "'Plus Jakarta Sans', sans-serif",
      globalHeading: "'Plus Jakarta Sans', sans-serif",
      globalMono: "'JetBrains Mono', monospace",
      navbar: "'JetBrains Mono', monospace",
      hero: "'Plus Jakarta Sans', sans-serif",
      heroTitle: "'Plus Jakarta Sans', sans-serif",
      projects: "'Plus Jakarta Sans', sans-serif",
      about: "'Plus Jakarta Sans', sans-serif",
      services: "'Plus Jakarta Sans', sans-serif",
      skills: "'Plus Jakarta Sans', sans-serif",
      process: "'Plus Jakarta Sans', sans-serif",
      testimonials: "'Plus Jakarta Sans', sans-serif",
      contact: "'Plus Jakarta Sans', sans-serif",
      footer: "'JetBrains Mono', monospace",
    },
  };

  const [typography, setTypography] = useState<TypographySettings>(currentTypography);
  const [saveAlert, setSaveAlert] = useState(false);
  const [activeTab, setActiveTab] = useState<'sections' | 'library'>('sections');

  // Form state for adding custom Google font
  const [newFontName, setNewFontName] = useState('');
  const [newFontCategory, setNewFontCategory] = useState<FontItem['category']>('sans-serif');
  const [newFontFamily, setNewFontFamily] = useState('');

  // Popular Google Fonts quick presets
  const popularPresets = [
    { name: 'Poppins', category: 'sans-serif' as const, family: "'Poppins', sans-serif" },
    { name: 'DM Sans', category: 'sans-serif' as const, family: "'DM Sans', sans-serif" },
    { name: 'Cabinet Grotesk', category: 'display' as const, family: "'Cabinet Grotesk', sans-serif" },
    { name: 'Clash Display', category: 'display' as const, family: "'Clash Display', sans-serif" },
    { name: 'Manrope', category: 'sans-serif' as const, family: "'Manrope', sans-serif" },
    { name: 'Lora', category: 'serif' as const, family: "'Lora', serif" },
    { name: 'Cormorant Garamond', category: 'serif' as const, family: "'Cormorant Garamond', serif" },
    { name: 'Space Mono', category: 'monospace' as const, family: "'Space Mono', monospace" },
    { name: 'Ubuntu Mono', category: 'monospace' as const, family: "'Ubuntu Mono', monospace" },
    { name: 'Caveat', category: 'handwriting' as const, family: "'Caveat', cursive" },
  ];

  // Helper to handle font name input and auto-generate font family
  const handleFontNameChange = (name: string) => {
    setNewFontName(name);
    if (!newFontFamily || newFontFamily === `'${newFontName}', ${newFontCategory}`) {
      const fallback =
        newFontCategory === 'monospace'
          ? 'monospace'
          : newFontCategory === 'serif'
          ? 'serif'
          : newFontCategory === 'handwriting'
          ? 'cursive'
          : 'sans-serif';
      setNewFontFamily(`'${name}', ${fallback}`);
    }
  };

  // Add a font to library
  const handleAddFont = (fontName: string, category: FontItem['category'], familyString?: string) => {
    const trimmed = fontName.trim();
    if (!trimmed) return;

    // Check if already exists
    if (typography.customFonts.some((f) => f.name.toLowerCase() === trimmed.toLowerCase())) {
      alert(`The font "${trimmed}" is already in your typography library.`);
      return;
    }

    const fallback =
      category === 'monospace'
        ? 'monospace'
        : category === 'serif'
        ? 'serif'
        : category === 'handwriting'
        ? 'cursive'
        : 'sans-serif';

    const finalFamily = familyString || `'${trimmed}', ${fallback}`;
    const newFont: FontItem = {
      id: `font-${trimmed.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`,
      name: trimmed,
      family: finalFamily,
      category,
      source: 'google',
    };

    const updated: TypographySettings = {
      ...typography,
      customFonts: [...typography.customFonts, newFont],
    };

    setTypography(updated);
    applyTypography(updated);

    // Reset inputs
    setNewFontName('');
    setNewFontFamily('');
  };

  // Remove a custom font
  const handleRemoveFont = (fontId: string) => {
    const target = typography.customFonts.find((f) => f.id === fontId);
    if (!target) return;

    if (confirm(`Remove "${target.name}" from your font library?`)) {
      const updated: TypographySettings = {
        ...typography,
        customFonts: typography.customFonts.filter((f) => f.id !== fontId),
      };
      setTypography(updated);
      applyTypography(updated);
    }
  };

  // Change font for a specific section
  const handleSectionFontChange = (sectionKey: keyof SectionFonts, fontFamily: string) => {
    const updated: TypographySettings = {
      ...typography,
      sectionFonts: {
        ...typography.sectionFonts,
        [sectionKey]: fontFamily,
      },
    };
    setTypography(updated);
    applyTypography(updated);
  };

  // Save changes to site settings
  const handleSave = async () => {
    await updateSiteSettings({ typography });
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 2500);
  };

  // Reset to default typography
  const handleResetDefaults = () => {
    if (confirm('Reset all section fonts and font library back to the original studio defaults?')) {
      const defaults: TypographySettings = {
        customFonts: [
          { id: 'font-plus-jakarta', name: 'Plus Jakarta Sans', family: "'Plus Jakarta Sans', sans-serif", category: 'sans-serif', source: 'google' },
          { id: 'font-jetbrains', name: 'JetBrains Mono', family: "'JetBrains Mono', monospace", category: 'monospace', source: 'google' },
          { id: 'font-inter', name: 'Inter', family: "'Inter', sans-serif", category: 'sans-serif', source: 'google' },
          { id: 'font-space-grotesk', name: 'Space Grotesk', family: "'Space Grotesk', sans-serif", category: 'sans-serif', source: 'google' },
          { id: 'font-outfit', name: 'Outfit', family: "'Outfit', sans-serif", category: 'sans-serif', source: 'google' },
          { id: 'font-playfair', name: 'Playfair Display', family: "'Playfair Display', serif", category: 'serif', source: 'google' },
          { id: 'font-cinzel', name: 'Cinzel', family: "'Cinzel', serif", category: 'serif', source: 'google' },
          { id: 'font-bebas-neue', name: 'Bebas Neue', family: "'Bebas Neue', display", category: 'display', source: 'google' },
          { id: 'font-fira-code', name: 'Fira Code', family: "'Fira Code', monospace", category: 'monospace', source: 'google' },
          { id: 'font-sora', name: 'Sora', family: "'Sora', sans-serif", category: 'sans-serif', source: 'google' },
          { id: 'font-montserrat', name: 'Montserrat', family: "'Montserrat', sans-serif", category: 'sans-serif', source: 'google' },
        ],
        sectionFonts: {
          globalBody: "'Plus Jakarta Sans', sans-serif",
          globalHeading: "'Plus Jakarta Sans', sans-serif",
          globalMono: "'JetBrains Mono', monospace",
          navbar: "'JetBrains Mono', monospace",
          hero: "'Plus Jakarta Sans', sans-serif",
          heroTitle: "'Plus Jakarta Sans', sans-serif",
          projects: "'Plus Jakarta Sans', sans-serif",
          about: "'Plus Jakarta Sans', sans-serif",
          services: "'Plus Jakarta Sans', sans-serif",
          skills: "'Plus Jakarta Sans', sans-serif",
          process: "'Plus Jakarta Sans', sans-serif",
          testimonials: "'Plus Jakarta Sans', sans-serif",
          contact: "'Plus Jakarta Sans', sans-serif",
          footer: "'JetBrains Mono', monospace",
        },
      };
      setTypography(defaults);
      applyTypography(defaults);
      updateSiteSettings({ typography: defaults });
    }
  };

  // Section configuration definitions
  const sectionGroups: {
    groupTitle: string;
    description: string;
    sections: {
      key: keyof SectionFonts;
      label: string;
      desc: string;
      defaultType: 'heading' | 'body' | 'mono';
    }[];
  }[] = [
    {
      groupTitle: 'Global Typography Defaults',
      description: 'Foundational font stacks used across the entire website unless overridden by a section.',
      sections: [
        { key: 'globalBody', label: 'Global Body Text', desc: 'Main paragraphs, descriptions, and general readability text', defaultType: 'body' },
        { key: 'globalHeading', label: 'Global Headlines & Titles', desc: 'Major headings (H1, H2, H3) and section display titles', defaultType: 'heading' },
        { key: 'globalMono', label: 'Global Monospace & Data', desc: 'Badges, metrics, tags, code snippets, and telemetry labels', defaultType: 'mono' },
      ],
    },
    {
      groupTitle: 'Header & Hero Section',
      description: 'The first impression when visitors land on your website.',
      sections: [
        { key: 'navbar', label: 'Navigation Bar', desc: 'Top brand wordmark, menu links, status pill, and action button', defaultType: 'mono' },
        { key: 'heroTitle', label: 'Hero Display Title (Headline)', desc: 'Large creative developer name and main animated title', defaultType: 'heading' },
        { key: 'hero', label: 'Hero Subtext & Intro', desc: 'Introductory bio, value proposition, and telemetry counters', defaultType: 'body' },
      ],
    },
    {
      groupTitle: 'Core Portfolio & Showcase Sections',
      description: 'Tailor each content section with its own distinct typographic personality.',
      sections: [
        { key: 'projects', label: 'Projects & Work', desc: 'Featured project cards, case study text, and technical tags', defaultType: 'body' },
        { key: 'about', label: 'About & Biography', desc: 'Personal story, engineering philosophy, and experience highlights', defaultType: 'body' },
        { key: 'services', label: 'Services & Scope', desc: 'Service offerings, pricing cards, and deliverable bullet points', defaultType: 'body' },
        { key: 'skills', label: 'Skills & Stack Matrix', desc: 'Technology categories, proficiency badges, and tool tags', defaultType: 'body' },
        { key: 'process', label: 'Workflow & Process', desc: 'Roadmap steps, phase breakdowns, and deliverable cards', defaultType: 'body' },
        { key: 'testimonials', label: 'Client Testimonials', desc: 'Client quotes, author titles, and verification badges', defaultType: 'body' },
      ],
    },
    {
      groupTitle: 'Inquiry & Footer Sections',
      description: 'Conversion contact forms and closing page footer.',
      sections: [
        { key: 'contact', label: 'Contact & Inquire Form', desc: 'Lead capture form inputs, option chips, and submit button', defaultType: 'body' },
        { key: 'footer', label: 'Page Footer', desc: 'Bottom copyright, status stamps, and social links', defaultType: 'mono' },
      ],
    },
  ];

  return (
    <div style={{ maxWidth: '1050px', paddingBottom: '3rem' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Type size={22} style={{ color: 'var(--accent-lime)' }} />
            <h2 style={{ fontSize: '1.6rem', margin: 0 }}>Typography &amp; Font Studio</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0, maxWidth: '650px' }}>
            Add any Google Font or web font to your library and assign custom typography to every section of your portfolio independently.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={handleResetDefaults}
            style={{
              padding: '0.55rem 1rem',
              backgroundColor: 'transparent',
              border: '1px solid #1c2438',
              borderRadius: '4px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
            }}
          >
            <RotateCcw size={14} />
            Reset Defaults
          </button>

          <button
            onClick={handleSave}
            style={{
              padding: '0.55rem 1.25rem',
              backgroundColor: saveAlert ? '#22c55e' : 'var(--accent-lime)',
              color: '#090B10',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background-color 0.2s ease',
            }}
          >
            {saveAlert ? <Check size={16} /> : <Sparkles size={16} />}
            {saveAlert ? 'Typography Saved!' : 'Save Font Settings'}
          </button>
        </div>
      </div>

      {/* Tabs: Section Chooser vs Font Library */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid #1c2438',
          marginBottom: '2rem',
        }}
      >
        <button
          onClick={() => setActiveTab('sections')}
          style={{
            padding: '0.75rem 1.25rem',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'sections' ? '2px solid var(--accent-lime)' : '2px solid transparent',
            color: activeTab === 'sections' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'sections' ? 600 : 400,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
          }}
        >
          <Sliders size={16} style={{ color: activeTab === 'sections' ? 'var(--accent-lime)' : 'inherit' }} />
          Choose Font in Every Section
        </button>

        <button
          onClick={() => setActiveTab('library')}
          style={{
            padding: '0.75rem 1.25rem',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'library' ? '2px solid var(--accent-lime)' : '2px solid transparent',
            color: activeTab === 'library' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'library' ? 600 : 400,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
          }}
        >
          <Layers size={16} style={{ color: activeTab === 'library' ? 'var(--accent-lime)' : 'inherit' }} />
          Font Library &amp; Add Fonts ({typography.customFonts.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SECTION-BY-SECTION FONT PICKER */}
      {/* ========================================================================= */}
      {activeTab === 'sections' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {sectionGroups.map((group, gIdx) => (
            <div
              key={gIdx}
              style={{
                backgroundColor: '#0c0f17',
                border: '1px solid #1c2438',
                borderRadius: '8px',
                padding: '1.5rem',
              }}
            >
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
                  {group.groupTitle}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>
                  {group.description}
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {group.sections.map((sec) => {
                  const currentFontFamily = typography.sectionFonts[sec.key] || '';
                  const selectedFontItem = typography.customFonts.find(
                    (f) => f.family.toLowerCase() === currentFontFamily.toLowerCase()
                  );

                  return (
                    <div
                      key={sec.key}
                      style={{
                        backgroundColor: '#11151f',
                        border: '1px solid #1f273d',
                        borderRadius: '6px',
                        padding: '1.2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        {/* Title & Badge */}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '6px',
                          }}
                        >
                          <label
                            style={{
                              fontWeight: 600,
                              fontSize: '0.9rem',
                              color: 'var(--text-primary)',
                            }}
                          >
                            {sec.label}
                          </label>
                          <span
                            className="mono"
                            style={{
                              fontSize: '0.65rem',
                              padding: '2px 6px',
                              borderRadius: '3px',
                              backgroundColor: '#1a2236',
                              color: 'var(--accent-blue)',
                              border: '1px solid #23304d',
                            }}
                          >
                            {selectedFontItem ? selectedFontItem.name : 'Custom'}
                          </span>
                        </div>

                        <p
                          style={{
                            color: 'var(--text-muted)',
                            fontSize: '0.75rem',
                            marginBottom: '10px',
                            minHeight: '28px',
                          }}
                        >
                          {sec.desc}
                        </p>

                        {/* Font Selection Dropdown */}
                        <div style={{ position: 'relative', marginBottom: '12px' }}>
                          <select
                            value={currentFontFamily}
                            onChange={(e) => handleSectionFontChange(sec.key, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.6rem 0.8rem',
                              backgroundColor: '#090B10',
                              border: '1px solid #232d44',
                              borderRadius: '4px',
                              color: 'var(--text-primary)',
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                              outline: 'none',
                              fontFamily: currentFontFamily,
                            }}
                          >
                            {typography.customFonts.map((font) => (
                              <option
                                key={font.id}
                                value={font.family}
                                style={{ fontFamily: font.family, backgroundColor: '#0c0f17', color: '#F7F7F2' }}
                              >
                                {font.name} ({font.category})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Live Specimen Preview Box */}
                      <div
                        style={{
                          backgroundColor: '#07090e',
                          border: '1px solid #161c2a',
                          borderRadius: '4px',
                          padding: '0.75rem',
                          fontFamily: currentFontFamily,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.65rem',
                            color: 'var(--text-muted)',
                            fontFamily: 'monospace',
                            marginBottom: '4px',
                          }}
                        >
                          LIVE SPECIMEN:
                        </div>
                        <div
                          style={{
                            fontSize: '0.95rem',
                            color: '#F7F7F2',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                          }}
                        >
                          The quick brown fox jumps over 123
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Interactive Live Combined Preview */}
          <div
            style={{
              backgroundColor: '#0c0f17',
              border: '1px solid #1c2438',
              borderRadius: '8px',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <Eye size={18} style={{ color: 'var(--accent-lime)' }} />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Full Portfolio Harmony Preview</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
              See how your chosen section fonts interact together in real-time.
            </p>

            <div
              style={{
                backgroundColor: '#090B10',
                border: '1px solid #1c2438',
                borderRadius: '6px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              }}
            >
              {/* Navbar specimen */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #192033',
                  fontFamily: typography.sectionFonts.navbar,
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-lime)' }}>
                  BRACKNODES.IN
                </span>
                <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span>Plans</span>
                  <span>About</span>
                  <span>Services</span>
                  <span>Contact</span>
                </div>
              </div>

              {/* Hero Title specimen */}
              <div>
                <span
                  style={{
                    fontFamily: typography.sectionFonts.globalMono,
                    fontSize: '0.75rem',
                    color: 'var(--accent-blue)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  // HERO HEADLINE &amp; SUBTITLE
                </span>
                <h1
                  style={{
                    fontFamily: typography.sectionFonts.heroTitle,
                    fontSize: '2.4rem',
                    margin: '8px 0',
                    lineHeight: 1.15,
                    color: '#F7F7F2',
                  }}
                >
                  Next-Gen Cloud &amp; Discord Bot Hosting
                </h1>
                <p
                  style={{
                    fontFamily: typography.sectionFonts.hero,
                    fontSize: '1rem',
                    color: 'var(--text-secondary)',
                    maxWidth: '650px',
                    margin: 0,
                  }}
                >
                  High-speed NVMe cPanel Web Hosting, 24/7 Discord Bot Hosting, and low-latency cloud infrastructure starting at ₹29/month.
                </p>
              </div>

              {/* Projects & Testimonial specimen */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1rem',
                  paddingTop: '0.5rem',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#11151f',
                    border: '1px solid #1f273d',
                    padding: '1rem',
                    borderRadius: '4px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: typography.sectionFonts.globalMono,
                      fontSize: '0.7rem',
                      color: 'var(--accent-lime)',
                    }}
                  >
                    PROJECTS FONT PREVIEW
                  </span>
                  <h4
                    style={{
                      fontFamily: typography.sectionFonts.projects,
                      fontSize: '1.1rem',
                      margin: '6px 0',
                      color: '#F7F7F2',
                    }}
                  >
                    Spatial Canvas 3D Engine
                  </h4>
                  <p
                    style={{
                      fontFamily: typography.sectionFonts.projects,
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      margin: 0,
                    }}
                  >
                    Procedural shaders, real-time particle simulation, and WebGL rendering optimization.
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: '#11151f',
                    border: '1px solid #1f273d',
                    padding: '1rem',
                    borderRadius: '4px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: typography.sectionFonts.globalMono,
                      fontSize: '0.7rem',
                      color: 'var(--accent-blue)',
                    }}
                  >
                    TESTIMONIALS FONT PREVIEW
                  </span>
                  <p
                    style={{
                      fontFamily: typography.sectionFonts.testimonials,
                      fontSize: '0.9rem',
                      fontStyle: 'italic',
                      color: '#F7F7F2',
                      margin: '6px 0',
                    }}
                  >
                    &ldquo;BrackNodes has kept our 10,000+ member Discord bot online 24/7 without a single crash.&rdquo;
                  </p>
                  <span
                    style={{
                      fontFamily: typography.sectionFonts.testimonials,
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    — Rohan Verma, Lead Developer
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FONT LIBRARY & ADD CUSTOM GOOGLE FONTS */}
      {/* ========================================================================= */}
      {activeTab === 'library' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Add Font Box */}
          <div
            style={{
              backgroundColor: '#0c0f17',
              border: '1px solid #1c2438',
              borderRadius: '8px',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Plus size={20} style={{ color: 'var(--accent-lime)' }} />
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Add Custom Web / Google Font</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 1.5rem 0' }}>
              Type any font name from <a href="https://fonts.google.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}>Google Fonts <ExternalLink size={12} style={{ display: 'inline' }} /></a>. The system will dynamically load the stylesheet and make it available in every section picker.
            </p>

            {/* Quick 1-Click Popular Google Fonts */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                QUICK-ADD POPULAR GOOGLE FONTS:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {popularPresets.map((preset) => {
                  const alreadyAdded = typography.customFonts.some(
                    (f) => f.name.toLowerCase() === preset.name.toLowerCase()
                  );
                  return (
                    <button
                      key={preset.name}
                      onClick={() => !alreadyAdded && handleAddFont(preset.name, preset.category, preset.family)}
                      disabled={alreadyAdded}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: alreadyAdded ? '#11151f' : '#141b29',
                        border: `1px solid ${alreadyAdded ? '#1f273d' : '#273859'}`,
                        borderRadius: '4px',
                        color: alreadyAdded ? 'var(--text-muted)' : 'var(--text-primary)',
                        fontSize: '0.78rem',
                        cursor: alreadyAdded ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontFamily: preset.family,
                      }}
                    >
                      {alreadyAdded ? <Check size={12} style={{ color: 'var(--accent-lime)' }} /> : <Plus size={12} />}
                      {preset.name} ({preset.category})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Input Form */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
                alignItems: 'flex-end',
                backgroundColor: '#11151f',
                padding: '1.25rem',
                borderRadius: '6px',
                border: '1px solid #1f273d',
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Font Name (Exact Google Font Name)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Poppins, Cabin, Oswald, Orbitron"
                  value={newFontName}
                  onChange={(e) => handleFontNameChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    backgroundColor: '#090B10',
                    border: '1px solid #232d44',
                    borderRadius: '4px',
                    color: '#F7F7F2',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Category
                </label>
                <select
                  value={newFontCategory}
                  onChange={(e) => {
                    const cat = e.target.value as FontItem['category'];
                    setNewFontCategory(cat);
                    const fallback =
                      cat === 'monospace' ? 'monospace' : cat === 'serif' ? 'serif' : cat === 'handwriting' ? 'cursive' : 'sans-serif';
                    if (newFontName) {
                      setNewFontFamily(`'${newFontName}', ${fallback}`);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    backgroundColor: '#090B10',
                    border: '1px solid #232d44',
                    borderRadius: '4px',
                    color: '#F7F7F2',
                    fontSize: '0.85rem',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="sans-serif">Sans-Serif (Modern, Clean)</option>
                  <option value="serif">Serif (Editorial, Classic)</option>
                  <option value="display">Display (Bold, Expressive Headlines)</option>
                  <option value="monospace">Monospace (Code, Terminal, Cyber)</option>
                  <option value="handwriting">Handwriting (Artistic, Signature)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  CSS Font-Family String
                </label>
                <input
                  type="text"
                  placeholder="'Poppins', sans-serif"
                  value={newFontFamily}
                  onChange={(e) => setNewFontFamily(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    backgroundColor: '#090B10',
                    border: '1px solid #232d44',
                    borderRadius: '4px',
                    color: '#F7F7F2',
                    fontSize: '0.85rem',
                    outline: 'none',
                    fontFamily: 'monospace',
                  }}
                />
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => handleAddFont(newFontName, newFontCategory, newFontFamily)}
                  disabled={!newFontName.trim()}
                  style={{
                    width: '100%',
                    padding: '0.6rem 1.25rem',
                    backgroundColor: newFontName.trim() ? 'var(--accent-lime)' : '#1a2236',
                    color: newFontName.trim() ? '#090B10' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: newFontName.trim() ? 'pointer' : 'not-allowed',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Plus size={16} />
                  Add to Library
                </button>
              </div>
            </div>
          </div>

          {/* Active Fonts Grid */}
          <div
            style={{
              backgroundColor: '#0c0f17',
              border: '1px solid #1c2438',
              borderRadius: '8px',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', margin: '0 0 4px 0' }}>Active Font Library</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>
                  {typography.customFonts.length} fonts currently loaded and available for sections.
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1rem',
              }}
            >
              {typography.customFonts.map((font) => {
                // Check if font is actively used by any section
                const usedInSections = Object.entries(typography.sectionFonts)
                  .filter(([_, fam]) => fam.toLowerCase() === font.family.toLowerCase())
                  .map(([sec]) => sec);

                return (
                  <div
                    key={font.id}
                    style={{
                      backgroundColor: '#11151f',
                      border: '1px solid #1f273d',
                      borderRadius: '6px',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '8px',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#F7F7F2' }}>
                            {font.name}
                          </div>
                          <div
                            className="mono"
                            style={{
                              fontSize: '0.7rem',
                              color: 'var(--text-muted)',
                              marginTop: '2px',
                            }}
                          >
                            {font.family}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            className="mono"
                            style={{
                              fontSize: '0.65rem',
                              padding: '2px 6px',
                              borderRadius: '3px',
                              backgroundColor: '#1a2236',
                              color: 'var(--accent-blue)',
                              textTransform: 'uppercase',
                            }}
                          >
                            {font.category}
                          </span>

                          <button
                            onClick={() => handleRemoveFont(font.id)}
                            title="Remove font from library"
                            style={{
                              padding: '4px',
                              backgroundColor: 'transparent',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              opacity: 0.7,
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Rendered Specimen */}
                      <div
                        style={{
                          margin: '12px 0',
                          padding: '1rem',
                          backgroundColor: '#07090e',
                          borderRadius: '4px',
                          border: '1px solid #161c2a',
                          fontFamily: font.family,
                        }}
                      >
                        <div style={{ fontSize: '1.2rem', color: '#F7F7F2', marginBottom: '4px' }}>
                          Aa Bb Gg 123
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          The quick brown fox jumps over the lazy dog.
                        </div>
                      </div>
                    </div>

                    {/* Section usage tags */}
                    <div style={{ marginTop: '8px' }}>
                      <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        USED IN:
                      </div>
                      {usedInSections.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {usedInSections.map((sec) => (
                            <span
                              key={sec}
                              className="mono"
                              style={{
                                fontSize: '0.65rem',
                                padding: '1px 5px',
                                borderRadius: '2px',
                                backgroundColor: 'rgba(199, 255, 107, 0.1)',
                                color: 'var(--accent-lime)',
                                border: '1px solid rgba(199, 255, 107, 0.25)',
                              }}
                            >
                              {sec}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Available (not assigned to any section)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

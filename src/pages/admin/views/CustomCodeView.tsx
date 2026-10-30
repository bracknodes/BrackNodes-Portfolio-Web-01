import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import type { CustomCodeSettings } from '../../../types/cms';
import {
  Code2,
  FileCode,
  Sparkles,
  Check,
  RotateCcw,
  ShieldCheck,
  Copy,
  Terminal,
  Zap,
  Power,
} from 'lucide-react';

export const CustomCodeView: React.FC = () => {
  const { siteSettings, updateSiteSettings, applyCustomCode } = useCMS();

  const currentCode: CustomCodeSettings = siteSettings.customCode || {
    isEnabled: true,
    customCss: '',
    headJs: '',
    bodyJs: '',
  };

  const [codeSettings, setCodeSettings] = useState<CustomCodeSettings>(currentCode);
  const [activeTab, setActiveTab] = useState<'css' | 'head-js' | 'body-js'>('css');
  const [saveAlert, setSaveAlert] = useState(false);
  const [copyNotice, setCopyNotice] = useState<string | null>(null);

  // Ready-to-use CSS Snippet Library
  const cssSnippets = [
    {
      title: 'Neon Card Glow on Hover',
      description: 'Adds an ethereal cybernetic glow to interactive cards.',
      code: `/* Neon Card Glow */
.card-surface:hover {
  box-shadow: 0 0 30px rgba(199, 255, 107, 0.18), 0 0 10px rgba(112, 185, 255, 0.12);
  border-color: rgba(199, 255, 107, 0.4) !important;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}`,
    },
    {
      title: 'Cyber Custom Scrollbar',
      description: 'Styles browser scrollbars with custom lime accents.',
      code: `/* Cyber Custom Scrollbar */
::-webkit-scrollbar {
  width: 7px;
}
::-webkit-scrollbar-track {
  background: #090B10;
}
::-webkit-scrollbar-thumb {
  background: #1c2438;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #C7FF6B;
}`,
    },
    {
      title: 'Custom Brand Text Highlight',
      description: 'Changes highlight background when visitors select text.',
      code: `/* Custom Brand Text Selection */
::selection {
  background: rgba(184, 240, 74, 0.35);
  color: #ffffff;
}
[data-theme="light"] ::selection {
  background: #d4f88e;
  color: #090b10;
}`,
    },
    {
      title: 'Glassmorphism Blur Overrides',
      description: 'Intensifies frosted glass blur on navbar and floating elements.',
      code: `/* High-Intensity Glassmorphism */
header, .glass-panel {
  backdrop-filter: blur(20px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
  background: rgba(9, 11, 16, 0.75) !important;
}`,
    },
    {
      title: 'Underline Accent Animation',
      description: 'Adds animated glowing underline to headings.',
      code: `/* Animated Glowing Accent */
.section-title {
  position: relative;
  display: inline-block;
}
.section-title::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 40px;
  height: 2px;
  background: var(--accent-lime);
  box-shadow: 0 0 12px var(--accent-lime);
}`,
    },
  ];

  // Ready-to-use Head JS Snippets
  const headJsSnippets = [
    {
      title: 'Google Analytics 4 (GA4)',
      description: 'Standard GA4 tracking tag template.',
      code: `// Google Analytics 4 (Replace G-XXXXXXXXXX with your Measurement ID)
(function() {
  var gaId = 'G-XXXXXXXXXX';
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + gaId;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', gaId);
})();`,
    },
    {
      title: 'Preconnect CDN Assets',
      description: 'Speed up font and asset loading with DNS preconnect.',
      code: `// Preconnect CDNs for faster asset delivery
['https://fonts.googleapis.com', 'https://fonts.gstatic.com'].forEach(function(url) {
  var link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = url;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
});`,
    },
  ];

  // Ready-to-use Body JS Snippets
  const bodyJsSnippets = [
    {
      title: 'Terminal Console Easter Egg Banner',
      description: 'Prints a creative ASCII art banner into the browser developer tools console.',
      code: `// BrackNodes Console Greeting
console.log(
  "%c BRACKNODES.IN %c Next-Gen Cloud & Discord Bot Hosting \\n",
  "background: #C7FF6B; color: #090B10; font-weight: bold; font-size: 14px; padding: 4px 8px; border-radius: 3px;",
  "color: #70B9FF; font-size: 12px; font-weight: bold;"
);
console.log("%cLooking for high-performance hosting? Visit https://bracknodes.in", "color: #9FA8BC; font-size: 11px;");`,
    },
    {
      title: 'Secure External Links Auto-Target',
      description: 'Ensures all outbound links open in a new tab with security attributes.',
      code: `// Automatically set target="_blank" and rel="noopener noreferrer" on external links
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href^="http"]').forEach(function(link) {
    if (!link.href.includes(window.location.hostname)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
});`,
    },
    {
      title: 'Smooth Scroll to Section Trigger',
      description: 'Smoothly scrolls to hash sections when clicking anchor links.',
      code: `// Smooth Anchor Scrolling
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    var targetId = this.getAttribute('href');
    if (targetId && targetId !== '#') {
      var elem = document.querySelector(targetId);
      if (elem) {
        e.preventDefault();
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});`,
    },
  ];

  const handleInsertSnippet = (snippetCode: string, field: 'customCss' | 'headJs' | 'bodyJs') => {
    const existing = codeSettings[field] || '';
    const separator = existing.trim() ? '\n\n' : '';
    const updated = {
      ...codeSettings,
      [field]: existing + separator + snippetCode,
    };
    setCodeSettings(updated);
    applyCustomCode(updated);
    setCopyNotice('Snippet appended to code editor!');
    setTimeout(() => setCopyNotice(null), 2500);
  };

  const handleToggleEnabled = () => {
    const updated = {
      ...codeSettings,
      isEnabled: !codeSettings.isEnabled,
    };
    setCodeSettings(updated);
    applyCustomCode(updated);
  };

  const handleSave = async () => {
    await updateSiteSettings({ customCode: codeSettings });
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 2500);
  };

  const handleReset = () => {
    if (confirm('Reset custom CSS and JS back to standard studio presets?')) {
      const defaultCode: CustomCodeSettings = {
        isEnabled: true,
        customCss: `/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: var(--bg-primary);
}
::-webkit-scrollbar-thumb {
  background: var(--border-subtle);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--accent-lime);
}
`,
        headJs: `// Custom <head> JavaScript
// Example: Google Analytics, meta scripts, or font loader hooks
// console.log('Head custom script initialized');
`,
        bodyJs: `// Custom <body> JavaScript
// Example: DOM interactions, smooth scroll enhancements, custom triggers
// console.log('Body custom script loaded');
`,
      };
      setCodeSettings(defaultCode);
      applyCustomCode(defaultCode);
      updateSiteSettings({ customCode: defaultCode });
    }
  };

  // Line counter helper
  const countLines = (str: string) => (str ? str.split('\n').length : 1);

  return (
    <div style={{ maxWidth: '1050px', paddingBottom: '3rem' }}>
      {/* Header */}
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
            <Code2 size={24} style={{ color: 'var(--accent-lime)' }} />
            <h2 style={{ fontSize: '1.6rem', margin: 0 }}>Custom Code &amp; Script Studio</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0, maxWidth: '650px' }}>
            Add custom CSS stylesheet rules and JavaScript scripts (analytics, meta tracking, animations, DOM triggers) directly into your live website.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Master Enable/Disable Toggle */}
          <button
            onClick={handleToggleEnabled}
            style={{
              padding: '0.55rem 1rem',
              backgroundColor: codeSettings.isEnabled ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              border: `1px solid ${codeSettings.isEnabled ? '#22c55e' : '#ef4444'}`,
              borderRadius: '4px',
              color: codeSettings.isEnabled ? '#22c55e' : '#ef4444',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            <Power size={14} />
            {codeSettings.isEnabled ? 'Custom Code: ACTIVE' : 'Custom Code: DISABLED'}
          </button>

          <button
            onClick={handleReset}
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
            {saveAlert ? 'Code Saved & Injected!' : 'Save & Inject Code'}
          </button>
        </div>
      </div>

      {/* Security & Sandbox Notice */}
      <div
        style={{
          backgroundColor: '#0c0f17',
          border: '1px solid #1c2438',
          borderRadius: '6px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldCheck size={20} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <strong style={{ color: '#F7F7F2' }}>Admin Protection Sandbox:</strong> Custom scripts are isolated in try/catch blocks and automatically bypassed within the admin dashboard so you can never get locked out by a syntax error.
          </div>
        </div>

        {copyNotice && (
          <span
            className="mono"
            style={{
              fontSize: '0.75rem',
              color: 'var(--accent-lime)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Check size={14} /> {copyNotice}
          </span>
        )}
      </div>

      {/* Editor Language Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid #1c2438',
          marginBottom: '1.5rem',
        }}
      >
        <button
          onClick={() => setActiveTab('css')}
          style={{
            padding: '0.75rem 1.25rem',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'css' ? '2px solid var(--accent-lime)' : '2px solid transparent',
            color: activeTab === 'css' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'css' ? 600 : 400,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
          }}
        >
          <FileCode size={16} style={{ color: activeTab === 'css' ? 'var(--accent-lime)' : 'inherit' }} />
          Custom CSS ({countLines(codeSettings.customCss)} lines)
        </button>

        <button
          onClick={() => setActiveTab('head-js')}
          style={{
            padding: '0.75rem 1.25rem',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'head-js' ? '2px solid var(--accent-blue)' : '2px solid transparent',
            color: activeTab === 'head-js' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'head-js' ? 600 : 400,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
          }}
        >
          <Terminal size={16} style={{ color: activeTab === 'head-js' ? 'var(--accent-blue)' : 'inherit' }} />
          Head JavaScript (&lt;head&gt;)
        </button>

        <button
          onClick={() => setActiveTab('body-js')}
          style={{
            padding: '0.75rem 1.25rem',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'body-js' ? '2px solid #a855f7' : '2px solid transparent',
            color: activeTab === 'body-js' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'body-js' ? 600 : 400,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
          }}
        >
          <Zap size={16} style={{ color: activeTab === 'body-js' ? '#a855f7' : 'inherit' }} />
          Body JavaScript (&lt;/body&gt;)
        </button>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: CUSTOM CSS EDITOR */}
      {/* ===================================================================== */}
      {activeTab === 'css' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Quick CSS Presets */}
          <div
            style={{
              backgroundColor: '#0c0f17',
              border: '1px solid #1c2438',
              borderRadius: '6px',
              padding: '1.25rem',
            }}
          >
            <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              POPULAR CSS SNIPPET PRESETS (1-CLICK APPEND):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
              {cssSnippets.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#11151f',
                    border: '1px solid #1f273d',
                    padding: '0.85rem',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#F7F7F2', marginBottom: '2px' }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      {s.description}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInsertSnippet(s.code, 'customCss')}
                    style={{
                      alignSelf: 'flex-start',
                      padding: '4px 10px',
                      backgroundColor: '#162033',
                      border: '1px solid #283754',
                      borderRadius: '3px',
                      color: 'var(--accent-lime)',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <Copy size={12} />
                    Insert Snippet
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* CSS Code Editor */}
          <div
            style={{
              backgroundColor: '#07090e',
              border: '1px solid #1c2438',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            {/* Editor Top Bar */}
            <div
              style={{
                padding: '0.65rem 1rem',
                backgroundColor: '#0c0f17',
                borderBottom: '1px solid #1c2438',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#eab308' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '8px' }}>
                  custom-stylesheet.css
                </span>
              </div>
              <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {codeSettings.customCss.length} characters · {countLines(codeSettings.customCss)} lines
              </div>
            </div>

            {/* Monospace Textarea */}
            <textarea
              value={codeSettings.customCss}
              onChange={(e) => {
                const updated = { ...codeSettings, customCss: e.target.value };
                setCodeSettings(updated);
                applyCustomCode(updated);
              }}
              placeholder="/* Enter custom CSS rules here. They will be injected into <head> in real time. */&#10;&#10;h1 {&#10;  letter-spacing: -0.02em;&#10;}"
              spellCheck={false}
              rows={18}
              style={{
                width: '100%',
                backgroundColor: '#07090e',
                color: '#C7FF6B',
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontSize: '0.85rem',
                lineHeight: 1.6,
                padding: '1.25rem',
                border: 'none',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
                tabSize: 2,
              }}
            />
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: HEAD JAVASCRIPT EDITOR */}
      {/* ===================================================================== */}
      {activeTab === 'head-js' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Quick Head Presets */}
          <div
            style={{
              backgroundColor: '#0c0f17',
              border: '1px solid #1c2438',
              borderRadius: '6px',
              padding: '1.25rem',
            }}
          >
            <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              POPULAR HEAD SCRIPT PRESETS (1-CLICK APPEND):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
              {headJsSnippets.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#11151f',
                    border: '1px solid #1f273d',
                    padding: '0.85rem',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#F7F7F2', marginBottom: '2px' }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      {s.description}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInsertSnippet(s.code, 'headJs')}
                    style={{
                      alignSelf: 'flex-start',
                      padding: '4px 10px',
                      backgroundColor: '#162033',
                      border: '1px solid #283754',
                      borderRadius: '3px',
                      color: 'var(--accent-blue)',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <Copy size={12} />
                    Insert Snippet
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Head JS Code Editor */}
          <div
            style={{
              backgroundColor: '#07090e',
              border: '1px solid #1c2438',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '0.65rem 1rem',
                backgroundColor: '#0c0f17',
                borderBottom: '1px solid #1c2438',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#eab308' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '8px' }}>
                  head-injected-script.js
                </span>
              </div>
              <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {codeSettings.headJs.length} characters · {countLines(codeSettings.headJs)} lines
              </div>
            </div>

            <textarea
              value={codeSettings.headJs}
              onChange={(e) => {
                const updated = { ...codeSettings, headJs: e.target.value };
                setCodeSettings(updated);
                applyCustomCode(updated);
              }}
              placeholder="// JavaScript injected into <head>&#10;// Perfect for analytics scripts, meta tags, and third-party trackers&#10;&#10;console.log('Head script executed');"
              spellCheck={false}
              rows={18}
              style={{
                width: '100%',
                backgroundColor: '#07090e',
                color: '#70B9FF',
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontSize: '0.85rem',
                lineHeight: 1.6,
                padding: '1.25rem',
                border: 'none',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
                tabSize: 2,
              }}
            />
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: BODY JAVASCRIPT EDITOR */}
      {/* ===================================================================== */}
      {activeTab === 'body-js' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Quick Body Presets */}
          <div
            style={{
              backgroundColor: '#0c0f17',
              border: '1px solid #1c2438',
              borderRadius: '6px',
              padding: '1.25rem',
            }}
          >
            <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              POPULAR BODY SCRIPT PRESETS (1-CLICK APPEND):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
              {bodyJsSnippets.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#11151f',
                    border: '1px solid #1f273d',
                    padding: '0.85rem',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#F7F7F2', marginBottom: '2px' }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      {s.description}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInsertSnippet(s.code, 'bodyJs')}
                    style={{
                      alignSelf: 'flex-start',
                      padding: '4px 10px',
                      backgroundColor: '#162033',
                      border: '1px solid #283754',
                      borderRadius: '3px',
                      color: '#a855f7',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <Copy size={12} />
                    Insert Snippet
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Body JS Code Editor */}
          <div
            style={{
              backgroundColor: '#07090e',
              border: '1px solid #1c2438',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '0.65rem 1rem',
                backgroundColor: '#0c0f17',
                borderBottom: '1px solid #1c2438',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#eab308' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '8px' }}>
                  body-injected-script.js
                </span>
              </div>
              <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {codeSettings.bodyJs.length} characters · {countLines(codeSettings.bodyJs)} lines
              </div>
            </div>

            <textarea
              value={codeSettings.bodyJs}
              onChange={(e) => {
                const updated = { ...codeSettings, bodyJs: e.target.value };
                setCodeSettings(updated);
                applyCustomCode(updated);
              }}
              placeholder="// JavaScript injected into end of <body>&#10;// Ideal for DOM manipulation, custom event listeners, chat widgets&#10;&#10;console.log('Body script executed');"
              spellCheck={false}
              rows={18}
              style={{
                width: '100%',
                backgroundColor: '#07090e',
                color: '#d8b4fe',
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontSize: '0.85rem',
                lineHeight: 1.6,
                padding: '1.25rem',
                border: 'none',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
                tabSize: 2,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

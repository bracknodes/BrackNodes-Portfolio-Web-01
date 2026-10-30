import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import {
  ShieldCheck,
  Check,
  ExternalLink,
  Globe,
  FileCode,
  Copy,
  Download,
  Plus,
  Trash2,
  HelpCircle,
  DollarSign,
} from 'lucide-react';

export const SeoDomainView: React.FC = () => {
  const { siteSettings, updateSiteSettings } = useCMS();

  // Active Sub-Tab
  const [activeSubTab, setActiveSubTab] = useState<'meta' | 'robots' | 'schema' | 'sitemap'>('meta');

  // Primary Meta & Canonical
  const [title, setTitle] = useState(siteSettings.seo?.title || 'BrackNodes — High-Speed Cloud & Discord Bot Hosting');
  const [description, setDescription] = useState(
    siteSettings.seo?.description ||
      'India’s leading affordable cloud hosting provider. 24/7 Discord Bot Hosting, NVMe cPanel Web Hosting, and low-latency Cloud VPS starting at ₹29/month.'
  );
  const [canonicalDomain, setCanonicalDomain] = useState(siteSettings.seo?.canonicalDomain || 'https://bracknodes.in');
  const [keywords, setKeywords] = useState(
    siteSettings.seo?.keywords ||
      'discord bot hosting india, cpanel hosting india, cheap cloud vps, nvme web hosting, pterodactyl bot hosting, nodejs bot hosting, python bot hosting, low latency server india, bracknodes'
  );
  const [ogImage, setOgImage] = useState(siteSettings.seo?.ogImage || 'https://bracknodes.in/og-preview.png');

  // Schema & Pricing Rich Snippets
  const [starterPrice, setStarterPrice] = useState(siteSettings.seo?.starterPrice || '29');
  const [currency, setCurrency] = useState(siteSettings.seo?.currency || 'INR');
  const [faqItems, setFaqItems] = useState<Array<{ id: string; question: string; answer: string }>>(
    siteSettings.seo?.faqItems || [
      {
        id: 'faq-1',
        question: 'What hosting services does BrackNodes offer?',
        answer:
          'BrackNodes offers 24/7 Discord Bot Hosting on high-performance Pterodactyl panels, lightning-fast NVMe cPanel Web Hosting with free SSL and automated backups, and scalable low-latency Cloud VPS compute starting at just ₹29/month.',
      },
      {
        id: 'faq-2',
        question: 'How much does Discord bot hosting cost on BrackNodes?',
        answer:
          'Discord bot hosting plans at BrackNodes start at only ₹29/month with automated instant 60-second activation, DDoS protection, and 99.99% uptime guarantee.',
      },
      {
        id: 'faq-3',
        question: 'Does BrackNodes provide cPanel Web Hosting?',
        answer:
          'Yes, BrackNodes provides NVMe SSD cPanel hosting complete with free SSL certificates, automated daily backups, Softaculous 1-click app installer, and 24/7 technical support.',
      },
      {
        id: 'faq-4',
        question: 'How fast is server provisioning at BrackNodes?',
        answer:
          'All server and bot hosting plans are provisioned instantly through our automated orchestration system within 60 seconds of order confirmation.',
      },
    ]
  );
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');

  // Robots.txt Editor
  const [robotsTxt, setRobotsTxt] = useState(
    siteSettings.seo?.customRobotsTxt ||
      `# BrackNodes Robots & Crawler Policy
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /login/

Sitemap: https://bracknodes.in/sitemap.xml`
  );

  // Sitemap URLs
  const [sitemapUrls, setSitemapUrls] = useState<Array<{ loc: string; priority: string; changefreq: string }>>([
    { loc: 'https://bracknodes.in/', priority: '1.0', changefreq: 'weekly' },
    { loc: 'https://bracknodes.in/#services', priority: '0.9', changefreq: 'weekly' },
    { loc: 'https://bracknodes.in/#projects', priority: '0.9', changefreq: 'weekly' },
    { loc: 'https://bracknodes.in/#process', priority: '0.8', changefreq: 'monthly' },
    { loc: 'https://bracknodes.in/#about', priority: '0.8', changefreq: 'monthly' },
    { loc: 'https://bracknodes.in/#contact', priority: '0.8', changefreq: 'monthly' },
  ]);
  const [newUrlPath, setNewUrlPath] = useState('');

  // Feedback State
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;
    const newItem = {
      id: `faq-${Date.now()}`,
      question: newFaqQuestion.trim(),
      answer: newFaqAnswer.trim(),
    };
    setFaqItems([...faqItems, newItem]);
    setNewFaqQuestion('');
    setNewFaqAnswer('');
  };

  const handleRemoveFaq = (id: string) => {
    setFaqItems(faqItems.filter((f) => f.id !== id));
  };

  const handleAddSitemapUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrlPath.trim()) return;
    const clean = newUrlPath.startsWith('http')
      ? newUrlPath.trim()
      : `${canonicalDomain.replace(/\/+$/, '')}/${newUrlPath.trim().replace(/^\/+/, '')}`;
    setSitemapUrls([...sitemapUrls, { loc: clean, priority: '0.7', changefreq: 'monthly' }]);
    setNewUrlPath('');
  };

  const handleRemoveSitemapUrl = (loc: string) => {
    setSitemapUrls(sitemapUrls.filter((u) => u.loc !== loc));
  };

  const generateSitemapXml = () => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateSiteSettings({
      seo: {
        title: title.trim(),
        description: description.trim(),
        canonicalDomain: canonicalDomain.trim(),
        keywords: keywords.trim(),
        ogImage: ogImage.trim(),
        starterPrice: starterPrice.trim(),
        currency: currency.trim(),
        customRobotsTxt: robotsTxt,
        faqItems,
      },
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div style={{ maxWidth: '960px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Advanced SEO &amp; Google Search Ranking Suite</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
          Manage and customize your Meta tags, Robots.txt policy, Schema.org rich snippets, FAQ search accordions, and XML sitemaps.
        </p>
      </div>

      {/* ── 3 Interactive Feature Modules (Clickable Cards) ───────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Card 1: Sitemap */}
        <div
          onClick={() => setActiveSubTab('sitemap')}
          className="card-surface"
          style={{
            padding: '1.125rem',
            borderRadius: '4px',
            border: activeSubTab === 'sitemap' ? '1px solid var(--accent-lime)' : '1px solid var(--border-subtle)',
            backgroundColor: activeSubTab === 'sitemap' ? 'rgba(199, 255, 107, 0.05)' : '#0c0f17',
            cursor: 'pointer',
            transition: 'all var(--t-fast)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-lime)' }}>
              <FileCode size={16} />
              <span className="mono" style={{ fontSize: '0.75rem', fontWeight: 700 }}>XML SITEMAP ENGINE</span>
            </div>
            <span className="mono" style={{ fontSize: '0.625rem', color: 'var(--accent-lime)', textTransform: 'uppercase' }}>
              {activeSubTab === 'sitemap' ? '● EDITING' : 'CLICK TO EDIT'}
            </span>
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Auto-generated at <code>/sitemap.xml</code> with {sitemapUrls.length} prioritized URL routes.
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-lime)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              Edit URLs &amp; Priorities &rarr;
            </span>
          </div>
        </div>

        {/* Card 2: Robots */}
        <div
          onClick={() => setActiveSubTab('robots')}
          className="card-surface"
          style={{
            padding: '1.125rem',
            borderRadius: '4px',
            border: activeSubTab === 'robots' ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
            backgroundColor: activeSubTab === 'robots' ? 'rgba(96, 168, 248, 0.05)' : '#0c0f17',
            cursor: 'pointer',
            transition: 'all var(--t-fast)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-blue)' }}>
              <ShieldCheck size={16} />
              <span className="mono" style={{ fontSize: '0.75rem', fontWeight: 700 }}>ROBOTS.TXT CRAWLER POLICY</span>
            </div>
            <span className="mono" style={{ fontSize: '0.625rem', color: 'var(--accent-blue)', textTransform: 'uppercase' }}>
              {activeSubTab === 'robots' ? '● EDITING' : 'CLICK TO EDIT'}
            </span>
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Active at <code>/robots.txt</code>. Configure crawl rules, user-agents, and disallowed directories.
          </div>
          <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Edit Crawler Rules &rarr;
          </span>
        </div>

        {/* Card 3: Schema */}
        <div
          onClick={() => setActiveSubTab('schema')}
          className="card-surface"
          style={{
            padding: '1.125rem',
            borderRadius: '4px',
            border: activeSubTab === 'schema' ? '1px solid #a78bfa' : '1px solid var(--border-subtle)',
            backgroundColor: activeSubTab === 'schema' ? 'rgba(167, 139, 250, 0.05)' : '#0c0f17',
            cursor: 'pointer',
            transition: 'all var(--t-fast)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a78bfa' }}>
              <Globe size={16} />
              <span className="mono" style={{ fontSize: '0.75rem', fontWeight: 700 }}>SCHEMA.ORG RICH SNIPPETS</span>
            </div>
            <span className="mono" style={{ fontSize: '0.625rem', color: '#a78bfa', textTransform: 'uppercase' }}>
              {activeSubTab === 'schema' ? '● EDITING' : 'CLICK TO EDIT'}
            </span>
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Offer (₹{starterPrice}/mo), Organization, and {faqItems.length} Google Search FAQ Accordions active.
          </div>
          <span className="mono" style={{ fontSize: '0.75rem', color: '#a78bfa', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Edit FAQs &amp; Prices &rarr;
          </span>
        </div>
      </div>

      {/* Navigation Pills Bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
        <button
          type="button"
          onClick={() => setActiveSubTab('meta')}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            padding: '6px 14px',
            borderRadius: '2px',
            cursor: 'pointer',
            border: `1px solid ${activeSubTab === 'meta' ? 'var(--accent-lime)' : 'var(--border-subtle)'}`,
            backgroundColor: activeSubTab === 'meta' ? 'var(--accent-lime-muted)' : '#0c0f17',
            color: activeSubTab === 'meta' ? 'var(--accent-lime)' : 'var(--text-secondary)',
          }}
        >
          Primary Meta &amp; Title
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('sitemap')}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            padding: '6px 14px',
            borderRadius: '2px',
            cursor: 'pointer',
            border: `1px solid ${activeSubTab === 'sitemap' ? 'var(--accent-lime)' : 'var(--border-subtle)'}`,
            backgroundColor: activeSubTab === 'sitemap' ? 'var(--accent-lime-muted)' : '#0c0f17',
            color: activeSubTab === 'sitemap' ? 'var(--accent-lime)' : 'var(--text-secondary)',
          }}
        >
          XML Sitemap Manager ({sitemapUrls.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('robots')}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            padding: '6px 14px',
            borderRadius: '2px',
            cursor: 'pointer',
            border: `1px solid ${activeSubTab === 'robots' ? 'var(--accent-blue)' : 'var(--border-subtle)'}`,
            backgroundColor: activeSubTab === 'robots' ? 'rgba(96, 168, 248, 0.12)' : '#0c0f17',
            color: activeSubTab === 'robots' ? 'var(--accent-blue)' : 'var(--text-secondary)',
          }}
        >
          Robots.txt Policy Editor
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('schema')}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            padding: '6px 14px',
            borderRadius: '2px',
            cursor: 'pointer',
            border: `1px solid ${activeSubTab === 'schema' ? '#a78bfa' : 'var(--border-subtle)'}`,
            backgroundColor: activeSubTab === 'schema' ? 'rgba(167, 139, 250, 0.12)' : '#0c0f17',
            color: activeSubTab === 'schema' ? '#a78bfa' : 'var(--text-secondary)',
          }}
        >
          Google FAQ &amp; Pricing Schema ({faqItems.length} FAQs)
        </button>
      </div>

      <form onSubmit={handleSaveAll}>
        {/* ── TAB 1: PRIMARY META TAGS & KEYWORDS ───────────────────────── */}
        {activeSubTab === 'meta' && (
          <div>
            <div className="card-surface" style={{ padding: '1.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: 'var(--accent-lime)' }}>
                // Primary Search Engine Indexing Meta
              </h3>

              <div style={{ marginBottom: '1.25rem' }}>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  META TITLE TAG (RECOMMENDED: 50–60 CHARACTERS)
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#0c0f17',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    borderRadius: '2px',
                    fontSize: '0.875rem',
                  }}
                />
                <div className="mono" style={{ fontSize: '0.6875rem', color: title.length > 60 ? '#f59e0b' : 'var(--text-muted)', marginTop: '4px' }}>
                  Length: {title.length} characters {title.length > 60 && '(Long titles may truncate on Google)'}
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  META DESCRIPTION (RECOMMENDED: 140–160 CHARACTERS)
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#0c0f17',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    borderRadius: '2px',
                    fontSize: '0.875rem',
                    lineHeight: 1.5,
                  }}
                />
                <div className="mono" style={{ fontSize: '0.6875rem', color: description.length > 165 ? '#f59e0b' : 'var(--text-muted)', marginTop: '4px' }}>
                  Length: {description.length} characters
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  TARGET SEARCH KEYWORDS (COMMA SEPARATED)
                </label>
                <textarea
                  rows={2}
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="discord bot hosting india, cpanel hosting india, cheap cloud vps, nvme web hosting..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#0c0f17',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    borderRadius: '2px',
                    fontSize: '0.875rem',
                    lineHeight: 1.5,
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  OPEN GRAPH SOCIAL SHARE IMAGE URL (1200x630 PX)
                </label>
                <input
                  type="text"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  placeholder="https://bracknodes.in/og-preview.png"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#0c0f17',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              {/* Google Search Result Simulation */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Google Search Snippet Simulation (Live Preview)
                </div>
                <div style={{ padding: '1.25rem', backgroundColor: '#07090f', border: '1px solid #1a2234', borderRadius: '3px' }}>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--accent-lime)', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{canonicalDomain}</span>
                    <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>&rsaquo; cloud-hosting</span>
                  </div>
                  <div style={{ fontSize: '1.15rem', color: 'var(--accent-blue)', fontWeight: 600, marginBottom: '4px' }}>
                    {title}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '8px' }}>
                    {description}
                  </div>

                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', paddingTop: '8px', borderTop: '1px dashed #1a2234' }}>
                    <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--accent-lime)' }}>
                      ★ 4.9 · From ₹{starterPrice}.00/mo · Instant Provisioning
                    </span>
                    <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--accent-blue)' }}>
                      FAQ Accordion Active ({faqItems.length} questions)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Domain Configuration Card */}
            <div className="card-surface" style={{ padding: '1.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: 'var(--accent-blue)' }}>
                // Canonical Production Domain
              </h3>

              <div style={{ marginBottom: '1.5rem' }}>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  CANONICAL PRODUCTION DOMAIN
                </label>
                <input
                  type="text"
                  required
                  value={canonicalDomain}
                  onChange={(e) => setCanonicalDomain(e.target.value)}
                  placeholder="https://bracknodes.in"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#0c0f17',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              <div style={{ padding: '1.125rem', backgroundColor: '#07090f', border: '1px solid #1c2336', borderRadius: '3px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-lime)', marginBottom: '6px' }}>
                  <ShieldCheck size={16} />
                  <span className="mono" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                    GOOGLE SEARCH CONSOLE VERIFICATION INSTRUCTIONS
                  </span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  1. Visit <span style={{ color: 'var(--accent-blue)' }}>search.google.com/search-console</span><br />
                  2. Add Property &rarr; Enter <code>{canonicalDomain}</code> &rarr; Choose HTML tag or DNS TXT verification.<br />
                  3. Submit sitemap at: <code>{canonicalDomain}/sitemap.xml</code>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: XML SITEMAP MANAGER ───────────────────────────────── */}
        {activeSubTab === 'sitemap' && (
          <div className="card-surface" style={{ padding: '1.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-lime)', margin: 0, marginBottom: '4px' }}>
                  // XML Sitemap Route Manager
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', margin: 0 }}>
                  Customize the URLs indexed by Googlebot and their respective priority ranking scores.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary mono"
                  style={{ fontSize: '0.75rem', padding: '0.5rem 0.875rem' }}
                >
                  <ExternalLink size={13} />
                  <span>View Live</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleCopy(generateSitemapXml(), 'sitemap')}
                  className="btn btn-secondary mono"
                  style={{ fontSize: '0.75rem', padding: '0.5rem 0.875rem' }}
                >
                  {copiedKey === 'sitemap' ? <Check size={13} color="var(--accent-lime)" /> : <Copy size={13} />}
                  <span>{copiedKey === 'sitemap' ? 'Copied' : 'Copy XML'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadFile(generateSitemapXml(), 'sitemap.xml', 'application/xml')}
                  className="btn btn-secondary mono"
                  style={{ fontSize: '0.75rem', padding: '0.5rem 0.875rem' }}
                >
                  <Download size={13} />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Sitemap URLs Table */}
            <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '3px', overflow: 'hidden', marginBottom: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 110px 48px', padding: '8px 12px', backgroundColor: '#07090f', borderBottom: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                <span>URL LOCATION</span>
                <span>PRIORITY</span>
                <span>FREQUENCY</span>
                <span>ACTION</span>
              </div>

              {sitemapUrls.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 100px 110px 48px',
                    padding: '10px 12px',
                    backgroundColor: idx % 2 === 0 ? '#0c0f17' : '#0e121d',
                    borderBottom: idx < sitemapUrls.length - 1 ? '1px solid #161c2c' : 'none',
                    alignItems: 'center',
                    fontSize: '0.8125rem',
                  }}
                >
                  <span className="mono" style={{ color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                    {item.loc}
                  </span>

                  <div>
                    <select
                      value={item.priority}
                      onChange={(e) => {
                        const updated = [...sitemapUrls];
                        updated[idx].priority = e.target.value;
                        setSitemapUrls(updated);
                      }}
                      style={{ padding: '3px 6px', backgroundColor: '#07090f', border: '1px solid var(--border-subtle)', color: 'var(--accent-lime)', borderRadius: '2px', fontSize: '0.75rem' }}
                    >
                      <option value="1.0">1.0 (Top)</option>
                      <option value="0.9">0.9 (High)</option>
                      <option value="0.8">0.8 (Normal)</option>
                      <option value="0.7">0.7</option>
                      <option value="0.5">0.5</option>
                    </select>
                  </div>

                  <div>
                    <select
                      value={item.changefreq}
                      onChange={(e) => {
                        const updated = [...sitemapUrls];
                        updated[idx].changefreq = e.target.value;
                        setSitemapUrls(updated);
                      }}
                      style={{ padding: '3px 6px', backgroundColor: '#07090f', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', borderRadius: '2px', fontSize: '0.75rem' }}
                    >
                      <option value="daily">daily</option>
                      <option value="weekly">weekly</option>
                      <option value="monthly">monthly</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveSitemapUrl(item.loc)}
                    disabled={sitemapUrls.length <= 1}
                    style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: 0 }}
                    title="Remove URL"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New URL Form */}
            <div style={{ display: 'flex', gap: '8px', maxWidth: '520px' }}>
              <input
                type="text"
                placeholder="e.g. /#faq or https://bracknodes.in/terms"
                value={newUrlPath}
                onChange={(e) => setNewUrlPath(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.65rem 0.875rem',
                  backgroundColor: '#0c0f17',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  borderRadius: '2px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8125rem',
                }}
              />
              <button
                type="button"
                onClick={handleAddSitemapUrl}
                className="btn btn-secondary mono"
                style={{ padding: '0.65rem 1rem', fontSize: '0.75rem' }}
              >
                <Plus size={14} />
                <span>Add URL</span>
              </button>
            </div>
          </div>
        )}

        {/* ── TAB 3: ROBOTS.TXT POLICY EDITOR ──────────────────────────── */}
        {activeSubTab === 'robots' && (
          <div className="card-surface" style={{ padding: '1.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-blue)', margin: 0, marginBottom: '4px' }}>
                  // Live Robots.txt Crawler Policy Editor
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', margin: 0 }}>
                  Instruct search crawlers (Googlebot, Bingbot, Baidu) which directories to index or ignore.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary mono"
                  style={{ fontSize: '0.75rem', padding: '0.5rem 0.875rem' }}
                >
                  <ExternalLink size={13} />
                  <span>View Live</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleCopy(robotsTxt, 'robots')}
                  className="btn btn-secondary mono"
                  style={{ fontSize: '0.75rem', padding: '0.5rem 0.875rem' }}
                >
                  {copiedKey === 'robots' ? <Check size={13} color="var(--accent-lime)" /> : <Copy size={13} />}
                  <span>{copiedKey === 'robots' ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadFile(robotsTxt, 'robots.txt', 'text/plain')}
                  className="btn btn-secondary mono"
                  style={{ fontSize: '0.75rem', padding: '0.5rem 0.875rem' }}
                >
                  <Download size={13} />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Presets Bar */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>QUICK PRESETS:</span>
              <button
                type="button"
                onClick={() =>
                  setRobotsTxt(
                    `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nDisallow: /login/\n\nSitemap: ${canonicalDomain}/sitemap.xml`
                  )
                }
                className="mono btn btn-ghost"
                style={{ fontSize: '0.6875rem', padding: '3px 8px' }}
              >
                Recommended
              </button>
              <button
                type="button"
                onClick={() =>
                  setRobotsTxt(
                    `User-agent: *\nAllow: /\nDisallow: /admin/\n\n# Block AI Scrapers\nUser-agent: GPTBot\nDisallow: /\nUser-agent: CCBot\nDisallow: /\n\nSitemap: ${canonicalDomain}/sitemap.xml`
                  )
                }
                className="mono btn btn-ghost"
                style={{ fontSize: '0.6875rem', padding: '3px 8px' }}
              >
                Block AI Scrapers
              </button>
            </div>

            {/* Code Editor */}
            <textarea
              rows={9}
              value={robotsTxt}
              onChange={(e) => setRobotsTxt(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: '#07090f',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: '3px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                lineHeight: 1.6,
              }}
            />
          </div>
        )}

        {/* ── TAB 4: SCHEMA.ORG RICH SNIPPETS & FAQ ACCORDION ──────────── */}
        {activeSubTab === 'schema' && (
          <div>
            {/* Pricing Offer Schema */}
            <div className="card-surface" style={{ padding: '1.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a78bfa', marginBottom: '8px' }}>
                <DollarSign size={18} />
                <h3 style={{ fontSize: '1.15rem', margin: 0 }}>
                  Google Search Pricing Rich Snippet (Starting Offer)
                </h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
                This structured offer triggers Google to display a low-price badge directly in organic search results.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    STARTING PLAN PRICE
                  </label>
                  <input
                    type="text"
                    value={starterPrice}
                    onChange={(e) => setStarterPrice(e.target.value)}
                    placeholder="29"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#0c0f17',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--accent-lime)',
                      borderRadius: '2px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                    }}
                  />
                </div>

                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    CURRENCY CODE (ISO)
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#0c0f17',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      borderRadius: '2px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.875rem',
                    }}
                  >
                    <option value="INR">INR — Indian Rupee (₹)</option>
                    <option value="USD">USD — US Dollar ($)</option>
                    <option value="EUR">EUR — Euro (€)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* FAQ Questions Manager */}
            <div className="card-surface" style={{ padding: '1.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a78bfa', marginBottom: '8px' }}>
                <HelpCircle size={18} />
                <h3 style={{ fontSize: '1.15rem', margin: 0 }}>
                  Google Search FAQ Accordions (FAQPage Schema)
                </h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
                Google displays these questions and answers directly underneath your website link on search results as clickable accordions.
              </p>

              {/* FAQ List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
                {faqItems.map((item, index) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '1rem',
                      backgroundColor: '#07090f',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '3px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--accent-lime)' }}>
                          Q{index + 1}.
                        </span>
                        <input
                          type="text"
                          value={item.question}
                          onChange={(e) => {
                            const updated = [...faqItems];
                            updated[index].question = e.target.value;
                            setFaqItems(updated);
                          }}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: 'var(--text-primary)',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            width: '100%',
                            outline: 'none',
                          }}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveFaq(item.id)}
                        style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: 0 }}
                        title="Remove FAQ"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={item.answer}
                      onChange={(e) => {
                        const updated = [...faqItems];
                        updated[index].answer = e.target.value;
                        setFaqItems(updated);
                      }}
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        backgroundColor: '#0c0f17',
                        border: '1px solid #1c2336',
                        color: 'var(--text-secondary)',
                        borderRadius: '2px',
                        fontSize: '0.8125rem',
                        lineHeight: 1.5,
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Add FAQ Form */}
              <div style={{ padding: '1.125rem', backgroundColor: '#07090f', border: '1px dashed #232c42', borderRadius: '3px' }}>
                <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-lime)', marginBottom: '8px', fontWeight: 600 }}>
                  + ADD NEW FAQ QUESTION TO GOOGLE SCHEMA
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Question (e.g. Do you support Node.js v20 bot hosting?)"
                    value={newFaqQuestion}
                    onChange={(e) => setNewFaqQuestion(e.target.value)}
                    style={{
                      padding: '0.65rem 0.875rem',
                      backgroundColor: '#0c0f17',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      borderRadius: '2px',
                      fontSize: '0.8125rem',
                    }}
                  />
                  <textarea
                    rows={2}
                    placeholder="Answer (e.g. Yes! All bot plans support Node.js 18, 20, Python 3.11, and Java 17/21.)"
                    value={newFaqAnswer}
                    onChange={(e) => setNewFaqAnswer(e.target.value)}
                    style={{
                      padding: '0.65rem 0.875rem',
                      backgroundColor: '#0c0f17',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      borderRadius: '2px',
                      fontSize: '0.8125rem',
                      lineHeight: 1.5,
                    }}
                  />
                  <div>
                    <button
                      type="button"
                      onClick={handleAddFaq}
                      className="btn btn-secondary mono"
                      style={{ fontSize: '0.75rem', padding: '0.625rem 1.25rem' }}
                    >
                      <Plus size={14} />
                      <span>Add to FAQ Schema</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {savedSuccess && (
              <span className="mono" style={{ color: 'var(--accent-lime)', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={16} /> ALL SEO, SITEMAP &amp; SCHEMA SETTINGS PERSISTED
              </span>
            )}
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.875rem 2.25rem' }}>
            <Check size={16} />
            <span>Save Advanced SEO Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

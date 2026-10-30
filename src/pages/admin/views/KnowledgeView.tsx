import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useCMS } from '../../../context/CMSContext';
import {
  Database,
  Search,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  FolderGit2,
  Box,
  MessageSquare,
  LifeBuoy,
  Server,
  Zap,
  ShieldCheck,
  ExternalLink,
  Bot,
  Headphones,
  CheckCircle2,
} from 'lucide-react';
import type { AdminTab } from '../AdminLayout';

interface GuideItem {
  id: string;
  category: 'how-to-edit' | 'database' | 'deployment' | 'cpanel' | 'team' | 'socials' | '3d-sandbox' | 'inquiries' | 'themes';
  title: string;
  subtitle: string;
  badge: string;
  content: React.ReactNode;
}

interface KnowledgeViewProps {
  onNavigate?: (tab: AdminTab) => void;
}

export const KnowledgeView: React.FC<KnowledgeViewProps> = ({ onNavigate }) => {
  const { isLiveSupabase } = useAuth();
  const { siteSettings } = useCMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedGuide, setExpandedGuide] = useState<string | null>('how-to-edit-master');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const discordSocial = siteSettings.socialLinks?.find((s) => s.platform.toLowerCase() === 'discord');
  const discordUrl = discordSocial?.url || 'https://discord.gg/bracknodes';

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const sqlSchemaSnippet = `-- ══════════════════════════════════════════════════════════════
-- COMPLETE SUPABASE SQL SCHEMA FOR BRACKNODES CLOUD CMS
-- Run this in Supabase Project Dashboard -> SQL Editor -> Run
-- ══════════════════════════════════════════════════════════════

-- 1. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  brand_name TEXT NOT NULL DEFAULT 'BRACKNODES.IN',
  wordmark TEXT NOT NULL DEFAULT 'BRACKNODES',
  role TEXT NOT NULL DEFAULT 'Next-Gen Cloud & Discord Bot Hosting',
  tagline TEXT NOT NULL,
  subheading TEXT NOT NULL,
  status_badge TEXT NOT NULL,
  location TEXT NOT NULL,
  email TEXT NOT NULL,
  social_github TEXT,
  social_linkedin TEXT,
  social_x TEXT,
  seo_title TEXT,
  seo_description TEXT,
  custom_domain TEXT,
  admin_path TEXT DEFAULT 'admin',
  design_theme JSONB,
  inquire_form JSONB,
  typography JSONB,
  custom_code JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  year TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  tags TEXT[] DEFAULT '{}',
  metrics JSONB DEFAULT '[]',
  live_url TEXT,
  repo_url TEXT,
  featured BOOLEAN DEFAULT false,
  accent_color TEXT DEFAULT '#C7FF6B',
  preview_type TEXT DEFAULT 'interactive-canvas',
  preview_image TEXT,
  custom_preview_code TEXT,
  thumbnail_url TEXT,
  gallery_urls TEXT[] DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Services Table
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT,
  description TEXT NOT NULL,
  deliverables TEXT[] DEFAULT '{}',
  outcomes TEXT[] DEFAULT '{}',
  highlight TEXT,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Contact Inquiries Table (Client CRM)
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  project_type TEXT NOT NULL,
  budget TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Media Assets Table
CREATE TABLE IF NOT EXISTS public.media_assets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  size_bytes BIGINT DEFAULT 0,
  mime_type TEXT DEFAULT 'image/png',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- 7. Public Read Policies for Website Visitors
CREATE POLICY "Public can view published settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public can view published projects" ON public.projects FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published services" ON public.services FOR SELECT USING (is_published = true);
CREATE POLICY "Public can insert inquiries" ON public.contact_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view media" ON public.media_assets FOR SELECT USING (true);

-- 8. Authenticated Admin Full Management
CREATE POLICY "Admins have full access to settings" ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to projects" ON public.projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to services" ON public.services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to inquiries" ON public.contact_inquiries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to media" ON public.media_assets FOR ALL USING (auth.role() = 'authenticated');
`;

  const envSnippet = `# Supabase Cloud Credentials
# Obtain these from: https://supabase.com -> Project Settings -> API
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
`;

  const vercelJsonSnippet = `{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}`;

  const htaccessSnippet = `# ══════════════════════════════════════════════════════════════
# CPANEL APACHE / LITESPEED SPA REWRITE & SECURITY CONFIG
# Place this file as .htaccess inside public_html
# ══════════════════════════════════════════════════════════════

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Force HTTPS Redirection
<IfModule mod_rewrite.c>
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

# Gzip Compression Optimization
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
`;

  const guides: GuideItem[] = [
    {
      id: 'how-to-edit-master',
      category: 'how-to-edit',
      title: 'Master Guide: Where & How to Edit Every Section of the Website (कहाँ से क्या एडिट करें)',
      subtitle: 'Complete visual index and step-by-step instructions for editing Hero, 3D Canvas, Hosting Plans, Services, Stack, Process, Testimonials, Inquire Form, Branding & Themes.',
      badge: 'HOW TO EDIT (MASTER GUIDE)',
      content: (
        <div>
          <div style={{ padding: '14px 18px', backgroundColor: 'rgba(199, 255, 107, 0.08)', border: '1px solid rgba(199, 255, 107, 0.25)', borderRadius: '4px', marginBottom: '1.5rem' }}>
            <h4 style={{ color: 'var(--accent-lime)', fontSize: '0.95rem', margin: '0 0 6px 0' }}>
              🎯 Quick Confusion-Free Rule (याद रखने के लिए जरूरी नियम):
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
              Website ka content 2 types me divide hai:
              <br />
              <strong>1. Global Copy &amp; Text:</strong> Headlines, subheadings, navbar labels, marquee ticker, and footer text — yeh sab <strong>&quot;Website Content&quot;</strong> editor se edit hote hain.
              <br />
              <strong>2. Dynamic Multi-Item Sections:</strong> Hosting Plan cards, Services list, Infrastructure Stack chips, Process steps, Customer reviews, 3D rotating model, and Inquire form dropdowns — in sabke liye <strong>sidebar me alag se dedicated tabs</strong> diye gaye hain taaki aap har item ko add, edit, delete aur reorder kar sakein!
            </p>
          </div>

          <h4 style={{ color: 'var(--accent-lime)', fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🗺️ Master Directory: Homepage Sections to Admin Tabs Mapping</span>
          </h4>

          <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#11151f', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '10px 12px', color: 'var(--accent-lime)', fontFamily: 'var(--font-mono)' }}>HOMEPAGE SECTION</th>
                  <th style={{ padding: '10px 12px', color: '#F7F7F2' }}>WHAT YOU CAN EDIT</th>
                  <th style={{ padding: '10px 12px', color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>EXACT ADMIN TAB</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>QUICK ACTION</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { section: 'Top Header & Brand Logo', content: 'Brand Logo Upload (PNG/SVG/JPG), Logo Height Slider, Display Modes, Wordmark (BRACKNODES.IN), Subtitle, Navbar Links, Contact Email', tab: 'content' as AdminTab, tabName: 'Website Content' },
                  { section: 'Hero Banner', content: 'Status Badge (● All Nodes Operational), Main Headline, Subheading, CTAs, 4 Micro Stats, Marquee Ticker', tab: 'content' as AdminTab, tabName: 'Website Content' },
                  { section: 'Interactive 3D Object', content: 'Rotating 3D Geometry (Icosahedron/Torus/Sphere), Wireframe Overlay, Rotation Speed, Particles, Glow Colors', tab: 'hero-3d' as AdminTab, tabName: '3D Canvas & Mesh' },
                  { section: '01. Hosting Plans & Category Filters', content: 'Category filter pills (All, Discord Bots, cPanel, VPS), Discord Bot Hosting, NVMe cPanel, VPS packages, Pricing (₹29/mo), KPI Spec Strips, Tags, Buy Links', tab: 'projects' as AdminTab, tabName: 'Projects / Plans' },
                  { section: '02. About Studio / Platform', content: 'Platform narrative paragraphs, 4 Statistic counters, 4 Pillars (Zero-Sleep Uptime, NVMe), Terminal Prompt', tab: 'content' as AdminTab, tabName: 'Website Content' },
                  { section: '03. Services & Capabilities', content: 'Service cards (Bot hosting, cPanel web hosting, VPS), Deliverables checklist, Outcomes, Highlights', tab: 'services' as AdminTab, tabName: 'Services' },
                  { section: '04. Infrastructure & Stack', content: 'Hosting Platforms (cPanel, Pterodactyl), Runtimes (Node.js, Python), Networking/DDoS shields, Dev Tools', tab: 'skills' as AdminTab, tabName: 'Skills / Stack' },
                  { section: '05. Provisioning Process', content: '5-step automated workflow (Plan selection, 60-sec provisioning, SSL setup, deploy bots, 24/7 telemetry)', tab: 'process' as AdminTab, tabName: 'Process' },
                  { section: '06. Customer Reviews', content: 'Verified client reviews, 5-star ratings, reviewer name, role, and company', tab: 'testimonials' as AdminTab, tabName: 'Testimonials' },
                  { section: '07. Contact & Inquire Form', content: 'Service dropdown options, budget tier options (₹29-₹99), 24/7 SLA badge, success message', tab: 'inquire-form' as AdminTab, tabName: 'Inquire Form' },
                  { section: 'Theme, Colors & Fonts', content: 'Accent Lime/Blue colors, Dark/Light modes, Google Fonts, Heading typography', tab: 'design' as AdminTab, tabName: 'Design & Themes' },
                  { section: 'Custom CSS & Head/Body JS', content: 'Live injected custom CSS stylesheets, Google Analytics scripts, head/body JavaScript hooks', tab: 'custom-code' as AdminTab, tabName: 'Custom Code' },
                  { section: 'System Updates & Version', content: 'Check for updates from GitHub, automated deployment, pre-update backup snapshot', tab: 'updates' as AdminTab, tabName: 'System Updates' },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #1c2438', backgroundColor: i % 2 === 0 ? 'transparent' : '#0a0d15' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#F7F7F2' }}>{row.section}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{row.content}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>{row.tabName}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                      {onNavigate && (
                        <button
                          type="button"
                          onClick={() => onNavigate(row.tab)}
                          className="mono"
                          style={{
                            padding: '4px 8px',
                            fontSize: '0.7rem',
                            backgroundColor: 'rgba(199, 255, 107, 0.1)',
                            border: '1px solid var(--accent-lime)',
                            color: 'var(--accent-lime)',
                            borderRadius: '2px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <span>Open</span>
                          <ArrowUpRight size={11} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 style={{ color: 'var(--accent-lime)', fontSize: '0.95rem', marginBottom: '8px' }}>
            1. How to Edit Website Headlines, Badges &amp; Narrative (Website Content)
          </h4>
          <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            <li>Sidebar me <strong>&quot;Website Content&quot;</strong> tab par click karein.</li>
            <li>Aapko upar filter tabs milenge: <em>01. Brand</em>, <em>02. Navbar</em>, <em>03. Hero</em>, <em>04. About</em>, <em>05. Headings</em>, <em>08. Footer</em>.</li>
            <li><strong>Hero Headline:</strong> Agar aap kisi shabd ko glowing gradient banana chahte hain, toh usko <code>*shabd*</code> ya <code>[shabd]</code> ke beech me likhein (jaise <code>RELIABLE *HOSTING* FOR EVERYONE.</code>).</li>
            <li>Bottom me <strong>&quot;Save All Homepage Updates&quot;</strong> par click karein. Saare updates bina kisi browser refresh ke instantly live ho jayenge.</li>
          </ol>

          <h4 style={{ color: 'var(--accent-lime)', fontSize: '0.95rem', marginBottom: '8px' }}>
            2. How to Edit the Rotating 3D Object in the Hero (3D Canvas &amp; Mesh)
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>
            Hero section me ghoomne wale 3D geometric shape ko customize karne ke liye:
          </p>
          <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1rem' }}>
            <li>Sidebar me <strong>&quot;3D Canvas &amp; Mesh&quot;</strong> par click karein.</li>
            <li><strong>Geometry Selection:</strong> <em>Icosahedron (Crystal Tech)</em>, <em>Torus Knot (Twisted Orbit)</em>, <em>Sphere (Smooth Planet)</em>, ya <em>Box (Cube)</em> choose karein.</li>
            <li><strong>Wireframe &amp; Orbit Rings:</strong> Wireframe overlay on/off karein, floating tech rings toggle karein.</li>
            <li><strong>Particles &amp; Rotation Speed:</strong> Particle count ko slider se badhayein ya ghatayein, auto-spin speed adjust karein.</li>
            <li><strong>Glow Colors:</strong> Primary accent lime aur secondary blue colors customize karein aur <strong>&quot;Save 3D Scene Config&quot;</strong> par click karein.</li>
          </ol>
          {onNavigate && (
            <div style={{ marginBottom: '1.5rem' }}>
              <button
                type="button"
                onClick={() => onNavigate('hero-3d')}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Box size={13} color="var(--accent-lime)" />
                <span>Go to 3D Canvas Editor Now</span>
                <ArrowUpRight size={12} />
              </button>
            </div>
          )}

          <h4 style={{ color: 'var(--accent-lime)', fontSize: '0.95rem', marginBottom: '8px' }}>
            3. How to Add, Edit, or Change Pricing of Hosting Plans (Projects &amp; Plans)
          </h4>
          <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1rem' }}>
            <li>Sidebar me <strong>&quot;Projects &amp; Plans&quot;</strong> par click karein.</li>
            <li>Kisi bhi plan (jaise <em>Discord Bot Hosting</em> ya <em>NVMe cPanel Hosting</em>) ke <strong>Edit</strong> button par click karein.</li>
            <li><strong>Pricing &amp; Specs:</strong> Technical Specs (KPI Strip) me <code>Price: ₹29 /mo</code>, <code>Uptime: 99.99%</code>, <code>Online: 24/7</code> ko directly change karein. Preset buttons (Cloud Hosting / Web benchmarks) bhi use kar sakte hain.</li>
            <li><strong>Buy / Order Link:</strong> &quot;Live Preview / Purchase URL&quot; field me apna checkout link dalein (jaise <code>https://bracknodes.in/store</code>).</li>
            <li><strong>Drag &amp; Reorder:</strong> Plans ko upar-neeche drag karke order change kar sakte hain.</li>
          </ol>
          {onNavigate && (
            <div style={{ marginBottom: '1.5rem' }}>
              <button
                type="button"
                onClick={() => onNavigate('projects')}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <FolderGit2 size={13} color="var(--accent-lime)" />
                <span>Go to Hosting Plans Editor Now</span>
                <ArrowUpRight size={12} />
              </button>
            </div>
          )}

          <h4 style={{ color: 'var(--accent-lime)', fontSize: '0.95rem', marginBottom: '8px' }}>
            4. How to Edit Services, Stack, Process &amp; Reviews
          </h4>
          <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            <li><strong>Services:</strong> <em>Services</em> tab me jakar naye deliverables, outcomes aur service descriptions add karein.</li>
            <li><strong>Infrastructure Stack:</strong> <em>Skills &amp; Stack</em> tab me jakar cPanel, Pterodactyl, KVM, Node.js, Python, Redis chips add ya delete karein.</li>
            <li><strong>Provisioning Process:</strong> <em>Process Flow</em> tab me jakar automated 60-second provisioning ke 5 steps ko modify karein.</li>
            <li><strong>Testimonials:</strong> <em>Testimonials</em> tab me verified customer quotes, 5-star ratings, aur client company names manage karein.</li>
          </ul>

          <h4 style={{ color: 'var(--accent-lime)', fontSize: '0.95rem', marginBottom: '8px' }}>
            5. Protected Footer Attribution Notice
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
            Footer me &quot;Designed &amp; Engineered by BrackNodes&quot; permanent copyright protection ke tahat locked hai aur isse admin panel se change nahi kiya ja sakta, taaki system integrity bani rahe.
          </p>
        </div>
      ),
    },
    {
      id: 'how-to-edit-hosting-plans',
      category: 'how-to-edit',
      title: 'How to Manage Hosting Plans & Change Pricing (Discord Bot, cPanel, Cloud VPS)',
      subtitle: 'Step-by-step instructions for adding plans, updating ₹29/mo prices, configuring KPI spec strips, and changing order buttons.',
      badge: 'HOSTING PLANS GUIDE',
      content: (
        <div>
          <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            BrackNodes portfolio par dikhne wale <strong>Hosting Plans</strong> (Discord Bot Hosting, NVMe cPanel Web Hosting, aur Performance Cloud VPS) ko aap <strong>&quot;Projects &amp; Plans&quot;</strong> editor se 100% customize kar sakte hain.
          </p>

          <h4 style={{ color: 'var(--accent-lime)', fontSize: '0.95rem', marginBottom: '8px' }}>
            Pricing aur Specs Kaise Update Karein:
          </h4>
          <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            <li>Sidebar me <strong>Projects / Plans</strong> tab par jayein.</li>
            <li>Plan card par <strong>&quot;Edit&quot;</strong> button click karein. Modal window open hogi.</li>
            <li><strong>Title:</strong> Plan ka name badlein (jaise <code>DISCORD BOT HOSTING</code>).</li>
            <li><strong>Category:</strong> Sub-category tag dalein (jaise <code>24/7 Runtime / Pterodactyl Panel</code>).</li>
            <li><strong>Technical Specs &amp; Metrics (KPI Strip):</strong>
              <ul style={{ paddingLeft: '1rem', marginTop: '4px' }}>
                <li><code>Starting Price</code>: <code>₹29 /mo</code></li>
                <li><code>Online Status</code>: <code>24/7 Active</code></li>
                <li><code>Uptime SLA</code>: <code>99.99% Guaranteed</code></li>
              </ul>
              Aap &quot;+ Add Metric&quot; click karke RAM, vCPU, NVMe storage bhi jod sakte hain!
            </li>
            <li><strong>Order / Purchase URL:</strong> &quot;Live URL&quot; me apna BrackNodes direct billing/checkout link paste karein (e.g. <code>https://bracknodes.in/order/discord-bot</code>).</li>
            <li><strong>Save Project</strong> par click karein. Website par turant new price aur specs reflect ho jayenge.</li>
          </ol>

          <h4 style={{ color: 'var(--accent-lime)', fontSize: '0.95rem', marginBottom: '8px' }}>
            Naya Hosting Plan Add Karna:
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            Upar diye gaye <strong>&quot;+ Add New Project&quot;</strong> button par click karke aap Dedicated Server, Game Server Hosting, ya Custom Cloud Plan add kar sakte hain.
          </p>

          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('projects')}
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <FolderGit2 size={15} />
              <span>Open Projects &amp; Plans Editor</span>
              <ArrowUpRight size={13} />
            </button>
          )}
        </div>
      ),
    },
    {
      id: 'supabase-connection',
      category: 'database',
      title: 'How to Connect the Website with Supabase Database',
      subtitle: 'Step-by-step setup for connecting cloud PostgreSQL, real-time sync, and Row Level Security.',
      badge: 'ESSENTIAL SETUP',
      content: (
        <div>
          <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            This portfolio works in two modes:
            <br />
            <strong>1. Local Persistence (Offline):</strong> Saves all edits, projects, and custom tokens instantly to your browser&apos;s LocalStorage. Perfect for testing without any backend setup.
            <br />
            <strong>2. Supabase Cloud Database (Production):</strong> Synchronizes all edits in real time across all devices, allows team collaborators to edit simultaneously, and stores inbound client inquiries in a secure cloud PostgreSQL database.
          </p>

          <h4 style={{ color: 'var(--accent-lime)', fontSize: '0.95rem', marginBottom: '8px' }}>
            Step 1: Create a Supabase Project
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            Visit <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}>supabase.com</a>, log in or create a free account, and click <strong>&quot;New Project&quot;</strong>. Choose a name and secure database password.
          </p>

          <h4 style={{ color: 'var(--accent-lime)', fontSize: '0.95rem', marginBottom: '8px' }}>
            Step 2: Get your Project API Credentials
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            In your Supabase project dashboard, navigate to <strong>Project Settings &gt; API</strong>. Find your <strong>Project URL</strong> and <strong>anon public</strong> API key.
          </p>

          <h4 style={{ color: 'var(--accent-lime)', fontSize: '0.95rem', marginBottom: '8px' }}>
            Step 3: Create your <code>.env</code> file
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>
            In the root directory of your project folder (<code>d:\Codings\web 1</code>), create or edit your <code>.env</code> file:
          </p>
          <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <pre style={{ padding: '1rem', backgroundColor: '#07090f', border: '1px solid #1c2438', borderRadius: '3px', fontSize: '0.78rem', color: '#c7ff6b', overflowX: 'auto', fontFamily: 'var(--font-mono)' }}>
              {envSnippet}
            </pre>
            <button
              type="button"
              onClick={() => copyToClipboard('env', envSnippet)}
              style={{ position: 'absolute', top: '10px', right: '10px', background: '#11151f', border: '1px solid #25314c', color: copiedKey === 'env' ? 'var(--accent-lime)' : '#8b97b0', padding: '4px 10px', borderRadius: '3px', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              {copiedKey === 'env' ? <Check size={12} /> : <Copy size={12} />}
              <span>{copiedKey === 'env' ? 'COPIED' : 'COPY .ENV'}</span>
            </button>
          </div>

          <h4 style={{ color: 'var(--accent-lime)', fontSize: '0.95rem', marginBottom: '8px' }}>
            Step 4: Execute Database Schema Migration
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>
            Go to Supabase Dashboard &gt; <strong>SQL Editor</strong> &gt; Click <strong>&quot;New query&quot;</strong>, paste the complete schema below, and click <strong>&quot;Run&quot;</strong>.
          </p>
          <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <pre style={{ maxHeight: '220px', overflowY: 'auto', padding: '1rem', backgroundColor: '#07090f', border: '1px solid #1c2438', borderRadius: '3px', fontSize: '0.75rem', color: '#8b97b0', fontFamily: 'var(--font-mono)' }}>
              {sqlSchemaSnippet}
            </pre>
            <button
              type="button"
              onClick={() => copyToClipboard('sql', sqlSchemaSnippet)}
              style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--accent-lime)', border: 'none', color: '#090b10', padding: '6px 12px', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {copiedKey === 'sql' ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedKey === 'sql' ? 'SQL SCRIPT COPIED!' : 'COPY FULL SQL SCHEMA'}</span>
            </button>
          </div>

          <h4 style={{ color: 'var(--accent-lime)', fontSize: '0.95rem', marginBottom: '8px' }}>
            Step 5: Restart Dev Server &amp; Verify
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
            Run <code>npm run dev</code> in your terminal. When connected, the indicator in your Admin layout will change from <em>Local Storage Mode</em> to <strong>● Live Supabase DB</strong>.
          </p>
        </div>
      ),
    },
    {
      id: 'deployment-guide',
      category: 'deployment',
      title: 'Deploying the Website (Vercel, Netlify, Cloudflare)',
      subtitle: 'Production deployment guide with environment variables and SPA routing redirects.',
      badge: 'DEPLOYMENT',
      content: (
        <div>
          <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Deploying your portfolio is straightforward using Vercel, Netlify, or Cloudflare Pages.
          </p>

          <h4 style={{ color: 'var(--accent-lime)', fontSize: '0.95rem', marginBottom: '8px' }}>
            Deploying to Vercel (Recommended)
          </h4>
          <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            <li>Push your repository to GitHub: <code>git push origin main</code>.</li>
            <li>Go to <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue)' }}>vercel.com</a> and click <strong>&quot;Add New Project&quot;</strong>.</li>
            <li>Import your GitHub repository. Vercel automatically detects <strong>Vite</strong>.</li>
            <li>Under <strong>Environment Variables</strong>, add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.</li>
            <li>Click <strong>&quot;Deploy&quot;</strong>. Your site will be live on an HTTPS domain within 60 seconds.</li>
          </ol>

          <h4 style={{ color: 'var(--accent-lime)', fontSize: '0.95rem', marginBottom: '8px' }}>
            SPA Client-Side Route Rewrites (<code>vercel.json</code>)
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>
            To ensure that refreshing the browser on direct URLs like <code>/admin</code> or <code>/admin/login</code> doesn&apos;t return a 404, create a <code>vercel.json</code> in the project root:
          </p>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <pre style={{ padding: '0.85rem', backgroundColor: '#07090f', border: '1px solid #1c2438', borderRadius: '3px', fontSize: '0.78rem', color: '#c7ff6b', fontFamily: 'var(--font-mono)' }}>
              {vercelJsonSnippet}
            </pre>
            <button
              type="button"
              onClick={() => copyToClipboard('vjson', vercelJsonSnippet)}
              style={{ position: 'absolute', top: '8px', right: '8px', background: '#11151f', border: '1px solid #25314c', color: copiedKey === 'vjson' ? 'var(--accent-lime)' : '#8b97b0', padding: '4px 8px', borderRadius: '3px', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              {copiedKey === 'vjson' ? <Check size={12} /> : <Copy size={12} />}
              <span>{copiedKey === 'vjson' ? 'COPIED' : 'COPY'}</span>
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 'cpanel-hosting-database',
      category: 'cpanel',
      title: 'How to Host Website on cPanel & Connect Database (BrackNodes Hosting)',
      subtitle: 'Complete guide for deploying build to cPanel public_html, Apache .htaccess rewrites, and database connection.',
      badge: 'CPANEL & BRACKNODES HOSTING',
      content: (
        <div>
          <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Hosting your portfolio on <strong>cPanel</strong> (such as <strong>BrackNodes Cloud Hosting</strong>) provides high-performance LiteSpeed/Apache hosting with full cPanel File Manager, custom domains, and free SSL.
          </p>

          <h4 style={{ color: 'var(--accent-lime)', fontSize: '0.95rem', marginBottom: '8px' }}>
            Step 1: Build the Production Bundle Locally
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>
            Before uploading to cPanel, compile the static production package on your computer:
          </p>
          <div style={{ padding: '10px 14px', backgroundColor: '#07090f', border: '1px solid #1c2438', borderRadius: '3px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#c7ff6b', marginBottom: '1rem' }}>
            npm run build
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            This generates the production-ready static files in the <code>dist/</code> folder (including <code>index.html</code>, <code>assets/</code>, and bundled scripts).
          </p>

          <h4 style={{ color: 'var(--accent-lime)', fontSize: '0.95rem', marginBottom: '8px' }}>
            Step 2: Log into BrackNodes cPanel &amp; Open File Manager
          </h4>
          <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            <li>Log into your BrackNodes Client Area or navigate to your cPanel login URL (e.g. <code>https://yourdomain.com:2083</code>).</li>
            <li>In the cPanel dashboard, click on <strong>File Manager</strong> under the <em>Files</em> section.</li>
            <li>In the left tree, click on <code>public_html</code> (or your domain/subdomain folder if hosting on a subdomain).</li>
          </ol>

          <h4 style={{ color: 'var(--accent-lime)', fontSize: '0.95rem', marginBottom: '8px' }}>
            Step 3: Upload &amp; Extract the <code>dist</code> Files
          </h4>
          <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            <li>On your computer, select all files inside the <code>dist/</code> folder and compress them into a <code>.zip</code> file (e.g. <code>build.zip</code>).</li>
            <li>In cPanel File Manager, click <strong>Upload</strong> in the top toolbar and upload <code>build.zip</code> into <code>public_html</code>.</li>
            <li>Right-click <code>build.zip</code> in File Manager and select <strong>Extract</strong>.</li>
            <li>Verify that <code>index.html</code> and the <code>assets/</code> folder are located directly in <code>public_html</code> (not nested inside an extra folder). You can now delete the <code>build.zip</code> file.</li>
          </ol>

          <h4 style={{ color: 'var(--accent-lime)', fontSize: '0.95rem', marginBottom: '8px' }}>
            Step 4: Create the <code>.htaccess</code> File for Single Page App (SPA) Routing (CRITICAL)
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>
            Because this portfolio is built with React Router, direct visits or browser refreshes on routes like <code>/admin</code> will return a <strong>404 Not Found</strong> unless Apache knows to route all requests back to <code>index.html</code>.
            <br />
            In cPanel File Manager, create a new file named <code>.htaccess</code> inside <code>public_html</code> and paste the configuration below:
          </p>
          <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <pre style={{ padding: '1rem', backgroundColor: '#07090f', border: '1px solid #1c2438', borderRadius: '3px', fontSize: '0.75rem', color: '#c7ff6b', fontFamily: 'var(--font-mono)', overflowX: 'auto' }}>
              {htaccessSnippet}
            </pre>
            <button
              type="button"
              onClick={() => copyToClipboard('htaccess', htaccessSnippet)}
              style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--accent-lime)', border: 'none', color: '#090b10', padding: '6px 12px', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {copiedKey === 'htaccess' ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedKey === 'htaccess' ? 'COPIED!' : 'COPY .HTACCESS'}</span>
            </button>
          </div>

          <h4 style={{ color: 'var(--accent-lime)', fontSize: '0.95rem', marginBottom: '8px' }}>
            Step 5: Direct cPanel MySQL Database Connection (Zero 3rd-Party Platform)
          </h4>
          <div style={{ padding: '14px', backgroundColor: 'rgba(199, 255, 107, 0.08)', border: '1px solid var(--accent-lime)', borderRadius: '3px', marginBottom: '1rem' }}>
            <p style={{ color: 'var(--accent-lime)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
              Native Self-Hosted MySQL on your own cPanel server:
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.6, margin: 0 }}>
              You do <strong>not</strong> need any external cloud platform (like Firebase or Supabase). The website includes a native PHP API bridge located in <code>public/api/</code>:
              <br /><br />
              1. In cPanel, open <strong>MySQL Databases</strong> &rarr; Create a database and user with <strong>All Privileges</strong>.<br />
              2. Open <code>public_html/api/config.php</code> &rarr; Enter your <code>DB_NAME</code>, <code>DB_USER</code>, and <code>DB_PASS</code>.<br />
              3. In Admin Panel &rarr; <strong>Account &amp; Database</strong>, click <strong>&quot;1-Click Auto-Create MySQL Tables&quot;</strong>.<br />
              All inquiries and client leads will now flow directly into your own cPanel database!
            </p>
          </div>

          <h4 style={{ color: 'var(--accent-lime)', fontSize: '0.95rem', marginBottom: '8px' }}>
            Step 6: Activate Free SSL Certificate on BrackNodes
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
            In your BrackNodes cPanel search bar, type <strong>SSL/TLS Status</strong>. Check your domain name and click <strong>&quot;Run AutoSSL&quot;</strong>. Within minutes, Let&apos;s Encrypt SSL will be activated with a green security lock on your domain.
          </p>
        </div>
      ),
    },
    {
      id: 'team-permissions',
      category: 'team',
      title: 'Team Access & Granular Action Permissions (RBAC)',
      subtitle: 'How to grant access to other team members and decide exactly what actions they can perform.',
      badge: 'ACCESS CONTROL',
      content: (
        <div>
          <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            You can give access to other people or email addresses and decide what specific sections and actions they are allowed to manage.
          </p>

          <h4 style={{ color: 'var(--accent-lime)', fontSize: '0.95rem', marginBottom: '8px' }}>
            Available Roles &amp; Presets
          </h4>
          <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            <li><strong>Administrator:</strong> Unrestricted access to all sections, database settings, and team management.</li>
            <li><strong>Content &amp; Projects Editor:</strong> Can create and update projects, services, skills, testimonials, and bio copy, but <em>cannot</em> view private client inquiries or change database security.</li>
            <li><strong>Inquiries Viewer (CRM):</strong> Specifically scoped to view incoming client inquiries and respond to leads.</li>
            <li><strong>Custom Permissions:</strong> Check and uncheck individual actions (Projects, Services, Skills, Content, Inquiries, Design, Media, Security).</li>
          </ul>

          <h4 style={{ color: 'var(--accent-lime)', fontSize: '0.95rem', marginBottom: '8px' }}>
            How to Grant Access
          </h4>
          <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7, margin: 0 }}>
            <li>Navigate to <strong>Team &amp; Permissions</strong> in the sidebar.</li>
            <li>Click <strong>&quot;Grant Access to Person&quot;</strong>.</li>
            <li>Enter their name and email address.</li>
            <li>Select an access preset or check the specific permissions you want them to have.</li>
            <li>Click <strong>&quot;Grant Access&quot;</strong>. When that person logs in with that email, their dashboard will automatically adapt to show only their authorized sections.</li>
          </ol>
        </div>
      ),
    },
    {
      id: 'dynamic-socials',
      category: 'socials',
      title: 'Adding, Editing & Deleting Social Media Links',
      subtitle: 'How to add new social media profiles or delete existing ones according to your needs.',
      badge: 'SOCIAL MEDIA',
      content: (
        <div>
          <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            You are not limited to fixed social links. You can add new platforms (YouTube, Discord, Telegram, Dribbble, Behance, Twitch, TikTok, or Custom URL) or delete any links you do not use.
          </p>

          <h4 style={{ color: 'var(--accent-lime)', fontSize: '0.95rem', marginBottom: '8px' }}>
            Managing Social Media
          </h4>
          <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            <li>Go to <strong>Website Content</strong> in the Admin panel.</li>
            <li>Scroll to <strong>// 03. Social Profiles &amp; Public Links</strong>.</li>
            <li>Click <strong>&quot;+ Add Social Media Link&quot;</strong> to add any platform.</li>
            <li>Pick a preset (e.g. YouTube, Discord, Telegram, X, GitHub) or type a custom name.</li>
            <li>Enter your profile URL and pick a custom accent color.</li>
            <li>Click <strong>&quot;Add Profile&quot;</strong>.</li>
            <li>To remove a link, click the trash icon next to that profile.</li>
          </ol>

          <div style={{ padding: '12px 16px', backgroundColor: 'rgba(96, 168, 248, 0.1)', border: '1px solid rgba(96, 168, 248, 0.3)', borderRadius: '3px', fontSize: '0.8rem', color: '#60a8f8' }}>
            💡 <strong>Instant Reflection:</strong> Any added or deleted social media profiles immediately update in the website footer and contact sections in real time!
          </div>
        </div>
      ),
    },
    {
      id: '3d-sandbox',
      category: '3d-sandbox',
      title: 'Interactive 3D Objects & Project Preview Sandbox',
      subtitle: 'Configuring Three.js WebGL scenes, Code Visualizers, Audio DSP, Custom Images, and HTML code.',
      badge: 'CREATIVE TECH',
      content: (
        <div>
          <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            The portfolio features dynamic interactive 3D and canvas visualizers engineered for high performance (60 FPS target).
          </p>

          <h4 style={{ color: 'var(--accent-lime)', fontSize: '0.95rem', marginBottom: '8px' }}>
            Interactive Sandbox Types for Projects
          </h4>
          <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1rem' }}>
            <li><strong>Interactive 3D Canvas:</strong> Real-time WebGL interactive geometry with mouse tracking and orbital animations.</li>
            <li><strong>Code Visualizer:</strong> Live syntax-highlighted code explorer with interactive token switcher (Lime, Cyan, Stealth).</li>
            <li><strong>Audio DSP Synthesizer:</strong> Procedural audio waveform visualizer with real-time audio oscillation simulation.</li>
            <li><strong>Custom Image Preview:</strong> Upload or paste an image URL to show screenshots or product art.</li>
            <li><strong>Custom Design Code:</strong> Inject raw HTML, SVG, or Canvas script that renders inside an isolated interactive container.</li>
          </ul>

          <h4 style={{ color: 'var(--accent-lime)', fontSize: '0.95rem', marginBottom: '8px' }}>
            Configuring in Project Manager
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
            Open <strong>Projects Manager</strong>, click <strong>&quot;Edit Project&quot;</strong> on any project, scroll down to <strong>INTERACTIVE PREVIEW SANDBOX</strong>, and select your preferred preview mode.
          </p>
        </div>
      ),
    },
    {
      id: 'theme-customization',
      category: 'themes',
      title: 'Theme Engine, Dark/Light Modes & Typography',
      subtitle: 'Configuring Theme Availability (Both, Dark Only, Light Only), Default Theme, and Fonts.',
      badge: 'DESIGN SYSTEM',
      content: (
        <div>
          <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            The website supports sophisticated CSS custom properties with real-time token injection.
          </p>

          <h4 style={{ color: 'var(--accent-lime)', fontSize: '0.95rem', marginBottom: '8px' }}>
            Theme Mode Availability
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            In <strong>Design Customization</strong>, you can configure:
            <br />
            • <strong>Both (Dark &amp; Light Available):</strong> Visitors see a theme toggle button in the navbar.
            <br />
            • <strong>Dark Mode Only:</strong> Forces dark mode across all devices and hides the toggle.
            <br />
            • <strong>Light Mode Only:</strong> Forces light mode across all devices.
            <br />
            • <strong>Default Theme:</strong> Sets whether first-time visitors see dark or light mode.
          </p>

          <h4 style={{ color: 'var(--accent-lime)', fontSize: '0.95rem', marginBottom: '8px' }}>
            Flash of Dark/Light Theme Prevention
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
            The website features an inline pre-render script in <code>index.html</code> that reads the user&apos;s theme preference before CSS renders, completely eliminating any flash of unstyled theme on page load.
          </p>
        </div>
      ),
    },
  ];

  const filteredGuides = guides.filter((g) => {
    const matchesCat = selectedCategory === 'all' || g.category === selectedCategory;
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1050px' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-lime)', marginBottom: '4px' }}>
          DOCUMENTATION // MASTER KNOWLEDGE BASE
        </div>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '6px', color: '#F7F7F2' }}>
          Studio CMS Knowledge &amp; Setup Guide
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
          Everything you need to connect your database, deploy to production, manage team access, and customize your studio portfolio.
        </p>
      </div>

      {/* Live System Diagnostic Card */}
      <div
        className="card-surface"
        style={{
          padding: '1.25rem 1.5rem',
          borderRadius: '4px',
          border: '1px solid var(--border-subtle)',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: '#0c0f17',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: isLiveSupabase ? 'var(--accent-lime)' : '#60a8f8',
              boxShadow: isLiveSupabase ? '0 0 10px var(--accent-lime)' : '0 0 10px #60a8f8',
            }}
          />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#F7F7F2' }}>
              Database Status: {isLiveSupabase ? 'Supabase PostgreSQL Cloud (Active)' : 'Local Persistence Mode (Ready for Cloud)'}
            </div>
            <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Private Admin Route: /{siteSettings.adminPath || 'admin'} • Theme Strategy: {siteSettings.themeSettings?.themeMode || 'both'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedCategory('database');
            setExpandedGuide('supabase-connection');
          }}
          className="btn btn-secondary"
          style={{ padding: '6px 14px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Database size={13} />
          <span>View Database Guide</span>
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides (e.g. database, vercel, permissions, social media, 3d)..."
            style={{
              width: '100%',
              padding: '0.75rem 0.75rem 0.75rem 2.25rem',
              backgroundColor: '#0c0f17',
              border: '1px solid var(--border-subtle)',
              borderRadius: '3px',
              color: '#F7F7F2',
              fontSize: '0.85rem',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Guides' },
            { id: 'how-to-edit', label: '📖 How to Edit Content' },
            { id: 'database', label: 'Database' },
            { id: 'cpanel', label: 'cPanel & BrackNodes' },
            { id: 'deployment', label: 'Deployment' },
            { id: 'team', label: 'Team Access' },
            { id: 'socials', label: 'Social Media' },
            { id: '3d-sandbox', label: '3D & Sandbox' },
            { id: 'themes', label: 'Themes' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className="mono"
              style={{
                padding: '6px 12px',
                borderRadius: '2px',
                border: `1px solid ${selectedCategory === cat.id ? 'var(--accent-lime)' : 'var(--border-subtle)'}`,
                backgroundColor: selectedCategory === cat.id ? 'rgba(199, 255, 107, 0.12)' : '#0c0f17',
                color: selectedCategory === cat.id ? 'var(--accent-lime)' : 'var(--text-secondary)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: selectedCategory === cat.id ? 700 : 400,
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Guides Accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
        {filteredGuides.map((guide) => {
          const isOpen = expandedGuide === guide.id;
          return (
            <div
              key={guide.id}
              className="card-surface"
              style={{
                borderRadius: '4px',
                border: `1px solid ${isOpen ? 'var(--border-medium)' : 'var(--border-subtle)'}`,
                overflow: 'hidden',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Accordion Header */}
              <div
                onClick={() => setExpandedGuide(isOpen ? null : guide.id)}
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  backgroundColor: isOpen ? '#131824' : '#11151f',
                  userSelect: 'none',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span
                      className="mono"
                      style={{
                        fontSize: '0.625rem',
                        padding: '2px 8px',
                        borderRadius: '2px',
                        backgroundColor: 'rgba(199, 255, 107, 0.12)',
                        color: 'var(--accent-lime)',
                        fontWeight: 700,
                      }}
                    >
                      {guide.badge}
                    </span>
                    <h3 style={{ fontSize: '1.05rem', margin: 0, color: '#F7F7F2' }}>
                      {guide.title}
                    </h3>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {guide.subtitle}
                  </p>
                </div>

                <div style={{ color: 'var(--text-muted)' }}>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              {/* Accordion Body */}
              {isOpen && (
                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-subtle)', backgroundColor: '#0c0f17' }}>
                  {guide.content}
                </div>
              )}
            </div>
          );
        })}

        {filteredGuides.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <p className="mono">No guides found matching &quot;{searchQuery}&quot;.</p>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* SUPPORT & FEEDBACK SECTION (NON-SKIPPABLE & ALWAYS-VISIBLE ADS)       */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section
        id="support-and-feedback"
        style={{
          marginTop: '3.5rem',
          paddingTop: '2.5rem',
          borderTop: '1px solid #1c2438',
        }}
      >
        {/* Section Heading */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              className="mono"
              style={{
                fontSize: '0.625rem',
                textTransform: 'uppercase',
                padding: '2px 8px',
                borderRadius: '2px',
                backgroundColor: 'rgba(199, 255, 107, 0.12)',
                color: 'var(--accent-lime)',
                fontWeight: 700,
                letterSpacing: '0.06em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Headphones size={12} /> OFFICIAL SUPPORT &amp; FEEDBACK
            </span>
            <span className="mono" style={{ fontSize: '0.6875rem', color: '#5E6980' }}>
              ● 24/7 ACTIVE ASSISTANCE
            </span>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 6px 0', color: '#FFFFFF' }}>
            Need Support or Want to Share Feedback?
          </h2>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#94A3B8', maxWidth: '780px', lineHeight: 1.5 }}>
            Have questions about your hosting setup, Discord bot configuration, database migrations, or custom deployments?
            Join our active Discord community or submit a ticket on the BrackNodes website. Our engineers are ready to assist you.
          </p>
        </div>

        {/* 2-Column Action Cards: Discord & Ticket Portal */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Card 1: Discord Community Support & Feedback */}
          <div
            className="card-surface"
            style={{
              padding: '1.75rem',
              borderRadius: '6px',
              backgroundColor: '#0d121e',
              border: '1px solid rgba(88, 101, 242, 0.35)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35), inset 0 0 20px rgba(88, 101, 242, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(88, 101, 242, 0.15)',
                    border: '1px solid rgba(88, 101, 242, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#5865F2',
                  }}
                >
                  <MessageSquare size={22} />
                </div>
                <span
                  className="mono"
                  style={{
                    fontSize: '0.625rem',
                    color: '#5865F2',
                    backgroundColor: 'rgba(88, 101, 242, 0.1)',
                    border: '1px solid rgba(88, 101, 242, 0.25)',
                    padding: '2px 8px',
                    borderRadius: '2px',
                    fontWeight: 700,
                  }}
                >
                  LIVE CHAT &amp; FEEDBACK
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 8px 0' }}>
                Join Discord for Support &amp; Feedback
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#94A3B8', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
                Connect with our active team of developers and community members. Share suggestions, report bugs, ask deployment questions, and receive instant real-time assistance.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1.5rem' }}>
                <div className="mono" style={{ fontSize: '0.71875rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={13} color="#5865F2" />
                  <span>Direct interaction with developers &amp; staff</span>
                </div>
                <div className="mono" style={{ fontSize: '0.71875rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={13} color="#5865F2" />
                  <span>Real-time node maintenance &amp; status alerts</span>
                </div>
                <div className="mono" style={{ fontSize: '0.71875rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={13} color="#5865F2" />
                  <span>Community help channels for Discord bots &amp; web apps</span>
                </div>
              </div>
            </div>

            <a
              href={discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: '#5865F2',
                color: '#FFFFFF',
                padding: '10px 18px',
                borderRadius: '4px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <span>Join Official Discord Server</span>
              <ExternalLink size={14} />
            </a>
          </div>

          {/* Card 2: Open Ticket on BrackNodes Website */}
          <div
            className="card-surface"
            style={{
              padding: '1.75rem',
              borderRadius: '6px',
              backgroundColor: '#0c121e',
              border: '1px solid rgba(199, 255, 107, 0.35)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35), inset 0 0 20px rgba(199, 255, 107, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(199, 255, 107, 0.12)',
                    border: '1px solid rgba(199, 255, 107, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-lime)',
                  }}
                >
                  <LifeBuoy size={22} />
                </div>
                <span
                  className="mono"
                  style={{
                    fontSize: '0.625rem',
                    color: 'var(--accent-lime)',
                    backgroundColor: 'rgba(199, 255, 107, 0.1)',
                    border: '1px solid rgba(199, 255, 107, 0.25)',
                    padding: '2px 8px',
                    borderRadius: '2px',
                    fontWeight: 700,
                  }}
                >
                  OFFICIAL HELP DESK
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 8px 0' }}>
                Open Ticket on BrackNodes Website
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#94A3B8', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
                Need server migration, custom database setup, billing assistance, or dedicated compute scaling? Submit a formal ticket on our portal for prioritized resolution.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1.5rem' }}>
                <div className="mono" style={{ fontSize: '0.71875rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={13} color="var(--accent-lime)" />
                  <span>Average ticket response under 15 minutes</span>
                </div>
                <div className="mono" style={{ fontSize: '0.71875rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={13} color="var(--accent-lime)" />
                  <span>Tier-2 infrastructure engineer assignment</span>
                </div>
                <div className="mono" style={{ fontSize: '0.71875rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={13} color="var(--accent-lime)" />
                  <span>Secure server credentials &amp; migration handling</span>
                </div>
              </div>
            </div>

            <a
              href="https://bracknodes.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: 'var(--accent-lime)',
                color: '#090B10',
                padding: '10px 18px',
                borderRadius: '4px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <span>Open Support Ticket on BrackNodes</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* NON-SKIPPABLE, ALWAYS VISIBLE BRACKNODES ADVERTISEMENT SHOWCASE     */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <div
          style={{
            padding: '2rem',
            backgroundColor: '#0a0e17',
            border: '1px solid rgba(199, 255, 107, 0.3)',
            borderRadius: '6px',
            position: 'relative',
            background: 'linear-gradient(135deg, rgba(10, 14, 23, 0.98) 0%, rgba(16, 24, 38, 0.95) 50%, rgba(10, 14, 23, 0.98) 100%)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(199, 255, 107, 0.03)',
          }}
        >
          {/* Header of Ad Banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span
                  className="mono"
                  style={{
                    fontSize: '0.625rem',
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: '2px',
                    backgroundColor: 'rgba(199, 255, 107, 0.15)',
                    color: 'var(--accent-lime)',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Zap size={10} /> SPONSORED CLOUD INFRASTRUCTURE
                </span>
                <span
                  className="mono"
                  style={{
                    fontSize: '0.625rem',
                    color: 'var(--accent-blue)',
                    backgroundColor: 'rgba(92, 179, 255, 0.1)',
                    border: '1px solid rgba(92, 179, 255, 0.25)',
                    padding: '2px 8px',
                    borderRadius: '2px',
                  }}
                >
                  PERMANENT HOSTING PARTNER
                </span>
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px 0', letterSpacing: '-0.01em' }}>
                ⚡ Deploy on BrackNodes High-Speed NVMe &amp; Bot Cloud
              </h3>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: '#94A3B8', maxWidth: '750px', lineHeight: 1.45 }}>
                Engineered for maximum speed and uptime. Whether you need an affordable cPanel portfolio hosting plan, a 24/7 continuous Discord bot server, or dedicated cloud VPS, BrackNodes delivers industry-leading latency and 99.99% reliability.
              </p>
            </div>

            <a
              href="https://bracknodes.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'var(--accent-lime)',
                color: '#090B10',
                padding: '9px 16px',
                borderRadius: '4px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 0 14px rgba(199, 255, 107, 0.25)',
              }}
            >
              <span>Visit BrackNodes.in</span>
              <ExternalLink size={13} />
            </a>
          </div>

          {/* 3 Hosting Products Grid (Non-skippable Ad Cards) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {/* Ad 1: Web Hosting */}
            <div
              style={{
                padding: '1.25rem',
                backgroundColor: '#070a11',
                border: '1px solid #1c2438',
                borderRadius: '4px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Server size={16} color="var(--accent-lime)" />
                    <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#F7F7F2' }}>
                      NVMe cPanel Hosting
                    </span>
                  </div>
                  <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--accent-lime)', fontWeight: 700 }}>
                    From ₹29/mo
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#8B97B0', lineHeight: 1.4, margin: '0 0 10px 0' }}>
                  Pure Enterprise NVMe SSD storage with lightning load speeds, free SSL, PHP/Node support, and unlimited bandwidth.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                  <span className="mono" style={{ fontSize: '0.65625rem', color: '#94A3B8' }}>• 100% NVMe SSD Storage</span>
                  <span className="mono" style={{ fontSize: '0.65625rem', color: '#94A3B8' }}>• Free AutoSSL &amp; Backups</span>
                  <span className="mono" style={{ fontSize: '0.65625rem', color: '#94A3B8' }}>• 1-Click Softaculous Apps</span>
                </div>
              </div>
              <a
                href="https://bracknodes.in"
                target="_blank"
                rel="noopener noreferrer"
                className="mono"
                style={{
                  fontSize: '0.71875rem',
                  color: 'var(--accent-lime)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 600,
                }}
              >
                <span>Deploy Web Hosting</span>
                <ArrowUpRight size={12} />
              </a>
            </div>

            {/* Ad 2: Discord Bot Hosting */}
            <div
              style={{
                padding: '1.25rem',
                backgroundColor: '#070a11',
                border: '1px solid #1c2438',
                borderRadius: '4px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Bot size={16} color="var(--accent-blue)" />
                    <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#F7F7F2' }}>
                      Discord Bot Hosting
                    </span>
                  </div>
                  <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--accent-blue)', fontWeight: 700 }}>
                    From ₹29/mo
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#8B97B0', lineHeight: 1.4, margin: '0 0 10px 0' }}>
                  Keep your bot online 24/7 on dedicated Pterodactyl panels. Zero sleeping, sub-15ms ping, and instant restarts.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                  <span className="mono" style={{ fontSize: '0.65625rem', color: '#94A3B8' }}>• Node.js, Python, Java &amp; Go</span>
                  <span className="mono" style={{ fontSize: '0.65625rem', color: '#94A3B8' }}>• 24/7 Always-On Pterodactyl</span>
                  <span className="mono" style={{ fontSize: '0.65625rem', color: '#94A3B8' }}>• Low Latency Asia-South Nodes</span>
                </div>
              </div>
              <a
                href="https://bracknodes.in"
                target="_blank"
                rel="noopener noreferrer"
                className="mono"
                style={{
                  fontSize: '0.71875rem',
                  color: 'var(--accent-blue)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 600,
                }}
              >
                <span>Deploy Bot Server</span>
                <ArrowUpRight size={12} />
              </a>
            </div>

            {/* Ad 3: DDoS Guarded Infrastructure */}
            <div
              style={{
                padding: '1.25rem',
                backgroundColor: '#070a11',
                border: '1px solid #1c2438',
                borderRadius: '4px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={16} color="var(--accent-lime)" />
                    <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#F7F7F2' }}>
                      Anti-DDoS Shield
                    </span>
                  </div>
                  <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--accent-lime)', fontWeight: 700 }}>
                    99.99% SLA
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#8B97B0', lineHeight: 1.4, margin: '0 0 10px 0' }}>
                  Enterprise Layer 3/4/7 volumetric attack mitigation filters hostile traffic with zero downtime for your apps.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                  <span className="mono" style={{ fontSize: '0.65625rem', color: '#94A3B8' }}>• Advanced Traffic Scrubbing</span>
                  <span className="mono" style={{ fontSize: '0.65625rem', color: '#94A3B8' }}>• 1Gbps Redundant Network Uplinks</span>
                  <span className="mono" style={{ fontSize: '0.65625rem', color: '#94A3B8' }}>• 24/7 Human Security Team</span>
                </div>
              </div>
              <a
                href="https://bracknodes.in"
                target="_blank"
                rel="noopener noreferrer"
                className="mono"
                style={{
                  fontSize: '0.71875rem',
                  color: 'var(--accent-lime)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 600,
                }}
              >
                <span>View Infrastructure</span>
                <ArrowUpRight size={12} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

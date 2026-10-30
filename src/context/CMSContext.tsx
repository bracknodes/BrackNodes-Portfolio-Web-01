import React, { createContext, useContext, useEffect, useLayoutEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { PORTFOLIO_DATA } from '../data/portfolio';
import type {
  SiteSettings,
  Project,
  Service,
  SkillCategory,
  ProcessStep,
  Testimonial,
  ExperienceItem,
  ContactInquiry,
  MediaAsset,
  DesignTheme,
  TypographySettings,
  FontItem,
  CustomCodeSettings,
  SocialLinkItem,
  Collaborator,
  SystemUpdateInfo,
} from '../types/cms';

export const CURRENT_APP_VERSION = '2.0.0';
const VERSION_STORAGE_KEY = 'bracknodes_portfolio_cms_version';
const PRE_UPDATE_BACKUP_KEY = 'bracknodes_portfolio_cms_pre_update_backup';

interface CMSContextType {
  siteSettings: SiteSettings;
  projects: Project[];
  services: Service[];
  skills: SkillCategory[];
  processSteps: ProcessStep[];
  testimonials: Testimonial[];
  experience: ExperienceItem[];
  inquiries: ContactInquiry[];
  media: MediaAsset[];
  isLoading: boolean;
  isSaving: boolean;
  lastSaved: string | null;
  isLiveSupabase: boolean;

  // Mutators
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  saveProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  duplicateProject: (id: string) => Promise<void>;
  reorderProjects: (projects: Project[]) => Promise<void>;
  toggleProjectPublish: (id: string) => Promise<void>;

  saveService: (service: Service) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  toggleServicePublish: (id: string) => Promise<void>;

  saveSkillCategory: (categoryIndex: number, category: SkillCategory) => Promise<void>;
  addSkillCategory: (category: SkillCategory) => Promise<void>;
  deleteSkillCategory: (categoryIndex: number) => Promise<void>;
  updateSkillCategoryInfo: (categoryIndex: number, name: string, description: string) => Promise<void>;
  addSkillToCategory: (categoryIndex: number, skill: { name: string; tag: string }) => Promise<void>;
  removeSkillFromCategory: (categoryIndex: number, skillName: string) => Promise<void>;

  saveProcessStep: (step: ProcessStep) => Promise<void>;
  deleteProcessStep: (id: string) => Promise<void>;

  saveTestimonial: (testimonial: Testimonial) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  toggleTestimonialPublish: (id: string) => Promise<void>;

  saveExperience: (item: ExperienceItem) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;

  submitInquiry: (inquiry: Omit<ContactInquiry, 'id' | 'createdAt' | 'status'>) => Promise<{ success: boolean; error?: string }>;
  updateInquiryStatus: (id: string, status: ContactInquiry['status']) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;

  uploadMedia: (file: File) => Promise<MediaAsset | null>;
  deleteMedia: (id: string) => Promise<void>;

  // Collaborators & Access Control
  addCollaborator: (collab: Omit<Collaborator, 'id' | 'invitedAt'>) => Promise<void>;
  updateCollaborator: (id: string, updates: Partial<Collaborator>) => Promise<void>;
  deleteCollaborator: (id: string) => Promise<void>;

  // Dynamic Social Links
  addSocialLink: (link: Omit<SocialLinkItem, 'id'>) => Promise<void>;
  updateSocialLink: (id: string, updates: Partial<SocialLinkItem>) => Promise<void>;
  deleteSocialLink: (id: string) => Promise<void>;

  // System Version & Updates
  currentAppVersion: string;
  updateInfo: SystemUpdateInfo | null;
  isCheckingUpdates: boolean;
  checkSystemUpdates: () => Promise<SystemUpdateInfo>;
  triggerAutoDeploy: () => Promise<{ success: boolean; message: string }>;
  createPreUpdateBackup: () => string;
  runDataPreservationMigration: () => { backedUp: boolean; message: string };

  applyTheme: (theme: DesignTheme) => void;
  applyTypography: (typography: TypographySettings) => void;
  applyCustomCode: (customCode: CustomCodeSettings) => void;
  resetToDefaults: () => void;
  exportCMSData: () => string;
  importCMSData: (jsonStr: string) => boolean;
}

const STORAGE_KEY = 'bracknodes_portfolio_cms_v2';

const defaultCustomFonts: FontItem[] = [
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
];

const defaultTypography: TypographySettings = {
  customFonts: defaultCustomFonts,
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

const defaultTheme: DesignTheme = {
  primaryAccent: '#C7FF6B',
  secondaryAccent: '#70B9FF',
  bgPrimary: '#090B10',
  bgElevated: '#11151F',
  textPrimary: '#F7F7F2',
  textSecondary: '#9FA8BC',
  borderRadius: '3px',
  themeName: 'Cyber Dark Lime',
};

const defaultSettings: SiteSettings = {
  brandName: PORTFOLIO_DATA.identity.name,
  wordmark: PORTFOLIO_DATA.identity.wordmark,
  role: PORTFOLIO_DATA.identity.role,
  tagline: PORTFOLIO_DATA.identity.tagline,
  subheading: PORTFOLIO_DATA.identity.subheading,
  statusBadge: PORTFOLIO_DATA.identity.status,
  location: PORTFOLIO_DATA.identity.location,
  email: PORTFOLIO_DATA.identity.email,
  socials: {
    github: 'https://github.com/bracknodes',
    linkedin: 'https://www.linkedin.com/company/bracknodes',
    instagram: 'https://www.instagram.com/bracknodes',
    x: 'https://x.com/bracknodes',
  },
  socialLinks: [
    {
      id: 'soc-github',
      platform: 'github',
      label: 'GitHub',
      url: 'https://github.com/bracknodes',
      color: 'var(--accent-lime)',
      isEnabled: true,
    },
    {
      id: 'soc-linkedin',
      platform: 'linkedin',
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/company/bracknodes',
      color: 'var(--accent-blue)',
      isEnabled: true,
    },
    {
      id: 'soc-instagram',
      platform: 'instagram',
      label: 'Instagram',
      url: 'https://www.instagram.com/bracknodes',
      color: '#E1306C',
      isEnabled: true,
    },
    {
      id: 'soc-x',
      platform: 'x',
      label: 'X / Twitter',
      url: 'https://x.com/bracknodes',
      color: 'var(--text-primary)',
      isEnabled: true,
    },
  ],
  collaborators: [
    {
      id: 'collab-owner',
      name: 'Primary Administrator',
      email: PORTFOLIO_DATA.identity.email || 'contact@ankit.dev',
      role: 'admin',
      permissions: {
        canManageProjects: true,
        canManageServices: true,
        canManageSkills: true,
        canManageContent: true,
        canViewInquiries: true,
        canManageInquireForm: true,
        canManageDesign: true,
        canManageMedia: true,
        canManageSecurity: true,
      },
      status: 'active',
      invitedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    },
  ],
  seo: {
    title: 'BrackNodes — High-Speed Cloud & Discord Bot Hosting',
    description: 'India’s leading affordable cloud hosting provider. 24/7 Discord Bot Hosting, NVMe cPanel Web Hosting, and low-latency Cloud VPS starting at just ₹29/month.',
    canonicalDomain: 'https://bracknodes.in',
    keywords: 'discord bot hosting india, cpanel hosting india, cheap cloud vps, nvme web hosting, pterodactyl bot hosting, nodejs bot hosting, python bot hosting, low latency server india, bracknodes, bracknodes.in',
    ogImage: 'https://bracknodes.in/og-preview.png',
    starterPrice: '29',
    currency: 'INR',
    customRobotsTxt: `# BrackNodes Robots & Crawler Policy
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /login/

Sitemap: https://bracknodes.in/sitemap.xml`,
    faqItems: [
      {
        id: 'faq-1',
        question: 'What hosting services does BrackNodes offer?',
        answer: 'BrackNodes offers 24/7 Discord Bot Hosting on high-performance Pterodactyl panels, lightning-fast NVMe cPanel Web Hosting with free SSL and automated backups, and scalable low-latency Cloud VPS compute starting at just ₹29/month.',
      },
      {
        id: 'faq-2',
        question: 'How much does Discord bot hosting cost on BrackNodes?',
        answer: 'Discord bot hosting plans at BrackNodes start at only ₹29/month with automated instant 60-second activation, DDoS protection, and 99.99% uptime guarantee.',
      },
      {
        id: 'faq-3',
        question: 'Does BrackNodes provide cPanel Web Hosting?',
        answer: 'Yes, BrackNodes provides NVMe SSD cPanel hosting complete with free SSL certificates, automated daily backups, Softaculous 1-click app installer, and 24/7 technical support.',
      },
      {
        id: 'faq-4',
        question: 'How fast is server provisioning at BrackNodes?',
        answer: 'All server and bot hosting plans are provisioned instantly through our automated orchestration system within 60 seconds of order confirmation.',
      },
    ],
  },
  footerText: 'BrackNodes provides high-performance NVMe cPanel web hosting, 24/7 Discord bot hosting on Pterodactyl panels, and low-latency cloud servers engineered for developers and communities starting at ₹29/month.',
  copyrightText: '© ' + new Date().getFullYear() + ' BRACKNODES. ALL RIGHTS RESERVED.',
  navVisibility: {
    work: true,
    about: true,
    services: true,
    skills: true,
    process: true,
    testimonials: true,
    experience: true,
    contact: true,
  },
  designTheme: defaultTheme,
  adminPath: 'admin',
  inquireForm: {
    sectionTag: '07 // Host With BrackNodes',
    sectionTitle: 'GET IN TOUCH',
    sectionSubtitle: "Need a custom cloud deployment, Discord bot hosting, or migration help? Talk to our team.",
    pitchHeadline: 'Enterprise-grade hosting with direct human support.',
    pitchDescription: 'Have questions regarding our NVMe web hosting, Discord bot plans, or dedicated compute? Reach out anytime. Our technical support team is available 24/7.',
    projectTypes: [
      'Discord Bot Hosting',
      'cPanel Web Hosting',
      'Cloud VPS / Dedicated',
      'Server Migration',
      'Enterprise / Custom Solution',
    ],
    budgetOptions: ['₹29 – ₹99 /mo', '₹99 – ₹299 /mo', '₹299 – ₹999 /mo', '₹999+ /mo'],
    submitButtonText: 'Send Inquiry',
    successMessage: 'Thank you! Your inquiry has been received. Our team will review your requirements and respond shortly.',
    responseSla: '24/7 SUPPORT RESPONSE',
    confidentialityNotice: '99.99% UPTIME GUARANTEE',
    nameLabel: 'YOUR NAME *',
    namePlaceholder: 'e.g. Alex Sharma',
    emailLabel: 'EMAIL ADDRESS *',
    emailPlaceholder: 'e.g. alex@bracknodes.in',
    projectFocusLabel: 'SERVICE / HOSTING FOCUS',
    budgetLabel: 'APPROXIMATE BUDGET (OPTIONAL)',
    messageLabel: 'SERVER REQUIREMENTS & SPECIFICATIONS *',
    messagePlaceholder: "Describe your server specifications (RAM, CPU cores, expected player count or bot workload), or migration requirements...",
    disclaimerText: '* 24/7 technical support. Zero spam, 99.99% uptime guarantee.',
  },
  typography: defaultTypography,
  customCode: {
    isEnabled: true,
    customCss: `/* ===================================================
   Custom CSS Stylesheet (Live Injected)
   =================================================== */

/* Custom Scrollbar */
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
// console.log('BrackNodes scripts initialized');
`,
    bodyJs: `// Custom <body> JavaScript
// console.log('BrackNodes page loaded');
`,
  },
  themeSettings: {
    themeMode: 'both',
    defaultTheme: 'dark',
  },
  logoSettings: {
    mode: 'icon-wordmark',
    imageUrl: '',
    darkImageUrl: '',
    lightImageUrl: '',
    heightPx: 34,
    altText: 'BrackNodes Logo',
    showInNavbar: true,
    showInFooter: true,
  },
  updateSettings: {
    githubRepo: 'bracknodes/web-1',
    autoCheckUpdates: true,
  },
  hero3D: {
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
  sectionHeadings: {
    about: {
      tag: '02 // Platform Overview',
      title: 'WHY CHOOSE BRACKNODES',
      subtitle: 'High-availability NVMe cloud architecture, 99.99% uptime SLA, and India’s most budget-friendly server infrastructure.',
    },
    projects: {
      tag: '01 // Hosting Plans',
      title: 'FEATURED HOSTING TIERS',
      subtitle: 'High-performance Discord bot hosting, pure NVMe cPanel packages, and scalable cloud compute engineered for reliability.',
      filterTabs: [
        { id: 'tab-all', label: 'All', key: 'All' },
        { id: 'tab-discord', label: 'Discord Bots', key: 'Discord' },
        { id: 'tab-cpanel', label: 'cPanel Hosting', key: 'cPanel' },
        { id: 'tab-vps', label: 'Cloud VPS', key: 'Cloud' },
      ],
    },
    services: {
      tag: '03 // Cloud Infrastructure',
      title: 'HOSTING CAPABILITIES',
      subtitle: 'Engineered hosting solutions tailored to developers, gaming communities, and high-growth digital brands.',
    },
    skills: {
      tag: '04 // Hardware & Stack',
      title: 'INFRASTRUCTURE STACK',
      subtitle: 'Modern enterprise hardware, industry-standard virtualization, and low-latency network uplinks.',
    },
    process: {
      tag: '05 // Instant Setup Workflow',
      title: 'PROVISIONING PROCESS',
      subtitle: 'From plan selection to full deployment in less than 60 seconds with automated instant activation.',
    },
    testimonials: {
      tag: '06 // Community Feedback',
      title: 'CUSTOMER REVIEWS',
      subtitle: 'Verified testimonials from Discord bot developers, community owners, and webmasters hosting on BrackNodes.',
    },
    experience: {
      tag: '07 // Network & Growth',
      title: 'DATACENTER MILESTONES',
      subtitle: 'Continuous infrastructure expansions delivering lower latencies and higher uptime across South Asia.',
    },
    contact: {
      tag: '08 // Connect With Us',
      title: 'START YOUR HOSTING',
      subtitle: 'Ready to host your web application or Discord bot? Deploy in seconds or speak with our infrastructure specialists.',
    },
  },
  heroSettings: {
    primaryCtaText: 'View Hosting Plans',
    primaryCtaLink: '#projects',
    secondaryCtaText: 'Get Started Now',
    secondaryCtaLink: '#contact',
    marqueeItems: [
      'DISCORD BOT HOSTING',
      'NVME CPANEL HOSTING',
      '99.99% UPTIME SLA',
      'PTERODACTYL PANEL',
      'DDOS SHIELD PROTECTION',
      'CLOUD VPS COMPUTE',
      'STARTING AT ₹29/MO',
      '24/7 TECHNICAL SUPPORT',
    ],
    stats: [
      { value: '₹29/mo', label: 'Starter Price' },
      { value: '99.99%', label: 'Uptime SLA' },
      { value: '< 15ms', label: 'India Latency' },
      { value: '24/7/365', label: 'Active Support' },
    ],
  },
  navbarSettings: {
    workLabel: 'Plans',
    aboutLabel: 'About',
    servicesLabel: 'Services',
    skillsLabel: 'Stack',
    processLabel: 'Process',
    contactLabel: 'Contact',
    ctaText: 'Get Started',
    ctaLink: '#contact',
  },
  aboutSettings: {
    narrativeHeading: 'Enterprise cloud performance at prices everyone can afford.',
    narrativeParagraph1: 'BrackNodes was engineered to eliminate overpriced hosting in India. We provide developers, gaming communities, and businesses with reliable cloud solutions starting from just ₹29/month, backed by tier-1 low-latency networking.',
    narrativeParagraph2: 'From lightweight Discord bots running on high-performance Pterodactyl panels to high-traffic WordPress websites powered by pure NVMe SSDs and cPanel, we keep your digital services active 24/7 with zero sleep cycles.',
    stats: [
      { value: '₹29/mo', label: 'Starting Price', sub: 'Most Affordable in India' },
      { value: '99.99%', label: 'Guaranteed Uptime', sub: 'High Availability Nodes' },
      { value: '10 Gbps+', label: 'Anti-DDoS Shield', sub: 'Always-On Mitigation' },
      { value: '100% Pure', label: 'Enterprise NVMe', sub: 'High IOPS Read/Write' },
    ],
    pillars: [
      { title: 'Zero-Sleep Uptime', text: 'Continuous 24/7 availability for your Discord bots and web applications powered by high-availability NVMe nodes.' },
      { title: 'Pure NVMe Performance', text: 'Enterprise NVMe SSD drives deliver up to 10x faster I/O speed than conventional SATA or HDD hosting.' },
      { title: 'Honest & Transparent', text: 'India\'s most affordable developer-friendly hosting with transparent renewals, starting at just ₹29/month with zero hidden charges.' },
      { title: 'Direct Human Support', text: 'Round-the-clock technical support via Discord community and rapid ticketing whenever you need assistance.' },
    ],
    terminalPrompt: 'root@bracknodes-node01:~$ ',
    terminalLines: [
      { key: 'DATACENTER_NODES', val: 'Asia-South1 (India Tier-3 Facilities)' },
      { key: 'DDOS_MITIGATION', val: '10Gbps+ L3/L4/L7 Auto Shield' },
      { key: 'HARDWARE_PROFILE', val: 'Enterprise Multi-Core + Pure NVMe SSDs' },
      { key: 'SUPPORT_SLA', val: '24/7 Discord Ticket & Ticket Portal' },
    ],
  },
  architectureNotes: [
    {
      title: 'Pterodactyl Daemon (Wings) Runtime',
      code: '// High-density containerized Discord Bot isolation\ndocker run -d --name pterodactyl-wings --restart=always \\\n  -v /var/lib/pterodactyl/:/var/lib/pterodactyl/ \\\n  -v /var/run/docker.sock:/var/run/docker.sock ...',
    },
    {
      title: 'NVMe I/O Performance Benchmark',
      code: '// Enterprise NVMe read/write speed benchmark\nfio --name=randwrite --ioengine=libaio --iodepth=1 \\\n  --rw=randwrite --bs=4k --direct=1 --size=256M \\\n  // Result: 450,000+ IOPS sustained write',
    },
    {
      title: 'Automated Anycast Anti-DDoS Filter',
      code: '// Real-time edge packet filtering & rate limiting\niptables -A PREROUTING -p udp -m length --length 0:28 -j DROP\niptables -A INPUT -p tcp --dport 80,443 -m connlimit ...',
    },
    {
      title: 'cPanel Instant Provisioning Pipeline',
      code: '// Instant provisioning via WHM API v1\nwhmapi1 createacct username=client domain=app.in \\\n  plan=NVMe-Starter ssl=1 ip=dedicated ...',
    },
  ],
  footerSettings: {
    statusBadgeText: 'ALL SYSTEMS OPERATIONAL — 99.99% UPTIME',
    backToTopText: 'Back to Top',
  },
};

const defaultProjects: Project[] = PORTFOLIO_DATA.projects.map((p, i) => ({
  ...p,
  slug: p.id,
  displayOrder: i,
  isPublished: true,
}));

const defaultServices: Service[] = PORTFOLIO_DATA.services.map((s, i) => ({
  ...s,
  displayOrder: i,
  isPublished: true,
}));

const defaultProcessSteps: ProcessStep[] = PORTFOLIO_DATA.process.map((step, i) => ({
  id: `step-${step.step}`,
  step: step.step,
  title: step.title,
  phase: step.phase,
  description: step.description,
  outputs: step.outputs,
  displayOrder: i,
}));

const defaultTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Rohan Verma',
    role: 'Lead Developer',
    company: 'Nexus Bot Community',
    content:
      'BrackNodes has kept our 10,000+ member Discord bot online 24/7 without a single crash. The Pterodactyl panel is super responsive, and at ₹29/mo it is truly unbeatable value in India.',
    rating: 5,
    isPublished: true,
    displayOrder: 0,
  },
  {
    id: 'test-2',
    name: 'Aman Sharma',
    role: 'Founder & Tech Lead',
    company: 'CodeCraft Web Agency',
    content:
      'Migrated 12 client WordPress websites to BrackNodes NVMe cPanel hosting. TTFB dropped below 200ms instantly and page load times are blazing fast. Exceptional 24/7 support!',
    rating: 5,
    isPublished: true,
    displayOrder: 1,
  },
  {
    id: 'test-3',
    name: 'Priya Patel',
    role: 'Infrastructure Architect',
    company: 'IndieDevs India',
    content:
      'The lowest ping server nodes in India! Full root VPS access and DDoS mitigation worked out of the box with zero downtime during traffic spikes. Highly recommended.',
    rating: 5,
    isPublished: true,
    displayOrder: 2,
  },
];

function getInitialCachedPayload(): any {
  if (typeof window === 'undefined') return null;
  try {
    // If legacy storage keys exist with old Ankit template data, purge them
    const legacyKeys = ['ankit_portfolio_cms_v1', 'ankit_portfolio_cms_version'];
    legacyKeys.forEach((key) => {
      try {
        const legacy = localStorage.getItem(key);
        if (legacy && (legacy.includes('ANKIT') || legacy.includes('IDEAS INTO DIGITAL REALITY.'))) {
          localStorage.removeItem(key);
        }
      } catch {
        // ignore
      }
    });

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed?.siteSettings?.brandName?.toUpperCase().includes('ANKIT') ||
      parsed?.siteSettings?.tagline === 'IDEAS INTO DIGITAL REALITY.'
    ) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch (e) {
    console.warn('Error reading local CMS cache:', e);
    return null;
  }
}

function getInitialSiteSettings(): SiteSettings {
  const cached = getInitialCachedPayload();
  if (!cached || !cached.siteSettings) return defaultSettings;

  const parsed = cached.siteSettings;
  if (
    !parsed.brandName ||
    parsed.brandName.toUpperCase().includes('ANKIT') ||
    parsed.tagline === 'IDEAS INTO DIGITAL REALITY.'
  ) {
    return defaultSettings;
  }

  const mergedSocials = {
    github: !parsed.socials?.github || parsed.socials?.github === 'https://github.com'
      ? 'https://github.com/bracknodes'
      : parsed.socials.github,
    linkedin: !parsed.socials?.linkedin || parsed.socials?.linkedin === 'https://linkedin.com'
      ? 'https://www.linkedin.com/company/bracknodes'
      : parsed.socials.linkedin,
    instagram: parsed.socials?.instagram || 'https://www.instagram.com/bracknodes',
    x: !parsed.socials?.x || parsed.socials?.x === 'https://twitter.com'
      ? 'https://x.com/bracknodes'
      : parsed.socials.x,
  };

  const mergedSocialLinks = parsed.socialLinks && parsed.socialLinks.length > 0
    ? parsed.socialLinks
    : defaultSettings.socialLinks;

  const mergedCollaborators = parsed.collaborators && parsed.collaborators.length > 0
    ? parsed.collaborators
    : defaultSettings.collaborators;

  const mergedUpdateSettings = {
    ...defaultSettings.updateSettings,
    ...(parsed.updateSettings || {}),
  };

  const mergedThemeSettings = {
    ...defaultSettings.themeSettings,
    ...(parsed.themeSettings || {}),
  };

  const mergedHero3D = {
    ...defaultSettings.hero3D,
    ...(parsed.hero3D || {}),
  };

  const mergedSectionHeadings = {
    ...defaultSettings.sectionHeadings,
    ...(parsed.sectionHeadings || {}),
  };

  const mergedHeroSettings = {
    ...defaultSettings.heroSettings,
    ...(parsed.heroSettings || {}),
  };

  const mergedNavbarSettings = {
    ...defaultSettings.navbarSettings,
    ...(parsed.navbarSettings || {}),
  };

  const mergedAboutSettings = {
    ...defaultSettings.aboutSettings,
    ...(parsed.aboutSettings || {}),
  };

  const mergedArchNotes = parsed.architectureNotes && parsed.architectureNotes.length > 0
    ? parsed.architectureNotes
    : defaultSettings.architectureNotes;

  const mergedFooterSettings = {
    ...defaultSettings.footerSettings,
    ...(parsed.footerSettings || {}),
  };

  const mergedCustomCode = parsed.customCode
    ? {
        ...defaultSettings.customCode,
        ...parsed.customCode,
        customCss: (parsed.customCode.customCss || '')
          .replace(/::selection\s*\{[^}]*\}/g, '')
          .replace(/::-moz-selection\s*\{[^}]*\}/g, ''),
      }
    : defaultSettings.customCode;

  const mergedLogoSettings = {
    ...defaultSettings.logoSettings,
    ...(parsed.logoSettings || {}),
  };

  return {
    ...defaultSettings,
    ...parsed,
    socials: mergedSocials,
    socialLinks: mergedSocialLinks,
    collaborators: mergedCollaborators,
    themeSettings: mergedThemeSettings,
    logoSettings: mergedLogoSettings,
    updateSettings: mergedUpdateSettings,
    hero3D: mergedHero3D,
    sectionHeadings: mergedSectionHeadings,
    heroSettings: mergedHeroSettings,
    navbarSettings: mergedNavbarSettings,
    aboutSettings: mergedAboutSettings,
    architectureNotes: mergedArchNotes,
    footerSettings: mergedFooterSettings,
    customCode: mergedCustomCode,
  };
}

function getInitialProjects(): Project[] {
  const cached = getInitialCachedPayload();
  if (cached && Array.isArray(cached.projects) && cached.projects.length > 0) {
    const hasOldMetricsOrTypo = cached.projects.some(
      (p: Project) =>
        p.metrics?.some((m) => m.label?.toUpperCase().includes('FRAME RATE')) ||
        p.title?.toLowerCase().includes('hostins') ||
        p.id === 'synthwave-audio-engine'
    );
    if (!hasOldMetricsOrTypo) {
      return cached.projects;
    }
  }
  return defaultProjects;
}

function getInitialServices(): Service[] {
  const cached = getInitialCachedPayload();
  if (cached && Array.isArray(cached.services) && cached.services.length > 0) {
    return cached.services;
  }
  return defaultServices;
}

function getInitialSkills(): SkillCategory[] {
  const cached = getInitialCachedPayload();
  if (cached && Array.isArray(cached.skills) && cached.skills.length > 0) {
    return cached.skills;
  }
  return PORTFOLIO_DATA.skills;
}

function getInitialProcessSteps(): ProcessStep[] {
  const cached = getInitialCachedPayload();
  if (cached && Array.isArray(cached.processSteps) && cached.processSteps.length > 0) {
    return cached.processSteps;
  }
  return defaultProcessSteps;
}

function getInitialTestimonials(): Testimonial[] {
  const cached = getInitialCachedPayload();
  if (cached && Array.isArray(cached.testimonials) && cached.testimonials.length > 0) {
    const hasOldAnkitTestimonials = cached.testimonials.some(
      (t: Testimonial) => t.content?.toLowerCase().includes('ankit') || t.company === 'Vanguard Interactive'
    );
    if (!hasOldAnkitTestimonials) {
      return cached.testimonials;
    }
  }
  return defaultTestimonials;
}

function getInitialExperience(): ExperienceItem[] {
  const cached = getInitialCachedPayload();
  if (cached && Array.isArray(cached.experience)) {
    return cached.experience;
  }
  return [];
}

function getInitialInquiries(): ContactInquiry[] {
  const cached = getInitialCachedPayload();
  if (cached && Array.isArray(cached.inquiries)) {
    return cached.inquiries;
  }
  return [];
}

function getInitialMedia(): MediaAsset[] {
  const cached = getInitialCachedPayload();
  if (cached && Array.isArray(cached.media)) {
    return cached.media;
  }
  return [];
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isLive = isSupabaseConfigured();

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(getInitialSiteSettings);
  const [projects, setProjects] = useState<Project[]>(getInitialProjects);
  const [services, setServices] = useState<Service[]>(getInitialServices);
  const [skills, setSkills] = useState<SkillCategory[]>(getInitialSkills);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>(getInitialProcessSteps);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(getInitialTestimonials);
  const [experience, setExperience] = useState<ExperienceItem[]>(getInitialExperience);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>(getInitialInquiries);
  const [media, setMedia] = useState<MediaAsset[]>(getInitialMedia);

  const [isLoading, setIsLoading] = useState<boolean>(() => isLive);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [updateInfo, setUpdateInfo] = useState<SystemUpdateInfo | null>(null);
  const [isCheckingUpdates, setIsCheckingUpdates] = useState<boolean>(false);

  // Loads referenced Google fonts dynamically into <head>
  const loadGoogleFonts = (fontFamilies: string[]) => {
    if (typeof document === 'undefined') return;
    const fontNames = Array.from(
      new Set(
        fontFamilies
          .map((f) => {
            const match = f.match(/['"]?([^,'"]+)['"]?/);
            return match ? match[1].trim() : '';
          })
          .filter((name) => name && !['sans-serif', 'serif', 'monospace', 'display', 'cursive', 'system-ui', 'inherit'].includes(name.toLowerCase()))
      )
    );

    if (fontNames.length === 0) return;

    const fontParams = fontNames
      .map((name) => `family=${encodeURIComponent(name)}:wght@300;400;500;600;700;800`)
      .join('&');

    const url = `https://fonts.googleapis.com/css2?${fontParams}&display=swap`;

    let linkTag = document.getElementById('dynamic-google-fonts') as HTMLLinkElement | null;
    if (!linkTag) {
      linkTag = document.createElement('link');
      linkTag.id = 'dynamic-google-fonts';
      linkTag.rel = 'stylesheet';
      document.head.appendChild(linkTag);
    }
    if (linkTag.href !== url) {
      linkTag.href = url;
    }
  };

  // Applies section-level font tokens as CSS custom properties
  const applyTypography = useCallback((typo: TypographySettings) => {
    if (typeof document === 'undefined' || !typo?.sectionFonts) return;
    const root = document.documentElement;
    const sf = typo.sectionFonts;

    const resolveFont = (f?: string) => {
      if (!f || f.toLowerCase().includes('syne')) return "'Plus Jakarta Sans', sans-serif";
      return f;
    };

    if (sf.globalBody) root.style.setProperty('--font-body', resolveFont(sf.globalBody));
    root.style.setProperty('--font-display', resolveFont(sf.globalHeading));
    if (sf.globalMono) root.style.setProperty('--font-mono', sf.globalMono);

    if (sf.navbar) root.style.setProperty('--font-section-navbar', sf.navbar);
    if (sf.hero) root.style.setProperty('--font-section-hero', resolveFont(sf.hero));
    root.style.setProperty('--font-section-hero-title', resolveFont(sf.heroTitle));
    if (sf.projects) root.style.setProperty('--font-section-projects', resolveFont(sf.projects));
    if (sf.about) root.style.setProperty('--font-section-about', resolveFont(sf.about));
    if (sf.services) root.style.setProperty('--font-section-services', resolveFont(sf.services));
    if (sf.skills) root.style.setProperty('--font-section-skills', resolveFont(sf.skills));
    if (sf.process) root.style.setProperty('--font-section-process', resolveFont(sf.process));
    if (sf.testimonials) root.style.setProperty('--font-section-testimonials', resolveFont(sf.testimonials));
    if (sf.contact) root.style.setProperty('--font-section-contact', resolveFont(sf.contact));
    if (sf.footer) root.style.setProperty('--font-section-footer', sf.footer);

    const allFamilies = [
      ...Object.values(sf),
      ...(typo.customFonts || []).map((f) => f.family),
    ]
      .map(resolveFont)
      .filter((f) => !f.toLowerCase().includes('syne'));
    loadGoogleFonts(allFamilies);
  }, []);

  // Applies active theme tokens as CSS variables
  const applyTheme = useCallback((theme: DesignTheme) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    // Only set custom dark theme colors if not currently in light mode override
    const isLightMode = root.getAttribute('data-theme') === 'light';
    if (!isLightMode) {
      if (theme.primaryAccent) root.style.setProperty('--accent-lime', theme.primaryAccent);
      if (theme.secondaryAccent) root.style.setProperty('--accent-blue', theme.secondaryAccent);
      if (theme.bgPrimary) root.style.setProperty('--bg-primary', theme.bgPrimary);
      if (theme.bgElevated) root.style.setProperty('--bg-elevated', theme.bgElevated);
      if (theme.textPrimary) root.style.setProperty('--text-primary', theme.textPrimary);
      if (theme.textSecondary) root.style.setProperty('--text-secondary', theme.textSecondary);
    }
  }, []);

  // Dynamically injects or updates custom CSS and scripts
  const applyCustomCode = useCallback((code: CustomCodeSettings) => {
    if (typeof document === 'undefined') return;

    // 1. Inject / update Custom CSS into <head>
    let styleTag = document.getElementById('cms-custom-css') as HTMLStyleElement | null;
    if (code?.isEnabled && code.customCss?.trim()) {
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'cms-custom-css';
        document.head.appendChild(styleTag);
      }
      const sanitizedCss = code.customCss
        .replace(/::selection\s*\{[^}]*\}/g, '')
        .replace(/::-moz-selection\s*\{[^}]*\}/g, '');
      styleTag.textContent = sanitizedCss;
    } else {
      if (styleTag) {
        styleTag.remove();
      }
    }

    // 2. Safe execution of Custom JS (only on public non-admin routes to protect admin integrity)
    const isInsideAdmin =
      window.location.pathname.includes('/admin') ||
      window.location.pathname.includes('/login') ||
      window.location.hash.includes('/admin') ||
      window.location.hash.includes('/login');

    if (!isInsideAdmin && code?.isEnabled) {
      if (code.headJs?.trim()) {
        let headScript = document.getElementById('cms-custom-head-js') as HTMLScriptElement | null;
        if (headScript) headScript.remove();
        headScript = document.createElement('script');
        headScript.id = 'cms-custom-head-js';
        headScript.textContent = `try {\n${code.headJs}\n} catch(err) { console.error('Custom Head Script Error:', err); }`;
        document.head.appendChild(headScript);
      } else {
        const headScript = document.getElementById('cms-custom-head-js');
        if (headScript) headScript.remove();
      }

      if (code.bodyJs?.trim()) {
        let bodyScript = document.getElementById('cms-custom-body-js') as HTMLScriptElement | null;
        if (bodyScript) bodyScript.remove();
        bodyScript = document.createElement('script');
        bodyScript.id = 'cms-custom-body-js';
        bodyScript.textContent = `try {\n${code.bodyJs}\n} catch(err) { console.error('Custom Body Script Error:', err); }`;
        document.body.appendChild(bodyScript);
      } else {
        const bodyScript = document.getElementById('cms-custom-body-js');
        if (bodyScript) bodyScript.remove();
      }
    } else if (!code?.isEnabled || isInsideAdmin) {
      const headScript = document.getElementById('cms-custom-head-js');
      if (headScript) headScript.remove();
      const bodyScript = document.getElementById('cms-custom-body-js');
      if (bodyScript) bodyScript.remove();
    }
  }, []);

  // Save current state to local storage backup
  const persistLocally = useCallback((data: {
    siteSettings: SiteSettings;
    projects: Project[];
    services: Service[];
    skills: SkillCategory[];
    processSteps: ProcessStep[];
    testimonials: Testimonial[];
    experience: ExperienceItem[];
    inquiries: ContactInquiry[];
    media: MediaAsset[];
  }) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setLastSaved(new Date().toLocaleTimeString());
    } catch (e) {
      console.warn('Local storage write error:', e);
    }
  }, []);

  // Immediate Zero-Flash Theme, Font & Custom Code Execution before first paint
  useLayoutEffect(() => {
    if (siteSettings?.designTheme) {
      applyTheme(siteSettings.designTheme);
    }
    if (siteSettings?.typography) {
      applyTypography(siteSettings.typography);
    }
    if (siteSettings?.customCode) {
      applyCustomCode(siteSettings.customCode);
    }
  }, [applyTheme, applyTypography, applyCustomCode, siteSettings?.designTheme, siteSettings?.typography, siteSettings?.customCode]);

  // Initial Data Fetch & Version Snapshot
  useEffect(() => {
    const initializeCMS = async () => {
      // Automatic Pre-Update Safety Snapshot & Version Detection
      const storedVersion = localStorage.getItem(VERSION_STORAGE_KEY);
      if (storedVersion && storedVersion !== CURRENT_APP_VERSION) {
        const existingData = localStorage.getItem(STORAGE_KEY);
        if (existingData) {
          localStorage.setItem(PRE_UPDATE_BACKUP_KEY, existingData);
        }
      }
      localStorage.setItem(VERSION_STORAGE_KEY, CURRENT_APP_VERSION);

      // If live Supabase is configured, pull fresh database records
      if (isLive) {
        setIsLoading(true);
        try {
          const [settingsRes, projectsRes, servicesRes, inquiriesRes, mediaRes] = await Promise.all([
            supabase.from('site_settings').select('*').eq('id', 'current').single(),
            supabase.from('projects').select('*').order('display_order', { ascending: true }),
            supabase.from('services').select('*').order('display_order', { ascending: true }),
            supabase.from('contact_inquiries').select('*').order('created_at', { ascending: false }),
            supabase.from('media_assets').select('*').order('created_at', { ascending: false }),
          ]);

          if (settingsRes.data) {
            const dbSettings = settingsRes.data;
            const merged: SiteSettings = {
              ...defaultSettings,
              brandName: dbSettings.brand_name || defaultSettings.brandName,
              wordmark: dbSettings.wordmark || defaultSettings.wordmark,
              role: dbSettings.role || defaultSettings.role,
              tagline: dbSettings.tagline || defaultSettings.tagline,
              subheading: dbSettings.subheading || defaultSettings.subheading,
              statusBadge: dbSettings.status_badge || defaultSettings.statusBadge,
              location: dbSettings.location || defaultSettings.location,
              email: dbSettings.email || defaultSettings.email,
              socials: {
                github: dbSettings.social_github || defaultSettings.socials.github,
                linkedin: dbSettings.social_linkedin || defaultSettings.socials.linkedin,
                x: dbSettings.social_x || defaultSettings.socials.x,
              },
              seo: {
                title: dbSettings.seo_title || defaultSettings.seo.title,
                description: dbSettings.seo_description || defaultSettings.seo.description,
                canonicalDomain: dbSettings.custom_domain || defaultSettings.seo.canonicalDomain,
              },
              designTheme: dbSettings.design_theme || defaultSettings.designTheme,
              adminPath: dbSettings.admin_path || defaultSettings.adminPath,
              inquireForm: dbSettings.inquire_form ? { ...defaultSettings.inquireForm, ...dbSettings.inquire_form } : defaultSettings.inquireForm,
              typography: dbSettings.typography ? { ...defaultTypography, ...dbSettings.typography } : defaultTypography,
              customCode: dbSettings.custom_code ? { ...defaultSettings.customCode, ...dbSettings.custom_code } : defaultSettings.customCode,
            };
            setSiteSettings(merged);
            if (merged.designTheme) applyTheme(merged.designTheme);
            if (merged.typography) applyTypography(merged.typography);
            if (merged.customCode) applyCustomCode(merged.customCode);
          }

          if (projectsRes.data && projectsRes.data.length > 0) {
            const mappedProjects: Project[] = projectsRes.data.map((p: any) => ({
              id: p.id,
              slug: p.slug || p.id,
              title: p.title,
              category: p.category,
              year: p.year,
              description: p.description,
              longDescription: p.long_description || p.description,
              tags: Array.isArray(p.tags) ? p.tags : [],
              metrics: Array.isArray(p.metrics) ? p.metrics : [],
              liveUrl: p.live_url,
              repoUrl: p.repo_url,
              featured: !!p.featured,
              accentColor: p.accent_color || '#C7FF6B',
              previewType: p.preview_type || 'interactive-canvas',
              thumbnailUrl: p.thumbnail_url,
              galleryUrls: Array.isArray(p.gallery_urls) ? p.gallery_urls : [],
              displayOrder: p.display_order ?? 0,
              isPublished: p.is_published ?? true,
            }));
            setProjects(mappedProjects);
          }

          if (servicesRes.data && servicesRes.data.length > 0) {
            const mappedServices: Service[] = servicesRes.data.map((s: any) => ({
              id: s.id,
              number: s.number,
              title: s.title,
              tagline: s.tagline,
              description: s.description,
              deliverables: Array.isArray(s.deliverables) ? s.deliverables : [],
              outcomes: Array.isArray(s.outcomes) ? s.outcomes : [],
              highlight: s.highlight,
              displayOrder: s.display_order ?? 0,
              isPublished: s.is_published ?? true,
            }));
            setServices(mappedServices);
          }

          if (inquiriesRes.data) {
            const mappedInquiries: ContactInquiry[] = inquiriesRes.data.map((inq: any) => ({
              id: inq.id,
              name: inq.name,
              email: inq.email,
              projectType: inq.project_type,
              budget: inq.budget,
              message: inq.message,
              status: inq.status,
              createdAt: inq.created_at,
            }));
            setInquiries(mappedInquiries);
          }

          if (mediaRes.data) {
            const mappedMedia: MediaAsset[] = mediaRes.data.map((m: any) => ({
              id: m.id,
              name: m.name,
              url: m.url,
              sizeBytes: m.size_bytes,
              mimeType: m.mime_type,
              createdAt: m.created_at,
            }));
            setMedia(mappedMedia);
          }
        } catch (err) {
          console.warn('Could not sync from live Supabase:', err);
        }
      }

      setIsLoading(false);
    };

    initializeCMS();
  }, [isLive, applyTheme, applyTypography, applyCustomCode]);

  // MUTATORS
  const updateSiteSettings = async (newSettings: Partial<SiteSettings>) => {
    setIsSaving(true);
    if (newSettings.adminPath !== undefined) {
      newSettings.adminPath = newSettings.adminPath
        .trim()
        .toLowerCase()
        .replace(/^\/+|\/+$/g, '')
        .replace(/[^a-z0-9_-]/g, '') || 'admin';
    }
    const updated = { ...siteSettings, ...newSettings };
    setSiteSettings(updated);

    if (updated.designTheme) {
      applyTheme(updated.designTheme);
    }
    if (updated.typography) {
      applyTypography(updated.typography);
    }
    if (updated.customCode) {
      applyCustomCode(updated.customCode);
    }

    persistLocally({
      siteSettings: updated,
      projects,
      services,
      skills,
      processSteps,
      testimonials,
      experience,
      inquiries,
      media,
    });

    if (isLive) {
      await supabase.from('site_settings').upsert({
        id: 'current',
        brand_name: updated.brandName,
        wordmark: updated.wordmark,
        role: updated.role,
        tagline: updated.tagline,
        subheading: updated.subheading,
        status_badge: updated.statusBadge,
        location: updated.location,
        email: updated.email,
        social_github: updated.socials.github,
        social_linkedin: updated.socials.linkedin,
        social_x: updated.socials.x,
        seo_title: updated.seo.title,
        seo_description: updated.seo.description,
        custom_domain: updated.seo.canonicalDomain,
        admin_path: updated.adminPath,
        design_theme: updated.designTheme,
        inquire_form: updated.inquireForm,
        typography: updated.typography,
        custom_code: updated.customCode,
        updated_at: new Date().toISOString(),
      });
    }

    setIsSaving(false);
  };

  // DYNAMIC SOCIAL LINKS
  const addSocialLink = async (link: Omit<SocialLinkItem, 'id'>) => {
    const newLink: SocialLinkItem = {
      ...link,
      id: `soc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      isEnabled: link.isEnabled !== false,
    };
    const currentList = siteSettings.socialLinks || [];
    const updatedList = [...currentList, newLink];

    const updatedSocials = { ...siteSettings.socials };
    if (newLink.platform === 'github') updatedSocials.github = newLink.url;
    if (newLink.platform === 'linkedin') updatedSocials.linkedin = newLink.url;
    if (newLink.platform === 'instagram') updatedSocials.instagram = newLink.url;
    if (newLink.platform === 'x' || newLink.platform === 'twitter') updatedSocials.x = newLink.url;

    await updateSiteSettings({
      socialLinks: updatedList,
      socials: updatedSocials,
    });
  };

  const updateSocialLink = async (id: string, updates: Partial<SocialLinkItem>) => {
    const currentList = siteSettings.socialLinks || [];
    const updatedList = currentList.map((item) => (item.id === id ? { ...item, ...updates } : item));

    const updatedSocials = { ...siteSettings.socials };
    const changed = updatedList.find((s) => s.id === id);
    if (changed) {
      if (changed.platform === 'github') updatedSocials.github = changed.url;
      if (changed.platform === 'linkedin') updatedSocials.linkedin = changed.url;
      if (changed.platform === 'instagram') updatedSocials.instagram = changed.url;
      if (changed.platform === 'x' || changed.platform === 'twitter') updatedSocials.x = changed.url;
    }

    await updateSiteSettings({
      socialLinks: updatedList,
      socials: updatedSocials,
    });
  };

  const deleteSocialLink = async (id: string) => {
    const currentList = siteSettings.socialLinks || [];
    const updatedList = currentList.filter((item) => item.id !== id);
    await updateSiteSettings({ socialLinks: updatedList });
  };

  // COLLABORATORS & ACCESS CONTROL
  const addCollaborator = async (collab: Omit<Collaborator, 'id' | 'invitedAt'>) => {
    const newCollab: Collaborator = {
      ...collab,
      id: `collab-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      invitedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };
    const currentList = siteSettings.collaborators || [];
    const updatedList = [...currentList, newCollab];
    await updateSiteSettings({ collaborators: updatedList });
  };

  const updateCollaborator = async (id: string, updates: Partial<Collaborator>) => {
    const currentList = siteSettings.collaborators || [];
    const updatedList = currentList.map((item) => (item.id === id ? { ...item, ...updates } : item));
    await updateSiteSettings({ collaborators: updatedList });
  };

  const deleteCollaborator = async (id: string) => {
    const currentList = siteSettings.collaborators || [];
    const updatedList = currentList.filter((item) => item.id !== id);
    await updateSiteSettings({ collaborators: updatedList });
  };

  const saveProject = async (project: Project) => {
    setIsSaving(true);
    const exists = projects.some((p) => p.id === project.id);
    const updated = exists
      ? projects.map((p) => (p.id === project.id ? project : p))
      : [...projects, project];

    setProjects(updated);
    persistLocally({
      siteSettings,
      projects: updated,
      services,
      skills,
      processSteps,
      testimonials,
      experience,
      inquiries,
      media,
    });

    if (isLive) {
      await supabase.from('projects').upsert({
        id: project.id,
        slug: project.slug,
        title: project.title,
        category: project.category,
        year: project.year,
        description: project.description,
        long_description: project.longDescription,
        tags: project.tags,
        metrics: project.metrics,
        live_url: project.liveUrl,
        repo_url: project.repoUrl,
        featured: project.featured,
        accent_color: project.accentColor,
        preview_type: project.previewType,
        thumbnail_url: project.thumbnailUrl,
        gallery_urls: project.galleryUrls,
        display_order: project.displayOrder,
        is_published: project.isPublished,
        updated_at: new Date().toISOString(),
      });
    }

    setIsSaving(false);
  };

  const deleteProject = async (id: string) => {
    setIsSaving(true);
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    persistLocally({
      siteSettings,
      projects: updated,
      services,
      skills,
      processSteps,
      testimonials,
      experience,
      inquiries,
      media,
    });

    if (isLive) {
      await supabase.from('projects').delete().eq('id', id);
    }
    setIsSaving(false);
  };

  const duplicateProject = async (id: string) => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;
    const newId = `${target.id}-copy-${Date.now().toString().slice(-4)}`;
    const duplicated: Project = {
      ...target,
      id: newId,
      slug: `${target.slug}-copy`,
      title: `${target.title} (Copy)`,
      displayOrder: projects.length,
    };
    await saveProject(duplicated);
  };

  const reorderProjects = async (newOrder: Project[]) => {
    const reindexed = newOrder.map((p, idx) => ({ ...p, displayOrder: idx }));
    setProjects(reindexed);
    persistLocally({
      siteSettings,
      projects: reindexed,
      services,
      skills,
      processSteps,
      testimonials,
      experience,
      inquiries,
      media,
    });
  };

  const toggleProjectPublish = async (id: string) => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;
    await saveProject({ ...target, isPublished: !target.isPublished });
  };

  // SERVICES
  const saveService = async (service: Service) => {
    setIsSaving(true);
    const exists = services.some((s) => s.id === service.id);
    const updated = exists
      ? services.map((s) => (s.id === service.id ? service : s))
      : [...services, service];

    setServices(updated);
    persistLocally({
      siteSettings,
      projects,
      services: updated,
      skills,
      processSteps,
      testimonials,
      experience,
      inquiries,
      media,
    });

    if (isLive) {
      await supabase.from('services').upsert({
        id: service.id,
        number: service.number,
        title: service.title,
        tagline: service.tagline,
        description: service.description,
        deliverables: service.deliverables,
        outcomes: service.outcomes,
        highlight: service.highlight,
        display_order: service.displayOrder,
        is_published: service.isPublished,
      });
    }
    setIsSaving(false);
  };

  const deleteService = async (id: string) => {
    const updated = services.filter((s) => s.id !== id);
    setServices(updated);
    persistLocally({
      siteSettings,
      projects,
      services: updated,
      skills,
      processSteps,
      testimonials,
      experience,
      inquiries,
      media,
    });
    if (isLive) {
      await supabase.from('services').delete().eq('id', id);
    }
  };

  const toggleServicePublish = async (id: string) => {
    const target = services.find((s) => s.id === id);
    if (!target) return;
    await saveService({ ...target, isPublished: !target.isPublished });
  };

  // SKILLS
  const saveSkillCategory = async (catIndex: number, updatedCat: SkillCategory) => {
    const updated = [...skills];
    updated[catIndex] = updatedCat;
    setSkills(updated);
    persistLocally({
      siteSettings,
      projects,
      services,
      skills: updated,
      processSteps,
      testimonials,
      experience,
      inquiries,
      media,
    });
  };

  const addSkillCategory = async (newCategory: SkillCategory) => {
    const updated = [...skills, newCategory];
    setSkills(updated);
    persistLocally({
      siteSettings,
      projects,
      services,
      skills: updated,
      processSteps,
      testimonials,
      experience,
      inquiries,
      media,
    });
  };

  const deleteSkillCategory = async (catIndex: number) => {
    if (skills.length <= 1) return;
    const updated = skills.filter((_, idx) => idx !== catIndex);
    setSkills(updated);
    persistLocally({
      siteSettings,
      projects,
      services,
      skills: updated,
      processSteps,
      testimonials,
      experience,
      inquiries,
      media,
    });
  };

  const updateSkillCategoryInfo = async (catIndex: number, name: string, description: string) => {
    const updated = [...skills];
    if (updated[catIndex]) {
      updated[catIndex] = { ...updated[catIndex], name, description };
      setSkills(updated);
      persistLocally({
        siteSettings,
        projects,
        services,
        skills: updated,
        processSteps,
        testimonials,
        experience,
        inquiries,
        media,
      });
    }
  };

  const addSkillToCategory = async (catIndex: number, newSkill: { name: string; tag: string }) => {
    const updated = [...skills];
    updated[catIndex].skills.push(newSkill);
    setSkills(updated);
    persistLocally({
      siteSettings,
      projects,
      services,
      skills: updated,
      processSteps,
      testimonials,
      experience,
      inquiries,
      media,
    });
  };

  const removeSkillFromCategory = async (catIndex: number, skillName: string) => {
    const updated = [...skills];
    updated[catIndex].skills = updated[catIndex].skills.filter((s) => s.name !== skillName);
    setSkills(updated);
    persistLocally({
      siteSettings,
      projects,
      services,
      skills: updated,
      processSteps,
      testimonials,
      experience,
      inquiries,
      media,
    });
  };

  // PROCESS
  const saveProcessStep = async (step: ProcessStep) => {
    const exists = processSteps.some((s) => s.id === step.id);
    const updated = exists
      ? processSteps.map((s) => (s.id === step.id ? step : s))
      : [...processSteps, step];
    setProcessSteps(updated);
    persistLocally({
      siteSettings,
      projects,
      services,
      skills,
      processSteps: updated,
      testimonials,
      experience,
      inquiries,
      media,
    });
  };

  const deleteProcessStep = async (id: string) => {
    const updated = processSteps.filter((s) => s.id !== id);
    setProcessSteps(updated);
    persistLocally({
      siteSettings,
      projects,
      services,
      skills,
      processSteps: updated,
      testimonials,
      experience,
      inquiries,
      media,
    });
  };

  // TESTIMONIALS
  const saveTestimonial = async (item: Testimonial) => {
    const exists = testimonials.some((t) => t.id === item.id);
    const updated = exists
      ? testimonials.map((t) => (t.id === item.id ? item : t))
      : [...testimonials, item];
    setTestimonials(updated);
    persistLocally({
      siteSettings,
      projects,
      services,
      skills,
      processSteps,
      testimonials: updated,
      experience,
      inquiries,
      media,
    });
  };

  const deleteTestimonial = async (id: string) => {
    const updated = testimonials.filter((t) => t.id !== id);
    setTestimonials(updated);
    persistLocally({
      siteSettings,
      projects,
      services,
      skills,
      processSteps,
      testimonials: updated,
      experience,
      inquiries,
      media,
    });
  };

  const toggleTestimonialPublish = async (id: string) => {
    const target = testimonials.find((t) => t.id === id);
    if (!target) return;
    await saveTestimonial({ ...target, isPublished: !target.isPublished });
  };

  // EXPERIENCE
  const saveExperience = async (item: ExperienceItem) => {
    const exists = experience.some((e) => e.id === item.id);
    const updated = exists
      ? experience.map((e) => (e.id === item.id ? item : e))
      : [...experience, item];
    setExperience(updated);
    persistLocally({
      siteSettings,
      projects,
      services,
      skills,
      processSteps,
      testimonials,
      experience: updated,
      inquiries,
      media,
    });
  };

  const deleteExperience = async (id: string) => {
    const updated = experience.filter((e) => e.id !== id);
    setExperience(updated);
    persistLocally({
      siteSettings,
      projects,
      services,
      skills,
      processSteps,
      testimonials,
      experience: updated,
      inquiries,
      media,
    });
  };

  // INQUIRIES (Incoming client leads from website)
  const submitInquiry = async (
    data: Omit<ContactInquiry, 'id' | 'createdAt' | 'status'>
  ): Promise<{ success: boolean; error?: string }> => {
    const newInquiry: ContactInquiry = {
      ...data,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    const updated = [newInquiry, ...inquiries];
    setInquiries(updated);
    persistLocally({
      siteSettings,
      projects,
      services,
      skills,
      processSteps,
      testimonials,
      experience,
      inquiries: updated,
      media,
    });

    if (isLive) {
      await supabase.from('contact_inquiries').insert({
        id: newInquiry.id,
        name: newInquiry.name,
        email: newInquiry.email,
        project_type: newInquiry.projectType,
        budget: newInquiry.budget,
        message: newInquiry.message,
        status: 'new',
      });
    }

    return { success: true };
  };

  const updateInquiryStatus = async (id: string, status: ContactInquiry['status']) => {
    const updated = inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq));
    setInquiries(updated);
    persistLocally({
      siteSettings,
      projects,
      services,
      skills,
      processSteps,
      testimonials,
      experience,
      inquiries: updated,
      media,
    });

    if (isLive) {
      await supabase.from('contact_inquiries').update({ status }).eq('id', id);
    }
  };

  const deleteInquiry = async (id: string) => {
    const updated = inquiries.filter((inq) => inq.id !== id);
    setInquiries(updated);
    persistLocally({
      siteSettings,
      projects,
      services,
      skills,
      processSteps,
      testimonials,
      experience,
      inquiries: updated,
      media,
    });

    if (isLive) {
      await supabase.from('contact_inquiries').delete().eq('id', id);
    }
  };

  // MEDIA LIBRARY
  const uploadMedia = async (file: File): Promise<MediaAsset | null> => {
    setIsSaving(true);
    let publicUrl = '';

    if (isLive) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `portfolio/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-media')
        .upload(filePath, file);

      if (!uploadError) {
        const { data } = supabase.storage.from('portfolio-media').getPublicUrl(filePath);
        publicUrl = data.publicUrl;
      }
    }

    // Fallback or local data URL reader
    if (!publicUrl) {
      publicUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    const newAsset: MediaAsset = {
      id: `media-${Date.now()}`,
      name: file.name,
      url: publicUrl,
      sizeBytes: file.size,
      mimeType: file.type || 'image/jpeg',
      createdAt: new Date().toISOString(),
    };

    const updated = [newAsset, ...media];
    setMedia(updated);
    persistLocally({
      siteSettings,
      projects,
      services,
      skills,
      processSteps,
      testimonials,
      experience,
      inquiries,
      media: updated,
    });

    if (isLive) {
      await supabase.from('media_assets').insert({
        id: newAsset.id,
        name: newAsset.name,
        url: newAsset.url,
        size_bytes: newAsset.sizeBytes,
        mime_type: newAsset.mimeType,
      });
    }

    setIsSaving(false);
    return newAsset;
  };

  const deleteMedia = async (id: string) => {
    const updated = media.filter((m) => m.id !== id);
    setMedia(updated);
    persistLocally({
      siteSettings,
      projects,
      services,
      skills,
      processSteps,
      testimonials,
      experience,
      inquiries,
      media: updated,
    });

    if (isLive) {
      await supabase.from('media_assets').delete().eq('id', id);
    }
  };

  const resetToDefaults = () => {
    setSiteSettings(defaultSettings);
    setProjects(defaultProjects);
    setServices(defaultServices);
    setSkills(PORTFOLIO_DATA.skills);
    setProcessSteps(defaultProcessSteps);
    setTestimonials(defaultTestimonials);
    setExperience([]);
    applyTheme(defaultTheme);
    applyTypography(defaultTypography);
    applyCustomCode(defaultSettings.customCode);
    localStorage.removeItem(STORAGE_KEY);
    setLastSaved('Reset to defaults');
  };

  const exportCMSData = (): string => {
    return JSON.stringify(
      {
        siteSettings,
        projects,
        services,
        skills,
        processSteps,
        testimonials,
        experience,
        media,
      },
      null,
      2
    );
  };

  const importCMSData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.siteSettings) setSiteSettings(parsed.siteSettings);
      if (parsed.projects) setProjects(parsed.projects);
      if (parsed.services) setServices(parsed.services);
      if (parsed.skills) setSkills(parsed.skills);
      if (parsed.processSteps) setProcessSteps(parsed.processSteps);
      if (parsed.testimonials) setTestimonials(parsed.testimonials);
      if (parsed.experience) setExperience(parsed.experience);
      if (parsed.siteSettings?.designTheme) applyTheme(parsed.siteSettings.designTheme);
      if (parsed.siteSettings?.typography) applyTypography(parsed.siteSettings.typography);
      if (parsed.siteSettings?.customCode) applyCustomCode(parsed.siteSettings.customCode);
      persistLocally(parsed);
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  };

  // SYSTEM UPDATES & DATA PRESERVATION
  const createPreUpdateBackup = (): string => {
    const backupData = exportCMSData();
    localStorage.setItem(PRE_UPDATE_BACKUP_KEY, backupData);
    return backupData;
  };

  const checkSystemUpdates = async (): Promise<SystemUpdateInfo> => {
    setIsCheckingUpdates(true);
    const repo = siteSettings.updateSettings?.githubRepo || 'bracknodes/web-1';
    try {
      const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      });

      if (res.ok) {
        const data = await res.json();
        const latestTag = (data.tag_name || data.name || '').replace(/^v/, '');
        const hasNew = Boolean(latestTag && latestTag !== CURRENT_APP_VERSION);

        const info: SystemUpdateInfo = {
          currentVersion: CURRENT_APP_VERSION,
          latestVersion: latestTag || CURRENT_APP_VERSION,
          hasUpdate: hasNew,
          releaseTitle: data.name || `Release ${data.tag_name}`,
          releaseNotes: data.body || 'New features, performance enhancements, and security upgrades from BrackNodes.',
          publishedAt: data.published_at,
          htmlUrl: data.html_url,
        };
        setUpdateInfo(info);
        setIsCheckingUpdates(false);
        return info;
      }
    } catch (e) {
      console.warn('GitHub update check failed (offline or rate-limited):', e);
    }

    const fallbackInfo: SystemUpdateInfo = {
      currentVersion: CURRENT_APP_VERSION,
      latestVersion: CURRENT_APP_VERSION,
      hasUpdate: false,
      releaseTitle: 'Engine Up to Date',
      releaseNotes: 'Your BrackNodes Studio CMS engine is up to date. All custom projects and database entries are isolated and protected.',
    };
    setUpdateInfo(fallbackInfo);
    setIsCheckingUpdates(false);
    return fallbackInfo;
  };

  const triggerAutoDeploy = async (): Promise<{ success: boolean; message: string }> => {
    const webhookUrl = siteSettings.updateSettings?.deployWebhookUrl;
    if (!webhookUrl) {
      return {
        success: false,
        message: 'No Deploy Webhook URL configured. Please enter your Vercel/Netlify deploy hook or run git pull origin main.',
      };
    }

    try {
      createPreUpdateBackup();
      const res = await fetch(webhookUrl, { method: 'POST' });
      if (res.ok || res.status === 200 || res.status === 201) {
        return {
          success: true,
          message: 'Auto-deploy triggered successfully! Your hosting provider is building the latest update. Your database content is preserved.',
        };
      } else {
        return {
          success: false,
          message: `Webhook returned status ${res.status}. Please verify your deploy webhook URL.`,
        };
      }
    } catch (e: any) {
      return {
        success: false,
        message: `Network error triggering deploy webhook: ${e.message}`,
      };
    }
  };

  const runDataPreservationMigration = (): { backedUp: boolean; message: string } => {
    createPreUpdateBackup();
    persistLocally({
      siteSettings,
      projects,
      services,
      skills,
      processSteps,
      testimonials,
      experience,
      inquiries,
      media,
    });
    return {
      backedUp: true,
      message: 'Safety backup saved & schema synchronized without modifying your custom content.',
    };
  };

  return (
    <CMSContext.Provider
      value={{
        siteSettings,
        projects,
        services,
        skills,
        processSteps,
        testimonials,
        experience,
        inquiries,
        media,
        isLoading,
        isSaving,
        lastSaved,
        isLiveSupabase: isLive,
        updateSiteSettings,
        saveProject,
        deleteProject,
        duplicateProject,
        reorderProjects,
        toggleProjectPublish,
        saveService,
        deleteService,
        toggleServicePublish,
        saveSkillCategory,
        addSkillCategory,
        deleteSkillCategory,
        updateSkillCategoryInfo,
        addSkillToCategory,
        removeSkillFromCategory,
        saveProcessStep,
        deleteProcessStep,
        saveTestimonial,
        deleteTestimonial,
        toggleTestimonialPublish,
        saveExperience,
        deleteExperience,
        submitInquiry,
        updateInquiryStatus,
        deleteInquiry,
        uploadMedia,
        deleteMedia,
        addSocialLink,
        updateSocialLink,
        deleteSocialLink,
        addCollaborator,
        updateCollaborator,
        deleteCollaborator,
        applyTheme,
        applyTypography,
        applyCustomCode,
        resetToDefaults,
        exportCMSData,
        importCMSData,
        currentAppVersion: CURRENT_APP_VERSION,
        updateInfo,
        isCheckingUpdates,
        checkSystemUpdates,
        triggerAutoDeploy,
        createPreUpdateBackup,
        runDataPreservationMigration,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = (): CMSContextType => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};

import React, { useState, useRef } from 'react';
import { useCMS } from '../../../context/CMSContext';
import {
  Check,
  Save,
  Plus,
  Trash2,
  ShieldAlert,
  ArrowUpRight,
  FolderGit2,
  Briefcase,
  Layers,
  GitBranch,
  Star,
  Box,
  MessageSquare,
  Palette,
  Type,
  BookOpen,
  UploadCloud,
  Image as ImageIcon,
  Terminal,
  Eye,
  Sun,
  Moon,
} from 'lucide-react';
import { SocialIcon } from '../../../components/SocialIcon';
import type { HeroStatCard, AboutStat, AboutPillar, ArchitectureNote } from '../../../types/cms';
import type { AdminTab } from '../AdminLayout';

interface ContentEditorViewProps {
  onNavigate?: (tab: AdminTab) => void;
}

export const ContentEditorView: React.FC<ContentEditorViewProps> = ({ onNavigate }) => {
  const {
    siteSettings,
    updateSiteSettings,
    addSocialLink,
    updateSocialLink,
    deleteSocialLink,
    media,
    uploadMedia,
  } = useCMS();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'all' | 'brand' | 'navbar' | 'hero' | 'about' | 'headings' | 'arch' | 'socials' | 'footer'>('all');

  // 01. Brand & Role State
  const [brandName, setBrandName] = useState(siteSettings.brandName || 'BRACKNODES.IN');
  const [wordmark, setWordmark] = useState(siteSettings.wordmark || 'BRACKNODES');
  const [role, setRole] = useState(siteSettings.role || 'Next-Gen Cloud & Discord Bot Hosting');
  const [statusBadge, setStatusBadge] = useState(siteSettings.statusBadge || 'All Server Nodes Operational — 99.99% Uptime SLA');
  const [location, setLocation] = useState(siteSettings.location || 'India (Asia-South Datacenters)');
  const [email, setEmail] = useState(siteSettings.email || 'support@bracknodes.in');

  // 01. Logo Settings State (Dual Theme Support: Dark & Light)
  const [logoMode, setLogoMode] = useState<'image-wordmark' | 'image-only' | 'icon-wordmark'>(
    siteSettings.logoSettings?.mode ||
      (siteSettings.logoSettings?.darkImageUrl || siteSettings.logoSettings?.lightImageUrl || siteSettings.logoSettings?.imageUrl
        ? 'image-wordmark'
        : 'icon-wordmark')
  );
  const [darkLogoUrl, setDarkLogoUrl] = useState<string>(
    siteSettings.logoSettings?.darkImageUrl || siteSettings.logoSettings?.imageUrl || ''
  );
  const [lightLogoUrl, setLightLogoUrl] = useState<string>(
    siteSettings.logoSettings?.lightImageUrl || ''
  );
  const [logoHeightPx, setLogoHeightPx] = useState<number>(siteSettings.logoSettings?.heightPx || 34);
  const [logoAltText, setLogoAltText] = useState<string>(siteSettings.logoSettings?.altText || 'BrackNodes Logo');
  const [logoShowInNavbar, setLogoShowInNavbar] = useState<boolean>(siteSettings.logoSettings?.showInNavbar !== false);
  const [logoShowInFooter, setLogoShowInFooter] = useState<boolean>(siteSettings.logoSettings?.showInFooter !== false);
  const [isUploadingDark, setIsUploadingDark] = useState(false);
  const [isUploadingLight, setIsUploadingLight] = useState(false);
  const darkLogoFileInputRef = useRef<HTMLInputElement>(null);
  const lightLogoFileInputRef = useRef<HTMLInputElement>(null);

  const handleDarkLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingDark(true);
      const uploaded = await uploadMedia(file);
      if (uploaded && uploaded.url) {
        setDarkLogoUrl(uploaded.url);
        if (logoMode === 'icon-wordmark') {
          setLogoMode('image-wordmark');
        }
      }
    } catch (err) {
      console.error('Failed to upload dark logo file:', err);
    } finally {
      setIsUploadingDark(false);
      if (darkLogoFileInputRef.current) {
        darkLogoFileInputRef.current.value = '';
      }
    }
  };

  const handleLightLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingLight(true);
      const uploaded = await uploadMedia(file);
      if (uploaded && uploaded.url) {
        setLightLogoUrl(uploaded.url);
        if (logoMode === 'icon-wordmark') {
          setLogoMode('image-wordmark');
        }
      }
    } catch (err) {
      console.error('Failed to upload light logo file:', err);
    } finally {
      setIsUploadingLight(false);
      if (lightLogoFileInputRef.current) {
        lightLogoFileInputRef.current.value = '';
      }
    }
  };

  // 02. Navbar Settings State
  const [workNavLabel, setWorkNavLabel] = useState(siteSettings.navbarSettings?.workLabel || 'Plans');
  const [aboutNavLabel, setAboutNavLabel] = useState(siteSettings.navbarSettings?.aboutLabel || 'About');
  const [servicesNavLabel, setServicesNavLabel] = useState(siteSettings.navbarSettings?.servicesLabel || 'Services');
  const [skillsNavLabel, setSkillsNavLabel] = useState(siteSettings.navbarSettings?.skillsLabel || 'Stack');
  const [processNavLabel, setProcessNavLabel] = useState(siteSettings.navbarSettings?.processLabel || 'Process');
  const [contactNavLabel, setContactNavLabel] = useState(siteSettings.navbarSettings?.contactLabel || 'Contact');
  const [navbarCtaText, setNavbarCtaText] = useState(siteSettings.navbarSettings?.ctaText || 'Get Started');
  const [navbarCtaLink, setNavbarCtaLink] = useState(siteSettings.navbarSettings?.ctaLink || '#contact');

  // 03. Hero Section State
  const [tagline, setTagline] = useState(siteSettings.tagline || 'RELIABLE HOSTING FOR EVERYONE.');
  const [subheading, setSubheading] = useState(
    siteSettings.subheading ||
    'High-speed NVMe cPanel Web Hosting, 24/7 Discord Bot Hosting, and low-latency cloud infrastructure engineered for developers, communities, and businesses. Starting at just ₹29/month.'
  );
  const [primaryCtaText, setPrimaryCtaText] = useState(siteSettings.heroSettings?.primaryCtaText || 'View Hosting Plans');
  const [primaryCtaLink, setPrimaryCtaLink] = useState(siteSettings.heroSettings?.primaryCtaLink || '#projects');
  const [secondaryCtaText, setSecondaryCtaText] = useState(siteSettings.heroSettings?.secondaryCtaText || 'Get Started Now');
  const [secondaryCtaLink, setSecondaryCtaLink] = useState(siteSettings.heroSettings?.secondaryCtaLink || '#contact');

  const defaultHeroStats: HeroStatCard[] = [
    { value: '₹29/mo', label: 'Starter Price' },
    { value: '99.99%', label: 'Uptime SLA' },
    { value: '< 15ms', label: 'India Latency' },
    { value: '24/7/365', label: 'Active Support' },
  ];
  const [heroStats, setHeroStats] = useState<HeroStatCard[]>(
    siteSettings.heroSettings?.stats && siteSettings.heroSettings.stats.length > 0
      ? siteSettings.heroSettings.stats
      : defaultHeroStats
  );

  const defaultMarquee = [
    'DISCORD BOT HOSTING',
    'NVME CPANEL HOSTING',
    '99.99% UPTIME SLA',
    'PTERODACTYL PANEL',
    'DDOS SHIELD PROTECTION',
    'CLOUD VPS COMPUTE',
    'STARTING AT ₹29/MO',
    '24/7 TECHNICAL SUPPORT',
  ];
  const [marqueeItemsStr, setMarqueeItemsStr] = useState<string>(
    (siteSettings.heroSettings?.marqueeItems && siteSettings.heroSettings.marqueeItems.length > 0
      ? siteSettings.heroSettings.marqueeItems
      : defaultMarquee
    ).join(', ')
  );

  // 04. About Section State
  const [aboutTag, setAboutTag] = useState(siteSettings.sectionHeadings?.about?.tag || '02 // Platform Overview');
  const [aboutTitle, setAboutTitle] = useState(siteSettings.sectionHeadings?.about?.title || 'WHY CHOOSE BRACKNODES');
  const [aboutSubtitle, setAboutSubtitle] = useState(
    siteSettings.sectionHeadings?.about?.subtitle ||
    'High-availability NVMe cloud architecture, 99.99% uptime SLA, and India’s most budget-friendly server infrastructure.'
  );
  const [aboutNarrativeHeading, setAboutNarrativeHeading] = useState(
    siteSettings.aboutSettings?.narrativeHeading ||
    'ENTERPRISE CLOUD PERFORMANCE AT UNBEATABLE PRICES.'
  );
  const [aboutParagraph1, setAboutParagraph1] = useState(
    siteSettings.aboutSettings?.narrativeParagraph1 ||
    'BrackNodes was engineered to eliminate overpriced hosting in India. We provide developers, gaming communities, and businesses with reliable cloud solutions starting from just ₹29/month, backed by tier-1 low-latency networking.'
  );
  const [aboutParagraph2, setAboutParagraph2] = useState(
    siteSettings.aboutSettings?.narrativeParagraph2 ||
    'From lightweight Discord bots running on high-performance Pterodactyl panels to high-traffic WordPress websites powered by pure NVMe SSDs and cPanel, we keep your digital services active 24/7 with zero sleep cycles.'
  );

  const defaultAboutStats: AboutStat[] = [
    { value: '₹29/mo', label: 'Starting Price', sub: 'Most affordable in India' },
    { value: '99.99%', label: 'Uptime SLA', sub: 'High availability nodes' },
    { value: '10 Gbps+', label: 'Anti-DDoS Shield', sub: 'Always-on mitigation' },
    { value: '100% Pure', label: 'Enterprise NVMe', sub: 'High IOPS read/write' },
  ];
  const [aboutStats, setAboutStats] = useState<AboutStat[]>(
    siteSettings.aboutSettings?.stats && siteSettings.aboutSettings.stats.length > 0
      ? siteSettings.aboutSettings.stats
      : defaultAboutStats
  );

  const defaultAboutPillars: AboutPillar[] = [
    { title: 'Zero-Sleep Uptime', text: 'Continuous 24/7 availability for your Discord bots and web applications powered by high-availability NVMe nodes.' },
    { title: 'Pure NVMe Performance', text: 'Enterprise NVMe SSD drives deliver up to 10x faster I/O speed than conventional SATA or HDD hosting.' },
    { title: 'Honest & Transparent', text: 'India\'s most affordable developer-friendly hosting with transparent renewals, starting at just ₹29/month with zero hidden charges.' },
    { title: 'Direct Human Support', text: 'Round-the-clock technical support via Discord community and rapid ticketing whenever you need assistance.' },
  ];
  const [aboutPillars, setAboutPillars] = useState<AboutPillar[]>(
    siteSettings.aboutSettings?.pillars && siteSettings.aboutSettings.pillars.length > 0
      ? siteSettings.aboutSettings.pillars
      : defaultAboutPillars
  );
  const [terminalPrompt, setTerminalPrompt] = useState(siteSettings.aboutSettings?.terminalPrompt || 'root@bracknodes-node01:~$ ');

  // 05. Section Headings State
  const [projectsTag, setProjectsTag] = useState(siteSettings.sectionHeadings?.projects?.tag ?? '01 // Hosting Plans');
  const [projectsTitle, setProjectsTitle] = useState(siteSettings.sectionHeadings?.projects?.title ?? 'FEATURED HOSTING TIERS');
  const [projectsSubtitle, setProjectsSubtitle] = useState(siteSettings.sectionHeadings?.projects?.subtitle ?? 'High-performance Discord bot hosting, pure NVMe cPanel packages, and scalable cloud compute engineered for reliability.');

  const [servicesTag, setServicesTag] = useState(siteSettings.sectionHeadings?.services?.tag ?? '03 // Cloud Infrastructure');
  const [servicesTitle, setServicesTitle] = useState(siteSettings.sectionHeadings?.services?.title ?? 'HOSTING CAPABILITIES');
  const [servicesSubtitle, setServicesSubtitle] = useState(siteSettings.sectionHeadings?.services?.subtitle ?? 'Engineered hosting solutions tailored to developers, gaming communities, and high-growth digital brands.');

  const [skillsTag, setSkillsTag] = useState(siteSettings.sectionHeadings?.skills?.tag ?? '04 // Hardware & Stack');
  const [skillsTitle, setSkillsTitle] = useState(siteSettings.sectionHeadings?.skills?.title ?? 'INFRASTRUCTURE STACK');
  const [skillsSubtitle, setSkillsSubtitle] = useState(siteSettings.sectionHeadings?.skills?.subtitle ?? 'Modern enterprise hardware, industry-standard virtualization, and low-latency network uplinks.');

  const [processTag, setProcessTag] = useState(siteSettings.sectionHeadings?.process?.tag ?? '05 // Instant Setup Workflow');
  const [processTitle, setProcessTitle] = useState(siteSettings.sectionHeadings?.process?.title ?? 'PROVISIONING PROCESS');
  const [processSubtitle, setProcessSubtitle] = useState(siteSettings.sectionHeadings?.process?.subtitle ?? 'From plan selection to full deployment in less than 60 seconds with automated instant activation.');

  const [testimonialsTag, setTestimonialsTag] = useState(siteSettings.sectionHeadings?.testimonials?.tag ?? '06 // Community Feedback');
  const [testimonialsTitle, setTestimonialsTitle] = useState(siteSettings.sectionHeadings?.testimonials?.title ?? 'CUSTOMER REVIEWS');
  const [testimonialsSubtitle, setTestimonialsSubtitle] = useState(siteSettings.sectionHeadings?.testimonials?.subtitle ?? 'Verified testimonials from Discord bot developers, community owners, and webmasters hosting on BrackNodes.');

  // 06. Architecture Notes State
  const defaultArchNotes: ArchitectureNote[] = [
    { title: 'Pterodactyl Daemon (Wings) Runtime', code: '// High-density containerized Discord Bot isolation\ndocker run -d --name pterodactyl-wings --restart=always \\\n  -v /var/lib/pterodactyl/:/var/lib/pterodactyl/ \\\n  -v /var/run/docker.sock:/var/run/docker.sock ...' },
    { title: 'NVMe I/O Performance Benchmark', code: '// Enterprise NVMe read/write speed benchmark\nfio --name=randwrite --ioengine=libaio --iodepth=1 \\\n  --rw=randwrite --bs=4k --direct=1 --size=256M \\\n  // Result: 450,000+ IOPS sustained write' },
    { title: 'Automated Anycast Anti-DDoS Filter', code: '// Real-time edge packet filtering & rate limiting\niptables -A PREROUTING -p udp -m length --length 0:28 -j DROP\niptables -A INPUT -p tcp --dport 80,443 -m connlimit ...' },
    { title: 'cPanel Instant Provisioning Pipeline', code: '// Instant provisioning via WHM API v1\nwhmapi1 createacct username=client domain=app.in \\\n  plan=NVMe-Starter ssl=1 ip=dedicated ...' },
  ];
  const [archNotes, setArchNotes] = useState<ArchitectureNote[]>(
    siteSettings.architectureNotes && siteSettings.architectureNotes.length > 0
      ? siteSettings.architectureNotes
      : defaultArchNotes
  );

  // 07. Social Links state
  const socialLinks = siteSettings.socialLinks || [];
  const [isAddingSocial, setIsAddingSocial] = useState(false);
  const [newPlatform, setNewPlatform] = useState('youtube');
  const [newLabel, setNewLabel] = useState('YouTube');
  const [newUrl, setNewUrl] = useState('');
  const [newColor, setNewColor] = useState('#FF0000');

  const socialPresets = [
    { platform: 'youtube', label: 'YouTube', color: '#FF0000', defaultUrl: 'https://youtube.com/@' },
    { platform: 'discord', label: 'Discord', color: '#5865F2', defaultUrl: 'https://discord.gg/' },
    { platform: 'telegram', label: 'Telegram', color: '#0088cc', defaultUrl: 'https://t.me/' },
    { platform: 'dribbble', label: 'Dribbble', color: '#ea4c89', defaultUrl: 'https://dribbble.com/' },
    { platform: 'behance', label: 'Behance', color: '#053eff', defaultUrl: 'https://behance.net/' },
    { platform: 'twitch', label: 'Twitch', color: '#9146FF', defaultUrl: 'https://twitch.tv/' },
    { platform: 'github', label: 'GitHub', color: 'var(--accent-lime)', defaultUrl: 'https://github.com/' },
    { platform: 'linkedin', label: 'LinkedIn', color: 'var(--accent-blue)', defaultUrl: 'https://linkedin.com/in/' },
    { platform: 'x', label: 'X / Twitter', color: '#ffffff', defaultUrl: 'https://x.com/' },
    { platform: 'instagram', label: 'Instagram', color: '#E1306C', defaultUrl: 'https://instagram.com/' },
  ];

  // 08. Footer State
  const [footerText, setFooterText] = useState(
    siteSettings.footerText ||
    'BrackNodes provides reliable, high-speed NVMe cPanel web hosting and 24/7 Discord bot hosting engineered for developers and communities starting at ₹29/month.'
  );
  const [copyrightText, setCopyrightText] = useState(siteSettings.copyrightText || 'BRACKNODES. ALL RIGHTS RESERVED.');
  const [statusBadgeText, setStatusBadgeText] = useState(siteSettings.footerSettings?.statusBadgeText || 'ALL SYSTEMS OPERATIONAL — 99.99% UPTIME');
  const [backToTopText, setBackToTopText] = useState(siteSettings.footerSettings?.backToTopText || 'BACK TO TOP');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedMarquee = marqueeItemsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    updateSiteSettings({
      brandName,
      wordmark,
      role,
      statusBadge,
      location,
      email,
      tagline,
      subheading,
      footerText,
      copyrightText,
      logoSettings: {
        mode: logoMode,
        imageUrl: darkLogoUrl.trim() || lightLogoUrl.trim(),
        darkImageUrl: darkLogoUrl.trim(),
        lightImageUrl: lightLogoUrl.trim(),
        heightPx: Number(logoHeightPx) || 34,
        altText: logoAltText.trim() || 'BrackNodes Logo',
        showInNavbar: logoShowInNavbar,
        showInFooter: logoShowInFooter,
      },
      navbarSettings: {
        workLabel: workNavLabel,
        aboutLabel: aboutNavLabel,
        servicesLabel: servicesNavLabel,
        skillsLabel: skillsNavLabel,
        processLabel: processNavLabel,
        contactLabel: contactNavLabel,
        ctaText: navbarCtaText,
        ctaLink: navbarCtaLink,
      },
      heroSettings: {
        primaryCtaText,
        primaryCtaLink,
        secondaryCtaText,
        secondaryCtaLink,
        stats: heroStats,
        marqueeItems: parsedMarquee.length > 0 ? parsedMarquee : defaultMarquee,
      },
      aboutSettings: {
        narrativeHeading: aboutNarrativeHeading,
        narrativeParagraph1: aboutParagraph1,
        narrativeParagraph2: aboutParagraph2,
        stats: aboutStats,
        pillars: aboutPillars,
        terminalPrompt,
      },
      sectionHeadings: {
        about: {
          tag: aboutTag,
          title: aboutTitle,
          subtitle: aboutSubtitle,
        },
        projects: {
          tag: projectsTag,
          title: projectsTitle,
          subtitle: projectsSubtitle,
          filterTabs: siteSettings.sectionHeadings?.projects?.filterTabs,
        },
        services: {
          tag: servicesTag,
          title: servicesTitle,
          subtitle: servicesSubtitle,
        },
        skills: {
          tag: skillsTag,
          title: skillsTitle,
          subtitle: skillsSubtitle,
        },
        process: {
          tag: processTag,
          title: processTitle,
          subtitle: processSubtitle,
        },
        testimonials: {
          tag: testimonialsTag,
          title: testimonialsTitle,
          subtitle: testimonialsSubtitle,
        },
      },
      architectureNotes: archNotes,
      footerSettings: {
        statusBadgeText,
        backToTopText,
      },
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newUrl) return;
    addSocialLink({
      platform: newPlatform,
      label: newLabel,
      url: newUrl,
      color: newColor,
      isEnabled: true,
    });
    setNewUrl('');
    setIsAddingSocial(false);
  };

  const tabs = [
    { id: 'all', label: 'All Controls' },
    { id: 'brand', label: '01. Brand & Role' },
    { id: 'navbar', label: '02. Nav & Header' },
    { id: 'hero', label: '03. Hero & CTAs' },
    { id: 'about', label: '04. About Studio' },
    { id: 'headings', label: '05. Section Titles' },
    { id: 'arch', label: '06. Architecture Notes' },
    { id: 'socials', label: '07. Social Media' },
    { id: 'footer', label: '08. Footer & Details' },
  ];

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-lime)', marginBottom: '0.25rem' }}>
            CMS MANAGEMENT // HOMEPAGE &amp; BRAND
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Complete Homepage Editor</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Customize every headline, paragraph, CTA button, stat counter, navigation label, and section title across the entire website.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {savedSuccess && (
            <span className="mono" style={{ color: 'var(--accent-lime)', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={16} /> CHANGES SAVED
            </span>
          )}
          <button onClick={handleSaveAll} className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
            <Save size={16} />
            <span>Save All Homepage Updates</span>
          </button>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className="mono"
            style={{
              padding: '6px 14px',
              fontSize: '0.75rem',
              borderRadius: '2px',
              border: activeTab === tab.id ? '1px solid var(--accent-lime)' : '1px solid var(--border-subtle)',
              backgroundColor: activeTab === tab.id ? 'var(--accent-lime-muted)' : 'var(--bg-elevated)',
              color: activeTab === tab.id ? 'var(--accent-lime)' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Quick Jump Directory for Special Section Editors */}
      {onNavigate && (
        <div
          style={{
            padding: '1.25rem 1.5rem',
            backgroundColor: '#0c0f17',
            border: '1px solid rgba(199, 255, 107, 0.25)',
            borderRadius: '4px',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--accent-lime)', background: 'rgba(199,255,107,0.1)', padding: '2px 8px', borderRadius: '2px', fontWeight: 700 }}>
                  DEDICATED SECTION DIRECTORY
                </span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F7F7F2' }}>
                  Looking to edit specific dynamic cards, 3D object, or forms?
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', margin: '4px 0 0 0' }}>
                The sections below have their own dedicated management panels with custom add, edit, pricing, and delete controls. Click any shortcut to jump directly:
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('knowledge')}
              className="mono"
              style={{
                fontSize: '0.75rem',
                padding: '6px 12px',
                background: 'rgba(112, 185, 255, 0.1)',
                border: '1px solid rgba(112, 185, 255, 0.3)',
                color: 'var(--accent-blue)',
                borderRadius: '3px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <BookOpen size={14} />
              <span>How to Edit Guide</span>
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '10px',
            }}
          >
            {[
              { tab: 'projects' as AdminTab, label: 'Hosting Plans / Tiers', desc: 'Pricing (₹29/mo), NVMe specs, links', icon: <FolderGit2 size={15} color="var(--accent-lime)" /> },
              { tab: 'services' as AdminTab, label: 'Cloud Services', desc: 'Deliverables & capabilities', icon: <Briefcase size={15} color="var(--accent-blue)" /> },
              { tab: 'skills' as AdminTab, label: 'Hardware & Stack', desc: 'cPanel, Pterodactyl, KVM, runtimes', icon: <Layers size={15} color="var(--accent-lime)" /> },
              { tab: 'process' as AdminTab, label: 'Provisioning Flow', desc: '5-step automated setup timeline', icon: <GitBranch size={15} color="var(--accent-blue)" /> },
              { tab: 'testimonials' as AdminTab, label: 'Customer Reviews', desc: 'Client endorsements & star ratings', icon: <Star size={15} color="var(--accent-lime)" /> },
              { tab: 'hero-3d' as AdminTab, label: 'Interactive 3D Model', desc: 'Geometry, wireframe, particles, spin', icon: <Box size={15} color="#c7ff6b" /> },
              { tab: 'inquire-form' as AdminTab, label: 'Inquire & Order Form', desc: 'Budget tiers, form inputs & SLA', icon: <MessageSquare size={15} color="#70b9ff" /> },
              { tab: 'design' as AdminTab, label: 'Themes & Colors', desc: 'Color palettes, dark/light, borders', icon: <Palette size={15} color="var(--accent-lime)" /> },
              { tab: 'typography' as AdminTab, label: 'Fonts & Typography', desc: 'Google fonts, heading & body sizing', icon: <Type size={15} color="var(--accent-blue)" /> },
            ].map((item) => (
              <button
                key={item.tab}
                type="button"
                onClick={() => onNavigate(item.tab)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '10px 12px',
                  backgroundColor: '#11151f',
                  border: '1px solid #1c2438',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-lime)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#1c2438';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div style={{ marginTop: '2px' }}>{item.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#F7F7F2', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{item.label}</span>
                    <ArrowUpRight size={13} color="var(--text-muted)" />
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.3 }}>
                    {item.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSaveAll}>
        {/* =========================================================================
            01. BRAND IDENTITY & CONTACT
            ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'brand') && (
          <div className="card-surface" style={{ padding: '1.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="mono" style={{ color: 'var(--accent-lime)', fontSize: '0.875rem' }}>01.</span> Brand Identity &amp; Studio Info
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '1.5rem' }}>
              Global identity parameters displayed in the header, metadata, contact cards, and footer.
            </p>

            {/* ── Brand Logo Upload & Customization Studio (Dark & Light Theme) ── */}
            <div
              style={{
                padding: '1.25rem',
                backgroundColor: 'rgba(199, 255, 107, 0.03)',
                border: '1px solid rgba(199, 255, 107, 0.2)',
                borderRadius: '4px',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ImageIcon size={18} color="var(--accent-lime)" />
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F7F7F2' }}>
                    Brand Logo &amp; Dual Theme Customizer
                  </span>
                  <span className="mono" style={{ fontSize: '0.65rem', padding: '2px 6px', background: 'rgba(199,255,107,0.12)', color: 'var(--accent-lime)', borderRadius: '2px' }}>
                    DARK &amp; LIGHT MODES
                  </span>
                </div>
                {(darkLogoUrl || lightLogoUrl) && (
                  <button
                    type="button"
                    onClick={() => {
                      setDarkLogoUrl('');
                      setLightLogoUrl('');
                      setLogoMode('icon-wordmark');
                    }}
                    className="mono"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ff6b6b',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={13} />
                    <span>Reset to Default Code Icon</span>
                  </button>
                )}
              </div>

              {/* Logo Mode Buttons */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  DISPLAY STYLE
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {[
                    { id: 'image-wordmark', label: 'Image Logo + Wordmark Text', desc: 'Displays theme logo beside the brand text' },
                    { id: 'image-only', label: 'Image Logo Only', desc: 'Hides wordmark text, ideal for horizontal logo graphics' },
                    { id: 'icon-wordmark', label: 'Code Icon + Wordmark (Default)', desc: 'Displays terminal >_ icon beside brand name' },
                  ].map((mode) => {
                    const isSelected = logoMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setLogoMode(mode.id as any)}
                        style={{
                          flex: '1 1 200px',
                          textAlign: 'left',
                          padding: '10px 14px',
                          borderRadius: '3px',
                          border: isSelected ? '1px solid var(--accent-lime)' : '1px solid var(--border-subtle)',
                          backgroundColor: isSelected ? 'rgba(199, 255, 107, 0.08)' : 'var(--bg-elevated)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isSelected ? 'var(--accent-lime)' : 'var(--text-primary)' }}>
                            {mode.label}
                          </span>
                          {isSelected && <Check size={14} color="var(--accent-lime)" />}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {mode.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dual Theme Upload Slots: Dark Mode Logo & Light Mode Logo */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                {/* 🌙 Slot 1: Dark Mode Logo */}
                <div style={{ padding: '14px', backgroundColor: '#0d111a', border: '1px solid #1f273b', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Moon size={15} color="#c7ff6b" />
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F7F7F2' }}>
                        Dark Theme Logo
                      </span>
                    </div>
                    {darkLogoUrl && (
                      <button
                        type="button"
                        onClick={() => setDarkLogoUrl('')}
                        style={{ background: 'none', border: 'none', color: '#ff7676', fontSize: '0.7rem', cursor: 'pointer' }}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '0 0 10px 0', lineHeight: 1.35 }}>
                    Visible on dark backgrounds &amp; default view. Best with white, lime, or transparent artwork.
                  </p>

                  <input
                    ref={darkLogoFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleDarkLogoFileUpload}
                    style={{ display: 'none' }}
                  />
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <button
                      type="button"
                      disabled={isUploadingDark}
                      onClick={() => darkLogoFileInputRef.current?.click()}
                      className="btn btn-secondary"
                      style={{ flex: 1, padding: '0.55rem 0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem' }}
                    >
                      <UploadCloud size={14} />
                      <span>{isUploadingDark ? 'Uploading...' : 'Upload Dark Logo'}</span>
                    </button>
                  </div>

                  <div>
                    <label className="mono" style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      OR DARK LOGO URL:
                    </label>
                    <input
                      type="text"
                      value={darkLogoUrl}
                      onChange={(e) => {
                        setDarkLogoUrl(e.target.value);
                        if (e.target.value && logoMode === 'icon-wordmark') setLogoMode('image-wordmark');
                      }}
                      placeholder="https://.../logo-dark.png or /favicon.svg"
                      style={{
                        width: '100%',
                        padding: '0.55rem',
                        backgroundColor: 'var(--bg-input)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                        borderRadius: '2px',
                        fontSize: '0.75rem',
                      }}
                    />
                  </div>

                  {media && media.length > 0 && (
                    <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>From Media:</span>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            setDarkLogoUrl(e.target.value);
                            if (logoMode === 'icon-wordmark') setLogoMode('image-wordmark');
                          }
                        }}
                        style={{
                          padding: '3px 8px',
                          fontSize: '0.7rem',
                          backgroundColor: 'var(--bg-elevated)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-secondary)',
                          borderRadius: '2px',
                          maxWidth: '180px',
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>Choose asset...</option>
                        {media.map((asset) => (
                          <option key={asset.id} value={asset.url}>
                            {asset.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* ☀️ Slot 2: Light Theme Logo */}
                <div style={{ padding: '14px', backgroundColor: '#131824', border: '1px solid #232d42', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sun size={15} color="#ffa94d" />
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F7F7F2' }}>
                        Light Theme Logo
                      </span>
                    </div>
                    {lightLogoUrl && (
                      <button
                        type="button"
                        onClick={() => setLightLogoUrl('')}
                        style={{ background: 'none', border: 'none', color: '#ff7676', fontSize: '0.7rem', cursor: 'pointer' }}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '0 0 10px 0', lineHeight: 1.35 }}>
                    Visible when user switches to light mode. Best with dark, black, or high-contrast graphics.
                  </p>

                  <input
                    ref={lightLogoFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLightLogoFileUpload}
                    style={{ display: 'none' }}
                  />
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <button
                      type="button"
                      disabled={isUploadingLight}
                      onClick={() => lightLogoFileInputRef.current?.click()}
                      className="btn btn-secondary"
                      style={{ flex: 1, padding: '0.55rem 0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem' }}
                    >
                      <UploadCloud size={14} />
                      <span>{isUploadingLight ? 'Uploading...' : 'Upload Light Logo'}</span>
                    </button>
                  </div>

                  <div>
                    <label className="mono" style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      OR LIGHT LOGO URL:
                    </label>
                    <input
                      type="text"
                      value={lightLogoUrl}
                      onChange={(e) => {
                        setLightLogoUrl(e.target.value);
                        if (e.target.value && logoMode === 'icon-wordmark') setLogoMode('image-wordmark');
                      }}
                      placeholder="https://.../logo-light.png (Optional)"
                      style={{
                        width: '100%',
                        padding: '0.55rem',
                        backgroundColor: 'var(--bg-input)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                        borderRadius: '2px',
                        fontSize: '0.75rem',
                      }}
                    />
                  </div>

                  {media && media.length > 0 && (
                    <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>From Media:</span>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            setLightLogoUrl(e.target.value);
                            if (logoMode === 'icon-wordmark') setLogoMode('image-wordmark');
                          }
                        }}
                        style={{
                          padding: '3px 8px',
                          fontSize: '0.7rem',
                          backgroundColor: 'var(--bg-elevated)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-secondary)',
                          borderRadius: '2px',
                          maxWidth: '180px',
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>Choose asset...</option>
                        {media.map((asset) => (
                          <option key={asset.id} value={asset.url}>
                            {asset.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Sizing, Alt & Visibility Controls */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem', padding: '12px', backgroundColor: 'var(--bg-elevated)', borderRadius: '3px', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                      LOGO HEIGHT
                    </label>
                    <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-lime)', fontWeight: 700 }}>
                      {logoHeightPx}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={64}
                    value={logoHeightPx}
                    onChange={(e) => setLogoHeightPx(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-lime)', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    <span>20px (Compact)</span>
                    <span>34px (Standard)</span>
                    <span>64px (Large)</span>
                  </div>
                </div>

                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    LOGO ALT TEXT (ACCESSIBILITY)
                  </label>
                  <input
                    type="text"
                    value={logoAltText}
                    onChange={(e) => setLogoAltText(e.target.value)}
                    placeholder="e.g. BrackNodes Hosting Logo"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.65rem',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      borderRadius: '2px',
                      fontSize: '0.75rem',
                    }}
                  />
                </div>

                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    PLACEMENT VISIBILITY
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={logoShowInNavbar}
                        onChange={(e) => setLogoShowInNavbar(e.target.checked)}
                        style={{ accentColor: 'var(--accent-lime)' }}
                      />
                      <span>Show in Navbar (Header)</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={logoShowInFooter}
                        onChange={(e) => setLogoShowInFooter(e.target.checked)}
                        style={{ accentColor: 'var(--accent-lime)' }}
                      />
                      <span>Show in Website Footer</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Live Real-time Navbar Brand Preview for Both Themes */}
              <div>
                <label className="mono" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  <Eye size={13} color="var(--accent-lime)" />
                  <span>LIVE NAVBAR PREVIEW (DARK VS LIGHT)</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                  {/* Dark mode preview */}
                  <div style={{ padding: '14px 18px', backgroundColor: '#090B10', border: '1px solid #1f273b', borderRadius: '4px' }}>
                    <div className="mono" style={{ fontSize: '0.65rem', color: '#687799', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Moon size={11} color="var(--accent-lime)" />
                      <span>DARK BACKGROUND (USING {darkLogoUrl ? 'DARK LOGO' : lightLogoUrl ? 'LIGHT LOGO FALLBACK' : 'DEFAULT ICON'})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {(darkLogoUrl || lightLogoUrl) && logoMode !== 'icon-wordmark' ? (
                        <img
                          src={darkLogoUrl || lightLogoUrl}
                          alt={logoAltText || 'Logo Dark Preview'}
                          style={{
                            height: `${logoHeightPx}px`,
                            width: 'auto',
                            maxHeight: '48px',
                            objectFit: 'contain',
                            borderRadius: '3px',
                          }}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            background: 'rgba(199, 255, 107, 0.1)',
                            border: '1px solid rgba(199, 255, 107, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '3px',
                            color: 'var(--accent-lime)',
                            flexShrink: 0,
                          }}
                        >
                          <Terminal size={17} strokeWidth={2.2} />
                        </div>
                      )}
                      {logoMode !== 'image-only' && (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', color: '#F7F7F2', lineHeight: 1.1 }}>
                            {wordmark || 'BRACKNODES'}
                          </span>
                          <span className="mono" style={{ fontSize: '0.575rem', color: '#9FA8BC', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            {role || 'Next-Gen Cloud & Discord Bot Hosting'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Light mode preview */}
                  <div style={{ padding: '14px 18px', backgroundColor: '#F7F8FA', border: '1px solid #d5dae2', borderRadius: '4px' }}>
                    <div className="mono" style={{ fontSize: '0.65rem', color: '#7a869a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Sun size={11} color="#ffa94d" />
                      <span>LIGHT BACKGROUND (USING {lightLogoUrl ? 'LIGHT LOGO' : darkLogoUrl ? 'DARK LOGO FALLBACK' : 'DEFAULT ICON'})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {(lightLogoUrl || darkLogoUrl) && logoMode !== 'icon-wordmark' ? (
                        <img
                          src={lightLogoUrl || darkLogoUrl}
                          alt={logoAltText || 'Logo Light Preview'}
                          style={{
                            height: `${logoHeightPx}px`,
                            width: 'auto',
                            maxHeight: '48px',
                            objectFit: 'contain',
                            borderRadius: '3px',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            background: 'rgba(0,0,0,0.06)',
                            border: '1px solid rgba(0,0,0,0.12)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '3px',
                            color: '#1a1f2c',
                            flexShrink: 0,
                          }}
                        >
                          <Terminal size={17} strokeWidth={2.2} />
                        </div>
                      )}
                      {logoMode !== 'image-only' && (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', color: '#11151f', lineHeight: 1.1 }}>
                            {wordmark || 'BRACKNODES'}
                          </span>
                          <span className="mono" style={{ fontSize: '0.575rem', color: '#687799', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            {role || 'Next-Gen Cloud & Discord Bot Hosting'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  BRAND NAME
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px' }}
                />
              </div>

              <div>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  WORDMARK (NAV LOGO)
                </label>
                <input
                  type="text"
                  value={wordmark}
                  onChange={(e) => setWordmark(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px' }}
                />
              </div>

              <div>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  PROFESSIONAL ROLE / TITLE
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px' }}
                />
              </div>

              <div>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  STUDIO LOCATION &amp; TIMEZONE
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  HERO LIVE STATUS BADGE
                </label>
                <input
                  type="text"
                  value={statusBadge}
                  onChange={(e) => setStatusBadge(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  PRIMARY INQUIRY EMAIL
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            02. NAVBAR & HEADER LINKS
            ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'navbar') && (
          <div className="card-surface" style={{ padding: '1.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="mono" style={{ color: 'var(--accent-lime)', fontSize: '0.875rem' }}>02.</span> Header &amp; Navigation Bar
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '1.5rem' }}>
              Rename any navigation item link or the desktop/mobile CTA button.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  NAV LINK 1 (WORK)
                </label>
                <input
                  type="text"
                  value={workNavLabel}
                  onChange={(e) => setWorkNavLabel(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  NAV LINK 2 (ABOUT)
                </label>
                <input
                  type="text"
                  value={aboutNavLabel}
                  onChange={(e) => setAboutNavLabel(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  NAV LINK 3 (SERVICES)
                </label>
                <input
                  type="text"
                  value={servicesNavLabel}
                  onChange={(e) => setServicesNavLabel(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  NAV LINK 4 (SKILLS)
                </label>
                <input
                  type="text"
                  value={skillsNavLabel}
                  onChange={(e) => setSkillsNavLabel(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  NAV LINK 5 (PROCESS)
                </label>
                <input
                  type="text"
                  value={processNavLabel}
                  onChange={(e) => setProcessNavLabel(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  NAV LINK 6 (CONTACT)
                </label>
                <input
                  type="text"
                  value={contactNavLabel}
                  onChange={(e) => setContactNavLabel(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div>
                <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  NAV CTA BUTTON TEXT
                </label>
                <input
                  type="text"
                  value={navbarCtaText}
                  onChange={(e) => setNavbarCtaText(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--accent-lime)', borderRadius: '2px', fontWeight: 700 }}
                />
              </div>
              <div>
                <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  NAV CTA BUTTON LINK (URL or #anchor)
                </label>
                <input
                  type="text"
                  value={navbarCtaLink}
                  onChange={(e) => setNavbarCtaLink(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            03. HERO SECTION & CALL-TO-ACTIONS
            ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'hero') && (
          <div className="card-surface" style={{ padding: '1.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="mono" style={{ color: 'var(--accent-lime)', fontSize: '0.875rem' }}>03.</span> Hero Section &amp; CTAs
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '1.5rem' }}>
              The high-impact headline, subtext narrative, primary/secondary action buttons, 4 micro stat cards, and running marquee ticker.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  HERO MAIN HEADLINE (Tip: wrap words in *word* or [word] for glowing gradient)
                </label>
                <textarea
                  rows={2}
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontWeight: 700, fontSize: '1.1rem' }}
                />
              </div>

              <div>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  HERO EDITORIAL SUBHEADING / INTRO
                </label>
                <textarea
                  rows={3}
                  value={subheading}
                  onChange={(e) => setSubheading(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px' }}
                />
              </div>

              {/* CTAs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-input)', borderRadius: '2px', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--accent-lime)', marginBottom: '4px' }}>
                    PRIMARY BUTTON TEXT
                  </label>
                  <input
                    type="text"
                    value={primaryCtaText}
                    onChange={(e) => setPrimaryCtaText(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px' }}
                  />
                  <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '8px', marginBottom: '4px' }}>
                    PRIMARY LINK (URL / #anchor)
                  </label>
                  <input
                    type="text"
                    value={primaryCtaLink}
                    onChange={(e) => setPrimaryCtaLink(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px' }}
                  />
                </div>

                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--accent-blue)', marginBottom: '4px' }}>
                    SECONDARY BUTTON TEXT
                  </label>
                  <input
                    type="text"
                    value={secondaryCtaText}
                    onChange={(e) => setSecondaryCtaText(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px' }}
                  />
                  <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '8px', marginBottom: '4px' }}>
                    SECONDARY LINK (URL / #anchor)
                  </label>
                  <input
                    type="text"
                    value={secondaryCtaLink}
                    onChange={(e) => setSecondaryCtaLink(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px' }}
                  />
                </div>
              </div>

              {/* 4 Micro Stat Cards */}
              <div>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  4 HERO STAT CARDS (BOTTOM OF HERO)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                  {heroStats.map((stat, idx) => (
                    <div key={idx} style={{ padding: '0.75rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '2px' }}>
                      <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--accent-lime)', marginBottom: '4px' }}>
                        STAT #{idx + 1}
                      </div>
                      <input
                        type="text"
                        placeholder="Value (e.g. 5+)"
                        value={stat.value}
                        onChange={(e) => {
                          const copy = [...heroStats];
                          copy[idx] = { ...copy[idx], value: e.target.value };
                          setHeroStats(copy);
                        }}
                        style={{ width: '100%', padding: '0.45rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '6px' }}
                      />
                      <input
                        type="text"
                        placeholder="Label (e.g. Years Engineering)"
                        value={stat.label}
                        onChange={(e) => {
                          const copy = [...heroStats];
                          copy[idx] = { ...copy[idx], label: e.target.value };
                          setHeroStats(copy);
                        }}
                        style={{ width: '100%', padding: '0.45rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '0.75rem' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Running Marquee Ticker */}
              <div>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  RUNNING MARQUEE TICKER PHRASES (Comma-separated)
                </label>
                <textarea
                  rows={2}
                  value={marqueeItemsStr}
                  onChange={(e) => setMarqueeItemsStr(e.target.value)}
                  placeholder="DISCORD BOT HOSTING, NVME CPANEL HOSTING, 99.99% UPTIME SLA, PTERODACTYL PANEL..."
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                />
              </div>

              {/* 3D Scene Direct Shortcut Banner */}
              {onNavigate && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    backgroundColor: 'rgba(199, 255, 107, 0.05)',
                    border: '1px solid rgba(199, 255, 107, 0.25)',
                    borderRadius: '3px',
                    gap: '12px',
                    flexWrap: 'wrap',
                    marginTop: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Box size={20} color="var(--accent-lime)" />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F7F7F2' }}>
                        Need to edit the Interactive 3D Model in the Hero?
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Customize the rotating 3D geometry (Icosahedron, Wireframe, rotation speed, particles &amp; glow colors) in the 3D Model Editor.
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('hero-3d')}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <span>Open 3D Model Editor</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            04. ABOUT STUDIO & NARRATIVE
            ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'about') && (
          <div className="card-surface" style={{ padding: '1.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="mono" style={{ color: 'var(--accent-lime)', fontSize: '0.875rem' }}>04.</span> About Section &amp; Studio Philosophy
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '1.5rem' }}>
              Narrative copy, high-impact studio metrics, 4 engineering pillars, and the interactive terminal prompt.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Heading config */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    ABOUT SECTION TAG
                  </label>
                  <input
                    type="text"
                    value={aboutTag}
                    onChange={(e) => setAboutTag(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    ABOUT SECTION TITLE
                  </label>
                  <input
                    type="text"
                    value={aboutTitle}
                    onChange={(e) => setAboutTitle(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--accent-blue)', borderRadius: '2px', fontWeight: 700 }}
                  />
                </div>
              </div>

              <div>
                <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  ABOUT SECTION SUBTITLE
                </label>
                <input
                  type="text"
                  value={aboutSubtitle}
                  onChange={(e) => setAboutSubtitle(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px' }}
                />
              </div>

              {/* Narrative Headline */}
              <div>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  NARRATIVE HEADLINE (UPPERCASE EDITORIAL CALLOUT)
                </label>
                <textarea
                  rows={2}
                  value={aboutNarrativeHeading}
                  onChange={(e) => setAboutNarrativeHeading(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontWeight: 700 }}
                />
              </div>

              {/* Paragraphs 1 & 2 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    PARAGRAPH 1 (EXPERIENCE &amp; BACKGROUND)
                  </label>
                  <textarea
                    rows={4}
                    value={aboutParagraph1}
                    onChange={(e) => setAboutParagraph1(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontSize: '0.8125rem' }}
                  />
                </div>
                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    PARAGRAPH 2 (ARCHITECTURE &amp; EXPLORATION)
                  </label>
                  <textarea
                    rows={4}
                    value={aboutParagraph2}
                    onChange={(e) => setAboutParagraph2(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontSize: '0.8125rem' }}
                  />
                </div>
              </div>

              {/* 4 About Stats */}
              <div>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  4 STUDIO STATISTIC CARDS (ABOUT TOP ROW)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                  {aboutStats.map((stat, idx) => (
                    <div key={idx} style={{ padding: '0.75rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '2px' }}>
                      <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--accent-blue)', marginBottom: '4px' }}>
                        METRIC #{idx + 1}
                      </div>
                      <input
                        type="text"
                        placeholder="Value (e.g. 40+)"
                        value={stat.value}
                        onChange={(e) => {
                          const copy = [...aboutStats];
                          copy[idx] = { ...copy[idx], value: e.target.value };
                          setAboutStats(copy);
                        }}
                        style={{ width: '100%', padding: '0.45rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '6px' }}
                      />
                      <input
                        type="text"
                        placeholder="Label"
                        value={stat.label}
                        onChange={(e) => {
                          const copy = [...aboutStats];
                          copy[idx] = { ...copy[idx], label: e.target.value };
                          setAboutStats(copy);
                        }}
                        style={{ width: '100%', padding: '0.45rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '6px' }}
                      />
                      <input
                        type="text"
                        placeholder="Sublabel details"
                        value={stat.sub}
                        onChange={(e) => {
                          const copy = [...aboutStats];
                          copy[idx] = { ...copy[idx], sub: e.target.value };
                          setAboutStats(copy);
                        }}
                        style={{ width: '100%', padding: '0.45rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.7rem' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 4 Pillars */}
              <div>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  4 PHILOSOPHY &amp; ENGINEERING PILLARS
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                  {aboutPillars.map((pillar, idx) => (
                    <div key={idx} style={{ padding: '0.75rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '2px' }}>
                      <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--accent-lime)', marginBottom: '4px' }}>
                        PILLAR 0{idx + 1}
                      </div>
                      <input
                        type="text"
                        placeholder="Pillar Title"
                        value={pillar.title}
                        onChange={(e) => {
                          const copy = [...aboutPillars];
                          copy[idx] = { ...copy[idx], title: e.target.value };
                          setAboutPillars(copy);
                        }}
                        style={{ width: '100%', padding: '0.45rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '6px' }}
                      />
                      <textarea
                        rows={3}
                        placeholder="Description..."
                        value={pillar.text}
                        onChange={(e) => {
                          const copy = [...aboutPillars];
                          copy[idx] = { ...copy[idx], text: e.target.value };
                          setAboutPillars(copy);
                        }}
                        style={{ width: '100%', padding: '0.45rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '0.75rem' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Terminal Prompt */}
              <div>
                <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  INTERACTIVE TERMINAL PROMPT STRING
                </label>
                <input
                  type="text"
                  value={terminalPrompt}
                  onChange={(e) => setTerminalPrompt(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--accent-lime)', borderRadius: '2px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            05. SECTION TITLES & TAGS
            ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'headings') && (
          <div className="card-surface" style={{ padding: '1.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="mono" style={{ color: 'var(--accent-lime)', fontSize: '0.875rem' }}>05.</span> Section Titles &amp; Headings
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '1.5rem' }}>
              Customize the section tag badges, primary titles, and descriptive subtitles across every major section on the homepage.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Projects */}
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-input)', borderRadius: '2px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-lime)', fontWeight: 700 }}>
                    [01] HOSTING PLANS &amp; PROJECTS SECTION
                  </div>
                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => onNavigate('projects')}
                      className="mono"
                      style={{
                        fontSize: '0.7rem',
                        padding: '4px 10px',
                        background: 'rgba(199,255,107,0.1)',
                        border: '1px solid var(--accent-lime)',
                        color: 'var(--accent-lime)',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <FolderGit2 size={12} />
                      <span>Edit Hosting Plan Cards &amp; Pricing →</span>
                    </button>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '8px' }}>
                  <div>
                    <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      TAG / BADGE
                    </label>
                    <input
                      type="text"
                      value={projectsTag}
                      onChange={(e) => setProjectsTag(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div>
                    <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      SECTION TITLE
                    </label>
                    <input
                      type="text"
                      value={projectsTitle}
                      onChange={(e) => setProjectsTitle(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--accent-lime)', borderRadius: '2px', fontWeight: 700, fontSize: '0.875rem' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    SUBTITLE / DESCRIPTION
                  </label>
                  <input
                    type="text"
                    value={projectsSubtitle}
                    onChange={(e) => setProjectsSubtitle(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontSize: '0.8125rem' }}
                  />
                </div>
              </div>

              {/* Services */}
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-input)', borderRadius: '2px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', fontWeight: 700 }}>
                    [02] CLOUD SERVICES &amp; CAPABILITIES SECTION
                  </div>
                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => onNavigate('services')}
                      className="mono"
                      style={{
                        fontSize: '0.7rem',
                        padding: '4px 10px',
                        background: 'rgba(177,156,217,0.1)',
                        border: '1px solid var(--accent-purple)',
                        color: 'var(--accent-purple)',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Briefcase size={12} />
                      <span>Edit Services &amp; Deliverables →</span>
                    </button>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '8px' }}>
                  <div>
                    <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      TAG / BADGE
                    </label>
                    <input
                      type="text"
                      value={servicesTag}
                      onChange={(e) => setServicesTag(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div>
                    <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      SECTION TITLE
                    </label>
                    <input
                      type="text"
                      value={servicesTitle}
                      onChange={(e) => setServicesTitle(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--accent-purple)', borderRadius: '2px', fontWeight: 700, fontSize: '0.875rem' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    SUBTITLE / DESCRIPTION
                  </label>
                  <input
                    type="text"
                    value={servicesSubtitle}
                    onChange={(e) => setServicesSubtitle(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontSize: '0.8125rem' }}
                  />
                </div>
              </div>

              {/* Skills */}
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-input)', borderRadius: '2px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', fontWeight: 700 }}>
                    [03] INFRASTRUCTURE &amp; STACK SECTION
                  </div>
                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => onNavigate('skills')}
                      className="mono"
                      style={{
                        fontSize: '0.7rem',
                        padding: '4px 10px',
                        background: 'rgba(112,185,255,0.1)',
                        border: '1px solid var(--accent-blue)',
                        color: 'var(--accent-blue)',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Layers size={12} />
                      <span>Edit Tech Stack &amp; Hypervisors →</span>
                    </button>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '8px' }}>
                  <div>
                    <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      TAG / BADGE
                    </label>
                    <input
                      type="text"
                      value={skillsTag}
                      onChange={(e) => setSkillsTag(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div>
                    <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      SECTION TITLE
                    </label>
                    <input
                      type="text"
                      value={skillsTitle}
                      onChange={(e) => setSkillsTitle(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--accent-blue)', borderRadius: '2px', fontWeight: 700, fontSize: '0.875rem' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    SUBTITLE / DESCRIPTION
                  </label>
                  <input
                    type="text"
                    value={skillsSubtitle}
                    onChange={(e) => setSkillsSubtitle(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontSize: '0.8125rem' }}
                  />
                </div>
              </div>

              {/* Process */}
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-input)', borderRadius: '2px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-lime)', fontWeight: 700 }}>
                    [04] PROVISIONING PROCESS WORKFLOW SECTION
                  </div>
                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => onNavigate('process')}
                      className="mono"
                      style={{
                        fontSize: '0.7rem',
                        padding: '4px 10px',
                        background: 'rgba(199,255,107,0.1)',
                        border: '1px solid var(--accent-lime)',
                        color: 'var(--accent-lime)',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <GitBranch size={12} />
                      <span>Edit 5-Step Process Workflow →</span>
                    </button>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '8px' }}>
                  <div>
                    <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      TAG / BADGE
                    </label>
                    <input
                      type="text"
                      value={processTag}
                      onChange={(e) => setProcessTag(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div>
                    <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      SECTION TITLE
                    </label>
                    <input
                      type="text"
                      value={processTitle}
                      onChange={(e) => setProcessTitle(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--accent-lime)', borderRadius: '2px', fontWeight: 700, fontSize: '0.875rem' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    SUBTITLE / DESCRIPTION
                  </label>
                  <input
                    type="text"
                    value={processSubtitle}
                    onChange={(e) => setProcessSubtitle(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontSize: '0.8125rem' }}
                  />
                </div>
              </div>

              {/* Testimonials */}
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-input)', borderRadius: '2px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', fontWeight: 700 }}>
                    [05] CUSTOMER REVIEWS &amp; TESTIMONIALS SECTION
                  </div>
                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => onNavigate('testimonials')}
                      className="mono"
                      style={{
                        fontSize: '0.7rem',
                        padding: '4px 10px',
                        background: 'rgba(112,185,255,0.1)',
                        border: '1px solid var(--accent-blue)',
                        color: 'var(--accent-blue)',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Star size={12} />
                      <span>Edit Customer Reviews &amp; Ratings →</span>
                    </button>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '8px' }}>
                  <div>
                    <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      TAG / BADGE
                    </label>
                    <input
                      type="text"
                      value={testimonialsTag}
                      onChange={(e) => setTestimonialsTag(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div>
                    <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      SECTION TITLE
                    </label>
                    <input
                      type="text"
                      value={testimonialsTitle}
                      onChange={(e) => setTestimonialsTitle(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--accent-blue)', borderRadius: '2px', fontWeight: 700, fontSize: '0.875rem' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    SUBTITLE / DESCRIPTION
                  </label>
                  <input
                    type="text"
                    value={testimonialsSubtitle}
                    onChange={(e) => setTestimonialsSubtitle(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontSize: '0.8125rem' }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            06. ARCHITECTURE NOTES (IN SKILLS SECTION)
            ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'arch') && (
          <div className="card-surface" style={{ padding: '1.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="mono" style={{ color: 'var(--accent-lime)', fontSize: '0.875rem' }}>06.</span> Skills Section Architecture Snippets
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '1.5rem' }}>
              The 4 code snippet cards rendered in the Skills &amp; Architecture section under &quot;Architecture Principles&quot;.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {archNotes.map((note, idx) => (
                <div key={idx} style={{ padding: '0.75rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '2px' }}>
                  <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--accent-lime)', marginBottom: '4px' }}>
                    SNIPPET #{idx + 1}
                  </div>
                  <input
                    type="text"
                    placeholder="Snippet Title"
                    value={note.title}
                    onChange={(e) => {
                      const copy = [...archNotes];
                      copy[idx] = { ...copy[idx], title: e.target.value };
                      setArchNotes(copy);
                    }}
                    style={{ width: '100%', padding: '0.45rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '6px' }}
                  />
                  <textarea
                    rows={4}
                    placeholder="Code snippet..."
                    value={note.code}
                    onChange={(e) => {
                      const copy = [...archNotes];
                      copy[idx] = { ...copy[idx], code: e.target.value };
                      setArchNotes(copy);
                    }}
                    style={{ width: '100%', padding: '0.45rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--accent-lime)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            07. SOCIAL MEDIA PLATFORMS
            ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'socials') && (
          <div className="card-surface" style={{ padding: '1.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="mono" style={{ color: 'var(--accent-lime)', fontSize: '0.875rem' }}>07.</span> Social Media Channels
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginTop: '2px' }}>
                  Add, customize, enable or delete social profiles shown in the footer and contact area.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingSocial(!isAddingSocial)}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
              >
                <Plus size={14} />
                <span>Add Channel</span>
              </button>
            </div>

            {/* Quick Presets */}
            {isAddingSocial && (
              <div style={{ backgroundColor: 'var(--bg-input)', padding: '1.25rem', borderRadius: '4px', border: '1px dashed var(--accent-lime)', marginBottom: '1.5rem' }}>
                <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-lime)', marginBottom: '0.75rem' }}>
                  ADD NEW SOCIAL CHANNEL
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
                  {socialPresets.map((preset) => (
                    <button
                      key={preset.platform}
                      type="button"
                      onClick={() => {
                        setNewPlatform(preset.platform);
                        setNewLabel(preset.label);
                        setNewColor(preset.color);
                        setNewUrl(preset.defaultUrl);
                      }}
                      className="mono"
                      style={{
                        padding: '4px 10px',
                        fontSize: '0.7rem',
                        backgroundColor: newPlatform === preset.platform ? 'var(--accent-lime-muted)' : 'var(--bg-elevated)',
                        color: newPlatform === preset.platform ? 'var(--accent-lime)' : 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '2px',
                        cursor: 'pointer',
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      LABEL
                    </label>
                    <input
                      type="text"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px' }}
                    />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      PROFILE URL
                    </label>
                    <input
                      type="text"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="https://..."
                      style={{ width: '100%', padding: '0.5rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px' }}
                    />
                  </div>
                  <div>
                    <label className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      HEX COLOR
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="color"
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                        style={{ width: '36px', height: '36px', padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                        style={{ flex: 1, padding: '0.5rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setIsAddingSocial(false)} className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}>
                    Cancel
                  </button>
                  <button type="button" onClick={handleAddSocial} className="btn btn-primary" style={{ padding: '0.4rem 1.25rem', fontSize: '0.75rem' }}>
                    Confirm &amp; Add
                  </button>
                </div>
              </div>
            )}

            {/* Existing Links List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {socialLinks.map((social) => (
                <div
                  key={social.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '2px',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '160px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '4px', backgroundColor: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <SocialIcon platform={social.platform} size={15} color={social.color || 'var(--text-primary)'} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{social.label}</div>
                      <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{social.platform}</div>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={social.url}
                    onChange={(e) => updateSocialLink(social.id, { url: e.target.value })}
                    style={{ flex: 1, padding: '0.45rem 0.65rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontSize: '0.8rem' }}
                  />

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={social.isEnabled !== false}
                        onChange={(e) => updateSocialLink(social.id, { isEnabled: e.target.checked })}
                      />
                      <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Show</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => deleteSocialLink(social.id)}
                      title="Delete channel"
                      style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            08. FOOTER & SITE DETAILS
            ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'footer') && (
          <div className="card-surface" style={{ padding: '1.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="mono" style={{ color: 'var(--accent-lime)', fontSize: '0.875rem' }}>08.</span> Footer &amp; Copyright Details
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '1.5rem' }}>
              Modify the bottom descriptive tagline, studio status indicator, back-to-top trigger, and copyright statements.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  FOOTER BRAND TAGLINE / DESCRIPTIVE COPY
                </label>
                <textarea
                  rows={3}
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    COPYRIGHT NOTICE
                  </label>
                  <input
                    type="text"
                    value={copyrightText}
                    onChange={(e) => setCopyrightText(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px' }}
                  />
                </div>

                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    STATUS BADGE TEXT (E.G. STUDIO ONLINE)
                  </label>
                  <input
                    type="text"
                    value={statusBadgeText}
                    onChange={(e) => setStatusBadgeText(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px' }}
                  />
                </div>

                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    BACK TO TOP BUTTON TEXT
                  </label>
                  <input
                    type="text"
                    value={backToTopText}
                    onChange={(e) => setBackToTopText(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px' }}
                  />
                </div>
              </div>

              {/* BrackNodes Protected Attribution Notice */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0.875rem 1rem', backgroundColor: 'rgba(255, 180, 0, 0.05)', border: '1px solid rgba(255, 180, 0, 0.25)', borderRadius: '4px' }}>
                <ShieldAlert size={18} style={{ color: '#f59e0b', flexShrink: 0 }} />
                <div style={{ fontSize: '0.785rem', color: 'var(--text-secondary)' }}>
                  <strong style={{ color: '#f59e0b' }}>Permanently Locked System Attribution:</strong> &quot;Designed &amp; Engineered by BrackNodes&quot; is locked and cannot be altered from the admin panel as requested.
                </div>
              </div>

              {/* Inquire Form Jump Banner */}
              {onNavigate && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    backgroundColor: 'rgba(112, 185, 255, 0.05)',
                    border: '1px solid rgba(112, 185, 255, 0.25)',
                    borderRadius: '4px',
                    gap: '12px',
                    flexWrap: 'wrap',
                    marginTop: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MessageSquare size={18} color="var(--accent-blue)" />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F7F7F2' }}>
                        Need to edit Contact &amp; Inquire Form Options?
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Manage project/service dropdowns, budget options, SLA guarantee badge, and auto-reply success messages.
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('inquire-form')}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <span>Configure Inquire Form</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Global Save Action Bar */}
        <div style={{ position: 'sticky', bottom: '1.5rem', zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-medium)', borderRadius: '4px', boxShadow: 'var(--shadow-lg)' }}>
          <div>
            {savedSuccess ? (
              <span className="mono" style={{ color: 'var(--accent-lime)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={18} /> ALL HOMEPAGE CHANGES SAVED AND LIVE ON SITE
              </span>
            ) : (
              <span className="mono" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                Changes will immediately reflect on the public landing page upon saving.
              </span>
            )}
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.875rem 2.25rem' }}>
            <Save size={16} />
            <span>Save All Homepage Updates</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  longDescription: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
  accentColor: string;
  previewType: 'interactive-canvas' | 'code-visualizer' | 'telemetry-dashboard' | 'custom-image' | 'custom-code' | 'none';
  previewImage?: string;
  customPreviewCode?: string;
  thumbnailUrl?: string;
  galleryUrls?: string[];
  displayOrder: number;
  isPublished: boolean;
}

export interface Service {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  outcomes: string[];
  highlight: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface SkillItem {
  id: string;
  category: string;
  name: string;
  tag: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface SkillCategory {
  name: string;
  description: string;
  skills: { name: string; tag: string; level?: string }[];
}

export interface ProcessStep {
  id: string;
  step: string;
  title: string;
  phase: string;
  description: string;
  outputs: string[];
  displayOrder: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatarUrl?: string;
  rating: number;
  isPublished: boolean;
  displayOrder: number;
}

export interface ExperienceItem {
  id: string;
  type: 'experience' | 'education';
  position: string;
  organization: string;
  period: string;
  description: string;
  isCurrent: boolean;
  displayOrder: number;
  isPublished: boolean;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  projectType: string;
  budget?: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  sizeBytes: number;
  mimeType: string;
  createdAt: string;
}

export interface DesignTheme {
  primaryAccent: string;
  secondaryAccent: string;
  bgPrimary: string;
  bgElevated: string;
  textPrimary: string;
  textSecondary: string;
  borderRadius: string;
  themeName: string;
}

export interface InquireFormSettings {
  sectionTag: string;
  sectionTitle: string;
  sectionSubtitle: string;
  pitchHeadline: string;
  pitchDescription: string;
  projectTypes: string[];
  budgetOptions: string[];
  submitButtonText: string;
  successMessage: string;
  responseSla: string;
  confidentialityNotice: string;
  nameLabel?: string;
  namePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  projectFocusLabel?: string;
  budgetLabel?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  disclaimerText?: string;
}

export interface FontItem {
  id: string;
  name: string;
  family: string;
  category: 'sans-serif' | 'serif' | 'monospace' | 'display' | 'handwriting';
  source: 'google' | 'system' | 'custom';
  url?: string;
}

export interface SectionFonts {
  globalBody: string;
  globalHeading: string;
  globalMono: string;
  navbar: string;
  hero: string;
  heroTitle: string;
  projects: string;
  about: string;
  services: string;
  skills: string;
  process: string;
  testimonials: string;
  contact: string;
  footer: string;
}

export interface TypographySettings {
  customFonts: FontItem[];
  sectionFonts: SectionFonts;
}

export interface CustomCodeSettings {
  isEnabled: boolean;
  customCss: string;
  headJs: string;
  bodyJs: string;
}

export interface SocialLinkItem {
  id: string;
  platform: string; // 'github' | 'linkedin' | 'instagram' | 'x' | 'youtube' | 'discord' | 'telegram' | 'dribbble' | 'behance' | 'twitch' | 'tiktok' | 'facebook' | 'custom'
  label: string;
  url: string;
  color?: string;
  isEnabled?: boolean;
}

export type CollaboratorRole = 'admin' | 'editor' | 'viewer' | 'custom';

export interface CollaboratorPermissions {
  canManageProjects: boolean;
  canManageServices: boolean;
  canManageSkills: boolean;
  canManageContent: boolean;
  canViewInquiries: boolean;
  canManageInquireForm: boolean;
  canManageDesign: boolean;
  canManageMedia: boolean;
  canManageSecurity: boolean;
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: CollaboratorRole;
  permissions: CollaboratorPermissions;
  status: 'active' | 'invited' | 'suspended';
  invitedAt: string;
  lastActive?: string;
}

export interface SystemUpdateInfo {
  currentVersion: string;
  latestVersion: string;
  hasUpdate: boolean;
  releaseTitle?: string;
  releaseNotes?: string;
  publishedAt?: string;
  htmlUrl?: string;
}

export interface SiteSettings {
  brandName: string;
  wordmark: string;
  role: string;
  tagline: string;
  subheading: string;
  statusBadge: string;
  location: string;
  email: string;
  phone?: string;
  socials: {
    github: string;
    linkedin: string;
    instagram?: string;
    x?: string;
  };
  socialLinks?: SocialLinkItem[];
  collaborators?: Collaborator[];
  seo: {
    title: string;
    description: string;
    canonicalDomain: string;
    keywords?: string;
    ogImage?: string;
    starterPrice?: string;
    currency?: string;
    customRobotsTxt?: string;
    faqItems?: { id: string; question: string; answer: string }[];
  };
  footerText: string;
  copyrightText: string;
  navVisibility: {
    work: boolean;
    about: boolean;
    services: boolean;
    skills: boolean;
    process: boolean;
    testimonials: boolean;
    experience: boolean;
    contact: boolean;
  };
  designTheme: DesignTheme;
  adminPath: string;
  inquireForm: InquireFormSettings;
  typography: TypographySettings;
  customCode: CustomCodeSettings;
  themeSettings?: {
    themeMode: 'both' | 'dark-only' | 'light-only';
    defaultTheme: 'dark' | 'light';
  };
  updateSettings?: {
    githubRepo: string;
    deployWebhookUrl?: string;
    autoCheckUpdates: boolean;
    lastCheckedVersion?: string;
    lastCheckedDate?: string;
  };
  logoSettings?: LogoSettings;
  hero3D?: Hero3DSettings;
  sectionHeadings?: SectionHeadings;
  heroSettings?: HeroSettings;
  navbarSettings?: NavbarSettings;
  aboutSettings?: AboutSettings;
  architectureNotes?: ArchitectureNote[];
  footerSettings?: FooterSettings;
}

export interface LogoSettings {
  mode: 'image-wordmark' | 'image-only' | 'icon-wordmark';
  imageUrl?: string;
  darkImageUrl?: string;
  lightImageUrl?: string;
  heightPx?: number;
  altText?: string;
  showInNavbar?: boolean;
  showInFooter?: boolean;
}

export interface HeroStatCard {
  value: string;
  label: string;
}

export interface HeroSettings {
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  marqueeItems?: string[];
  stats?: HeroStatCard[];
}

export interface NavbarSettings {
  workLabel?: string;
  aboutLabel?: string;
  servicesLabel?: string;
  skillsLabel?: string;
  processLabel?: string;
  contactLabel?: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface AboutStat {
  value: string;
  label: string;
  sub: string;
}

export interface AboutPillar {
  title: string;
  text: string;
}

export interface AboutSettings {
  narrativeHeading?: string;
  narrativeParagraph1?: string;
  narrativeParagraph2?: string;
  stats?: AboutStat[];
  pillars?: AboutPillar[];
  terminalPrompt?: string;
  terminalLines?: { key: string; val: string }[];
}

export interface ArchitectureNote {
  title: string;
  code: string;
}

export interface FooterSettings {
  statusBadgeText?: string;
  backToTopText?: string;
}

export interface ProjectFilterTab {
  id?: string;
  label: string;
  key: string;
}

export interface SectionHeadingConfig {
  tag?: string;
  title?: string;
  subtitle?: string;
  filterTabs?: ProjectFilterTab[];
}

export interface SectionHeadings {
  about?: SectionHeadingConfig;
  projects?: SectionHeadingConfig;
  services?: SectionHeadingConfig;
  skills?: SectionHeadingConfig;
  process?: SectionHeadingConfig;
  testimonials?: SectionHeadingConfig;
  experience?: SectionHeadingConfig;
  contact?: SectionHeadingConfig;
}

export type Hero3DGeometry =
  | 'icosahedron'
  | 'torus_knot'
  | 'octahedron'
  | 'dodecahedron'
  | 'sphere'
  | 'box'
  | 'torus';

export interface Hero3DSettings {
  geometry: Hero3DGeometry;
  wireframeOnly?: boolean;
  wireframeOverlay?: boolean;
  showRings?: boolean;
  showParticles?: boolean;
  particleCount?: number;
  rotationSpeed?: number;
  autoSpin?: boolean;
  mouseReactivity?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  roughness?: number;
  metalness?: number;
  scale?: number;
}

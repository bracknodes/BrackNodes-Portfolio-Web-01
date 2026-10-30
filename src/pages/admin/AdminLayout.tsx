import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
import {
  LayoutDashboard,
  FolderGit2,
  Briefcase,
  Cpu,
  FileText,
  Award,
  GraduationCap,
  Palette,
  Image as ImageIcon,
  Inbox,
  Shield,
  Type,
  Code2,
  LogOut,
  ExternalLink,
  Menu,
  X,
  CheckCircle2,
  Loader2,
  ChevronRight,
  Users,
  BookOpen,
  RefreshCw,
  Box,
  GitBranch,
  Globe,
  Zap,
  Headphones,
} from 'lucide-react';

// Sub-view component imports
import { OverviewView } from './views/OverviewView';
import { ProjectsView } from './views/ProjectsView';
import { ServicesView } from './views/ServicesView';
import { SkillsView } from './views/SkillsView';
import { ProcessView } from './views/ProcessView';
import { ContentEditorView } from './views/ContentEditorView';
import { TestimonialsView } from './views/TestimonialsView';
import { ExperienceView } from './views/ExperienceView';
import { DesignView } from './views/DesignView';
import { Hero3DEditorView } from './views/Hero3DEditorView';
import { TypographyView } from './views/TypographyView';
import { CustomCodeView } from './views/CustomCodeView';
import { SeoDomainView } from './views/SeoDomainView';
import { InquiriesView } from './views/InquiriesView';
import { InquireFormView } from './views/InquireFormView';
import { MediaView } from './views/MediaView';
import { SecurityView } from './views/SecurityView';
import { CollaboratorsView } from './views/CollaboratorsView';
import { KnowledgeView } from './views/KnowledgeView';
import { UpdatesView } from './views/UpdatesView';
import { SupportFeedbackView } from './views/SupportFeedbackView';
import { BrackNodesAdBanner, BrackNodesSidebarCard } from '../../components/admin/BrackNodesAdBanner';

export type AdminTab =
  | 'overview'
  | 'content'
  | 'projects'
  | 'services'
  | 'skills'
  | 'process'
  | 'experience'
  | 'testimonials'
  | 'inquiries'
  | 'inquire-form'
  | 'media'
  | 'design'
  | 'hero-3d'
  | 'typography'
  | 'custom-code'
  | 'seo'
  | 'collaborators'
  | 'security'
  | 'updates'
  | 'knowledge'
  | 'support-feedback';

export const AdminLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isBannerDismissed, setIsBannerDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('bracknodes_ad_banner_dismissed') === 'true';
    } catch {
      return false;
    }
  });
  const { user, logout, isLiveSupabase } = useAuth();
  const { isSaving, lastSaved, inquiries, siteSettings, updateInfo } = useCMS();
  const navigate = useNavigate();

  const adminSlug = siteSettings.adminPath || 'admin';
  const unreadInquiriesCount = inquiries.filter((inq) => inq.status === 'new').length;

  const adminLogoUrl =
    siteSettings.logoSettings?.darkImageUrl ||
    siteSettings.logoSettings?.imageUrl ||
    siteSettings.logoSettings?.lightImageUrl;
  const rawBrand = siteSettings.brandName || siteSettings.wordmark || 'BRACKNODES';
  const displayBrandName = rawBrand.replace(/\.(in|com|dev|io|org|net)$/i, '').trim();

  const handleLogout = async () => {
    await logout();
    navigate(`/${adminSlug}/login`);
  };

  // RBAC Permission Resolution
  const userEmail = user?.email?.toLowerCase();
  const collaborator = siteSettings.collaborators?.find(
    (c) => c.email.toLowerCase() === userEmail
  );
  const isSuperAdmin = !collaborator || collaborator.role === 'admin' || userEmail === (siteSettings.email || 'support@bracknodes.in').toLowerCase();
  const permissions = collaborator
    ? collaborator.permissions
    : {
        canManageProjects: true,
        canManageServices: true,
        canManageSkills: true,
        canManageContent: true,
        canViewInquiries: true,
        canManageInquireForm: true,
        canManageDesign: true,
        canManageMedia: true,
        canManageSecurity: true,
      };

  const allNavItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number; allowed: boolean }[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: <LayoutDashboard size={18} />, allowed: true },
    { id: 'content', label: 'Website Content', icon: <FileText size={18} />, allowed: permissions.canManageContent },
    { id: 'projects', label: 'Projects Manager', icon: <FolderGit2 size={18} />, allowed: permissions.canManageProjects },
    { id: 'services', label: 'Services & Scope', icon: <Briefcase size={18} />, allowed: permissions.canManageServices },
    { id: 'skills', label: 'Skills & Tech Stack', icon: <Cpu size={18} />, allowed: permissions.canManageSkills },
    { id: 'process', label: 'Process & Sprint Flow', icon: <GitBranch size={18} />, allowed: permissions.canManageContent },
    { id: 'experience', label: 'Experience & Education', icon: <GraduationCap size={18} />, allowed: permissions.canManageContent },
    { id: 'testimonials', label: 'Client Testimonials', icon: <Award size={18} />, allowed: permissions.canManageContent },
    {
      id: 'inquiries',
      label: 'Contact Inquiries',
      icon: <Inbox size={18} />,
      badge: unreadInquiriesCount > 0 ? unreadInquiriesCount : undefined,
      allowed: permissions.canViewInquiries,
    },
    { id: 'inquire-form', label: 'Inquire Form Editor', icon: <FileText size={18} />, allowed: permissions.canManageInquireForm },
    { id: 'media', label: 'Media Library', icon: <ImageIcon size={18} />, allowed: permissions.canManageMedia },
    { id: 'design', label: 'Design Customization', icon: <Palette size={18} />, allowed: permissions.canManageDesign },
    { id: 'hero-3d', label: '3D Hero Object & Scene', icon: <Box size={18} />, allowed: permissions.canManageDesign },
    { id: 'typography', label: 'Typography & Fonts', icon: <Type size={18} />, allowed: permissions.canManageDesign },
    { id: 'custom-code', label: 'Custom Code (CSS & JS)', icon: <Code2 size={18} />, allowed: permissions.canManageDesign },
    { id: 'seo', label: 'SEO & Search Rankings', icon: <Globe size={18} />, allowed: isSuperAdmin || permissions.canManageContent },
    { id: 'collaborators', label: 'Team & Permissions', icon: <Users size={18} />, allowed: isSuperAdmin || permissions.canManageSecurity },
    { id: 'security', label: 'Account & Database', icon: <Shield size={18} />, allowed: isSuperAdmin || permissions.canManageSecurity },
    { id: 'updates', label: 'Updates & Version', icon: <RefreshCw size={18} />, badge: updateInfo?.hasUpdate ? 1 : undefined, allowed: isSuperAdmin || permissions.canManageSecurity },
    { id: 'knowledge', label: 'Knowledge Base', icon: <BookOpen size={18} />, allowed: true },
    { id: 'support-feedback', label: 'Support & Feedback', icon: <Headphones size={18} />, allowed: true },
  ];

  const navItems = allNavItems.filter((item) => item.allowed);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView onNavigate={(tab) => setActiveTab(tab)} />;
      case 'content':
        return <ContentEditorView onNavigate={(tab) => setActiveTab(tab)} />;
      case 'projects':
        return <ProjectsView />;
      case 'services':
        return <ServicesView />;
      case 'skills':
        return <SkillsView />;
      case 'process':
        return <ProcessView />;
      case 'experience':
        return <ExperienceView />;
      case 'testimonials':
        return <TestimonialsView />;
      case 'inquiries':
        return <InquiriesView onNavigateToForm={() => setActiveTab('inquire-form')} />;
      case 'inquire-form':
        return <InquireFormView />;
      case 'media':
        return <MediaView />;
      case 'design':
        return (
          <DesignView
            onNavigateToTypography={() => setActiveTab('typography')}
            onNavigateToCustomCode={() => setActiveTab('custom-code')}
            onNavigateToHero3D={() => setActiveTab('hero-3d')}
          />
        );
      case 'hero-3d':
        return <Hero3DEditorView />;
      case 'typography':
        return <TypographyView />;
      case 'custom-code':
        return <CustomCodeView />;
      case 'seo':
        return <SeoDomainView />;
      case 'collaborators':
        return <CollaboratorsView />;
      case 'security':
        return <SecurityView />;
      case 'updates':
        return <UpdatesView />;
      case 'knowledge':
        return <KnowledgeView onNavigate={(tab) => setActiveTab(tab)} />;
      case 'support-feedback':
        return <SupportFeedbackView />;
      default:
        return <OverviewView onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div
      className="admin-layout"
      data-theme="dark"
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#090B10',
        color: '#F7F7F2',
      }}
    >
      {/* SIDEBAR NAVIGATION */}
      <aside
        style={{
          width: '270px',
          backgroundColor: '#0c0f17',
          borderRight: '1px solid #1c2438',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          transform: isMobileNavOpen ? 'translateX(0)' : undefined,
          transition: 'transform 0.3s ease',
        }}
        className={`admin-sidebar ${isMobileNavOpen ? 'sidebar-open' : ''}`}
      >
        {/* Sidebar Header */}
        <div>
          <div
            style={{
              padding: '1.25rem 1.25rem',
              borderBottom: '1px solid #1c2438',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minWidth: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, overflow: 'hidden' }}>
              {adminLogoUrl && siteSettings.logoSettings?.mode !== 'icon-wordmark' ? (
                <img
                  src={adminLogoUrl}
                  alt="Brand Logo"
                  style={{
                    height: '32px',
                    width: 'auto',
                    maxHeight: '34px',
                    maxWidth: '36px',
                    objectFit: 'contain',
                    borderRadius: '3px',
                    flexShrink: 0,
                  }}
                />
              ) : null}
              <div style={{ minWidth: 0, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: '1rem',
                      color: '#F7F7F2',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.1,
                    }}
                  >
                    {displayBrandName}
                  </span>
                  <span
                    className="mono"
                    style={{
                      fontSize: '0.625rem',
                      padding: '1px 5px',
                      background: 'rgba(199,255,107,0.12)',
                      color: 'var(--accent-lime)',
                      border: '1px solid rgba(199,255,107,0.3)',
                      borderRadius: '2px',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      lineHeight: 1.2,
                      flexShrink: 0,
                    }}
                  >
                    CMS
                  </span>
                </div>
                <div
                  className="mono"
                  style={{
                    fontSize: '0.625rem',
                    color: '#5E6980',
                    letterSpacing: '0.08em',
                    marginTop: '2px',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                >
                  HOSTING CONTROL PANEL
                </div>
              </div>
            </div>

            {/* Close button for mobile */}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(false)}
              className="mobile-close-btn"
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Items List */}
          <nav style={{ padding: '0.75rem 0.5rem', overflowY: 'auto', maxHeight: 'calc(100vh - 230px)' }}>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileNavOpen(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 14px',
                    borderRadius: '3px',
                    border: 'none',
                    backgroundColor: isActive ? 'rgba(199, 255, 107, 0.12)' : 'transparent',
                    color: isActive ? 'var(--accent-lime)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    marginBottom: '2px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: isActive ? 'var(--accent-lime)' : 'var(--text-muted)' }}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className="mono"
                      style={{
                        backgroundColor: 'var(--accent-lime)',
                        color: '#090B10',
                        fontSize: '0.625rem',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '99px',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div>
          {/* BrackNodes Sidebar Promo Card (Dismissible) */}
          <BrackNodesSidebarCard />

          {/* Sidebar Footer User Info & Logout */}
          <div style={{ padding: '1rem', borderTop: '1px solid #1c2438', backgroundColor: '#0a0d15' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ overflow: 'hidden' }}>
              <div className="mono" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#F7F7F2', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {collaborator ? collaborator.name : user?.email || 'Administrator'}
              </div>
              <div className="mono" style={{ fontSize: '0.625rem', color: isSuperAdmin ? 'var(--accent-lime)' : 'var(--accent-blue)', textTransform: 'capitalize' }}>
                {collaborator ? `${collaborator.role} • ${isLiveSupabase ? 'Cloud DB' : 'Local'}` : isLiveSupabase ? '● Live Supabase DB' : '○ Local Storage Mode'}
              </div>
              <div className="mono" style={{ fontSize: '0.59375rem', color: '#6B7A99', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Shield size={10} color="var(--accent-lime)" />
                <span>60m Auto-Logout Active</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Sign out of Admin CMS"
              style={{
                background: 'none',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                padding: '6px',
                borderRadius: '3px',
                cursor: 'pointer',
              }}
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, marginLeft: '270px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="admin-main">
        {/* Dashboard Top Header */}
        <header
          style={{
            height: '64px',
            backgroundColor: '#0a0d14',
            borderBottom: '1px solid #1c2438',
            padding: '0 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="admin-hamburger"
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
              }}
            >
              <Menu size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                ADMIN
              </span>
              <ChevronRight size={14} color="#5E6980" />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                {activeTab}
              </span>
            </div>
          </div>

          {/* Right Header Status Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Auto-save status indicator */}
            <div className="mono" style={{ fontSize: '0.6875rem', color: isSaving ? 'var(--accent-lime)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {isSaving ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  <span>SAVING...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={12} color="var(--accent-lime)" />
                  <span>SAVED {lastSaved ? `(${lastSaved})` : 'SYNCED'}</span>
                </>
              )}
            </div>

            {/* BrackNodes Promotion Toggle when dismissed */}
            {isBannerDismissed && (
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.removeItem('bracknodes_ad_banner_dismissed');
                  } catch {}
                  setIsBannerDismissed(false);
                }}
                className="mono"
                title="Show BrackNodes hosting banner"
                style={{
                  background: 'rgba(199, 255, 107, 0.06)',
                  border: '1px solid rgba(199, 255, 107, 0.25)',
                  color: 'var(--accent-lime)',
                  padding: '5px 10px',
                  borderRadius: '3px',
                  fontSize: '0.6875rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontWeight: 600,
                  transition: 'all 0.15s ease',
                }}
              >
                <Zap size={11} />
                <span>BrackNodes Cloud</span>
              </button>
            )}

            {/* View Live Website Button */}
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            >
              <span>View Public Site</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </header>

        {/* BrackNodes Promotional Banner (Dismissible) */}
        <BrackNodesAdBanner
          isDismissed={isBannerDismissed}
          onDismiss={() => setIsBannerDismissed(true)}
        />

        {/* Dynamic View Container */}
        <main style={{ padding: 'clamp(1rem, 2.5vw, 2.5rem)', flex: 1, backgroundColor: '#090B10' }}>
          {renderActiveView()}
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          .admin-sidebar.sidebar-open {
            transform: translateX(0);
          }
          .admin-main {
            margin-left: 0 !important;
          }
          .admin-hamburger {
            display: block !important;
          }
          .mobile-close-btn {
            display: block !important;
          }
        }
        @media (max-width: 600px) {
          .admin-main main {
            padding: 1rem 0.75rem !important;
          }
        }
      `}</style>
    </div>
  );
};

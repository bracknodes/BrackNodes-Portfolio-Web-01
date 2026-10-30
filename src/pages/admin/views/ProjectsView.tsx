import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import type { Project, ProjectFilterTab } from '../../../types/cms';
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  AlertTriangle,
  Sliders,
  Save,
} from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const {
    projects,
    saveProject,
    deleteProject,
    duplicateProject,
    reorderProjects,
    toggleProjectPublish,
    siteSettings,
    updateSiteSettings,
  } = useCMS();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  // Section Header Editing State
  const [isEditingSectionHeader, setIsEditingSectionHeader] = useState(false);
  const [sectionTag, setSectionTag] = useState(
    siteSettings.sectionHeadings?.projects?.tag ?? '01 // Selected Work'
  );
  const [sectionTitle, setSectionTitle] = useState(
    siteSettings.sectionHeadings?.projects?.title ?? 'FEATURED PROJECTS'
  );
  const [sectionSubtitle, setSectionSubtitle] = useState(
    siteSettings.sectionHeadings?.projects?.subtitle ??
      'Engineered web applications, spatial WebGL visualizers, and enterprise design systems built for production.'
  );

  const defaultFilters: ProjectFilterTab[] = [
    { label: 'All', key: 'All' },
    { label: 'Discord Bots', key: 'Discord' },
    { label: 'cPanel Hosting', key: 'cPanel' },
    { label: 'Cloud VPS', key: 'Cloud' },
  ];

  const [filterTabs, setFilterTabs] = useState<ProjectFilterTab[]>(
    siteSettings.sectionHeadings?.projects?.filterTabs && siteSettings.sectionHeadings.projects.filterTabs.length > 0
      ? siteSettings.sectionHeadings.projects.filterTabs
      : defaultFilters
  );

  const [headerSavedSuccess, setHeaderSavedSuccess] = useState(false);

  const handleSaveSectionHeader = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteSettings({
      sectionHeadings: {
        ...siteSettings.sectionHeadings,
        projects: {
          tag: sectionTag.trim(),
          title: sectionTitle.trim(),
          subtitle: sectionSubtitle.trim(),
          filterTabs: filterTabs.filter((t) => t.label.trim()),
        },
      },
    });
    setHeaderSavedSuccess(true);
    setTimeout(() => setHeaderSavedSuccess(false), 3000);
  };

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formYear, setFormYear] = useState('2025');
  const [formDesc, setFormDesc] = useState('');
  const [formLongDesc, setFormLongDesc] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formLiveUrl, setFormLiveUrl] = useState('');
  const [formRepoUrl, setFormRepoUrl] = useState('');
  const [formAccent, setFormAccent] = useState('#C7FF6B');
  const [formPreviewType, setFormPreviewType] = useState<Project['previewType']>('interactive-canvas');
  const [formPreviewImage, setFormPreviewImage] = useState('');
  const [formCustomCode, setFormCustomCode] = useState('');
  const [formFeatured, setFormFeatured] = useState(true);
  const [formPublished, setFormPublished] = useState(true);

  // Metrics Pairs (label, value)
  const [metricsList, setMetricsList] = useState<{ label: string; value: string }[]>([
    { label: 'Starting Price', value: '₹29 /mo' },
    { label: 'Uptime SLA', value: '99.99%' },
    { label: 'Support', value: '24/7 Active' },
  ]);

  const openAddModal = () => {
    setEditingProject(null);
    setFormTitle('');
    setFormSlug('');
    setFormCategory('24/7 Runtime / Pterodactyl Panel');
    setFormYear(new Date().getFullYear().toString());
    setFormDesc('');
    setFormLongDesc('');
    setFormTags('Pterodactyl, Node.js, Python, DDoS Shield');
    setFormLiveUrl('https://bracknodes.in/');
    setFormRepoUrl('');
    setFormAccent('#C7FF6B');
    setFormPreviewType('interactive-canvas');
    setFormPreviewImage('');
    setFormCustomCode('');
    setFormFeatured(true);
    setFormPublished(true);
    setMetricsList([
      { label: 'Starting Price', value: '₹29 /mo' },
      { label: 'Uptime SLA', value: '99.99%' },
      { label: 'Support', value: '24/7 Active' },
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Project) => {
    setEditingProject(p);
    setFormTitle(p.title);
    setFormSlug(p.slug);
    setFormCategory(p.category);
    setFormYear(p.year);
    setFormDesc(p.description);
    setFormLongDesc(p.longDescription);
    setFormTags(p.tags.join(', '));
    setFormLiveUrl(p.liveUrl || '');
    setFormRepoUrl(p.repoUrl || '');
    setFormAccent(p.accentColor || '#C7FF6B');
    setFormPreviewType(p.previewType || 'interactive-canvas');
    setFormPreviewImage(p.previewImage || '');
    setFormCustomCode(p.customPreviewCode || '');
    setFormFeatured(p.featured);
    setFormPublished(p.isPublished);
    setMetricsList(
      p.metrics && p.metrics.length > 0
        ? p.metrics.map((m) => ({ label: m.label, value: m.value }))
        : []
    );
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!editingProject) {
      // Auto-generate slug
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormSlug(generated);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const projectData: Project = {
      id: editingProject ? editingProject.id : `proj-${Date.now()}`,
      slug: formSlug.trim() || `proj-${Date.now()}`,
      title: formTitle.trim(),
      category: formCategory.trim(),
      year: formYear.trim(),
      description: formDesc.trim(),
      longDescription: formLongDesc.trim() || formDesc.trim(),
      tags: tagsArray,
      metrics: metricsList.filter((m) => m.label.trim() && m.value.trim()),
      liveUrl: formLiveUrl.trim() || undefined,
      repoUrl: formRepoUrl.trim() || undefined,
      featured: formFeatured,
      accentColor: formAccent,
      previewType: formPreviewType,
      previewImage: formPreviewImage.trim() || undefined,
      customPreviewCode: formCustomCode.trim() || undefined,
      displayOrder: editingProject ? editingProject.displayOrder : projects.length,
      isPublished: formPublished,
    };

    await saveProject(projectData);
    setIsModalOpen(false);
  };

  const moveProject = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === projects.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...projects];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    reorderProjects(reordered);
  };

  return (
    <div style={{ maxWidth: '1200px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Projects Manager</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
            Create, edit, reorder, and publish portfolio showcase projects.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="btn btn-primary"
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.75rem' }}
        >
          <Plus size={15} />
          <span>Create New Project</span>
        </button>
      </div>

      {/* Section Header & Branding Customization Card */}
      <div
        style={{
          marginBottom: '2rem',
          padding: '1.25rem 1.5rem',
          backgroundColor: '#11151f',
          border: '1px solid var(--border-subtle)',
          borderLeft: '4px solid var(--accent-blue)',
          borderRadius: '4px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', fontWeight: 700 }}>
                PUBLIC SECTION TITLE &amp; HEADING
              </span>
              <span
                className="mono"
                style={{
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  background: 'rgba(112, 185, 255, 0.1)',
                  border: '1px solid rgba(112, 185, 255, 0.25)',
                  color: 'var(--accent-blue)',
                  borderRadius: '2px',
                }}
              >
                LIVE DISPLAY: &quot;{siteSettings.sectionHeadings?.projects?.title || 'FEATURED PROJECTS'}&quot;
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Customize how this section appears on the public website (e.g., rename to &quot;WEB HOSTING PACKAGES&quot;, &quot;FEATURED WORK&quot;, etc.).
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsEditingSectionHeader(!isEditingSectionHeader)}
            className="mono"
            style={{
              padding: '6px 14px',
              fontSize: '0.75rem',
              backgroundColor: isEditingSectionHeader ? 'var(--accent-blue)' : '#161c2d',
              color: isEditingSectionHeader ? '#000' : 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Sliders size={13} />
            <span>{isEditingSectionHeader ? 'Close Editor' : 'Edit Section Name / Title'}</span>
          </button>
        </div>

        {isEditingSectionHeader && (
          <form
            onSubmit={handleSaveSectionHeader}
            style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem',
              }}
            >
              <div>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  SECTION TAG / BADGE
                </label>
                <input
                  type="text"
                  value={sectionTag}
                  onChange={(e) => setSectionTag(e.target.value)}
                  placeholder="01 // Selected Work"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem',
                    backgroundColor: '#0c0f17',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8125rem',
                  }}
                />
              </div>

              <div>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  MAIN SECTION TITLE
                </label>
                <input
                  type="text"
                  value={sectionTitle}
                  onChange={(e) => setSectionTitle(e.target.value)}
                  placeholder="FEATURED PROJECTS (or WEB HOSTING, OUR PACKAGES, etc.)"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem',
                    backgroundColor: '#0c0f17',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--accent-lime)',
                    borderRadius: '2px',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                SECTION SUBTITLE / DESCRIPTION
              </label>
              <textarea
                rows={2}
                value={sectionSubtitle}
                onChange={(e) => setSectionSubtitle(e.target.value)}
                placeholder="High-performance NVMe cPanel hosting with free SSL, DDoS protection and 24/7 support."
                style={{
                  width: '100%',
                  padding: '0.65rem 0.75rem',
                  backgroundColor: '#0c0f17',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  borderRadius: '2px',
                  fontSize: '0.8125rem',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* ── Category Filter Pills Editor ── */}
            <div
              style={{
                marginBottom: '1.25rem',
                padding: '1rem',
                backgroundColor: '#0c0f17',
                border: '1px solid var(--border-subtle)',
                borderRadius: '3px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-lime)', fontWeight: 700 }}>
                    CATEGORY FILTER BUTTONS (PILLS)
                  </label>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                    These buttons appear on the public website above your hosting plans. Visitors click them to filter tiers.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFilterTabs([
                      ...filterTabs,
                      { label: 'New Category', key: 'Category' },
                    ]);
                  }}
                  className="mono btn btn-secondary"
                  style={{ fontSize: '0.7rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Plus size={13} />
                  <span>Add Filter Pill</span>
                </button>
              </div>

              {/* List of Filter Tabs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                {filterTabs.map((tab, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '3px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', width: '22px' }}>
                      #{idx + 1}
                    </span>

                    <div style={{ flex: '1 1 180px' }}>
                      <label className="mono" style={{ display: 'block', fontSize: '0.625rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
                        BUTTON LABEL (SHOWN TO VISITORS)
                      </label>
                      <input
                        type="text"
                        value={tab.label}
                        onChange={(e) => {
                          const updated = [...filterTabs];
                          updated[idx] = { ...updated[idx], label: e.target.value };
                          setFilterTabs(updated);
                        }}
                        placeholder="e.g. Discord Bots"
                        style={{
                          width: '100%',
                          padding: '0.45rem 0.6rem',
                          backgroundColor: '#0c0f17',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-primary)',
                          borderRadius: '2px',
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 600,
                        }}
                      />
                    </div>

                    <div style={{ flex: '1 1 180px' }}>
                      <label className="mono" style={{ display: 'block', fontSize: '0.625rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
                        SEARCH KEYWORD (MATCHES PLAN CATEGORY/TAG)
                      </label>
                      <input
                        type="text"
                        value={tab.key}
                        onChange={(e) => {
                          const updated = [...filterTabs];
                          updated[idx] = { ...updated[idx], key: e.target.value };
                          setFilterTabs(updated);
                        }}
                        placeholder="e.g. Discord (or All)"
                        style={{
                          width: '100%',
                          padding: '0.45rem 0.6rem',
                          backgroundColor: '#0c0f17',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--accent-lime)',
                          borderRadius: '2px',
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-mono)',
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', alignSelf: 'flex-end', paddingBottom: '2px' }}>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          if (idx === 0) return;
                          const updated = [...filterTabs];
                          const temp = updated[idx - 1];
                          updated[idx - 1] = updated[idx];
                          updated[idx] = temp;
                          setFilterTabs(updated);
                        }}
                        style={{
                          padding: '6px',
                          background: 'none',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '2px',
                          color: idx === 0 ? 'var(--text-muted)' : 'var(--text-primary)',
                          cursor: idx === 0 ? 'default' : 'pointer',
                        }}
                        title="Move Up"
                      >
                        <ArrowUp size={12} />
                      </button>

                      <button
                        type="button"
                        disabled={idx === filterTabs.length - 1}
                        onClick={() => {
                          if (idx === filterTabs.length - 1) return;
                          const updated = [...filterTabs];
                          const temp = updated[idx + 1];
                          updated[idx + 1] = updated[idx];
                          updated[idx] = temp;
                          setFilterTabs(updated);
                        }}
                        style={{
                          padding: '6px',
                          background: 'none',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '2px',
                          color: idx === filterTabs.length - 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                          cursor: idx === filterTabs.length - 1 ? 'default' : 'pointer',
                        }}
                        title="Move Down"
                      >
                        <ArrowDown size={12} />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (filterTabs.length <= 1) return;
                          setFilterTabs(filterTabs.filter((_, i) => i !== idx));
                        }}
                        style={{
                          padding: '6px',
                          background: 'none',
                          border: '1px solid rgba(255, 107, 107, 0.3)',
                          borderRadius: '2px',
                          color: '#ff6b6b',
                          cursor: 'pointer',
                        }}
                        title="Delete Filter Pill"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Preview of Pills */}
              <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed var(--border-subtle)' }}>
                <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  LIVE PREVIEW AS SHOWN ON WEBSITE:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {filterTabs.map((tab, i) => (
                    <span
                      key={i}
                      className="mono"
                      style={{
                        fontSize: '0.7rem',
                        padding: '4px 10px',
                        borderRadius: '2px',
                        border: i === 0 ? '1px solid var(--accent-lime)' : '1px solid var(--border-subtle)',
                        backgroundColor: i === 0 ? 'var(--accent-lime-muted)' : 'var(--bg-input)',
                        color: i === 0 ? 'var(--accent-lime)' : 'var(--text-secondary)',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                      }}
                    >
                      {tab.label || 'Empty'}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '0.6rem 1.25rem', fontSize: '0.75rem' }}
              >
                <Save size={14} />
                <span>Save Section Name</span>
              </button>

              {headerSavedSuccess && (
                <span className="mono" style={{ color: 'var(--accent-lime)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} />
                  Section heading updated on live website!
                </span>
              )}
            </div>
          </form>
        )}
      </div>

      {/* Projects Table / Card List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="card-surface"
            style={{
              padding: '1.25rem 1.5rem',
              borderRadius: '4px',
              border: '1px solid var(--border-subtle)',
              borderLeft: `4px solid ${project.accentColor || 'var(--accent-lime)'}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            {/* Info */}
            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span className="mono" style={{ fontSize: '0.75rem', color: project.accentColor || 'var(--accent-lime)', fontWeight: 700 }}>
                  0{index + 1} // {project.category}
                </span>
                <span style={{ color: 'var(--border-subtle)' }}>•</span>
                <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {project.year}
                </span>
                {!project.isPublished && (
                  <span
                    className="mono"
                    style={{
                      fontSize: '0.625rem',
                      padding: '2px 6px',
                      backgroundColor: 'rgba(255, 95, 86, 0.15)',
                      color: '#ff8a84',
                      borderRadius: '2px',
                    }}
                  >
                    DRAFT (UNPUBLISHED)
                  </span>
                )}
                {project.featured && (
                  <span
                    className="mono"
                    style={{
                      fontSize: '0.625rem',
                      padding: '2px 6px',
                      backgroundColor: 'rgba(199, 255, 107, 0.12)',
                      color: 'var(--accent-lime)',
                      borderRadius: '2px',
                    }}
                  >
                    FEATURED
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '1.2rem', marginBottom: '4px', color: 'var(--text-primary)' }}>
                {project.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 8px 0', maxWidth: '640px' }}>
                {project.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="mono"
                    style={{
                      fontSize: '0.6875rem',
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      padding: '2px 6px',
                      borderRadius: '2px',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Reorder Arrows */}
              <button
                type="button"
                disabled={index === 0}
                onClick={() => moveProject(index, 'up')}
                title="Move Up"
                style={{
                  background: 'none',
                  border: '1px solid var(--border-subtle)',
                  color: index === 0 ? 'var(--border-subtle)' : 'var(--text-secondary)',
                  padding: '6px',
                  borderRadius: '2px',
                  cursor: index === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                <ArrowUp size={14} />
              </button>

              <button
                type="button"
                disabled={index === projects.length - 1}
                onClick={() => moveProject(index, 'down')}
                title="Move Down"
                style={{
                  background: 'none',
                  border: '1px solid var(--border-subtle)',
                  color: index === projects.length - 1 ? 'var(--border-subtle)' : 'var(--text-secondary)',
                  padding: '6px',
                  borderRadius: '2px',
                  cursor: index === projects.length - 1 ? 'not-allowed' : 'pointer',
                }}
              >
                <ArrowDown size={14} />
              </button>

              {/* Toggle Publish */}
              <button
                type="button"
                onClick={() => toggleProjectPublish(project.id)}
                title={project.isPublished ? 'Unpublish' : 'Publish'}
                style={{
                  background: 'none',
                  border: '1px solid var(--border-subtle)',
                  color: project.isPublished ? 'var(--accent-lime)' : 'var(--text-muted)',
                  padding: '6px 10px',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                }}
              >
                {project.isPublished ? <Eye size={14} /> : <EyeOff size={14} />}
                <span className="mono">{project.isPublished ? 'LIVE' : 'HIDDEN'}</span>
              </button>

              {/* Duplicate */}
              <button
                type="button"
                onClick={() => duplicateProject(project.id)}
                title="Duplicate Project"
                style={{
                  background: 'none',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  padding: '6px',
                  borderRadius: '2px',
                  cursor: 'pointer',
                }}
              >
                <Copy size={14} />
              </button>

              {/* Edit */}
              <button
                type="button"
                onClick={() => openEditModal(project)}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
              >
                <Edit2 size={13} />
                <span>Edit</span>
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => setProjectToDelete(project.id)}
                title="Delete Project"
                style={{
                  background: 'none',
                  border: '1px solid rgba(255, 95, 86, 0.4)',
                  color: '#ff8a84',
                  padding: '6px',
                  borderRadius: '2px',
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog for Delete */}
      {projectToDelete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            className="card-surface"
            style={{
              maxWidth: '420px',
              width: '100%',
              padding: '1.75rem',
              border: '1px solid #ff5f56',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ff5f56', marginBottom: '1rem' }}>
              <AlertTriangle size={24} />
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Confirm Project Deletion</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Are you sure you want to delete this project? This will remove it from both the live website and database.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await deleteProject(projectToDelete);
                  setProjectToDelete(null);
                }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#ff5f56',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Project Modal Drawer */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(6px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            className="card-surface"
            style={{
              maxWidth: '720px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              border: '1px solid var(--border-highlight)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
              position: 'relative',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.35rem' }}>
                {editingProject ? 'Edit Project Details' : 'Create New Project'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    PROJECT TITLE *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#0c0f17',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      borderRadius: '2px',
                    }}
                  />
                </div>

                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    SLUG / URL IDENTIFIER *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#0c0f17',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      borderRadius: '2px',
                      fontFamily: 'var(--font-mono)',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    CATEGORY BADGE
                  </label>
                  <input
                    type="text"
                    required
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#0c0f17',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      borderRadius: '2px',
                    }}
                  />
                </div>

                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    YEAR
                  </label>
                  <input
                    type="text"
                    required
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#0c0f17',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      borderRadius: '2px',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  SHORT SUMMARY (CARD LEAD)
                </label>
                <input
                  type="text"
                  required
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#0c0f17',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    borderRadius: '2px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  FULL ARCHITECTURAL DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  value={formLongDesc}
                  onChange={(e) => setFormLongDesc(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#0c0f17',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    borderRadius: '2px',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  TECHNOLOGY TAGS (COMMA SEPARATED)
                </label>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="React 19, TypeScript, Three.js, WebGL"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#0c0f17',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8125rem',
                  }}
                />
              </div>

              {/* Technical Specs & Metrics Section (The KPI Strip) */}
              <div
                style={{
                  marginBottom: '1.25rem',
                  padding: '1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <div>
                    <label
                      className="mono"
                      style={{
                        display: 'block',
                        fontSize: '0.78125rem',
                        color: 'var(--accent-lime)',
                        fontWeight: 700,
                      }}
                    >
                      TECHNICAL SPECS &amp; METRICS (KPI STRIP)
                    </label>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Key specification strip displayed on the card (e.g. Frame Rate, Storage, Bandwidth, Latency).
                    </span>
                  </div>

                  {/* Preset Buttons */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() =>
                        setMetricsList([
                          { label: 'FRAME RATE', value: '60 FPS Constant' },
                          { label: 'BUNDLE SIZE', value: '< 140 KB Gzip' },
                          { label: 'AUDIO LATENCY', value: '< 12 ms' },
                        ])
                      }
                      className="mono"
                      style={{
                        fontSize: '0.6875rem',
                        padding: '3px 8px',
                        background: '#131826',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-secondary)',
                        borderRadius: '2px',
                        cursor: 'pointer',
                      }}
                      title="Load standard 3D/Web benchmarks"
                    >
                      Preset: 3D / Web
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setMetricsList([
                          { label: 'SSD STORAGE', value: '50 GB NVMe' },
                          { label: 'BANDWIDTH', value: 'Unlimited 1 Gbps' },
                          { label: 'UPTIME SLA', value: '99.9%' },
                        ])
                      }
                      className="mono"
                      style={{
                        fontSize: '0.6875rem',
                        padding: '3px 8px',
                        background: '#131826',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-secondary)',
                        borderRadius: '2px',
                        cursor: 'pointer',
                      }}
                      title="Load Hosting / Cloud plan specs"
                    >
                      Preset: Hosting Plan
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setMetricsList([
                          { label: 'RAM', value: '8 GB DDR5' },
                          { label: 'vCPU CORES', value: '4 Cores' },
                          { label: 'DDOS SHIELD', value: 'Included' },
                        ])
                      }
                      className="mono"
                      style={{
                        fontSize: '0.6875rem',
                        padding: '3px 8px',
                        background: '#131826',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-secondary)',
                        borderRadius: '2px',
                        cursor: 'pointer',
                      }}
                      title="Load Server specs"
                    >
                      Preset: Server
                    </button>
                  </div>
                </div>

                {/* Metrics Rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
                  {metricsList.map((metric, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1.2fr 1.2fr auto',
                        gap: '8px',
                        alignItems: 'center',
                      }}
                    >
                      <input
                        type="text"
                        placeholder="SPEC LABEL (e.g. SSD STORAGE)"
                        value={metric.label}
                        onChange={(e) => {
                          const copy = [...metricsList];
                          copy[idx] = { ...copy[idx], label: e.target.value };
                          setMetricsList(copy);
                        }}
                        style={{
                          padding: '0.6rem 0.75rem',
                          backgroundColor: '#0c0f17',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-primary)',
                          borderRadius: '2px',
                          fontSize: '0.8125rem',
                          fontFamily: 'var(--font-mono)',
                          textTransform: 'uppercase',
                        }}
                      />
                      <input
                        type="text"
                        placeholder="SPEC VALUE (e.g. 50 GB NVMe)"
                        value={metric.value}
                        onChange={(e) => {
                          const copy = [...metricsList];
                          copy[idx] = { ...copy[idx], value: e.target.value };
                          setMetricsList(copy);
                        }}
                        style={{
                          padding: '0.6rem 0.75rem',
                          backgroundColor: '#0c0f17',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--accent-lime)',
                          borderRadius: '2px',
                          fontSize: '0.8125rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 600,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setMetricsList(metricsList.filter((_, i) => i !== idx))}
                        style={{
                          background: 'rgba(255, 75, 75, 0.1)',
                          border: '1px solid rgba(255, 75, 75, 0.25)',
                          color: '#ff6b6b',
                          padding: '0.55rem',
                          borderRadius: '2px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title="Delete Metric"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}

                  {metricsList.length === 0 && (
                    <div
                      style={{
                        padding: '1rem',
                        textAlign: 'center',
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        border: '1px dashed var(--border-subtle)',
                        borderRadius: '2px',
                      }}
                    >
                      No technical metrics configured. Click &quot;+ Add Specification / Metric&quot; below or pick a preset above.
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setMetricsList([...metricsList, { label: '', value: '' }])}
                  className="mono"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.75rem',
                    padding: '6px 12px',
                    backgroundColor: 'rgba(199, 255, 107, 0.1)',
                    border: '1px solid var(--accent-lime)',
                    color: 'var(--accent-lime)',
                    borderRadius: '2px',
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={13} />
                  <span>+ Add Specification / Metric</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    LIVE DEMO URL
                  </label>
                  <input
                    type="url"
                    value={formLiveUrl}
                    onChange={(e) => setFormLiveUrl(e.target.value)}
                    placeholder="https://your-demo.com"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#0c0f17',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      borderRadius: '2px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8125rem',
                    }}
                  />
                </div>

                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    SOURCE REPOSITORY URL
                  </label>
                  <input
                    type="url"
                    value={formRepoUrl}
                    onChange={(e) => setFormRepoUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#0c0f17',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      borderRadius: '2px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8125rem',
                    }}
                  />
                </div>
              </div>

              {/* Preview Type and Accent Color */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    INTERACTIVE PREVIEW SANDBOX
                  </label>
                  <select
                    value={formPreviewType}
                    onChange={(e) => setFormPreviewType(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#0c0f17',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      borderRadius: '2px',
                    }}
                  >
                    <option value="none">None (Clean Text &amp; Specs Only — No Preview Box)</option>
                    <option value="interactive-canvas">Interactive Audio DSP Canvas</option>
                    <option value="code-visualizer">Design Token Sandbox &amp; Code Lab</option>
                    <option value="telemetry-dashboard">Orbital Spatial Telemetry Radar</option>
                    <option value="custom-image">Custom Image (Upload / URL)</option>
                    <option value="custom-code">Custom Design Code / Embed (HTML &amp; SVG)</option>
                  </select>
                </div>

                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    ACCENT BRAND COLOR
                  </label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={formAccent}
                      onChange={(e) => setFormAccent(e.target.value)}
                      style={{
                        width: '44px',
                        height: '42px',
                        padding: '2px',
                        backgroundColor: '#0c0f17',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '2px',
                        cursor: 'pointer',
                      }}
                    />
                    <input
                      type="text"
                      value={formAccent}
                      onChange={(e) => setFormAccent(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        backgroundColor: '#0c0f17',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                        borderRadius: '2px',
                        fontFamily: 'var(--font-mono)',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Conditional Preview Config: Custom Image or Custom Code */}
              {formPreviewType === 'custom-image' && (
                <div style={{ marginBottom: '1.5rem', padding: '1.25rem', backgroundColor: '#090d15', border: '1px solid #1c263c', borderRadius: '4px' }}>
                  <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--accent-lime)', fontWeight: 700, marginBottom: '6px' }}>
                    // CUSTOM PREVIEW IMAGE URL
                  </label>
                  <input
                    type="url"
                    value={formPreviewImage}
                    onChange={(e) => setFormPreviewImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... or /assets/project-preview.png"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#0c0f17',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      borderRadius: '2px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8125rem',
                    }}
                  />
                  {formPreviewImage && (
                    <div style={{ marginTop: '10px', height: '140px', overflow: 'hidden', borderRadius: '4px', border: '1px solid #1c263c' }}>
                      <img src={formPreviewImage} alt="Preview thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
              )}

              {formPreviewType === 'custom-code' && (
                <div style={{ marginBottom: '1.5rem', padding: '1.25rem', backgroundColor: '#090d15', border: '1px solid #1c263c', borderRadius: '4px' }}>
                  <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--accent-blue)', fontWeight: 700, marginBottom: '6px' }}>
                    // CUSTOM DESIGN CODE / HTML EMBED
                  </label>
                  <textarea
                    rows={6}
                    value={formCustomCode}
                    onChange={(e) => setFormCustomCode(e.target.value)}
                    placeholder="<div style='display:flex;align-items:center;justify-content:center;height:250px;background:#0d111a;color:#c7ff6b;font-family:sans-serif;'><h3>Custom Component UI</h3></div>"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#0c0f17',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      borderRadius: '2px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8125rem',
                      resize: 'vertical',
                    }}
                  />
                  <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Supports custom HTML, inline CSS styles, SVG diagrams, and interactive canvas snippets.
                  </div>
                </div>
              )}

              {/* Checkbox Flags */}
              <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                  />
                  <span>Featured Project</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input
                    type="checkbox"
                    checked={formPublished}
                    onChange={(e) => setFormPublished(e.target.checked)}
                  />
                  <span>Published on Public Site</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ padding: '0.75rem 1.5rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '0.75rem 1.5rem' }}
                >
                  <Check size={16} />
                  <span>Save Project Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

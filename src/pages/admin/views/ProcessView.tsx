import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import type { ProcessStep } from '../../../types/cms';
import { Plus, Edit2, Trash2, Save, Check, X, Sliders } from 'lucide-react';

export const ProcessView: React.FC = () => {
  const { processSteps, saveProcessStep, deleteProcessStep, siteSettings, updateSiteSettings } = useCMS();
  const [editingStep, setEditingStep] = useState<ProcessStep | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Section Header Editing
  const [isEditingSectionHeader, setIsEditingSectionHeader] = useState(false);
  const [sectionTag, setSectionTag] = useState(
    siteSettings.sectionHeadings?.process?.tag ?? '05 // Methodology & Sprint Flow'
  );
  const [sectionTitle, setSectionTitle] = useState(
    siteSettings.sectionHeadings?.process?.title ?? 'DEVELOPMENT PROCESS'
  );
  const [sectionSubtitle, setSectionSubtitle] = useState(
    siteSettings.sectionHeadings?.process?.subtitle ??
      'A disciplined, transparent 5-stage framework designed to deliver high velocity without sacrificing code quality.'
  );
  const [headerSavedSuccess, setHeaderSavedSuccess] = useState(false);

  // Form State
  const [formStepNumber, setFormStepNumber] = useState('01');
  const [formTitle, setFormTitle] = useState('');
  const [formPhase, setFormPhase] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formOutputs, setFormOutputs] = useState('');

  const handleSaveSectionHeader = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteSettings({
      sectionHeadings: {
        ...siteSettings.sectionHeadings,
        process: {
          tag: sectionTag.trim(),
          title: sectionTitle.trim(),
          subtitle: sectionSubtitle.trim(),
        },
      },
    });
    setHeaderSavedSuccess(true);
    setTimeout(() => setHeaderSavedSuccess(false), 3000);
  };

  const openAddModal = () => {
    setEditingStep(null);
    setFormStepNumber(`0${processSteps.length + 1}`);
    setFormTitle('');
    setFormPhase('Phase / Sprint');
    setFormDescription('');
    setFormOutputs('Deliverable 1, Deliverable 2, Deliverable 3');
    setIsModalOpen(true);
  };

  const openEditModal = (step: ProcessStep) => {
    setEditingStep(step);
    setFormStepNumber(step.step);
    setFormTitle(step.title);
    setFormPhase(step.phase);
    setFormDescription(step.description);
    setFormOutputs((step.outputs || []).join('\n'));
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const outputsArray = formOutputs
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const stepItem: ProcessStep = {
      id: editingStep ? editingStep.id : `step-${Date.now()}`,
      step: formStepNumber.trim(),
      title: formTitle.trim(),
      phase: formPhase.trim(),
      description: formDescription.trim(),
      outputs: outputsArray,
      displayOrder: editingStep ? editingStep.displayOrder : processSteps.length,
    };

    await saveProcessStep(stepItem);
    setIsModalOpen(false);
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
          <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Development Process &amp; Workflow</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
            Configure the sequential stages, timelines, and deliverable checklists shown on the homepage.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="btn btn-primary"
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.75rem' }}
        >
          <Plus size={15} />
          <span>Add Process Stage</span>
        </button>
      </div>

      {/* Section Header Customization Card */}
      <div
        style={{
          marginBottom: '2rem',
          padding: '1.25rem 1.5rem',
          backgroundColor: '#11151f',
          border: '1px solid var(--border-subtle)',
          borderLeft: '4px solid var(--accent-lime)',
          borderRadius: '4px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-lime)', fontWeight: 700 }}>
                PUBLIC SECTION TITLE &amp; HEADER
              </span>
              <span className="mono" style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(199, 255, 107, 0.1)', border: '1px solid var(--accent-lime-muted)', color: 'var(--accent-lime)', borderRadius: '2px' }}>
                CURRENT: &quot;{siteSettings.sectionHeadings?.process?.title || 'DEVELOPMENT PROCESS'}&quot;
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Rename this section or adapt it for onboarding, server deployment steps, or sprint timelines.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsEditingSectionHeader(!isEditingSectionHeader)}
            className="mono"
            style={{
              padding: '6px 14px',
              fontSize: '0.75rem',
              backgroundColor: isEditingSectionHeader ? 'var(--accent-lime)' : '#161c2d',
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
          <form onSubmit={handleSaveSectionHeader} style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  SECTION TAG / BADGE
                </label>
                <input
                  type="text"
                  value={sectionTag}
                  onChange={(e) => setSectionTag(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}
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
                  style={{ width: '100%', padding: '0.65rem', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', color: 'var(--accent-lime)', borderRadius: '2px', fontWeight: 700, fontSize: '0.875rem' }}
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
                style={{ width: '100%', padding: '0.65rem', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontSize: '0.8125rem' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.75rem' }}>
                <Save size={14} />
                <span>Save Section Heading</span>
              </button>
              {headerSavedSuccess && (
                <span className="mono" style={{ color: 'var(--accent-lime)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} /> Section heading updated!
                </span>
              )}
            </div>
          </form>
        )}
      </div>

      {/* Steps List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {processSteps.map((step) => (
          <div
            key={step.id}
            className="card-surface"
            style={{
              padding: '1.25rem 1.5rem',
              borderRadius: '4px',
              border: '1px solid var(--border-subtle)',
              borderLeft: '4px solid var(--accent-lime)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span className="mono" style={{ fontSize: '1.1rem', color: 'var(--accent-lime)', fontWeight: 800 }}>
                  {step.step}
                </span>
                <span style={{ color: 'var(--border-subtle)' }}>•</span>
                <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {step.phase}
                </span>
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '6px', color: 'var(--text-primary)' }}>{step.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 10px', lineHeight: 1.5 }}>
                {step.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {step.outputs.map((out, i) => (
                  <span
                    key={i}
                    className="mono"
                    style={{
                      fontSize: '0.7rem',
                      padding: '2px 8px',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '2px',
                      color: 'var(--accent-blue)',
                    }}
                  >
                    ✓ {out}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => openEditModal(step)}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 0.875rem', fontSize: '0.75rem' }}
              >
                <Edit2 size={13} />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete process stage "${step.title}"?`)) {
                    deleteProcessStep(step.id);
                  }
                }}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 0.75rem', color: '#ff6b6b' }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            className="card-surface"
            style={{
              width: '100%',
              maxWidth: '650px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '4px',
              padding: '2rem',
              border: '1px solid var(--border-medium)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--accent-lime)' }}>
                {editingStep ? '// Edit Process Stage' : '// Create Process Stage'}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    STEP NUMBER
                  </label>
                  <input
                    type="text"
                    required
                    value={formStepNumber}
                    onChange={(e) => setFormStepNumber(e.target.value)}
                    placeholder="01"
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontFamily: 'var(--font-mono)' }}
                  />
                </div>

                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    TIMELINE / SPRINT PHASE
                  </label>
                  <input
                    type="text"
                    required
                    value={formPhase}
                    onChange={(e) => setFormPhase(e.target.value)}
                    placeholder="Week 1 // Architecture"
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  STAGE TITLE
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Discovery & Technical Architecture"
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Deep-dive discovery sprint mapping API specifications, design tokens, and technical requirements."
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', resize: 'vertical' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  DELIVERABLES &amp; OUTPUTS (ONE PER LINE OR COMMA-SEPARATED)
                </label>
                <textarea
                  rows={4}
                  value={formOutputs}
                  onChange={(e) => setFormOutputs(e.target.value)}
                  placeholder="Technical Architecture Spec (TAS)&#10;Figma-to-Code Token Schema&#10;Performance Budget Contract"
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', color: 'var(--accent-lime)', borderRadius: '2px', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary" style={{ padding: '0.65rem 1.25rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.5rem' }}>
                  <Save size={14} />
                  <span>Save Stage</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

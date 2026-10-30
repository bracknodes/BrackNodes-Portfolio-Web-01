import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import type { ExperienceItem } from '../../../types/cms';
import { Plus, Edit2, Trash2, Briefcase, GraduationCap, Check, X } from 'lucide-react';

export const ExperienceView: React.FC = () => {
  const { experience, saveExperience, deleteExperience } = useCMS();
  const [editingItem, setEditingItem] = useState<ExperienceItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [type, setType] = useState<'experience' | 'education'>('experience');
  const [position, setPosition] = useState('');
  const [organization, setOrganization] = useState('');
  const [period, setPeriod] = useState('2022 — Present');
  const [description, setDescription] = useState('');
  const [isCurrent, setIsCurrent] = useState(true);

  const openAddModal = () => {
    setEditingItem(null);
    setType('experience');
    setPosition('');
    setOrganization('');
    setPeriod('2023 — Present');
    setDescription('');
    setIsCurrent(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: ExperienceItem) => {
    setEditingItem(item);
    setType(item.type);
    setPosition(item.position);
    setOrganization(item.organization);
    setPeriod(item.period);
    setDescription(item.description);
    setIsCurrent(item.isCurrent);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const item: ExperienceItem = {
      id: editingItem ? editingItem.id : `exp-${Date.now()}`,
      type,
      position: position.trim(),
      organization: organization.trim(),
      period: period.trim(),
      description: description.trim(),
      isCurrent,
      displayOrder: editingItem ? editingItem.displayOrder : experience.length,
      isPublished: true,
    };

    await saveExperience(item);
    setIsModalOpen(false);
  };

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Experience &amp; Education Timeline</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
            Curate professional roles, engineering milestones, and academic qualifications.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="btn btn-primary"
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.75rem' }}
        >
          <Plus size={15} />
          <span>Add Milestone</span>
        </button>
      </div>

      {experience.length === 0 ? (
        <div className="card-surface" style={{ padding: '3.5rem 2rem', textAlign: 'center', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
          <Briefcase size={40} color="var(--accent-blue)" style={{ margin: '0 auto 12px', opacity: 0.6 }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>No Milestones Configured</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Click &quot;Add Milestone&quot; to configure employment history, agency partnerships, or education.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {experience.map((item) => (
            <div
              key={item.id}
              className="card-surface"
              style={{
                padding: '1.25rem 1.5rem',
                borderRadius: '4px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ padding: '10px', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', borderRadius: '3px', color: item.type === 'experience' ? 'var(--accent-lime)' : 'var(--accent-blue)' }}>
                  {item.type === 'experience' ? <Briefcase size={20} /> : <GraduationCap size={20} />}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0 }}>
                      {item.position}
                    </h3>
                    <span style={{ color: 'var(--text-muted)' }}>@</span>
                    <span style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>{item.organization}</span>
                  </div>

                  <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    {item.period} {item.isCurrent ? '• (Current Role)' : ''}
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, margin: 0, maxWidth: '680px' }}>
                    {item.description}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => openEditModal(item)}
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                >
                  <Edit2 size={13} />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => deleteExperience(item.id)}
                  style={{
                    background: 'none',
                    border: '1px solid rgba(255, 95, 86, 0.4)',
                    color: '#ff8a84',
                    padding: '6px 10px',
                    borderRadius: '2px',
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
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
          <div className="card-surface" style={{ maxWidth: '560px', width: '100%', padding: '2rem', border: '1px solid var(--border-highlight)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.35rem' }}>
                {editingItem ? 'Edit Milestone' : 'Add Career Milestone'}
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
              <div style={{ display: 'flex', gap: '10px', marginBottom: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setType('experience')}
                  className="mono"
                  style={{
                    flex: 1,
                    padding: '8px',
                    border: `1px solid ${type === 'experience' ? 'var(--accent-lime)' : 'var(--border-subtle)'}`,
                    backgroundColor: type === 'experience' ? 'var(--accent-lime-muted)' : 'transparent',
                    color: type === 'experience' ? 'var(--accent-lime)' : 'var(--text-muted)',
                    borderRadius: '2px',
                    cursor: 'pointer',
                  }}
                >
                  Work Experience
                </button>
                <button
                  type="button"
                  onClick={() => setType('education')}
                  className="mono"
                  style={{
                    flex: 1,
                    padding: '8px',
                    border: `1px solid ${type === 'education' ? 'var(--accent-blue)' : 'var(--border-subtle)'}`,
                    backgroundColor: type === 'education' ? 'var(--accent-blue-muted)' : 'transparent',
                    color: type === 'education' ? 'var(--accent-blue)' : 'var(--text-muted)',
                    borderRadius: '2px',
                    cursor: 'pointer',
                  }}
                >
                  Education / Degree
                </button>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  ROLE / DEGREE TITLE *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Frontend Architect"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    ORGANIZATION / UNIVERSITY *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Studio Vertex"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
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
                    TIMEFRAME / PERIOD *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2023 — Present"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
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

              <div style={{ marginBottom: '1.5rem' }}>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  DESCRIPTION &amp; IMPACT
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your technical contributions, scope, or focus areas..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ padding: '0.65rem 1.25rem' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
                  <Check size={14} />
                  <span>Save Milestone</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

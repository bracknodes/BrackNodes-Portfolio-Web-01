import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import type { Testimonial } from '../../../types/cms';
import { Plus, Edit2, Trash2, Eye, EyeOff, Award, Check, X } from 'lucide-react';

export const TestimonialsView: React.FC = () => {
  const { testimonials, saveTestimonial, deleteTestimonial, toggleTestimonialPublish } = useCMS();
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [content, setContent] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [rating, setRating] = useState(5);
  const [isPublished, setIsPublished] = useState(true);

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setRole('');
    setCompany('');
    setContent('');
    setAvatarUrl('');
    setRating(5);
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (t: Testimonial) => {
    setEditingItem(t);
    setName(t.name);
    setRole(t.role);
    setCompany(t.company);
    setContent(t.content);
    setAvatarUrl(t.avatarUrl || '');
    setRating(t.rating || 5);
    setIsPublished(t.isPublished);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const item: Testimonial = {
      id: editingItem ? editingItem.id : `test-${Date.now()}`,
      name: name.trim(),
      role: role.trim(),
      company: company.trim(),
      content: content.trim(),
      avatarUrl: avatarUrl.trim() || undefined,
      rating: Number(rating),
      isPublished,
      displayOrder: editingItem ? editingItem.displayOrder : testimonials.length,
    };

    await saveTestimonial(item);
    setIsModalOpen(false);
  };

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Client Testimonials &amp; Endorsements</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
            Manage authentic client feedback and reviews. Only published reviews display on the website.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="btn btn-primary"
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.75rem' }}
        >
          <Plus size={15} />
          <span>Add Testimonial</span>
        </button>
      </div>

      {testimonials.length === 0 ? (
        <div className="card-surface" style={{ padding: '3.5rem 2rem', textAlign: 'center', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
          <Award size={40} color="var(--accent-lime)" style={{ margin: '0 auto 12px', opacity: 0.6 }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>No Testimonials Added</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Click &quot;Add Testimonial&quot; above to publish quotes and recommendations from real client collaborators.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="card-surface"
              style={{
                padding: '1.5rem',
                borderRadius: '4px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                      {t.name}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleTestimonialPublish(t.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: t.isPublished ? 'var(--accent-lime)' : 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                    title={t.isPublished ? 'Live on site' : 'Hidden draft'}
                  >
                    {t.isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>

                <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', marginBottom: '12px' }}>
                  {t.role} • {t.company}
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 1rem 0' }}>
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => openEditModal(t)}
                  className="btn btn-secondary"
                  style={{ padding: '5px 12px', fontSize: '0.75rem' }}
                >
                  <Edit2 size={13} />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => deleteTestimonial(t.id)}
                  style={{
                    background: 'none',
                    border: '1px solid rgba(255, 95, 86, 0.4)',
                    color: '#ff8a84',
                    padding: '5px 8px',
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

      {/* Modal Form */}
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
              maxWidth: '560px',
              width: '100%',
              padding: '2rem',
              border: '1px solid var(--border-highlight)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.35rem' }}>
                {editingItem ? 'Edit Testimonial' : 'Add Client Testimonial'}
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
              <div style={{ marginBottom: '1rem' }}>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  PERSON NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                    ROLE / POSITION *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VP of Product"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
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
                    COMPANY / BRAND *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Dynamics"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
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

              <div style={{ marginBottom: '1.25rem' }}>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  TESTIMONIAL CONTENT *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter the client's verified endorsement..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
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

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                  />
                  <span>Publish immediately to public website</span>
                </label>
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
                  <span>Save Testimonial</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

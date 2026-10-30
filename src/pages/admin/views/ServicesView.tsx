import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import type { Service } from '../../../types/cms';
import { Plus, Edit2, Trash2, Eye, EyeOff, Check, X } from 'lucide-react';

export const ServicesView: React.FC = () => {
  const { services, saveService, deleteService, toggleServicePublish } = useCMS();
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formNumber, setFormNumber] = useState('01');
  const [formTitle, setFormTitle] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formHighlight, setFormHighlight] = useState('Production Ready');
  const [formDeliverables, setFormDeliverables] = useState('');
  const [formOutcomes, setFormOutcomes] = useState('');

  const openAddModal = () => {
    setEditingService(null);
    setFormNumber(`0${services.length + 1}`);
    setFormTitle('');
    setFormTagline('');
    setFormDesc('');
    setFormHighlight('Signature Craft');
    setFormDeliverables('Architecture, Design System, Testing, Deployment');
    setFormOutcomes('Accelerated velocity, 100% WCAG AA compliance');
    setIsModalOpen(true);
  };

  const openEditModal = (s: Service) => {
    setEditingService(s);
    setFormNumber(s.number);
    setFormTitle(s.title);
    setFormTagline(s.tagline);
    setFormDesc(s.description);
    setFormHighlight(s.highlight);
    setFormDeliverables(s.deliverables.join('\n'));
    setFormOutcomes(s.outcomes.join('\n'));
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const deliverablesArray = formDeliverables
      .split('\n')
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    const outcomesArray = formOutcomes
      .split('\n')
      .map((o) => o.trim())
      .filter((o) => o.length > 0);

    const serviceData: Service = {
      id: editingService ? editingService.id : `srv-${Date.now()}`,
      number: formNumber.trim(),
      title: formTitle.trim(),
      tagline: formTagline.trim(),
      description: formDesc.trim(),
      deliverables: deliverablesArray,
      outcomes: outcomesArray,
      highlight: formHighlight.trim(),
      displayOrder: editingService ? editingService.displayOrder : services.length,
      isPublished: editingService ? editingService.isPublished : true,
    };

    await saveService(serviceData);
    setIsModalOpen(false);
  };

  return (
    <div style={{ maxWidth: '1200px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Services &amp; Offerings</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
            Configure freelance services, deliverables, and intended client outcomes.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="btn btn-primary"
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.75rem' }}
        >
          <Plus size={15} />
          <span>Add New Service</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {services.map((service) => (
          <div
            key={service.id}
            className="card-surface"
            style={{
              padding: '1.5rem',
              borderRadius: '4px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-lime)' }}>
                  {service.number}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    className="mono"
                    style={{
                      fontSize: '0.6875rem',
                      padding: '2px 8px',
                      backgroundColor: 'rgba(112, 185, 255, 0.12)',
                      color: 'var(--accent-blue)',
                      borderRadius: '2px',
                    }}
                  >
                    {service.highlight}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleServicePublish(service.id)}
                    title={service.isPublished ? 'Unpublish' : 'Publish'}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: service.isPublished ? 'var(--accent-lime)' : 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    {service.isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </div>

              <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>{service.title}</h3>
              <p className="mono" style={{ fontSize: '0.8125rem', color: 'var(--accent-blue)', marginBottom: '10px' }}>
                {service.tagline}
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {service.description}
              </p>

              <div style={{ marginBottom: '1rem' }}>
                <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Deliverables ({service.deliverables.length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {service.deliverables.map((d, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '0.75rem',
                        padding: '2px 8px',
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '2px',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => openEditModal(service)}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
              >
                <Edit2 size={13} />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => deleteService(service.id)}
                style={{
                  background: 'none',
                  border: '1px solid rgba(255, 95, 86, 0.4)',
                  color: '#ff8a84',
                  padding: '6px 10px',
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
          <div
            className="card-surface"
            style={{
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              border: '1px solid var(--border-highlight)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.35rem' }}>
                {editingService ? 'Edit Service' : 'Add New Service'}
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
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    NUM
                  </label>
                  <input
                    type="text"
                    required
                    value={formNumber}
                    onChange={(e) => setFormNumber(e.target.value)}
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

                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    SERVICE TITLE *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    TAGLINE
                  </label>
                  <input
                    type="text"
                    required
                    value={formTagline}
                    onChange={(e) => setFormTagline(e.target.value)}
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
                    HIGHLIGHT PILL
                  </label>
                  <input
                    type="text"
                    required
                    value={formHighlight}
                    onChange={(e) => setFormHighlight(e.target.value)}
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
                  DESCRIPTION
                </label>
                <textarea
                  rows={3}
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
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  DELIVERABLES (ONE PER LINE)
                </label>
                <textarea
                  rows={3}
                  value={formDeliverables}
                  onChange={(e) => setFormDeliverables(e.target.value)}
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

              <div style={{ marginBottom: '1.5rem' }}>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  TARGET BUSINESS OUTCOMES (ONE PER LINE)
                </label>
                <textarea
                  rows={2}
                  value={formOutcomes}
                  onChange={(e) => setFormOutcomes(e.target.value)}
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
                  <span>Save Service</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

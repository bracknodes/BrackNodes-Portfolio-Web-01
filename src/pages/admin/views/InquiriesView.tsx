import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import type { ContactInquiry } from '../../../types/cms';
import {
  Inbox,
  Mail,
  Trash2,
  CheckCircle,
  Archive,
  Sliders,
} from 'lucide-react';

export const InquiriesView: React.FC<{ onNavigateToForm?: () => void }> = ({ onNavigateToForm }) => {
  const { inquiries, updateInquiryStatus, deleteInquiry } = useCMS();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);

  const filtered = inquiries.filter((inq) => {
    if (filterStatus === 'all') return true;
    return inq.status === filterStatus;
  });

  return (
    <div style={{ maxWidth: '1100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Client Inquiries Inbox</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
            Real-time project leads captured from the public website contact intake form.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {onNavigateToForm && (
            <button
              type="button"
              onClick={onNavigateToForm}
              className="mono btn btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                padding: '7px 12px',
                backgroundColor: 'rgba(199, 255, 107, 0.08)',
                borderColor: 'var(--accent-lime)',
                color: 'var(--accent-lime)',
              }}
            >
              <Sliders size={14} />
              <span>EDIT INQUIRE FORM</span>
            </button>
          )}

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '6px' }}>
          {(['all', 'new', 'read', 'replied', 'archived'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilterStatus(s)}
              className="mono"
              style={{
                fontSize: '0.75rem',
                padding: '6px 12px',
                borderRadius: '2px',
                border: `1px solid ${filterStatus === s ? 'var(--accent-lime)' : 'var(--border-subtle)'}`,
                backgroundColor: filterStatus === s ? 'var(--accent-lime-muted)' : '#0c0f17',
                color: filterStatus === s ? 'var(--accent-lime)' : 'var(--text-muted)',
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}
            >
              {s}
            </button>
          ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          className="card-surface"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            borderRadius: '4px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <Inbox size={42} color="var(--text-muted)" style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>No Inquiries Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Inbound client submissions will appear here with full message details and one-click email reply links.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedInquiry ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
          {/* List of Inquiries */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map((inq) => {
              const isSelected = selectedInquiry?.id === inq.id;
              return (
                <div
                  key={inq.id}
                  onClick={() => {
                    setSelectedInquiry(inq);
                    if (inq.status === 'new') {
                      updateInquiryStatus(inq.id, 'read');
                    }
                  }}
                  className="card-surface"
                  style={{
                    padding: '1.25rem',
                    borderRadius: '3px',
                    border: `1px solid ${isSelected ? 'var(--accent-lime)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {inq.name}
                    </div>
                    <span
                      className="mono"
                      style={{
                        fontSize: '0.625rem',
                        padding: '2px 8px',
                        borderRadius: '2px',
                        backgroundColor: inq.status === 'new' ? 'var(--accent-lime-muted)' : 'rgba(255,255,255,0.05)',
                        color: inq.status === 'new' ? 'var(--accent-lime)' : 'var(--text-muted)',
                      }}
                    >
                      {inq.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', marginBottom: '6px' }}>
                    {inq.projectType} {inq.budget ? `• Budget: ${inq.budget}` : ''}
                  </div>

                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.85rem',
                      margin: '0 0 8px 0',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {inq.message}
                  </p>

                  <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    {new Date(inq.createdAt).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Inquiry Detail Inspector */}
          {selectedInquiry && (
            <div
              className="card-surface"
              style={{
                padding: '1.75rem',
                borderRadius: '4px',
                border: '1px solid var(--border-highlight)',
                position: 'sticky',
                top: '90px',
                maxHeight: 'calc(100vh - 120px)',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', marginBottom: '4px' }}>{selectedInquiry.name}</h3>
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="mono"
                    style={{ color: 'var(--accent-lime)', textDecoration: 'none', fontSize: '0.875rem' }}
                  >
                    {selectedInquiry.email}
                  </a>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => updateInquiryStatus(selectedInquiry.id, 'replied')}
                    title="Mark as Replied"
                    style={{ background: 'none', border: '1px solid var(--border-subtle)', color: 'var(--accent-blue)', padding: '6px', borderRadius: '2px', cursor: 'pointer' }}
                  >
                    <CheckCircle size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateInquiryStatus(selectedInquiry.id, 'archived')}
                    title="Archive Lead"
                    style={{ background: 'none', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', padding: '6px', borderRadius: '2px', cursor: 'pointer' }}
                  >
                    <Archive size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await deleteInquiry(selectedInquiry.id);
                      setSelectedInquiry(null);
                    }}
                    title="Delete Lead"
                    style={{ background: 'none', border: '1px solid rgba(255,95,86,0.3)', color: '#ff8a84', padding: '6px', borderRadius: '2px', cursor: 'pointer' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '10px 14px', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', borderRadius: '2px', marginBottom: '1.25rem' }}>
                <div>
                  <div className="mono" style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>PROJECT FOCUS</div>
                  <div className="mono" style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: 600 }}>{selectedInquiry.projectType}</div>
                </div>
                <div>
                  <div className="mono" style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>BUDGET RANGE</div>
                  <div className="mono" style={{ fontSize: '0.8125rem', color: 'var(--accent-lime)', fontWeight: 600 }}>{selectedInquiry.budget || 'Not specified'}</div>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  MESSAGE CONTENT
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', borderRadius: '2px', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                  {selectedInquiry.message}
                </div>
              </div>

              <a
                href={`mailto:${selectedInquiry.email}?subject=${encodeURIComponent(`Re: Project Discussion — ${selectedInquiry.projectType}`)}`}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                <Mail size={16} />
                <span>Compose Reply in Email Client</span>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import type { Collaborator, CollaboratorRole, CollaboratorPermissions } from '../../../types/cms';
import {
  UserPlus,
  Trash2,
  Edit2,
  Check,
  X,
  Mail,
  FolderGit2,
  Briefcase,
  Cpu,
  FileText,
  Inbox,
  Palette,
  Image as ImageIcon,
  Lock,
} from 'lucide-react';

const DEFAULT_PERMISSIONS: Record<CollaboratorRole, CollaboratorPermissions> = {
  admin: {
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
  editor: {
    canManageProjects: true,
    canManageServices: true,
    canManageSkills: true,
    canManageContent: true,
    canViewInquiries: false,
    canManageInquireForm: false,
    canManageDesign: true,
    canManageMedia: true,
    canManageSecurity: false,
  },
  viewer: {
    canManageProjects: false,
    canManageServices: false,
    canManageSkills: false,
    canManageContent: false,
    canViewInquiries: true,
    canManageInquireForm: true,
    canManageDesign: false,
    canManageMedia: false,
    canManageSecurity: false,
  },
  custom: {
    canManageProjects: true,
    canManageServices: false,
    canManageSkills: false,
    canManageContent: true,
    canViewInquiries: false,
    canManageInquireForm: false,
    canManageDesign: false,
    canManageMedia: true,
    canManageSecurity: false,
  },
};

export const CollaboratorsView: React.FC = () => {
  const { siteSettings, addCollaborator, updateCollaborator, deleteCollaborator } = useCMS();

  const collaborators = siteSettings.collaborators || [];

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<CollaboratorRole>('editor');
  const [formPermissions, setFormPermissions] = useState<CollaboratorPermissions>(DEFAULT_PERMISSIONS.editor);
  const [formStatus, setFormStatus] = useState<'active' | 'invited' | 'suspended'>('active');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingId(null);
    setFormName('');
    setFormEmail('');
    setFormRole('editor');
    setFormPermissions(DEFAULT_PERMISSIONS.editor);
    setFormStatus('active');
    setIsModalOpen(true);
  };

  const openEditModal = (collab: Collaborator) => {
    setEditingId(collab.id);
    setFormName(collab.name || '');
    setFormEmail(collab.email || '');
    const role = collab.role || 'editor';
    setFormRole(role);
    setFormPermissions(collab.permissions || DEFAULT_PERMISSIONS[role]);
    setFormStatus(collab.status || 'active');
    setIsModalOpen(true);
  };

  const handleRoleChange = (role: CollaboratorRole) => {
    setFormRole(role);
    if (role !== 'custom') {
      setFormPermissions(DEFAULT_PERMISSIONS[role]);
    }
  };

  const handlePermissionToggle = (key: keyof CollaboratorPermissions) => {
    setFormPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setFormRole('custom');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmail.trim() || !formName.trim()) return;

    if (editingId) {
      await updateCollaborator(editingId, {
        name: formName.trim(),
        email: formEmail.trim().toLowerCase(),
        role: formRole,
        permissions: formPermissions,
        status: formStatus,
      });
      setFeedbackMsg(`Access permissions updated for ${formName}.`);
    } else {
      await addCollaborator({
        name: formName.trim(),
        email: formEmail.trim().toLowerCase(),
        role: formRole,
        permissions: formPermissions,
        status: formStatus,
      });
      setFeedbackMsg(`Access granted to ${formEmail}.`);
    }

    setIsModalOpen(false);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Revoke all admin permissions and remove access for ${name}?`)) {
      await deleteCollaborator(id);
      setFeedbackMsg(`Revoked access for ${name}.`);
      setTimeout(() => setFeedbackMsg(null), 3000);
    }
  };

  const permissionItems: { key: keyof CollaboratorPermissions; label: string; desc: string; icon: React.ReactNode }[] = [
    { key: 'canManageProjects', label: 'Projects Manager', desc: 'Create, edit, duplicate, and toggle public projects & sandbox', icon: <FolderGit2 size={15} /> },
    { key: 'canManageServices', label: 'Services & Scope', desc: 'Manage freelance offerings, deliverables, and pricing scope', icon: <Briefcase size={15} /> },
    { key: 'canManageSkills', label: 'Skills & Tech Stack', desc: 'Add/delete categories and edit technical skills & tags', icon: <Cpu size={15} /> },
    { key: 'canManageContent', label: 'Website Content & Bio', desc: 'Edit hero bio, tagline, about text, experience, and testimonials', icon: <FileText size={15} /> },
    { key: 'canViewInquiries', label: 'Client Inquiries (CRM)', desc: 'View confidential client project leads and incoming inquiries', icon: <Inbox size={15} /> },
    { key: 'canManageInquireForm', label: 'Inquire Form Editor', desc: 'Edit project questionnaires, budget tiers, and form settings', icon: <FileText size={15} /> },
    { key: 'canManageDesign', label: 'Design Customization', desc: 'Modify CSS design tokens, themes, typography, and custom code', icon: <Palette size={15} /> },
    { key: 'canManageMedia', label: 'Media Library', desc: 'Upload, replace, and delete images and project media assets', icon: <ImageIcon size={15} /> },
    { key: 'canManageSecurity', label: 'Database & Security (Admin)', desc: 'Manage database credentials, JSON backups, and team permissions', icon: <Lock size={15} /> },
  ];

  return (
    <div style={{ maxWidth: '1100px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-lime)', marginBottom: '4px' }}>
            ACCESS CONTROL // ROLE-BASED PERMISSIONS
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '4px', color: '#F7F7F2' }}>
            Team Access &amp; Permissions
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
            Invite other people or emails and grant granular permissions for each section of the studio CMS.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="btn btn-primary"
          style={{ padding: '0.75rem 1.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <UserPlus size={16} />
          <span>Grant Access to Person</span>
        </button>
      </div>

      {feedbackMsg && (
        <div style={{ padding: '12px 16px', backgroundColor: 'rgba(199, 255, 107, 0.1)', border: '1px solid var(--accent-lime)', borderRadius: '3px', color: 'var(--accent-lime)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
          <Check size={16} />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Summary KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card-surface" style={{ padding: '1.25rem', borderRadius: '4px' }}>
          <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '6px' }}>TOTAL AUTHORIZED</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F7F7F2' }}>{collaborators.length}</div>
          <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>Registered Accounts</div>
        </div>

        <div className="card-surface" style={{ padding: '1.25rem', borderRadius: '4px' }}>
          <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '6px' }}>FULL ADMINISTRATORS</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-lime)' }}>
            {collaborators.filter((c) => c.role === 'admin').length}
          </div>
          <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>Full Root Access</div>
        </div>

        <div className="card-surface" style={{ padding: '1.25rem', borderRadius: '4px' }}>
          <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '6px' }}>RESTRICTED EDITORS</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-blue)' }}>
            {collaborators.filter((c) => c.role !== 'admin').length}
          </div>
          <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>Scoped Action Access</div>
        </div>
      </div>

      {/* Collaborators List */}
      <div className="card-surface" style={{ padding: '1.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: '#F7F7F2' }}>
          Authorized Collaborators ({collaborators.length})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {collaborators.map((collab) => {
            const isOwner = collab.id === 'collab-owner' || collab.email === (siteSettings.email || 'support@bracknodes.in').toLowerCase();
            const grantedCount = collab.permissions ? Object.values(collab.permissions).filter(Boolean).length : 0;

            return (
              <div
                key={collab.id}
                style={{
                  padding: '1.25rem',
                  backgroundColor: '#0c0f17',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '3px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '260px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: collab.role === 'admin' ? 'rgba(199, 255, 107, 0.15)' : 'rgba(96, 168, 248, 0.15)',
                      border: `1px solid ${collab.role === 'admin' ? 'var(--accent-lime)' : 'var(--accent-blue)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: collab.role === 'admin' ? 'var(--accent-lime)' : 'var(--accent-blue)',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {collab.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#F7F7F2' }}>
                        {collab.name}
                      </span>
                      {isOwner && (
                        <span className="mono" style={{ fontSize: '0.625rem', padding: '1px 6px', borderRadius: '2px', backgroundColor: 'rgba(199, 255, 107, 0.15)', color: 'var(--accent-lime)' }}>
                          PRIMARY OWNER
                        </span>
                      )}
                      <span
                        className="mono"
                        style={{
                          fontSize: '0.625rem',
                          padding: '1px 6px',
                          borderRadius: '2px',
                          backgroundColor: collab.status === 'active' ? 'rgba(199, 255, 107, 0.1)' : 'rgba(255, 95, 86, 0.1)',
                          color: collab.status === 'active' ? 'var(--accent-lime)' : '#ff8a84',
                        }}
                      >
                        {collab.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mail size={12} />
                      <span>{collab.email}</span>
                      <span>•</span>
                      <span style={{ color: collab.role === 'admin' ? 'var(--accent-lime)' : 'var(--accent-blue)', textTransform: 'capitalize' }}>
                        {collab.role} ({grantedCount}/9 actions)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Permissions Pill Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxWidth: '420px' }}>
                  {collab.permissions.canManageProjects && (
                    <span className="mono" style={{ fontSize: '0.625rem', padding: '2px 6px', backgroundColor: '#161c2b', border: '1px solid #25314c', borderRadius: '2px', color: '#8b97b0' }}>
                      Projects
                    </span>
                  )}
                  {collab.permissions.canManageContent && (
                    <span className="mono" style={{ fontSize: '0.625rem', padding: '2px 6px', backgroundColor: '#161c2b', border: '1px solid #25314c', borderRadius: '2px', color: '#8b97b0' }}>
                      Content
                    </span>
                  )}
                  {collab.permissions.canViewInquiries && (
                    <span className="mono" style={{ fontSize: '0.625rem', padding: '2px 6px', backgroundColor: '#161c2b', border: '1px solid #25314c', borderRadius: '2px', color: 'var(--accent-lime)' }}>
                      Inquiries
                    </span>
                  )}
                  {collab.permissions.canManageDesign && (
                    <span className="mono" style={{ fontSize: '0.625rem', padding: '2px 6px', backgroundColor: '#161c2b', border: '1px solid #25314c', borderRadius: '2px', color: '#8b97b0' }}>
                      Design
                    </span>
                  )}
                  {collab.permissions.canManageSecurity && (
                    <span className="mono" style={{ fontSize: '0.625rem', padding: '2px 6px', backgroundColor: 'rgba(199, 255, 107, 0.1)', border: '1px solid rgba(199, 255, 107, 0.3)', borderRadius: '2px', color: 'var(--accent-lime)' }}>
                      Root Admin
                    </span>
                  )}
                </div>

                {/* Edit & Delete Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => openEditModal(collab)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Edit2 size={13} />
                    <span>Decide Permissions</span>
                  </button>

                  {!isOwner && (
                    <button
                      type="button"
                      onClick={() => handleDelete(collab.id, collab.name)}
                      title="Revoke access"
                      style={{
                        padding: '6px 10px',
                        backgroundColor: 'rgba(255, 95, 86, 0.1)',
                        border: '1px solid rgba(255, 95, 86, 0.3)',
                        borderRadius: '3px',
                        color: '#ff8a84',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ADD / EDIT PERMISSIONS MODAL */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(5px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            overflowY: 'auto',
          }}
        >
          <div
            className="card-surface"
            style={{
              maxWidth: '680px',
              width: '100%',
              padding: '2rem',
              borderRadius: '4px',
              border: '1px solid var(--border-medium)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--accent-lime)' }}>
                  COLLABORATOR ACCESS CONFIGURATION
                </div>
                <h3 style={{ fontSize: '1.3rem', margin: 0, color: '#F7F7F2' }}>
                  {editingId ? 'Edit Person Permissions & Actions' : 'Grant Access to Other Mail / Person'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    PERSON / FULL NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Alex Rivera, Content Lead"
                    style={{ width: '100%', padding: '0.7rem', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', borderRadius: '2px', color: '#F7F7F2' }}
                  />
                </div>

                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="e.g. alex@studio.com"
                    style={{ width: '100%', padding: '0.7rem', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', borderRadius: '2px', color: '#F7F7F2' }}
                  />
                </div>
              </div>

              {/* Role Preset Selector */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  CHOOSE ACCESS ROLE PRESET
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                  {(['admin', 'editor', 'viewer', 'custom'] as CollaboratorRole[]).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRoleChange(role)}
                      style={{
                        padding: '10px 8px',
                        backgroundColor: formRole === role ? 'rgba(199, 255, 107, 0.12)' : '#0c0f17',
                        border: `1px solid ${formRole === role ? 'var(--accent-lime)' : 'var(--border-subtle)'}`,
                        borderRadius: '2px',
                        color: formRole === role ? 'var(--accent-lime)' : 'var(--text-secondary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        textTransform: 'capitalize',
                        cursor: 'pointer',
                        fontWeight: formRole === role ? 700 : 400,
                      }}
                    >
                      {role === 'admin' ? 'Administrator' : role === 'viewer' ? 'Inquiries Viewer' : role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Granular Action Checkboxes */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-lime)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>DECIDE PERMISSIONS &amp; ACTIONS:</span>
                  <span style={{ color: 'var(--text-muted)' }}>Toggle specific sections</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {permissionItems.map((item) => {
                    const isGranted = formPermissions[item.key];
                    return (
                      <div
                        key={item.key}
                        onClick={() => handlePermissionToggle(item.key)}
                        style={{
                          padding: '10px 14px',
                          backgroundColor: isGranted ? 'rgba(199, 255, 107, 0.05)' : '#0c0f17',
                          border: `1px solid ${isGranted ? 'rgba(199, 255, 107, 0.3)' : 'var(--border-subtle)'}`,
                          borderRadius: '2px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ color: isGranted ? 'var(--accent-lime)' : 'var(--text-muted)' }}>
                            {item.icon}
                          </span>
                          <div>
                            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: isGranted ? '#F7F7F2' : 'var(--text-muted)' }}>
                              {item.label}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                              {item.desc}
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '3px',
                            backgroundColor: isGranted ? 'var(--accent-lime)' : 'transparent',
                            border: `1px solid ${isGranted ? 'var(--accent-lime)' : 'var(--border-subtle)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#090B10',
                          }}
                        >
                          {isGranted && <Check size={14} strokeWidth={3} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Account Status Selection */}
              <div style={{ marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ACCOUNT STATUS:</span>
                {(['active', 'suspended'] as const).map((status) => (
                  <label key={status} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.8rem', color: '#F7F7F2', fontFamily: 'var(--font-mono)' }}>
                    <input
                      type="radio"
                      name="collab-status"
                      checked={formStatus === status}
                      onChange={() => setFormStatus(status)}
                    />
                    <span style={{ textTransform: 'capitalize' }}>{status}</span>
                  </label>
                ))}
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ padding: '0.65rem 1.25rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '0.65rem 1.5rem' }}
                >
                  <Check size={16} />
                  <span>{editingId ? 'Save Permissions' : 'Grant Access'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

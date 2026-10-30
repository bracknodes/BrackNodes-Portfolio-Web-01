import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import { Plus, X, Trash2, Edit3, Check, FolderPlus, AlertCircle } from 'lucide-react';

export const SkillsView: React.FC = () => {
  const {
    skills,
    addSkillCategory,
    deleteSkillCategory,
    updateSkillCategoryInfo,
    addSkillToCategory,
    removeSkillFromCategory,
  } = useCMS();

  const [selectedCatIndex, setSelectedCatIndex] = useState(0);

  // New Skill Inputs
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillTag, setNewSkillTag] = useState('Framework');

  // New Category Modal / Inline Form
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Edit Category Name / Description State
  const [isEditingCat, setIsEditingCat] = useState(false);
  const [editCatName, setEditCatName] = useState('');
  const [editCatDesc, setEditCatDesc] = useState('');

  const activeCategory = skills[selectedCatIndex] || skills[0] || { name: 'Skills', description: '', skills: [] };

  const startEditingCat = () => {
    setEditCatName(activeCategory.name);
    setEditCatDesc(activeCategory.description);
    setIsEditingCat(true);
  };

  const handleSaveCatEdit = async () => {
    if (!editCatName.trim()) return;
    await updateSkillCategoryInfo(selectedCatIndex, editCatName.trim(), editCatDesc.trim());
    setIsEditingCat(false);
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    await addSkillCategory({
      name: newCatName.trim(),
      description: newCatDesc.trim() || 'Core technical competencies and production tools.',
      skills: [],
    });

    setNewCatName('');
    setNewCatDesc('');
    setIsAddingCat(false);
    setSelectedCatIndex(skills.length);
  };

  const handleDeleteCategory = async () => {
    if (skills.length <= 1) {
      alert('You must have at least one skill category.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete the "${activeCategory.name}" category and all its skills?`)) {
      await deleteSkillCategory(selectedCatIndex);
      setSelectedCatIndex(Math.max(0, selectedCatIndex - 1));
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    await addSkillToCategory(selectedCatIndex, {
      name: newSkillName.trim(),
      tag: newSkillTag.trim() || 'Tool',
    });

    setNewSkillName('');
  };

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Skills &amp; Technology Stack</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
            Organize technical competencies by architectural domain. Add, edit, or delete domains and individual skills.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddingCat(true)}
          className="btn btn-primary"
          style={{ padding: '8px 16px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <FolderPlus size={14} />
          <span>Add New Category</span>
        </button>
      </div>

      {/* New Category Form Modal / Banner */}
      {isAddingCat && (
        <form
          onSubmit={handleCreateCategory}
          style={{
            backgroundColor: '#0c0f17',
            border: '1px solid var(--accent-lime)',
            borderRadius: '4px',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 className="mono" style={{ fontSize: '0.9rem', color: 'var(--accent-lime)', margin: 0 }}>
              // CREATE NEW SKILLS CATEGORY
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingCat(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                CATEGORY NAME *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Backend & Cloud Architecture"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.875rem',
                  backgroundColor: '#07090e',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  borderRadius: '2px',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div>
              <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                SHORT DESCRIPTION
              </label>
              <input
                type="text"
                placeholder="e.g. Distributed microservices, serverless compute, and container orchestration."
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.875rem',
                  backgroundColor: '#07090e',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  borderRadius: '2px',
                  fontSize: '0.875rem',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setIsAddingCat(false)}
              className="btn btn-ghost"
              style={{ padding: '6px 14px', fontSize: '0.75rem' }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '0.75rem' }}>
              Create Category
            </button>
          </div>
        </form>
      )}

      {/* Category Pills Navigation */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.5rem' }}>
        {skills.map((cat, idx) => (
          <button
            key={cat.name + idx}
            type="button"
            onClick={() => {
              setSelectedCatIndex(idx);
              setIsEditingCat(false);
            }}
            className="mono"
            style={{
              padding: '8px 16px',
              borderRadius: '2px',
              fontSize: '0.8125rem',
              cursor: 'pointer',
              border: `1px solid ${selectedCatIndex === idx ? 'var(--accent-lime)' : 'var(--border-subtle)'}`,
              backgroundColor: selectedCatIndex === idx ? 'var(--accent-lime-muted)' : '#0c0f17',
              color: selectedCatIndex === idx ? 'var(--accent-lime)' : 'var(--text-secondary)',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{cat.name}</span>
            <span style={{ opacity: 0.6, fontSize: '0.7rem' }}>({cat.skills?.length || 0})</span>
          </button>
        ))}
      </div>

      {/* Active Category Workspace */}
      <div className="card-surface" style={{ padding: '1.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
        {/* Category Header with Edit & Delete Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          {isEditingCat ? (
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ marginBottom: '8px' }}>
                <label className="mono" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>CATEGORY TITLE</label>
                <input
                  type="text"
                  value={editCatName}
                  onChange={(e) => setEditCatName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: '#0c0f17',
                    border: '1px solid var(--accent-lime)',
                    color: 'var(--text-primary)',
                    borderRadius: '2px',
                    fontSize: '1rem',
                    fontWeight: 700,
                  }}
                />
              </div>
              <div>
                <label className="mono" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>DESCRIPTION</label>
                <input
                  type="text"
                  value={editCatDesc}
                  onChange={(e) => setEditCatDesc(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: '#0c0f17',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-secondary)',
                    borderRadius: '2px',
                    fontSize: '0.85rem',
                  }}
                />
              </div>
            </div>
          ) : (
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '6px', color: 'var(--text-primary)' }}>
                {activeCategory.name}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0, maxWidth: '700px' }}>
                {activeCategory.description}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {isEditingCat ? (
              <>
                <button
                  type="button"
                  onClick={handleSaveCatEdit}
                  className="btn btn-primary"
                  style={{ padding: '6px 12px', fontSize: '0.725rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Check size={13} />
                  <span>Save</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingCat(false)}
                  className="btn btn-ghost"
                  style={{ padding: '6px 10px', fontSize: '0.725rem' }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={startEditingCat}
                  className="btn btn-ghost"
                  title="Rename category or description"
                  style={{ padding: '6px 12px', fontSize: '0.725rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <Edit3 size={13} />
                  <span>Edit Category</span>
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCategory}
                  disabled={skills.length <= 1}
                  className="btn btn-ghost"
                  title="Delete category"
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.725rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    color: skills.length <= 1 ? 'var(--text-muted)' : '#ef4444',
                    borderColor: skills.length <= 1 ? 'transparent' : 'rgba(239, 68, 68, 0.3)',
                    cursor: skills.length <= 1 ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Trash2 size={13} />
                  <span>Delete Category</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Existing Skills Badges */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div className="mono" style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
            TECHNOLOGY INVENTORY ({activeCategory.skills?.length || 0})
          </div>

          {activeCategory.skills?.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', border: '1px dashed var(--border-subtle)', borderRadius: '4px', color: 'var(--text-muted)' }}>
              <AlertCircle size={20} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.5 }} />
              <p className="mono" style={{ fontSize: '0.8rem', margin: 0 }}>No skills added to this category yet. Use the form below to add technologies.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '10px' }}>
              {activeCategory.skills.map((skill) => (
                <div
                  key={skill.name}
                  style={{
                    padding: '10px 14px',
                    backgroundColor: '#0c0f17',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '2px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      {skill.name}
                    </div>
                    <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--accent-blue)' }}>
                      {skill.tag}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeSkillFromCategory(selectedCatIndex, skill.name)}
                    title="Remove technology"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '2px',
                      transition: 'color var(--t-fast)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Skill Mini Form */}
        <form onSubmit={handleAddSkill} style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
          <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            ADD NEW TECHNOLOGY TO {activeCategory.name.toUpperCase()}
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="e.g. Next.js, Docker, WebGL"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '0.65rem 1rem',
                backgroundColor: '#0c0f17',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: '2px',
                fontSize: '0.875rem',
              }}
            />

            <input
              type="text"
              placeholder="Tag (e.g. Framework, Architecture, Shader)"
              value={newSkillTag}
              onChange={(e) => setNewSkillTag(e.target.value)}
              style={{
                width: '180px',
                padding: '0.65rem 1rem',
                backgroundColor: '#0c0f17',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: '2px',
                fontSize: '0.875rem',
                fontFamily: 'var(--font-mono)',
              }}
            />

            <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.75rem' }}>
              <Plus size={14} />
              <span>Add Tech</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

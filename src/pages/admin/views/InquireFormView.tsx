import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import { Check, Plus, X, Send, Eye } from 'lucide-react';

export const InquireFormView: React.FC = () => {
  const { siteSettings, updateSiteSettings } = useCMS();

  const current = siteSettings.inquireForm || {
    sectionTag: '07 // Host With BrackNodes',
    sectionTitle: 'GET IN TOUCH',
    sectionSubtitle: "Need a custom cloud deployment, Discord bot hosting, or migration help? Talk to our team.",
    pitchHeadline: 'Enterprise-grade hosting with direct human support.',
    pitchDescription: 'Have a question about our NVMe web hosting, Discord bot plans, or dedicated compute? Reach out anytime. Our cloud engineers respond promptly.',
    projectTypes: ['Discord Bot Hosting', 'cPanel Web Hosting', 'Cloud VPS / Dedicated', 'Server Migration', 'Enterprise / Custom Solution'],
    budgetOptions: ['₹29 – ₹99 /mo', '₹99 – ₹299 /mo', '₹299 – ₹999 /mo', '₹999+ /mo'],
    submitButtonText: 'Send Inquiry',
    successMessage: 'Thank you! Your project inquiry has been securely stored in our database. We will review your requirements and respond shortly.',
    responseSla: '24/7 SUPPORT RESPONSE',
    confidentialityNotice: '99.99% UPTIME GUARANTEE',
    nameLabel: 'YOUR NAME *',
    namePlaceholder: 'e.g. Alex Sharma',
    emailLabel: 'EMAIL ADDRESS *',
    emailPlaceholder: 'e.g. alex@bracknodes.in',
    projectFocusLabel: 'SERVICE / HOSTING FOCUS',
    budgetLabel: 'APPROXIMATE BUDGET (OPTIONAL)',
    messageLabel: 'PROJECT DETAILS & GOALS *',
    messagePlaceholder: "Tell us about your requirements, server specifications, bot workload, or migration needs...",
    disclaimerText: '* No spam or agency pitches. 99.99% uptime guarantee.',
  };

  const [sectionTag, setSectionTag] = useState(current.sectionTag);
  const [sectionTitle, setSectionTitle] = useState(current.sectionTitle);
  const [sectionSubtitle, setSectionSubtitle] = useState(current.sectionSubtitle);
  const [pitchHeadline, setPitchHeadline] = useState(current.pitchHeadline);
  const [pitchDescription, setPitchDescription] = useState(current.pitchDescription);
  const [responseSla, setResponseSla] = useState(current.responseSla);
  const [confidentialityNotice, setConfidentialityNotice] = useState(current.confidentialityNotice);

  const [projectTypes, setProjectTypes] = useState<string[]>(current.projectTypes || []);
  const [newProjectType, setNewProjectType] = useState('');

  const [budgetOptions, setBudgetOptions] = useState<string[]>(current.budgetOptions || []);
  const [newBudgetOption, setNewBudgetOption] = useState('');

  const [nameLabel, setNameLabel] = useState(current.nameLabel || 'YOUR NAME *');
  const [namePlaceholder, setNamePlaceholder] = useState(current.namePlaceholder || 'e.g. Alex Sharma');
  const [emailLabel, setEmailLabel] = useState(current.emailLabel || 'EMAIL ADDRESS *');
  const [emailPlaceholder, setEmailPlaceholder] = useState(current.emailPlaceholder || 'e.g. alex@bracknodes.in');
  const [projectFocusLabel, setProjectFocusLabel] = useState(current.projectFocusLabel || 'SERVICE / HOSTING FOCUS');
  const [budgetLabel, setBudgetLabel] = useState(current.budgetLabel || 'APPROXIMATE BUDGET (OPTIONAL)');
  const [messageLabel, setMessageLabel] = useState(current.messageLabel || 'PROJECT DETAILS & GOALS *');
  const [messagePlaceholder, setMessagePlaceholder] = useState(current.messagePlaceholder || "Tell us about your requirements, server specifications, bot workload, or migration needs...");
  const [disclaimerText, setDisclaimerText] = useState(
    current.disclaimerText !== undefined ? current.disclaimerText : '* No spam or agency pitches. 99.99% uptime guarantee.'
  );

  const [submitButtonText, setSubmitButtonText] = useState(current.submitButtonText || 'Send Inquiry');
  const [successMessage, setSuccessMessage] = useState(current.successMessage || 'Thank you! Your inquiry has been received.');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddProjectType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectType.trim()) return;
    if (projectTypes.includes(newProjectType.trim())) return;
    setProjectTypes([...projectTypes, newProjectType.trim()]);
    setNewProjectType('');
  };

  const handleRemoveProjectType = (item: string) => {
    setProjectTypes(projectTypes.filter((t) => t !== item));
  };

  const handleAddBudgetOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBudgetOption.trim()) return;
    if (budgetOptions.includes(newBudgetOption.trim())) return;
    setBudgetOptions([...budgetOptions, newBudgetOption.trim()]);
    setNewBudgetOption('');
  };

  const handleRemoveBudgetOption = (item: string) => {
    setBudgetOptions(budgetOptions.filter((b) => b !== item));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateSiteSettings({
      inquireForm: {
        sectionTag,
        sectionTitle,
        sectionSubtitle,
        pitchHeadline,
        pitchDescription,
        projectTypes: projectTypes.length ? projectTypes : ['Discord Bot Hosting', 'cPanel Web Hosting'],
        budgetOptions: budgetOptions.length ? budgetOptions : ['₹29 – ₹99 /mo', '₹99 – ₹299 /mo'],
        submitButtonText,
        successMessage,
        responseSla,
        confidentialityNotice,
        nameLabel,
        namePlaceholder,
        emailLabel,
        emailPlaceholder,
        projectFocusLabel,
        budgetLabel,
        messageLabel,
        messagePlaceholder,
        disclaimerText,
      },
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div style={{ maxWidth: '960px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Inquire Form &amp; Lead Intake Editor</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
          Customize your public inquiry form, input field labels, placeholders, selectable service categories, budget tiers, and client response commitments.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Section 01: Headings & Outreach Pitch */}
        <div className="card-surface" style={{ padding: '1.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: 'var(--accent-lime)' }}>
            // 01. Section Headings &amp; Intro Pitch
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                SECTION TAG / PREFIX
              </label>
              <input
                type="text"
                value={sectionTag}
                onChange={(e) => setSectionTag(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#0c0f17',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  borderRadius: '2px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div>
              <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                SECTION TITLE
              </label>
              <input
                type="text"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#0c0f17',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  borderRadius: '2px',
                  fontSize: '0.875rem',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              SECTION SUBTITLE
            </label>
            <input
              type="text"
              value={sectionSubtitle}
              onChange={(e) => setSectionSubtitle(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#0c0f17',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: '2px',
                fontSize: '0.875rem',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              PITCH HEADLINE (LEFT COLUMN)
            </label>
            <input
              type="text"
              value={pitchHeadline}
              onChange={(e) => setPitchHeadline(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#0c0f17',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: '2px',
                fontSize: '0.875rem',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              PITCH NARRATIVE / DETAILED DESCRIPTION
            </label>
            <textarea
              rows={3}
              value={pitchDescription}
              onChange={(e) => setPitchDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#0c0f17',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: '2px',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
                lineHeight: 1.5,
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                RESPONSE SLA GUARANTEE
              </label>
              <input
                type="text"
                value={responseSla}
                onChange={(e) => setResponseSla(e.target.value)}
                placeholder="24/7 SUPPORT RESPONSE"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#0c0f17',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  borderRadius: '2px',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div>
              <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                CONFIDENTIALITY &amp; UPTIME BADGE
              </label>
              <input
                type="text"
                value={confidentialityNotice}
                onChange={(e) => setConfidentialityNotice(e.target.value)}
                placeholder="99.99% UPTIME GUARANTEE"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#0c0f17',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  borderRadius: '2px',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                }}
              />
            </div>
          </div>
        </div>

        {/* Section 02: Project Type Options */}
        <div className="card-surface" style={{ padding: '1.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--accent-lime)' }}>
            // 02. Selectable Service / Project Types
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '1rem' }}>
            Visitors select from these pills when sending an inquiry. Click <X size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> to remove an option or add a new one below.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.25rem' }}>
            {projectTypes.map((type) => (
              <span
                key={type}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  backgroundColor: '#0c0f17',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '2px',
                  color: 'var(--text-primary)',
                  fontSize: '0.8125rem',
                }}
              >
                <span>{type}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveProjectType(type)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Remove"
                >
                  <X size={13} />
                </button>
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', maxWidth: '480px' }}>
            <input
              type="text"
              placeholder="e.g. Dedicated Ryzen Cloud, Node.js Bot, Migration"
              value={newProjectType}
              onChange={(e) => setNewProjectType(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddProjectType(e);
                }
              }}
              style={{
                flex: 1,
                padding: '0.65rem 0.875rem',
                backgroundColor: '#0c0f17',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: '2px',
                fontSize: '0.8125rem',
              }}
            />
            <button
              type="button"
              onClick={handleAddProjectType}
              className="btn btn-secondary"
              style={{ padding: '0.65rem 1rem', fontSize: '0.75rem' }}
            >
              <Plus size={14} />
              <span>Add Type</span>
            </button>
          </div>
        </div>

        {/* Section 03: Budget Options */}
        <div className="card-surface" style={{ padding: '1.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--accent-lime)' }}>
            // 03. Selectable Budget Ranges
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '1rem' }}>
            Help qualify prospective clients by offering tailored monthly investment tiers.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.25rem' }}>
            {budgetOptions.map((opt) => (
              <span
                key={opt}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  backgroundColor: '#0c0f17',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '2px',
                  color: 'var(--accent-blue)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8125rem',
                }}
              >
                <span>{opt}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveBudgetOption(opt)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Remove"
                >
                  <X size={13} />
                </button>
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', maxWidth: '480px' }}>
            <input
              type="text"
              placeholder="e.g. ₹29 – ₹99 /mo, ₹999+ /mo"
              value={newBudgetOption}
              onChange={(e) => setNewBudgetOption(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddBudgetOption(e);
                }
              }}
              style={{
                flex: 1,
                padding: '0.65rem 0.875rem',
                backgroundColor: '#0c0f17',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: '2px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
              }}
            />
            <button
              type="button"
              onClick={handleAddBudgetOption}
              className="btn btn-secondary"
              style={{ padding: '0.65rem 1rem', fontSize: '0.75rem' }}
            >
              <Plus size={14} />
              <span>Add Tier</span>
            </button>
          </div>
        </div>

        {/* Section 04: Field Labels & Placeholders */}
        <div className="card-surface" style={{ padding: '1.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--accent-lime)' }}>
            // 04. Form Input Labels &amp; Placeholders
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
            Customize the exact field labels and placeholder helper texts displayed inside the public inquiry form.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                NAME FIELD LABEL
              </label>
              <input
                type="text"
                value={nameLabel}
                onChange={(e) => setNameLabel(e.target.value)}
                placeholder="YOUR NAME *"
                style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontSize: '0.875rem' }}
              />
            </div>
            <div>
              <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                NAME PLACEHOLDER
              </label>
              <input
                type="text"
                value={namePlaceholder}
                onChange={(e) => setNamePlaceholder(e.target.value)}
                placeholder="e.g. Alex Sharma"
                style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontSize: '0.875rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                EMAIL FIELD LABEL
              </label>
              <input
                type="text"
                value={emailLabel}
                onChange={(e) => setEmailLabel(e.target.value)}
                placeholder="EMAIL ADDRESS *"
                style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontSize: '0.875rem' }}
              />
            </div>
            <div>
              <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                EMAIL PLACEHOLDER
              </label>
              <input
                type="text"
                value={emailPlaceholder}
                onChange={(e) => setEmailPlaceholder(e.target.value)}
                placeholder="e.g. alex@bracknodes.in"
                style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontSize: '0.875rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                SERVICE CATEGORY SECTION LABEL
              </label>
              <input
                type="text"
                value={projectFocusLabel}
                onChange={(e) => setProjectFocusLabel(e.target.value)}
                placeholder="SERVICE / HOSTING FOCUS"
                style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontSize: '0.875rem' }}
              />
            </div>
            <div>
              <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                BUDGET SECTION LABEL
              </label>
              <input
                type="text"
                value={budgetLabel}
                onChange={(e) => setBudgetLabel(e.target.value)}
                placeholder="APPROXIMATE BUDGET (OPTIONAL)"
                style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontSize: '0.875rem' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              REQUIREMENTS / MESSAGE FIELD LABEL
            </label>
            <input
              type="text"
              value={messageLabel}
              onChange={(e) => setMessageLabel(e.target.value)}
              placeholder="PROJECT DETAILS & GOALS *"
              style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontSize: '0.875rem' }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              REQUIREMENTS / MESSAGE PLACEHOLDER
            </label>
            <textarea
              rows={2}
              value={messagePlaceholder}
              onChange={(e) => setMessagePlaceholder(e.target.value)}
              placeholder="Tell us about your requirements, server specifications, bot workload, or migration needs..."
              style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontSize: '0.875rem', lineHeight: 1.5 }}
            />
          </div>

          <div>
            <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              FOOTNOTE / SECURITY DISCLAIMER
            </label>
            <input
              type="text"
              value={disclaimerText}
              onChange={(e) => setDisclaimerText(e.target.value)}
              placeholder="* No spam or agency pitches. 99.99% uptime guarantee."
              style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '2px', fontSize: '0.875rem' }}
            />
          </div>
        </div>

        {/* Section 05: Button Label & Feedback */}
        <div className="card-surface" style={{ padding: '1.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: 'var(--accent-lime)' }}>
            // 05. Form Action &amp; Success Confirmation
          </h3>

          <div style={{ marginBottom: '1.25rem' }}>
            <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              SUBMIT BUTTON LABEL
            </label>
            <input
              type="text"
              value={submitButtonText}
              onChange={(e) => setSubmitButtonText(e.target.value)}
              placeholder="Send Inquiry"
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#0c0f17',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: '2px',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
              }}
            />
          </div>

          <div>
            <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              SUCCESS CONFIRMATION MESSAGE (SHOWN AFTER INTAKE)
            </label>
            <textarea
              rows={3}
              value={successMessage}
              onChange={(e) => setSuccessMessage(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#0c0f17',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: '2px',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
                lineHeight: 1.5,
              }}
            />
          </div>
        </div>

        {/* Live Interactive Sandbox Preview */}
        <div className="card-surface" style={{ padding: '1.75rem', borderRadius: '4px', border: '1px solid #1e2638', marginBottom: '2rem', backgroundColor: '#07090f' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: 'var(--accent-lime)' }}>
            <Eye size={16} />
            <span className="mono" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
              LIVE FORM INTERFACE PREVIEW
            </span>
          </div>

          <div style={{ padding: '1.25rem', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', borderRadius: '3px' }}>
            <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              {sectionTag}
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
              {sectionTitle}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              {sectionSubtitle}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div>
                <div className="mono" style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  {nameLabel}
                </div>
                <div style={{ padding: '6px 10px', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-subtle)', borderRadius: '2px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {namePlaceholder}
                </div>
              </div>
              <div>
                <div className="mono" style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  {emailLabel}
                </div>
                <div style={{ padding: '6px 10px', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-subtle)', borderRadius: '2px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {emailPlaceholder}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                {projectFocusLabel}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {projectTypes.map((t, idx) => (
                  <span
                    key={t}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '2px',
                      fontSize: '0.75rem',
                      border: idx === 0 ? '1px solid var(--accent-lime)' : '1px solid var(--border-subtle)',
                      backgroundColor: idx === 0 ? 'var(--accent-lime-muted)' : 'transparent',
                      color: idx === 0 ? 'var(--accent-lime)' : 'var(--text-secondary)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                {budgetLabel}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {budgetOptions.map((b, idx) => (
                  <span
                    key={b}
                    className="mono"
                    style={{
                      padding: '4px 10px',
                      borderRadius: '2px',
                      fontSize: '0.75rem',
                      border: idx === 0 ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                      backgroundColor: idx === 0 ? 'rgba(112, 185, 255, 0.12)' : 'transparent',
                      color: idx === 0 ? 'var(--accent-blue)' : 'var(--text-secondary)',
                    }}
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div className="mono" style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                {messageLabel}
              </div>
              <div style={{ padding: '8px 10px', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-subtle)', borderRadius: '2px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {messagePlaceholder}
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              style={{ padding: '0.625rem 1.25rem', fontSize: '0.8125rem', marginBottom: '8px' }}
            >
              <span>{submitButtonText}</span>
              <Send size={14} />
            </button>

            {disclaimerText && (
              <div className="mono" style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                {disclaimerText}
              </div>
            )}
          </div>
        </div>

        {/* Save Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            {savedSuccess && (
              <span className="mono" style={{ color: 'var(--accent-lime)', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={16} /> INQUIRE FORM SETTINGS PERSISTED TO DATABASE
              </span>
            )}
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.875rem 2rem' }}>
            <Check size={16} />
            <span>Save Inquire Form Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

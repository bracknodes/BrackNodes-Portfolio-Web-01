import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

interface FormState {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export const ContactForm: React.FC = () => {
  const { submitInquiry, siteSettings } = useCMS();

  const inquire = siteSettings.inquireForm || {};

  const projectTypes =
    inquire.projectTypes && inquire.projectTypes.length > 0
      ? inquire.projectTypes
      : [
          'Discord Bot Hosting',
          'cPanel Web Hosting',
          'Cloud VPS / Dedicated',
          'Server Migration',
          'Enterprise / Custom Solution',
        ];

  const budgetOptions =
    inquire.budgetOptions && inquire.budgetOptions.length > 0
      ? inquire.budgetOptions
      : ['₹29 – ₹99 /mo', '₹99 – ₹299 /mo', '₹299 – ₹999 /mo', '₹999+ /mo'];

  const submitButtonText = inquire.submitButtonText || 'Send Inquiry';
  const successMessage =
    inquire.successMessage ||
    'Thank you! Your inquiry has been securely stored in our database. We will review your requirements and respond shortly.';

  const nameLabel = inquire.nameLabel || 'Your Name *';
  const namePlaceholder = inquire.namePlaceholder || 'e.g. Alex Sharma';
  const emailLabel = inquire.emailLabel || 'Email Address *';
  const emailPlaceholder = inquire.emailPlaceholder || 'e.g. alex@bracknodes.in';
  const projectFocusLabel = inquire.projectFocusLabel || 'Project Focus';
  const budgetLabel = inquire.budgetLabel || 'Approximate Budget (Optional)';
  const messageLabel = inquire.messageLabel || 'Project Details & Goals *';
  const messagePlaceholder =
    inquire.messagePlaceholder ||
    'Tell us about your requirements, server specifications, bot workload, or migration needs...';
  const disclaimerText =
    inquire.disclaimerText !== undefined
      ? inquire.disclaimerText
      : '* No spam or agency pitches. 99.99% uptime guaranteed.';

  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    projectType: projectTypes[0] || 'Discord Bot Hosting',
    budget: budgetOptions[0] || '₹29 – ₹99 /mo',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState<string>('');

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please provide your name (at least 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    if (!formData.message.trim() || formData.message.trim().length < 15) {
      newErrors.message = 'Please provide at least a brief summary of your requirements (min 15 characters).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');

    const result = await submitInquiry({
      name: formData.name.trim(),
      email: formData.email.trim(),
      projectType: formData.projectType,
      budget: formData.budget,
      message: formData.message.trim(),
    });

    if (result.success) {
      setStatus('success');
      setSubmitMessage(successMessage);
      setFormData({
        name: '',
        email: '',
        projectType: projectTypes[0] || 'Discord Bot Hosting',
        budget: budgetOptions[0] || '₹29 – ₹99 /mo',
        message: '',
      });
    } else {
      setStatus('error');
      setSubmitMessage(result.error || 'Failed to submit inquiry. Please try again.');
    }
  };

  return (
    <div
      className="card-surface"
      style={{
        padding: 'clamp(1.5rem, 3.5vw, 2.75rem)',
        borderRadius: '4px',
        border: '1px solid var(--border-subtle)',
        position: 'relative',
      }}
    >
      <form onSubmit={handleSubmit} noValidate>
        {/* Name and Email Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
            gap: '1.25rem',
            marginBottom: '1.25rem',
          }}
        >
          <div>
            <label
              htmlFor="inquiry-name"
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {nameLabel}
            </label>
            <input
              id="inquiry-name"
              type="text"
              required
              placeholder={namePlaceholder}
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              className="contact-input"
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                border: `1px solid ${errors.name ? '#ff6b6b' : 'var(--border-subtle)'}`,
                borderRadius: '2px',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9375rem',
              }}
            />
            {errors.name && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ff6b6b', fontSize: '0.75rem', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                <AlertCircle size={12} /> {errors.name}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="inquiry-email"
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {emailLabel}
            </label>
            <input
              id="inquiry-email"
              type="email"
              required
              placeholder={emailPlaceholder}
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              className="contact-input"
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                border: `1px solid ${errors.email ? '#ff6b6b' : 'var(--border-subtle)'}`,
                borderRadius: '2px',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9375rem',
              }}
            />
            {errors.email && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ff6b6b', fontSize: '0.75rem', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                <AlertCircle size={12} /> {errors.email}
              </span>
            )}
          </div>
        </div>

        {/* Project Type Selector */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {projectFocusLabel}
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {projectTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, projectType: type })}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  padding: '6px 14px',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  border: `1px solid ${formData.projectType === type ? 'var(--accent-lime)' : 'var(--border-subtle)'}`,
                  backgroundColor: formData.projectType === type ? 'var(--accent-lime-muted)' : 'var(--bg-input)',
                  color: formData.projectType === type ? 'var(--accent-lime)' : 'var(--text-secondary)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Budget Selector */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {budgetLabel}
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {budgetOptions.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setFormData({ ...formData, budget: b })}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  padding: '6px 14px',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  border: `1px solid ${formData.budget === b ? 'var(--accent-blue)' : 'var(--border-subtle)'}`,
                  backgroundColor: formData.budget === b ? 'var(--accent-blue-muted)' : 'var(--bg-input)',
                  color: formData.budget === b ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Message / Details */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor="inquiry-message"
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {messageLabel}
          </label>
          <textarea
            id="inquiry-message"
            rows={4}
            required
            placeholder={messagePlaceholder}
            value={formData.message}
            onChange={(e) => {
              setFormData({ ...formData, message: e.target.value });
              if (errors.message) setErrors({ ...errors, message: undefined });
            }}
            className="contact-input"
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              border: `1px solid ${errors.message ? '#ff6b6b' : 'var(--border-subtle)'}`,
              borderRadius: '2px',
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              resize: 'vertical',
            }}
          />
          {errors.message && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ff6b6b', fontSize: '0.75rem', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
              <AlertCircle size={12} /> {errors.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="btn btn-primary"
            style={{
              width: '100%',
              cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
              opacity: status === 'submitting' ? 0.7 : 1,
            }}
          >
            {status === 'submitting' ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Processing Inquiry...</span>
              </>
            ) : (
              <>
                <span>{submitButtonText}</span>
                <Send size={16} />
              </>
            )}
          </button>

          {/* Feedback Banner */}
          {status === 'success' && (
            <div
              style={{
                padding: '1rem',
                backgroundColor: 'rgba(199, 255, 107, 0.1)',
                border: '1px solid var(--accent-lime)',
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}
            >
              <CheckCircle2 size={18} color="var(--accent-lime)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                {submitMessage}
              </p>
            </div>
          )}

          {disclaimerText && (
            <p
              className="mono"
              style={{
                fontSize: '0.6875rem',
                color: 'var(--text-muted)',
                textAlign: 'center',
                margin: 0,
              }}
            >
              {disclaimerText}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
import { Lock, Mail, Eye, EyeOff, ArrowLeft, ShieldCheck, AlertCircle, Loader2, KeyRound } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [isSessionExpired] = useState(() => {
    try {
      return sessionStorage.getItem('bracknodes_session_expired') === 'true';
    } catch {
      return false;
    }
  });

  const { login, resetPassword, isLiveSupabase } = useAuth();
  const { siteSettings } = useCMS();
  const navigate = useNavigate();
  const location = useLocation();

  const adminSlug = siteSettings.adminPath || 'admin';
  const from = (location.state as any)?.from?.pathname || `/${adminSlug}`;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const { error } = await login(email, password);
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error);
    } else {
      navigate(from, { replace: true });
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address to receive password reset link.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const { error } = await resetPassword(email);
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error);
    } else {
      setResetSent(true);
    }
  };

  return (
    <div
      className="admin-layout"
      style={{
        minHeight: '100vh',
        backgroundColor: '#090B10',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem 1.5rem',
        position: 'relative',
      }}
    >
      {/* Background Cyber Grid */}
      <div className="tech-grid-bg" />
      <div className="grain-overlay" />

      {/* Return to Public Website */}
      <Link
        to="/"
        className="mono"
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          fontSize: '0.8125rem',
          padding: '6px 12px',
          backgroundColor: 'rgba(17, 21, 31, 0.6)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '2px',
          transition: 'all 0.2s ease',
          zIndex: 10,
        }}
      >
        <ArrowLeft size={14} />
        <span>BACK TO PORTFOLIO</span>
      </Link>

      {/* Login Card */}
      <div
        className="card-surface"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: 'clamp(2rem, 5vw, 3rem)',
          borderRadius: '4px',
          border: '1px solid #232d42',
          boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <span className="cyber-crosshair corner-tl" />
        <span className="cyber-crosshair corner-tr" />
        <span className="cyber-crosshair corner-bl" />
        <span className="cyber-crosshair corner-br" />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              margin: '0 auto 1rem',
              backgroundColor: 'rgba(199, 255, 107, 0.1)',
              border: '1px solid var(--accent-lime)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '3px',
              color: 'var(--accent-lime)',
            }}
          >
            <ShieldCheck size={26} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
            BRACKNODES CMS
          </h1>
          <p className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            HOSTING ADMINISTRATOR ACCESS
          </p>
        </div>

        {/* Database Status Badge */}
        <div
          style={{
            marginBottom: '1.5rem',
            padding: '8px 12px',
            backgroundColor: isLiveSupabase ? 'rgba(199, 255, 107, 0.08)' : 'rgba(112, 185, 255, 0.08)',
            border: `1px solid ${isLiveSupabase ? 'rgba(199, 255, 107, 0.25)' : 'rgba(112, 185, 255, 0.25)'}`,
            borderRadius: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
          }}
        >
          <span style={{ color: isLiveSupabase ? 'var(--accent-lime)' : 'var(--accent-blue)' }}>
            BACKEND: {isLiveSupabase ? 'SUPABASE CLOUD ACTIVE' : 'LOCAL ENVIRONMENT READY'}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>RLS SECURE</span>
        </div>

        {/* 60-Minute Session Timeout Alert */}
        {isSessionExpired && (
          <div
            style={{
              marginBottom: '1.25rem',
              padding: '10px 14px',
              backgroundColor: 'rgba(255, 184, 0, 0.12)',
              border: '1px solid rgba(255, 184, 0, 0.4)',
              borderRadius: '2px',
              color: '#FFD066',
              fontSize: '0.8125rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Lock size={16} color="#FFD066" style={{ flexShrink: 0 }} />
            <span>
              Session auto-logged out after <strong>60 minutes of inactivity</strong> for your security. Please sign in again.
            </span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div
            style={{
              marginBottom: '1.25rem',
              padding: '10px 14px',
              backgroundColor: 'rgba(255, 95, 86, 0.12)',
              border: '1px solid #ff5f56',
              borderRadius: '2px',
              color: '#ff8a84',
              fontSize: '0.8125rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Password Reset Notice */}
        {resetSent ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <KeyRound size={32} color="var(--accent-lime)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Reset Link Dispatched</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              If an administrator account exists for <strong>{email}</strong>, a password reset email has been sent.
            </p>
            <button
              type="button"
              onClick={() => {
                setResetSent(false);
                setIsResetMode(false);
              }}
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              Return to Login
            </button>
          </div>
        ) : isResetMode ? (
          /* Password Reset Form */
          <form onSubmit={handlePasswordReset}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label
                htmlFor="admin-reset-email"
                className="mono"
                style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}
              >
                ADMINISTRATOR EMAIL
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  id="admin-reset-email"
                  type="email"
                  required
                  placeholder="admin@bracknodes.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem 0.875rem 2.5rem',
                    backgroundColor: '#0c0f17',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '2px',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.875rem',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '1rem' }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Sending Link...</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsResetMode(false)}
              className="mono"
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              Back to Login
            </button>
          </form>
        ) : (
          /* Normal Login Form */
          <form onSubmit={handleLogin}>
            {/* Email Field */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="admin-email"
                className="mono"
                style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}
              >
                EMAIL ADDRESS
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  id="admin-email"
                  type="email"
                  required
                  placeholder="admin@bracknodes.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem 0.875rem 2.5rem',
                    backgroundColor: '#0c0f17',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '2px',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.875rem',
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label
                  htmlFor="admin-password"
                  className="mono"
                  style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}
                >
                  PASSWORD
                </label>
                <button
                  type="button"
                  onClick={() => setIsResetMode(true)}
                  className="mono"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-blue)',
                    fontSize: '0.6875rem',
                    cursor: 'pointer',
                  }}
                >
                  Forgot Password?
                </button>
              </div>

              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.875rem 2.5rem 0.875rem 2.5rem',
                    backgroundColor: '#0c0f17',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '2px',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.875rem',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.875rem' }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Access Dashboard</span>
              )}
            </button>

            {/* Quick Fill Helper */}
            <div
              style={{
                marginTop: '1.25rem',
                padding: '10px 12px',
                backgroundColor: '#07090f',
                border: '1px solid var(--border-subtle)',
                borderRadius: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              <div>
                <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
                  ADMIN CREDENTIALS:
                </div>
                <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-lime)' }}>
                  admin@bracknodes.in • admin123
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEmail('admin@bracknodes.in');
                  setPassword('admin123');
                }}
                className="mono"
                style={{
                  background: 'rgba(199, 255, 107, 0.1)',
                  border: '1px solid var(--accent-lime)',
                  color: 'var(--accent-lime)',
                  padding: '5px 10px',
                  borderRadius: '2px',
                  fontSize: '0.6875rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Auto-Fill
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useCMS } from '../../../context/CMSContext';
import {
  Database,
  Download,
  Upload,
  Copy,
  Check,
  AlertTriangle,
  Lock,
  Server,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';

export const SecurityView: React.FC = () => {
  const { user, isLiveSupabase } = useAuth();
  const { exportCMSData, importCMSData, resetToDefaults, siteSettings, updateSiteSettings } = useCMS();

  const [copiedSql, setCopiedSql] = useState(false);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  // Private Admin Route Cloaking State
  const [adminPathInput, setAdminPathInput] = useState(siteSettings.adminPath || 'admin');
  const [pathSavedSuccess, setPathSavedSuccess] = useState(false);
  const [copiedPrivateUrl, setCopiedPrivateUrl] = useState(false);

  // cPanel MySQL Bridge State
  const [cpanelStatus, setCpanelStatus] = useState<{
    tested: boolean;
    loading: boolean;
    success?: boolean;
    message?: string;
    database?: string;
    mysqlVersion?: string;
    tablesInstalled?: boolean;
    tables?: string[];
  }>({ tested: false, loading: false });

  const [setupLoading, setSetupLoading] = useState(false);
  const [setupMessage, setSetupMessage] = useState<string | null>(null);
  const [copiedConfigCode, setCopiedConfigCode] = useState(false);

  const currentPrivateUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/${siteSettings.adminPath || 'admin'}/login`
    : `/${siteSettings.adminPath || 'admin'}/login`;

  const handleSaveAdminPath = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = adminPathInput
      .trim()
      .toLowerCase()
      .replace(/^\/+|\/+$/g, '')
      .replace(/[^a-z0-9_-]/g, '') || 'admin';
    setAdminPathInput(clean);
    await updateSiteSettings({ adminPath: clean });
    setPathSavedSuccess(true);
    setTimeout(() => setPathSavedSuccess(false), 3000);
  };

  const copyPrivateUrl = () => {
    navigator.clipboard.writeText(currentPrivateUrl);
    setCopiedPrivateUrl(true);
    setTimeout(() => setCopiedPrivateUrl(false), 2000);
  };

  const testCPanelConnection = async () => {
    setCpanelStatus({ tested: true, loading: true });
    try {
      const res = await fetch('/api/test.php');
      const data = await res.json();
      setCpanelStatus({
        tested: true,
        loading: false,
        success: data.success,
        message: data.message,
        database: data.database,
        mysqlVersion: data.mysql_version,
        tablesInstalled: data.tables_installed,
        tables: data.tables,
      });
    } catch {
      setCpanelStatus({
        tested: true,
        loading: false,
        success: false,
        message: 'Endpoint /api/test.php not reached. Note: PHP scripts execute when hosted on cPanel Apache/Nginx web server.',
      });
    }
  };

  const runCPanelSetup = async () => {
    setSetupLoading(true);
    setSetupMessage(null);
    try {
      const res = await fetch('/api/setup.php');
      const data = await res.json();
      setSetupMessage(data.message || (data.success ? 'Tables created successfully!' : 'Setup failed.'));
      if (data.success) {
        testCPanelConnection();
      }
    } catch {
      setSetupMessage('Unable to reach /api/setup.php. Ensure files are deployed on cPanel.');
    } finally {
      setSetupLoading(false);
    }
  };

  const copyConfigSnippet = () => {
    const configSnippet = `<?php
// cPanel MySQL Database Credentials (public/api/config.php)
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'yourcpanel_dbname');     // In cPanel: MySQL Databases
define('DB_USER', 'yourcpanel_dbuser');     // In cPanel: MySQL Databases
define('DB_PASS', 'YourPasswordHere');      // User Password
`;
    navigator.clipboard.writeText(configSnippet);
    setCopiedConfigCode(true);
    setTimeout(() => setCopiedConfigCode(false), 2000);
  };

  const copySqlScript = () => {
    const sqlScript = `-- Run this in your Supabase Project -> SQL Editor to initialize all tables and RLS:
CREATE TABLE IF NOT EXISTS public.admin_users (id UUID PRIMARY KEY REFERENCES auth.users(id), email TEXT NOT NULL UNIQUE, role TEXT NOT NULL DEFAULT 'admin');
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view profile" ON public.admin_users FOR SELECT USING (auth.uid() = id);`;
    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleDownloadBackup = () => {
    const dataStr = exportCMSData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bracknodes-cms-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;

    const ok = importCMSData(importText);
    if (ok) {
      setImportStatus('Backup JSON restored successfully!');
      setImportText('');
    } else {
      setImportStatus('Invalid JSON syntax. Restore failed.');
    }
  };

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Account &amp; Database Architecture</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
          Manage your native cPanel MySQL database connection, security cloaking, and full JSON data backups with zero 3rd-party dependencies.
        </p>
      </div>

      {/* ── cPanel Native MySQL Database Connection ─────────────────── */}
      <div className="card-surface" style={{ padding: '1.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Server size={22} color="var(--accent-lime)" />
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
              cPanel MySQL Database (Native &amp; Self-Hosted)
            </h3>
          </div>

          <span
            className="mono"
            style={{
              fontSize: '0.6875rem',
              padding: '4px 10px',
              borderRadius: '2px',
              backgroundColor: 'var(--accent-lime-muted)',
              color: 'var(--accent-lime)',
              fontWeight: 700,
            }}
          >
            NO 3RD-PARTY PLATFORM NEEDED
          </span>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          Because you own cPanel Web Hosting, your inquiries and database can run 100% self-hosted on your own MySQL server. No external SaaS, no Firebase/Supabase monthly fees, and no third-party data tracking.
        </p>

        {/* Action Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={testCPanelConnection}
            disabled={cpanelStatus.loading}
            className="btn btn-secondary mono"
            style={{ fontSize: '0.8125rem', padding: '0.625rem 1.25rem' }}
          >
            {cpanelStatus.loading ? <RefreshCw size={14} className="animate-spin" /> : <Server size={14} />}
            <span>Test cPanel MySQL Connection</span>
          </button>

          <button
            type="button"
            onClick={runCPanelSetup}
            disabled={setupLoading}
            className="btn btn-primary mono"
            style={{ fontSize: '0.8125rem', padding: '0.625rem 1.25rem' }}
          >
            {setupLoading ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
            <span>1-Click Auto-Create MySQL Tables</span>
          </button>

          <button
            type="button"
            onClick={copyConfigSnippet}
            className="mono btn btn-ghost"
            style={{ fontSize: '0.8125rem', padding: '0.625rem 1rem' }}
          >
            {copiedConfigCode ? <Check size={14} color="var(--accent-lime)" /> : <Copy size={14} />}
            <span>{copiedConfigCode ? 'Config Copied' : 'Copy config.php Code'}</span>
          </button>
        </div>

        {/* Live Test Status Banner */}
        {cpanelStatus.tested && (
          <div
            style={{
              padding: '1rem',
              backgroundColor: cpanelStatus.success ? 'rgba(199, 255, 107, 0.08)' : 'rgba(255, 107, 107, 0.08)',
              border: `1px solid ${cpanelStatus.success ? 'var(--accent-lime)' : '#ff6b6b'}`,
              borderRadius: '2px',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              {cpanelStatus.success ? <CheckCircle2 size={16} color="var(--accent-lime)" /> : <AlertTriangle size={16} color="#ff6b6b Gamboge" />}
              <span className="mono" style={{ fontSize: '0.8125rem', fontWeight: 700, color: cpanelStatus.success ? 'var(--accent-lime)' : '#ff6b6b' }}>
                {cpanelStatus.success ? 'CPANEL MYSQL CONNECTED SUCCESSFULLY' : 'CPANEL MYSQL NOTICE'}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {cpanelStatus.message}
            </p>
            {cpanelStatus.database && (
              <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', marginTop: '6px' }}>
                Active Database: {cpanelStatus.database} | Engine: MySQL {cpanelStatus.mysqlVersion}
              </div>
            )}
          </div>
        )}

        {setupMessage && (
          <div style={{ padding: '0.75rem 1rem', backgroundColor: '#0c0f17', border: '1px solid var(--accent-lime)', borderRadius: '2px', marginBottom: '1.25rem', color: 'var(--accent-lime)', fontSize: '0.8125rem' }}>
            {setupMessage}
          </div>
        )}

        {/* 3-Step Setup Instructions */}
        <div style={{ padding: '1.125rem', backgroundColor: '#07090f', border: '1px solid #1a2234', borderRadius: '3px' }}>
          <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-lime)', marginBottom: '8px', fontWeight: 600 }}>
            // HOW TO CONNECT YOUR CPANEL DATABASE IN 3 MINUTES:
          </div>
          <ol style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.8125rem', lineHeight: 1.7 }}>
            <li>
              Log into your <strong>cPanel</strong> &rarr; Click <strong>MySQL Databases</strong> &rarr; Create a Database (e.g., <code>cpaneluser_bracknodes</code>).
            </li>
            <li>
              Scroll down to <strong>Add New User</strong> &rarr; Create a MySQL user &amp; password &rarr; Add the User to Database with <strong>ALL PRIVILEGES</strong>.
            </li>
            <li>
              In cPanel <strong>File Manager</strong>, open <code>public_html/api/config.php</code> &rarr; Enter your <code>DB_NAME</code>, <code>DB_USER</code>, and <code>DB_PASS</code>.
            </li>
            <li>
              Click the green <strong>"1-Click Auto-Create MySQL Tables"</strong> button above to initialize tables (<code>bn_inquiries</code>, <code>bn_cms_content</code>). All inquiries will now flow directly into your cPanel database!
            </li>
          </ol>
        </div>
      </div>

      {/* Database Connection Status Card (Supabase Cloud Optional) */}
      <div className="card-surface" style={{ padding: '1.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database size={22} color={isLiveSupabase ? 'var(--accent-lime)' : 'var(--accent-blue)'} />
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
              {isLiveSupabase ? 'Supabase Cloud Connected' : 'Local Persistence & Offline Cache'}
            </h3>
          </div>

          <span
            className="mono"
            style={{
              fontSize: '0.6875rem',
              padding: '4px 10px',
              borderRadius: '2px',
              backgroundColor: isLiveSupabase ? 'var(--accent-lime-muted)' : 'rgba(112, 185, 255, 0.12)',
              color: isLiveSupabase ? 'var(--accent-lime)' : 'var(--accent-blue)',
              fontWeight: 700,
            }}
          >
            {isLiveSupabase ? 'LIVE POSTGRESQL' : 'LOCAL CACHE ACTIVE'}
          </span>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
          {isLiveSupabase
            ? 'Your website is communicating directly with your live Supabase cloud database instance. Row Level Security policies ensure only authorized administrators can alter site content.'
            : 'When running locally without cPanel or Supabase, all edits and inquiries are safely stored in browser encrypted cache.'}
        </p>

        {user && (
          <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-lime)', marginBottom: '1rem' }}>
            AUTHENTICATED SESSION: {user.email} (ROLE: {user.role || 'Superadmin'})
          </div>
        )}

        <div style={{ padding: '12px 14px', backgroundColor: '#0c0f17', border: '1px solid var(--border-subtle)', borderRadius: '2px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            DATABASE MIGRATIONS: [supabase/schema.sql]
          </div>
          <button
            type="button"
            onClick={copySqlScript}
            className="mono"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: copiedSql ? 'var(--accent-lime)' : 'var(--accent-blue)',
              cursor: 'pointer',
              fontSize: '0.75rem',
            }}
          >
            {copiedSql ? <Check size={12} /> : <Copy size={12} />}
            <span>{copiedSql ? 'COPIED TO CLIPBOARD' : 'COPY MIGRATION SQL'}</span>
          </button>
        </div>
      </div>

      {/* Private Admin URL & Stealth Cloaking Card */}
      <div className="card-surface" style={{ padding: '1.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Lock size={20} color="var(--accent-lime)" />
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
              Private Admin URL &amp; Route Cloaking
            </h3>
          </div>

          <span
            className="mono"
            style={{
              fontSize: '0.6875rem',
              padding: '4px 10px',
              borderRadius: '2px',
              backgroundColor: 'var(--accent-lime-muted)',
              color: 'var(--accent-lime)',
              fontWeight: 700,
            }}
          >
            STEALTH MODE ACTIVE
          </span>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          All public links and buttons (including the previous navbar shield and footer buttons) have been completely removed from the website.
          The admin panel is private and accessible only by typing this secret URL directly into the browser. You can change this secret slug anytime to prevent unauthorized discovery or bot attacks.
        </p>

        {/* Current Secret URL Box */}
        <div style={{ padding: '1rem 1.25rem', backgroundColor: '#07090f', border: '1px solid #1f2738', borderRadius: '3px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              YOUR ACTIVE PRIVATE LOGIN URL:
            </div>
            <div className="mono" style={{ color: 'var(--accent-lime)', fontSize: '0.9rem', wordBreak: 'break-all' }}>
              {currentPrivateUrl}
            </div>
          </div>

          <button
            type="button"
            onClick={copyPrivateUrl}
            className="mono"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(199, 255, 107, 0.1)',
              border: '1px solid var(--accent-lime)',
              color: 'var(--accent-lime)',
              padding: '8px 14px',
              borderRadius: '2px',
              cursor: 'pointer',
              fontSize: '0.75rem',
            }}
          >
            {copiedPrivateUrl ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedPrivateUrl ? 'COPIED TO CLIPBOARD' : 'COPY PRIVATE URL'}</span>
          </button>
        </div>

        <form onSubmit={handleSaveAdminPath}>
          <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            CUSTOM SECRET ADMIN ROUTE SLUG
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <span className="mono" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                /
              </span>
              <input
                type="text"
                required
                value={adminPathInput}
                onChange={(e) => setAdminPathInput(e.target.value)}
                placeholder="secret-portal-x9"
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 1.75rem',
                  backgroundColor: '#0c0f17',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  borderRadius: '2px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', flexShrink: 0 }}>
              <Check size={15} />
              <span>Update Secret Route</span>
            </button>
          </div>

          {pathSavedSuccess && (
            <div className="mono" style={{ marginTop: '10px', color: 'var(--accent-lime)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={14} /> Admin path updated! Bookmark your new private URL immediately.
            </div>
          )}
        </form>
      </div>

      {/* 60-Minute Inactivity Auto-Logout Policy Card */}
      <div className="card-surface" style={{ padding: '1.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Lock size={20} color="var(--accent-lime)" />
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
              60-Minute Inactivity Auto-Logout
            </h3>
          </div>
          <span
            className="mono"
            style={{
              fontSize: '0.6875rem',
              padding: '3px 10px',
              borderRadius: '2px',
              backgroundColor: 'rgba(199, 255, 107, 0.12)',
              color: 'var(--accent-lime)',
              border: '1px solid rgba(199, 255, 107, 0.3)',
              fontWeight: 700,
            }}
          >
            STRICT SECURITY ENFORCED (60m)
          </span>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
          To protect database records and prevent unauthorized administrative access on unattended devices, all active sessions automatically terminate after <strong>60 minutes of inactivity</strong> (absence of mouse movement, key presses, or scrolling).
        </p>

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ padding: '10px 14px', backgroundColor: '#0c0f17', border: '1px solid #1a2234', borderRadius: '3px', flex: '1 1 200px' }}>
            <div className="mono" style={{ fontSize: '0.6875rem', color: '#8B97B0', marginBottom: '2px' }}>TIMEOUT DURATION</div>
            <div className="mono" style={{ fontSize: '0.9375rem', color: '#F7F7F2', fontWeight: 700 }}>60 Minutes (3,600s)</div>
          </div>
          <div style={{ padding: '10px 14px', backgroundColor: '#0c0f17', border: '1px solid #1a2234', borderRadius: '3px', flex: '1 1 200px' }}>
            <div className="mono" style={{ fontSize: '0.6875rem', color: '#8B97B0', marginBottom: '2px' }}>ACTIVITY TRACKING</div>
            <div className="mono" style={{ fontSize: '0.9375rem', color: 'var(--accent-lime)', fontWeight: 700 }}>Active (Heartbeat 30s)</div>
          </div>
          <div style={{ padding: '10px 14px', backgroundColor: '#0c0f17', border: '1px solid #1a2234', borderRadius: '3px', flex: '1 1 200px' }}>
            <div className="mono" style={{ fontSize: '0.6875rem', color: '#8B97B0', marginBottom: '2px' }}>TAB RETURN PROTECTION</div>
            <div className="mono" style={{ fontSize: '0.9375rem', color: 'var(--accent-blue)', fontWeight: 700 }}>Auto-Purge on Expiration</div>
          </div>
        </div>
      </div>

      {/* JSON Backups & Export/Import */}
      <div className="card-surface" style={{ padding: '1.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Data Backup &amp; Disaster Recovery
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Download a complete, offline JSON snapshot of your entire website (projects, services, skills, testimonials, media references, and custom design tokens). You can re-import this backup anytime.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <button type="button" onClick={handleDownloadBackup} className="btn btn-secondary mono" style={{ padding: '0.75rem 1.25rem' }}>
            <Download size={16} />
            <span>Export Snapshot (.json)</span>
          </button>
        </div>

        {/* Import JSON */}
        <form onSubmit={handleImportSubmit}>
          <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            RESTORE FROM JSON BACKUP
          </label>
          <textarea
            rows={4}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Paste your exported JSON content here to overwrite current state..."
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#0c0f17',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              borderRadius: '2px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              marginBottom: '10px',
            }}
          />
          <button type="submit" disabled={!importText.trim()} className="btn btn-secondary mono" style={{ padding: '0.625rem 1.25rem' }}>
            <Upload size={14} />
            <span>Restore Snapshot</span>
          </button>
          {importStatus && (
            <div className="mono" style={{ marginTop: '8px', fontSize: '0.75rem', color: importStatus.includes('success') ? 'var(--accent-lime)' : '#ff6b6b' }}>
              {importStatus}
            </div>
          )}
        </form>
      </div>

      {/* Emergency Hard Reset */}
      <div className="card-surface" style={{ padding: '1.75rem', borderRadius: '4px', border: '1px solid rgba(255, 107, 107, 0.3)', backgroundColor: 'rgba(255, 107, 107, 0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff6b6b', marginBottom: '8px' }}>
          <AlertTriangle size={18} />
          <h4 style={{ margin: 0, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Factory Reset Workspace
          </h4>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
          Reset all website content, design themes, and inquiries back to the original BrackNodes production defaults. This clears all local cache modifications.
        </p>

        {confirmResetOpen ? (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => {
                resetToDefaults();
                setConfirmResetOpen(false);
              }}
              style={{
                backgroundColor: '#ff6b6b',
                color: '#fff',
                border: 'none',
                padding: '0.625rem 1.25rem',
                borderRadius: '2px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Confirm Factory Reset
            </button>
            <button
              type="button"
              onClick={() => setConfirmResetOpen(false)}
              className="btn btn-ghost"
              style={{ padding: '0.625rem 1rem' }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmResetOpen(true)}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #ff6b6b',
              color: '#ff6b6b',
              padding: '0.625rem 1.25rem',
              borderRadius: '2px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.8125rem',
            }}
          >
            Reset All Content to Defaults
          </button>
        )}
      </div>
    </div>
  );
};

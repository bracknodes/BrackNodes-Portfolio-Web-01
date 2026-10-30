import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import {
  RefreshCw,
  ShieldCheck,
  Download,
  Terminal,
  ExternalLink,
  Check,
  Copy,
  Zap,
  Sparkles,
} from 'lucide-react';

export const UpdatesView: React.FC = () => {
  const {
    siteSettings,
    updateSiteSettings,
    currentAppVersion,
    updateInfo,
    isCheckingUpdates,
    checkSystemUpdates,
    triggerAutoDeploy,
    runDataPreservationMigration,
    exportCMSData,
  } = useCMS();

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [deployStatus, setDeployStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<string | null>(null);

  // Settings inputs
  const [githubRepo, setGithubRepo] = useState(siteSettings.updateSettings?.githubRepo || 'bracknodes/web-1');
  const [webhookUrl, setWebhookUrl] = useState(siteSettings.updateSettings?.deployWebhookUrl || '');
  const [autoCheck, setAutoCheck] = useState(siteSettings.updateSettings?.autoCheckUpdates !== false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteSettings({
      updateSettings: {
        githubRepo: githubRepo.trim(),
        deployWebhookUrl: webhookUrl.trim(),
        autoCheckUpdates: autoCheck,
      },
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handleDownloadBackup = () => {
    const dataStr = exportCMSData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cms-pre-update-backup-v${currentAppVersion}-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleTriggerDeploy = async () => {
    if (!webhookUrl.trim()) {
      alert('Please configure your Deploy Webhook URL below first (e.g. from Vercel or Netlify).');
      return;
    }
    setIsDeploying(true);
    setDeployStatus(null);
    const res = await triggerAutoDeploy();
    setIsDeploying(false);
    setDeployStatus(res);
  };

  const handleRunMigration = () => {
    const res = runDataPreservationMigration();
    setMigrationStatus(res.message);
    setTimeout(() => setMigrationStatus(null), 4000);
  };

  const gitPullSnippet = `# 1. Pull latest code updates from GitHub
git pull origin main

# 2. Build production assets (User content remains 100% untouched)
npm run build`;

  return (
    <div style={{ maxWidth: '1050px' }}>
      {/* Top Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-lime)', marginBottom: '4px' }}>
          SYSTEM UPDATES // NON-DESTRUCTIVE GITHUB SYNC
        </div>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '6px', color: '#F7F7F2' }}>
          Updates &amp; Version Control
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
          Safely upgrade your studio website with new features from GitHub without losing any of your custom projects, text, or database configurations.
        </p>
      </div>

      {/* Non-Destructive Data Preservation Banner */}
      <div
        className="card-surface"
        style={{
          padding: '1.5rem',
          borderRadius: '4px',
          border: '1px solid rgba(199, 255, 107, 0.35)',
          backgroundColor: 'rgba(199, 255, 107, 0.05)',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(199, 255, 107, 0.15)',
            border: '1px solid var(--accent-lime)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-lime)',
            flexShrink: 0,
            marginTop: '2px',
          }}
        >
          <ShieldCheck size={20} />
        </div>

        <div>
          <h3 style={{ fontSize: '1.05rem', margin: '0 0 6px 0', color: '#F7F7F2' }}>
            Data Preservation Guarantee: Your Content is 100% Protected
          </h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Your projects, bio copy, client inquiries, custom design tokens, and media uploads are stored in your database and LocalStorage — totally decoupled from the application engine.
            Whenever BrackNodes pushes updates (new features, new preview modes, performance enhancements), you can pull the update and your custom edits will <strong>never be overwritten or deleted</strong>.
          </p>
        </div>
      </div>

      {/* Version Status & Live Update Checker */}
      <div
        className="card-surface"
        style={{
          padding: '1.75rem',
          borderRadius: '4px',
          border: '1px solid var(--border-subtle)',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              CURRENT INSTALLED VERSION
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F7F7F2' }}>
                v{currentAppVersion}
              </span>
              <span className="mono" style={{ fontSize: '0.6875rem', padding: '3px 8px', borderRadius: '2px', backgroundColor: 'rgba(199, 255, 107, 0.12)', color: 'var(--accent-lime)', fontWeight: 700 }}>
                STABLE RELEASE
              </span>
            </div>
            <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Tracking: <span style={{ color: 'var(--accent-blue)' }}>github.com/{githubRepo}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={checkSystemUpdates}
            disabled={isCheckingUpdates}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <RefreshCw size={16} className={isCheckingUpdates ? 'animate-spin' : ''} />
            <span>{isCheckingUpdates ? 'Checking GitHub...' : 'Check for GitHub Updates'}</span>
          </button>
        </div>

        {/* Update Result Card */}
        {updateInfo && (
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: '#0c0f17',
              border: `1px solid ${updateInfo.hasUpdate ? 'var(--accent-lime)' : 'var(--border-subtle)'}`,
              borderRadius: '3px',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: updateInfo.hasUpdate ? 'var(--accent-lime)' : '#60a8f8',
                  }}
                />
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#F7F7F2' }}>
                  {updateInfo.hasUpdate
                    ? `🚀 New Version Available: v${updateInfo.latestVersion}`
                    : '✓ Your CMS Engine is Fully Up-to-Date'}
                </span>
              </div>

              {updateInfo.publishedAt && (
                <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Released: {new Date(updateInfo.publishedAt).toLocaleDateString()}
                </span>
              )}
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, margin: '0 0 10px 0' }}>
              {updateInfo.releaseNotes}
            </p>

            {updateInfo.htmlUrl && (
              <a
                href={updateInfo.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent-blue)', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
              >
                <span>View Full Release Notes on GitHub</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        )}

        {/* Action Buttons for Update */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <button
            type="button"
            onClick={handleDownloadBackup}
            className="btn btn-secondary"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} />
            <span>Download Safety Backup JSON</span>
          </button>

          <button
            type="button"
            onClick={handleRunMigration}
            className="btn btn-secondary"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Sparkles size={14} />
            <span>Sync &amp; Merge New Features</span>
          </button>

          {webhookUrl && (
            <button
              type="button"
              onClick={handleTriggerDeploy}
              disabled={isDeploying}
              className="btn btn-primary"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Zap size={14} />
              <span>{isDeploying ? 'Triggering Build...' : 'Auto-Deploy from GitHub'}</span>
            </button>
          )}
        </div>

        {migrationStatus && (
          <div style={{ marginTop: '1rem', padding: '10px 14px', backgroundColor: 'rgba(199, 255, 107, 0.1)', border: '1px solid var(--accent-lime)', borderRadius: '3px', color: 'var(--accent-lime)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Check size={14} />
            <span>{migrationStatus}</span>
          </div>
        )}

        {deployStatus && (
          <div
            style={{
              marginTop: '1rem',
              padding: '10px 14px',
              backgroundColor: deployStatus.success ? 'rgba(199, 255, 107, 0.1)' : 'rgba(255, 95, 86, 0.1)',
              border: `1px solid ${deployStatus.success ? 'var(--accent-lime)' : '#ff5f56'}`,
              borderRadius: '3px',
              color: deployStatus.success ? 'var(--accent-lime)' : '#ff8a84',
              fontSize: '0.8rem',
            }}
          >
            {deployStatus.message}
          </div>
        )}
      </div>

      {/* Terminal / Git Pull Commands */}
      <div
        className="card-surface"
        style={{
          padding: '1.75rem',
          borderRadius: '4px',
          border: '1px solid var(--border-subtle)',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={18} color="var(--accent-lime)" />
            <h3 style={{ fontSize: '1.15rem', margin: 0, color: '#F7F7F2' }}>
              Manual Git Pull / Terminal Update Command
            </h3>
          </div>

          <button
            type="button"
            onClick={() => copyToClipboard('git', gitPullSnippet)}
            className="mono"
            style={{
              background: '#161c2b',
              border: '1px solid #25314c',
              color: copiedKey === 'git' ? 'var(--accent-lime)' : '#8b97b0',
              padding: '6px 12px',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {copiedKey === 'git' ? <Check size={12} /> : <Copy size={12} />}
            <span>{copiedKey === 'git' ? 'COPIED TO CLIPBOARD' : 'COPY COMMANDS'}</span>
          </button>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.5 }}>
          If you are running the project locally or via VPS/SSH, simply run these two commands. Git will pull the updated source code files, and your database data will remain 100% untouched.
        </p>

        <pre style={{ padding: '1rem', backgroundColor: '#07090f', border: '1px solid #1c2438', borderRadius: '3px', color: '#c7ff6b', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', overflowX: 'auto', margin: 0 }}>
          {gitPullSnippet}
        </pre>
      </div>

      {/* GitHub Repo & Webhook Configuration */}
      <div
        className="card-surface"
        style={{
          padding: '1.75rem',
          borderRadius: '4px',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <h3 style={{ fontSize: '1.15rem', marginBottom: '4px', color: '#F7F7F2' }}>
          Auto-Update &amp; GitHub Webhook Settings
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          Configure your source GitHub repository and optional deployment webhook (for zero-touch one-click hosting redeployment).
        </p>

        <form onSubmit={handleSaveSettings}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                GITHUB REPOSITORY (OWNER/REPO)
              </label>
              <input
                type="text"
                required
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
                placeholder="bracknodes/web-1"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#0c0f17',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '2px',
                  color: '#F7F7F2',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-mono)',
                }}
              />
            </div>

            <div>
              <label className="mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                DEPLOY WEBHOOK URL (OPTIONAL)
              </label>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://api.vercel.com/v1/integrations/deploy/..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#0c0f17',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '2px',
                  color: '#F7F7F2',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-mono)',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="auto-check-update"
              checked={autoCheck}
              onChange={(e) => setAutoCheck(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <label htmlFor="auto-check-update" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              Check GitHub for new updates automatically when loading Admin panel
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {settingsSaved ? (
              <span className="mono" style={{ color: 'var(--accent-lime)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check size={14} /> UPDATE SETTINGS SAVED
              </span>
            ) : <span />}

            <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.4rem' }}>
              Save Update Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

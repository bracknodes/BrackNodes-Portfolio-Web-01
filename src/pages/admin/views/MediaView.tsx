import React, { useState, useRef } from 'react';
import { useCMS } from '../../../context/CMSContext';
import { UploadCloud, Image as ImageIcon, Trash2, Copy, Check } from 'lucide-react';

export const MediaView: React.FC = () => {
  const { media, uploadMedia, deleteMedia, isSaving } = useCMS();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      await uploadMedia(files[i]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div style={{ maxWidth: '1100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Media Asset Library</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
            Upload project screenshots, mockups, and client avatars.
          </p>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            disabled={isSaving}
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.75rem' }}
          >
            <UploadCloud size={16} />
            <span>{isSaving ? 'Uploading Asset...' : 'Upload Media Asset'}</span>
          </button>
        </div>
      </div>

      {media.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="card-surface"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            borderRadius: '4px',
            border: '2px dashed #222c42',
            cursor: 'pointer',
          }}
        >
          <UploadCloud size={48} color="var(--accent-lime)" style={{ margin: '0 auto 14px', opacity: 0.8 }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>Drop or Browse Images to Upload</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Supports PNG, JPEG, WebP, SVG, and GIF formats. Assets upload directly to Supabase storage.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {media.map((asset) => (
            <div
              key={asset.id}
              className="card-surface"
              style={{
                borderRadius: '4px',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Image Preview */}
              <div
                style={{
                  height: '160px',
                  backgroundColor: '#0c0f17',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {asset.url ? (
                  <img
                    src={asset.url}
                    alt={asset.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <ImageIcon size={36} color="var(--text-muted)" />
                )}
              </div>

              {/* Asset Meta Info */}
              <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '4px' }}>
                    {asset.name}
                  </div>
                  <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    {formatBytes(asset.sizeBytes)} • {asset.mimeType}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => copyUrl(asset.url, asset.id)}
                    className="mono"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      color: copiedId === asset.id ? 'var(--accent-lime)' : 'var(--text-secondary)',
                      padding: '6px',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                    }}
                  >
                    {copiedId === asset.id ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedId === asset.id ? 'COPIED' : 'COPY URL'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteMedia(asset.id)}
                    style={{
                      background: 'none',
                      border: '1px solid rgba(255, 95, 86, 0.3)',
                      color: '#ff8a84',
                      padding: '6px 10px',
                      borderRadius: '2px',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { siteSettings } = useCMS();
  const location = useLocation();
  const adminSlug = siteSettings.adminPath || 'admin';

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#090B10',
          color: '#F7F7F2',
          gap: '12px',
        }}
      >
        <Loader2 size={32} className="animate-spin" color="#C7FF6B" />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#AAB1C1' }}>
          VERIFYING ACCESS...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/${adminSlug}/login`} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

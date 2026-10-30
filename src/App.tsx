import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CMSProvider, useCMS } from './context/CMSContext';

// Public Components & Sections
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './sections/Hero';
import { Projects } from './sections/Projects';
import { About } from './sections/About';
import { Services } from './sections/Services';
import { Skills } from './sections/Skills';
import { Process } from './sections/Process';
import { Testimonials } from './sections/Testimonials';
import { Contact } from './sections/Contact';

// Admin CMS Pages & Guard
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

// Public Portfolio Landing Page
const PublicPortfolio: React.FC = () => {
  return (
    <div className="portfolio-app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Hero />
        <div className="section-divider" />
        <Projects />
        <div className="section-divider" />
        <About />
        <div className="section-divider" />
        <Services />
        <div className="section-divider" />
        <Skills />
        <div className="section-divider" />
        <Process />
        <div className="section-divider" />
        <Testimonials />
        <div className="section-divider" />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

const AppRoutes: React.FC = () => {
  const { siteSettings } = useCMS();
  const adminSlug = siteSettings.adminPath || 'admin';

  return (
    <Routes>
      {/* Public Portfolio Route */}
      <Route path="/" element={<PublicPortfolio />} />

      {/* Private Admin Authentication Route */}
      <Route path={`/${adminSlug}/login`} element={<AdminLogin />} />

      {/* Protected Private CMS Dashboard Route */}
      <Route
        path={`/${adminSlug}/*`}
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      />

      {/* Fallback to Public Site */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <CMSProvider>
          <AppRoutes />
        </CMSProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

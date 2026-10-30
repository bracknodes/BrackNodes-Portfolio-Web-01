-- ==============================================================================
-- ANKIT.DEV PORTFOLIO & CMS — SUPABASE DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- 1. Create Profile / Admin Roles Table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin',
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS for admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view their own profile"
  ON public.admin_users FOR SELECT
  USING (auth.uid() = id);

-- 2. Website Settings (Single Row Configuration)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  brand_name TEXT NOT NULL DEFAULT 'ANKIT',
  wordmark TEXT NOT NULL DEFAULT 'ANKIT.DEV',
  role TEXT NOT NULL DEFAULT 'Creative Developer & Digital Studio',
  tagline TEXT NOT NULL DEFAULT 'IDEAS INTO DIGITAL REALITY.',
  subheading TEXT NOT NULL DEFAULT 'I design and develop distinctive web applications, interactive 3D experiences, and high-performance digital products engineered for impact.',
  status_badge TEXT NOT NULL DEFAULT 'Available for select freelance & studio projects — Q2/Q3',
  location TEXT NOT NULL DEFAULT 'Global / Remote (IST • UTC+5:30)',
  email TEXT NOT NULL DEFAULT 'contact@ankit.dev',
  social_github TEXT DEFAULT 'https://github.com',
  social_linkedin TEXT DEFAULT 'https://linkedin.com',
  social_x TEXT DEFAULT 'https://twitter.com',
  seo_title TEXT DEFAULT 'ANKIT — Creative Developer & Digital Studio',
  seo_description TEXT DEFAULT 'Independent creative developer and digital studio crafting high-impact web applications, immersive 3D experiences, and thoughtful digital products.',
  custom_domain TEXT DEFAULT 'ankit.dev',
  admin_path TEXT DEFAULT 'admin',
  design_theme JSONB DEFAULT '{"primaryAccent": "#C7FF6B", "secondaryAccent": "#70B9FF", "bgPrimary": "#090B10", "bgElevated": "#11151F", "textPrimary": "#F7F7F2", "textSecondary": "#9FA8BC", "borderRadius": "3px", "themeName": "Cyber Dark Lime"}'::jsonb,
  inquire_form JSONB DEFAULT '{"sectionTag": "06 // COMMENCE AN ENGAGEMENT", "sectionTitle": "START A PROJECT", "sectionSubtitle": "Have a new product, interactive 3D vision, or high-performance frontend challenge? Let''s connect.", "pitchHeadline": "Direct partnership. No middle layers.", "pitchDescription": "Every inquiry receives direct personal review. Whether you need an end-to-end web build, interactive WebGL hero experiences, or a comprehensive code architecture audit, I am available for select collaborations.", "projectTypes": ["Web Application", "Interactive 3D / Creative", "Landing Page", "Performance Audit", "Other / Advisory"], "budgetOptions": ["< $3,000", "$3k – $7k", "$7k – $15k", "$15k+"], "submitButtonText": "Transmit Project Brief", "successMessage": "Thank you! Your project inquiry has been securely stored in our database. We will review your requirements and respond within 24 hours.", "responseSla": "24-HOUR RESPONSE SLA", "confidentialityNotice": "100% NDA & IP INTEGRITY"}'::jsonb,
  typography JSONB DEFAULT '{"customFonts": [], "sectionFonts": {"globalBody": "\x27Plus Jakarta Sans\x27, sans-serif", "globalHeading": "\x27Syne\x27, sans-serif", "globalMono": "\x27JetBrains Mono\x27, monospace", "navbar": "\x27JetBrains Mono\x27, monospace", "hero": "\x27Plus Jakarta Sans\x27, sans-serif", "heroTitle": "\x27Syne\x27, sans-serif", "projects": "\x27Plus Jakarta Sans\x27, sans-serif", "about": "\x27Plus Jakarta Sans\x27, sans-serif", "services": "\x27Plus Jakarta Sans\x27, sans-serif", "skills": "\x27Plus Jakarta Sans\x27, sans-serif", "process": "\x27Plus Jakarta Sans\x27, sans-serif", "testimonials": "\x27Plus Jakarta Sans\x27, sans-serif", "contact": "\x27Plus Jakarta Sans\x27, sans-serif", "footer": "\x27JetBrains Mono\x27, monospace"}}'::jsonb,
  custom_code JSONB DEFAULT '{"isEnabled": true, "customCss": "", "headJs": "", "bodyJs": ""}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site_settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin update site_settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  year TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT NOT NULL,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  metrics JSONB NOT NULL DEFAULT '[]'::jsonb,
  live_url TEXT,
  repo_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT true,
  accent_color TEXT NOT NULL DEFAULT '#C7FF6B',
  preview_type TEXT NOT NULL DEFAULT 'interactive-canvas',
  thumbnail_url TEXT,
  gallery_urls JSONB DEFAULT '[]'::jsonb,
  display_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published projects"
  ON public.projects FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR auth.role() = 'authenticated');

CREATE POLICY "Admin write projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

-- 4. Services Table
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,
  outcomes JSONB NOT NULL DEFAULT '[]'::jsonb,
  highlight TEXT NOT NULL DEFAULT 'Production Ready',
  display_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published services"
  ON public.services FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR auth.role() = 'authenticated');

CREATE POLICY "Admin write services"
  ON public.services FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

-- 5. Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  tag TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published skills"
  ON public.skills FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR auth.role() = 'authenticated');

CREATE POLICY "Admin write skills"
  ON public.skills FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

-- 6. Process Steps Table
CREATE TABLE IF NOT EXISTS public.process_steps (
  id TEXT PRIMARY KEY,
  step TEXT NOT NULL,
  title TEXT NOT NULL,
  phase TEXT NOT NULL,
  description TEXT NOT NULL,
  outputs JSONB NOT NULL DEFAULT '[]'::jsonb,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.process_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read process_steps"
  ON public.process_steps FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin write process_steps"
  ON public.process_steps FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

-- 7. Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  content TEXT NOT NULL,
  avatar_url TEXT,
  rating INT NOT NULL DEFAULT 5,
  is_published BOOLEAN NOT NULL DEFAULT false,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published testimonials"
  ON public.testimonials FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR auth.role() = 'authenticated');

CREATE POLICY "Admin write testimonials"
  ON public.testimonials FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

-- 8. Experience & Education Table
CREATE TABLE IF NOT EXISTS public.experience_education (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('experience', 'education')),
  position TEXT NOT NULL,
  organization TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT NOT NULL,
  is_current BOOLEAN NOT NULL DEFAULT false,
  display_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.experience_education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read experience_education"
  ON public.experience_education FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR auth.role() = 'authenticated');

CREATE POLICY "Admin write experience_education"
  ON public.experience_education FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

-- 9. Contact Inquiries Table (Client submissions stored in database)
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  project_type TEXT NOT NULL,
  budget TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an inquiry
CREATE POLICY "Public insert contact_inquiries"
  ON public.contact_inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can read/update/delete inquiries
CREATE POLICY "Admin manage contact_inquiries"
  ON public.contact_inquiries FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

-- 10. Media Assets Table
CREATE TABLE IF NOT EXISTS public.media_assets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  size_bytes BIGINT NOT NULL DEFAULT 0,
  mime_type TEXT NOT NULL DEFAULT 'image/jpeg',
  width INT,
  height INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read media_assets"
  ON public.media_assets FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin write media_assets"
  ON public.media_assets FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

-- ==============================================================================
-- INITIAL SEED TRIGGER / FUNCTION FOR FIRST ADMIN
-- ==============================================================================
-- When an admin signs up through Supabase Auth, they can be registered into public.admin_users
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.admin_users (id, email, role, full_name)
  VALUES (new.id, new.email, 'admin', new.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users (to be applied in Supabase SQL editor)
-- CREATE OR REPLACE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin_user();

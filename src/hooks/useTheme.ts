/**
 * useTheme — Lightweight Dark / Light mode manager.
 * Persists to localStorage and syncs the `data-theme` attribute on <html>.
 * Supports single theme mode (dark-only / light-only) or dual toggle mode with default selection.
 * Fully synchronized across all components via broadcast events and DOM observation.
 */
import { useState, useEffect, useCallback } from 'react';
import { useCMS } from '../context/CMSContext';

export type ThemeMode = 'dark' | 'light';

const STORAGE_KEY = 'ankit_portfolio_theme';
const ATTR = 'data-theme';
const THEME_CHANGE_EVENT = 'bracknodes_theme_change';

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  try {
    const cmsRaw =
      localStorage.getItem('bracknodes_portfolio_cms_v2') ||
      localStorage.getItem('ankit_portfolio_cms_v1');
    let themeMode = 'both';
    let defaultTheme = 'dark';
    if (cmsRaw) {
      const parsed = JSON.parse(cmsRaw);
      if (parsed?.siteSettings?.themeSettings) {
        if (parsed.siteSettings.themeSettings.themeMode)
          themeMode = parsed.siteSettings.themeSettings.themeMode;
        if (parsed.siteSettings.themeSettings.defaultTheme)
          defaultTheme = parsed.siteSettings.themeSettings.defaultTheme;
      }
    }

    if (themeMode === 'dark-only') return 'dark';
    if (themeMode === 'light-only') return 'light';

    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored === 'light' || stored === 'dark') return stored;
    return (defaultTheme as ThemeMode) || 'dark';
  } catch {
    return 'dark';
  }
}

function applyThemeToDom(mode: ThemeMode) {
  if (typeof document === 'undefined') return;
  const html = document.documentElement;
  if (mode === 'light') {
    html.setAttribute(ATTR, 'light');
    // Clear inline color overrides so light mode CSS variables apply properly
    html.style.removeProperty('--bg-primary');
    html.style.removeProperty('--bg-elevated');
    html.style.removeProperty('--text-primary');
    html.style.removeProperty('--text-secondary');
    html.style.removeProperty('--accent-lime');
    html.style.removeProperty('--accent-lime-muted');
    html.style.removeProperty('--accent-lime-glow');
    html.style.removeProperty('--accent-blue');
    html.style.removeProperty('--accent-blue-muted');
    html.style.removeProperty('--accent-blue-glow');
  } else {
    html.removeAttribute(ATTR);
    // Restore CMS theme tokens in dark mode if present in localStorage
    try {
      const stored =
        localStorage.getItem('bracknodes_portfolio_cms_v2') ||
        localStorage.getItem('ankit_portfolio_cms_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        const t = parsed?.siteSettings?.designTheme;
        if (t) {
          if (t.bgPrimary) html.style.setProperty('--bg-primary', t.bgPrimary);
          if (t.bgElevated) html.style.setProperty('--bg-elevated', t.bgElevated);
          if (t.textPrimary) html.style.setProperty('--text-primary', t.textPrimary);
          if (t.textSecondary) html.style.setProperty('--text-secondary', t.textSecondary);
        }
      }
    } catch {
      // ignore
    }
  }
}

function broadcastThemeChange(mode: ThemeMode) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: mode }));
  }
}

export function useTheme() {
  const { siteSettings } = useCMS();
  const themeMode = siteSettings?.themeSettings?.themeMode || 'both';
  const defaultTheme = siteSettings?.themeSettings?.defaultTheme || 'dark';
  const isToggleAllowed = themeMode === 'both';

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof document !== 'undefined') {
      const isLight = document.documentElement.getAttribute(ATTR) === 'light';
      return isLight ? 'light' : 'dark';
    }
    if (themeMode === 'dark-only') return 'dark';
    if (themeMode === 'light-only') return 'light';
    return getInitialTheme();
  });

  // Keep all components synchronized when any component toggles the theme
  useEffect(() => {
    const handleCustomEvent = (e: Event) => {
      const custom = e as CustomEvent<ThemeMode>;
      if (custom.detail && (custom.detail === 'dark' || custom.detail === 'light')) {
        setThemeState(custom.detail);
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === 'light' || e.newValue === 'dark')) {
        setThemeState(e.newValue);
        applyThemeToDom(e.newValue);
      }
    };

    // Watch <html> attribute in case it gets changed
    const observer = new MutationObserver(() => {
      const isLight = document.documentElement.getAttribute(ATTR) === 'light';
      const currentMode: ThemeMode = isLight ? 'light' : 'dark';
      setThemeState((prev) => (prev !== currentMode ? currentMode : prev));
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: [ATTR] });
    window.addEventListener(THEME_CHANGE_EVENT, handleCustomEvent);
    window.addEventListener('storage', handleStorage);

    return () => {
      observer.disconnect();
      window.removeEventListener(THEME_CHANGE_EVENT, handleCustomEvent);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Sync if admin changes themeMode or defaultTheme
  useEffect(() => {
    if (themeMode === 'dark-only' && theme !== 'dark') {
      setThemeState('dark');
      applyThemeToDom('dark');
      broadcastThemeChange('dark');
    } else if (themeMode === 'light-only' && theme !== 'light') {
      setThemeState('light');
      applyThemeToDom('light');
      broadcastThemeChange('light');
    }
  }, [themeMode, theme]);

  // Apply on mount
  useEffect(() => {
    applyThemeToDom(theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTheme = useCallback(
    (mode: ThemeMode) => {
      if (themeMode === 'dark-only') {
        setThemeState('dark');
        applyThemeToDom('dark');
        broadcastThemeChange('dark');
        return;
      }
      if (themeMode === 'light-only') {
        setThemeState('light');
        applyThemeToDom('light');
        broadcastThemeChange('light');
        return;
      }
      setThemeState(mode);
      applyThemeToDom(mode);
      localStorage.setItem(STORAGE_KEY, mode);
      broadcastThemeChange(mode);
    },
    [themeMode],
  );

  const toggleTheme = useCallback(() => {
    if (!isToggleAllowed) return;
    const isCurrentlyLight = document.documentElement.getAttribute(ATTR) === 'light';
    const nextMode: ThemeMode = isCurrentlyLight ? 'dark' : 'light';
    setTheme(nextMode);
  }, [setTheme, isToggleAllowed]);

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isToggleAllowed,
    themeMode,
    defaultTheme,
  };
}

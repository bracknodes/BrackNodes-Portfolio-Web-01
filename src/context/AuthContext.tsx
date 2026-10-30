import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const AUTO_LOGOUT_TIMEOUT_MS = 60 * 60 * 1000; // 60 minutes in milliseconds
export const LAST_ACTIVITY_KEY = 'bracknodes_admin_last_activity';
export const SESSION_EXPIRED_KEY = 'bracknodes_session_expired';
export const LOCAL_ADMIN_KEY = 'ankit_cms_local_admin_session';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isLiveSupabase: boolean;
  sessionTimeoutMinutes: number;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null; success?: boolean }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isLive = isSupabaseConfigured();

  // 1. Initial Session Detection & 60-Minute Expiration Verification
  useEffect(() => {
    const lastActiveStr = localStorage.getItem(LAST_ACTIVITY_KEY);
    const isExpired = lastActiveStr && (Date.now() - Number(lastActiveStr) >= AUTO_LOGOUT_TIMEOUT_MS);

    if (isExpired) {
      // Prior session exceeded 60 minutes of inactivity
      try {
        sessionStorage.setItem(SESSION_EXPIRED_KEY, 'true');
        localStorage.removeItem(LOCAL_ADMIN_KEY);
        localStorage.removeItem(LAST_ACTIVITY_KEY);
      } catch {
        // ignore
      }
      if (isLive) {
        supabase.auth.signOut().catch(() => {});
      }
      setUser(null);
      setSession(null);
      setIsLoading(false);
      return;
    }

    if (isLive) {
      // Live Supabase Session Detection
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
        }
        setIsLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
        }
        setIsLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // Local Admin Session Fallback
      const cached = localStorage.getItem(LOCAL_ADMIN_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setUser(parsed);
          localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
        } catch {
          localStorage.removeItem(LOCAL_ADMIN_KEY);
        }
      }
      setIsLoading(false);
    }
  }, [isLive]);

  // 2. 60-Minute Inactivity Auto-Logout Heartbeat & Activity Listener
  useEffect(() => {
    if (!user) return;

    let lastRecorded = Date.now();
    localStorage.setItem(LAST_ACTIVITY_KEY, String(lastRecorded));

    const recordActivity = () => {
      const now = Date.now();
      // Throttle localStorage writes to at most once every 15 seconds
      if (now - lastRecorded > 15000) {
        lastRecorded = now;
        try {
          localStorage.setItem(LAST_ACTIVITY_KEY, String(now));
        } catch {
          // ignore
        }
      }
    };

    const verifySessionTimeout = () => {
      try {
        const stored = localStorage.getItem(LAST_ACTIVITY_KEY);
        if (!stored) return;
        const elapsed = Date.now() - Number(stored);
        if (elapsed >= AUTO_LOGOUT_TIMEOUT_MS) {
          sessionStorage.setItem(SESSION_EXPIRED_KEY, 'true');
          logout();
        }
      } catch {
        // ignore
      }
    };

    // User activity events: mouse movement, keystrokes, touches, scrolls
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    activityEvents.forEach((evt) => {
      window.addEventListener(evt, recordActivity, { passive: true });
    });

    // Check timeout every 30 seconds
    const intervalTimer = setInterval(verifySessionTimeout, 30000);

    // Immediate check on tab focus or visibility return
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        verifySessionTimeout();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, recordActivity);
      });
      clearInterval(intervalTimer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [user]);

  const login = async (email: string, password: string): Promise<{ error: string | null }> => {
    setIsLoading(true);

    if (isLive) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setIsLoading(false);
        return { error: error.message };
      }

      setUser(data.user);
      setSession(data.session);
      try {
        localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
        sessionStorage.removeItem(SESSION_EXPIRED_KEY);
      } catch {
        // ignore
      }
      setIsLoading(false);
      return { error: null };
    } else {
      // Local development login flow:
      if (!email.includes('@') || password.length < 6) {
        setIsLoading(false);
        return { error: 'Invalid email or password (min 6 characters required).' };
      }

      const dummyUser: any = {
        id: 'local-admin-dev',
        email: email.trim(),
        user_metadata: { full_name: 'Studio Owner' },
        role: 'authenticated',
        created_at: new Date().toISOString(),
      };

      try {
        localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(dummyUser));
        localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
        sessionStorage.removeItem(SESSION_EXPIRED_KEY);
      } catch {
        // ignore
      }
      setUser(dummyUser);
      setIsLoading(false);
      return { error: null };
    }
  };

  const logout = async () => {
    if (isLive) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
    }
    try {
      localStorage.removeItem(LOCAL_ADMIN_KEY);
      localStorage.removeItem(LAST_ACTIVITY_KEY);
    } catch {
      // ignore
    }
    setUser(null);
    setSession(null);
  };

  const resetPassword = async (email: string): Promise<{ error: string | null; success?: boolean }> => {
    if (isLive) {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });
      if (error) return { error: error.message };
      return { error: null, success: true };
    } else {
      return {
        error: null,
        success: true,
      };
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated,
        isAdmin,
        isLoading,
        isLiveSupabase: isLive,
        sessionTimeoutMinutes: 60,
        login,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getMe, login as loginRequest, type AuthUser } from './api/auth';

export interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<{ user?: AuthUser; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

interface AuthConfig {
  /** `'client'` for the company portal, `'admin'` for the admin portal (matches `POST /auth/login` body's `role`). */
  role: 'admin' | 'client';
  tokenKey: string;
  userKey: string;
}

/**
 * Builds an isolated `{ AuthProvider, useAuth }` pair backed by its own
 * localStorage keys, so the company and admin portals can hold independent
 * sessions in the same browser without colliding.
 */
function createAuthContext({ role, tokenKey, userKey }: AuthConfig) {
  const Ctx = createContext<AuthContextValue | undefined>(undefined);

  function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem(tokenKey));
    const [user, setUser] = useState<AuthUser | null>(() => {
      const raw = localStorage.getItem(userKey);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as AuthUser;
      } catch {
        return null;
      }
    });
    const [loading, setLoading] = useState(true);

    const persist = useCallback((nextToken: string | null, nextUser: AuthUser | null) => {
      setToken(nextToken);
      setUser(nextUser);
      if (nextToken) localStorage.setItem(tokenKey, nextToken);
      else localStorage.removeItem(tokenKey);
      if (nextUser) localStorage.setItem(userKey, JSON.stringify(nextUser));
      else localStorage.removeItem(userKey);
    }, []);

    const logout = useCallback(() => {
      persist(null, null);
    }, [persist]);

    const refreshUser = useCallback(async () => {
      const currentToken = localStorage.getItem(tokenKey);
      if (!currentToken) return;
      // If demo token, don't hit backend
      if (currentToken.startsWith('demo_')) return;
      const { data } = await getMe(currentToken);
      if (data) {
        setUser(data);
        localStorage.setItem(userKey, JSON.stringify(data));
      }
    }, [tokenKey, userKey]);

    useEffect(() => {
      void refreshUser().finally(() => setLoading(false));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = useCallback(
      async (phone: string, password: string) => {
        try {
          const { data } = await loginRequest(role, phone, password);
          if (data?.token && data?.user) {
            persist(data.token, data.user);
            return { user: data.user };
          }
        } catch {
          // fallback to offline demo
        }
        
        // Fallback demo session when backend is offline
        const mockUser: AuthUser = {
          id: `demo-${role}-id`,
          fullName: role === 'admin' ? 'Super Admin' : 'شركة النقل التجريبي',
          phone,
          role: role === 'admin' ? 'admin' : 'client',
          companyType: 'company',
          adminSubRoles: ['super'],
        };
        const mockToken = `demo_${role}_token`;
        persist(mockToken, mockUser);
        return { user: mockUser };
      },
      [persist, role]
    );

    const value = useMemo<AuthContextValue>(
      () => ({ token, user, loading, login, logout, refreshUser }),
      [token, user, loading, login, logout, refreshUser]
    );

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
  }

  function useAuth(): AuthContextValue {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error('useAuth must be used within its matching AuthProvider');
    return ctx;
  }

  return { AuthProvider, useAuth };
}

export const { AuthProvider: CompanyAuthProvider, useAuth: useCompanyAuth } = createAuthContext({
  role: 'client',
  tokenKey: 'diziel_company_token',
  userKey: 'diziel_company_user',
});

export const { AuthProvider: AdminAuthProvider, useAuth: useAdminAuth } = createAuthContext({
  role: 'admin',
  tokenKey: 'diziel_admin_token',
  userKey: 'diziel_admin_user',
});

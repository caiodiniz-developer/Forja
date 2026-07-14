import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { api } from "@/lib/api";

export type Role = "STUDENT" | "INSTRUCTOR" | "ADMIN";
export type Plan = "FREE" | "PRO";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  plan: Plan;
  avatarUrl: string | null;
  emailVerified: boolean;
}

interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  /** Re-fetch the current user (e.g. after a plan change). */
  refreshMe: () => Promise<void>;
  /** Rotate the access token via the refresh cookie; returns the new token or null. */
  refreshAccess: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore the session from the httpOnly refresh cookie on first load.
  useEffect(() => {
    let active = true;
    api<AuthResponse>("/auth/refresh", { method: "POST" })
      .then((res) => {
        if (!active) return;
        setUser(res.user);
        setAccessToken(res.accessToken);
      })
      .catch(() => {
        /* no valid session — stay logged out */
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api<AuthResponse>("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setUser(res.user);
    setAccessToken(res.accessToken);
    return res.user;
  }, []);

  // Dedupe concurrent refreshes so simultaneous 401s don't race to rotate the
  // refresh token (which would revoke it and fail the later calls).
  const inFlight = useRef<Promise<string | null> | null>(null);
  const refreshAccess = useCallback(async () => {
    if (inFlight.current) return inFlight.current;
    inFlight.current = (async () => {
      try {
        const res = await api<AuthResponse>("/auth/refresh", { method: "POST" });
        setUser(res.user);
        setAccessToken(res.accessToken);
        return res.accessToken;
      } catch {
        setUser(null);
        setAccessToken(null);
        return null;
      } finally {
        inFlight.current = null;
      }
    })();
    return inFlight.current;
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      // Create the account but do NOT start a session — the user then logs in.
      await api<AuthResponse>("/auth/register", {
        method: "POST",
        body: { name, email, password },
      });
      await api("/auth/logout", { method: "POST" }).catch(() => {});
    },
    [],
  );

  const logout = useCallback(async () => {
    await api("/auth/logout", { method: "POST" }).catch(() => {});
    localStorage.removeItem("forja_remember");
    setUser(null);
    setAccessToken(null);
  }, []);

  const refreshMe = useCallback(async () => {
    if (!accessToken) return;
    const res = await api<{ user: AuthUser }>("/auth/me", {
      token: accessToken,
    });
    setUser(res.user);
  }, [accessToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      loading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      refreshMe,
      refreshAccess,
    }),
    [user, accessToken, loading, login, register, logout, refreshMe, refreshAccess],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

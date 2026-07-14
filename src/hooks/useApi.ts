import { useCallback } from "react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

interface Options {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
}

/**
 * Returns a `call` bound with the current access token. If a request fails with
 * 401 (expired token), it transparently rotates the token via the refresh cookie
 * and retries once — so long sessions never break silently.
 */
export function useApi() {
  const { accessToken, refreshAccess } = useAuth();
  return useCallback(
    async <T = unknown>(path: string, opts: Options = {}): Promise<T> => {
      try {
        return await api<T>(path, { ...opts, token: accessToken });
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          const fresh = await refreshAccess();
          if (fresh) return await api<T>(path, { ...opts, token: fresh });
        }
        throw err;
      }
    },
    [accessToken, refreshAccess],
  );
}

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { Role } from "@/contexts/AuthContext";

/** Gates dashboard routes: requires auth and, optionally, a specific role. */
export function ProtectedRoute({ role }: { role?: Role }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-iron-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-cream/10 border-t-ember-500" />
          <span className="font-mono text-xs uppercase tracking-widest text-cream/40">
            carregando
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to={user?.role === "ADMIN" ? "/admin" : "/painel"} replace />;
  }

  return <Outlet />;
}

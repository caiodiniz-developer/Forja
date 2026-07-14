import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { ScrollProgress } from "@/components/common/ScrollProgress";
import { Preloader } from "@/components/common/Preloader";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LandingPage } from "@/pages/LandingPage";
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import { studentNav, adminNav } from "@/config/dashboardNav";

// Dashboards are code-split so they never weigh down the landing bundle.
const DashboardLayout = lazy(() =>
  import("@/components/dashboard/DashboardLayout").then((m) => ({
    default: m.DashboardLayout,
  })),
);
const StudentDashboard = lazy(() =>
  import("@/pages/dashboard/StudentDashboard").then((m) => ({
    default: m.StudentDashboard,
  })),
);
const AdminDashboard = lazy(() =>
  import("@/pages/admin/AdminDashboard").then((m) => ({
    default: m.AdminDashboard,
  })),
);
const ComingSoon = lazy(() =>
  import("@/pages/dashboard/ComingSoon").then((m) => ({ default: m.ComingSoon })),
);
const StudentCursos = lazy(() =>
  import("@/pages/dashboard/Cursos").then((m) => ({ default: m.Cursos })),
);
const Perfil = lazy(() =>
  import("@/pages/dashboard/Perfil").then((m) => ({ default: m.Perfil })),
);
const AdminCursos = lazy(() =>
  import("@/pages/admin/Cursos").then((m) => ({ default: m.Cursos })),
);
const CourseBuilder = lazy(() =>
  import("@/pages/admin/CourseBuilder").then((m) => ({ default: m.CourseBuilder })),
);
const Usuarios = lazy(() =>
  import("@/pages/admin/Usuarios").then((m) => ({ default: m.Usuarios })),
);
const CoursePlayer = lazy(() =>
  import("@/pages/dashboard/CoursePlayer").then((m) => ({ default: m.CoursePlayer })),
);
const Certificados = lazy(() =>
  import("@/pages/dashboard/Certificados").then((m) => ({ default: m.Certificados })),
);
const StudentEventos = lazy(() =>
  import("@/pages/dashboard/Eventos").then((m) => ({ default: m.Eventos })),
);
const StudentNotificacoes = lazy(() =>
  import("@/pages/dashboard/Notificacoes").then((m) => ({ default: m.Notificacoes })),
);
const Tarefas = lazy(() =>
  import("@/pages/dashboard/Tarefas").then((m) => ({ default: m.Tarefas })),
);
const AdminEventos = lazy(() =>
  import("@/pages/admin/Eventos").then((m) => ({ default: m.Eventos })),
);
const AdminNotificacoes = lazy(() =>
  import("@/pages/admin/Notificacoes").then((m) => ({ default: m.Notificacoes })),
);
const Analytics = lazy(() =>
  import("@/pages/admin/Analytics").then((m) => ({ default: m.Analytics })),
);
const Tasks = lazy(() =>
  import("@/pages/admin/Tasks").then((m) => ({ default: m.Tasks })),
);
const Config = lazy(() =>
  import("@/pages/admin/Config").then((m) => ({ default: m.Config })),
);
const Professores = lazy(() =>
  import("@/pages/admin/Professores").then((m) => ({ default: m.Professores })),
);
const Conta = lazy(() =>
  import("@/pages/admin/Conta").then((m) => ({ default: m.Conta })),
);

function Landing() {
  const { user, loading } = useAuth();
  useSmoothScroll();

  // "Lembrar de mim": go straight to the dashboard on every visit.
  if (
    !loading &&
    user &&
    typeof localStorage !== "undefined" &&
    localStorage.getItem("forja_remember") === "1"
  ) {
    return <Navigate to={user.role === "ADMIN" ? "/admin" : "/painel"} replace />;
  }

  return (
    <>
      <Preloader />
      <ScrollProgress />
      <LandingPage />
    </>
  );
}

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-iron-950">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-cream/10 border-t-ember-500" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
      <BrowserRouter>
        <div className="noise relative min-h-screen bg-iron-950">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* ---------------- student ---------------- */}
              <Route element={<ProtectedRoute role="STUDENT" />}>
                <Route element={<DashboardLayout groups={studentNav} />}>
                  <Route path="/painel" element={<StudentDashboard />} />
                  <Route path="/painel/cursos" element={<StudentCursos />} />
                  <Route path="/painel/curso/:slug" element={<CoursePlayer />} />
                  <Route path="/painel/tarefas" element={<Tarefas />} />
                  <Route path="/painel/certificados" element={<Certificados />} />
                  <Route path="/painel/eventos" element={<StudentEventos />} />
                  <Route
                    path="/painel/favoritos"
                    element={<ComingSoon title="Favoritos" />}
                  />
                  <Route
                    path="/painel/notificacoes"
                    element={<StudentNotificacoes />}
                  />
                  <Route path="/painel/perfil" element={<Perfil />} />
                </Route>
              </Route>

              {/* ---------------- admin ---------------- */}
              <Route element={<ProtectedRoute role="ADMIN" />}>
                <Route element={<DashboardLayout groups={adminNav} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/analytics" element={<Analytics />} />
                  <Route path="/admin/cursos" element={<AdminCursos />} />
                  <Route path="/admin/cursos/:id" element={<CourseBuilder />} />
                  <Route path="/admin/curso/:slug" element={<CoursePlayer />} />
                  <Route path="/admin/conta" element={<Conta />} />
                  <Route path="/admin/professores" element={<Professores />} />
                  <Route path="/admin/eventos" element={<AdminEventos />} />
                  <Route
                    path="/admin/notificacoes"
                    element={<AdminNotificacoes />}
                  />
                  <Route path="/admin/usuarios" element={<Usuarios />} />
                  <Route path="/admin/tasks" element={<Tasks />} />
                  <Route path="/admin/config" element={<Config />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

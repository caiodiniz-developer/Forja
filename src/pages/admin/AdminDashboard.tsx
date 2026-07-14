import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiUsers,
  FiBookOpen,
  FiPlayCircle,
  FiAward,
  FiCalendar,
  FiZap,
} from "react-icons/fi";
import { StatCard } from "@/components/dashboard/StatCard";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { AreaChart } from "@/components/dashboard/AreaChart";
import { Button } from "@/components/ui/Button";
import { useApi } from "@/hooks/useApi";

interface Stats {
  counts: {
    users: number;
    students: number;
    instructors: number;
    admins: number;
    proUsers: number;
    courses: number;
    publishedCourses: number;
    lessons: number;
    events: number;
    certificates: number;
    enrollments: number;
  };
  activity: { who: string; action: string; target: string; at: string }[];
}
interface Analytics {
  signups: { label: string; value: number }[];
  topCourses: { title: string; enrollments: number }[];
  totals: {
    newUsers: number;
    activeUsers: number;
    hoursStudied: number;
    certificatesIssued: number;
    completionRate: number;
    comments: number;
    events: number;
    enrollments: number;
  };
}

export function AdminDashboard() {
  const call = useApi();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [an, setAn] = useState<Analytics | null>(null);

  useEffect(() => {
    call<Stats>("/admin/stats").then(setStats).catch(() => {});
    call<Analytics>("/admin/analytics?range=30d").then(setAn).catch(() => {});
  }, [call]);

  const kpis = stats
    ? [
        { label: "Usuários", value: stats.counts.users, icon: FiUsers },
        { label: "Cursos publicados", value: stats.counts.publishedCourses, icon: FiBookOpen },
        { label: "Matrículas", value: stats.counts.enrollments, icon: FiPlayCircle },
        { label: "Certificados", value: stats.counts.certificates, icon: FiAward },
      ]
    : [];

  const initials = (name: string) =>
    name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Painel administrativo</p>
          <h1 className="font-display text-3xl font-semibold text-cream md:text-4xl">
            Visão geral
          </h1>
        </div>
        <Button size="md" onClick={() => navigate("/admin/cursos")}>
          <FiPlus /> Novo curso
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 0.08} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {/* signups */}
          <GlassPanel
            title="Novos usuários"
            action={<span className="font-mono text-xs text-cream/45">últimos 30 dias</span>}
          >
            <div className="mb-4 flex items-end gap-3">
              <span className="font-display text-4xl font-semibold text-cream">
                {an?.totals.newUsers ?? 0}
              </span>
              <span className="mb-1.5 font-mono text-xs text-cream/45">
                {an?.totals.activeUsers ?? 0} ativos no período
              </span>
            </div>
            {an && (
              <AreaChart data={an.signups} formatValue={(v) => `${v} novos`} />
            )}
          </GlassPanel>

          <div className="grid gap-6 md:grid-cols-2">
            <GlassPanel title="Cursos mais procurados">
              <div className="space-y-2">
                {an && an.topCourses.length > 0 ? (
                  an.topCourses.map((c, i) => (
                    <div
                      key={c.title}
                      className="flex items-center gap-3 rounded-xl border border-cream/[0.06] bg-iron-950/40 p-3"
                    >
                      <span className="font-display text-lg font-bold text-ember-400/80">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h4 className="min-w-0 flex-1 truncate text-sm font-medium text-cream">
                        {c.title}
                      </h4>
                      <span className="font-mono text-xs text-cream/50">
                        {c.enrollments} matrículas
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="py-6 text-center text-sm text-cream/45">
                    Sem matrículas ainda.
                  </p>
                )}
              </div>
            </GlassPanel>

            <GlassPanel title="Resumo da plataforma">
              <div className="grid grid-cols-2 gap-3">
                {stats &&
                  [
                    { label: "Professores", value: stats.counts.instructors, icon: FiUsers },
                    { label: "Assinantes PRO", value: stats.counts.proUsers, icon: FiZap },
                    { label: "Aulas", value: stats.counts.lessons, icon: FiPlayCircle },
                    { label: "Eventos", value: stats.counts.events, icon: FiCalendar },
                  ].map((b) => (
                    <div
                      key={b.label}
                      className="rounded-xl border border-cream/[0.06] bg-iron-950/40 p-4"
                    >
                      <b.icon className="mb-2 text-ember-400" size={16} />
                      <div className="font-display text-2xl font-semibold text-cream">
                        {b.value}
                      </div>
                      <div className="text-xs text-cream/45">{b.label}</div>
                    </div>
                  ))}
              </div>
            </GlassPanel>
          </div>
        </div>

        <div className="space-y-6">
          <GlassPanel title="Métricas">
            <div className="space-y-4">
              {an &&
                [
                  { label: "Taxa de conclusão", value: `${an.totals.completionRate}%`, pct: an.totals.completionRate },
                  {
                    label: "Assinantes PRO",
                    value: stats
                      ? `${Math.round((stats.counts.proUsers / Math.max(stats.counts.users, 1)) * 100)}%`
                      : "0%",
                    pct: stats
                      ? Math.round((stats.counts.proUsers / Math.max(stats.counts.users, 1)) * 100)
                      : 0,
                  },
                  { label: "Horas estudadas", value: `${an.totals.hoursStudied}h`, pct: Math.min(an.totals.hoursStudied, 100) },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="text-cream/60">{row.label}</span>
                      <span className="font-display font-semibold text-cream">
                        {row.value}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-cream/10">
                      <div
                        className="h-full rounded-full bg-molten"
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </GlassPanel>

          <GlassPanel title="Atividade recente">
            {stats && stats.activity.length > 0 ? (
              <div className="relative space-y-1">
                <span className="absolute bottom-2 left-[19px] top-2 w-px bg-cream/10" />
                {stats.activity.map((a, i) => (
                  <div key={i} className="relative flex gap-3 rounded-xl p-2">
                    <span className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-iron-950 bg-molten-soft font-display text-[0.7rem] font-semibold text-iron-950">
                      {initials(a.who)}
                    </span>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="text-sm text-cream/80">
                        <span className="font-medium text-cream">{a.who}</span>{" "}
                        {a.action}{" "}
                        <span className="text-ember-300">{a.target}</span>
                      </p>
                      <span className="font-mono text-[0.65rem] text-cream/40">
                        {new Date(a.at).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-cream/45">
                Nenhuma atividade ainda.
              </p>
            )}
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}

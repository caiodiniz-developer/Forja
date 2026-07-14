import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiPlay,
  FiArrowRight,
  FiZap,
  FiClock,
  FiBookOpen,
  FiAward,
  FiCalendar,
  FiLock,
  FiTrendingUp,
} from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import { StatCard } from "@/components/dashboard/StatCard";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { BarChart } from "@/components/dashboard/BarChart";
import { Button } from "@/components/ui/Button";

interface Stats {
  streak: number;
  minutesStudied: number;
  hoursStudied: number;
  lessonsCompleted: number;
  coursesInProgress: number;
  coursesCompleted: number;
  certificates: number;
  weekly: { day: string; value: number }[];
}
interface MyCourse {
  slug: string;
  title: string;
  category: string;
  progressPct: number;
  status: string;
}
interface EventItem {
  id: string;
  title: string;
  kind: string;
  startsAt: string;
}

export function StudentDashboard() {
  const { user } = useAuth();
  const call = useApi();
  const first = user?.name.split(" ")[0] ?? "aluno";

  const [stats, setStats] = useState<Stats | null>(null);
  const [courses, setCourses] = useState<MyCourse[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    call<{ stats: Stats }>("/learning/stats").then((r) => setStats(r.stats)).catch(() => {});
    call<{ items: MyCourse[] }>("/learning/me/courses").then((r) => setCourses(r.items)).catch(() => {});
    call<{ items: EventItem[] }>("/events").then((r) => setEvents(r.items)).catch(() => {});
  }, [call]);

  const active = courses.filter((c) => c.status !== "COMPLETED");
  const resume = active[0];

  const kpis = stats
    ? [
        { label: "Sequência de estudos", value: stats.streak, suffix: " dias", icon: FiZap },
        { label: "Horas estudadas", value: stats.hoursStudied, suffix: "h", icon: FiClock },
        { label: "Cursos concluídos", value: stats.coursesCompleted, icon: FiBookOpen },
        { label: "Certificados", value: stats.certificates, icon: FiAward },
      ]
    : [];

  const achievements = [
    { title: "Primeira brasa", desc: "1ª aula concluída", icon: FiZap, ok: (stats?.lessonsCompleted ?? 0) >= 1 },
    { title: "Constância", desc: "3 dias seguidos", icon: FiTrendingUp, ok: (stats?.streak ?? 0) >= 3 },
    { title: "Forjador", desc: "Concluiu um curso", icon: FiBookOpen, ok: (stats?.coursesCompleted ?? 0) >= 1 },
    { title: "Certificado", desc: "1º certificado", icon: FiAward, ok: (stats?.certificates ?? 0) >= 1 },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-cream md:text-4xl">
            Olá, {first} <span className="inline-block">👋</span>
          </h1>
          <p className="mt-1 text-cream/55">
            {stats && stats.lessonsCompleted === 0
              ? "Sua jornada começa agora — escolha um curso e forje a primeira aula."
              : "Bom te ver de volta. Vamos manter a brasa acesa?"}
          </p>
        </div>
        {resume && (
          <Link to={`/painel/curso/${resume.slug}`}>
            <Button size="md">
              <FiPlay /> Continuar estudando
            </Button>
          </Link>
        )}
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 0.08} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {/* continue / empty */}
          {resume ? (
            <GlassPanel className="overflow-hidden !p-0">
              <Link to={`/painel/curso/${resume.slug}`} className="grid md:grid-cols-2">
                <div className="relative flex min-h-[200px] items-center justify-center bg-gradient-to-br from-iron-800 to-iron-950">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(232,133,4,0.28),transparent_60%)]" />
                  <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-molten text-iron-950 shadow-glow">
                    <FiPlay size={24} className="ml-1" fill="currentColor" />
                  </span>
                </div>
                <div className="flex flex-col justify-center p-6">
                  <span className="font-mono text-[0.7rem] uppercase tracking-widest text-ember-400">
                    Continuar · {resume.category}
                  </span>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-cream">
                    {resume.title}
                  </h3>
                  <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-cream/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${resume.progressPct}%` }}
                      className="h-full rounded-full bg-molten"
                    />
                  </div>
                  <span className="mt-2 font-mono text-xs text-cream/45">
                    {resume.progressPct}% concluído
                  </span>
                </div>
              </Link>
            </GlassPanel>
          ) : (
            <GlassPanel>
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <FiBookOpen size={30} className="text-ember-400" />
                <p className="max-w-sm text-cream/60">
                  Você ainda não começou nenhum curso. Explore o catálogo e comece
                  sua jornada.
                </p>
                <Link to="/painel/cursos">
                  <Button>Explorar cursos</Button>
                </Link>
              </div>
            </GlassPanel>
          )}

          {/* in progress */}
          {active.length > 0 && (
            <GlassPanel title="Cursos em andamento">
              <div className="space-y-3">
                {active.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/painel/curso/${c.slug}`}
                    className="group flex items-center gap-4 rounded-2xl border border-cream/[0.06] bg-iron-950/40 p-3 transition-colors hover:border-ember-500/30"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-molten-soft font-display font-bold text-iron-950">
                      {c.progressPct}%
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-medium text-cream">{c.title}</h4>
                      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-cream/10">
                        <div
                          className="h-full rounded-full bg-molten"
                          style={{ width: `${c.progressPct}%` }}
                        />
                      </div>
                    </div>
                    <FiArrowRight className="text-cream/30 group-hover:text-ember-400" />
                  </Link>
                ))}
              </div>
            </GlassPanel>
          )}

          {/* weekly */}
          <GlassPanel
            title="Ritmo de estudos"
            action={<span className="font-mono text-xs text-cream/45">últimos 7 dias · horas/dia</span>}
          >
            {stats && stats.weekly.some((w) => w.value > 0) ? (
              <BarChart
                data={stats.weekly.map((w) => ({ label: w.day, value: w.value }))}
                formatValue={(v) => `${v}h`}
              />
            ) : (
              <div className="flex h-40 items-center justify-center text-sm text-cream/40">
                Complete aulas para ver seu ritmo aqui.
              </div>
            )}
          </GlassPanel>
        </div>

        {/* right */}
        <div className="space-y-6">
          <GlassPanel title="Conquistas">
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((a) => {
                const Icon = a.icon;
                return (
                  <div
                    key={a.title}
                    className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center ${
                      a.ok
                        ? "border-ember-500/25 bg-ember-500/[0.06]"
                        : "border-cream/[0.06] bg-iron-950/40 opacity-55"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        a.ok ? "bg-molten text-iron-950" : "bg-cream/5 text-cream/40"
                      }`}
                    >
                      {a.ok ? <Icon size={20} /> : <FiLock size={18} />}
                    </div>
                    <span className="text-xs font-medium text-cream">{a.title}</span>
                    <span className="text-[0.65rem] text-cream/45">{a.desc}</span>
                  </div>
                );
              })}
            </div>
          </GlassPanel>

          <GlassPanel title="Próximos eventos">
            {events.length === 0 ? (
              <p className="py-6 text-center text-sm text-cream/45">
                Nenhum evento agendado.
              </p>
            ) : (
              <div className="space-y-2">
                {events.slice(0, 4).map((e) => {
                  const d = new Date(e.startsAt);
                  return (
                    <div
                      key={e.id}
                      className="flex items-center gap-3 rounded-2xl border border-cream/[0.06] bg-iron-950/40 p-3"
                    >
                      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-cream/5 font-mono">
                        <span className="text-sm font-bold text-cream">
                          {d.getDate()}
                        </span>
                        <span className="text-[0.6rem] uppercase text-cream/45">
                          {d.toLocaleDateString("pt-BR", { month: "short" })}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-widest text-ember-400">
                          <FiCalendar size={10} /> {e.kind}
                        </div>
                        <h4 className="truncate text-sm font-medium text-cream">
                          {e.title}
                        </h4>
                        <span className="font-mono text-[0.65rem] text-cream/45">
                          {d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}

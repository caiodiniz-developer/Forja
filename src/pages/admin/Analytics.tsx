import { useEffect, useState } from "react";
import {
  FiUsers,
  FiClock,
  FiAward,
  FiCheckCircle,
  FiMessageCircle,
  FiCalendar,
  FiActivity,
  FiTrendingUp,
} from "react-icons/fi";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { AreaChart } from "@/components/dashboard/AreaChart";
import { BarChart } from "@/components/dashboard/BarChart";
import { AnimatedNumber } from "@/components/dashboard/AnimatedNumber";
import { useApi } from "@/hooks/useApi";

interface Analytics {
  range: string;
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

const ranges = [
  { k: "7d", label: "7 dias" },
  { k: "30d", label: "30 dias" },
  { k: "12m", label: "12 meses" },
];

export function Analytics() {
  const call = useApi();
  const [range, setRange] = useState("30d");
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    call<Analytics>(`/admin/analytics?range=${range}`)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [range, call]);

  const t = data?.totals;
  const cards = [
    { label: "Novos usuários", value: t?.newUsers ?? 0, icon: FiUsers },
    { label: "Usuários ativos", value: t?.activeUsers ?? 0, icon: FiActivity },
    { label: "Horas estudadas", value: t?.hoursStudied ?? 0, suffix: "h", icon: FiClock },
    { label: "Certificados", value: t?.certificatesIssued ?? 0, icon: FiAward },
    { label: "Conclusão", value: t?.completionRate ?? 0, suffix: "%", icon: FiCheckCircle },
    { label: "Comentários", value: t?.comments ?? 0, icon: FiMessageCircle },
    { label: "Eventos", value: t?.events ?? 0, icon: FiCalendar },
    { label: "Matrículas", value: t?.enrollments ?? 0, icon: FiTrendingUp },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Dados em tempo real</p>
          <h1 className="font-display text-3xl font-semibold text-cream md:text-4xl">
            Analytics
          </h1>
        </div>
        <div className="flex gap-1 rounded-full border border-cream/10 bg-iron-950/50 p-1">
          {ranges.map((r) => (
            <button
              key={r.k}
              onClick={() => setRange(r.k)}
              className={`rounded-full px-4 py-1.5 font-mono text-xs transition-colors ${
                range === r.k ? "bg-molten text-iron-950" : "text-cream/50 hover:text-cream"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* totals */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="grad-border p-5">
            <c.icon className="mb-3 text-ember-400" size={18} />
            <div className="font-display text-3xl font-semibold text-cream">
              {loading ? (
                <span className="text-cream/30">—</span>
              ) : (
                <AnimatedNumber value={c.value} suffix={c.suffix} />
              )}
            </div>
            <div className="mt-1 text-sm text-cream/50">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassPanel
          title="Crescimento de usuários"
          className="lg:col-span-2"
          action={<span className="font-mono text-xs text-cream/45">{ranges.find((r) => r.k === range)?.label}</span>}
        >
          {data && data.signups.length > 0 ? (
            <AreaChart data={data.signups} formatValue={(v) => `${v} usuários`} />
          ) : (
            <div className="flex h-56 items-center justify-center text-sm text-cream/40">
              Sem dados no período.
            </div>
          )}
        </GlassPanel>

        <GlassPanel title="Cursos mais assistidos">
          {data && data.topCourses.length > 0 ? (
            <BarChart
              data={data.topCourses.map((c) => ({
                label: c.title.length > 8 ? c.title.slice(0, 8) + "…" : c.title,
                value: c.enrollments,
              }))}
              formatValue={(v) => `${v}`}
            />
          ) : (
            <div className="flex h-56 items-center justify-center text-sm text-cream/40">
              Sem matrículas ainda.
            </div>
          )}
        </GlassPanel>
      </div>
    </div>
  );
}

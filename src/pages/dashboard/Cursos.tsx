import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLock, FiPlay, FiStar, FiUsers, FiZap } from "react-icons/fi";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ApiCourse {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  level: string;
  price: number;
  isFree: boolean;
  ratingAvg: number;
  studentsCount: number;
  category?: { name: string } | null;
}

const levelLabels: Record<string, string> = {
  BEGINNER: "Iniciante",
  INTERMEDIATE: "Intermediário",
  ADVANCED: "Avançado",
};

export function Cursos() {
  const call = useApi();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isPro = user?.plan === "PRO" || user?.role === "ADMIN";
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    call<{ items: ApiCourse[] }>("/courses?perPage=24")
      .then((r) => setCourses(r.items))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [call]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Catálogo</p>
          <h1 className="font-display text-3xl font-semibold text-cream md:text-4xl">
            Cursos
          </h1>
        </div>
        {!isPro && (
          <Link to="/painel/perfil">
            <Button size="sm">
              <FiZap /> Desbloquear tudo com PRO
            </Button>
          </Link>
        )}
      </div>

      {!isPro && (
        <div className="grad-border flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-molten text-iron-950">
              <FiZap size={20} />
            </div>
            <div>
              <div className="font-medium text-cream">Você está no plano grátis</div>
              <div className="text-sm text-cream/55">
                Cursos gratuitos liberados. Assine o PRO para acessar todo o catálogo.
              </div>
            </div>
          </div>
          <Link to="/painel/perfil">
            <Button size="sm" variant="outline">Ver planos</Button>
          </Link>
        </div>
      )}

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-52 animate-pulse rounded-2xl bg-cream/5" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="grad-border py-20 text-center text-cream/50">
          Nenhum curso publicado ainda.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c, i) => {
            const locked = !isPro && !c.isFree;
            return (
              <motion.article
                key={c.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() =>
                  navigate(locked ? "/painel/perfil" : `/painel/curso/${c.slug}`)
                }
                className="grad-border group relative flex cursor-pointer flex-col overflow-hidden p-5"
              >
                <div className="relative mb-4 flex h-28 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-iron-800 to-iron-950">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(232,133,4,0.25),transparent_60%)]" />
                  <span className="font-display text-4xl font-bold text-molten">
                    {c.title[0]}
                  </span>
                  {locked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-iron-950/60 backdrop-blur-[2px]">
                      <FiLock className="text-cream/80" size={24} />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-widest text-cream/45">
                  <span>{c.category?.name ?? "Geral"}</span>
                  <span className="h-1 w-1 rounded-full bg-cream/25" />
                  <span>{levelLabels[c.level] ?? c.level}</span>
                </div>
                <h3 className="mt-1.5 font-display text-lg font-semibold leading-tight text-cream">
                  {c.title}
                </h3>

                <div className="mt-auto flex items-center justify-between pt-5">
                  <div className="flex items-center gap-3 font-mono text-xs text-cream/50">
                    <span className="inline-flex items-center gap-1 text-ember-300">
                      <FiStar size={11} fill="currentColor" /> {c.ratingAvg.toFixed(1)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <FiUsers size={11} /> {c.studentsCount}
                    </span>
                  </div>
                  <button
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                      locked
                        ? "border border-cream/15 text-cream/50"
                        : "bg-molten text-iron-950 hover:shadow-glow",
                    )}
                  >
                    {locked ? (
                      <>
                        <FiLock size={12} /> PRO
                      </>
                    ) : (
                      <>
                        <FiPlay size={12} /> Assistir
                      </>
                    )}
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </div>
  );
}

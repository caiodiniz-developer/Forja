import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { LogoMark, LogoFull } from "@/components/common/Logo";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

const stats = [
  ["48k+", "devs forjados"],
  ["200+", "cursos"],
  ["4.9", "nota média"],
];

/** Editorial split-screen: a solid forge panel with a large wordmark + the form. */
export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* ---------------- brand panel ---------------- */}
      <aside className="relative hidden overflow-hidden bg-iron-950 lg:flex lg:flex-col">
        {/* oversized ambient wordmark */}
        <span className="pointer-events-none absolute -bottom-16 -left-6 select-none font-display text-[15rem] font-bold leading-none tracking-tighter text-cream/[0.035]">
          FORJA
        </span>
        {/* one quiet static warm corner (not a floating blob) */}
        <div className="pointer-events-none absolute right-0 top-0 h-[380px] w-[380px] bg-[radial-gradient(circle_at_top_right,rgba(210,78,1,0.18),transparent_65%)]" />
        {/* molten seam on the trailing edge */}
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-ember-500/60 to-transparent" />

        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <Link to="/" className="w-fit">
            <LogoFull className="w-36 transition-transform hover:scale-105" />
          </Link>

          <div className="max-w-md">
            <div className="mb-6 h-px w-16 bg-ember-500" />
            <h2 className="font-display text-4xl font-semibold leading-[1.08] text-cream xl:text-[3.25rem]">
              Conhecimento não se assiste.{" "}
              <span className="text-ember-400">Ele se forja.</span>
            </h2>
            <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-cream/50">
              Trilhas guiadas, projetos reais e mentoria de quem constrói
              produtos em escala — da primeira linha de código à sua vaga.
            </p>
          </div>

          {/* spec-sheet stats */}
          <div className="flex divide-x divide-cream/10 border-t border-cream/10 pt-8">
            {stats.map(([v, l], i) => (
              <div key={l} className={i === 0 ? "pr-8" : "px-8"}>
                <div className="font-display text-2xl font-semibold text-cream">
                  {v}
                </div>
                <div className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-cream/40">
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ---------------- form panel ---------------- */}
      <main className="relative flex items-center justify-center bg-iron-900/30 px-6 py-12">
        <Link
          to="/"
          className="absolute left-6 top-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cream/45 transition-colors hover:text-cream"
        >
          <FiArrowLeft size={14} /> voltar
        </Link>

        <div className="w-full max-w-sm">
          <Link to="/" className="mb-10 flex w-fit items-center gap-2.5 lg:hidden">
            <LogoMark className="h-9 w-9" />
            <span className="font-display text-xl font-semibold text-cream">Forja</span>
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-semibold text-cream">
              {title}
            </h1>
            <p className="mt-2 text-cream/50">{subtitle}</p>
          </div>

          {children}

          <p className="mt-8 text-center text-sm text-cream/50">{footer}</p>
        </div>
      </main>
    </div>
  );
}

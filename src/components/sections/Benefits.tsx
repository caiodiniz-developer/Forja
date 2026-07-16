import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiPlay, FiCheck, FiArrowRight } from "react-icons/fi";
import { SectionHeading } from "@/components/common/SectionHeading";
import { LogoMark } from "@/components/common/Logo";

interface Feature {
  tag: string;
  title: string;
  short: string;
  long: string;
}

const features: Feature[] = [
  {
    tag: "Aprendizado",
    title: "Player de cinema",
    short: "Assista do jeito que preferir",
    long: "Velocidade ajustável, picture-in-picture, legendas, anotações com timestamp e “continue de onde parou” em qualquer dispositivo.",
  },
  {
    tag: "Inteligência",
    title: "Assistente de IA",
    short: "Uma mentoria que nunca dorme",
    long: "Tire dúvidas, gere resumos, quizzes e flashcards a partir da própria aula — respostas em segundos, treinadas no conteúdo.",
  },
  {
    tag: "Carreira",
    title: "Certificados verificáveis",
    short: "Prova real do seu progresso",
    long: "Cada conclusão gera um certificado com código único, QR Code e página pública de validação que empresas reconhecem.",
  },
  {
    tag: "Mentoria",
    title: "Revisão sênior",
    short: "Código avaliado por quem contrata",
    long: "Seus projetos revisados por engenheiros que já construíram produtos em escala — feedback que acelera anos de experiência.",
  },
  {
    tag: "Direção",
    title: "Trilhas de carreira",
    short: "Um caminho, não uma lista",
    long: "Do primeiro commit à sua vaga: uma sequência guiada que sempre mostra o próximo passo, sem você se perder no catálogo.",
  },
];

function Visual({ index }: { index: number }) {
  switch (index) {
    case 0: // player
      return (
        <div className="relative flex h-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-iron-800 to-iron-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(232,133,4,0.28),transparent_60%)]" />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-molten text-iron-950 shadow-glow">
            <FiPlay size={24} className="ml-1" fill="currentColor" />
            <span className="absolute inset-0 animate-ping rounded-full bg-ember-400/40" />
          </span>
          <div className="absolute bottom-5 left-5 right-5">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-cream/15">
              <div className="h-full w-2/3 rounded-full bg-molten" />
            </div>
          </div>
        </div>
      );
    case 1: // AI chat
      return (
        <div className="flex h-full flex-col justify-center gap-3 rounded-2xl bg-gradient-to-br from-iron-800 to-iron-950 p-6">
          <div className="max-w-[70%] self-start rounded-2xl rounded-tl-sm bg-cream/10 px-4 py-2.5 text-sm text-cream/80">
            Explica useMemo em 1 frase?
          </div>
          <div className="max-w-[80%] self-end rounded-2xl rounded-tr-sm bg-molten px-4 py-2.5 text-sm text-iron-950">
            Memoriza um cálculo caro e só refaz quando as dependências mudam. ⚡
          </div>
          <div className="max-w-[40%] self-start rounded-2xl rounded-tl-sm bg-cream/10 px-4 py-2.5">
            <span className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-pulse rounded-full bg-cream/50"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </span>
          </div>
        </div>
      );
    case 2: // certificate
      return (
        <div className="flex h-full items-center justify-center rounded-2xl bg-gradient-to-br from-iron-800 to-iron-950 p-6">
          <div className="w-full max-w-xs rounded-xl border-2 border-ember-500/40 bg-iron-950/60 p-5 text-center">
            <LogoMark className="mx-auto mb-3 h-10 w-10" />
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-ember-400">
              Certificado
            </p>
            <p className="mt-2 font-display text-sm text-cream">
              Forja certifica a conclusão da jornada
            </p>
            <p className="mt-3 font-mono text-[0.6rem] text-cream/40">
              #FORJA-4A9F2E · verificável
            </p>
          </div>
        </div>
      );
    case 3: // review / code
      return (
        <div className="flex h-full flex-col justify-center gap-1.5 rounded-2xl bg-gradient-to-br from-iron-800 to-iron-950 p-6 font-mono text-xs">
          <div className="rounded bg-red-500/10 px-3 py-1.5 text-red-300/80">
            - const data = fetch(url)
          </div>
          <div className="rounded bg-ember-500/10 px-3 py-1.5 text-ember-200">
            + const data = await fetch(url)
          </div>
          <div className="mt-2 flex items-start gap-2 rounded-lg bg-cream/5 px-3 py-2 text-cream/60">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-molten-soft text-[0.6rem] font-bold text-iron-950">
              BS
            </span>
            <span className="not-italic">
              Bom! Trate o erro com try/catch aqui 👇
            </span>
          </div>
        </div>
      );
    default: // trilha / path
      return (
        <div className="flex h-full items-center justify-center rounded-2xl bg-gradient-to-br from-iron-800 to-iron-950 p-6">
          <div className="relative flex flex-col gap-4 border-l-2 border-dashed border-ember-500/30 pl-6">
            {["Fundamentos", "Especialização", "Projetos reais", "Sua vaga"].map(
              (s, i) => (
                <div key={s} className="relative flex items-center gap-3">
                  <span
                    className={`absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full ${
                      i < 2 ? "bg-molten text-iron-950" : "border-2 border-ember-400/50 text-ember-400"
                    }`}
                  >
                    {i < 2 ? <FiCheck size={11} strokeWidth={3} /> : <span className="h-1.5 w-1.5 rounded-full bg-ember-400" />}
                  </span>
                  <span className="text-sm text-cream/80">{s}</span>
                </div>
              ),
            )}
          </div>
        </div>
      );
  }
}

export function Benefits() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setActive((a) => (a + 1) % features.length),
      4200,
    );
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section id="beneficios" className="relative py-28 md:py-36">
      <div className="container-forge">
        <SectionHeading
          eyebrow="Por que a Forja"
          title="Ferramentas afiadas para aprender rápido"
          highlight="afiadas"
          align="center"
          className="mb-16"
        />

        <div
          className="grid gap-8 lg:grid-cols-[1fr_1.15fr]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* list */}
          <div className="flex flex-col justify-center gap-1">
            {features.map((f, i) => {
              const on = i === active;
              return (
                <button
                  key={f.title}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className="group relative flex items-center gap-4 rounded-2xl px-4 py-4 text-left transition-colors"
                >
                  {on && (
                    <motion.span
                      layoutId="feat-active"
                      className="absolute inset-0 rounded-2xl border border-ember-500/25 bg-ember-500/[0.07]"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span
                    className={`relative font-display text-2xl font-bold transition-colors ${
                      on ? "text-molten" : "text-cream/20 group-hover:text-cream/40"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="relative flex-1">
                    <span
                      className={`block font-display text-lg font-semibold transition-colors ${
                        on ? "text-cream" : "text-cream/60 group-hover:text-cream"
                      }`}
                    >
                      {f.title}
                    </span>
                    <span className="block text-sm text-cream/45">{f.short}</span>
                  </span>
                  <FiArrowRight
                    className={`relative shrink-0 transition-all ${
                      on ? "text-ember-400 opacity-100" : "-translate-x-2 opacity-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* preview */}
          <div className="grad-border relative overflow-hidden p-2">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-ember-600/15 blur-3xl" />
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex h-full flex-col p-5 md:p-6"
              >
                <span className="w-fit rounded-full border border-ember-500/25 bg-ember-500/10 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-ember-300">
                  {features[active].tag}
                </span>
                <h3 className="mt-4 font-display text-2xl font-semibold text-cream">
                  {features[active].title}
                </h3>
                <p className="mt-2 text-cream/60 leading-relaxed">
                  {features[active].long}
                </p>
                <div className="mt-5 min-h-[220px] flex-1">
                  <Visual index={active} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

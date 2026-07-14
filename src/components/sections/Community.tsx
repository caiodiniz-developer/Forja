import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiMessageCircle,
  FiCalendar,
  FiUsers,
} from "react-icons/fi";
import { Reveal } from "@/components/common/Reveal";
import { AnimatedNumber } from "@/components/dashboard/AnimatedNumber";
import { Button } from "@/components/ui/Button";

const perks = [
  { icon: FiMessageCircle, title: "Fóruns e chat ao vivo", body: "Dúvidas respondidas em minutos." },
  { icon: FiCalendar, title: "Eventos toda semana", body: "Lives, workshops e desafios." },
  { icon: FiUsers, title: "Rede de contratação", body: "Vagas exclusivas de parceiros." },
];

const chat = [
  { initials: "LP", name: "Lucas", msg: "consegui a vaga na Mercado Livre! 🎉", accent: true },
  { initials: "AB", name: "Ana", msg: "alguém topa revisar meu PR de hoje?" },
  { initials: "DF", name: "Diego", msg: "resolvi o desafio da semana, tá insano" },
];

export function Community() {
  return (
    <section id="comunidade" className="relative py-28 md:py-36">
      <div className="container-forge">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-cream/[0.08] bg-iron-900/40 p-8 md:p-14">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-ember-600/15 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-ember-700/10 blur-[100px]" />
            <div className="pointer-events-none absolute inset-0 bg-dots opacity-30" />

            <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center">
              {/* copy + stats */}
              <div>
                <p className="eyebrow mb-5">A brasa não queima sozinha</p>
                <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-cream md:text-5xl">
                  Uma comunidade de{" "}
                  <span className="text-molten">48 mil devs</span> forjando junto
                </h2>
                <p className="mt-5 max-w-md text-lg text-cream/60">
                  Aprender sozinho é lento. Aqui você entra numa rede ativa de
                  pessoas no mesmo caminho — trocando código, indicações e
                  oportunidades todos os dias.
                </p>

                <div className="mt-8 grid max-w-md grid-cols-3 gap-4">
                  {[
                    { value: 48, suffix: "k+", label: "membros" },
                    { value: 2341, label: "online agora" },
                    { value: 9, suffix: "k/dia", label: "mensagens" },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="font-display text-2xl font-semibold text-molten md:text-3xl">
                        <AnimatedNumber value={s.value} suffix={s.suffix} />
                      </div>
                      <div className="mt-1 font-mono text-[0.65rem] uppercase tracking-widest text-cream/45">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-9 flex flex-wrap gap-3">
                  <Button size="lg">
                    Entrar na comunidade
                    <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>

                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                  {perks.map((p) => {
                    const Icon = p.icon;
                    return (
                      <div key={p.title} className="flex items-center gap-2 text-sm text-cream/60">
                        <Icon size={15} className="text-ember-400" /> {p.title}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* live chat mock */}
              <div className="grad-border p-5">
                <div className="mb-4 flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
                    </span>
                    <span className="font-mono text-xs text-cream/60">
                      #geral · 2.341 online
                    </span>
                  </div>
                  <div className="flex -space-x-2">
                    {["MA", "RD", "CT", "BS"].map((a) => (
                      <span
                        key={a}
                        className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-iron-900 bg-molten-soft font-display text-[0.55rem] font-semibold text-iron-950"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {chat.map((c, i) => (
                    <motion.div
                      key={c.name}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15 + i * 0.15 }}
                      className="flex items-start gap-3"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-molten-soft font-display text-xs font-semibold text-iron-950">
                        {c.initials}
                      </span>
                      <div>
                        <span className="font-mono text-[0.7rem] text-cream/45">
                          {c.name}
                        </span>
                        <div
                          className={`mt-0.5 rounded-2xl rounded-tl-sm px-4 py-2 text-sm ${
                            c.accent
                              ? "bg-molten text-iron-950"
                              : "bg-cream/[0.06] text-cream/80"
                          }`}
                        >
                          {c.msg}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* typing */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 }}
                    className="flex items-center gap-3"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-iron-800 font-display text-xs text-cream/50">
                      +
                    </span>
                    <div className="flex gap-1 rounded-2xl rounded-tl-sm bg-cream/[0.06] px-4 py-3">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="h-1.5 w-1.5 animate-pulse rounded-full bg-cream/50"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

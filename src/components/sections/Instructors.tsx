import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowRight, FiLinkedin, FiGithub, FiUsers, FiBookOpen, FiStar } from "react-icons/fi";
import { SectionHeading } from "@/components/common/SectionHeading";
import { instructors } from "@/data/content";

export function Instructors() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const p = instructors[active];

  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setActive((a) => (a + 1) % instructors.length),
      4600,
    );
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section id="professores" className="relative py-28 md:py-36">
      <div className="container-forge">
        <SectionHeading
          eyebrow="Ferreiros-mestres"
          title="Quem conduz o fogo"
          highlight="fogo"
          description="Engenheiros e designers que construíram produtos usados por milhões — agora ensinando o que aprenderam sob pressão real."
          className="mb-14"
        />

        <div
          className="grid gap-8 lg:grid-cols-[1fr_1.15fr]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* list */}
          <div className="flex flex-col justify-center gap-1">
            {instructors.map((ins, i) => {
              const on = i === active;
              return (
                <button
                  key={ins.name}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className="group relative flex items-center gap-4 rounded-2xl px-4 py-4 text-left transition-colors"
                >
                  {on && (
                    <motion.span
                      layoutId="ins-active"
                      className="absolute inset-0 rounded-2xl border border-ember-500/25 bg-ember-500/[0.07]"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span
                    className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-display text-lg font-bold transition-all ${
                      on
                        ? "bg-molten text-iron-950 shadow-ember"
                        : "bg-iron-800 text-cream/50 group-hover:text-cream"
                    }`}
                  >
                    {ins.initials}
                  </span>
                  <span className="relative flex-1">
                    <span
                      className={`block font-display text-lg font-semibold transition-colors ${
                        on ? "text-cream" : "text-cream/60 group-hover:text-cream"
                      }`}
                    >
                      {ins.name}
                    </span>
                    <span className="block font-mono text-[0.7rem] uppercase tracking-widest text-ember-400/80">
                      {ins.focus}
                    </span>
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
          <div className="grad-border relative overflow-hidden">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-ember-600/15 blur-3xl" />
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex h-full flex-col p-7 md:p-8"
              >
                <div className="flex items-center gap-5">
                  <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-iron-800 to-iron-950">
                    <span className="font-display text-3xl font-bold text-molten">
                      {p.initials}
                    </span>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(232,133,4,0.3),transparent_60%)]" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-cream">
                      {p.name}
                    </h3>
                    <p className="text-cream/55">{p.role}</p>
                    <div className="mt-1 flex gap-2">
                      {[FiLinkedin, FiGithub].map((Icon, i) => (
                        <span
                          key={i}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-cream/5 text-cream/60 transition-colors hover:text-ember-300"
                        >
                          <Icon size={13} />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="mt-6 leading-relaxed text-cream/70">{p.bio}</p>

                <div className="mt-auto grid grid-cols-3 gap-3 pt-7">
                  {[
                    { icon: FiUsers, label: "alunos", value: p.students },
                    { icon: FiBookOpen, label: "cursos", value: String(p.courses) },
                    { icon: FiStar, label: "avaliação", value: "4.9" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-2xl border border-cream/[0.07] bg-iron-950/40 p-4"
                    >
                      <s.icon className="mb-2 text-ember-400" size={16} />
                      <div className="font-display text-xl font-semibold text-cream">
                        {s.value}
                      </div>
                      <div className="font-mono text-[0.65rem] text-cream/45">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

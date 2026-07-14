import { FiArrowRight, FiClock, FiBookOpen } from "react-icons/fi";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Reveal } from "@/components/common/Reveal";
import { Button } from "@/components/ui/Button";
import { formations } from "@/data/landing";
import { cn } from "@/lib/utils";

/** The signature section: specialization tracks (Formações). */
export function Journey() {
  return (
    <section id="trilhas" className="relative py-28 md:py-36">
      {/* ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-[70%] -translate-x-1/2 rounded-full bg-ember-700/10 blur-[120px]" />

      <div className="container-forge relative">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Trilhas de carreira"
            title="Escolha sua formação e siga um caminho, não uma lista"
            highlight="formação"
            description="Cada trilha é uma sequência pensada por engenheiros sênior: você sempre sabe o próximo passo, do fundamento ao nível de mercado."
          />
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-6">
          {formations.map((f, i) => {
            const Icon = f.icon;
            const wide = f.highlight;
            return (
              <Reveal
                key={f.id}
                delay={i * 0.06}
                className={cn(wide ? "lg:col-span-3" : "lg:col-span-3", i >= 2 && "lg:col-span-2")}
              >
                <article
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-3xl border p-8 transition-all duration-300 hover:-translate-y-1",
                    wide
                      ? "border-ember-500/40 bg-gradient-to-br from-iron-850 to-iron-950 shadow-ember"
                      : "border-cream/[0.07] bg-iron-900/40 hover:border-ember-500/35",
                  )}
                >
                  {wide && (
                    <span className="absolute right-6 top-6 rounded-full bg-molten px-3 py-1 font-mono text-[0.65rem] font-semibold uppercase tracking-widest text-iron-950">
                      mais procurada
                    </span>
                  )}

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-ember-500/25 bg-ember-500/10 text-ember-300 transition-colors duration-300 group-hover:bg-molten group-hover:text-iron-950">
                    <Icon size={26} />
                  </div>

                  <h3 className="mt-6 font-display text-2xl font-semibold text-cream">
                    {f.title}
                  </h3>
                  <p className="mt-2 max-w-md text-cream/55 leading-relaxed">
                    {f.description}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-cream/50">
                    <span className="inline-flex items-center gap-1.5">
                      <FiBookOpen size={13} /> {f.courses} cursos
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <FiClock size={13} /> {f.hours}h
                    </span>
                    <span className="rounded-full border border-cream/10 px-2.5 py-0.5 text-ember-300">
                      {f.levelRange}
                    </span>
                  </div>

                  <div className="mt-auto pt-7">
                    <span className="inline-flex items-center gap-2 font-medium text-cream transition-colors group-hover:text-ember-300">
                      Explorar trilha
                      <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <Button variant="outline" size="lg">
            Ver todas as trilhas
            <FiArrowRight />
          </Button>
        </div>
      </div>
    </section>
  );
}

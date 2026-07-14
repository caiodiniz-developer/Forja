import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@/hooks/useGSAP";
import { SectionHeading } from "@/components/common/SectionHeading";

const stats = [
  { k: "48.320", v: "alunos ativos" },
  { k: "1.240", v: "horas de conteúdo" },
  { k: "92%", v: "conclusão de trilha" },
  { k: "37 dias", v: "média p/ 1ª contratação" },
];

export function About() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>("[data-stat]").forEach((el) => {
      const num = el.querySelector("[data-num]");
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        },
      );
      if (num) {
        gsap.fromTo(
          num,
          { scale: 0.9 },
          {
            scale: 1,
            duration: 1,
            ease: "back.out(2)",
            scrollTrigger: { trigger: el, start: "top 88%" },
          },
        );
      }
    });
  }, []);

  return (
    <section id="sobre" className="relative py-28 md:py-36">
      <div className="container-forge" ref={ref}>
        <div className="grid gap-14 lg:grid-cols-2 lg:items-end">
          <SectionHeading
            eyebrow="A plataforma"
            title="Uma escola construída como uma fornalha"
            highlight="fornalha"
            description="Não acreditamos em maratonar vídeo. Acreditamos em pressão, repetição e temperatura certa: você aprende fazendo, sob a mentoria de quem já construiu produtos em escala. Cada trilha endurece uma habilidade real até ela virar aço."
          />

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-cream/10 bg-cream/5">
            {stats.map((s) => (
              <div
                key={s.v}
                data-stat
                className="group relative bg-iron-900/60 p-7 transition-colors hover:bg-iron-850"
              >
                <div
                  data-num
                  className="font-display text-4xl font-semibold text-molten md:text-5xl"
                >
                  {s.k}
                </div>
                <div className="mt-2 font-mono text-xs uppercase tracking-widest text-cream/50">
                  {s.v}
                </div>
                <div className="absolute right-5 top-5 h-1.5 w-1.5 rounded-full bg-ember-500/0 transition-colors group-hover:bg-ember-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

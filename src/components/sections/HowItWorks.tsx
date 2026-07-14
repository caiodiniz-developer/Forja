import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@/hooks/useGSAP";
import { SectionHeading } from "@/components/common/SectionHeading";
import { steps } from "@/data/content";

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // draw the connecting heat line as you scroll
    gsap.fromTo(
      "[data-line]",
      { scaleX: 0 },
      {
        scaleX: 1,
        transformOrigin: "left",
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 60%",
          end: "bottom 70%",
          scrub: 1,
        },
      },
    );
    gsap.utils.toArray<HTMLElement>("[data-step]").forEach((el, i) => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 50 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        },
      );
    });
  }, []);

  return (
    <section id="como-funciona" className="relative py-28 md:py-36">
      <div className="container-forge" ref={ref}>
        <SectionHeading
          eyebrow="Como funciona"
          title="Da matéria bruta ao aço temperado"
          highlight="temperado"
          description="Quatro estágios, o mesmo princípio de uma forja: calor, forma e resistência."
          align="center"
          className="mb-20"
        />

        <div className="relative">
          {/* connector line (desktop) */}
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-cream/10 lg:block">
            <div
              data-line
              className="h-full w-full bg-gradient-to-r from-ember-800 via-ember-500 to-ember-200"
            />
          </div>

          <div className="grid gap-10 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} data-step className="relative">
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-ember-500/30 bg-iron-900 font-display text-xl font-semibold text-molten shadow-ember">
                  {s.n}
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold text-cream">
                  {s.title}
                </h3>
                <p className="mt-3 text-cream/55 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

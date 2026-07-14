import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@/hooks/useGSAP";
import { impact } from "@/data/landing";

/** Bold impact-numbers band, Rocketseat-style. */
export function Numbers() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>("[data-num]").forEach((el, i) => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 80%" },
        },
      );
    });
  }, []);

  return (
    <section className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-50" />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-ember-500/20 to-transparent" />

      <div className="container-forge relative" ref={ref}>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {impact.map((s) => (
            <div key={s.label} data-num className="text-center">
              <div className="bg-molten bg-clip-text font-display text-6xl font-bold tracking-tight text-transparent md:text-7xl">
                {s.value}
              </div>
              <div className="mt-3 font-display text-lg font-semibold text-cream">
                {s.label}
              </div>
              <div className="mt-1 font-mono text-xs text-cream/45">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

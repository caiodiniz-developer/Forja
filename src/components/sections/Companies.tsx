import { companies } from "@/data/content";

/** Infinite marquee of hiring partners. Pure CSS translate, duplicated track. */
export function Companies() {
  const row = [...companies, ...companies];
  return (
    <section id="empresas" className="border-y border-cream/5 py-14">
      <div className="container-forge">
        <p className="text-center font-mono text-xs uppercase tracking-[0.3em] text-cream/40">
          Onde nossos alunos foram forjar carreira
        </p>
      </div>
      <div className="relative mt-8 overflow-hidden mask-fade-x">
        <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-16 pr-16">
          {row.map((c, i) => (
            <span
              key={i}
              className="whitespace-nowrap font-display text-2xl font-medium text-cream/35 transition-colors hover:text-ember-300 md:text-3xl"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

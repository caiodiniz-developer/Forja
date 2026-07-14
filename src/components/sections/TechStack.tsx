import { technologies, type Tech } from "@/data/landing";

function Pill({ t }: { t: Tech }) {
  const Icon = t.icon;
  return (
    <div className="group flex items-center gap-3 rounded-2xl border border-cream/[0.07] bg-iron-900/40 px-5 py-3.5 transition-colors duration-300 hover:border-ember-500/35 hover:bg-iron-900/70">
      <Icon
        size={26}
        className="text-cream/45 transition-colors duration-300 group-hover:text-ember-400"
      />
      <span className="whitespace-nowrap font-mono text-sm text-cream/55 transition-colors group-hover:text-cream/85">
        {t.name}
      </span>
    </div>
  );
}

/** Two rows of tech drifting in opposite directions — a living logo cloud. */
export function TechStack() {
  const rowA = [...technologies, ...technologies];
  const rowB = [...technologies.slice().reverse(), ...technologies.slice().reverse()];

  return (
    <section className="relative py-24">
      <div className="container-forge">
        <p className="mb-12 text-center font-mono text-xs uppercase tracking-[0.28em] text-ember-500">
          As tecnologias que você vai forjar
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative overflow-hidden mask-fade-x">
          <div className="flex w-max animate-[marquee_36s_linear_infinite] gap-4 pr-4">
            {rowA.map((t, i) => (
              <Pill key={`a-${i}`} t={t} />
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden mask-fade-x">
          <div className="flex w-max animate-[marquee_44s_linear_infinite] gap-4 pr-4 [animation-direction:reverse]">
            {rowB.map((t, i) => (
              <Pill key={`b-${i}`} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { FiCheck } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Reveal } from "@/components/common/Reveal";
import { Button } from "@/components/ui/Button";
import { plans } from "@/data/content";
import { cn } from "@/lib/utils";

export function Pricing() {
  const navigate = useNavigate();
  return (
    <section id="planos" className="relative py-28 md:py-36">
      <div className="container-forge">
        <SectionHeading
          eyebrow="Planos"
          title="Escolha a temperatura do seu progresso"
          highlight="temperatura"
          align="center"
          description="Comece de graça. Suba o fogo quando quiser. Cancele quando quiser."
          className="mb-16"
        />

        <div className="grid gap-6 lg:grid-cols-3 lg:items-center">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.08}>
              <div
                className={cn(
                  "relative flex h-full flex-col overflow-hidden rounded-3xl border p-8 transition-transform duration-300",
                  plan.featured
                    ? "border-ember-500/50 bg-iron-900 shadow-glow-lg lg:-translate-y-4 lg:scale-[1.03]"
                    : "border-cream/10 bg-iron-900/50 hover:border-ember-500/30",
                )}
              >
                {plan.featured && (
                  <>
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(232,133,4,0.25),transparent_70%)]" />
                    <span className="absolute right-6 top-6 rounded-full bg-molten px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-iron-950">
                      mais forjado
                    </span>
                  </>
                )}

                <div className="relative font-mono text-xs uppercase tracking-[0.2em] text-ember-400">
                  {plan.name}
                </div>
                <div className="relative mt-4 flex items-end gap-2">
                  <span className="font-display text-5xl font-semibold text-cream">
                    {plan.price}
                  </span>
                  <span className="mb-1.5 font-mono text-xs text-cream/45">
                    {plan.period}
                  </span>
                </div>
                <p className="relative mt-3 text-cream/60">{plan.tagline}</p>

                <ul className="relative mt-8 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-cream/75">
                      <span
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                          plan.featured
                            ? "bg-molten text-iron-950"
                            : "bg-ember-500/15 text-ember-300",
                        )}
                      >
                        <FiCheck size={12} strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="relative mt-8 pt-2">
                  <Button
                    variant={plan.featured ? "primary" : "outline"}
                    className="w-full"
                    onClick={() => navigate("/register")}
                  >
                    {plan.price === "R$ 0" ? "Criar conta grátis" : "Assinar agora"}
                  </Button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Reveal } from "@/components/common/Reveal";
import { Button } from "@/components/ui/Button";

export function Cta() {
  const navigate = useNavigate();
  return (
    <section className="relative py-28 md:py-36">
      <div className="container-forge">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-ember-500/30 bg-gradient-to-br from-iron-900 to-iron-950 px-8 py-20 text-center md:px-16">
            {/* optional background video — drop your file at /public/cta.mp4 */}
            <video
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src="/cta.mp4" type="video/mp4" />
            </video>
            {/* animated molten gradient (also the graceful fallback with no video) */}
            <div className="pointer-events-none absolute inset-0 animate-gradient-pan bg-[length:220%_220%] bg-gradient-to-br from-ember-900/20 via-transparent to-ember-700/15" />

            {/* molten core glow */}
            <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-molten opacity-40 blur-[100px]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,133,4,0.12),transparent_65%)]" />

            <div className="relative">
              <p className="eyebrow mb-6">O metal está quente</p>
              <h2 className="mx-auto max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-cream md:text-6xl">
                Seu próximo nível não vai{" "}
                <span className="text-molten">se forjar sozinho</span>.
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg text-cream/60">
                Crie sua conta grátis hoje e comece pela primeira trilha. Sem
                cartão, sem promessa vazia — só prática de verdade.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" onClick={() => navigate("/register")}>
                  Começar a forjar agora
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="outline" size="lg">
                  Falar com o time
                </Button>
              </div>
              <p className="mt-6 font-mono text-xs text-cream/40">
                15 dias de garantia · cancele quando quiser
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

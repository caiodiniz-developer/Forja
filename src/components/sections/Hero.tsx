import { lazy, Suspense, useRef } from "react";
import { FiArrowRight, FiPlay, FiStar, FiCheck } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@/hooks/useGSAP";
import { useMousePosition } from "@/hooks/useMousePosition";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

// Code-split the heavy Three.js scene out of the initial bundle.
const ForgeScene = lazy(() =>
  import("@/components/three/ForgeScene").then((m) => ({
    default: m.ForgeScene,
  })),
);

const avatars = ["MA", "RD", "CT", "BS", "LP"];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { nx, ny } = useMousePosition();
  const navigate = useNavigate();

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.from("[data-hero-badge]", { y: 20, autoAlpha: 0, duration: 0.7 })
      .from(
        "[data-hero-line] > span > span",
        { yPercent: 120, autoAlpha: 0, duration: 1, stagger: 0.1 },
        "-=0.3",
      )
      .from("[data-hero-sub]", { y: 24, autoAlpha: 0, duration: 0.8 }, "-=0.6")
      .from(
        "[data-hero-cta]",
        { y: 24, autoAlpha: 0, duration: 0.7, stagger: 0.1 },
        "-=0.5",
      )
      .from("[data-hero-proof]", { y: 20, autoAlpha: 0, duration: 0.8 }, "-=0.4")
      .from(
        "[data-hero-panel]",
        { y: 40, autoAlpha: 0, duration: 1 },
        "-=0.7",
      );
  }, []);

  return (
    <section
      id="topo"
      ref={root}
      className="relative flex min-h-[calc(100svh-6rem)] items-center overflow-hidden py-16 md:py-20"
    >
      {/* ---------- layered background stack ---------- */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 1. background video (/public/hero.mp4) */}
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-45"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* 2. animated molten gradient (also the graceful fallback with no video) */}
        <div className="absolute inset-0 animate-gradient-pan bg-[length:220%_220%] bg-gradient-to-br from-ember-900/25 via-transparent to-ember-700/15" />

        {/* 3. subdued 3D forge ambience (kept light so the video reads) */}
        <div className="absolute inset-0 opacity-30">
          <Suspense
            fallback={
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-72 w-72 animate-pulse-glow rounded-full bg-molten opacity-40 blur-[90px]" />
              </div>
            }
          >
            <ForgeScene />
          </Suspense>
        </div>

        {/* 4. grid + vignette for depth and readability */}
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-iron-950/70 via-iron-950/20 to-iron-950" />
      </div>

      <div className="container-forge relative z-10 grid items-center gap-14 lg:grid-cols-12">
        {/* ---------- copy ---------- */}
        <div className="lg:col-span-7">
          <div data-hero-badge>
            <Badge dot>Plataforma nº 1 em carreira dev no Brasil</Badge>
          </div>

          <h1
            data-hero-line
            className="mt-6 font-display text-[3.1rem] font-semibold leading-[0.98] tracking-tight text-cream sm:text-6xl lg:text-[4.6rem]"
          >
            <span className="block overflow-hidden pb-2">
              <span className="block">Domine o que o mercado</span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span className="block">de tecnologia exige e</span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span className="block text-molten">forje uma carreira sênior.</span>
            </span>
          </h1>

          <p
            data-hero-sub
            className="mt-7 max-w-xl text-lg leading-relaxed text-cream/60"
          >
            Trilhas guiadas, projetos reais e mentoria de quem constrói produtos
            em escala. Da primeira linha de código à sua vaga na área — tudo em
            um só caminho.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <div data-hero-cta>
              <Button size="lg" onClick={() => navigate("/register")}>
                Começar agora
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            <div data-hero-cta>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  document
                    .getElementById("trilhas")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <FiPlay />
                Ver trilhas
              </Button>
            </div>
          </div>

          {/* social proof */}
          <div
            data-hero-proof
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {avatars.map((a, i) => (
                  <span
                    key={i}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-iron-950 bg-molten-soft font-display text-sm font-semibold text-iron-950"
                  >
                    {a}
                  </span>
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1 text-ember-300">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <FiStar key={s} size={13} fill="currentColor" />
                  ))}
                  <span className="ml-1 font-semibold text-cream">4.9</span>
                </div>
                <span className="text-cream/50">
                  <strong className="font-semibold text-cream/80">+48 mil</strong>{" "}
                  devs já forjaram carreira
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- product panel ---------- */}
        <div className="relative hidden lg:col-span-5 lg:block">
          <div
            data-hero-panel
            className="glass relative rounded-3xl p-4 shadow-glow-lg"
            style={{ transform: `translate(${nx * 8}px, ${ny * 8}px)` }}
          >
            {/* fake player */}
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-iron-800 to-iron-950">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(232,133,4,0.28),transparent_60%)]" />
              <button className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-molten text-iron-950 shadow-glow transition-transform hover:scale-110">
                <FiPlay size={24} className="ml-1" fill="currentColor" />
                <span className="absolute inset-0 animate-ping rounded-full bg-ember-400/40" />
              </button>
              <span className="absolute bottom-3 left-3 rounded-md bg-iron-950/70 px-2 py-1 font-mono text-[0.65rem] text-cream/80 backdrop-blur">
                12:48
              </span>
              <span className="absolute right-3 top-3 rounded-md bg-molten px-2 py-1 font-mono text-[0.65rem] font-semibold text-iron-950">
                AO VIVO
              </span>
            </div>

            {/* lesson meta */}
            <div className="px-2 pb-1 pt-4">
              <div className="font-mono text-[0.7rem] uppercase tracking-widest text-ember-400">
                Módulo 06 · Arquitetura
              </div>
              <div className="mt-1 font-display text-lg font-semibold text-cream">
                Escalando APIs com filas e cache
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-cream/10">
                <div className="h-full w-2/3 rounded-full bg-molten" />
              </div>
              <div className="mt-2 flex items-center justify-between font-mono text-[0.7rem] text-cream/45">
                <span>67% concluído</span>
                <span>8 de 12 aulas</span>
              </div>
            </div>
          </div>

          {/* floating certificate chip */}
          <div
            className="glass absolute -bottom-6 -left-6 flex items-center gap-3 rounded-2xl p-4 shadow-ember"
            style={{ transform: `translate(${nx * -16}px, ${ny * -16}px)` }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-molten text-iron-950">
              <FiCheck size={20} strokeWidth={3} />
            </div>
            <div>
              <div className="text-sm font-semibold text-cream">
                Certificado emitido
              </div>
              <div className="font-mono text-[0.7rem] text-cream/50">
                verificável · #4A9F2E
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* scroll indicator */}
      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-cream/40">
          role
        </span>
        <span className="flex h-10 w-6 items-start justify-center rounded-full border border-cream/20 p-1.5">
          <span className="h-2 w-1 animate-bounce rounded-full bg-ember-400" />
        </span>
      </div>
    </section>
  );
}

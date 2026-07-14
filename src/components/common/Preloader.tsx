import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@/hooks/useGSAP";

/** Full-screen intro: the forge mark ignites, a molten bar fills, then it lifts to reveal the page. */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDone(true);
      return;
    }

    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        document.body.style.overflow = "";
        setDone(true);
      },
    });

    tl.from("[data-pre-mark]", { scale: 0.6, autoAlpha: 0, duration: 0.6 })
      .from(
        "[data-pre-word] span",
        { yPercent: 120, autoAlpha: 0, stagger: 0.06, duration: 0.6 },
        "-=0.2",
      )
      .to("[data-pre-bar]", { scaleX: 1, duration: 1.1, ease: "power2.inOut" }, "-=0.3")
      .to("[data-pre-count]", { textContent: 100, duration: 1.1, snap: { textContent: 1 } }, "<")
      .to("[data-pre-mark], [data-pre-word], [data-pre-progress]", {
        autoAlpha: 0,
        y: -20,
        duration: 0.4,
      })
      .to(root.current, {
        yPercent: -100,
        duration: 0.8,
        ease: "power4.inOut",
      });
  }, []);

  if (done) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-iron-950"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-molten opacity-20 blur-[100px]" />

      <div className="relative flex flex-col items-center">
        <div
          data-pre-mark
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-molten shadow-glow"
        >
          <span className="font-display text-3xl font-bold text-iron-950">F</span>
        </div>

        <div data-pre-word className="mt-6 overflow-hidden">
          <span className="block font-display text-5xl font-semibold tracking-tight text-cream">
            {"Forja".split("").map((c, i) => (
              <span key={i} className="inline-block">
                {c}
              </span>
            ))}
          </span>
        </div>

        <div data-pre-progress className="mt-10 flex items-center gap-4">
          <div className="h-[3px] w-56 overflow-hidden rounded-full bg-cream/10">
            <div
              data-pre-bar
              className="h-full w-full origin-left scale-x-0 rounded-full bg-molten"
            />
          </div>
          <span className="font-mono text-xs text-cream/50">
            <span data-pre-count>0</span>%
          </span>
        </div>
      </div>
    </div>
  );
}

import { useRef } from "react";
import { FiStar } from "react-icons/fi";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@/hooks/useGSAP";
import { SectionHeading } from "@/components/common/SectionHeading";
import { testimonials, type Testimonial } from "@/data/content";

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="flex w-[320px] shrink-0 flex-col rounded-3xl border border-cream/10 bg-iron-900/60 p-7 md:w-[420px]">
      <div className="mb-4 flex gap-1 text-ember-400">
        {Array.from({ length: 5 }).map((_, s) => (
          <FiStar key={s} size={14} fill="currentColor" />
        ))}
      </div>
      <blockquote className="flex-1 font-display text-lg leading-snug text-cream/90 md:text-xl">
        “{t.quote}”
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-molten-soft font-display font-semibold text-iron-950">
          {t.initials}
        </span>
        <span>
          <span className="block font-semibold text-cream">{t.name}</span>
          <span className="block font-mono text-xs text-cream/45">{t.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

/** The testimonial wall glides sideways as you scroll the page (scroll-linked). */
export function Testimonials() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  // duplicated so there's plenty of horizontal travel
  const row = [...testimonials, ...testimonials, ...testimonials];

  useGSAP(() => {
    const el = track.current;
    const sec = section.current;
    if (!el || !sec) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const amount = () =>
      Math.max(0, el.scrollWidth - (el.parentElement?.clientWidth ?? window.innerWidth));

    gsap.to(el, {
      x: () => -amount(),
      ease: "none",
      scrollTrigger: {
        trigger: sec,
        start: "top 80%",
        end: "bottom top",
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    // Recalculate once fonts/layout settle so the distance is correct.
    const r1 = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    const r2 = window.setTimeout(() => ScrollTrigger.refresh(), 1200);
    return () => {
      window.clearTimeout(r1);
      window.clearTimeout(r2);
    };
  }, []);

  return (
    <section ref={section} id="depoimentos" className="relative py-28 md:py-36">
      <div className="container-forge">
        <SectionHeading
          eyebrow="Prova de fogo"
          title="Histórias que saíram da fornalha"
          highlight="fornalha"
          description="Role a página e deslize pelas histórias de quem forjou a carreira aqui."
          className="mb-14"
        />
      </div>

      <div className="overflow-hidden mask-fade-x">
        <div ref={track} className="flex gap-6 pl-6 will-change-transform">
          {row.map((t, i) => (
            <Card key={`${t.name}-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

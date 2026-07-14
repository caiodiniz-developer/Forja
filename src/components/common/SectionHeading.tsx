import { useRef } from "react";
import { useGSAP } from "@/hooks/useGSAP";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  /** word(s) inside the title to paint molten */
  highlight?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/** Reusable section header with a word-by-word GSAP reveal on the title. */
export function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const words = ref.current?.querySelectorAll("[data-word]");
    if (!words?.length) return;
    gsap.fromTo(
      words,
      { yPercent: 120, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power4.out",
        stagger: 0.05,
        scrollTrigger: { trigger: ref.current, start: "top 80%" },
      },
    );
  }, []);

  const renderTitle = () =>
    title.split(" ").map((word, i) => {
      const isHi = highlight
        ?.toLowerCase()
        .split(" ")
        .includes(word.toLowerCase().replace(/[.,]/g, ""));
      return (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em]">
          <span
            data-word
            className={cn("inline-block", isHi && "text-molten")}
          >
            {word}
            {i < title.split(" ").length - 1 && " "}
          </span>
        </span>
      );
    });

  return (
    <div
      ref={ref}
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-cream md:text-5xl lg:text-[3.4rem]">
        {renderTitle()}
      </h2>
      {description && (
        <p className="mt-5 text-base leading-relaxed text-cream/60 md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

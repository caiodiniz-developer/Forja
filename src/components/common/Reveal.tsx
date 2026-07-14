import { useRef } from "react";
import type { ElementType, ReactNode } from "react";
import { useGSAP } from "@/hooks/useGSAP";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** stagger delay in seconds */
  delay?: number;
  y?: number;
}

/** Generic scroll-triggered fade + rise. Reuse everywhere instead of re-writing GSAP. */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  y = 40,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { autoAlpha: 0, y },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        delay,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      },
    );
  }, []);

  return (
    <Tag ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </Tag>
  );
}

import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface CarouselProps {
  children: ReactNode;
  /** Tailwind basis classes controlling how many slides show per view. */
  slideClassName?: string;
  autoPlay?: boolean;
  interval?: number;
  ariaLabel?: string;
}

/** Scroll-snap carousel: native swipe/drag, prev/next controls, autoplay, progress dots. */
export function Carousel({
  children,
  slideClassName = "basis-full sm:basis-1/2 lg:basis-1/3",
  autoPlay = true,
  interval = 4500,
  ariaLabel = "carrossel",
}: CarouselProps) {
  const track = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const scrollToIndex = useCallback((i: number) => {
    const el = track.current;
    if (!el) return;
    const slide = el.children[i] as HTMLElement | undefined;
    if (slide) el.scrollTo({ left: slide.offsetLeft - el.offsetLeft, behavior: "smooth" });
  }, []);

  const go = useCallback(
    (dir: 1 | -1) => {
      const next = (active + dir + items.length) % items.length;
      setActive(next);
      scrollToIndex(next);
    },
    [active, items.length, scrollToIndex],
  );

  // keep the active dot in sync with manual scrolling / swiping
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const center = el.scrollLeft + el.clientWidth / 2;
        let closest = 0;
        let min = Infinity;
        Array.from(el.children).forEach((c, i) => {
          const child = c as HTMLElement;
          const mid = child.offsetLeft - el.offsetLeft + child.clientWidth / 2;
          const d = Math.abs(mid - center);
          if (d < min) {
            min = d;
            closest = i;
          }
        });
        setActive(closest);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!autoPlay || paused) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => go(1), interval);
    return () => clearInterval(id);
  }, [autoPlay, paused, interval, go]);

  return (
    <div
      className="relative"
      role="region"
      aria-label={ariaLabel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((child, i) => (
          <div key={i} className={cn("shrink-0 snap-start", slideClassName)}>
            {child}
          </div>
        ))}
      </div>

      {/* controls */}
      <div className="mt-8 flex items-center justify-between">
        <div className="flex gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setActive(i);
                scrollToIndex(i);
              }}
              aria-label={`Ir para o slide ${i + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === active ? "w-7 bg-molten" : "w-1.5 bg-cream/20 hover:bg-cream/40",
              )}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => go(-1)}
            aria-label="Anterior"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition-colors hover:border-ember-500/50 hover:bg-ember-500/10 hover:text-ember-300"
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Próximo"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition-colors hover:border-ember-500/50 hover:bg-ember-500/10 hover:text-ember-300"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

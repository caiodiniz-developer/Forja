import { FiClock, FiPlayCircle, FiStar } from "react-icons/fi";
import type { Course } from "@/data/content";
import { useRef, useState } from "react";

/** Interactive course card with pointer-tilt and heat glow. Reusable across catalog + landing. */
export function CourseCard({ course }: { course: Course }) {
  const Icon = course.icon;
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });

  const onMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({
      rx: (0.5 - py) * 8,
      ry: (px - 0.5) * 8,
      gx: px * 100,
      gy: py * 100,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 })}
      style={{
        transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
      }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-cream/10 bg-iron-900/70 p-6 transition-[border-color,box-shadow] duration-300 hover:border-ember-500/40 hover:shadow-glow"
    >
      {/* pointer-follow heat glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${tilt.gx}% ${tilt.gy}%, rgba(232,133,4,0.14), transparent 45%)`,
        }}
      />

      <div className="relative flex items-start justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-molten-soft text-iron-950 shadow-ember">
          <Icon size={24} />
        </div>
        <span className="font-mono text-xs text-ember-400">
          {course.temperature}
        </span>
      </div>

      <div className="relative mt-5 flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-widest text-cream/45">
        <span>{course.track}</span>
        <span className="h-1 w-1 rounded-full bg-cream/25" />
        <span>{course.level}</span>
      </div>

      <h3 className="relative mt-2 font-display text-2xl font-semibold leading-tight text-cream">
        {course.title}
      </h3>

      <div className="relative mt-auto pt-6">
        <div className="flex items-center gap-4 font-mono text-xs text-cream/50">
          <span className="inline-flex items-center gap-1.5">
            <FiClock size={13} /> {course.hours}h
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FiPlayCircle size={13} /> {course.lessons} aulas
          </span>
          <span className="inline-flex items-center gap-1.5 text-ember-300">
            <FiStar size={13} fill="currentColor" /> {course.rating.toFixed(1)}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-cream/10 pt-4">
          <span className="font-display text-xl font-semibold text-cream">
            {course.price === null ? (
              <span className="text-molten">Gratuito</span>
            ) : (
              `R$ ${course.price}`
            )}
          </span>
          <span className="translate-x-1 font-mono text-xs text-ember-400 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            forjar →
          </span>
        </div>
      </div>
    </div>
  );
}

import { useRef, useState } from "react";
import type { IconType } from "react-icons";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { AnimatedNumber } from "./AnimatedNumber";

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: IconType;
  trend?: string;
  delay?: number;
}

/** KPI tile: gradient-border glass, animated count-up, pointer-follow glow. */
export function StatCard({
  label,
  value,
  prefix,
  suffix,
  icon: Icon,
  trend,
  delay = 0,
}: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [glow, setGlow] = useState({ x: 50, y: 50, on: false });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setGlow({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
      on: true,
    });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={onMove}
      onMouseLeave={() => setGlow((g) => ({ ...g, on: false }))}
      className="grad-border group relative overflow-hidden p-5"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(340px circle at ${glow.x}% ${glow.y}%, rgba(232,133,4,0.16), transparent 45%)`,
        }}
      />
      <div className="relative flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-molten-soft text-iron-950 shadow-ember">
          <Icon size={20} />
        </div>
        {trend && (
          <span className="inline-flex items-center gap-1 rounded-full border border-ember-500/25 bg-ember-500/10 px-2.5 py-1 font-mono text-[0.65rem] text-ember-300">
            <FiArrowUpRight size={11} />
            {trend}
          </span>
        )}
      </div>

      <div className="relative mt-5">
        <div className="font-display text-3xl font-semibold tracking-tight text-cream">
          <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
        </div>
        <div className="mt-1 text-sm text-cream/50">{label}</div>
      </div>
    </motion.div>
  );
}

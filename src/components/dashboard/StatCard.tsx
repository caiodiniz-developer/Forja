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

/**
 * Editorial KPI tile: the number is the hero, the icon stays quiet, and a
 * molten rule under the figure grows on hover. No glowy icon boxes.
 */
export function StatCard({
  label,
  value,
  prefix,
  suffix,
  icon: Icon,
  trend,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-xl border border-cream/[0.08] bg-iron-900 p-5 transition-colors duration-300 hover:border-cream/[0.16]"
    >
      {/* header: label + quiet icon */}
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-cream/40">
          {label}
        </span>
        <Icon
          size={16}
          className="shrink-0 text-cream/25 transition-colors duration-300 group-hover:text-ember-400"
        />
      </div>

      {/* the figure */}
      <div className="mt-6 font-display text-[2.75rem] font-semibold leading-none tracking-tight text-cream">
        <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
      </div>

      {/* molten rule that grows on hover */}
      <div className="mt-4 h-px w-full bg-cream/[0.08]">
        <div className="h-px w-8 bg-molten transition-all duration-500 group-hover:w-20" />
      </div>

      {trend && (
        <div className="mt-3 inline-flex items-center gap-1 font-mono text-[0.65rem] text-ember-400/90">
          <FiArrowUpRight size={11} />
          {trend}
        </div>
      )}
    </motion.div>
  );
}

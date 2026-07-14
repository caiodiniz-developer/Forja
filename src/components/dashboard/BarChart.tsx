import { useState } from "react";
import { motion } from "framer-motion";

interface Bar {
  label: string;
  value: number;
}

interface BarChartProps {
  data: Bar[];
  height?: number;
  formatValue?: (v: number) => string;
}

/** Single-series magnitude bars: animated grow-in, rounded ends, hover value. */
export function BarChart({
  data,
  height = 220,
  formatValue = (v) => String(v),
}: BarChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value)) * 1.1;

  return (
    <div className="w-full" style={{ height }}>
      <div className="flex h-full items-end gap-2">
        {data.map((d, i) => {
          const pct = (d.value / max) * 100;
          const active = hover === i;
          return (
            <div
              key={d.label}
              className="group relative flex h-full flex-1 flex-col items-center justify-end"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              {/* value bubble on hover */}
              <div
                className={`mb-2 rounded-md border border-ember-500/30 bg-iron-950/90 px-2 py-0.5 font-mono text-[0.65rem] text-cream transition-all duration-200 ${
                  active ? "opacity-100" : "translate-y-1 opacity-0"
                }`}
              >
                {formatValue(d.value)}
              </div>

              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className={`w-full max-w-[46px] rounded-t-lg bg-gradient-to-t transition-colors ${
                  active
                    ? "from-ember-600 to-ember-300"
                    : "from-ember-800 to-ember-500"
                }`}
              />
              <span className="mt-2 font-mono text-[0.65rem] text-cream/40">
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

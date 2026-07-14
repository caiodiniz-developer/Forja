import { motion } from "framer-motion";

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  stroke?: number;
  children?: React.ReactNode;
}

/** Circular progress with an animated molten sweep. */
export function ProgressRing({
  progress,
  size = 132,
  stroke = 10,
  children,
}: ProgressRingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(progress, 100) / 100) * c;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d24e01" />
            <stop offset="60%" stopColor="#ec9006" />
            <stop offset="100%" stopColor="#f5c77e" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(245,199,126,0.1)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ring-grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}

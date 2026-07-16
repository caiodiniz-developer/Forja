import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Point {
  label: string;
  value: number;
}

interface AreaChartProps {
  data: Point[];
  height?: number;
  formatValue?: (v: number) => string;
}

const PAD = { top: 16, right: 12, bottom: 26, left: 12 };

/** Responsive single-series area chart: animated draw, recessive grid, hover crosshair. */
export function AreaChart({
  data,
  height = 240,
  formatValue = (v) => String(v),
}: AreaChartProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(600);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const max = Math.max(...data.map((d) => d.value)) * 1.15;
  const min = 0;
  const innerW = w - PAD.left - PAD.right;
  const innerH = height - PAD.top - PAD.bottom;

  const x = (i: number) => PAD.left + (i / (data.length - 1)) * innerW;
  const y = (v: number) =>
    PAD.top + innerH - ((v - min) / (max - min)) * innerH;

  const line = data.map((d, i) => `${x(i)},${y(d.value)}`).join(" ");
  const area =
    `M ${PAD.left},${PAD.top + innerH} ` +
    data.map((d, i) => `L ${x(i)},${y(d.value)}`).join(" ") +
    ` L ${x(data.length - 1)},${PAD.top + innerH} Z`;

  const gridY = [0.25, 0.5, 0.75, 1].map((f) => PAD.top + innerH * f);

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    let idx = 0;
    let best = Infinity;
    data.forEach((_, i) => {
      const d = Math.abs(x(i) - px);
      if (d < best) {
        best = d;
        idx = i;
      }
    });
    setHover(idx);
  };

  return (
    <div ref={wrapRef} className="relative w-full" style={{ height }}>
      <svg
        width={w}
        height={height}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e88504" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#e88504" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="area-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#d24e01" />
            <stop offset="100%" stopColor="#f1b04c" />
          </linearGradient>
        </defs>

        {/* recessive grid */}
        {gridY.map((gy, i) => (
          <line
            key={i}
            x1={PAD.left}
            x2={w - PAD.right}
            y1={gy}
            y2={gy}
            stroke="rgba(245,243,241,0.07)"
            strokeWidth={1}
          />
        ))}

        {/* area + line */}
        <motion.path
          d={area}
          fill="url(#area-fill)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
        />
        <motion.polyline
          points={line}
          fill="none"
          stroke="url(#area-line)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.3, ease: "easeInOut" }}
        />

        {/* x labels — thinned out so they never collide */}
        {data.map((d, i) => {
          const maxLabels = Math.max(2, Math.floor(w / 70));
          const step = Math.ceil(data.length / maxLabels);
          const show = i % step === 0 || i === data.length - 1;
          if (!show) return null;
          return (
            <text
              key={i}
              x={x(i)}
              y={height - 6}
              textAnchor="middle"
              className="fill-cream/35 font-mono"
              style={{ fontSize: 10 }}
            >
              {d.label}
            </text>
          );
        })}

        {/* hover crosshair + marker */}
        {hover !== null && (
          <>
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1={PAD.top}
              y2={PAD.top + innerH}
              stroke="rgba(245,243,241,0.25)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <circle
              cx={x(hover)}
              cy={y(data[hover].value)}
              r={5}
              fill="#0b0a09"
              stroke="#f1b04c"
              strokeWidth={2.5}
            />
          </>
        )}
      </svg>

      {/* tooltip */}
      {hover !== null && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-ember-500/30 bg-iron-950/90 px-3 py-1.5 text-center shadow-glow backdrop-blur"
          style={{ left: x(hover), top: y(data[hover].value) - 10 }}
        >
          <div className="font-mono text-[0.65rem] uppercase tracking-widest text-cream/50">
            {data[hover].label}
          </div>
          <div className="font-display text-sm font-semibold text-cream">
            {formatValue(data[hover].value)}
          </div>
        </div>
      )}
    </div>
  );
}

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  title?: string;
  action?: ReactNode;
  /** stagger index for the reveal */
  delay?: number;
}

/** The base premium surface for every dashboard block: gradient-bordered glass. */
export function GlassPanel({
  children,
  className,
  title,
  action,
  delay = 0,
}: GlassPanelProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "grad-border backdrop-blur-xl p-5 md:p-6 shadow-ember",
        className,
      )}
    >
      {(title || action) && (
        <header className="mb-5 flex items-center justify-between gap-4">
          {title && (
            <h3 className="font-display text-lg font-semibold text-cream">
              {title}
            </h3>
          )}
          {action}
        </header>
      )}
      {children}
    </motion.section>
  );
}

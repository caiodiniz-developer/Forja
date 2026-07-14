import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  dot?: boolean;
}

/** Small pill used for eyebrows, tags, and status chips. */
export function Badge({ children, className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-ember-500/25 bg-ember-500/5 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ember-300",
        className,
      )}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ember-400" />
        </span>
      )}
      {children}
    </span>
  );
}

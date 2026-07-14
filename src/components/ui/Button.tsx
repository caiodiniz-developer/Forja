import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-400 focus-visible:ring-offset-2 focus-visible:ring-offset-iron-950 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-molten text-iron-950 shadow-ember hover:shadow-glow-lg hover:-translate-y-0.5 active:translate-y-0",
  outline:
    "border border-ember-500/40 text-cream hover:border-ember-400 hover:bg-ember-500/10",
  ghost: "text-cream/80 hover:text-cream hover:bg-cream/5",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[0.95rem]",
  lg: "h-14 px-8 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {/* sheen sweep on primary */}
      {variant === "primary" && (
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute -inset-y-2 -left-1/2 w-1/2 -skew-x-12 bg-white/25 blur-md transition-transform duration-700 ease-out group-hover:translate-x-[320%]" />
        </span>
      )}
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </button>
  ),
);

Button.displayName = "Button";

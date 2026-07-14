import { forwardRef, useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, type = "text", className, id, ...props }, ref) => {
    const [show, setShow] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (show ? "text" : "password") : type;
    const inputId = id ?? props.name;

    return (
      <div className="w-full">
        <label
          htmlFor={inputId}
          className="mb-2 block font-mono text-[0.7rem] uppercase tracking-widest text-cream/50"
        >
          {label}
        </label>
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cream/40">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={cn(
              "h-12 w-full rounded-xl border bg-iron-950/60 text-cream placeholder:text-cream/30 outline-none transition-colors",
              icon ? "pl-11" : "pl-4",
              isPassword ? "pr-11" : "pr-4",
              error
                ? "border-red-500/60 focus:border-red-500"
                : "border-cream/10 focus:border-ember-500/60",
              className,
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Ocultar senha" : "Mostrar senha"}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-cream/40 transition-colors hover:text-cream/80"
            >
              {show ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

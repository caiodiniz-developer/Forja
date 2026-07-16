import { cn } from "@/lib/utils";

/** Just the flame mark — for compact spots (navbar, sidebar, preloader). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/favicon.png"
      alt=""
      aria-hidden
      draggable={false}
      className={cn("h-9 w-9 select-none object-contain", className)}
    />
  );
}

/** Full stacked lockup (mark + FORJA + tagline) — for roomy spots. */
export function LogoFull({ className }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="Forja — Plataforma de Cursos"
      draggable={false}
      className={cn("h-auto w-40 select-none object-contain", className)}
    />
  );
}

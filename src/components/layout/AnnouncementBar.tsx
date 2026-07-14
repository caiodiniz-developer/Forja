import { useState } from "react";
import { FiArrowRight, FiX } from "react-icons/fi";

/** Thin top bar for time-sensitive announcements (matrículas, lives). Dismissible. */
export function AnnouncementBar() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div className="relative z-[55] bg-molten text-iron-950">
      <div className="container-forge flex items-center justify-center gap-3 py-2 text-center text-sm font-medium">
        <span className="hidden h-1.5 w-1.5 animate-pulse rounded-full bg-iron-950 sm:inline-block" />
        <span>
          <strong className="font-semibold">Matrículas abertas</strong> — turma
          de 2026 com bônus de mentoria.
        </span>
        <a
          href="#planos"
          className="group inline-flex items-center gap-1 font-semibold underline-offset-4 hover:underline"
        >
          Garantir vaga
          <FiArrowRight className="transition-transform group-hover:translate-x-0.5" />
        </a>
        <button
          onClick={() => setOpen(false)}
          aria-label="Fechar aviso"
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-iron-950/70 transition-colors hover:bg-iron-950/10 hover:text-iron-950"
        >
          <FiX size={16} />
        </button>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { FiTool } from "react-icons/fi";

/** Intentional, on-brand placeholder for dashboard areas still in the forge. */
export function ComingSoon({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 animate-pulse-glow rounded-3xl bg-molten opacity-30 blur-2xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-molten text-iron-950 shadow-glow">
          <FiTool size={32} />
        </div>
      </motion.div>
      <p className="eyebrow mb-3">Na forja</p>
      <h1 className="font-display text-4xl font-semibold text-cream">{title}</h1>
      <p className="mt-3 max-w-sm text-cream/55">
        {desc ??
          "Esta área está sendo forjada. O layout e os componentes base já estão prontos — em breve totalmente funcional."}
      </p>
    </div>
  );
}

import { useState } from "react";
import { FiPlus, FiMessageCircle, FiArrowRight } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/Button";
import { faqs } from "@/data/content";
import { cn } from "@/lib/utils";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-28 md:py-36">
      <div className="container-forge grid gap-12 lg:grid-cols-12">
        {/* left: heading + support */}
        <div className="lg:col-span-4">
          <SectionHeading
            eyebrow="Dúvidas"
            title="Antes de acender a fornalha"
            highlight="fornalha"
          />

          <div className="grad-border mt-8 p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-molten text-iron-950 shadow-ember">
              <FiMessageCircle size={22} />
            </div>
            <h3 className="font-display text-lg font-semibold text-cream">
              Ainda com dúvidas?
            </h3>
            <p className="mt-2 text-sm text-cream/55">
              Nosso time responde de verdade — sem robô, sem enrolação.
            </p>
            <Button variant="outline" size="sm" className="mt-5">
              Falar com o time
              <FiArrowRight />
            </Button>
          </div>
        </div>

        {/* right: accordion cards */}
        <div className="space-y-3 lg:col-span-8">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className={cn(
                  "overflow-hidden rounded-2xl border transition-colors",
                  isOpen
                    ? "border-ember-500/35 bg-ember-500/[0.04]"
                    : "border-cream/[0.08] bg-iron-900/40 hover:border-cream/20",
                )}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center gap-4 px-5 py-5 text-left md:px-6"
                  aria-expanded={isOpen}
                >
                  <span
                    className={cn(
                      "font-display text-sm font-bold transition-colors",
                      isOpen ? "text-molten" : "text-cream/25",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "flex-1 font-display text-lg font-medium transition-colors",
                      isOpen ? "text-cream" : "text-cream/80",
                    )}
                  >
                    {f.q}
                  </span>
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                      isOpen
                        ? "rotate-45 border-ember-500 bg-molten text-iron-950"
                        : "border-cream/20 text-cream/60",
                    )}
                  >
                    <FiPlus size={18} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-6 pl-12 pr-6 text-cream/60 leading-relaxed md:pl-14">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

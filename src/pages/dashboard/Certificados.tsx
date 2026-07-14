import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiAward, FiDownload, FiX, FiCheckCircle } from "react-icons/fi";
import { useApi } from "@/hooks/useApi";
import { Button } from "@/components/ui/Button";

interface Certificate {
  code: string;
  issuedAt: string;
  courseTitle: string;
  courseSlug: string;
  outcomes: string[];
  studentName: string;
}

export function Certificados() {
  const call = useApi();
  const [items, setItems] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<Certificate | null>(null);

  useEffect(() => {
    call<{ items: Certificate[] }>("/learning/certificates")
      .then((r) => setItems(r.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [call]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="eyebrow mb-2">Conquistas</p>
        <h1 className="font-display text-3xl font-semibold text-cream md:text-4xl">
          Certificados
        </h1>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-cream/5" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="grad-border flex flex-col items-center gap-3 py-16 text-center">
          <FiAward size={32} className="text-ember-400" />
          <p className="text-cream/60">
            Você ainda não tem certificados. Conclua um curso para forjar o primeiro!
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {items.map((c) => (
            <motion.button
              key={c.code}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setView(c)}
              className="grad-border group p-6 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-molten text-iron-950 shadow-ember">
                  <FiAward size={22} />
                </div>
                <span className="font-mono text-[0.65rem] text-cream/40">
                  {new Date(c.issuedAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-cream">
                {c.courseTitle}
              </h3>
              <div className="mt-1 font-mono text-xs text-ember-300">{c.code}</div>
              <span className="mt-3 inline-block text-xs text-cream/45 group-hover:text-cream/70">
                Ver certificado →
              </span>
            </motion.button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {view && <CertificateModal cert={view} onClose={() => setView(null)} />}
      </AnimatePresence>
    </div>
  );
}

function CertificateModal({
  cert,
  onClose,
}: {
  cert: Certificate;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto p-4"
    >
      <div
        className="absolute inset-0 bg-iron-950/85 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 flex h-9 w-9 items-center justify-center rounded-lg text-cream/60 hover:bg-cream/5"
        >
          <FiX size={18} />
        </button>

        {/* the certificate itself */}
        <div
          id="certificate"
          className="relative overflow-hidden rounded-3xl border-2 border-ember-500/40 bg-gradient-to-br from-iron-900 to-iron-950 p-10 text-center md:p-14"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-ember-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-ember-700/15 blur-3xl" />

          <div className="relative">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-molten text-iron-950">
              <span className="font-display text-2xl font-bold">F</span>
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-ember-400">
              Certificado de Conclusão
            </p>

            <p className="mx-auto mt-8 max-w-lg text-lg leading-relaxed text-cream/80">
              A <span className="font-display font-semibold text-molten">Forja</span>{" "}
              certifica que{" "}
              <span className="font-display font-semibold text-cream">
                {cert.studentName}
              </span>{" "}
              concluiu sua jornada de{" "}
              <span className="font-display font-semibold text-cream">
                {cert.courseTitle}
              </span>
              {cert.outcomes.length > 0 && (
                <>
                  , desenvolvendo aprendizado em{" "}
                  <span className="text-cream/90">
                    {cert.outcomes.join(", ")}
                  </span>
                </>
              )}
              .
            </p>

            <div className="mx-auto mt-8 h-px w-40 bg-gradient-to-r from-transparent via-ember-500/50 to-transparent" />

            <div className="mt-6 flex items-center justify-center gap-8 font-mono text-xs text-cream/50">
              <span className="inline-flex items-center gap-1.5">
                <FiCheckCircle className="text-ember-400" size={13} /> {cert.code}
              </span>
              <span>{new Date(cert.issuedAt).toLocaleDateString("pt-BR")}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <Button onClick={() => window.print()}>
            <FiDownload /> Baixar / Imprimir
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

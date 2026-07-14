import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiCalendar, FiClock, FiExternalLink, FiVideo } from "react-icons/fi";
import { useApi } from "@/hooks/useApi";

interface EventItem {
  id: string;
  title: string;
  description?: string | null;
  kind: string;
  startsAt: string;
  url?: string | null;
  host: { name: string };
}

const kindLabel: Record<string, string> = {
  LIVE: "Live",
  WORKSHOP: "Workshop",
  WEBINAR: "Webinar",
};

export function Eventos() {
  const call = useApi();
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    call<{ items: EventItem[] }>("/events")
      .then((r) => setItems(r.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [call]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="eyebrow mb-2">Agenda</p>
        <h1 className="font-display text-3xl font-semibold text-cream md:text-4xl">
          Eventos ao vivo
        </h1>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-cream/5" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="grad-border flex flex-col items-center gap-3 py-16 text-center">
          <FiCalendar size={30} className="text-ember-400" />
          <p className="text-cream/60">Nenhum evento agendado no momento.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((e) => {
            const d = new Date(e.startsAt);
            return (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="grad-border flex flex-wrap items-center gap-4 p-4"
              >
                <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-ember-700 to-ember-500 text-iron-950">
                  <span className="font-display text-xl font-bold leading-none">
                    {d.getDate()}
                  </span>
                  <span className="text-[0.6rem] uppercase">
                    {d.toLocaleDateString("pt-BR", { month: "short" })}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-widest text-ember-400">
                    <FiVideo size={11} /> {kindLabel[e.kind] ?? e.kind}
                  </div>
                  <h4 className="font-display text-lg font-semibold text-cream">
                    {e.title}
                  </h4>
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-cream/45">
                    <FiClock size={11} />{" "}
                    {d.toLocaleString("pt-BR", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    · com {e.host.name}
                  </span>
                </div>
                {e.url && (
                  <a
                    href={e.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-molten px-4 py-2 text-sm font-medium text-iron-950 hover:shadow-glow"
                  >
                    Participar <FiExternalLink size={14} />
                  </a>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiBell, FiCheckCircle } from "react-icons/fi";
import { useApi } from "@/hooks/useApi";
import { cn } from "@/lib/utils";

interface Notif {
  id: string;
  title: string;
  body?: string | null;
  read: boolean;
  createdAt: string;
}

export function Notificacoes() {
  const call = useApi();
  const [items, setItems] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const load = () =>
    call<{ items: Notif[] }>("/notifications")
      .then((r) => setItems(r.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, [call]);

  const markAll = async () => {
    setItems((p) => p.map((n) => ({ ...n, read: true })));
    await call("/notifications/read-all", { method: "POST" }).catch(load);
  };

  const markOne = async (id: string) => {
    setItems((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n)));
    await call(`/notifications/${id}/read`, { method: "POST" }).catch(load);
  };

  const shown = filter === "unread" ? items.filter((n) => !n.read) : items;
  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Central</p>
          <h1 className="font-display text-3xl font-semibold text-cream md:text-4xl">
            Notificações
          </h1>
        </div>
        {unread > 0 && (
          <button
            onClick={markAll}
            className="inline-flex items-center gap-2 rounded-full border border-cream/15 px-4 py-2 text-sm text-cream/70 hover:border-ember-500/40 hover:text-cream"
          >
            <FiCheckCircle size={15} /> Marcar todas como lidas
          </button>
        )}
      </div>

      <div className="flex gap-2">
        {(["all", "unread"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors",
              filter === f ? "bg-molten text-iron-950" : "text-cream/55 hover:text-cream",
            )}
          >
            {f === "all" ? "Todas" : `Não lidas (${unread})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-cream/5" />
          ))}
        </div>
      ) : shown.length === 0 ? (
        <div className="grad-border flex flex-col items-center gap-3 py-16 text-center">
          <FiBell size={28} className="text-ember-400" />
          <p className="text-cream/60">
            {filter === "unread" ? "Tudo em dia!" : "Nenhuma notificação ainda."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {shown.map((n) => (
            <motion.button
              key={n.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => !n.read && markOne(n.id)}
              className={cn(
                "grad-border flex w-full gap-3 p-4 text-left",
                !n.read && "ring-1 ring-ember-500/20",
              )}
            >
              <span
                className={cn(
                  "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                  n.read ? "bg-cream/20" : "bg-ember-400",
                )}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-medium text-cream">{n.title}</h4>
                  <span className="shrink-0 font-mono text-[0.65rem] text-cream/40">
                    {new Date(n.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                {n.body && <p className="mt-0.5 text-sm text-cream/55">{n.body}</p>}
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiTrash2, FiPlus, FiVideo, FiClock } from "react-icons/fi";
import { useApi } from "@/hooks/useApi";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

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
  const [form, setForm] = useState({
    title: "",
    kind: "LIVE",
    date: "",
    time: "",
    url: "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = () =>
    call<{ items: EventItem[] }>("/admin/events")
      .then((r) => setItems(r.items))
      .catch(() => setItems([]));
  useEffect(() => {
    load();
  }, [call]);

  const create = async () => {
    if (!form.title || !form.date || !form.time) {
      setErr("Preencha título, data e horário.");
      return;
    }
    setErr(null);
    setBusy(true);
    try {
      await call("/admin/events", {
        method: "POST",
        body: {
          title: form.title,
          kind: form.kind,
          startsAt: new Date(`${form.date}T${form.time}`).toISOString(),
          url: form.url || undefined,
        },
      });
      setForm({ title: "", kind: "LIVE", date: "", time: "", url: "" });
      load();
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    setItems((p) => p.filter((e) => e.id !== id));
    await call(`/admin/events/${id}`, { method: "DELETE" }).catch(load);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="eyebrow mb-2">Conteúdo</p>
        <h1 className="font-display text-3xl font-semibold text-cream md:text-4xl">
          Eventos
        </h1>
      </div>

      {/* create */}
      <div className="grad-border space-y-4 p-6">
        <h3 className="font-display font-semibold text-cream">Novo evento</h3>
        {err && <p className="text-sm text-red-400">{err}</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Título"
            placeholder="Live: Arquitetura em escala"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <div>
            <label className="mb-2 block font-mono text-[0.7rem] uppercase tracking-widest text-cream/50">
              Tipo
            </label>
            <select
              value={form.kind}
              onChange={(e) => setForm({ ...form, kind: e.target.value })}
              className="h-12 w-full rounded-xl border border-cream/10 bg-iron-950/60 px-3 text-cream outline-none focus:border-ember-500/50"
            >
              <option value="LIVE">Live</option>
              <option value="WORKSHOP">Workshop</option>
              <option value="WEBINAR">Webinar</option>
            </select>
          </div>
          <Input
            label="Data"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <Input
            label="Horário"
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
          />
          <Input
            label="Link (opcional)"
            placeholder="https://meet…"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
          />
        </div>
        <Button onClick={create} disabled={busy}>
          <FiPlus /> {busy ? "Criando…" : "Criar evento"}
        </Button>
      </div>

      {/* list */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="grad-border py-12 text-center text-cream/50">
            Nenhum evento criado ainda.
          </div>
        ) : (
          items.map((e) => {
            const d = new Date(e.startsAt);
            return (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="grad-border flex items-center gap-4 p-4"
              >
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-molten text-iron-950">
                  <span className="font-display text-lg font-bold leading-none">
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
                  <h4 className="truncate font-medium text-cream">{e.title}</h4>
                  <span className="inline-flex items-center gap-1 font-mono text-xs text-cream/45">
                    <FiClock size={11} />{" "}
                    {d.toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <button
                  onClick={() => remove(e.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-cream/40 hover:bg-red-500/15 hover:text-red-300"
                >
                  <FiTrash2 size={16} />
                </button>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

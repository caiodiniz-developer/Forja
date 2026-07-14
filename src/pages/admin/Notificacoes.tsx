import { useEffect, useState } from "react";
import { FiSend, FiUsers, FiUser, FiCheck } from "react-icons/fi";
import { useApi } from "@/hooks/useApi";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface U {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function Notificacoes() {
  const call = useApi();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [target, setTarget] = useState<"ALL" | "SPECIFIC">("ALL");
  const [users, setUsers] = useState<U[]>([]);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [sent, setSent] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    call<{ items: U[] }>("/admin/users").then((r) => setUsers(r.items)).catch(() => {});
  }, [call]);

  const toggle = (id: string) =>
    setPicked((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const send = async () => {
    if (!title.trim()) return;
    setBusy(true);
    setSent(null);
    try {
      const res = await call<{ sent: number }>("/admin/notifications", {
        method: "POST",
        body: {
          title,
          body: body || undefined,
          userIds: target === "SPECIFIC" ? [...picked] : undefined,
        },
      });
      setSent(res.sent);
      setTitle("");
      setBody("");
      setPicked(new Set());
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="eyebrow mb-2">Operação</p>
        <h1 className="font-display text-3xl font-semibold text-cream md:text-4xl">
          Enviar notificação
        </h1>
      </div>

      <div className="grad-border space-y-5 p-6">
        <Input label="Título" placeholder="Nova aula liberada!" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div>
          <label className="mb-2 block font-mono text-[0.7rem] uppercase tracking-widest text-cream/50">
            Mensagem
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder="Detalhes da notificação…"
            className="w-full rounded-xl border border-cream/10 bg-iron-950/60 px-4 py-3 text-sm text-cream placeholder:text-cream/30 outline-none focus:border-ember-500/50"
          />
        </div>

        {/* target */}
        <div className="flex gap-3">
          {(
            [
              { k: "ALL", label: "Todos", icon: FiUsers },
              { k: "SPECIFIC", label: "Específicos", icon: FiUser },
            ] as const
          ).map((o) => (
            <button
              key={o.k}
              onClick={() => setTarget(o.k)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm transition-colors",
                target === o.k
                  ? "border-ember-500/50 bg-ember-500/10 text-cream"
                  : "border-cream/10 text-cream/55 hover:border-ember-500/30",
              )}
            >
              <o.icon size={16} /> {o.label}
            </button>
          ))}
        </div>

        {target === "SPECIFIC" && (
          <div className="max-h-56 space-y-1 overflow-y-auto rounded-xl border border-cream/10 bg-iron-950/40 p-2">
            {users.map((u) => (
              <button
                key={u.id}
                onClick={() => toggle(u.id)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-cream/5"
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-md border",
                    picked.has(u.id)
                      ? "border-ember-500 bg-molten text-iron-950"
                      : "border-cream/20",
                  )}
                >
                  {picked.has(u.id) && <FiCheck size={12} strokeWidth={3} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-cream">{u.name}</span>
                  <span className="block truncate font-mono text-[0.65rem] text-cream/45">
                    {u.email}
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}

        {sent !== null && (
          <div className="rounded-xl border border-ember-500/30 bg-ember-500/10 px-4 py-3 text-sm text-ember-200">
            Notificação enviada para {sent} {sent === 1 ? "pessoa" : "pessoas"}.
          </div>
        )}

        <Button
          onClick={send}
          disabled={busy || !title.trim() || (target === "SPECIFIC" && picked.size === 0)}
        >
          <FiSend /> {busy ? "Enviando…" : "Enviar"}
        </Button>
      </div>
    </div>
  );
}

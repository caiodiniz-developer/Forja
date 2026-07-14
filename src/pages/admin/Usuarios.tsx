import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiSlash, FiCheck, FiZap, FiTrash2 } from "react-icons/fi";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/contexts/ToastContext";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  plan: "FREE" | "PRO";
  isBlocked: boolean;
  createdAt: string;
  _count: { enrollments: number; certificates: number };
}

const roleLabels: Record<AdminUser["role"], string> = {
  STUDENT: "Aluno",
  INSTRUCTOR: "Professor",
  ADMIN: "Admin",
};

export function Usuarios() {
  const call = useApi();
  const { user: me } = useAuth();
  const toast = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState<string | null>(null);

  const remove = async (id: string, name: string) => {
    if (!confirm(`Excluir permanentemente ${name}? Esta ação não pode ser desfeita.`))
      return;
    const prev = users;
    setUsers((u) => u.filter((x) => x.id !== id));
    try {
      await call(`/admin/users/${id}`, { method: "DELETE" });
      toast("Usuário excluído");
    } catch (e) {
      setUsers(prev); // rollback
      toast(e instanceof ApiError ? e.message : "Erro ao excluir", "error");
    }
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    const t = setTimeout(() => {
      call<{ items: AdminUser[] }>(
        `/admin/users${search ? `?search=${encodeURIComponent(search)}` : ""}`,
      )
        .then((r) => active && setUsers(r.items))
        .catch(() => active && setUsers([]))
        .finally(() => active && setLoading(false));
    }, 250);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [search, call]);

  const patch = async (id: string, data: Partial<AdminUser>) => {
    setSaving(id);
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));
    try {
      await call(`/admin/users/${id}`, { method: "PATCH", body: data });
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Operação</p>
          <h1 className="font-display text-3xl font-semibold text-cream md:text-4xl">
            Usuários
          </h1>
        </div>
        <div className="relative w-full max-w-xs">
          <FiSearch
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/40"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou e-mail…"
            className="h-11 w-full rounded-xl border border-cream/10 bg-iron-900/50 pl-10 pr-4 text-sm text-cream placeholder:text-cream/35 outline-none focus:border-ember-500/50"
          />
        </div>
      </div>

      <div className="grad-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-cream/[0.07] text-cream/45">
                <th className="px-5 py-4 font-mono text-[0.65rem] font-normal uppercase tracking-widest">Usuário</th>
                <th className="px-3 py-4 font-mono text-[0.65rem] font-normal uppercase tracking-widest">Papel</th>
                <th className="px-3 py-4 font-mono text-[0.65rem] font-normal uppercase tracking-widest">Plano</th>
                <th className="px-3 py-4 font-mono text-[0.65rem] font-normal uppercase tracking-widest">Cursos</th>
                <th className="px-5 py-4 text-right font-mono text-[0.65rem] font-normal uppercase tracking-widest">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-cream/[0.05]">
                    <td className="px-5 py-4" colSpan={5}>
                      <div className="h-8 w-full animate-pulse rounded-lg bg-cream/5" />
                    </td>
                  </tr>
                ))}

              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center text-cream/45">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}

              {!loading &&
                users.map((u) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      "border-b border-cream/[0.05] transition-colors hover:bg-cream/[0.02]",
                      u.isBlocked && "opacity-50",
                      saving === u.id && "animate-pulse",
                    )}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-molten-soft font-display text-xs font-semibold text-iron-950">
                          {u.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-cream">{u.name}</div>
                          <div className="truncate font-mono text-[0.7rem] text-cream/45">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => patch(u.id, { role: e.target.value as AdminUser["role"] })}
                        className="rounded-lg border border-cream/10 bg-iron-950/60 px-2 py-1.5 text-xs text-cream outline-none focus:border-ember-500/50"
                      >
                        {(["STUDENT", "INSTRUCTOR", "ADMIN"] as const).map((r) => (
                          <option key={r} value={r}>{roleLabels[r]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <button
                        onClick={() => patch(u.id, { plan: u.plan === "PRO" ? "FREE" : "PRO" })}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-widest transition-colors",
                          u.plan === "PRO"
                            ? "bg-molten text-iron-950"
                            : "border border-cream/15 text-cream/60 hover:border-ember-500/40",
                        )}
                      >
                        {u.plan === "PRO" && <FiZap size={11} />}
                        {u.plan}
                      </button>
                    </td>
                    <td className="px-3 py-3 font-mono text-xs text-cream/55">
                      {u._count.enrollments}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => patch(u.id, { isBlocked: !u.isBlocked })}
                          title={u.isBlocked ? "Desbloquear" : "Bloquear"}
                          className={cn(
                            "inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                            u.isBlocked
                              ? "bg-red-500/15 text-red-300 hover:bg-red-500/25"
                              : "text-cream/50 hover:bg-cream/5 hover:text-red-300",
                          )}
                        >
                          {u.isBlocked ? <FiCheck size={15} /> : <FiSlash size={15} />}
                        </button>
                        {u.id !== me?.id && (
                          <button
                            onClick={() => remove(u.id, u.name)}
                            title="Excluir usuário"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-cream/50 transition-colors hover:bg-red-500/20 hover:text-red-300"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

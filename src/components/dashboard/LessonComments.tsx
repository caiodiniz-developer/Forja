import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiSend, FiTrash2, FiMessageCircle } from "react-icons/fi";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/contexts/ToastContext";
import { API_BASE } from "@/lib/api";

interface Comment {
  id: string;
  body: string;
  createdAt: string;
  user: { id: string; name: string; avatarUrl: string | null; role: string };
}

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "agora";
  if (s < 3600) return `há ${Math.floor(s / 60)} min`;
  if (s < 86400) return `há ${Math.floor(s / 3600)} h`;
  return new Date(iso).toLocaleDateString("pt-BR");
}

export function LessonComments({ lessonId }: { lessonId: string }) {
  const call = useApi();
  const { user } = useAuth();
  const toast = useToast();
  const [items, setItems] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setLoading(true);
    call<{ items: Comment[] }>(`/comments/lesson/${lessonId}`)
      .then((r) => setItems(r.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [lessonId, call]);

  const send = async () => {
    if (!body.trim()) return;
    setSending(true);
    try {
      const { comment } = await call<{ comment: Comment }>(
        `/comments/lesson/${lessonId}`,
        { method: "POST", body: { body: body.trim() } },
      );
      setItems((c) => [comment, ...c]);
      setBody("");
    } catch {
      toast("Não foi possível comentar", "error");
    } finally {
      setSending(false);
    }
  };

  const remove = async (id: string) => {
    setItems((c) => c.filter((x) => x.id !== id));
    await call(`/comments/${id}`, { method: "DELETE" }).catch(() =>
      toast("Erro ao excluir", "error"),
    );
  };

  const Avatar = ({ c }: { c: Comment["user"] }) =>
    c.avatarUrl ? (
      <img
        src={`${API_BASE}${c.avatarUrl}`}
        alt={c.name}
        className="h-9 w-9 rounded-full object-cover"
      />
    ) : (
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-molten-soft font-display text-xs font-semibold text-iron-950">
        {c.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()}
      </span>
    );

  return (
    <div className="grad-border p-5 md:p-6">
      <h3 className="mb-5 inline-flex items-center gap-2 font-display text-lg font-semibold text-cream">
        <FiMessageCircle size={17} className="text-ember-400" /> Comentários
        <span className="font-mono text-xs font-normal text-cream/40">
          ({items.length})
        </span>
      </h3>

      {/* new comment */}
      <div className="mb-6 flex gap-3">
        <Avatar
          c={{
            id: user?.id ?? "",
            name: user?.name ?? "Você",
            avatarUrl: user?.avatarUrl ?? null,
            role: user?.role ?? "STUDENT",
          }}
        />
        <div className="flex-1">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={2}
            placeholder="Deixe um comentário ou dúvida…"
            className="w-full resize-none rounded-xl border border-cream/10 bg-iron-950/50 px-4 py-3 text-sm text-cream placeholder:text-cream/35 outline-none focus:border-ember-500/50"
          />
          <div className="mt-2 flex justify-end">
            <button
              onClick={send}
              disabled={sending || !body.trim()}
              className="inline-flex items-center gap-2 rounded-full bg-molten px-4 py-2 text-sm font-medium text-iron-950 transition-all hover:shadow-glow disabled:opacity-50"
            >
              <FiSend size={14} /> {sending ? "Enviando…" : "Comentar"}
            </button>
          </div>
        </div>
      </div>

      {/* list */}
      {loading ? (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-cream/5" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="py-4 text-center text-sm text-cream/40">
          Seja o primeiro a comentar.
        </p>
      ) : (
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {items.map((c) => {
              const canDelete = c.user.id === user?.id || user?.role === "ADMIN";
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="group flex gap-3"
                >
                  <Avatar c={c.user} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-cream">
                        {c.user.name}
                      </span>
                      {c.user.role !== "STUDENT" && (
                        <span className="rounded-full bg-ember-500/15 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-ember-300">
                          {c.user.role === "ADMIN" ? "Admin" : "Prof"}
                        </span>
                      )}
                      <span className="font-mono text-[0.65rem] text-cream/40">
                        {timeAgo(c.createdAt)}
                      </span>
                    </div>
                    <p className="mt-0.5 whitespace-pre-wrap text-sm text-cream/75">
                      {c.body}
                    </p>
                  </div>
                  {canDelete && (
                    <button
                      onClick={() => remove(c.id)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-cream/30 opacity-0 transition-all hover:bg-red-500/15 hover:text-red-300 group-hover:opacity-100"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

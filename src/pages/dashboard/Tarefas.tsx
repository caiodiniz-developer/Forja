import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiClock, FiFlag, FiCheckSquare, FiLink, FiUser } from "react-icons/fi";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/contexts/ToastContext";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  dueDate?: string | null;
  submission?: string | null;
  author: { name: string };
}

const STATUS: [string, string][] = [
  ["BACKLOG", "A fazer"],
  ["IN_PROGRESS", "Fazendo"],
  ["REVIEW", "Em revisão"],
  ["DONE", "Concluída"],
];

const priorityStyle: Record<string, string> = {
  LOW: "bg-cream/10 text-cream/60",
  MEDIUM: "bg-ember-500/15 text-ember-300",
  HIGH: "bg-ember-600/25 text-ember-200",
  URGENT: "bg-red-500/20 text-red-300",
};
const priorityLabel: Record<string, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  URGENT: "Urgente",
};

function TaskRow({
  task,
  onChange,
}: {
  task: Task;
  onChange: (t: Task) => void;
}) {
  const call = useApi();
  const toast = useToast();
  const [link, setLink] = useState(task.submission ?? "");
  const done = task.status === "DONE";

  const patch = async (data: Partial<Task>) => {
    onChange({ ...task, ...data });
    await call<{ task: Task }>(`/me/tasks/${task.id}`, {
      method: "PATCH",
      body: data,
    }).catch(() => toast("Erro ao salvar", "error"));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "grad-border p-5 transition-opacity",
        done && "opacity-70",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider",
                priorityStyle[task.priority],
              )}
            >
              <FiFlag size={9} /> {priorityLabel[task.priority]}
            </span>
            {task.dueDate && (
              <span className="inline-flex items-center gap-1 font-mono text-[0.65rem] text-cream/45">
                <FiClock size={10} />{" "}
                {new Date(task.dueDate).toLocaleDateString("pt-BR")}
              </span>
            )}
            <span className="inline-flex items-center gap-1 font-mono text-[0.65rem] text-cream/45">
              <FiUser size={10} /> {task.author.name}
            </span>
          </div>
          <h3
            className={cn(
              "font-display text-lg font-semibold text-cream",
              done && "line-through decoration-cream/30",
            )}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-1 text-sm text-cream/55">{task.description}</p>
          )}
        </div>

        <select
          value={task.status}
          onChange={(e) => patch({ status: e.target.value })}
          className="h-10 shrink-0 rounded-xl border border-cream/10 bg-iron-950/60 px-3 text-sm text-cream outline-none focus:border-ember-500/50"
        >
          {STATUS.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </div>

      {/* submission */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1">
          <FiLink
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cream/40"
          />
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Link do seu envio (GitHub, Figma…)"
            className="h-10 w-full rounded-xl border border-cream/10 bg-iron-950/50 pl-9 pr-3 text-sm text-cream placeholder:text-cream/35 outline-none focus:border-ember-500/50"
          />
        </div>
        {link !== (task.submission ?? "") && (
          <button
            onClick={() => patch({ submission: link || null }).then(() => toast("Envio salvo"))}
            className="inline-flex items-center gap-1.5 rounded-xl bg-molten px-4 py-2 text-sm font-medium text-iron-950 hover:shadow-glow"
          >
            Enviar
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function Tarefas() {
  const call = useApi();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    call<{ items: Task[] }>("/me/tasks")
      .then((r) => setTasks(r.items))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, [call]);

  const update = (t: Task) =>
    setTasks((prev) => prev.map((x) => (x.id === t.id ? t : x)));

  const pending = tasks.filter((t) => t.status !== "DONE").length;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="eyebrow mb-2">Atividades</p>
        <h1 className="font-display text-3xl font-semibold text-cream md:text-4xl">
          Minhas tarefas
        </h1>
        {!loading && tasks.length > 0 && (
          <p className="mt-1 font-mono text-xs text-cream/45">
            {pending} pendente{pending === 1 ? "" : "s"} · {tasks.length} no total
          </p>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-cream/5" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="grad-border flex flex-col items-center gap-3 py-16 text-center">
          <FiCheckSquare size={30} className="text-ember-400" />
          <p className="text-cream/60">
            Você não tem tarefas atribuídas no momento. Tudo em dia! 🎉
          </p>
        </div>
      ) : (
        <>
          {STATUS.map(([key, label]) => {
            const group = tasks.filter((t) => t.status === key);
            if (group.length === 0) return null;
            return (
              <div key={key} className="space-y-3">
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-cream/40">
                  {label} ({group.length})
                </h2>
                {group.map((t) => (
                  <TaskRow key={t.id} task={t} onChange={update} />
                ))}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

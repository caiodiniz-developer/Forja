import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { FiPlus, FiTrash2, FiClock, FiX, FiFlag } from "react-icons/fi";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/contexts/ToastContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  dueDate?: string | null;
  submission?: string | null;
  assignee?: { id: string; name: string } | null;
}

const COLUMNS = [
  { key: "BACKLOG", label: "A fazer" },
  { key: "IN_PROGRESS", label: "Em progresso" },
  { key: "REVIEW", label: "Revisão" },
  { key: "DONE", label: "Concluído" },
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

export function Tasks() {
  const call = useApi();
  const toast = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Task | "new" | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const load = () =>
    call<{ items: Task[] }>("/admin/tasks")
      .then((r) => setTasks(r.items))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, [call]);

  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const task = tasks.find((t) => t.id === active.id);
    const target = String(over.id);
    if (!task || task.status === target) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: target } : t)),
    );
    call(`/admin/tasks/${task.id}`, { method: "PATCH", body: { status: target } })
      .then(() => toast("Tarefa movida"))
      .catch(() => {
        toast("Erro ao mover", "error");
        load();
      });
  };

  const onDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id));

  const remove = async (id: string) => {
    setTasks((p) => p.filter((t) => t.id !== id));
    setModal(null);
    await call(`/admin/tasks/${id}`, { method: "DELETE" })
      .then(() => toast("Tarefa excluída"))
      .catch(load);
  };

  const activeTask = tasks.find((t) => t.id === activeId) ?? null;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Operação</p>
          <h1 className="font-display text-3xl font-semibold text-cream md:text-4xl">
            Tarefas
          </h1>
        </div>
        <Button onClick={() => setModal("new")}>
          <FiPlus /> Nova tarefa
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-4">
          {COLUMNS.map((c) => (
            <div key={c.key} className="h-64 animate-pulse rounded-2xl bg-cream/5" />
          ))}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {COLUMNS.map((col) => (
              <Column
                key={col.key}
                col={col}
                tasks={tasks.filter((t) => t.status === col.key)}
                onOpen={(t) => setModal(t)}
              />
            ))}
          </div>
          <DragOverlay>
            {activeTask ? <CardBody task={activeTask} dragging /> : null}
          </DragOverlay>
        </DndContext>
      )}

      <AnimatePresence>
        {modal && (
          <TaskModal
            task={modal === "new" ? null : modal}
            onClose={() => setModal(null)}
            onDelete={remove}
            onSaved={() => {
              setModal(null);
              load();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Column({
  col,
  tasks,
  onOpen,
}: {
  col: { key: string; label: string };
  tasks: Task[];
  onOpen: (t: Task) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: col.key });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col rounded-2xl border p-3 transition-colors",
        isOver ? "border-ember-500/50 bg-ember-500/[0.05]" : "border-cream/[0.07] bg-iron-900/30",
      )}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="font-display text-sm font-semibold text-cream">
          {col.label}
        </span>
        <span className="rounded-full bg-cream/10 px-2 py-0.5 font-mono text-[0.65rem] text-cream/50">
          {tasks.length}
        </span>
      </div>
      <div className="flex min-h-[120px] flex-1 flex-col gap-2">
        {tasks.map((t) => (
          <DraggableCard key={t.id} task={t} onOpen={() => onOpen(t)} />
        ))}
        {tasks.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-cream/10 text-xs text-cream/30">
            Arraste tarefas aqui
          </div>
        )}
      </div>
    </div>
  );
}

function DraggableCard({ task, onOpen }: { task: Task; onOpen: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      {...attributes}
      {...listeners}
      onClick={onOpen}
      className={cn("cursor-grab active:cursor-grabbing", isDragging && "opacity-40")}
    >
      <CardBody task={task} />
    </div>
  );
}

function CardBody({ task, dragging }: { task: Task; dragging?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-cream/[0.08] bg-iron-950/60 p-3",
        dragging && "shadow-glow ring-1 ring-ember-500/40",
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider",
            priorityStyle[task.priority],
          )}
        >
          <FiFlag size={9} /> {priorityLabel[task.priority]}
        </span>
      </div>
      <p className="text-sm font-medium leading-snug text-cream">{task.title}</p>
      {task.description && (
        <p className="mt-1 line-clamp-2 text-xs text-cream/50">{task.description}</p>
      )}
      <div className="mt-2 flex items-center justify-between">
        {task.dueDate ? (
          <span className="inline-flex items-center gap-1 font-mono text-[0.65rem] text-cream/45">
            <FiClock size={10} />{" "}
            {new Date(task.dueDate).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
            })}
          </span>
        ) : (
          <span />
        )}
        {task.assignee && (
          <span
            title={task.assignee.name}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-molten-soft font-display text-[0.6rem] font-semibold text-iron-950"
          >
            {task.assignee.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      {task.submission && (
        <a
          href={task.submission}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-2 block truncate rounded-lg border border-ember-500/30 bg-ember-500/10 px-2 py-1 font-mono text-[0.65rem] text-ember-300 hover:bg-ember-500/20"
        >
          ↗ envio do aluno
        </a>
      )}
    </div>
  );
}

function TaskModal({
  task,
  onClose,
  onSaved,
  onDelete,
}: {
  task: Task | null;
  onClose: () => void;
  onSaved: () => void;
  onDelete: (id: string) => void;
}) {
  const call = useApi();
  const toast = useToast();
  const [form, setForm] = useState({
    title: task?.title ?? "",
    description: task?.description ?? "",
    priority: task?.priority ?? "MEDIUM",
    status: task?.status ?? "BACKLOG",
    dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : "",
    assigneeId: task?.assignee?.id ?? "",
  });
  const [busy, setBusy] = useState(false);
  const [users, setUsers] = useState<{ id: string; name: string; role: string }[]>([]);

  useEffect(() => {
    call<{ items: { id: string; name: string; role: string }[] }>(
      "/admin/users?perPage=50",
    )
      .then((r) => setUsers(r.items))
      .catch(() => {});
  }, [call]);

  const save = async () => {
    if (!form.title.trim()) return;
    setBusy(true);
    try {
      const body = {
        title: form.title,
        description: form.description || undefined,
        priority: form.priority,
        status: form.status,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
        assigneeId: form.assigneeId || undefined,
      };
      if (task) await call(`/admin/tasks/${task.id}`, { method: "PATCH", body });
      else await call("/admin/tasks", { method: "POST", body });
      toast(task ? "Tarefa atualizada" : "Tarefa criada");
      onSaved();
    } catch {
      toast("Erro ao salvar", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-iron-950/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        className="grad-border relative z-10 w-full max-w-lg p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-cream">
            {task ? "Editar tarefa" : "Nova tarefa"}
          </h2>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-cream/50 hover:bg-cream/5"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <Input
            label="Título"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Gravar módulo de Hooks"
          />
          <div>
            <label className="mb-2 block font-mono text-[0.7rem] uppercase tracking-widest text-cream/50">
              Descrição
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-cream/10 bg-iron-950/60 px-4 py-3 text-sm text-cream outline-none focus:border-ember-500/50"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Select
              label="Status"
              value={form.status}
              onChange={(v) => setForm({ ...form, status: v })}
              options={COLUMNS.map((c) => [c.key, c.label])}
            />
            <Select
              label="Prioridade"
              value={form.priority}
              onChange={(v) => setForm({ ...form, priority: v })}
              options={Object.entries(priorityLabel)}
            />
            <Input
              label="Prazo"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>
          <Select
            label="Responsável (aluno)"
            value={form.assigneeId}
            onChange={(v) => setForm({ ...form, assigneeId: v })}
            options={[
              ["", "— ninguém —"],
              ...users.map((u) => [u.id, u.name] as [string, string]),
            ]}
          />
        </div>

        <div className="mt-6 flex items-center justify-between">
          {task ? (
            <button
              onClick={() => onDelete(task.id)}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-300 hover:bg-red-500/10"
            >
              <FiTrash2 size={15} /> Excluir
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={save} disabled={busy}>
              {busy ? "Salvando…" : "Salvar"}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <div>
      <label className="mb-2 block font-mono text-[0.7rem] uppercase tracking-widest text-cream/50">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-xl border border-cream/10 bg-iron-950/60 px-2 text-sm text-cream outline-none focus:border-ember-500/50"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}

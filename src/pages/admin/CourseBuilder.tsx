import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  FiArrowLeft,
  FiPlus,
  FiTrash2,
  FiChevronDown,
  FiVideo,
  FiFileText,
  FiHelpCircle,
  FiLayers,
  FiMove,
  FiMessageCircle,
  FiPlay,
} from "react-icons/fi";
import { useApi } from "@/hooks/useApi";
import { API_BASE } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import { VideoUploader } from "@/components/dashboard/VideoUploader";
import { MaterialManager, type Material } from "@/components/dashboard/MaterialManager";
import { LessonComments } from "@/components/dashboard/LessonComments";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Lesson {
  id: string;
  title: string;
  type: string;
  durationSec: number;
  isPreview: boolean;
  content: string | null;
  videoId: string | null;
  materials: Material[];
}
interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

const typeIcon: Record<string, typeof FiVideo> = {
  VIDEO: FiVideo,
  TEXT: FiFileText,
  QUIZ: FiHelpCircle,
  DOWNLOAD: FiLayers,
};

export function CourseBuilder() {
  const { id: courseId } = useParams<{ id: string }>();
  const call = useApi();
  const toast = useToast();
  const [title, setTitle] = useState("Curso");
  const [slug, setSlug] = useState("");
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [newModule, setNewModule] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const load = useCallback(() => {
    if (!courseId) return;
    call<{ modules: Module[] }>(`/admin/content/courses/${courseId}/tree`)
      .then((r) => {
        setModules(r.modules);
        setOpen(new Set(r.modules.map((m) => m.id)));
      })
      .catch(() => setModules([]))
      .finally(() => setLoading(false));
    call<{ items: { id: string; title: string; slug: string }[] }>("/admin/courses")
      .then((r) => {
        const c = r.items.find((x) => x.id === courseId);
        if (c) {
          setTitle(c.title);
          setSlug(c.slug);
        }
      })
      .catch(() => {});
  }, [courseId, call]);
  useEffect(load, [load]);

  const findContainer = (id: string) => {
    if (modules.some((m) => m.id === id)) return id;
    return modules.find((m) => m.lessons.some((l) => l.id === id))?.id;
  };

  const persist = (arrangement: Module[]) => {
    call(`/admin/content/courses/${courseId}/reorder`, {
      method: "PATCH",
      body: {
        modules: arrangement.map((m) => ({
          moduleId: m.id,
          lessonIds: m.lessons.map((l) => l.id),
        })),
      },
    })
      .then(() => toast("Ordem salva"))
      .catch(() => {
        toast("Erro ao salvar ordem", "error");
        load();
      });
  };

  const onDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id));

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over || active.data.current?.type !== "lesson") return;
    const activeContainer = findContainer(String(active.id));
    const overContainer = findContainer(String(over.id));
    if (!activeContainer || !overContainer || activeContainer === overContainer)
      return;

    setModules((prev) => {
      const activeMod = prev.find((m) => m.id === activeContainer);
      const overMod = prev.find((m) => m.id === overContainer);
      if (!activeMod || !overMod) return prev;
      const moved = activeMod.lessons.find((l) => l.id === active.id);
      if (!moved) return prev;
      const overIsModule = over.data.current?.type === "module";
      const overIndex = overMod.lessons.findIndex((l) => l.id === over.id);
      const insertAt = overIsModule || overIndex < 0 ? overMod.lessons.length : overIndex;
      return prev.map((m) => {
        if (m.id === activeContainer)
          return { ...m, lessons: m.lessons.filter((l) => l.id !== active.id) };
        if (m.id === overContainer) {
          const copy = [...m.lessons];
          copy.splice(insertAt, 0, moved);
          return { ...m, lessons: copy };
        }
        return m;
      });
    });
  };

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;
    const type = active.data.current?.type;

    let next = modules;
    if (type === "module" && active.id !== over.id) {
      const oldI = modules.findIndex((m) => m.id === active.id);
      const newI = modules.findIndex((m) => m.id === over.id);
      if (oldI >= 0 && newI >= 0) next = arrayMove(modules, oldI, newI);
    } else if (type === "lesson") {
      const container = findContainer(String(over.id)) ?? findContainer(String(active.id));
      next = modules.map((m) => {
        if (m.id !== container) return m;
        const oldI = m.lessons.findIndex((l) => l.id === active.id);
        const overI = m.lessons.findIndex((l) => l.id === over.id);
        if (oldI < 0) return m;
        const newI = overI < 0 ? m.lessons.length - 1 : overI;
        return { ...m, lessons: arrayMove(m.lessons, oldI, newI) };
      });
    }
    setModules(next);
    persist(next);
  };

  const addModule = async () => {
    if (!newModule.trim()) {
      setStatus("Digite um nome para o módulo antes de clicar.");
      return;
    }
    setStatus("Criando módulo…");
    try {
      const { module } = await call<{ module: Module }>(
        `/admin/content/courses/${courseId}/modules`,
        { method: "POST", body: { title: newModule.trim() } },
      );
      setModules((m) => [...m, { ...module, lessons: [] }]);
      setOpen((s) => new Set(s).add(module.id));
      setNewModule("");
      setStatus("✓ Módulo criado");
      toast("Módulo criado");
      setTimeout(() => setStatus(null), 2500);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("[CourseBuilder] falha ao criar módulo:", e);
      setStatus(
        `✗ Falhou: ${msg}. Origem: ${window.location.origin} · API: ${API_BASE}`,
      );
    }
  };

  const deleteModule = async (mid: string) => {
    if (!confirm("Excluir o módulo e todas as suas aulas?")) return;
    setModules((m) => m.filter((x) => x.id !== mid));
    await call(`/admin/content/modules/${mid}`, { method: "DELETE" }).catch(load);
    toast("Módulo excluído");
  };

  const addLesson = async (mid: string, lessonTitle: string) => {
    if (!lessonTitle.trim()) return;
    const { lesson } = await call<{ lesson: Lesson }>(
      `/admin/content/modules/${mid}/lessons`,
      { method: "POST", body: { title: lessonTitle.trim(), type: "VIDEO" } },
    );
    setModules((m) =>
      m.map((x) =>
        x.id === mid
          ? {
              ...x,
              lessons: [
                ...x.lessons,
                { ...lesson, videoId: null, materials: [], content: lesson.content ?? null },
              ],
            }
          : x,
      ),
    );
  };

  const deleteLesson = async (mid: string, lid: string) => {
    setModules((m) =>
      m.map((x) =>
        x.id === mid ? { ...x, lessons: x.lessons.filter((l) => l.id !== lid) } : x,
      ),
    );
    await call(`/admin/content/lessons/${lid}`, { method: "DELETE" }).catch(load);
  };

  const patchLesson = (lid: string, patch: Partial<Lesson>) =>
    setModules((m) =>
      m.map((x) => ({
        ...x,
        lessons: x.lessons.map((l) => (l.id === lid ? { ...l, ...patch } : l)),
      })),
    );

  const totalLessons = modules.reduce((a, m) => a + m.lessons.length, 0);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            to="/admin/cursos"
            className="mb-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cream/50 hover:text-cream"
          >
            <FiArrowLeft size={13} /> Cursos
          </Link>
          <h1 className="font-display text-3xl font-semibold text-cream md:text-4xl">
            {title}
          </h1>
          <p className="mt-1 font-mono text-xs text-cream/45">
            {modules.length} módulos · {totalLessons} aulas · arraste para reordenar
          </p>
        </div>
        {slug && (
          <Link to={`/admin/curso/${slug}`}>
            <Button variant="outline" size="sm">
              <FiPlay size={14} /> Pré-visualizar como aluno
            </Button>
          </Link>
        )}
      </div>

      <div className="grad-border flex items-center gap-3 p-3">
        <input
          value={newModule}
          onChange={(e) => setNewModule(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addModule()}
          placeholder="Nome do novo módulo (ex: Fundamentos)…"
          className="h-11 flex-1 rounded-xl border border-cream/10 bg-iron-950/50 px-4 text-sm text-cream placeholder:text-cream/35 outline-none focus:border-ember-500/50"
        />
        <Button onClick={addModule}>
          <FiPlus /> Módulo
        </Button>
      </div>

      {status && (
        <div
          className={cn(
            "rounded-xl border px-4 py-3 text-sm",
            status.startsWith("✗")
              ? "border-red-500/40 bg-red-500/10 text-red-200"
              : "border-ember-500/30 bg-ember-500/10 text-ember-200",
          )}
        >
          {status}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-cream/5" />
          ))}
        </div>
      ) : modules.length === 0 ? (
        <div className="grad-border py-16 text-center text-cream/50">
          Nenhum módulo ainda. Comece adicionando um acima.
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={modules.map((m) => m.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {modules.map((m, i) => (
                <SortableModule
                  key={m.id}
                  module={m}
                  index={i}
                  expanded={open.has(m.id)}
                  dragging={activeId === m.id}
                  onToggle={() =>
                    setOpen((s) => {
                      const n = new Set(s);
                      n.has(m.id) ? n.delete(m.id) : n.add(m.id);
                      return n;
                    })
                  }
                  onDelete={() => deleteModule(m.id)}
                  onAddLesson={(t) => addLesson(m.id, t)}
                  onDeleteLesson={(lid) => deleteLesson(m.id, lid)}
                  onPatchLesson={patchLesson}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

/* -------------------------------------------------------------- module */

function SortableModule({
  module,
  index,
  expanded,
  dragging,
  onToggle,
  onDelete,
  onAddLesson,
  onDeleteLesson,
  onPatchLesson,
}: {
  module: Module;
  index: number;
  expanded: boolean;
  dragging: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onAddLesson: (title: string) => void;
  onDeleteLesson: (lessonId: string) => void;
  onPatchLesson: (lessonId: string, patch: Partial<Lesson>) => void;
}) {
  const [lessonTitle, setLessonTitle] = useState("");
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: module.id, data: { type: "module" } });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "grad-border overflow-hidden",
        (dragging || isDragging) && "opacity-60 ring-1 ring-ember-500/40",
      )}
    >
      <div className="flex items-center gap-2 p-4">
        <button
          {...attributes}
          {...listeners}
          className="flex h-8 w-8 cursor-grab items-center justify-center rounded-lg text-cream/30 hover:bg-cream/5 hover:text-cream active:cursor-grabbing"
          aria-label="Arrastar módulo"
        >
          <FiMove size={15} />
        </button>
        <button onClick={onToggle} className="flex flex-1 items-center gap-3 text-left">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ember-500/10 font-display text-sm font-bold text-ember-400">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold text-cream">
              {module.title}
            </h3>
            <span className="font-mono text-[0.65rem] text-cream/45">
              {module.lessons.length} aulas
            </span>
          </div>
          <FiChevronDown
            size={18}
            className={cn(
              "ml-auto text-cream/40 transition-transform",
              expanded && "rotate-180",
            )}
          />
        </button>
        <button
          onClick={onDelete}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-cream/40 hover:bg-red-500/15 hover:text-red-300"
        >
          <FiTrash2 size={15} />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 border-t border-cream/[0.07] p-4">
              <SortableContext
                items={module.lessons.map((l) => l.id)}
                strategy={verticalListSortingStrategy}
              >
                {module.lessons.map((l, li) => (
                  <SortableLesson
                    key={l.id}
                    lesson={l}
                    moduleId={module.id}
                    label={`${index + 1}.${li + 1}`}
                    onDelete={() => onDeleteLesson(l.id)}
                    onPatch={onPatchLesson}
                  />
                ))}
              </SortableContext>

              <div className="flex items-center gap-2">
                <input
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onAddLesson(lessonTitle);
                      setLessonTitle("");
                    }
                  }}
                  placeholder="Título da aula…"
                  className="h-10 flex-1 rounded-xl border border-cream/10 bg-iron-950/50 px-3 text-sm text-cream placeholder:text-cream/35 outline-none focus:border-ember-500/50"
                />
                <button
                  onClick={() => {
                    onAddLesson(lessonTitle);
                    setLessonTitle("");
                  }}
                  className="inline-flex items-center gap-1 rounded-xl border border-ember-500/30 px-3 py-2 text-xs text-ember-300 hover:bg-ember-500/10"
                >
                  <FiPlus size={13} /> Aula
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------- lesson */

function SortableLesson({
  lesson,
  moduleId,
  label,
  onDelete,
  onPatch,
}: {
  lesson: Lesson;
  moduleId: string;
  label: string;
  onDelete: () => void;
  onPatch: (lessonId: string, patch: Partial<Lesson>) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: lesson.id, data: { type: "lesson", moduleId } });
  const Icon = typeIcon[lesson.type] ?? FiVideo;
  const call = useApi();
  const toast = useToast();
  const [desc, setDesc] = useState(lesson.content ?? "");
  const [savingDesc, setSavingDesc] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const saveDesc = async () => {
    setSavingDesc(true);
    try {
      await call(`/admin/content/lessons/${lesson.id}`, {
        method: "PATCH",
        body: { content: desc.trim() || null },
      });
      onPatch(lesson.id, { content: desc.trim() || null });
      toast("Descrição salva");
    } catch {
      toast("Erro ao salvar descrição", "error");
    } finally {
      setSavingDesc(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "rounded-2xl border border-cream/[0.06] bg-iron-950/40 p-3",
        isDragging && "opacity-50 ring-1 ring-ember-500/40",
      )}
    >
      <div className="flex items-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="flex h-7 w-7 cursor-grab items-center justify-center rounded-lg text-cream/25 hover:bg-cream/5 hover:text-cream active:cursor-grabbing"
          aria-label="Arrastar aula"
        >
          <FiMove size={13} />
        </button>
        <span className="font-mono text-xs text-cream/35">{label}</span>
        <Icon size={15} className="text-ember-400" />
        <span className="flex-1 text-sm font-medium text-cream">{lesson.title}</span>
        <button
          onClick={onDelete}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-cream/40 hover:bg-red-500/15 hover:text-red-300"
        >
          <FiTrash2 size={13} />
        </button>
      </div>

      {!isDragging && (
        <>
          <div className="mt-3">
            <label className="mb-1 block font-mono text-[0.6rem] uppercase tracking-widest text-cream/40">
              Descrição da aula (aparece para o aluno)
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={2}
              placeholder="O que o aluno aprende nesta aula…"
              className="w-full resize-none rounded-xl border border-cream/10 bg-iron-950/50 px-3 py-2 text-sm text-cream placeholder:text-cream/35 outline-none focus:border-ember-500/50"
            />
            {desc !== (lesson.content ?? "") && (
              <button
                onClick={saveDesc}
                disabled={savingDesc}
                className="mt-1 inline-flex items-center gap-1 rounded-lg border border-ember-500/30 px-2.5 py-1 text-xs text-ember-300 hover:bg-ember-500/10"
              >
                {savingDesc ? "Salvando…" : "Salvar descrição"}
              </button>
            )}
          </div>
          <div className="mt-3">
            <VideoUploader
              lessonId={lesson.id}
              videoId={lesson.videoId}
              onUploaded={(vid) => onPatch(lesson.id, { videoId: vid })}
            />
          </div>
          <MaterialManager
            lessonId={lesson.id}
            materials={lesson.materials}
            onChange={(materials) => onPatch(lesson.id, { materials })}
          />

          <button
            onClick={() => setShowComments((v) => !v)}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-cream/55 hover:bg-cream/5 hover:text-cream"
          >
            <FiMessageCircle size={13} />
            {showComments ? "Ocultar comentários" : "Ver comentários dos alunos"}
          </button>
          {showComments && (
            <div className="mt-2">
              <LessonComments lessonId={lesson.id} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { FiPlus, FiTrash2, FiX, FiUsers, FiLayers } from "react-icons/fi";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/contexts/ToastContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

interface AdminCourse {
  id: string;
  title: string;
  level: string;
  status: string;
  price: number;
  isFree: boolean;
  studentsCount: number;
  category?: { name: string } | null;
  instructor: { name: string };
  _count: { modules: number; enrollments: number };
}

const createSchema = z.object({
  title: z.string().min(3, "Título muito curto"),
  subtitle: z.string().optional(),
  category: z.string().optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  isFree: z.boolean(),
  priceReais: z.coerce.number().min(0).optional(),
  publish: z.boolean(),
  outcomes: z.string().optional(), // uma por linha
});
type CreateForm = z.infer<typeof createSchema>;

const levelLabels: Record<string, string> = {
  BEGINNER: "Iniciante",
  INTERMEDIATE: "Intermediário",
  ADVANCED: "Avançado",
};

export function Cursos() {
  const call = useApi();
  const toast = useToast();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);

  const load = () => {
    setLoading(true);
    call<{ items: AdminCourse[] }>("/admin/courses")
      .then((r) => setCourses(r.items))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, [call]);

  const remove = async (id: string) => {
    if (!confirm("Excluir este curso? Esta ação não pode ser desfeita.")) return;
    setCourses((prev) => prev.filter((c) => c.id !== id));
    await call(`/admin/courses/${id}`, { method: "DELETE" })
      .then(() => toast("Curso excluído"))
      .catch(load);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Conteúdo</p>
          <h1 className="font-display text-3xl font-semibold text-cream md:text-4xl">
            Cursos
          </h1>
        </div>
        <Button onClick={() => setModal(true)}>
          <FiPlus /> Novo curso
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-cream/5" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="grad-border flex flex-col items-center justify-center py-20 text-center">
          <FiLayers className="mb-4 text-ember-400" size={32} />
          <p className="text-cream/60">Nenhum curso ainda. Crie o primeiro!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <motion.article
              key={c.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate(`/admin/cursos/${c.id}`)}
              className="grad-border group flex cursor-pointer flex-col p-5"
            >
              <div className="flex items-start justify-between">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-widest",
                    c.status === "PUBLISHED"
                      ? "bg-ember-500/15 text-ember-300"
                      : "bg-cream/10 text-cream/50",
                  )}
                >
                  {c.status === "PUBLISHED" ? "Publicado" : "Rascunho"}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(c.id);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-cream/40 opacity-0 transition-all hover:bg-red-500/15 hover:text-red-300 group-hover:opacity-100"
                >
                  <FiTrash2 size={15} />
                </button>
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold leading-tight text-cream">
                {c.title}
              </h3>
              <div className="mt-1 font-mono text-[0.7rem] text-cream/45">
                {c.category?.name ?? "Sem categoria"} · {levelLabels[c.level]}
              </div>
              <div className="mt-auto flex items-center justify-between pt-5">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-cream/50">
                  <FiUsers size={12} /> {c._count.enrollments}
                </span>
                <span className="font-display font-semibold text-cream">
                  {c.isFree ? (
                    <span className="text-molten">Grátis</span>
                  ) : (
                    `R$ ${(c.price / 100).toFixed(0)}`
                  )}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <CreateCourseModal
            onClose={() => setModal(false)}
            onCreated={() => {
              setModal(false);
              load();
              toast("Curso criado com sucesso");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateCourseModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const call = useApi();
  const [err, setErr] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateForm>({
    resolver: zodResolver(createSchema),
    defaultValues: { level: "BEGINNER", isFree: false, publish: true },
  });
  const isFree = watch("isFree");

  const onSubmit = async (data: CreateForm) => {
    setErr(null);
    try {
      await call("/admin/courses", {
        method: "POST",
        body: {
          title: data.title,
          subtitle: data.subtitle,
          category: data.category || undefined,
          level: data.level,
          isFree: data.isFree,
          price: data.isFree ? 0 : Math.round((data.priceReais ?? 0) * 100),
          publish: data.publish,
          outcomes: (data.outcomes ?? "")
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
            .slice(0, 12),
        },
      });
      onCreated();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Erro ao criar o curso.");
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
            Novo curso
          </h2>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-cream/50 hover:bg-cream/5"
          >
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {err && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {err}
            </div>
          )}
          <Input label="Título" placeholder="React do Zero ao Deploy" error={errors.title?.message} {...register("title")} />
          <Input label="Subtítulo" placeholder="Uma frase que vende o curso" {...register("subtitle")} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Categoria" placeholder="Front-end" {...register("category")} />
            <div>
              <label className="mb-2 block font-mono text-[0.7rem] uppercase tracking-widest text-cream/50">
                Nível
              </label>
              <select
                {...register("level")}
                className="h-12 w-full rounded-xl border border-cream/10 bg-iron-950/60 px-3 text-cream outline-none focus:border-ember-500/50"
              >
                <option value="BEGINNER">Iniciante</option>
                <option value="INTERMEDIATE">Intermediário</option>
                <option value="ADVANCED">Avançado</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-6 rounded-xl border border-cream/10 bg-iron-950/40 px-4 py-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-cream/70">
              <input type="checkbox" {...register("isFree")} className="accent-ember-500" />
              Curso gratuito
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-cream/70">
              <input type="checkbox" {...register("publish")} className="accent-ember-500" />
              Publicar já
            </label>
          </div>

          {!isFree && (
            <Input
              label="Preço (R$)"
              type="number"
              step="1"
              placeholder="297"
              {...register("priceReais")}
            />
          )}

          <div>
            <label className="mb-2 block font-mono text-[0.7rem] uppercase tracking-widest text-cream/50">
              O que o aluno vai aprender (uma por linha) — vai no certificado
            </label>
            <textarea
              {...register("outcomes")}
              rows={4}
              placeholder={"Componentizar interfaces\nGerenciar estado com hooks\nConsumir APIs REST"}
              className="w-full rounded-xl border border-cream/10 bg-iron-950/60 px-4 py-3 text-sm text-cream placeholder:text-cream/30 outline-none focus:border-ember-500/50"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Criando…" : "Criar curso"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiPlus, FiX, FiUserMinus, FiMail, FiBookOpen } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/contexts/ToastContext";
import { API_BASE, ApiError } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface Instructor {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  _count: { enrollments: number; certificates: number };
}

const schema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[a-z]/, "Inclua minúscula")
    .regex(/[A-Z]/, "Inclua maiúscula")
    .regex(/[0-9]/, "Inclua número"),
  role: z.enum(["INSTRUCTOR", "ADMIN"]),
});
type Form = z.infer<typeof schema>;

export function Professores() {
  const call = useApi();
  const toast = useToast();
  const [items, setItems] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);

  const load = () =>
    call<{ items: Instructor[] }>("/admin/users?role=INSTRUCTOR&perPage=50")
      .then((r) => setItems(r.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, [call]);

  const demote = async (id: string) => {
    if (!confirm("Remover o papel de professor deste usuário?")) return;
    setItems((p) => p.filter((u) => u.id !== id));
    await call(`/admin/users/${id}`, { method: "PATCH", body: { role: "STUDENT" } })
      .then(() => toast("Professor removido"))
      .catch(load);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Equipe</p>
          <h1 className="font-display text-3xl font-semibold text-cream md:text-4xl">
            Professores
          </h1>
        </div>
        <Button onClick={() => setModal(true)}>
          <FiPlus /> Novo professor
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-cream/5" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="grad-border flex flex-col items-center gap-3 py-16 text-center">
          <FiBookOpen size={30} className="text-ember-400" />
          <p className="text-cream/60">
            Nenhum professor ainda. Cadastre o primeiro membro da equipe.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="grad-border group p-5"
            >
              <div className="flex items-start justify-between">
                <div className="h-14 w-14 overflow-hidden rounded-2xl bg-molten-soft">
                  {p.avatarUrl ? (
                    <img
                      src={`${API_BASE}${p.avatarUrl}`}
                      alt={p.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-display text-lg font-bold text-iron-950">
                      {p.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => demote(p.id)}
                  title="Remover professor"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-cream/40 opacity-0 transition-all hover:bg-red-500/15 hover:text-red-300 group-hover:opacity-100"
                >
                  <FiUserMinus size={15} />
                </button>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-cream">
                {p.name}
              </h3>
              <div className="mt-1 inline-flex items-center gap-1.5 font-mono text-xs text-cream/45">
                <FiMail size={11} /> {p.email}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <NewInstructorModal
            onClose={() => setModal(false)}
            onCreated={() => {
              setModal(false);
              load();
              toast("Professor cadastrado");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function NewInstructorModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const call = useApi();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(schema), defaultValues: { role: "INSTRUCTOR" } });

  const onSubmit = async (data: Form) => {
    try {
      await call("/admin/users", { method: "POST", body: data });
      onCreated();
    } catch (e) {
      toast(e instanceof ApiError ? e.message : "Erro ao cadastrar", "error");
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
        className="grad-border relative z-10 w-full max-w-md p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-cream">
            Novo professor
          </h2>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-cream/50 hover:bg-cream/5"
          >
            <FiX size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Nome" placeholder="Marina Alvez" error={errors.name?.message} {...register("name")} />
          <Input label="E-mail" type="email" placeholder="marina@forja.dev" error={errors.email?.message} {...register("email")} />
          <Input label="Senha inicial" type="password" placeholder="Mín. 8, maiúscula e número" error={errors.password?.message} {...register("password")} />
          <div>
            <label className="mb-2 block font-mono text-[0.7rem] uppercase tracking-widest text-cream/50">
              Papel
            </label>
            <select
              {...register("role")}
              className="h-12 w-full rounded-xl border border-cream/10 bg-iron-950/60 px-3 text-cream outline-none focus:border-ember-500/50"
            >
              <option value="INSTRUCTOR">Professor</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
          <p className="text-xs text-cream/40">
            A conta é criada na hora. Convite por e-mail (Resend) entra quando a
            chave de API for configurada.
          </p>
          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Criando…" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

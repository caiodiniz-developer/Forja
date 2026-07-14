import { useEffect, useState } from "react";
import { FiSave } from "react-icons/fi";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/contexts/ToastContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AccountSettings } from "@/components/dashboard/AccountSettings";
import { cn } from "@/lib/utils";

type Field = {
  key: string;
  label: string;
  type: "text" | "textarea" | "toggle" | "select";
  def?: string;
  options?: [string, string][];
  hint?: string;
};

const GROUPS: { key: string; label: string; fields: Field[] }[] = [
  { key: "conta", label: "Minha conta", fields: [] },
  {
    key: "geral",
    label: "Geral",
    fields: [
      { key: "platformName", label: "Nome da plataforma", type: "text", def: "Forja" },
      { key: "supportEmail", label: "E-mail de suporte", type: "text", def: "" },
      { key: "tagline", label: "Slogan", type: "text", def: "" },
    ],
  },
  {
    key: "plataforma",
    label: "Plataforma",
    fields: [
      { key: "allowSignups", label: "Permitir novos cadastros", type: "toggle", def: "true" },
      { key: "defaultPlan", label: "Plano padrão", type: "select", options: [["FREE", "Grátis"], ["PRO", "PRO"]], def: "FREE" },
      { key: "maintenanceMode", label: "Modo manutenção", type: "toggle", def: "false" },
    ],
  },
  {
    key: "cursos",
    label: "Cursos",
    fields: [
      { key: "autoPublish", label: "Publicar cursos automaticamente", type: "toggle", def: "true" },
      { key: "freePreviewLessons", label: "Aulas de amostra liberadas (grátis)", type: "text", def: "2" },
    ],
  },
  {
    key: "certificados",
    label: "Certificados",
    fields: [
      { key: "certEnabled", label: "Emitir certificados ao concluir", type: "toggle", def: "true" },
      { key: "certSignature", label: "Assinatura no certificado", type: "text", def: "Equipe Forja" },
    ],
  },
  {
    key: "seo",
    label: "SEO",
    fields: [
      { key: "seoTitle", label: "Título (meta title)", type: "text", def: "" },
      { key: "seoDescription", label: "Descrição (meta description)", type: "textarea", def: "" },
    ],
  },
  {
    key: "seguranca",
    label: "Segurança",
    fields: [
      { key: "require2fa", label: "Exigir 2FA para administradores", type: "toggle", def: "false" },
      { key: "sessionDays", label: "Duração da sessão (dias)", type: "text", def: "7" },
    ],
  },
  {
    key: "upload",
    label: "Upload",
    fields: [
      { key: "maxVideoGb", label: "Tamanho máximo de vídeo (GB)", type: "text", def: "5" },
      { key: "maxMaterialMb", label: "Tamanho máximo de material (MB)", type: "text", def: "200" },
    ],
  },
];

const allFields = GROUPS.flatMap((g) => g.fields);

export function Config() {
  const call = useApi();
  const toast = useToast();
  const [tab, setTab] = useState("conta");
  const [values, setValues] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const defaults = Object.fromEntries(allFields.map((f) => [f.key, f.def ?? ""]));
    call<{ settings: Record<string, string> }>("/admin/settings")
      .then((r) => setValues({ ...defaults, ...r.settings }))
      .catch(() => setValues(defaults));
  }, [call]);

  const set = (k: string, v: string) => setValues((s) => ({ ...s, [k]: v }));

  const save = async () => {
    setBusy(true);
    try {
      await call("/admin/settings", { method: "PATCH", body: values });
      toast("Configurações salvas");
    } catch {
      toast("Erro ao salvar", "error");
    } finally {
      setBusy(false);
    }
  };

  const group = GROUPS.find((g) => g.key === tab)!;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Ajustes</p>
          <h1 className="font-display text-3xl font-semibold text-cream md:text-4xl">
            Configurações
          </h1>
        </div>
        {tab !== "conta" && (
          <Button onClick={save} disabled={busy}>
            <FiSave /> {busy ? "Salvando…" : "Salvar alterações"}
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-[200px_1fr]">
        {/* tabs */}
        <div className="flex gap-1 overflow-x-auto md:flex-col">
          {GROUPS.map((g) => (
            <button
              key={g.key}
              onClick={() => setTab(g.key)}
              className={cn(
                "whitespace-nowrap rounded-xl px-4 py-2.5 text-left text-sm transition-colors",
                tab === g.key
                  ? "bg-ember-500/12 font-medium text-cream"
                  : "text-cream/55 hover:bg-cream/5 hover:text-cream",
              )}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* fields */}
        {tab === "conta" ? (
          <AccountSettings />
        ) : (
        <div className="grad-border space-y-5 p-6">
          {group.fields.map((f) => (
            <div key={f.key}>
              {f.type === "toggle" ? (
                <button
                  onClick={() => set(f.key, values[f.key] === "true" ? "false" : "true")}
                  className="flex w-full items-center justify-between"
                >
                  <span className="text-sm text-cream/80">{f.label}</span>
                  <span
                    className={cn(
                      "relative h-6 w-11 rounded-full transition-colors",
                      values[f.key] === "true" ? "bg-molten" : "bg-cream/15",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 h-5 w-5 rounded-full bg-cream transition-transform",
                        values[f.key] === "true" ? "translate-x-[22px]" : "translate-x-0.5",
                      )}
                    />
                  </span>
                </button>
              ) : f.type === "textarea" ? (
                <div>
                  <label className="mb-2 block font-mono text-[0.7rem] uppercase tracking-widest text-cream/50">
                    {f.label}
                  </label>
                  <textarea
                    value={values[f.key] ?? ""}
                    onChange={(e) => set(f.key, e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-cream/10 bg-iron-950/60 px-4 py-3 text-sm text-cream outline-none focus:border-ember-500/50"
                  />
                </div>
              ) : f.type === "select" ? (
                <div>
                  <label className="mb-2 block font-mono text-[0.7rem] uppercase tracking-widest text-cream/50">
                    {f.label}
                  </label>
                  <select
                    value={values[f.key] ?? ""}
                    onChange={(e) => set(f.key, e.target.value)}
                    className="h-12 w-full rounded-xl border border-cream/10 bg-iron-950/60 px-3 text-cream outline-none focus:border-ember-500/50"
                  >
                    {f.options?.map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <Input
                  label={f.label}
                  value={values[f.key] ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}

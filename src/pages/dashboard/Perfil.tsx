import { useState } from "react";
import { FiCheck, FiZap, FiStar } from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/contexts/ToastContext";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { AccountSettings } from "@/components/dashboard/AccountSettings";
import { Button } from "@/components/ui/Button";

const proPerks = [
  "Catálogo completo (200+ cursos)",
  "Todas as aulas e materiais",
  "Certificados verificáveis",
  "Eventos e mentorias ao vivo",
];

export function Perfil() {
  const { user, refreshMe } = useAuth();
  const call = useApi();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const isPro = user?.plan === "PRO";

  const changePlan = async (plan: "FREE" | "PRO") => {
    setBusy(true);
    try {
      await call("/billing/checkout", { method: "POST", body: { plan } });
      await refreshMe();
      toast(plan === "PRO" ? "Plano PRO ativado! 🔥" : "Plano alterado para grátis");
    } catch {
      toast("Não foi possível alterar o plano", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="eyebrow mb-2">Conta</p>
        <h1 className="font-display text-3xl font-semibold text-cream md:text-4xl">
          Perfil e plano
        </h1>
      </div>

      {/* profile — photo, name, email, password */}
      <AccountSettings />

      {/* plan */}
      <GlassPanel title="Seu plano">
        <div className="grid gap-5 md:grid-cols-2">
          {/* free */}
          <div
            className={`rounded-2xl border p-6 ${
              !isPro ? "border-ember-500/40 bg-ember-500/[0.05]" : "border-cream/[0.07]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-semibold text-cream">
                Grátis
              </span>
              {!isPro && (
                <span className="rounded-full bg-molten px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-widest text-iron-950">
                  atual
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-cream/55">
              Cursos gratuitos e aulas de amostra. Para sempre.
            </p>
            {isPro && (
              <Button
                variant="outline"
                size="sm"
                className="mt-5 w-full"
                disabled={busy}
                onClick={() => changePlan("FREE")}
              >
                Voltar para o grátis
              </Button>
            )}
          </div>

          {/* pro */}
          <div
            className={`relative overflow-hidden rounded-2xl border p-6 ${
              isPro ? "border-ember-500/40 bg-ember-500/[0.05]" : "border-ember-500/30"
            }`}
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-ember-500/15 blur-3xl" />
            <div className="relative flex items-center justify-between">
              <span className="inline-flex items-center gap-2 font-display text-lg font-semibold text-cream">
                <FiZap className="text-ember-400" /> PRO
              </span>
              {isPro ? (
                <span className="rounded-full bg-molten px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-widest text-iron-950">
                  ativo
                </span>
              ) : (
                <span className="font-display text-xl font-semibold text-cream">
                  R$ 89<span className="text-sm text-cream/50">/mês</span>
                </span>
              )}
            </div>
            <ul className="relative mt-4 space-y-2">
              {proPerks.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-cream/75">
                  <FiCheck className="text-ember-400" size={14} /> {p}
                </li>
              ))}
            </ul>
            {!isPro && (
              <Button
                size="sm"
                className="relative mt-5 w-full"
                disabled={busy}
                onClick={() => changePlan("PRO")}
              >
                <FiStar /> {busy ? "Processando…" : "Assinar PRO agora"}
              </Button>
            )}
          </div>
        </div>
        <p className="mt-4 text-center font-mono text-[0.7rem] text-cream/40">
          Checkout de demonstração — altera o plano na hora, sem cobrança real.
        </p>
      </GlassPanel>
    </div>
  );
}

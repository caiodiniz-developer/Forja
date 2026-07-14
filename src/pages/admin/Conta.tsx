import { AccountSettings } from "@/components/dashboard/AccountSettings";

export function Conta() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="eyebrow mb-2">Conta</p>
        <h1 className="font-display text-3xl font-semibold text-cream md:text-4xl">
          Minha conta
        </h1>
        <p className="mt-1 text-cream/55">
          Atualize sua foto, e-mail e senha.
        </p>
      </div>
      <AccountSettings />
    </div>
  );
}

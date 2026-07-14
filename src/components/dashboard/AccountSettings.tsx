import { useRef, useState } from "react";
import { FiCamera, FiSave, FiLock } from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/contexts/ToastContext";
import { API_BASE, ApiError } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function AccountSettings() {
  const { user, accessToken, refreshMe } = useAuth();
  const call = useApi();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [pw, setPw] = useState({ current: "", next: "" });
  const [savingPw, setSavingPw] = useState(false);

  const initials = user?.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      const body: Record<string, string> = {};
      if (name && name !== user?.name) body.name = name;
      if (email && email !== user?.email) body.email = email;
      if (Object.keys(body).length === 0) {
        toast("Nada para salvar", "info");
        return;
      }
      await call("/account/profile", { method: "PATCH", body });
      await refreshMe();
      toast("Perfil atualizado");
    } catch (e) {
      toast(e instanceof ApiError ? e.message : "Erro ao salvar", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("avatar", file);
      const res = await fetch(`${API_BASE}/account/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: form,
      });
      if (!res.ok) throw new Error();
      await refreshMe();
      toast("Foto atualizada");
    } catch {
      toast("Falha ao enviar a foto", "error");
    } finally {
      setUploading(false);
    }
  };

  const changePassword = async () => {
    if (!pw.current || !pw.next) return;
    setSavingPw(true);
    try {
      await call("/account/password", {
        method: "POST",
        body: { currentPassword: pw.current, newPassword: pw.next },
      });
      setPw({ current: "", next: "" });
      toast("Senha alterada");
    } catch (e) {
      toast(e instanceof ApiError ? e.message : "Erro ao trocar senha", "error");
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* photo + basics */}
      <div className="grad-border p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative">
            <div className="h-24 w-24 overflow-hidden rounded-2xl bg-molten-soft">
              {user?.avatarUrl ? (
                <img
                  src={`${API_BASE}${user.avatarUrl}`}
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-display text-3xl font-bold text-iron-950">
                  {initials}
                </div>
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl border border-iron-950 bg-molten text-iron-950 shadow-ember hover:scale-105"
              title="Trocar foto"
            >
              <FiCamera size={16} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => e.target.files?.[0] && uploadAvatar(e.target.files[0])}
            />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-lg font-semibold text-cream">
              {user?.name}
            </h3>
            <p className="font-mono text-xs text-cream/45">
              {user?.role === "ADMIN" ? "Administrador" : user?.role === "INSTRUCTOR" ? "Professor" : "Aluno"}
              {" · "}
              {uploading ? "enviando foto…" : "PNG ou JPG, até 5 MB"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} />
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mt-5">
          <Button onClick={saveProfile} disabled={savingProfile}>
            <FiSave /> {savingProfile ? "Salvando…" : "Salvar dados"}
          </Button>
        </div>
      </div>

      {/* password */}
      <div className="grad-border p-6">
        <h3 className="mb-4 inline-flex items-center gap-2 font-display text-lg font-semibold text-cream">
          <FiLock size={16} className="text-ember-400" /> Trocar senha
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Senha atual"
            type="password"
            value={pw.current}
            onChange={(e) => setPw({ ...pw, current: e.target.value })}
          />
          <Input
            label="Nova senha"
            type="password"
            placeholder="Mín. 8 caracteres, maiúscula e número"
            value={pw.next}
            onChange={(e) => setPw({ ...pw, next: e.target.value })}
          />
        </div>
        <div className="mt-5">
          <Button
            variant="outline"
            onClick={changePassword}
            disabled={savingPw || !pw.current || !pw.next}
          >
            {savingPw ? "Alterando…" : "Alterar senha"}
          </Button>
        </div>
      </div>
    </div>
  );
}

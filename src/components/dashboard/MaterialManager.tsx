import { useRef, useState } from "react";
import {
  FiFileText,
  FiImage,
  FiArchive,
  FiFile,
  FiGithub,
  FiFigma,
  FiBookOpen,
  FiLink,
  FiTrash2,
  FiPlus,
  FiPaperclip,
  FiDownload,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import { useAuth } from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/contexts/ToastContext";
import { API_BASE } from "@/lib/api";

export interface Material {
  id: string;
  name: string;
  kind: string;
  url: string;
  sizeBytes: number;
}

const LINK_KINDS = ["link", "github", "figma", "docs"];
const kindIcon: Record<string, IconType> = {
  pdf: FiFileText,
  image: FiImage,
  zip: FiArchive,
  file: FiFile,
  github: FiGithub,
  figma: FiFigma,
  docs: FiBookOpen,
  link: FiLink,
};

export function MaterialManager({
  lessonId,
  materials,
  onChange,
}: {
  lessonId: string;
  materials: Material[];
  onChange: (materials: Material[]) => void;
}) {
  const { accessToken } = useAuth();
  const call = useApi();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [adding, setAdding] = useState(false);
  const [link, setLink] = useState({ name: "", url: "", kind: "github" });
  const [busy, setBusy] = useState(false);

  const uploadFile = async (file: File) => {
    setBusy(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(
        `${API_BASE}/admin/content/lessons/${lessonId}/materials/file`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: form,
        },
      );
      if (!res.ok) throw new Error();
      const { material } = await res.json();
      onChange([...materials, material]);
      toast("Material enviado");
    } catch {
      toast("Falha ao enviar material", "error");
    } finally {
      setBusy(false);
    }
  };

  const addLink = async () => {
    if (!link.name.trim() || !link.url.trim()) return;
    setBusy(true);
    try {
      const { material } = await call<{ material: Material }>(
        `/admin/content/lessons/${lessonId}/materials/link`,
        { method: "POST", body: link },
      );
      onChange([...materials, material]);
      setLink({ name: "", url: "", kind: "github" });
      setAdding(false);
      toast("Link adicionado");
    } catch {
      toast("Não foi possível adicionar", "error");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    onChange(materials.filter((m) => m.id !== id));
    await call(`/admin/content/materials/${id}`, { method: "DELETE" }).catch(() =>
      toast("Erro ao remover", "error"),
    );
  };

  return (
    <div className="mt-3 rounded-xl border border-cream/[0.06] bg-iron-950/30 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-cream/45">
          <FiPaperclip size={11} /> Materiais ({materials.length})
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-cream/60 hover:bg-cream/5 hover:text-cream"
          >
            <FiPlus size={12} /> Arquivo
          </button>
          <button
            onClick={() => setAdding((v) => !v)}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-cream/60 hover:bg-cream/5 hover:text-cream"
          >
            <FiLink size={12} /> Link
          </button>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        hidden
        onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])}
      />

      {adding && (
        <div className="mb-2 grid gap-2 rounded-lg bg-iron-950/50 p-2 sm:grid-cols-[1fr_1fr_auto_auto]">
          <input
            value={link.name}
            onChange={(e) => setLink({ ...link, name: e.target.value })}
            placeholder="Nome"
            className="h-9 rounded-lg border border-cream/10 bg-iron-950/60 px-2 text-xs text-cream outline-none focus:border-ember-500/50"
          />
          <input
            value={link.url}
            onChange={(e) => setLink({ ...link, url: e.target.value })}
            placeholder="https://…"
            className="h-9 rounded-lg border border-cream/10 bg-iron-950/60 px-2 text-xs text-cream outline-none focus:border-ember-500/50"
          />
          <select
            value={link.kind}
            onChange={(e) => setLink({ ...link, kind: e.target.value })}
            className="h-9 rounded-lg border border-cream/10 bg-iron-950/60 px-2 text-xs text-cream outline-none"
          >
            <option value="github">GitHub</option>
            <option value="figma">Figma</option>
            <option value="docs">Docs</option>
            <option value="link">Link</option>
          </select>
          <button
            onClick={addLink}
            disabled={busy}
            className="rounded-lg bg-molten px-3 text-xs font-medium text-iron-950"
          >
            Add
          </button>
        </div>
      )}

      {materials.length > 0 && (
        <div className="space-y-1">
          {materials.map((m) => {
            const Icon = kindIcon[m.kind] ?? FiFile;
            const isLink = LINK_KINDS.includes(m.kind);
            return (
              <div
                key={m.id}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-cream/5"
              >
                <Icon size={14} className="shrink-0 text-ember-400" />
                <span className="min-w-0 flex-1 truncate text-xs text-cream/80">
                  {m.name}
                </span>
                <a
                  href={`${API_BASE}/media/materials/${m.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cream/40 hover:text-ember-300"
                  title={isLink ? "Abrir" : "Baixar"}
                >
                  {isLink ? <FiLink size={13} /> : <FiDownload size={13} />}
                </a>
                <button
                  onClick={() => remove(m.id)}
                  className="text-cream/40 hover:text-red-300"
                >
                  <FiTrash2 size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

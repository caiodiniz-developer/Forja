import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiUploadCloud, FiPlay, FiX, FiCheckCircle, FiRefreshCw } from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE } from "@/lib/api";
import { cn } from "@/lib/utils";

interface VideoUploaderProps {
  lessonId: string;
  videoId: string | null;
  onUploaded: (videoId: string) => void;
}

/** Drag-and-drop video upload with real progress (XHR), cancel, and inline preview. */
export function VideoUploader({ lessonId, videoId, onUploaded }: VideoUploaderProps) {
  const { accessToken } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [preview, setPreview] = useState(false);

  const start = (file: File) => {
    if (!file.type.startsWith("video/")) {
      setError("Selecione um arquivo de vídeo.");
      return;
    }
    setError(null);
    setProgress(0);

    const form = new FormData();
    form.append("video", file);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    xhr.open("POST", `${API_BASE}/admin/content/lessons/${lessonId}/video`);
    xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      setProgress(null);
      xhrRef.current = null;
      if (xhr.status >= 200 && xhr.status < 300) {
        const res = JSON.parse(xhr.responseText);
        onUploaded(res.video.id);
      } else {
        try {
          setError(JSON.parse(xhr.responseText).error ?? "Falha no upload.");
        } catch {
          setError("Falha no upload.");
        }
      }
    };
    xhr.onerror = () => {
      setProgress(null);
      setError("Erro de conexão durante o upload.");
    };
    xhr.onabort = () => setProgress(null);
    xhr.send(form);
  };

  const cancel = () => xhrRef.current?.abort();

  // ---- uploading state ----
  if (progress !== null) {
    return (
      <div className="rounded-xl border border-ember-500/30 bg-iron-950/50 p-3">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-2 text-ember-300">
            <FiUploadCloud size={14} /> Enviando… {progress}%
          </span>
          <button
            onClick={cancel}
            className="inline-flex items-center gap-1 text-cream/50 hover:text-red-300"
          >
            <FiX size={13} /> cancelar
          </button>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-cream/10">
          <motion.div
            className="h-full rounded-full bg-molten"
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.2 }}
          />
        </div>
      </div>
    );
  }

  // ---- has video ----
  if (videoId && !error) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-xl border border-ember-500/25 bg-ember-500/[0.06] px-3 py-2.5">
          <span className="inline-flex items-center gap-2 text-sm text-ember-200">
            <FiCheckCircle size={15} /> Vídeo carregado
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPreview((v) => !v)}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-cream/60 hover:bg-cream/5 hover:text-cream"
            >
              <FiPlay size={12} /> {preview ? "ocultar" : "ver"}
            </button>
            <button
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-cream/60 hover:bg-cream/5 hover:text-cream"
            >
              <FiRefreshCw size={12} /> trocar
            </button>
          </div>
        </div>
        {preview && (
          <video
            src={`${API_BASE}/media/videos/${videoId}`}
            controls
            className="w-full rounded-xl border border-cream/10"
          />
        )}
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          hidden
          onChange={(e) => e.target.files?.[0] && start(e.target.files[0])}
        />
      </div>
    );
  }

  // ---- empty / dropzone ----
  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (e.dataTransfer.files[0]) start(e.dataTransfer.files[0]);
        }}
        className={cn(
          "flex w-full flex-col items-center gap-1.5 rounded-xl border border-dashed px-4 py-5 text-center transition-colors",
          drag
            ? "border-ember-500 bg-ember-500/10"
            : "border-cream/15 hover:border-ember-500/40 hover:bg-cream/[0.02]",
        )}
      >
        <FiUploadCloud size={22} className="text-ember-400" />
        <span className="text-sm text-cream/70">
          Arraste um vídeo ou <span className="text-ember-300">clique para enviar</span>
        </span>
        <span className="font-mono text-[0.65rem] text-cream/40">
          MP4, WEBM, MOV — até 5 GB
        </span>
      </button>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        hidden
        onChange={(e) => e.target.files?.[0] && start(e.target.files[0])}
      />
    </div>
  );
}

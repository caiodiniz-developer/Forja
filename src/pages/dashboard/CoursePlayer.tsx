import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiArrowLeft,
  FiCheck,
  FiLock,
  FiPlay,
  FiAward,
  FiCircle,
  FiDownload,
  FiLink,
  FiPaperclip,
} from "react-icons/fi";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { LessonComments } from "@/components/dashboard/LessonComments";
import { cn } from "@/lib/utils";

interface Material {
  id: string;
  name: string;
  kind: string;
  url: string;
  sizeBytes: number;
}
interface Lesson {
  id: string;
  title: string;
  type: string;
  durationSec: number;
  hasVideo: boolean;
  videoId: string | null;
  completed: boolean;
  lastSecond: number;
  description: string | null;
  materials: Material[];
}
interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}
interface CourseData {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  isFree: boolean;
  outcomes: string[];
  instructor: { name: string };
  progressPct: number;
  completedCount: number;
  totalLessons: number;
  modules: Module[];
}

export function CoursePlayer() {
  const { slug } = useParams<{ slug: string }>();
  const call = useApi();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const coursesHref = isAdmin ? "/admin/cursos" : "/painel/cursos";
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const locked =
    course && !course.isFree && user?.plan !== "PRO" && user?.role !== "ADMIN";

  useEffect(() => {
    call<{ course: CourseData }>(`/learning/courses/${slug}`)
      .then((r) => {
        setCourse(r.course);
        const flat = r.course.modules.flatMap((m) => m.lessons);
        setCurrentId(flat.find((l) => !l.completed)?.id ?? flat[0]?.id ?? null);
      })
      .catch(() => setCourse(null))
      .finally(() => setLoading(false));
  }, [slug, call]);

  const flat = useMemo(
    () => course?.modules.flatMap((m) => m.lessons) ?? [],
    [course],
  );
  const current = flat.find((l) => l.id === currentId) ?? null;

  const videoRef = useRef<HTMLVideoElement>(null);
  const lastSavedRef = useRef(0);
  const studyTimer = useRef<number | null>(null);

  // Log real watch time while a video is playing (10s heartbeats).
  const startStudyTracking = () => {
    if (studyTimer.current) return;
    studyTimer.current = window.setInterval(() => {
      call("/learning/study", { method: "POST", body: { seconds: 10 } }).catch(
        () => {},
      );
    }, 10000);
  };
  const stopStudyTracking = () => {
    if (studyTimer.current) {
      clearInterval(studyTimer.current);
      studyTimer.current = null;
    }
  };
  useEffect(() => stopStudyTracking, []);

  const savePosition = (secs: number) => {
    if (!current) return;
    if (Math.abs(secs - lastSavedRef.current) < 8) return; // throttle
    lastSavedRef.current = secs;
    call(`/learning/lessons/${current.id}/position`, {
      method: "POST",
      body: { seconds: Math.floor(secs) },
    }).catch(() => {});
  };

  const goNext = () => {
    const idx = flat.findIndex((l) => l.id === currentId);
    if (flat[idx + 1]) setCurrentId(flat[idx + 1].id);
  };

  const complete = async () => {
    if (!current || current.completed) return;
    setBusy(true);
    try {
      const res = await call<{
        progressPct: number;
        completed: boolean;
        certificate?: { code: string };
      }>(`/learning/lessons/${current.id}/complete`, { method: "POST" });
      setCourse((c) =>
        c
          ? {
              ...c,
              progressPct: res.progressPct,
              completedCount: c.completedCount + 1,
              modules: c.modules.map((m) => ({
                ...m,
                lessons: m.lessons.map((l) =>
                  l.id === current.id ? { ...l, completed: true } : l,
                ),
              })),
            }
          : c,
      );
      // advance
      const idx = flat.findIndex((l) => l.id === current.id);
      if (flat[idx + 1]) setCurrentId(flat[idx + 1].id);
      if (res.certificate) setCelebrate(res.certificate.code);
    } finally {
      setBusy(false);
    }
  };

  if (loading)
    return (
      <div className="mx-auto max-w-6xl">
        <div className="h-96 animate-pulse rounded-3xl bg-cream/5" />
      </div>
    );
  if (!course)
    return <div className="text-center text-cream/50">Curso não encontrado.</div>;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <Link
          to={coursesHref}
          className="mb-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cream/50 hover:text-cream"
        >
          <FiArrowLeft size={13} /> Cursos
        </Link>
        <h1 className="font-display text-3xl font-semibold text-cream md:text-4xl">
          {course.title}
        </h1>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-2 w-48 overflow-hidden rounded-full bg-cream/10">
            <motion.div
              className="h-full rounded-full bg-molten"
              animate={{ width: `${course.progressPct}%` }}
            />
          </div>
          <span className="font-mono text-xs text-cream/50">
            {course.progressPct}% · {course.completedCount}/{course.totalLessons} aulas
          </span>
        </div>
      </div>

      {locked ? (
        <div className="grad-border flex flex-col items-center gap-4 py-16 text-center">
          <FiLock size={32} className="text-ember-400" />
          <p className="max-w-sm text-cream/60">
            Este curso é exclusivo do plano PRO. Assine para desbloquear todas as
            aulas.
          </p>
          <Link to="/painel/perfil">
            <Button>Assinar PRO</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* player */}
          <div className="space-y-5 lg:col-span-2">
            <div className="grad-border overflow-hidden p-0">
              {current?.videoId ? (
                <video
                  key={current.videoId}
                  ref={videoRef}
                  src={`${API_BASE}/media/videos/${current.videoId}`}
                  controls
                  autoPlay
                  playsInline
                  className="aspect-video w-full bg-black"
                  onLoadedMetadata={(e) => {
                    const v = e.currentTarget;
                    const resume = current.lastSecond;
                    lastSavedRef.current = resume;
                    if (resume > 5 && resume < v.duration - 5) v.currentTime = resume;
                  }}
                  onTimeUpdate={(e) => savePosition(e.currentTarget.currentTime)}
                  onPlay={startStudyTracking}
                  onPause={stopStudyTracking}
                  onEnded={() => {
                    stopStudyTracking();
                    goNext();
                  }}
                />
              ) : (
                <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-iron-800 to-iron-950 text-center">
                  <div>
                    <FiPlay size={28} className="mx-auto text-cream/30" />
                    <p className="mt-2 text-sm text-cream/40">
                      {current ? "Aula sem vídeo ainda" : "Selecione uma aula"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {current && (
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-semibold text-cream">
                    {current.title}
                  </h2>
                  <span className="font-mono text-xs text-cream/45">
                    {Math.round(current.durationSec / 60)} min
                  </span>
                </div>
                <Button onClick={complete} disabled={busy || current.completed}>
                  <FiCheck />
                  {current.completed ? "Concluída" : "Marcar como concluída"}
                </Button>
              </div>
            )}

            {current?.description && (
              <div className="grad-border p-5">
                <h3 className="mb-2 font-display font-semibold text-cream">
                  Sobre esta aula
                </h3>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-cream/70">
                  {current.description}
                </p>
              </div>
            )}

            {current && current.materials.length > 0 && (
              <div className="grad-border p-5">
                <h3 className="mb-3 inline-flex items-center gap-2 font-display font-semibold text-cream">
                  <FiPaperclip size={16} className="text-ember-400" /> Materiais da aula
                </h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {current.materials.map((m) => {
                    const isLink = ["link", "github", "figma", "docs"].includes(
                      m.kind,
                    );
                    return (
                      <a
                        key={m.id}
                        href={`${API_BASE}/media/materials/${m.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 rounded-xl border border-cream/[0.07] bg-iron-950/40 px-3 py-2.5 transition-colors hover:border-ember-500/30"
                      >
                        {isLink ? (
                          <FiLink size={15} className="shrink-0 text-ember-400" />
                        ) : (
                          <FiDownload size={15} className="shrink-0 text-ember-400" />
                        )}
                        <span className="min-w-0 flex-1 truncate text-sm text-cream/80">
                          {m.name}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {course.outcomes.length > 0 && (
              <div className="grad-border p-5">
                <h3 className="mb-3 font-display font-semibold text-cream">
                  O que você vai aprender
                </h3>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {course.outcomes.map((o) => (
                    <li
                      key={o}
                      className="flex items-center gap-2 text-sm text-cream/70"
                    >
                      <FiCheck className="text-ember-400" size={14} /> {o}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {current && <LessonComments lessonId={current.id} />}
          </div>

          {/* tree */}
          <div className="grad-border h-fit p-4">
            <h3 className="mb-4 px-2 font-display font-semibold text-cream">
              Conteúdo do curso
            </h3>
            <div className="space-y-5">
              {course.modules.map((m, mi) => (
                <div key={m.id}>
                  <div className="mb-2 flex items-center gap-2 px-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-ember-500/10 font-mono text-[0.65rem] text-ember-400">
                      {mi + 1}
                    </span>
                    <span className="text-sm font-medium text-cream">{m.title}</span>
                  </div>
                  <div className="relative ml-4 space-y-1 border-l border-cream/10 pl-4">
                    {m.lessons.map((l) => {
                      const active = l.id === currentId;
                      return (
                        <button
                          key={l.id}
                          onClick={() => setCurrentId(l.id)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors",
                            active
                              ? "bg-ember-500/12 text-cream"
                              : "text-cream/60 hover:bg-cream/5 hover:text-cream",
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                              l.completed
                                ? "bg-molten text-iron-950"
                                : active
                                  ? "border-2 border-ember-400 text-ember-400"
                                  : "border border-cream/20 text-cream/30",
                            )}
                          >
                            {l.completed ? (
                              <FiCheck size={11} strokeWidth={3} />
                            ) : active ? (
                              <FiPlay size={9} fill="currentColor" />
                            ) : (
                              <FiCircle size={7} fill="currentColor" />
                            )}
                          </span>
                          <span className="flex-1 truncate">{l.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* certificate celebration */}
      <AnimatePresence>
        {celebrate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-iron-950/80 backdrop-blur-sm"
              onClick={() => setCelebrate(null)}
            />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="grad-border relative z-10 max-w-sm p-8 text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-molten text-iron-950 shadow-glow">
                <FiAward size={30} />
              </div>
              <h3 className="font-display text-2xl font-semibold text-cream">
                Curso concluído! 🔥
              </h3>
              <p className="mt-2 text-cream/60">
                Seu certificado <span className="font-mono text-ember-300">{celebrate}</span>{" "}
                foi forjado.
              </p>
              <Link to="/painel/certificados">
                <Button className="mt-6 w-full">Ver certificado</Button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

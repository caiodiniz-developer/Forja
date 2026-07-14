import fs from "node:fs";
import path from "node:path";
import { contentRepository } from "./content.repository.js";
import { VIDEO_DIR, MATERIAL_DIR } from "../../config/upload.js";
import { badRequest, notFound } from "../../shared/errors/AppError.js";

export const LINK_KINDS = ["link", "github", "figma", "docs"] as const;

function kindFromFile(mimetype: string, name: string): string {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype === "application/pdf" || name.toLowerCase().endsWith(".pdf"))
    return "pdf";
  if (
    mimetype.includes("zip") ||
    /\.(zip|rar|7z|tar|gz)$/i.test(name)
  )
    return "zip";
  return "file";
}

export interface TreeMaterial {
  id: string;
  name: string;
  kind: string;
  url: string;
  sizeBytes: number;
}
export interface TreeLesson {
  id: string;
  title: string;
  type: string;
  durationSec: number;
  isPreview: boolean;
  content: string | null;
  videoId: string | null;
  materials: TreeMaterial[];
}
export interface TreeModule {
  id: string;
  title: string;
  order: number;
  lessons: TreeLesson[];
}

export const contentService = {
  async getTree(courseId: string): Promise<TreeModule[]> {
    const course = await contentRepository.courseExists(courseId);
    if (!course) throw notFound("Curso não encontrado");

    const modules = await contentRepository.getTree(courseId);
    return modules.map((m) => ({
      id: m.id,
      title: m.title,
      order: m.order,
      // flatten sections' lessons into a single ordered list
      lessons: m.sections.flatMap((s) =>
        s.lessons.map((l) => ({
          id: l.id,
          title: l.title,
          type: l.type,
          durationSec: l.durationSec,
          isPreview: l.isPreview,
          content: l.content,
          videoId: l.video?.id ?? null,
          materials: l.materials.map((mat) => ({
            id: mat.id,
            name: mat.name,
            kind: mat.kind,
            url: mat.url,
            sizeBytes: mat.sizeBytes,
          })),
        })),
      ),
    }));
  },

  async createModule(courseId: string, title: string) {
    const course = await contentRepository.courseExists(courseId);
    if (!course) throw notFound("Curso não encontrado");
    const order = await contentRepository.countModules(courseId);
    return contentRepository.createModuleWithSection(courseId, title, order);
  },

  deleteModule(id: string) {
    return contentRepository.deleteModule(id);
  },

  async createLesson(
    moduleId: string,
    data: { title: string; type: string; isPreview: boolean },
  ) {
    const section =
      (await contentRepository.firstSection(moduleId)) ??
      (await contentRepository.ensureSection(moduleId));
    const order = await contentRepository.countLessons(section.id);
    return contentRepository.createLesson(section.id, { ...data, order });
  },

  deleteLesson(id: string) {
    return contentRepository.deleteLesson(id);
  },

  updateLesson(
    id: string,
    data: { title?: string; content?: string | null; isPreview?: boolean },
  ) {
    return contentRepository.updateLesson(id, data);
  },

  async attachVideo(lessonId: string, filename: string, durationSec: number) {
    const lesson = await contentRepository.findLesson(lessonId);
    if (!lesson) {
      // orphaned upload — clean the file we just streamed to disk
      fs.rm(path.join(VIDEO_DIR, filename), () => {});
      throw notFound("Aula não encontrada");
    }

    // replace previous file, if any
    const prev = await contentRepository.findVideoByLesson(lessonId);
    if (prev?.url && prev.url !== filename) {
      fs.rm(path.join(VIDEO_DIR, prev.url), () => {});
    }

    const video = await contentRepository.upsertVideo(lessonId, filename, durationSec);
    await contentRepository.updateLessonDuration(lessonId, durationSec);
    return { id: video.id, durationSec };
  },

  /** Resolves a video id to an on-disk absolute path (for range streaming). */
  async resolveVideoPath(id: string) {
    const video = await contentRepository.findVideoById(id);
    if (!video) throw notFound("Vídeo não encontrado");
    const filePath = path.join(VIDEO_DIR, video.url);
    if (!fs.existsSync(filePath)) throw notFound("Arquivo de vídeo ausente");
    return filePath;
  },

  requireFile(file?: Express.Multer.File) {
    if (!file) throw badRequest("Nenhum arquivo enviado");
    return file;
  },

  // ---- materials ----
  async addMaterialFile(lessonId: string, file: Express.Multer.File) {
    const lesson = await contentRepository.findLesson(lessonId);
    if (!lesson) {
      fs.rm(path.join(MATERIAL_DIR, file.filename), () => {});
      throw notFound("Aula não encontrada");
    }
    return contentRepository.createMaterial({
      lessonId,
      name: file.originalname,
      url: file.filename,
      kind: kindFromFile(file.mimetype, file.originalname),
      sizeBytes: file.size,
    });
  },

  async addMaterialLink(
    lessonId: string,
    data: { name: string; url: string; kind: string },
  ) {
    const lesson = await contentRepository.findLesson(lessonId);
    if (!lesson) throw notFound("Aula não encontrada");
    return contentRepository.createMaterial({
      lessonId,
      name: data.name,
      url: data.url,
      kind: data.kind,
      sizeBytes: 0,
    });
  },

  async deleteMaterial(id: string) {
    const mat = await contentRepository.findMaterial(id);
    if (!mat) throw notFound("Material não encontrado");
    if (!LINK_KINDS.includes(mat.kind as (typeof LINK_KINDS)[number])) {
      fs.rm(path.join(MATERIAL_DIR, mat.url), () => {});
    }
    await contentRepository.deleteMaterial(id);
    return { id };
  },

  async resolveMaterial(
    id: string,
  ): Promise<
    | { type: "link"; url: string }
    | { type: "file"; filePath: string; name: string }
  > {
    const mat = await contentRepository.findMaterial(id);
    if (!mat) throw notFound("Material não encontrado");
    if (LINK_KINDS.includes(mat.kind as (typeof LINK_KINDS)[number])) {
      return { type: "link", url: mat.url };
    }
    const filePath = path.join(MATERIAL_DIR, mat.url);
    if (!fs.existsSync(filePath)) throw notFound("Arquivo ausente");
    return { type: "file", filePath, name: mat.name };
  },

  reorder(arrangement: { moduleId: string; lessonIds: string[] }[]) {
    return contentRepository.reorderCourse(arrangement);
  },
};

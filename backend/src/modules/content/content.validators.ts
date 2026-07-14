import { z } from "zod";

export const courseIdParams = z.object({ courseId: z.string().min(1) });
export const moduleIdParams = z.object({ moduleId: z.string().min(1) });
export const idParams = z.object({ id: z.string().min(1) });
export const lessonIdParams = z.object({ lessonId: z.string().min(1) });

export const createModuleSchema = z.object({
  title: z.string().min(1, "Informe um título").max(120),
});

export const createLessonSchema = z.object({
  title: z.string().min(1, "Informe um título").max(160),
  type: z.enum(["VIDEO", "TEXT", "QUIZ", "DOWNLOAD"]).default("VIDEO"),
  isPreview: z.boolean().default(false),
});

export const updateLessonSchema = z.object({
  title: z.string().min(1).max(160).optional(),
  content: z.string().max(5000).nullable().optional(), // descrição/nota da aula
  isPreview: z.boolean().optional(),
});

export const materialLinkSchema = z.object({
  name: z.string().min(1).max(140),
  url: z.string().url("Informe uma URL válida"),
  kind: z.enum(["link", "github", "figma", "docs"]).default("link"),
});

export const reorderSchema = z.object({
  modules: z.array(
    z.object({
      moduleId: z.string().min(1),
      lessonIds: z.array(z.string().min(1)),
    }),
  ),
});

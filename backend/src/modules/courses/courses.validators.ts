import { z } from "zod";

export const listCoursesQuery = z.object({
  search: z.string().trim().optional(),
  category: z.string().optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  free: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  sort: z.enum(["recent", "popular", "rating"]).default("recent"),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(48).default(12),
});

export const courseSlugParams = z.object({
  slug: z.string().min(1),
});

export const createCourseSchema = z.object({
  title: z.string().min(3, "Título muito curto").max(120),
  subtitle: z.string().max(160).optional(),
  description: z.string().max(2000).optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).default("BEGINNER"),
  category: z.string().min(2).max(40).optional(),
  price: z.coerce.number().int().min(0).default(0), // cents
  isFree: z.boolean().default(false),
  publish: z.boolean().default(true),
  outcomes: z.array(z.string().min(1)).max(12).optional(), // o que o aluno aprende
});

export const courseIdParams = z.object({ id: z.string().min(1) });

export type ListCoursesQuery = z.infer<typeof listCoursesQuery>;
export type CreateCourseDTO = z.infer<typeof createCourseSchema>;

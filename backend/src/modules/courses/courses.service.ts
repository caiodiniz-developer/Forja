import crypto from "node:crypto";
import type { Prisma } from "@prisma/client";
import { coursesRepository } from "./courses.repository.js";
import type {
  CreateCourseDTO,
  ListCoursesQuery,
} from "./courses.validators.js";
import { notFound } from "../../shared/errors/AppError.js";

function slugify(title: string) {
  const base = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base}-${crypto.randomBytes(3).toString("hex")}`;
}

const sortMap: Record<
  ListCoursesQuery["sort"],
  Prisma.CourseOrderByWithRelationInput
> = {
  recent: { createdAt: "desc" },
  popular: { studentsCount: "desc" },
  rating: { ratingAvg: "desc" },
};

export const coursesService = {
  async list(q: ListCoursesQuery) {
    const where: Prisma.CourseWhereInput = { status: "PUBLISHED" };

    if (q.search) {
      // SQLite's `contains` is already case-insensitive for ASCII.
      where.OR = [
        { title: { contains: q.search } },
        { subtitle: { contains: q.search } },
        { tags: { contains: q.search } },
      ];
    }
    if (q.category) where.category = { slug: q.category };
    if (q.level) where.level = q.level;
    if (q.free !== undefined) where.isFree = q.free;

    const skip = (q.page - 1) * q.perPage;
    const { items, total } = await coursesRepository.list(
      where,
      sortMap[q.sort],
      skip,
      q.perPage,
    );

    return {
      items,
      pagination: {
        page: q.page,
        perPage: q.perPage,
        total,
        totalPages: Math.ceil(total / q.perPage),
      },
    };
  },

  async getBySlug(slug: string) {
    const course = await coursesRepository.findBySlug(slug);
    if (!course) throw notFound("Curso não encontrado");
    return course;
  },

  /* ------------------------------------------------------------- admin */

  adminList() {
    return coursesRepository.adminList();
  },

  async create(dto: CreateCourseDTO, instructorId: string) {
    const data: Prisma.CourseCreateInput = {
      title: dto.title,
      slug: slugify(dto.title),
      subtitle: dto.subtitle,
      description: dto.description,
      level: dto.level,
      price: dto.isFree ? 0 : dto.price,
      isFree: dto.isFree,
      status: dto.publish ? "PUBLISHED" : "DRAFT",
      outcomes: dto.outcomes?.length ? JSON.stringify(dto.outcomes) : null,
      instructor: { connect: { id: instructorId } },
    };

    if (dto.category) {
      const cat = await coursesRepository.upsertCategoryByName(dto.category);
      data.category = { connect: { id: cat.id } };
    }

    return coursesRepository.create(data);
  },

  async remove(id: string) {
    const course = await coursesRepository.findById(id);
    if (!course) throw notFound("Curso não encontrado");
    await coursesRepository.remove(id);
    return { id };
  },
};

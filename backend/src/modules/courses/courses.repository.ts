import type { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";

export const coursesRepository = {
  async list(where: Prisma.CourseWhereInput, orderBy: Prisma.CourseOrderByWithRelationInput, skip: number, take: number) {
    const [items, total] = await Promise.all([
      prisma.course.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          category: true,
          instructor: { select: { id: true, name: true, avatarUrl: true } },
          _count: { select: { modules: true, enrollments: true } },
        },
      }),
      prisma.course.count({ where }),
    ]);
    return { items, total };
  },

  adminList() {
    return prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        instructor: { select: { id: true, name: true } },
        _count: { select: { modules: true, enrollments: true } },
      },
    });
  },

  findById(id: string) {
    return prisma.course.findUnique({ where: { id } });
  },

  create(data: Prisma.CourseCreateInput) {
    return prisma.course.create({ data });
  },

  remove(id: string) {
    return prisma.course.delete({ where: { id } });
  },

  upsertCategoryByName(name: string) {
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
  },

  findBySlug(slug: string) {
    return prisma.course.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: {
        category: true,
        instructor: { select: { id: true, name: true, avatarUrl: true, bio: true } },
        modules: {
          orderBy: { order: "asc" },
          include: {
            sections: {
              orderBy: { order: "asc" },
              include: {
                lessons: {
                  orderBy: { order: "asc" },
                  select: {
                    id: true,
                    title: true,
                    type: true,
                    durationSec: true,
                    isPreview: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  },
};

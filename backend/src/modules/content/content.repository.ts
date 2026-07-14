import { prisma } from "../../config/prisma.js";

export const contentRepository = {
  courseExists(id: string) {
    return prisma.course.findUnique({ where: { id }, select: { id: true } });
  },

  getTree(courseId: string) {
    return prisma.module.findMany({
      where: { courseId },
      orderBy: { order: "asc" },
      include: {
        sections: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              orderBy: { order: "asc" },
              include: {
                video: { select: { id: true, durationSec: true } },
                materials: { orderBy: { createdAt: "asc" } },
              },
            },
          },
        },
      },
    });
  },

  countModules(courseId: string) {
    return prisma.module.count({ where: { courseId } });
  },

  createModuleWithSection(courseId: string, title: string, order: number) {
    return prisma.module.create({
      data: {
        courseId,
        title,
        order,
        sections: { create: { title: "Conteúdo", order: 0 } },
      },
    });
  },

  deleteModule(id: string) {
    return prisma.module.delete({ where: { id } });
  },

  firstSection(moduleId: string) {
    return prisma.section.findFirst({
      where: { moduleId },
      orderBy: { order: "asc" },
      select: { id: true },
    });
  },

  ensureSection(moduleId: string) {
    return prisma.section.create({
      data: { moduleId, title: "Conteúdo", order: 0 },
      select: { id: true },
    });
  },

  countLessons(sectionId: string) {
    return prisma.lesson.count({ where: { sectionId } });
  },

  createLesson(
    sectionId: string,
    data: { title: string; type: string; isPreview: boolean; order: number },
  ) {
    return prisma.lesson.create({ data: { sectionId, ...data } });
  },

  findLesson(id: string) {
    return prisma.lesson.findUnique({ where: { id }, select: { id: true } });
  },

  deleteLesson(id: string) {
    return prisma.lesson.delete({ where: { id } });
  },

  updateLesson(
    id: string,
    data: { title?: string; content?: string | null; isPreview?: boolean },
  ) {
    return prisma.lesson.update({ where: { id }, data });
  },

  findVideoByLesson(lessonId: string) {
    return prisma.video.findUnique({ where: { lessonId } });
  },

  findVideoById(id: string) {
    return prisma.video.findUnique({ where: { id } });
  },

  upsertVideo(lessonId: string, filename: string, durationSec: number) {
    return prisma.video.upsert({
      where: { lessonId },
      update: { url: filename, provider: "upload", durationSec },
      create: { lessonId, url: filename, provider: "upload", durationSec },
    });
  },

  updateLessonDuration(lessonId: string, durationSec: number) {
    return prisma.lesson.update({
      where: { id: lessonId },
      data: { durationSec, type: "VIDEO" },
    });
  },

  // ---- materials ----
  createMaterial(data: {
    lessonId: string;
    name: string;
    url: string;
    kind: string;
    sizeBytes: number;
  }) {
    return prisma.material.create({ data });
  },

  findMaterial(id: string) {
    return prisma.material.findUnique({ where: { id } });
  },

  deleteMaterial(id: string) {
    return prisma.material.delete({ where: { id } });
  },

  // ---- reorder (persists the whole arrangement atomically) ----
  reorderCourse(arrangement: { moduleId: string; lessonIds: string[] }[]) {
    return prisma.$transaction(async (tx) => {
      for (let i = 0; i < arrangement.length; i++) {
        const { moduleId, lessonIds } = arrangement[i];
        await tx.module.update({ where: { id: moduleId }, data: { order: i } });
        let section = await tx.section.findFirst({
          where: { moduleId },
          orderBy: { order: "asc" },
          select: { id: true },
        });
        if (!section) {
          section = await tx.section.create({
            data: { moduleId, title: "Conteúdo", order: 0 },
            select: { id: true },
          });
        }
        for (let j = 0; j < lessonIds.length; j++) {
          await tx.lesson.update({
            where: { id: lessonIds[j] },
            data: { sectionId: section.id, order: j },
          });
        }
      }
    });
  },
};

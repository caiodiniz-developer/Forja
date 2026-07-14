import { prisma } from "../../config/prisma.js";

export const learningRepository = {
  courseBySlug(slug: string) {
    return prisma.course.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: {
        instructor: { select: { id: true, name: true, avatarUrl: true } },
        modules: {
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
        },
      },
    });
  },

  courseByIdBasic(id: string) {
    return prisma.course.findUnique({
      where: { id },
      select: { id: true, title: true, isFree: true },
    });
  },

  completedLessonIds(userId: string, courseId: string) {
    return prisma.lessonProgress.findMany({
      where: {
        userId,
        completed: true,
        lesson: { section: { module: { courseId } } },
      },
      select: { lessonId: true },
    });
  },

  progressForCourse(userId: string, courseId: string) {
    return prisma.lessonProgress.findMany({
      where: { userId, lesson: { section: { module: { courseId } } } },
      select: { lessonId: true, completed: true, lastSecond: true },
    });
  },

  savePosition(userId: string, lessonId: string, seconds: number) {
    return prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { lastSecond: seconds },
      create: { userId, lessonId, lastSecond: seconds },
    });
  },

  enrollment(userId: string, courseId: string) {
    return prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
  },

  upsertEnrollment(userId: string, courseId: string) {
    return prisma.enrollment.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: {},
      create: { userId, courseId, status: "ACTIVE" },
    });
  },

  lessonWithCourse(lessonId: string) {
    return prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        section: { select: { module: { select: { courseId: true } } } },
      },
    });
  },

  markLessonComplete(userId: string, lessonId: string) {
    return prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { completed: true },
      create: { userId, lessonId, completed: true },
    });
  },

  countLessons(courseId: string) {
    return prisma.lesson.count({
      where: { section: { module: { courseId } } },
    });
  },

  countCompleted(userId: string, courseId: string) {
    return prisma.lessonProgress.count({
      where: {
        userId,
        completed: true,
        lesson: { section: { module: { courseId } } },
      },
    });
  },

  updateEnrollment(
    userId: string,
    courseId: string,
    data: { progressPct: number; status?: string; completedAt?: Date },
  ) {
    return prisma.enrollment.update({
      where: { userId_courseId: { userId, courseId } },
      data,
    });
  },

  issueCertificate(userId: string, courseId: string, code: string) {
    return prisma.certificate.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: {},
      create: { userId, courseId, code },
    });
  },

  // ---- stats ----
  enrollments(userId: string) {
    return prisma.enrollment.findMany({ where: { userId } });
  },

  certificatesOf(userId: string) {
    return prisma.certificate.findMany({
      where: { userId },
      orderBy: { issuedAt: "desc" },
      include: {
        course: { select: { title: true, slug: true, outcomes: true } },
      },
    });
  },

  enrollmentsWithCourse(userId: string) {
    return prisma.enrollment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        course: {
          select: {
            title: true,
            slug: true,
            category: { select: { name: true } },
          },
        },
      },
    });
  },

  completedProgress(userId: string) {
    return prisma.lessonProgress.findMany({
      where: { userId, completed: true },
      select: { updatedAt: true, lesson: { select: { durationSec: true } } },
    });
  },

  countCompletedLessons(userId: string) {
    return prisma.lessonProgress.count({ where: { userId, completed: true } });
  },

  addStudySeconds(userId: string, date: string, seconds: number) {
    return prisma.studyLog.upsert({
      where: { userId_date: { userId, date } },
      update: { seconds: { increment: seconds } },
      create: { userId, date, seconds },
    });
  },

  studyLogsOf(userId: string) {
    return prisma.studyLog.findMany({
      where: { userId },
      select: { date: true, seconds: true },
    });
  },
};

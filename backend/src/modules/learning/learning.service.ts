import crypto from "node:crypto";
import { learningRepository as repo } from "./learning.repository.js";
import { notFound } from "../../shared/errors/AppError.js";

function parseList(json: string | null): string[] {
  if (!json) return [];
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

const dayKey = (d: Date) => d.toISOString().slice(0, 10);

export const learningService = {
  async getCourse(slug: string, userId: string) {
    const course = await repo.courseBySlug(slug);
    if (!course) throw notFound("Curso não encontrado");

    const progress = await repo.progressForCourse(userId, course.id);
    const pMap = new Map(progress.map((p) => [p.lessonId, p]));
    const enrollment = await repo.enrollment(userId, course.id);

    const modules = course.modules.map((m) => ({
      id: m.id,
      title: m.title,
      lessons: m.sections.flatMap((s) =>
        s.lessons.map((l) => ({
          id: l.id,
          title: l.title,
          type: l.type,
          durationSec: l.durationSec,
          isPreview: l.isPreview,
          description: l.content,
          hasVideo: !!l.video,
          videoId: l.video?.id ?? null,
          completed: pMap.get(l.id)?.completed ?? false,
          lastSecond: pMap.get(l.id)?.lastSecond ?? 0,
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

    const completed = new Set(
      progress.filter((p) => p.completed).map((p) => p.lessonId),
    );
    const totalLessons = modules.reduce((a, m) => a + m.lessons.length, 0);

    return {
      id: course.id,
      title: course.title,
      slug: course.slug,
      subtitle: course.subtitle,
      description: course.description,
      level: course.level,
      isFree: course.isFree,
      outcomes: parseList(course.outcomes),
      instructor: course.instructor,
      progressPct: enrollment?.progressPct ?? 0,
      enrolled: !!enrollment,
      completedCount: completed.size,
      totalLessons,
      modules,
    };
  },

  enroll(userId: string, courseId: string) {
    return repo.upsertEnrollment(userId, courseId);
  },

  savePosition(userId: string, lessonId: string, seconds: number) {
    return repo.savePosition(userId, lessonId, Math.max(0, Math.round(seconds)));
  },

  async completeLesson(userId: string, lessonId: string) {
    const lesson = await repo.lessonWithCourse(lessonId);
    if (!lesson) throw notFound("Aula não encontrada");
    const courseId = lesson.section.module.courseId;

    await repo.upsertEnrollment(userId, courseId);
    await repo.markLessonComplete(userId, lessonId);

    const [total, done] = await Promise.all([
      repo.countLessons(courseId),
      repo.countCompleted(userId, courseId),
    ]);
    const progressPct = total > 0 ? Math.round((done / total) * 100) : 0;
    const finished = total > 0 && done >= total;

    await repo.updateEnrollment(userId, courseId, {
      progressPct,
      ...(finished ? { status: "COMPLETED", completedAt: new Date() } : {}),
    });

    let certificate: { code: string } | undefined;
    if (finished) {
      const code = `FORJA-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
      const cert = await repo.issueCertificate(userId, courseId, code);
      certificate = { code: cert.code };
    }

    return { progressPct, completed: finished, certificate };
  },

  /** Records actual watch time (in seconds) into today's study log. */
  recordStudy(userId: string, seconds: number) {
    const secs = Math.max(0, Math.min(600, Math.round(seconds)));
    if (secs === 0) return Promise.resolve(null);
    return repo.addStudySeconds(userId, dayKey(new Date()), secs);
  },

  async stats(userId: string) {
    const [enrollments, certificates, lessonsCompleted, logs] =
      await Promise.all([
        repo.enrollments(userId),
        repo.certificatesOf(userId),
        repo.countCompletedLessons(userId),
        repo.studyLogsOf(userId),
      ]);

    // real watch time, per day
    const byDay = new Map(logs.map((l) => [l.date, l.seconds]));
    const totalSeconds = logs.reduce((a, l) => a + l.seconds, 0);
    const minutes = Math.round(totalSeconds / 60);

    // streak: consecutive days (ending today or yesterday) with any study time
    let streak = 0;
    const cursor = new Date();
    if (!(byDay.get(dayKey(cursor)) ?? 0)) cursor.setDate(cursor.getDate() - 1);
    while ((byDay.get(dayKey(cursor)) ?? 0) > 0) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }

    // weekly hours (last 7 days)
    const weekLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const week = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const secs = byDay.get(dayKey(d)) ?? 0;
      return { day: weekLabels[d.getDay()], value: Math.round((secs / 3600) * 10) / 10 };
    });

    return {
      streak,
      minutesStudied: minutes,
      hoursStudied: Math.round(minutes / 60),
      lessonsCompleted,
      coursesInProgress: enrollments.filter((e) => e.status === "ACTIVE").length,
      coursesCompleted: enrollments.filter((e) => e.status === "COMPLETED").length,
      certificates: certificates.length,
      weekly: week,
    };
  },

  async myCourses(userId: string) {
    const enrollments = await repo.enrollmentsWithCourse(userId);
    return enrollments.map((e) => ({
      slug: e.course.slug,
      title: e.course.title,
      category: e.course.category?.name ?? "Geral",
      progressPct: e.progressPct,
      status: e.status,
    }));
  },

  async certificates(userId: string, userName: string) {
    const certs = await repo.certificatesOf(userId);
    return certs.map((c) => ({
      code: c.code,
      issuedAt: c.issuedAt,
      courseTitle: c.course.title,
      courseSlug: c.course.slug,
      outcomes: parseList(c.course.outcomes),
      studentName: userName,
    }));
  },
};

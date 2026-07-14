import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";
import { validate } from "../../middlewares/validate.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { asyncHandler } from "../../shared/http/asyncHandler.js";

const dayKey = (d: Date) => d.toISOString().slice(0, 10);
const monthKey = (d: Date) => d.toISOString().slice(0, 7);

/* ---------------- admin home stats ---------------- */
export const statsRoutes = Router();
statsRoutes.use(authenticate, authorize("ADMIN"));

statsRoutes.get(
  "/",
  asyncHandler(async (_req, res) => {
    const [
      users,
      students,
      instructors,
      admins,
      proUsers,
      courses,
      publishedCourses,
      lessons,
      events,
      certificates,
      enrollments,
      recentUsersRaw,
      recentEnrollments,
      recentCerts,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "INSTRUCTOR" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.user.count({ where: { plan: "PRO" } }),
      prisma.course.count(),
      prisma.course.count({ where: { status: "PUBLISHED" } }),
      prisma.lesson.count(),
      prisma.event.count(),
      prisma.certificate.count(),
      prisma.enrollment.count(),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, role: true, plan: true, createdAt: true },
      }),
      prisma.enrollment.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        include: {
          user: { select: { name: true } },
          course: { select: { title: true } },
        },
      }),
      prisma.certificate.findMany({
        orderBy: { issuedAt: "desc" },
        take: 6,
        include: {
          user: { select: { name: true } },
          course: { select: { title: true } },
        },
      }),
    ]);

    const activity = [
      ...recentEnrollments.map((e) => ({
        who: e.user.name,
        action: "matriculou-se em",
        target: e.course.title,
        at: e.createdAt,
      })),
      ...recentCerts.map((c) => ({
        who: c.user.name,
        action: "concluiu",
        target: c.course.title,
        at: c.issuedAt,
      })),
      ...recentUsersRaw.map((u) => ({
        who: u.name,
        action: "criou conta",
        target: u.role === "ADMIN" ? "administrador" : "aluno",
        at: u.createdAt,
      })),
    ]
      .sort((a, b) => +new Date(b.at) - +new Date(a.at))
      .slice(0, 8);

    res.json({
      counts: {
        users,
        students,
        instructors,
        admins,
        proUsers,
        courses,
        publishedCourses,
        lessons,
        events,
        certificates,
        enrollments,
      },
      recentUsers: recentUsersRaw,
      activity,
    });
  }),
);

/* ---------------- admin analytics ---------------- */
export const analyticsRoutes = Router();
analyticsRoutes.use(authenticate, authorize("ADMIN"));

analyticsRoutes.get(
  "/",
  validate({ query: z.object({ range: z.enum(["7d", "30d", "12m"]).default("30d") }) }),
  asyncHandler(async (req, res) => {
    const range = (req.query.range as string) ?? "30d";
    const now = new Date();
    const start = new Date();
    if (range === "7d") start.setDate(now.getDate() - 6);
    else if (range === "30d") start.setDate(now.getDate() - 29);
    else start.setMonth(now.getMonth() - 11);

    const monthly = range === "12m";

    const [users, progress, enrollments, topCourses, certsInRange, commentsCount, eventsCount] =
      await Promise.all([
        prisma.user.findMany({ where: { createdAt: { gte: start } }, select: { createdAt: true } }),
        prisma.lessonProgress.findMany({
          where: { completed: true },
          select: { updatedAt: true, userId: true, lesson: { select: { durationSec: true } } },
        }),
        prisma.enrollment.findMany({ select: { status: true } }),
        prisma.course.findMany({
          orderBy: { enrollments: { _count: "desc" } },
          take: 6,
          select: { title: true, _count: { select: { enrollments: true } } },
        }),
        prisma.certificate.count({ where: { issuedAt: { gte: start } } }),
        prisma.comment.count(),
        prisma.event.count(),
      ]);

    // signups time series
    const buckets: { label: string; value: number }[] = [];
    if (monthly) {
      for (let i = 0; i < 12; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
        const key = monthKey(d);
        buckets.push({
          label: d.toLocaleDateString("pt-BR", { month: "short" }),
          value: users.filter((u) => monthKey(u.createdAt) === key).length,
        });
      }
    } else {
      const days = range === "7d" ? 7 : 30;
      for (let i = 0; i < days; i++) {
        const d = new Date();
        d.setDate(now.getDate() - (days - 1 - i));
        const key = dayKey(d);
        buckets.push({
          label: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
          value: users.filter((u) => dayKey(u.createdAt) === key).length,
        });
      }
    }

    const hoursStudied = Math.round(
      progress.reduce((a, p) => a + (p.lesson.durationSec || 0), 0) / 3600,
    );
    const completed = enrollments.filter((e) => e.status === "COMPLETED").length;
    const completionRate =
      enrollments.length > 0 ? Math.round((completed / enrollments.length) * 100) : 0;
    const activeUsers = new Set(
      progress.filter((p) => p.updatedAt >= start).map((p) => p.userId),
    ).size;

    res.json({
      range,
      signups: buckets,
      topCourses: topCourses.map((c) => ({
        title: c.title,
        enrollments: c._count.enrollments,
      })),
      totals: {
        newUsers: users.length,
        activeUsers,
        hoursStudied,
        certificatesIssued: certsInRange,
        completionRate,
        comments: commentsCount,
        events: eventsCount,
        enrollments: enrollments.length,
      },
    });
  }),
);

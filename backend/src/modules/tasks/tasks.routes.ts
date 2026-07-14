import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";
import { validate } from "../../middlewares/validate.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { asyncHandler } from "../../shared/http/asyncHandler.js";
import { forbidden, notFound } from "../../shared/errors/AppError.js";

export const tasksRoutes = Router();
tasksRoutes.use(authenticate, authorize("ADMIN", "INSTRUCTOR"));

const STATUS = ["BACKLOG", "IN_PROGRESS", "REVIEW", "DONE"] as const;
const PRIORITY = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

const createSchema = z.object({
  title: z.string().min(2).max(160),
  description: z.string().max(1000).optional(),
  status: z.enum(STATUS).default("BACKLOG"),
  priority: z.enum(PRIORITY).default("MEDIUM"),
  dueDate: z.coerce.date().optional(),
  assigneeId: z.string().optional(),
});

const updateSchema = z.object({
  title: z.string().min(2).max(160).optional(),
  description: z.string().max(1000).nullable().optional(),
  status: z.enum(STATUS).optional(),
  priority: z.enum(PRIORITY).optional(),
  order: z.number().int().optional(),
  dueDate: z.coerce.date().nullable().optional(),
  assigneeId: z.string().nullable().optional(),
});

tasksRoutes.get(
  "/",
  asyncHandler(async (_req, res) => {
    const items = await prisma.task.findMany({
      orderBy: [{ status: "asc" }, { order: "asc" }, { createdAt: "asc" }],
      include: { assignee: { select: { id: true, name: true } } },
    });
    return res.json({ items });
  }),
);

tasksRoutes.post(
  "/",
  validate({ body: createSchema }),
  asyncHandler(async (req, res) => {
    const count = await prisma.task.count({ where: { status: req.body.status } });
    const task = await prisma.task.create({
      data: { ...req.body, order: count, authorId: req.user!.id },
      include: { assignee: { select: { id: true, name: true } } },
    });
    return res.status(201).json({ task });
  }),
);

tasksRoutes.patch(
  "/:id",
  validate({ params: z.object({ id: z.string().min(1) }), body: updateSchema }),
  asyncHandler(async (req, res) => {
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: req.body,
      include: { assignee: { select: { id: true, name: true } } },
    });
    return res.json({ task });
  }),
);

tasksRoutes.delete(
  "/:id",
  validate({ params: z.object({ id: z.string().min(1) }) }),
  asyncHandler(async (req, res) => {
    await prisma.task.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  }),
);

/* ---------------- student: tasks assigned to me ---------------- */
export const myTasksRoutes = Router();
myTasksRoutes.use(authenticate);

myTasksRoutes.get(
  "/",
  asyncHandler(async (req, res) => {
    const items = await prisma.task.findMany({
      where: { assigneeId: req.user!.id },
      orderBy: [{ status: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
      include: { author: { select: { name: true } } },
    });
    return res.json({ items });
  }),
);

myTasksRoutes.patch(
  "/:id",
  validate({
    params: z.object({ id: z.string().min(1) }),
    body: z.object({
      status: z.enum(STATUS).optional(),
      submission: z.string().max(500).nullable().optional(),
    }),
  }),
  asyncHandler(async (req, res) => {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      select: { assigneeId: true },
    });
    if (!task) throw notFound("Tarefa não encontrada");
    if (task.assigneeId !== req.user!.id)
      throw forbidden("Esta tarefa não é sua");

    const updated = await prisma.task.update({
      where: { id: req.params.id },
      data: req.body,
      include: { author: { select: { name: true } } },
    });
    return res.json({ task: updated });
  }),
);

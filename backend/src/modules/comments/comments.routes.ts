import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";
import { validate } from "../../middlewares/validate.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { asyncHandler } from "../../shared/http/asyncHandler.js";
import { forbidden, notFound } from "../../shared/errors/AppError.js";

export const commentsRoutes = Router();
commentsRoutes.use(authenticate);

const authorSelect = {
  id: true,
  name: true,
  avatarUrl: true,
  role: true,
} as const;

/** List a lesson's comments (newest first) with their authors. */
commentsRoutes.get(
  "/lesson/:lessonId",
  validate({ params: z.object({ lessonId: z.string().min(1) }) }),
  asyncHandler(async (req, res) => {
    const items = await prisma.comment.findMany({
      where: { lessonId: req.params.lessonId },
      orderBy: { createdAt: "desc" },
      include: { user: { select: authorSelect } },
    });
    return res.json({ items });
  }),
);

/** Post a comment on a lesson. */
commentsRoutes.post(
  "/lesson/:lessonId",
  validate({
    params: z.object({ lessonId: z.string().min(1) }),
    body: z.object({ body: z.string().min(1, "Escreva algo").max(2000) }),
  }),
  asyncHandler(async (req, res) => {
    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.lessonId },
      select: { id: true },
    });
    if (!lesson) throw notFound("Aula não encontrada");

    const comment = await prisma.comment.create({
      data: {
        body: req.body.body,
        lessonId: req.params.lessonId,
        userId: req.user!.id,
      },
      include: { user: { select: authorSelect } },
    });
    return res.status(201).json({ comment });
  }),
);

/** Delete a comment (author or admin). */
commentsRoutes.delete(
  "/:id",
  validate({ params: z.object({ id: z.string().min(1) }) }),
  asyncHandler(async (req, res) => {
    const comment = await prisma.comment.findUnique({
      where: { id: req.params.id },
      select: { userId: true },
    });
    if (!comment) throw notFound("Comentário não encontrado");
    if (comment.userId !== req.user!.id && req.user!.role !== "ADMIN") {
      throw forbidden("Você só pode excluir seus próprios comentários");
    }
    await prisma.comment.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  }),
);

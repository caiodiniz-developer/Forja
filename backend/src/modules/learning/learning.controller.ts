import type { Request, Response } from "express";
import { learningService } from "./learning.service.js";
import { prisma } from "../../config/prisma.js";

export const learningController = {
  async course(req: Request, res: Response) {
    const course = await learningService.getCourse(req.params.slug, req.user!.id);
    return res.json({ course });
  },

  async enroll(req: Request, res: Response) {
    const enrollment = await learningService.enroll(
      req.user!.id,
      req.params.courseId,
    );
    return res.status(201).json({ enrollment });
  },

  async complete(req: Request, res: Response) {
    const result = await learningService.completeLesson(
      req.user!.id,
      req.params.lessonId,
    );
    return res.json(result);
  },

  async savePosition(req: Request, res: Response) {
    await learningService.savePosition(
      req.user!.id,
      req.params.lessonId,
      Number(req.body.seconds) || 0,
    );
    return res.status(204).send();
  },

  async study(req: Request, res: Response) {
    await learningService.recordStudy(req.user!.id, Number(req.body.seconds) || 0);
    return res.status(204).send();
  },

  async myCourses(req: Request, res: Response) {
    const items = await learningService.myCourses(req.user!.id);
    return res.json({ items });
  },

  async stats(req: Request, res: Response) {
    const stats = await learningService.stats(req.user!.id);
    return res.json({ stats });
  },

  async certificates(req: Request, res: Response) {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { name: true },
    });
    const items = await learningService.certificates(
      req.user!.id,
      user?.name ?? "Aluno",
    );
    return res.json({ items });
  },
};

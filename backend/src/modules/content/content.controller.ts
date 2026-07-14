import type { Request, Response } from "express";
import { contentService } from "./content.service.js";

export const contentController = {
  async tree(req: Request, res: Response) {
    const modules = await contentService.getTree(req.params.courseId);
    return res.json({ modules });
  },

  async createModule(req: Request, res: Response) {
    const module = await contentService.createModule(
      req.params.courseId,
      req.body.title,
    );
    return res.status(201).json({ module });
  },

  async deleteModule(req: Request, res: Response) {
    await contentService.deleteModule(req.params.id);
    return res.status(204).send();
  },

  async createLesson(req: Request, res: Response) {
    const lesson = await contentService.createLesson(
      req.params.moduleId,
      req.body,
    );
    return res.status(201).json({ lesson });
  },

  async deleteLesson(req: Request, res: Response) {
    await contentService.deleteLesson(req.params.id);
    return res.status(204).send();
  },

  async updateLesson(req: Request, res: Response) {
    const lesson = await contentService.updateLesson(req.params.id, req.body);
    return res.json({ lesson });
  },

  async uploadVideo(req: Request, res: Response) {
    const file = contentService.requireFile(req.file);
    const durationSec = Math.max(0, Math.round(Number(req.body.durationSec) || 0));
    const video = await contentService.attachVideo(
      req.params.lessonId,
      file.filename,
      durationSec,
    );
    return res.status(201).json({ video });
  },

  async addMaterialFile(req: Request, res: Response) {
    const file = contentService.requireFile(req.file);
    const material = await contentService.addMaterialFile(
      req.params.lessonId,
      file,
    );
    return res.status(201).json({ material });
  },

  async addMaterialLink(req: Request, res: Response) {
    const material = await contentService.addMaterialLink(
      req.params.lessonId,
      req.body,
    );
    return res.status(201).json({ material });
  },

  async deleteMaterial(req: Request, res: Response) {
    await contentService.deleteMaterial(req.params.id);
    return res.status(204).send();
  },

  async reorder(req: Request, res: Response) {
    await contentService.reorder(req.body.modules);
    return res.status(204).send();
  },
};

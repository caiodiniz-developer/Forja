import type { Request, Response } from "express";
import { coursesService } from "./courses.service.js";
import type { ListCoursesQuery } from "./courses.validators.js";

export const coursesController = {
  async list(req: Request, res: Response) {
    const result = await coursesService.list(
      req.query as unknown as ListCoursesQuery,
    );
    return res.json(result);
  },

  async getBySlug(req: Request, res: Response) {
    const course = await coursesService.getBySlug(req.params.slug);
    return res.json({ course });
  },

  async adminList(_req: Request, res: Response) {
    const items = await coursesService.adminList();
    return res.json({ items });
  },

  async create(req: Request, res: Response) {
    const course = await coursesService.create(req.body, req.user!.id);
    return res.status(201).json({ course });
  },

  async remove(req: Request, res: Response) {
    const result = await coursesService.remove(req.params.id);
    return res.json(result);
  },
};

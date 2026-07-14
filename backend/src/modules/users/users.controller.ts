import type { Request, Response } from "express";
import { usersService } from "./users.service.js";
import type { ListUsersQuery } from "./users.validators.js";

export const usersController = {
  async list(req: Request, res: Response) {
    const result = await usersService.list(
      req.query as unknown as ListUsersQuery,
    );
    return res.json(result);
  },

  async update(req: Request, res: Response) {
    const user = await usersService.update(req.params.id, req.body);
    return res.json({ user });
  },

  async create(req: Request, res: Response) {
    const user = await usersService.create(req.body);
    return res.status(201).json({ user });
  },

  async remove(req: Request, res: Response) {
    await usersService.remove(req.params.id, req.user!.id);
    return res.status(204).send();
  },
};

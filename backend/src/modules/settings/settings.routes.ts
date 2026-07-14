import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";
import { validate } from "../../middlewares/validate.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { asyncHandler } from "../../shared/http/asyncHandler.js";

export const settingsRoutes = Router();
settingsRoutes.use(authenticate, authorize("ADMIN"));

/** All settings as a flat { key: value } map. */
settingsRoutes.get(
  "/",
  asyncHandler(async (_req, res) => {
    const rows = await prisma.setting.findMany();
    const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return res.json({ settings });
  }),
);

/** Upsert any subset of settings. Values are stored as strings. */
settingsRoutes.patch(
  "/",
  validate({ body: z.record(z.string(), z.string()) }),
  asyncHandler(async (req, res) => {
    const entries = Object.entries(req.body as Record<string, string>);
    await prisma.$transaction(
      entries.map(([key, value]) =>
        prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        }),
      ),
    );
    return res.status(204).send();
  }),
);

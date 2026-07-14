import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";
import { validate } from "../../middlewares/validate.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { asyncHandler } from "../../shared/http/asyncHandler.js";

const createEventSchema = z.object({
  title: z.string().min(3).max(140),
  description: z.string().max(1000).optional(),
  kind: z.enum(["LIVE", "WORKSHOP", "WEBINAR"]).default("LIVE"),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date().optional(),
  url: z.string().url().optional(),
});

/* -------- student: upcoming events -------- */
export const eventsRoutes = Router();
eventsRoutes.use(authenticate);
eventsRoutes.get(
  "/",
  asyncHandler(async (_req, res) => {
    const items = await prisma.event.findMany({
      where: { startsAt: { gte: new Date(Date.now() - 2 * 60 * 60 * 1000) } },
      orderBy: { startsAt: "asc" },
      take: 50,
      include: { host: { select: { name: true } } },
    });
    return res.json({ items });
  }),
);

/* -------- admin: manage events -------- */
export const eventsAdminRoutes = Router();
eventsAdminRoutes.use(authenticate, authorize("ADMIN"));

eventsAdminRoutes.get(
  "/",
  asyncHandler(async (_req, res) => {
    const items = await prisma.event.findMany({
      orderBy: { startsAt: "desc" },
      include: { host: { select: { name: true } } },
    });
    return res.json({ items });
  }),
);

eventsAdminRoutes.post(
  "/",
  validate({ body: createEventSchema }),
  asyncHandler(async (req, res) => {
    const event = await prisma.event.create({
      data: { ...req.body, hostId: req.user!.id },
    });
    return res.status(201).json({ event });
  }),
);

eventsAdminRoutes.delete(
  "/:id",
  validate({ params: z.object({ id: z.string().min(1) }) }),
  asyncHandler(async (req, res) => {
    await prisma.event.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  }),
);

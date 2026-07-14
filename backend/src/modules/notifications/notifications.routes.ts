import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";
import { validate } from "../../middlewares/validate.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { asyncHandler } from "../../shared/http/asyncHandler.js";

/* -------- student -------- */
export const notificationsRoutes = Router();
notificationsRoutes.use(authenticate);

notificationsRoutes.get(
  "/",
  asyncHandler(async (req, res) => {
    const items = await prisma.notification.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return res.json({ items });
  }),
);

notificationsRoutes.get(
  "/unread-count",
  asyncHandler(async (req, res) => {
    const count = await prisma.notification.count({
      where: { userId: req.user!.id, read: false },
    });
    return res.json({ count });
  }),
);

notificationsRoutes.post(
  "/read-all",
  asyncHandler(async (req, res) => {
    await prisma.notification.updateMany({
      where: { userId: req.user!.id, read: false },
      data: { read: true },
    });
    return res.status(204).send();
  }),
);

notificationsRoutes.post(
  "/:id/read",
  validate({ params: z.object({ id: z.string().min(1) }) }),
  asyncHandler(async (req, res) => {
    await prisma.notification.updateMany({
      where: { id: req.params.id, userId: req.user!.id },
      data: { read: true },
    });
    return res.status(204).send();
  }),
);

/* -------- admin: broadcast / target -------- */
export const notificationsAdminRoutes = Router();
notificationsAdminRoutes.use(authenticate, authorize("ADMIN"));

const sendSchema = z.object({
  title: z.string().min(2).max(140),
  body: z.string().max(500).optional(),
  href: z.string().max(200).optional(),
  userIds: z.array(z.string()).optional(), // vazio/ausente = todos
});

notificationsAdminRoutes.post(
  "/",
  validate({ body: sendSchema }),
  asyncHandler(async (req, res) => {
    const { title, body, href, userIds } = req.body as z.infer<typeof sendSchema>;

    const targets =
      userIds && userIds.length > 0
        ? userIds
        : (await prisma.user.findMany({ select: { id: true } })).map((u) => u.id);

    await prisma.notification.createMany({
      data: targets.map((userId) => ({ userId, title, body, href })),
    });

    return res.status(201).json({ sent: targets.length });
  }),
);

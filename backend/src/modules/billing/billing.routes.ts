import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";
import { validate } from "../../middlewares/validate.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { asyncHandler } from "../../shared/http/asyncHandler.js";

export const billingRoutes = Router();

billingRoutes.use(authenticate);

const changePlanSchema = z.object({
  plan: z.enum(["FREE", "PRO"]).default("PRO"),
});

/** Mock checkout: flips the current user's plan. Real gateway plugs in here later. */
billingRoutes.post(
  "/checkout",
  validate({ body: changePlanSchema }),
  asyncHandler(async (req, res) => {
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { plan: req.body.plan },
      select: { id: true, plan: true },
    });
    return res.json({ plan: user.plan });
  }),
);

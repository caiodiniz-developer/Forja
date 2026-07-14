import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma.js";
import { validate } from "../../middlewares/validate.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { asyncHandler } from "../../shared/http/asyncHandler.js";
import { uploadAvatar } from "../../config/upload.js";
import { badRequest, conflict, unauthorized } from "../../shared/errors/AppError.js";
import { env } from "../../config/env.js";

export const accountRoutes = Router();
accountRoutes.use(authenticate);

const publicSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  plan: true,
  avatarUrl: true,
  emailVerified: true,
} as const;

/** Update name and/or email. */
accountRoutes.patch(
  "/profile",
  validate({
    body: z.object({
      name: z.string().min(2).max(80).optional(),
      email: z.string().email().optional(),
    }),
  }),
  asyncHandler(async (req, res) => {
    const { name, email } = req.body as { name?: string; email?: string };
    if (email) {
      const taken = await prisma.user.findUnique({ where: { email } });
      if (taken && taken.id !== req.user!.id)
        throw conflict("Este e-mail já está em uso");
    }
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { ...(name ? { name } : {}), ...(email ? { email } : {}) },
      select: publicSelect,
    });
    return res.json({ user });
  }),
);

/** Change password (requires the current one). */
accountRoutes.post(
  "/password",
  validate({
    body: z.object({
      currentPassword: z.string().min(1),
      newPassword: z
        .string()
        .min(8, "A senha precisa de ao menos 8 caracteres")
        .regex(/[a-z]/, "Inclua uma letra minúscula")
        .regex(/[A-Z]/, "Inclua uma letra maiúscula")
        .regex(/[0-9]/, "Inclua um número"),
    }),
  }),
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user?.passwordHash) throw badRequest("Conta sem senha definida");
    const ok = await bcrypt.compare(req.body.currentPassword, user.passwordHash);
    if (!ok) throw unauthorized("Senha atual incorreta");
    const passwordHash = await bcrypt.hash(req.body.newPassword, env.BCRYPT_ROUNDS);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
    return res.status(204).send();
  }),
);

/** Upload / replace the profile photo. */
accountRoutes.post(
  "/avatar",
  uploadAvatar.single("avatar"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw badRequest("Nenhuma imagem enviada");
    const avatarUrl = `/media/avatars/${req.file.filename}`;
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { avatarUrl },
    });
    return res.status(201).json({ avatarUrl });
  }),
);

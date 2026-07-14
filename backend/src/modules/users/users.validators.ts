import { z } from "zod";
import { ROLES } from "../../shared/auth/roles.js";
import { PLANS } from "../../shared/auth/roles.js";

export const listUsersQuery = z.object({
  search: z.string().trim().optional(),
  role: z.enum(ROLES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(50).default(20),
});

export const createUserSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z
    .string()
    .min(8, "A senha precisa de ao menos 8 caracteres")
    .regex(/[a-z]/, "Inclua uma letra minúscula")
    .regex(/[A-Z]/, "Inclua uma letra maiúscula")
    .regex(/[0-9]/, "Inclua um número"),
  role: z.enum(ROLES).default("INSTRUCTOR"),
});

export const updateUserSchema = z
  .object({
    role: z.enum(ROLES).optional(),
    plan: z.enum(PLANS).optional(),
    isBlocked: z.boolean().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, {
    message: "Informe ao menos um campo para atualizar",
  });

export const userIdParams = z.object({ id: z.string().min(1) });

export type ListUsersQuery = z.infer<typeof listUsersQuery>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
export type CreateUserDTO = z.infer<typeof createUserSchema>;

import { z } from "zod";

/** Mirrors the backend rules so the user gets instant feedback before submitting. */
export const loginSchema = z.object({
  email: z.string().min(1, "Informe o e-mail").email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Nome muito curto").max(80),
  email: z.string().min(1, "Informe o e-mail").email("E-mail inválido"),
  password: z
    .string()
    .min(8, "A senha precisa de ao menos 8 caracteres")
    .regex(/[a-z]/, "Inclua uma letra minúscula")
    .regex(/[A-Z]/, "Inclua uma letra maiúscula")
    .regex(/[0-9]/, "Inclua um número"),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;

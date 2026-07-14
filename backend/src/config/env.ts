import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(3333),
  CLIENT_URL: z.string().url().default("http://localhost:5173"),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(10),
  JWT_REFRESH_SECRET: z.string().min(10),
  JWT_ACCESS_EXPIRES: z.string().default("15m"),
  JWT_REFRESH_EXPIRES: z.string().default("7d"),
  BCRYPT_ROUNDS: z.coerce.number().default(10),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Variáveis de ambiente inválidas:",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error("Configuração de ambiente inválida. Verifique o .env");
}

export const env = parsed.data;

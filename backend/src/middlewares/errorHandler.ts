import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "../shared/errors/AppError.js";
import { env } from "../config/env.js";

/** Central error boundary: normalizes AppError, ZodError and unknowns into JSON. */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(422).json({
      error: "Erro de validação",
      details: err.flatten().fieldErrors,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  // Database unreachable / not migrated — the #1 cause of dev-time 500s.
  if (
    err instanceof Prisma.PrismaClientInitializationError ||
    (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P1001")
  ) {
    if (env.NODE_ENV !== "test") console.error("[db]", err.message);
    return res.status(503).json({
      error:
        "Banco de dados indisponível. Suba o PostgreSQL e rode as migrações (veja o README do backend).",
    });
  }

  if (env.NODE_ENV !== "test") console.error("[unhandled]", err);

  return res.status(500).json({ error: "Erro interno do servidor" });
};

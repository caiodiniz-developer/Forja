import type { RequestHandler } from "express";
import { verifyAccessToken } from "../shared/auth/tokens.js";
import { unauthorized } from "../shared/errors/AppError.js";

/** Requires a valid Bearer access token; attaches req.user. */
export const authenticate: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(unauthorized("Token de acesso ausente"));
  }
  try {
    const payload = verifyAccessToken(header.slice(7));
    req.user = { id: payload.sub, role: payload.role, email: payload.email };
    next();
  } catch {
    next(unauthorized("Token inválido ou expirado"));
  }
};

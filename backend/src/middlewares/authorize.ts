import type { RequestHandler } from "express";
import type { Role } from "../shared/auth/roles.js";
import { forbidden, unauthorized } from "../shared/errors/AppError.js";

/** Restricts a route to the given roles. Use after authenticate. */
export const authorize =
  (...roles: Role[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) return next(unauthorized());
    if (!roles.includes(req.user.role)) return next(forbidden());
    next();
  };

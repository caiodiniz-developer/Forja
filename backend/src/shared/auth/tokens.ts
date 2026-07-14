import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import type { Role } from "./roles.js";
import { env } from "../../config/env.js";

export interface AccessPayload {
  sub: string;
  role: Role;
  email: string;
}

export function signAccessToken(payload: AccessPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES,
  } as jwt.SignOptions);
}

export function signRefreshToken(sub: string): string {
  // jti guarantees a unique token (and thus unique hash) even for two logins
  // issued within the same second.
  return jwt.sign({ sub, jti: crypto.randomUUID() }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): AccessPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessPayload;
}

export function verifyRefreshToken(token: string): { sub: string } {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string };
}

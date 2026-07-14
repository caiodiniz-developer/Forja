import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import type { User } from "@prisma/client";
import { authRepository } from "./auth.repository.js";
import type { LoginDTO, RegisterDTO } from "./auth.validators.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../shared/auth/tokens.js";
import type { Role } from "../../shared/auth/roles.js";
import { conflict, unauthorized } from "../../shared/errors/AppError.js";
import { env } from "../../config/env.js";

const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7d
const hash = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

/** Strips sensitive fields before returning a user to the client. */
function publicUser(user: User) {
  const { passwordHash, googleId, ...safe } = user;
  void passwordHash;
  void googleId;
  return safe;
}

async function issueTokens(user: User) {
  const accessToken = signAccessToken({
    sub: user.id,
    role: user.role as Role,
    email: user.email,
  });
  const refreshToken = signRefreshToken(user.id);
  await authRepository.saveRefreshToken(
    user.id,
    hash(refreshToken),
    new Date(Date.now() + REFRESH_TTL_MS),
  );
  return { accessToken, refreshToken };
}

export const authService = {
  async register(dto: RegisterDTO) {
    const existing = await authRepository.findUserByEmail(dto.email);
    if (existing) throw conflict("Este e-mail já está cadastrado");

    const passwordHash = await bcrypt.hash(dto.password, env.BCRYPT_ROUNDS);
    const user = await authRepository.createUser({
      name: dto.name,
      email: dto.email,
      passwordHash,
    });

    const tokens = await issueTokens(user);
    return { user: publicUser(user), ...tokens };
  },

  async login(dto: LoginDTO) {
    const user = await authRepository.findUserByEmail(dto.email);
    if (!user || !user.passwordHash) {
      throw unauthorized("Credenciais inválidas");
    }
    if (user.isBlocked) throw unauthorized("Conta bloqueada");

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw unauthorized("Credenciais inválidas");

    const tokens = await issueTokens(user);
    return { user: publicUser(user), ...tokens };
  },

  /** Rotates the refresh token: revokes the old, issues a fresh pair. */
  async refresh(refreshToken: string | undefined) {
    if (!refreshToken) throw unauthorized("Refresh token ausente");

    let sub: string;
    try {
      ({ sub } = verifyRefreshToken(refreshToken));
    } catch {
      throw unauthorized("Refresh token inválido");
    }

    const stored = await authRepository.findRefreshToken(hash(refreshToken));
    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw unauthorized("Sessão expirada, entre novamente");
    }

    const user = await authRepository.findUserById(sub);
    if (!user || user.isBlocked) throw unauthorized();

    await authRepository.revokeRefreshToken(hash(refreshToken));
    const tokens = await issueTokens(user);
    return { user: publicUser(user), ...tokens };
  },

  async logout(refreshToken: string | undefined) {
    if (refreshToken) await authRepository.revokeRefreshToken(hash(refreshToken));
  },

  async me(userId: string) {
    const user = await authRepository.findUserById(userId);
    if (!user) throw unauthorized();
    return publicUser(user);
  },
};

import type { CookieOptions, Request, Response } from "express";
import { authService } from "./auth.service.js";
import { unauthorized } from "../../shared/errors/AppError.js";
import { env } from "../../config/env.js";

const REFRESH_COOKIE = "forja_rt";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE, token, cookieOptions);
}

export const authController = {
  async register(req: Request, res: Response) {
    const { user, accessToken, refreshToken } = await authService.register(
      req.body,
    );
    setRefreshCookie(res, refreshToken);
    return res.status(201).json({ user, accessToken });
  },

  async login(req: Request, res: Response) {
    const { user, accessToken, refreshToken } = await authService.login(
      req.body,
    );
    setRefreshCookie(res, refreshToken);
    return res.json({ user, accessToken });
  },

  async refresh(req: Request, res: Response) {
    const token = req.cookies?.[REFRESH_COOKIE];
    const { user, accessToken, refreshToken } =
      await authService.refresh(token);
    setRefreshCookie(res, refreshToken);
    return res.json({ user, accessToken });
  },

  async logout(req: Request, res: Response) {
    await authService.logout(req.cookies?.[REFRESH_COOKIE]);
    res.clearCookie(REFRESH_COOKIE, { path: "/api/auth" });
    return res.status(204).send();
  },

  async me(req: Request, res: Response) {
    if (!req.user) throw unauthorized();
    const user = await authService.me(req.user.id);
    return res.json({ user });
  },
};

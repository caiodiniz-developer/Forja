import { Router } from "express";
import { authController } from "./auth.controller.js";
import { loginSchema, registerSchema } from "./auth.validators.js";
import { validate } from "../../middlewares/validate.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { asyncHandler } from "../../shared/http/asyncHandler.js";

export const authRoutes = Router();

authRoutes.post(
  "/register",
  validate({ body: registerSchema }),
  asyncHandler(authController.register),
);
authRoutes.post(
  "/login",
  validate({ body: loginSchema }),
  asyncHandler(authController.login),
);
authRoutes.post("/refresh", asyncHandler(authController.refresh));
authRoutes.post("/logout", asyncHandler(authController.logout));
authRoutes.get("/me", authenticate, asyncHandler(authController.me));

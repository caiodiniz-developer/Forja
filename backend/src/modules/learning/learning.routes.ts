import { Router } from "express";
import { z } from "zod";
import { learningController } from "./learning.controller.js";
import { validate } from "../../middlewares/validate.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { asyncHandler } from "../../shared/http/asyncHandler.js";

export const learningRoutes = Router();

learningRoutes.use(authenticate);

learningRoutes.get("/stats", asyncHandler(learningController.stats));
learningRoutes.get("/me/courses", asyncHandler(learningController.myCourses));
learningRoutes.get("/certificates", asyncHandler(learningController.certificates));
learningRoutes.get(
  "/courses/:slug",
  validate({ params: z.object({ slug: z.string().min(1) }) }),
  asyncHandler(learningController.course),
);
learningRoutes.post(
  "/enroll/:courseId",
  validate({ params: z.object({ courseId: z.string().min(1) }) }),
  asyncHandler(learningController.enroll),
);
learningRoutes.post(
  "/lessons/:lessonId/complete",
  validate({ params: z.object({ lessonId: z.string().min(1) }) }),
  asyncHandler(learningController.complete),
);
learningRoutes.post(
  "/lessons/:lessonId/position",
  validate({
    params: z.object({ lessonId: z.string().min(1) }),
    body: z.object({ seconds: z.coerce.number().min(0) }),
  }),
  asyncHandler(learningController.savePosition),
);
learningRoutes.post(
  "/study",
  validate({ body: z.object({ seconds: z.coerce.number().min(0).max(600) }) }),
  asyncHandler(learningController.study),
);

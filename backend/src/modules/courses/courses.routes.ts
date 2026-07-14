import { Router } from "express";
import { coursesController } from "./courses.controller.js";
import {
  courseSlugParams,
  listCoursesQuery,
} from "./courses.validators.js";
import { validate } from "../../middlewares/validate.js";
import { asyncHandler } from "../../shared/http/asyncHandler.js";

export const coursesRoutes = Router();

coursesRoutes.get(
  "/",
  validate({ query: listCoursesQuery }),
  asyncHandler(coursesController.list),
);
coursesRoutes.get(
  "/:slug",
  validate({ params: courseSlugParams }),
  asyncHandler(coursesController.getBySlug),
);

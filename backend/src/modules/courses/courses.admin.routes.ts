import { Router } from "express";
import { coursesController } from "./courses.controller.js";
import { createCourseSchema, courseIdParams } from "./courses.validators.js";
import { validate } from "../../middlewares/validate.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { asyncHandler } from "../../shared/http/asyncHandler.js";

export const coursesAdminRoutes = Router();

coursesAdminRoutes.use(authenticate, authorize("ADMIN"));

coursesAdminRoutes.get("/", asyncHandler(coursesController.adminList));
coursesAdminRoutes.post(
  "/",
  validate({ body: createCourseSchema }),
  asyncHandler(coursesController.create),
);
coursesAdminRoutes.delete(
  "/:id",
  validate({ params: courseIdParams }),
  asyncHandler(coursesController.remove),
);

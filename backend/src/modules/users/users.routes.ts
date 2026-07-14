import { Router } from "express";
import { usersController } from "./users.controller.js";
import {
  listUsersQuery,
  updateUserSchema,
  createUserSchema,
  userIdParams,
} from "./users.validators.js";
import { validate } from "../../middlewares/validate.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { asyncHandler } from "../../shared/http/asyncHandler.js";

export const usersRoutes = Router();

// Every route here is admin-only.
usersRoutes.use(authenticate, authorize("ADMIN"));

usersRoutes.get(
  "/",
  validate({ query: listUsersQuery }),
  asyncHandler(usersController.list),
);
usersRoutes.post(
  "/",
  validate({ body: createUserSchema }),
  asyncHandler(usersController.create),
);
usersRoutes.patch(
  "/:id",
  validate({ params: userIdParams, body: updateUserSchema }),
  asyncHandler(usersController.update),
);
usersRoutes.delete(
  "/:id",
  validate({ params: userIdParams }),
  asyncHandler(usersController.remove),
);

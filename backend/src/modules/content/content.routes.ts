import { Router } from "express";
import { contentController } from "./content.controller.js";
import {
  courseIdParams,
  moduleIdParams,
  idParams,
  lessonIdParams,
  createModuleSchema,
  createLessonSchema,
  updateLessonSchema,
  materialLinkSchema,
  reorderSchema,
} from "./content.validators.js";
import { validate } from "../../middlewares/validate.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { asyncHandler } from "../../shared/http/asyncHandler.js";
import { uploadVideo, uploadMaterial } from "../../config/upload.js";

export const contentRoutes = Router();

contentRoutes.use(authenticate, authorize("ADMIN"));

contentRoutes.get(
  "/courses/:courseId/tree",
  validate({ params: courseIdParams }),
  asyncHandler(contentController.tree),
);
contentRoutes.post(
  "/courses/:courseId/modules",
  validate({ params: courseIdParams, body: createModuleSchema }),
  asyncHandler(contentController.createModule),
);
contentRoutes.delete(
  "/modules/:id",
  validate({ params: idParams }),
  asyncHandler(contentController.deleteModule),
);
contentRoutes.post(
  "/modules/:moduleId/lessons",
  validate({ params: moduleIdParams, body: createLessonSchema }),
  asyncHandler(contentController.createLesson),
);
contentRoutes.patch(
  "/lessons/:id",
  validate({ params: idParams, body: updateLessonSchema }),
  asyncHandler(contentController.updateLesson),
);
contentRoutes.delete(
  "/lessons/:id",
  validate({ params: idParams }),
  asyncHandler(contentController.deleteLesson),
);
contentRoutes.post(
  "/lessons/:lessonId/video",
  validate({ params: lessonIdParams }),
  uploadVideo.single("video"),
  asyncHandler(contentController.uploadVideo),
);

// materials
contentRoutes.post(
  "/lessons/:lessonId/materials/file",
  validate({ params: lessonIdParams }),
  uploadMaterial.single("file"),
  asyncHandler(contentController.addMaterialFile),
);
contentRoutes.post(
  "/lessons/:lessonId/materials/link",
  validate({ params: lessonIdParams, body: materialLinkSchema }),
  asyncHandler(contentController.addMaterialLink),
);
contentRoutes.delete(
  "/materials/:id",
  validate({ params: idParams }),
  asyncHandler(contentController.deleteMaterial),
);

// drag-and-drop reorder (persists modules + lessons + moves between modules)
contentRoutes.patch(
  "/courses/:courseId/reorder",
  validate({ params: courseIdParams, body: reorderSchema }),
  asyncHandler(contentController.reorder),
);

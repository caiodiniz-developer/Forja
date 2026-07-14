import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes.js";
import { coursesRoutes } from "../modules/courses/courses.routes.js";
import { coursesAdminRoutes } from "../modules/courses/courses.admin.routes.js";
import { usersRoutes } from "../modules/users/users.routes.js";
import { billingRoutes } from "../modules/billing/billing.routes.js";
import { contentRoutes } from "../modules/content/content.routes.js";
import { mediaRoutes } from "../modules/media/media.routes.js";
import { learningRoutes } from "../modules/learning/learning.routes.js";
import { eventsRoutes, eventsAdminRoutes } from "../modules/events/events.routes.js";
import {
  notificationsRoutes,
  notificationsAdminRoutes,
} from "../modules/notifications/notifications.routes.js";
import { statsRoutes, analyticsRoutes } from "../modules/stats/stats.routes.js";
import { tasksRoutes, myTasksRoutes } from "../modules/tasks/tasks.routes.js";
import { settingsRoutes } from "../modules/settings/settings.routes.js";
import { accountRoutes } from "../modules/account/account.routes.js";
import { commentsRoutes } from "../modules/comments/comments.routes.js";

export const routes = Router();

routes.get("/health", (_req, res) =>
  res.json({ status: "ok", service: "forja-api", time: new Date().toISOString() }),
);

routes.use("/auth", authRoutes);
routes.use("/courses", coursesRoutes);
routes.use("/billing", billingRoutes);
routes.use("/media", mediaRoutes);
routes.use("/learning", learningRoutes);
routes.use("/events", eventsRoutes);
routes.use("/notifications", notificationsRoutes);
routes.use("/account", accountRoutes);
routes.use("/comments", commentsRoutes);
routes.use("/me/tasks", myTasksRoutes);

// admin area
routes.use("/admin/users", usersRoutes);
routes.use("/admin/courses", coursesAdminRoutes);
routes.use("/admin/content", contentRoutes);
routes.use("/admin/events", eventsAdminRoutes);
routes.use("/admin/notifications", notificationsAdminRoutes);
routes.use("/admin/stats", statsRoutes);
routes.use("/admin/analytics", analyticsRoutes);
routes.use("/admin/tasks", tasksRoutes);
routes.use("/admin/settings", settingsRoutes);

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { routes } from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { env } from "./config/env.js";

export function createApp() {
  const app = express();

  // allow media (videos/images) to be loaded from the separate frontend origin
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(
    cors({
      // Accept the configured client and any localhost port in dev, so the
      // frontend works no matter which port Vite picks. Credentials require
      // reflecting the specific origin (not "*").
      origin: (origin, cb) => {
        if (
          !origin ||
          origin === env.CLIENT_URL ||
          /^https?:\/\/localhost(:\d+)?$/.test(origin) ||
          /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)
        ) {
          cb(null, true);
        } else {
          cb(null, false);
        }
      },
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  if (env.NODE_ENV !== "test") app.use(morgan("dev"));

  app.use("/api", routes);

  // 404 for unknown API routes
  app.use((_req, res) => res.status(404).json({ error: "Rota não encontrada" }));

  app.use(errorHandler);

  return app;
}

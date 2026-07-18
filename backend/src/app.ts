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

  app.use(
    helmet({
      crossOriginResourcePolicy: {
        policy: "cross-origin",
      },
    }),
  );

  const allowedOrigins = [
    env.CLIENT_URL,
    "https://forja-sable.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
  ].filter(Boolean);

  app.use(
    cors({
      origin(origin, callback) {
        // Permite requisições sem origin, como Postman, Render health check e servidor-servidor
        if (!origin) {
          return callback(null, true);
        }

        const isLocalhost =
          /^https?:\/\/localhost(:\d+)?$/.test(origin) ||
          /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin);

        const isAllowedOrigin = allowedOrigins.includes(origin);

        if (isLocalhost || isAllowedOrigin) {
          return callback(null, true);
        }

        console.warn(`CORS bloqueado para a origem: ${origin}`);

        return callback(new Error("Origem não permitida pelo CORS"));
      },

      credentials: true,

      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

      allowedHeaders: ["Content-Type", "Authorization"],

      exposedHeaders: ["Set-Cookie"],

      optionsSuccessStatus: 204,
    }),
  );

  app.options("*", cors());

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  if (env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }

  app.get("/", (_req, res) => {
    return res.status(200).json({
      message: "Forja API funcionando",
    });
  });

  app.use("/api", routes);

  app.use((_req, res) => {
    return res.status(404).json({
      error: "Rota não encontrada",
    });
  });

  app.use(errorHandler);

  return app;
}

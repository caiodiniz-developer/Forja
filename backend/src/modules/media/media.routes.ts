import { Router } from "express";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { contentService } from "../content/content.service.js";
import { validate } from "../../middlewares/validate.js";
import { asyncHandler } from "../../shared/http/asyncHandler.js";
import { AVATAR_DIR } from "../../config/upload.js";

export const mediaRoutes = Router();

const mimeByExt: Record<string, string> = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".mkv": "video/x-matroska",
  ".ogg": "video/ogg",
};

/**
 * Streams a video by id with HTTP Range support so large files start instantly
 * and seek without downloading the whole thing (206 Partial Content).
 */
mediaRoutes.get(
  "/videos/:id",
  validate({ params: z.object({ id: z.string().min(1) }) }),
  asyncHandler(async (req, res) => {
    const filePath = await contentService.resolveVideoPath(req.params.id);
    const { size } = fs.statSync(filePath);
    const type = mimeByExt[path.extname(filePath).toLowerCase()] ?? "video/mp4";
    const range = req.headers.range;

    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Content-Type", type);
    res.setHeader("Cache-Control", "public, max-age=3600");

    if (!range) {
      res.setHeader("Content-Length", size);
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    const match = /bytes=(\d*)-(\d*)/.exec(range);
    const start = match && match[1] ? parseInt(match[1], 10) : 0;
    const end = match && match[2] ? parseInt(match[2], 10) : size - 1;

    if (start >= size || end >= size) {
      res.status(416).setHeader("Content-Range", `bytes */${size}`);
      res.end();
      return;
    }

    res.status(206);
    res.setHeader("Content-Range", `bytes ${start}-${end}/${size}`);
    res.setHeader("Content-Length", end - start + 1);
    fs.createReadStream(filePath, { start, end }).pipe(res);
  }),
);

/** Serves a profile photo by filename. */
mediaRoutes.get(
  "/avatars/:file",
  validate({ params: z.object({ file: z.string().min(1) }) }),
  asyncHandler(async (req, res) => {
    const safe = path.basename(req.params.file);
    const filePath = path.join(AVATAR_DIR, safe);
    if (!fs.existsSync(filePath)) {
      res.status(404).end();
      return;
    }
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.sendFile(filePath);
  }),
);

/** Serves a lesson material: redirects for links, downloads for files. */
mediaRoutes.get(
  "/materials/:id",
  validate({ params: z.object({ id: z.string().min(1) }) }),
  asyncHandler(async (req, res) => {
    const mat = await contentService.resolveMaterial(req.params.id);
    if (mat.type === "link") {
      res.redirect(mat.url);
      return;
    }
    res.download(mat.filePath, mat.name);
  }),
);

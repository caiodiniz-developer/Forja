import multer from "multer";
import crypto from "node:crypto";
import path from "node:path";
import fs from "node:fs";

/** Where uploaded media lands. Kept outside src, streamed to disk (never buffered in RAM). */
export const UPLOAD_ROOT = path.resolve(process.cwd(), "uploads");
export const VIDEO_DIR = path.join(UPLOAD_ROOT, "videos");
export const MATERIAL_DIR = path.join(UPLOAD_ROOT, "materials");
export const AVATAR_DIR = path.join(UPLOAD_ROOT, "avatars");

fs.mkdirSync(VIDEO_DIR, { recursive: true });
fs.mkdirSync(MATERIAL_DIR, { recursive: true });
fs.mkdirSync(AVATAR_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, VIDEO_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".mp4";
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

/** Streams large video files straight to disk. Up to 5 GB per file. */
export const uploadVideo = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("video/")) cb(null, true);
    else cb(new Error("Apenas arquivos de vídeo são aceitos"));
  },
});

const materialStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, MATERIAL_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

/** Lesson materials (PDF, ZIP, images, source, etc). Up to 200 MB. */
export const uploadMaterial = multer({
  storage: materialStorage,
  limits: { fileSize: 200 * 1024 * 1024 },
});

const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, AVATAR_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

/** Profile photos. Images only, up to 5 MB. */
export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Apenas imagens são aceitas"));
  },
});

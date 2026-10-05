import multer from "multer";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import env from "./env.config.js";
import logger from "./logger.js";
import ErrorCodes from "../errors/ErrorCodes.js";

export const UPLOAD_ROOT = path.resolve(env.UPLOAD_DIR);

export const UPLOAD_FOLDERS = Object.freeze({
  USER_DOCUMENTS: "users/documents",
  ORDER_PROOFS: "orders/proofs",
  DELIVERY_PROOFS: "deliveries/proofs"
});

export const ALLOWED_MIME_TYPES = Object.freeze({
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp"
});

const ensureDirectory = (directory) => {
  try {
    fs.mkdirSync(directory, { recursive: true });
  } catch (error) {
    error.code = ErrorCodes.FILE_SAVE_ERROR;
    throw error;
  }
};

const buildStorage = (folder) => multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const directory = path.join(UPLOAD_ROOT, folder);
      ensureDirectory(directory);
      cb(null, directory);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const extension = ALLOWED_MIME_TYPES[file.mimetype] || path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${randomUUID()}${extension}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (Object.prototype.hasOwnProperty.call(ALLOWED_MIME_TYPES, file.mimetype)) {
    return cb(null, true);
  }

  logger.warn(`Intento de carga de tipo no permitido: ${file.mimetype || "desconocido"}`);
  const error = new Error("Tipo de archivo inválido. Se aceptan PDF, JPG, PNG y WEBP.");
  error.code = ErrorCodes.INVALID_FILE_TYPE;
  error.statusCode = 400;
  return cb(error);
};

export const createUpload = (folder) => multer({
  storage: buildStorage(folder),
  limits: {
    fileSize: env.MAX_FILE_SIZE,
    files: 1,
    fields: 10
  },
  fileFilter
});

export const removeUploadedFile = async (filePath) => {
  if (!filePath) return;
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      logger.warn(`No se pudo eliminar archivo temporal: ${filePath}`);
    }
  }
};

export const toRelativeUploadPath = (absolutePath) =>
  path.relative(process.cwd(), absolutePath).replaceAll(path.sep, "/");

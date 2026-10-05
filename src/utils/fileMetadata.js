import { toRelativeUploadPath } from "../config/upload.config.js";

export const buildFileMetadata = (file, documentType = null) => ({
  originalName: file.originalname,
  generatedName: file.filename,
  path: toRelativeUploadPath(file.path),
  type: file.mimetype,
  size: file.size,
  documentType,
  uploadedAt: new Date()
});

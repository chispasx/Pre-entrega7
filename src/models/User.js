import mongoose from "mongoose";
import { USER_ROLES } from "../constants/index.js";
import { DOCUMENT_TYPE_VALUES } from "../constants/documentTypes.js";

const fileMetadata = new mongoose.Schema({
  originalName: { type: String, required: true },
  generatedName: { type: String, required: true },
  path: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: Number, required: true },
  documentType: { type: String, enum: DOCUMENT_TYPE_VALUES, required: true },
  uploadedAt: { type: Date, required: true }
}, { _id: false });

const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 3 },
  role: { type: String, enum: Object.values(USER_ROLES), default: USER_ROLES.USER },
  document: { type: fileMetadata, default: null }
}, { timestamps: true, versionKey: false });

export default mongoose.model("User", schema);

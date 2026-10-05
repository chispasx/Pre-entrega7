import mongoose from "mongoose";
import { ORDER_STATUS } from "../constants/index.js";

const fileMetadata = new mongoose.Schema({
  originalName: { type: String, required: true },
  generatedName: { type: String, required: true },
  path: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: Number, required: true },
  documentType: { type: String, required: true, default: "PROOF" },
  uploadedAt: { type: Date, required: true }
}, { _id: false });

const tracking = new mongoose.Schema({
  status: { type: String, enum: Object.values(ORDER_STATUS), required: true },
  description: { type: String, required: true },
  location: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const schema = new mongoose.Schema({
  sender: { type: String, required: true, trim: true },
  recipient: { type: String, required: true, trim: true },
  origin: { type: String, required: true, trim: true },
  destination: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  status: { type: String, enum: Object.values(ORDER_STATUS), default: ORDER_STATUS.PENDING },
  tracking: { type: [tracking], default: [] },
  proof: { type: fileMetadata, default: null }
}, { timestamps: true, versionKey: false });

export default mongoose.model("Order", schema);

import mongoose from "mongoose";
import { DELIVERY_STATUS } from "../constants/index.js";

const fileMetadata = new mongoose.Schema({
  originalName: { type: String, required: true },
  generatedName: { type: String, required: true },
  path: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: Number, required: true },
  documentType: { type: String, required: true, default: "PROOF" },
  uploadedAt: { type: Date, required: true }
}, { _id: false });

const schema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", required: true },
  status: { type: String, enum: Object.values(DELIVERY_STATUS), default: DELIVERY_STATUS.ASSIGNED },
  proof: { type: fileMetadata, default: null }
}, { timestamps: true, versionKey: false });

export default mongoose.model("Delivery", schema);

import { createUpload } from "../config/upload.config.js";

export const uploadUserDocument = createUpload("users/documents");
export const uploadOrderProof = createUpload("orders/proofs");
export const uploadDeliveryProof = createUpload("deliveries/proofs");

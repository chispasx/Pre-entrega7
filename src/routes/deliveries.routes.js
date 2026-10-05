import { Router } from "express";
import c from "../controllers/deliveries.controller.js";
import { uploadDeliveryProof } from "../middlewares/upload.middleware.js";
const r=Router();
r.get("/",c.getAll); r.get("/:id",c.getById); r.post("/",c.create); r.put("/:id",c.update); r.delete("/:id",c.delete); r.post("/:id/proof",uploadDeliveryProof.single("file"),c.proof);
export default r;

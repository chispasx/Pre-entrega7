import { Router } from "express";
import c from "../controllers/orders.controller.js";
import { uploadOrderProof } from "../middlewares/upload.middleware.js";
const r=Router();
r.get("/",c.getAll); r.get("/:id",c.getById); r.post("/",c.create); r.put("/:id",c.update); r.delete("/:id",c.delete); r.post("/:id/tracking",c.tracking); r.post("/:id/proof",uploadOrderProof.single("file"),c.proof);
export default r;

import { Router } from "express"; import c from "../controllers/health.controller.js"; const r=Router();r.get("/",c.getHealth);export default r;

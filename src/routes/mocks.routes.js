import { Router } from "express"; import c from "../controllers/mocks.controller.js"; import internalOnly from "../middlewares/internalOnly.js";
const r=Router(); r.use(internalOnly); r.get("/users",c.getMockUsers); r.get("/drivers",c.getMockDrivers); r.get("/orders",c.getMockOrders); r.get("/deliveries",c.getMockDeliveries); r.post("/populate",c.populateDatabase); export default r;

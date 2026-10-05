import mongoose from "mongoose";
import env from "../config/env.config.js";
class HealthController{getHealth(req,res){res.json({status:"ok",database:mongoose.connection.readyState===1?"connected":"disconnected",environment:env.NODE_ENV,uptime:process.uptime(),timestamp:new Date().toISOString()})}}
export default new HealthController();

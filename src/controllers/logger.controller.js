import logger from "../config/logger.js";
class LoggerController{test(req,res){logger.debug("DEBUG test");logger.http("HTTP test");logger.info("INFO test");logger.warning("WARNING test");logger.error("ERROR test");res.json({success:true,message:"Niveles de logger ejecutados"})}}
export default new LoggerController();

import app from "./src/app.js";
import env from "./src/config/env.config.js";
import connectDB, { disconnectDB } from "./src/config/db.js";
import logger from "./src/config/logger.js";

const start=async()=>{try{await connectDB();const server=app.listen(env.PORT,()=>logger.info(`Servidor corriendo en http://localhost:${env.PORT}`));const shutdown=async()=>{server.close(async()=>{await disconnectDB();process.exit(0);});};process.on("SIGINT",shutdown);process.on("SIGTERM",shutdown);}catch(error){logger.error(`No se pudo iniciar el servidor: ${error.message}`);process.exit(1);}};
start();

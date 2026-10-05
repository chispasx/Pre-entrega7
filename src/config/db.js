import mongoose from "mongoose";
import env from "./env.config.js";
import logger from "./logger.js";

const connectDB = async (uri = env.NODE_ENV === "test" ? env.MONGODB_TEST_URI : env.MONGODB_URI) => {
  await mongoose.connect(uri);
  logger.info(`MongoDB conectado (${env.NODE_ENV})`);
  return mongoose.connection;
};

export const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
};

export default connectDB;

import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import env from "./env.config.js";

const levels = {
  fatal: 0,
  error: 1,
  warn: 2,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5
};

const format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

const transports = [
  new DailyRotateFile({
    dirname: "logs",
    filename: "error-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    level: "error",
    maxFiles: "14d",
    format
  }),

  new DailyRotateFile({
    dirname: "logs",
    filename: "combined-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    level: "info",
    maxFiles: "14d",
    format
  })
];

if (env.NODE_ENV === "development") {
  transports.push(
    new winston.transports.Console({
      level: env.LOG_LEVEL,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple()
      )
    })
  );
}

export default winston.createLogger({
  levels,
  level: env.LOG_LEVEL,
  format,
  transports
});
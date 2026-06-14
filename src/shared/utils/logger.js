import winston from "winston";
import path from "path";
import { fileURLToPath } from "url";

const { createLogger, format, transports } = winston;
const { json, combine, timestamp, errors, colorize, simple } = format;
const { Console, File } = transports;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.resolve(__dirname, "../../../logs");

const isProd = process.env.NODE_ENV === "production";

const myFormat = format.printf(({ level, message, timestamp, stack }) => {
  if (stack) {
    return `${timestamp} ${level}: ${message}\n${stack}`;
  }
  return `${timestamp} ${level}: ${message}`;
});

const devFormat = combine(
  colorize(),
  timestamp({ format: "HH:mm:ss" }),
  errors({ stack: true }),
  myFormat,
);

const prodFormat = combine(timestamp(), errors({ stack: true }), json());

export const logger = createLogger({
  level: isProd ? "info" : "debug",
  format: isProd ? prodFormat : devFormat,
  transports: [
    new Console(),
    new File({ filename: `${logsDir}/error.log`, level: "error" }),
    new File({ filename: `${logsDir}/combined.log` }),
  ],
  silent: process.env.NODE_ENV === "test",
});

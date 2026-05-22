import winston from 'winston';
import { env } from '../config/env.js';

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

// Human-readable format for development
const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `[${timestamp}] ${level}: ${message}\n${stack}`
      : `[${timestamp}] ${level}: ${message}`;
  })
);

// Structured JSON format for production (parseable by log aggregators)
const prodFormat = combine(timestamp(), errors({ stack: true }), json());

const transports = [];

if (env.isDev || env.isTest) {
  // Console only in dev/test
  transports.push(new winston.transports.Console({ format: devFormat }));
} else {
  // File transports in production
  transports.push(
    new winston.transports.Console({ format: prodFormat }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: prodFormat,
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: prodFormat,
    })
  );
}

export const logger = winston.createLogger({
  level: env.isDev ? 'debug' : 'info',
  transports,
  // Don't crash on unhandled rejections from Winston itself
  exitOnError: false,
});

export const morganStream = {
  write: (message) => logger.http(message.trim()),
};

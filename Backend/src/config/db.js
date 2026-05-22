import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

export const connectDB = async (uri) => {
  const MAX_RETRIES = 5;
  const RETRY_DELAY_MS = 3000;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      logger.info(`MongoDB connected: ${mongoose.connection.host}`);
      return;
    } catch (err) {
      logger.error(`DB connection attempt ${attempt}/${MAX_RETRIES} failed: ${err.message}`);

      if (attempt === MAX_RETRIES) {
        logger.error('Could not connect to MongoDB. Exiting process.');
        process.exit(1);
      }

      logger.info(`Retrying in ${RETRY_DELAY_MS / 1000}s...`);
      await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
    }
  }
};

export const disconnectDB = async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed.');
};

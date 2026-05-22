import 'dotenv/config';
import { env } from './src/config/env.js';
import { connectDB, disconnectDB } from './src/config/db.js';
import { logger } from './src/utils/logger.js';
import app from './src/app.js';

const startServer = async () => {
  try {
    await connectDB(env.mongoUri);

    const server = app.listen(env.port, () => {
      logger.info(`Server running on http://localhost:${env.port}`);
      logger.info(`Environment: ${env.nodeEnv}`);
      logger.info(`Health check: http://localhost:${env.port}/api/v1/health`);
    });

    // Graceful Shutdown
    const shutdown = (signal) => {
      logger.info(`\n${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        logger.info('HTTP server closed.');
        await disconnectDB();
        logger.info('Shutdown complete. Goodbye!');
        process.exit(0);
      });

      setTimeout(() => {
        logger.error('Graceful shutdown timed out. Forcing exit.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Promise Rejection:', reason);
      if (env.isProd) {
        shutdown('unhandledRejection');
      }
    });

    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception:', err);
      shutdown('uncaughtException');
    });
  } catch (err) {
    logger.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();

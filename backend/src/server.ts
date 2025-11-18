import app from './app';
import { PORT } from './config/env';
import prisma from './prisma/client';
import logger from './config/logger';

const start = async () => {
  try {
    await prisma.$connect();
    logger.info("Connected to database successfully");

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    logger.error("❌ Failed to start server", err);
    process.exit(1);
  }
};

start();

// Graceful shutdown (Render requires this)
process.on("SIGINT", async () => {
  logger.info("Shutting down server...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  logger.info("Server termination signal received...");
  await prisma.$disconnect();
  process.exit(0);
});

import app from "./app.js";
import { connectDB } from "./config/database.js";
import { ENV } from "./config/env.js";
import { logger } from "./utils/logger.js";

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  const port = process.env.PORT || ENV.PORT || 10000;

  const server = app.listen(port, "0.0.0.0", () => {
    logger.info(`UrbanNest REST API server running on port ${port} [${ENV.NODE_ENV}]`);
    logger.info(`Health check available at http://0.0.0.0:${port}/api/health`);
  });

  // Handle unhandled rejections
  process.on("unhandledRejection", (err) => {
    logger.error("UNHANDLED REJECTION! Shutting down gracefully...", err);
    server.close(() => {
      process.exit(1);
    });
  });
};

startServer();

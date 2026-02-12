import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import { Server } from "http";
import { HumanMessage } from "langchain";
import * as cron from "node-cron";
import { invokeAgent } from "./utils/agent";
import { logger } from "./utils/logger";

const app = express();

const APP_PORT = process.env.PORT || 8000;

// TODO: Add a task to periodically mint ANS names
let server: Server | undefined;
let greetingTask: cron.ScheduledTask | undefined;

// Middleware
app.use(express.json());

// API endpoint to check server health
app.get("/api/health", (_req: Request, res: Response) => {
  logger.info("[API] Received get request for /api/health");
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/messages", async (req: Request, res: Response) => {
  logger.info(
    `[API] Received post request for /api/messages, body: ${JSON.stringify(req.body)}`,
  );
  const invokeAgentResponse = await invokeAgent([
    new HumanMessage(req.body.message),
  ]);
  res.json(invokeAgentResponse);
});

async function startServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      server = app.listen(APP_PORT, () => {
        logger.info(`[Server] Express server is running on port ${APP_PORT}`);
        resolve();
      });

      server.on("error", (error) => {
        logger.error("[Server] Failed to start server, error:", error);
        reject(error);
      });
    } catch (error) {
      logger.error("[Server] Error setting up server, error:", error);
      reject(error);
    }
  });
}

function startCronScheduler(): void {
  logger.info("[Cron] Setting up cron scheduler...");

  // Schedule the greeting task to run every hour
  greetingTask = cron.schedule(
    "0 * * * *",
    async () => {
      try {
        logger.info("[Cron] Hello! This is your scheduled greeting!");
      } catch (error) {
        logger.error("[Cron] Failed to greet, error:", error);
      }
    },
    {
      timezone: "UTC",
    },
  );

  logger.info("[Cron] Cron scheduler setup completed");
}

async function gracefulShutdown(signal: string): Promise<void> {
  logger.info(`[Shutdown] Received ${signal}, shutting down gracefully...`);

  // Stop accepting new requests
  if (server) {
    server.close((error) => {
      if (error) {
        logger.error("[Shutdown] Error closing server, error:", error);
      } else {
        logger.info("[Shutdown] Express server closed");
      }
    });
  }

  // Stop cron schedulers
  if (greetingTask) {
    greetingTask.stop();
    logger.info("[Shutdown] Greeting task stopped");
  }

  // Force shutdown after 10 seconds if graceful shutdown takes too long
  setTimeout(() => {
    logger.info("[Shutdown] Forcing shutdown after timeout");
    process.exit(0);
  }, 10000);

  // Attempt graceful exit
  process.exit(0);
}

async function startApp(): Promise<void> {
  try {
    logger.info("[App] Starting application...");
    logger.info(`[App] NODE_ENV: ${process.env.NODE_ENV}`);

    // Start Express server
    await startServer();

    // Start cron scheduler
    startCronScheduler();

    logger.info("[App] Application started successfully");

    // Setup graceful shutdown handlers
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  } catch (error) {
    logger.error("[App] Error starting application, error:", error);
    process.exit(1);
  }
}

// Start the application
startApp();

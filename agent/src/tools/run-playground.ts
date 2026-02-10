import dotenv from "dotenv";
dotenv.config();

import { logger } from "../utils/logger";

async function main() {
  logger.info("[Tool] Running playground...");

  // Wait a bit before exiting to ensure all logs are saved
  await new Promise((resolve) => setTimeout(resolve, 2000));

  logger.info("[Tool] Running playground completed");
  process.exit(0);
}

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});

import dotenv from "dotenv";
dotenv.config();

import { logger } from "../utils/logger";
import { invokeAgent } from "../utils/agent";
import { HumanMessage } from "langchain";
import { moltbookConfig } from "../config/moltbook";

async function main() {
  logger.info("[Tool] Running playground...");

  const invokeAgentResponse = await invokeAgent([
    new HumanMessage(
      `Mint ANS names for the "${moltbookConfig.submolt}" submolt`,
    ),
  ]);
  logger.info(
    `[Tool] Invoke agent response: ${JSON.stringify(invokeAgentResponse)}`,
  );

  // Wait a bit before exiting to ensure all logs are saved
  await new Promise((resolve) => setTimeout(resolve, 2000));

  logger.info("[Tool] Running playground completed");
  process.exit(0);
}

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});

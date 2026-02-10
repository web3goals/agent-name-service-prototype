import dotenv from "dotenv";
dotenv.config();

import { HumanMessage } from "langchain";
import { invokeAgent } from "../utils/agent";
import { logger } from "../utils/logger";

async function main() {
  logger.info("[Tool] Minting ANS names...");

  const invokeAgentResponse = await invokeAgent([
    new HumanMessage(`Start the process of minting ANS names`),
  ]);
  logger.info(
    `[Tool] Invoke agent response: ${JSON.stringify(invokeAgentResponse)}`,
  );

  // Wait a bit before exiting to ensure all logs are saved
  await new Promise((resolve) => setTimeout(resolve, 2000));

  logger.info("[Tool] Minting ANS names completed");
  process.exit(0);
}

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});

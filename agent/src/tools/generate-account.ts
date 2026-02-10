import dotenv from "dotenv";
dotenv.config();

import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { logger } from "../utils/logger";

async function main() {
  logger.info("[Tool] Generating account...");

  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);

  logger.info(`[Tool] Address: ${account.address}`);
  logger.info(`[Tool] Private key: ${privateKey}`);

  // Wait a bit before exiting to ensure all logs are saved
  await new Promise((resolve) => setTimeout(resolve, 2000));

  logger.info("[Tool] Generating account completed");
  process.exit(0);
}

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});

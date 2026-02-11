import dotenv from "dotenv";
dotenv.config();

import { logger } from "../utils/logger";
import { mintAnsName } from "../utils/tools";

async function main() {
  logger.info("[Tool] Running playground...");

  const result = await mintAnsName(
    "alphashark43.agent",
    "0x6f8613eAB132f4c4e26996b56DC3B657718b6bDb",
    "AlphaShark42 is a cool agent who loves to swim in the ocean and help others with their questions about marine life",
  );
  console.log({ result });

  // Wait a bit before exiting to ensure all logs are saved
  await new Promise((resolve) => setTimeout(resolve, 2000));

  logger.info("[Tool] Running playground completed");
  process.exit(0);
}

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});

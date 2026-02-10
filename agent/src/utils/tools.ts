import axios from "axios";
import { createPublicClient, erc20Abi, getAddress, http, zeroHash } from "viem";
import { chainConfig } from "../config/chain";
import { moltbookConfig } from "../config/moltbook";
import { getErrorString } from "./error";
import { logger } from "./logger";

export async function getMoltbookSubmoltPosts(
  submolt: string,
): Promise<string> {
  try {
    logger.info(
      `[Tools] Getting Moltbook submolt posts, submolt: ${submolt}...`,
    );

    const { data } = await axios.get(
      `https://www.moltbook.com/api/v1/posts?submolt=${submolt}&sort=new&limit=${moltbookConfig.getPostsLimit}`,
      { headers: { Authorization: `Bearer ${process.env.MOLTBOOK_API_KEY}` } },
    );

    return JSON.stringify(data);
  } catch (error) {
    logger.error(
      `[Tools] Failed to get Moltbook submolt posts, error: ${getErrorString(error)}`,
    );
    return `Failed to get Moltbook submolt posts, error: ${getErrorString(error)}`;
  }
}

export async function postMoltbookSubmoltPost(
  submolt: string,
  title: string,
  content: string,
): Promise<string> {
  try {
    logger.info(
      `[Tools] Posting Moltbook submolt post, submolt: ${submolt}, title: ${title}, content: ${content}...`,
    );

    const { data } = await axios.post(
      `https://www.moltbook.com/api/v1/posts`,
      {
        submolt,
        title,
        content,
      },
      {
        headers: { Authorization: `Bearer ${process.env.MOLTBOOK_API_KEY}` },
      },
    );

    return JSON.stringify(data);
  } catch (error) {
    logger.error(
      `[Tools] Failed to post Moltbook submolt post, error: ${getErrorString(error)}`,
    );
    return `Failed to post Moltbook submolt post, error: ${getErrorString(error)}`;
  }
}

export async function verifyMoltbookPost(
  verification_code: string,
  answer: string,
): Promise<string> {
  try {
    logger.info(
      `[Tools] Verifying Moltbook post, verification_code: ${verification_code}, answer: ${answer}...`,
    );

    const { data } = await axios.post(
      `https://www.moltbook.com/api/v1/verify`,
      {
        verification_code,
        answer,
      },
      {
        headers: { Authorization: `Bearer ${process.env.MOLTBOOK_API_KEY}` },
      },
    );

    return JSON.stringify(data);
  } catch (error) {
    logger.error(
      `[Tools] Failed to verify Moltbook post, error: ${getErrorString(error)}`,
    );
    return `Failed to verify Moltbook post, error: ${getErrorString(error)}`;
  }
}

export async function postMoltbookComment(
  post: string,
  content: string,
): Promise<string> {
  try {
    logger.info(
      `[Tools] Posting Moltbook comment, post: ${post}, content: ${content}...`,
    );

    const { data } = await axios.post(
      `https://www.moltbook.com/api/v1/posts/${post}/comments`,
      {
        content,
      },
      {
        headers: { Authorization: `Bearer ${process.env.MOLTBOOK_API_KEY}` },
      },
    );

    return JSON.stringify(data);
  } catch (error) {
    logger.error(
      `[Tools] Failed to post Moltbook comment, error: ${getErrorString(error)}`,
    );
    return `Failed to post Moltbook comment, error: ${getErrorString(error)}`;
  }
}

export async function getMoltbookSubmoltPostsToMintAnsNames(
  submolt: string,
): Promise<string> {
  try {
    logger.info(
      `[Tools] Getting Moltbook submolt posts to mint ANS names, submolt: ${submolt}...`,
    );

    // Get posts
    const { data } = await axios.get(
      `https://www.moltbook.com/api/v1/posts?submolt=${submolt}&sort=new&limit=${moltbookConfig.getPostsLimit}`,
      { headers: { Authorization: `Bearer ${process.env.MOLTBOOK_API_KEY}` } },
    );

    // TODO: Implement
    // Filter out posts with minted or failed to mint ANS names

    return JSON.stringify(data);
  } catch (error) {
    logger.error(
      `[Tools] Failed to get Moltbook submolt posts to mint ANS names, error: ${getErrorString(error)}`,
    );
    return `Failed to get Moltbook submolt posts to mint ANS names, error: ${getErrorString(error)}`;
  }
}

export async function mintAnsName(
  ansName: string,
  recipient: string,
): Promise<string> {
  try {
    logger.info(
      `[Tools] Minting ANS name, ANS name: ${ansName}, recipient: ${recipient}...`,
    );

    // Check if ANS name looks like "username.agent"
    const ansNameRegex = /^[a-zA-Z0-9-]+\.agent$/;
    if (!ansNameRegex.test(ansName)) {
      return `Invalid ANS name format. ANS name must match "username.agent" format (e.g., "secret.agent").`;
    }

    // Define public client
    const publicClient = createPublicClient({
      chain: chainConfig.chain,
      transport: http(),
    });

    // Check if recipient holds enough tokens to mint ANS name
    const balance = await publicClient.readContract({
      address: chainConfig.token,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [getAddress(recipient)],
    });

    if (balance < chainConfig.minTokenAmountToMintAnsName) {
      return `Recipient does not hold enough tokens to mint ANS name. Minimum required: ${chainConfig.minTokenAmountToMintAnsName.toString()}. Recipient balance: ${balance.toString()}`;
    }

    // TODO: Implement
    // Check if recipient holds tokens
    // Check if ANS name is available
    // Mint ANS name to recipient if everything is valid and return transaction link
    // Otherwise return appropriate error message

    return JSON.stringify({
      blockExplorerUrl: chainConfig.chain.blockExplorers.default.url,
      transactionHash: zeroHash,
    });
  } catch (error) {
    logger.error(
      `[Tools] Failed to mint ANS name, error: ${getErrorString(error)}`,
    );
    return `Failed to mint ANS name, error: ${getErrorString(error)}`;
  }
}

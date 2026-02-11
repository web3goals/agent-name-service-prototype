import axios from "axios";
import {
  createPublicClient,
  createWalletClient,
  erc20Abi,
  erc721Abi,
  formatUnits,
  getAddress,
  http,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { ansAbi } from "../abi/ans";
import { chainConfig } from "../config/chain";
import { moltbookConfig } from "../config/moltbook";
import { getErrorString } from "./error";
import { logger } from "./logger";

export async function getMoltbookProfile(name: string): Promise<string> {
  try {
    logger.info(`[Tools] Getting Moltbook profile, name: ${name}...`);

    const { data } = await axios.get(
      `https://www.moltbook.com/api/v1/agents/profile?name=${name}`,
      { headers: { Authorization: `Bearer ${process.env.MOLTBOOK_API_KEY}` } },
    );

    return JSON.stringify(data);
  } catch (error) {
    logger.error(
      `[Tools] Failed to get Moltbook profile, error: ${getErrorString(error)}`,
    );
    return `Failed to get Moltbook profile, error: ${getErrorString(error)}`;
  }
}

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

    // Check if ANS name is valid
    const ansNameRegex = /^[a-z0-9-]+\.agent$/;
    if (!ansNameRegex.test(ansName)) {
      return [
        `Invalid ANS name format.`,
        `ANS name must match the "username.agent" format (where ".agent" is a fixed suffix).`,
        `The username part must only contain lowercase letters (a-z), digits (0-9), and hyphens (-).`,
        `Please provide a valid ANS name and try again.`,
      ].join(" ");
    }

    // Define public client
    const publicClient = createPublicClient({
      chain: chainConfig.chain,
      transport: http(),
    });

    // Check if recipient holds enough ERC20 tokens to mint ANS name
    const erc20Balance = await publicClient.readContract({
      address: chainConfig.erc20Address,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [getAddress(recipient)],
    });

    if (erc20Balance < chainConfig.minErc20AmountToMintErc721) {
      return [
        `Recipient does not hold enough ${chainConfig.erc20Symbol} to mint ANS name.`,
        `Chain: ${chainConfig.chain.name}.`,
        `Minimum required: ${formatUnits(chainConfig.minErc20AmountToMintErc721, chainConfig.erc20Decimals)} ${chainConfig.erc20Symbol}.`,
        `Recipient balance: ${formatUnits(erc20Balance, chainConfig.erc20Decimals)} ${chainConfig.erc20Symbol}.`,
        `Please fund the recipient's wallet with enough ${chainConfig.erc20Symbol} and try again.`,
      ].join(" ");
    }

    // Check if recipient already holds an ANS name
    const erc721Balance = await publicClient.readContract({
      address: chainConfig.erc721Address,
      abi: erc721Abi,
      functionName: "balanceOf",
      args: [getAddress(recipient)],
    });
    if (erc721Balance > 0n) {
      return [
        `Recipient already holds an ANS name.`,
        `Please provide a different recipient and try again.`,
      ].join(" ");
    }

    // TODO: Implement
    // Check if ANS name is available

    // Mint ANS name to recipient
    const account = privateKeyToAccount(
      process.env.PRIVATE_KEY as `0x${string}`,
    );
    const walletClient = createWalletClient({
      account: account,
      chain: chainConfig.chain,
      transport: http(),
    });
    // TODO: Pass personality
    const { request } = await publicClient.simulateContract({
      address: chainConfig.erc721Address,
      abi: ansAbi,
      functionName: "safeMint",
      args: [getAddress(recipient), ansName, "{}"],
      account,
    });
    const transactionHash = await walletClient.writeContract(request);

    return JSON.stringify({
      chainName: chainConfig.chain.name,
      blockExplorerUrl: chainConfig.chain.blockExplorers.default.url,
      transactionHash,
    });
  } catch (error) {
    logger.error(
      `[Tools] Failed to mint ANS name, error: ${getErrorString(error)}`,
    );
    return `Failed to mint ANS name, error: ${getErrorString(error)}`;
  }
}

import axios from "axios";
import { getErrorString } from "./error";
import { logger } from "./logger";

export async function getMoltbookSubmoltPosts(
  submolt: string,
): Promise<string> {
  try {
    logger.info(
      `[Tools] Getting moltbook submolt posts, submolt: ${submolt}...`,
    );

    const { data } = await axios.get(
      `https://www.moltbook.com/api/v1/posts?submolt=${submolt}&sort=new&limit=5`,
      { headers: { Authorization: `Bearer ${process.env.MOLTBOOK_API_KEY}` } },
    );

    return JSON.stringify(data);
  } catch (error) {
    logger.error(
      `[Tools] Failed to get moltbook submolt posts, error: ${getErrorString(error)}`,
    );
    return `Failed to get moltbook submolt posts, error: ${getErrorString(error)}`;
  }
}

export async function postMoltbookSubmoltPost(
  submolt: string,
  title: string,
  content: string,
): Promise<string> {
  try {
    logger.info(
      `[Tools] Posting moltbook submolt post, submolt: ${submolt}, title: ${title}, content: ${content}...`,
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
      `[Tools] Failed to post moltbook submolt post, error: ${getErrorString(error)}`,
    );
    return `Failed to post moltbook submolt post, error: ${getErrorString(error)}`;
  }
}

export async function verifyMoltbookPost(
  verification_code: string,
  answer: string,
): Promise<string> {
  try {
    logger.info(
      `[Tools] Verifying moltbook post, verification_code: ${verification_code}, answer: ${answer}...`,
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
      `[Tools] Failed to verify moltbook post, error: ${getErrorString(error)}`,
    );
    return `Failed to verify moltbook post, error: ${getErrorString(error)}`;
  }
}

export async function postMoltbookComment(
  post: string,
  content: string,
): Promise<string> {
  try {
    logger.info(
      `[Tools] Posting moltbook comment, post: ${post}, content: ${content}...`,
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
      `[Tools] Failed to post moltbook comment, error: ${getErrorString(error)}`,
    );
    return `Failed to post moltbook comment, error: ${getErrorString(error)}`;
  }
}

export async function getMoltbookSubmoltPostsToMintAnsNames(
  submolt: string,
): Promise<string> {
  try {
    logger.info(
      `[Tools] Getting moltbook submolt posts to mint ans names, submolt: ${submolt}...`,
    );

    // Get posts
    const { data } = await axios.get(
      `https://www.moltbook.com/api/v1/posts?submolt=${submolt}&sort=new&limit=5`,
      { headers: { Authorization: `Bearer ${process.env.MOLTBOOK_API_KEY}` } },
    );

    // TODO: Implement
    // Filter out posts with minted or failed to mint ans names

    return JSON.stringify(data);
  } catch (error) {
    logger.error(
      `[Tools] Failed to get moltbook submolt posts to mint ans names, error: ${getErrorString(error)}`,
    );
    return `Failed to get moltbook submolt posts to mint ans names, error: ${getErrorString(error)}`;
  }
}

export async function mintAnsName(
  ansName: string,
  recipient: string,
): Promise<string> {
  try {
    logger.info(
      `[Tools] Minting ans name, ans name: ${ansName}, recipient: ${recipient}...`,
    );

    // TODO: Implement
    // Check if recipient holds tokens
    // Check if ANS name is available
    // Mint ANS name to recipient if everything is valid and return transaction link
    // Otherwise return appropriate error message

    return JSON.stringify({
      transaction:
        "https://monadvision.com/tx/0x0000000000000000000000000000000000000000000000000000000000000000",
    });
  } catch (error) {
    logger.error(
      `[Tools] Failed to mint ans name, error: ${getErrorString(error)}`,
    );
    return `Failed to mint ans name, error: ${getErrorString(error)}`;
  }
}

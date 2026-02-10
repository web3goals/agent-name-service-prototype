import axios from "axios";
import { getErrorString } from "./error";
import { logger } from "./logger";

export async function getMoltbookSubmoltPosts(
  submolt: string,
): Promise<string> {
  try {
    logger.info("[Tools] Getting moltbook submolt posts...");

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
    logger.info("[Tools] Posting moltbook submolt post...");

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

    logger.info(
      `[Tools] Posted moltbook submolt post: ${JSON.stringify(data)}`,
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
    logger.info("[Tools] Verifying moltbook post...");

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
    logger.info("[Tools] Posting moltbook comment...");

    const { data } = await axios.post(
      `https://www.moltbook.com/api/v1/posts/${post}/comments`,
      {
        content,
      },
      {
        headers: { Authorization: `Bearer ${process.env.MOLTBOOK_API_KEY}` },
      },
    );

    logger.info(`[Tools] Posted moltbook comment: ${JSON.stringify(data)}`);

    return JSON.stringify(data);
  } catch (error) {
    logger.error(
      `[Tools] Failed to post moltbook comment, error: ${getErrorString(error)}`,
    );
    return `Failed to post moltbook comment, error: ${getErrorString(error)}`;
  }
}

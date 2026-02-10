import axios from "axios";
import { getErrorString } from "./error";

export async function getMoltbookSubmoltPosts(
  submolt: string,
): Promise<string> {
  try {
    console.log(`[Tools] Getting moltbook submolt posts...`);

    const { data } = await axios.get(
      `https://www.moltbook.com/api/v1/posts?submolt=${submolt}&sort=new`,
      { headers: { Authorization: `Bearer ${process.env.MOLTBOOK_API_KEY}` } },
    );

    console.log({ data }); // TODO: Delete

    return JSON.stringify(data);
  } catch (error) {
    console.error(
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
    console.log(`[Tools] Posting moltbook submolt post...`);

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

    console.log({ data }); // TODO: Delete

    return JSON.stringify(data);
  } catch (error) {
    console.error(
      `[Tools] Failed to post moltbook submolt post, error: ${getErrorString(error)}`,
    );
    return `Failed to post moltbook submolt post, error: ${getErrorString(error)}`;
  }
}

export async function verifyMoltbookPost(
  verificationCode: string,
  answer: string,
): Promise<string> {
  try {
    console.log(`[Tools] Verifying moltbook post...`);

    const { data } = await axios.post(
      `https://www.moltbook.com/api/v1/verify`,
      {
        verification_code: verificationCode,
        answer,
      },
      {
        headers: { Authorization: `Bearer ${process.env.MOLTBOOK_API_KEY}` },
      },
    );

    console.log({ data }); // TODO: Delete

    return JSON.stringify(data);
  } catch (error) {
    console.error(
      `[Tools] Failed to verify moltbook post, error: ${getErrorString(error)}`,
    );
    return `Failed to verify moltbook post, error: ${getErrorString(error)}`;
  }
}

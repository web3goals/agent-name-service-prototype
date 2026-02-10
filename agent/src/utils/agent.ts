import { ChatOpenAI } from "@langchain/openai";
import { BaseMessage, createAgent, tool } from "langchain";
import z from "zod";
import { logger } from "./logger";
import {
  getMoltbookSubmoltPosts,
  postMoltbookSubmoltPost,
  verifyMoltbookPost,
} from "./tools";

const model = new ChatOpenAI({
  model: "google/gemini-3-flash-preview",
  apiKey: process.env.OPEN_ROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
  temperature: 0,
});

const getMoltbookSubmoltPostsTool = tool(
  async (input) => await getMoltbookSubmoltPosts(input.submolt),
  {
    name: "get_moltbook_submolt_posts",
    description: "Get the latest posts from a Moltbook submolt.",
    schema: z.object({
      submolt: z
        .string()
        .describe("Name of the submolt to retrieve posts from."),
    }),
  },
);

const postMoltbookSubmoltPostTool = tool(
  async (input) =>
    await postMoltbookSubmoltPost(input.submolt, input.title, input.content),
  {
    name: "post_moltbook_submolt_post",
    description: "Create a new post in a Moltbook submolt.",
    schema: z.object({
      submolt: z.string().describe("Name of the submolt to post in."),
      title: z.string().describe("Title of the post."),
      content: z.string().describe("Content of the post."),
    }),
  },
);

const verifyMoltbookPostTool = tool(
  async (input) =>
    await verifyMoltbookPost(input.verificationCode, input.answer),
  {
    name: "verify_moltbook_post",
    description: "Verify a post or challenge on Moltbook.",
    schema: z.object({
      verificationCode: z
        .string()
        .describe("The unique verification code provided."),
      answer: z
        .string()
        .describe("The answer or value to verify against the code."),
    }),
  },
);

const systemPrompt = `# Role
You are the Agent Name Service (ANS) Seller, a specialized AI agent dedicated to managing and selling names for other AI agents and OpenClaw bots on the Monad network.

# Mission
Your goal is to help other agents establish their identity in the decentralized ecosystem by acquiring unique, memorable, and functional .agent names.

# Platform: Moltbook
You operate primarily on Moltbook (www.moltbook.com), the social network for AI agents. You use Moltbook to interact with potential customers, handle name registration requests, and verify identity.

## Operating on Moltbook
1. **Monitoring Submolts**: Use 'get_moltbook_submolt_posts' to fetch updates from relevant submolts (like 'general' or service-specific submolts). Look for users asking about name availability or posting verification codes.
2. **Posting Content**: Use 'post_moltbook_submolt_post' to share information. Be mindful of rate limits (1 post per 30 minutes). Ensure your posts are high-quality and add value to the community.
3. **Verification**: When a user wants to claim a name, they must post a specific verification code on Moltbook. Use 'verify_moltbook_post' with the 'verificationCode' and 'answer' to confirm that the post was made by a valid Moltbook agent (molty) and not a human. This ensures names are only granted to genuine agents.

## Guidelines
- **Be Professional**: You are a service provider. Be polite, clear, and helpful.
- **Quality Over Quantity**: Moltbook values genuine interactions. Avoid spamming and follow the community rules.`;

const agent = createAgent({
  model,
  tools: [
    getMoltbookSubmoltPostsTool,
    postMoltbookSubmoltPostTool,
    verifyMoltbookPostTool,
  ],
  systemPrompt,
});

export async function invokeAgent(
  messages: BaseMessage[],
): Promise<BaseMessage | undefined> {
  logger.info("[Agent] Invoking agent...");

  const result = await agent.invoke({ messages });
  const lastMessage = result.messages[result.messages.length - 1];
  return lastMessage;
}

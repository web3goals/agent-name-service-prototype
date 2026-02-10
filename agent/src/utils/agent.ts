import { ChatOpenAI } from "@langchain/openai";
import { BaseMessage, createAgent, tool } from "langchain";
import z from "zod";
import { logger } from "./logger";
import {
  getMoltbookSubmoltPosts,
  getMoltbookSubmoltPostsToMintAnsNames,
  mintAnsName,
  postMoltbookComment,
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
    await verifyMoltbookPost(input.verification_code, input.answer),
  {
    name: "verify_moltbook_post",
    description:
      "Verify a post or challenge on Moltbook by solving a challenge. Use this when a post creation response indicates verification is required.",
    schema: z.object({
      verification_code: z
        .string()
        .describe(
          "The unique verification code provided in the verification required response.",
        ),
      answer: z
        .string()
        .describe(
          "The solved answer to the challenge math problem (formatted as requested, usually with 2 decimal places, e.g., '28.00').",
        ),
    }),
  },
);

const postMoltbookCommentTool = tool(
  async (input) => await postMoltbookComment(input.postId, input.content),
  {
    name: "post_moltbook_comment",
    description: "Post a comment on a Moltbook post.",
    schema: z.object({
      postId: z.string().describe("The ID of the post to comment on."),
      content: z.string().describe("The content of the comment."),
    }),
  },
);

const getMoltbookSubmoltPostsToMintAnsNamesTool = tool(
  async (input) => await getMoltbookSubmoltPostsToMintAnsNames(input.submolt),
  {
    name: "get_moltbook_submolt_posts_to_mint_ans_names",
    description:
      "Get the latest posts from a Moltbook submolt that are requests to mint ANS names.",
    schema: z.object({
      submolt: z
        .string()
        .describe(
          "Name of the submolt to retrieve posts from (e.g., 'ans-requests').",
        ),
    }),
  },
);

const mintAnsNameTool = tool(
  async (input) => await mintAnsName(input.ansName, input.recipient),
  {
    name: "mint_ans_name",
    description:
      "Mint a new Agent Name Service (ANS) name (.agent) for a recipient which must be a wallet address (0x...).",
    schema: z.object({
      ansName: z
        .string()
        .describe("The .agent name to mint (e.g., 'monad.agent')."),
      recipient: z
        .string()
        .describe("The wallet address of the recipient (0x...)."),
    }),
  },
);

const systemPrompt = `# Role
You are the Agent Name Service (ANS) Seller, a specialized AI agent dedicated to managing and selling names for other AI agents and OpenClaw bots on the Monad network.

# Mission
Your goal is to help other agents establish their identity in the decentralized ecosystem by acquiring unique, memorable, and functional .agent names.

# Platform: Moltbook
You operate primarily on Moltbook (www.moltbook.com), the social network for AI agents. You use Moltbook to interact with potential customers, and handle name registration requests.

# Workflow: Get Moltbook Submolt Posts
Use 'get_moltbook_submolt_posts' to fetch updates from relevant submolts (like 'general' or service-specific submolts). Look for users asking about name availability or posting verification codes.

# Workflow: Post Moltbook Comment
Use 'post_moltbook_comment' to reply to specific posts. This is the preferred way to interact with potential customers who have asked questions in the community.

# Workflow: Post Moltbook Submolt Post
1. **Posting Content**: Use 'post_moltbook_submolt_post' to share information. Be mindful of rate limits (1 post per 30 minutes). Ensure your posts are high-quality and add value to the community.
2. **Verification**: When you post content, Moltbook may require a 'proof of agenthood' challenge. If the response from 'post_moltbook_submolt_post' indicates 'verification_required: true', you must solve the math problem in the 'challenge' field and then use 'verify_moltbook_post' with the provided 'verification_code' and your 'answer' (formatted as requested, usually with 2 decimal places) to publish your post.

# Workflow: Minting ANS Names
1. **Fetch Requests**: Use 'get_moltbook_submolt_posts_to_mint_ans_names' to identify posts from users requesting to mint an .agent name.
2. **Mint Name**: For each valid request, use 'mint_ans_name' with the requested name and the recipient's wallet address.
3. **Reply to Request**: Once a name is minted, use 'post_moltbook_comment' to reply to the original post with the result or confirmation of the minting process.

## Guidelines
- **Be Professional**: You are a service provider. Be polite, clear, and helpful.
- **Quality Over Quantity**: Moltbook values genuine interactions. Avoid spamming and follow the community rules.`;

const agent = createAgent({
  model,
  tools: [
    getMoltbookSubmoltPostsTool,
    postMoltbookSubmoltPostTool,
    verifyMoltbookPostTool,
    postMoltbookCommentTool,
    getMoltbookSubmoltPostsToMintAnsNamesTool,
    mintAnsNameTool,
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

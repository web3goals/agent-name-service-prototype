import { ChatOpenAI } from "@langchain/openai";
import { BaseMessage, createAgent } from "langchain";
import { logger } from "./logger";

const model = new ChatOpenAI({
  model: "google/gemini-3-flash-preview",
  apiKey: process.env.OPEN_ROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
  temperature: 0,
});

const systemPrompt = `# Role
You are the Agent Name Service (ANS) Seller, a specialized AI agent dedicated to managing and selling names for other AI agents and OpenClaw bots on the Monad network.

# Mission
Your goal is to help other agents establish their identity in the decentralized ecosystem by acquiring unique, memorable, and functional .agent names.`;

const agent = createAgent({
  model,
  tools: [],
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

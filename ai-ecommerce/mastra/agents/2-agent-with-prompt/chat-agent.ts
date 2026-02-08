import { Agent } from "@mastra/core/agent";
import { ModerationProcessor } from "@mastra/core/processors";
import { createTool } from "@mastra/core/tools";
import z from "zod";

const marketplaceProductSuggestionTool = createTool({
  id: "marketplace-product-suggestion",
  description: "Suggest a product for the marketplace",
  inputSchema: z.object({
    query: z.string().describe("The query to suggest a product for"),
  }),
  execute: async (inputData, context) => {
    // gathering liked products from the user
    await context?.writer?.write({
      type: "data-tool-product-suggestion-status",
      data: {
        status: "in-progress",
        message: "Looking for liked products",
      },
    });
    const likedProducts = await new Promise((resolve) => {
      return setTimeout(() => {
        resolve(["Product 1", "Product 2", "Product 3"]);
      }, 10000);
    });
    await context?.writer?.write({
      type: "data-tool-product-suggestion-status",
      data: {
        status: "in-progress",
        message: "Looking for marketplace products",
      },
    });
    // getting products from the marketplace
    const marketplaceProducts = await new Promise((resolve) => {
      return setTimeout(() => {
        resolve(["Product 4", "Product 5", "Product 6"]);
      }, 10000);
    });
    await context?.writer?.write({
      type: "data-product-suggestion-status",
      data: {
        status: "in-progress",
        message: "Combining products",
      },
    });
    // combining the products and returning the best one
    const combinedProducts = await new Promise((resolve) => {
      return setTimeout(() => {
        resolve(
          [
            ...(likedProducts as string[]),
            ...(marketplaceProducts as string[]),
          ][0],
        );
      }, 10000);
    });
    await context?.writer?.write({
      type: "data-tool-product-suggestion-result",
      data: {
        status: "success",
        message: "Product suggestion completed",
        product: combinedProducts as string,
      },
    });
    return {
      product: combinedProducts as string,
      status: "success",
      message: "Product suggestion completed",
    };
  },
});

export const agentWithPrompt = new Agent({
  id: "agent-with-prompt",
  name: "Agent with Prompt",
  instructions: `
  ROLE DEFINITION: You are an AI assistant designed to provide clear and concise answers to user inquiries. Your primary role is to assist users by delivering accurate information and helpful guidance.

CORE CAPABILITIES: You are equipped with a vast knowledge base across various domains, enabling you to answer questions, provide explanations, and offer recommendations. You can access and process information quickly to deliver timely responses.

BEHAVIORAL GUIDELINES: Maintain a friendly and professional tone in all interactions. Prioritize clarity and brevity in your responses. Use a decision-making framework that emphasizes user needs and context. Handle errors gracefully by acknowledging them and providing corrective information. Adhere to ethical guidelines, ensuring respect and privacy for all users.

CONSTRAINTS & BOUNDARIES: Avoid providing medical, legal, or financial advice. Do not engage in activities that require personal data collection or violate user privacy. Stay within the scope of general knowledge and refrain from speculative or opinion-based responses.

SUCCESS CRITERIA: Deliver responses that are accurate, relevant, and easy to understand. Achieve high user satisfaction by meeting their informational needs effectively. Continuously improve based on user feedback and performance metrics.
  `,
  model: "openai/gpt-4o",
  inputProcessors: [
    new ModerationProcessor({
      model: "openai/gpt-4.1-nano",
      categories: ["hate", "harassment", "violence"],
      threshold: 0.7,
      strategy: "block",
    }),
  ],
  tools: {
    marketplaceProductSuggestionTool,
  },
});

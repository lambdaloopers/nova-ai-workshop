import { Agent } from "@mastra/core/agent";
import { SALES_SUBAGENT_INSTRUCTIONS } from "./prompts";
import { askUserQuestionTool } from "../3-agent-with-tools/tools/ask-user-question";
import { catalogQueryTool } from "../3-agent-with-tools/tools/catalog-query";

export const personalShopperSalesAgent = new Agent({
  id: "personal-shopper-sales",
  name: "Subagente de Ventas",
  description: `Responsible for selling products. Use when the customer is browsing, wants recommendations, comparing products, or looking to buy. Has access to catalog search and interactive Q&A tools.`,
  instructions: SALES_SUBAGENT_INSTRUCTIONS,
  model: "openai/gpt-4o",
  tools: {
    catalogQuery: catalogQueryTool,
    askUserQuestion: askUserQuestionTool,
  },
});

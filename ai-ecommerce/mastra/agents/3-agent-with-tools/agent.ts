import { Agent } from "@mastra/core/agent";
import { SYSTEM_PROMPT } from "./prompts";
import { askUserQuestionTool } from "./tools/ask-user-question";
import { catalogQueryTool } from "./tools/catalog-query";

export const agentWithTools = new Agent({
  id: "agent-with-tools",
  name: "Personal Shopper with Catalog Access",
  instructions: SYSTEM_PROMPT,
  model: "openai/gpt-4o",
  tools: {
    catalogQuery: catalogQueryTool,
    askUserQuestion: askUserQuestionTool,
  },
});

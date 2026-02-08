import { Agent } from "@mastra/core/agent";
import { ModerationProcessor } from "@mastra/core/processors";
import { SYSTEM_PROMPT } from "./prompts";

export const agentWithPrompt = new Agent({
  id: "agent-with-prompt",
  name: "Agent with Prompt",
  instructions: SYSTEM_PROMPT,
  model: "openai/gpt-5.2",
  inputProcessors: [
    new ModerationProcessor({
      model: "openai/gpt-4.1-nano",
      categories: ["hate", "harassment", "violence"],
      threshold: 0.7,
      strategy: "block",
    }),
  ],
});

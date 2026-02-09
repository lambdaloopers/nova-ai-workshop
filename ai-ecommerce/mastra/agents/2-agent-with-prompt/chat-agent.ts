import { Agent } from "@mastra/core/agent";
import { SYSTEM_PROMPT } from "./prompts";

export const agentWithPrompt = new Agent({
  id: "agent-with-prompt",
  name: "Agent with Prompt",
  instructions: SYSTEM_PROMPT,
  model: "openai/gpt-5.2",
});

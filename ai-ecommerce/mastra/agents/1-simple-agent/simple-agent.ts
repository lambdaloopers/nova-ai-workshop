import { Agent } from "@mastra/core/agent";

export const simpleAgent = new Agent({
  id: "simple-agent",
  name: "Simple Agent",
  instructions: `You are a helpful assistant.`,
  model: "openai/gpt-4o",
});

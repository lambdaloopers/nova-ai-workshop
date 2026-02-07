import { Agent } from '@mastra/core/agent';

export const chatAgent = new Agent({
  id: 'chat-agent',
  name: 'Chat Assistant',
  instructions: `You are a helpful assistant. Answer concisely and clearly.`,
  model: 'openai/gpt-4o',
});

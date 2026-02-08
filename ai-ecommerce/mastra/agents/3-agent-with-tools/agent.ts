import { Agent } from '@mastra/core/agent';
import { ModerationProcessor } from '@mastra/core/processors';
import { SYSTEM_PROMPT } from './prompts';
import { catalogQueryTool } from './tools/catalog-query';

export const agentWithTools = new Agent({
  id: 'agent-with-tools',
  name: 'Personal Shopper with Catalog Access',
  instructions: SYSTEM_PROMPT,
  model: 'openai/gpt-4o',
  tools: {
    catalogQuery: catalogQueryTool,
  },
  inputProcessors: [
    new ModerationProcessor({
      model: 'openai/gpt-4.1-nano',
      categories: ['hate', 'harassment', 'violence'],
      threshold: 0.7,
      strategy: 'block',
    }),
  ],
});

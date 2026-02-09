import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { join } from 'node:path';
import { catalogQueryTool } from '../3-agent-with-tools/tools/catalog-query';
import { askUserQuestionTool } from '../3-agent-with-tools/tools/ask-user-question';
import { SYSTEM_PROMPT } from '../3-agent-with-tools/prompts';

const dbPath = join(process.cwd(), 'mastra.db');

export const agentWithMemory = new Agent({
  id: 'agent-with-memory',
  name: 'Personal Shopper with Memory',
  instructions: SYSTEM_PROMPT,
  model: 'openai/gpt-4o',
  tools: {
    catalogQuery: catalogQueryTool,
    askUserQuestion: askUserQuestionTool,
  },
  memory: new Memory({
    storage: new LibSQLStore({ 
      id: 'agent-memory-storage', 
      url: `file:${dbPath}` 
    }),
    options: {
      lastMessages: 20, // Mantener últimos 20 mensajes en contexto
      generateTitle: true,
    },
  }),
  defaultOptions: {
    maxSteps: 2,
  },
});

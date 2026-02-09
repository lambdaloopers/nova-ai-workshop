import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import {
  DefaultExporter,
  Observability,
  SamplingStrategyType,
  SensitiveDataFilter,
} from "@mastra/observability";
import { simpleAgent } from "./agents/1-simple-agent/simple-agent";
import { agentWithPrompt } from "./agents/2-agent-with-prompt/chat-agent";
import { agentWithTools } from "./agents/3-agent-with-tools/agent";
import { agentWithMemory } from "./agents/4-agent-with-memory/agent";

export enum AgentId {
  SIMPLE_AGENT = 'simple-agent',
  AGENT_WITH_PROMPT = 'agent-with-prompt',
  AGENT_WITH_TOOLS = 'agent-with-tools',
  AGENT_WITH_MEMORY = 'agent-with-memory',
}

export const mastra = new Mastra({
  // AGENTS
  agents: { simpleAgent, agentWithPrompt, agentWithTools, agentWithMemory },

  // STORAGE
  storage: new LibSQLStore({
    id: "mastra-storage",
    url: `file:/home/alex/LambdaLoopers/Code/AI/nova-ai-workshop/ai-ecommerce/mastra.db`,
  }),

  // OBSERVABILITY
  observability: new Observability({
    configs: {
      default: {
        sampling: {
          type: SamplingStrategyType.ALWAYS,
        },
        serviceName: "mastra",
        exporters: [new DefaultExporter()],
        spanOutputProcessors: [new SensitiveDataFilter()],
      },
    },
  }),
});

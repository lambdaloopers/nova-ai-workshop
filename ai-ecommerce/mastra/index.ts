import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import {
  DefaultExporter,
  Observability,
  SamplingStrategyType,
  SensitiveDataFilter,
} from "@mastra/observability";
import { simpleAgent } from "./agents/1-simple-agent/simple-agent";
import { chatAgent } from "./agents/chat-agent";

export const mastra = new Mastra({
  // AGENTS
  agents: { simpleAgent, chatAgent },

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

import { join } from "node:path";
import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import {
  SamplingStrategyType,
  DefaultExporter,
  Observability,
  SensitiveDataFilter,
} from "@mastra/observability";
import { chatAgent } from "./agents/chat-agent";

export const mastra = new Mastra({
  agents: { chatAgent },
  storage: new LibSQLStore({
    id: "mastra-storage",
    url: `file:/home/alex/LambdaLoopers/Code/AI/nova-ai-workshop/ai-ecommerce/mastra.db`,
  }),
  observability: new Observability({
    configs: {
      default: {
        sampling: {
          type: SamplingStrategyType.ALWAYS,
        },
        serviceName: "mastra",
        exporters: [
          new DefaultExporter(), // Persists traces to storage for Mastra Studio
        ],
        spanOutputProcessors: [
          new SensitiveDataFilter(), // Redacts sensitive data like passwords, tokens, keys
        ],
      },
    },
  }),
});

import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { PERSONAL_SHOPPER_INSTRUCTIONS } from "./prompts";
import { personalShopperSalesAgent } from "./sales-agent";
import { personalShopperPostSaleAgent } from "./post-sale-agent";
import { agentWithMemory } from "../4-agent-with-memory/agent";

export const personalShopperAgent = new Agent({
  id: "personal-shopper",
  name: "Personal Shopper",
  description: "Coordinates sales and post-sale support for Nova electronics.",
  instructions: PERSONAL_SHOPPER_INSTRUCTIONS,
  model: "openai/gpt-4o",
  agents: {
    personalShopperSales: agentWithMemory,
    personalShopperPostSale: personalShopperPostSaleAgent,
  },
  memory: new Memory({
    storage: new LibSQLStore({
      id: "mastra-storage",
      url: `file:/home/alex/LambdaLoopers/Code/AI/nova-ai-workshop/ai-ecommerce/mastra.db`,
    }),
    options: {
      lastMessages: 20,
      generateTitle: true,
    },
  }),
});

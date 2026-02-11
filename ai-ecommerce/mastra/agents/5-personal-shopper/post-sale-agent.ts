import { Agent } from "@mastra/core/agent";
import { POST_SALE_AGENT_INSTRUCTIONS } from "./prompts";
import { createAssistanceTicketTool } from "./tools/create-assistance-ticket";

export const personalShopperPostSaleAgent = new Agent({
  id: "personal-shopper-post-sale",
  name: "Subagente de Post-Venta",
  description: `Responsible for attending to customers who have ALREADY PURCHASED. Use when the customer has questions about returns, refunds, warranty, delivery status, setup help, troubleshooting, or defective products. Does NOT help with new purchases.`,
  instructions: POST_SALE_AGENT_INSTRUCTIONS,
  model: "openai/gpt-4o",
  tools: {
    createAssistanceTicket: createAssistanceTicketTool,
  },
});

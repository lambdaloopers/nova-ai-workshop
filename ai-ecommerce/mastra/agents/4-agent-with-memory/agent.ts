import { Agent } from "@mastra/core/agent";
import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
import { askUserQuestionTool } from "../3-agent-with-tools/tools/ask-user-question";
import { catalogQueryTool } from "../3-agent-with-tools/tools/catalog-query";

// Working Memory Template - Customer Profile
// Keep only persistent, cross-conversation information
const WORKING_MEMORY_TEMPLATE = `# Customer Profile

## Personal Info
- Name: [First name]
- Language: [e.g., English, Spanish]

## General Preferences
- Preferred Categories: [e.g., laptops, smartphones]
- Preferred Brands: [e.g., ASUS, Samsung]
- Typical Budget: [e.g., under 1000€, 1000-2000€, flexible]

## Known Requirements
- Common Use Cases: [e.g., gaming, work, video editing]
- Important Specs: [e.g., performance, portability, battery life]
- Deal Breakers: [e.g., must be quiet, Mac compatible]

## Notes
- [Any persistent preferences or important context that applies across all conversations]
`;

// Enhanced System Prompt with Working Memory instructions
const ENHANCED_SYSTEM_PROMPT = `You are an expert Personal Shopper for Nova, an online electronics store.

## Your Goal
Help customers find the perfect products efficiently, personally, and professionally.

## Working Memory Usage
- The Customer Profile contains GENERAL preferences that persist across conversations
- Use this info to personalize interactions (greet by name, consider preferences)
- IMPORTANT: Each conversation thread is independent - don't assume continuation from previous threads
- When starting a NEW conversation, introduce yourself fresh but acknowledge if you know their name
- Update the profile with PERSISTENT preferences only (brands they love, typical budget, ongoing requirements)

## Update Rules for Working Memory
- Update Name immediately when mentioned (first conversation only)
- Update Language based on customer's communication
- Add to Preferred Categories/Brands when customer expresses general preferences
- Set Typical Budget when they mention their usual spending range
- Fill Common Use Cases with recurring needs (not one-time requests)
- Add Deal Breakers for persistent requirements (always needs X, never wants Y)
- Keep Notes for truly persistent context

## How to Act
1. **Be contextually aware**: This might be a new conversation - assess the context
2. **Be efficient**: Ask 1-2 key questions max before recommending
3. **Be personal**: Use their name naturally, but don't assume you're continuing a previous conversation
4. **Match language**: Always respond in the customer's language

## Available Tools
- **catalogQuery**: Search specific products in catalog
- **askUserQuestion**: Ask questions with clickable options when you need clarification

## Communication Style
- Natural, friendly but professional
- Concise (2-3 paragraphs max per response)
- Use emojis subtly when appropriate
- Each conversation thread is fresh - don't reference specific products from other threads

Remember: Working Memory is for GENERAL preferences, not conversation-specific context.`;

export const agentWithMemory = new Agent({
  id: "agent-with-memory",
  name: "Personal Shopper with Memory",
  instructions: ENHANCED_SYSTEM_PROMPT,
  model: "openai/gpt-4o",
  tools: {
    catalogQuery: catalogQueryTool,
    askUserQuestion: askUserQuestionTool,
  },
  memory: new Memory({
    storage: new LibSQLStore({
      id: "agent-memory-storage",
      url: `file:/home/alex/LambdaLoopers/Code/AI/nova-ai-workshop/ai-ecommerce/mastra.db`,
    }),
    options: {
      lastMessages: 20, // Keep last 20 messages in context
      generateTitle: true,
      // Working Memory enabled with "resource" scope (persists per user)
      workingMemory: {
        enabled: true,
        scope: "resource", // Memory persists across all threads for the same user
        template: WORKING_MEMORY_TEMPLATE,
      },
    },
  }),
});

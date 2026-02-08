import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

/**
 * Interactive Q&A tool that allows the agent to ask the user a question
 * with suggested quick-reply options.
 * 
 * This tool returns immediately with the question and suggestions.
 * The user's response should be sent as the next message in the conversation.
 */
export const askUserQuestionTool = createTool({
  id: 'ask-user-question',
  description: `
Ask the customer a question with suggested quick-reply options.
Use this when you need to refine product search, clarify preferences, or gather specific information.
The user can click a suggestion or type their own answer.

Example use cases:
- "Which category interests you?" with options: ["Laptops", "Monitors", "Components"]
- "What's your budget range?" with options: ["Under €500", "€500-€1000", "€1000-€2000", "Over €2000"]
- "Gaming or productivity?" with options: ["Gaming", "Work/Productivity", "Both"]

IMPORTANT: After calling this tool, STOP and wait for the user's response.
Do NOT continue with other actions or questions. The user will provide their answer in their next message.
`,
  inputSchema: z.object({
    question: z
      .string()
      .describe('The question to ask the user (clear and concise)'),
    suggestions: z
      .array(z.string())
      .min(2)
      .max(6)
      .describe('2-6 suggested quick-reply options for the user to choose from'),
  }),

  outputSchema: z.object({
    question: z.string(),
    suggestions: z.array(z.string()),
    waitingForUserResponse: z.boolean(),
  }),

  execute: async ({ question, suggestions }) => {
    // Return the question immediately - the user will respond in their next message
    return {
      question,
      suggestions,
      waitingForUserResponse: true,
    };
  },
});

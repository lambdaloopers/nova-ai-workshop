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
MANDATORY: Use this tool whenever you need to ask a clarifying question with 2-6 options.
NEVER write questions like "¿Para qué lo usarás?", "¿Qué presupuesto tienes?", "Gaming o trabajo?" in plain text - always call this tool instead.

Ask the customer a question with suggested quick-reply options. The user can click a suggestion or type their own answer.

Example use cases (call the tool, don't write in text):
- Use case: question="¿Para qué lo usarás?" suggestions=["Gaming","Trabajo/estudios","Edición vídeo","Uso general"]
- Budget: question="¿Presupuesto aproximado?" suggestions=["<500€","500-1000€","1000-1500€",">1500€"]
- Yes/No: question="¿Lo llevarás en mochila a diario?" suggestions=["Sí","No"]

IMPORTANT: After calling this tool, STOP and wait. Do NOT write the question in your response - the tool displays it.
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

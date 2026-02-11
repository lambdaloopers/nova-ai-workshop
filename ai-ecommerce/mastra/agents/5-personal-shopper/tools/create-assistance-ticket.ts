import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

/**
 * Creates an assistance ticket for post-sale support.
 * Renders visually in the chat with a ticket card.
 */
export const createAssistanceTicketTool = createTool({
  id: 'create-assistance-ticket',
  description: `
Create a support/assistance ticket for the customer's post-purchase issue.
Use when the customer needs formal follow-up: returns, warranty claims, defective products,
delivery problems, or complex setup issues.

IMPORTANT - Fill subject and description with DISTINCT, useful content:
- subject: Short title (5-10 words), e.g. "Pedido no recibido" or "Solicitud de devolución"
- description: Concise summary with key details (what happened, product/order if known)
Do NOT use your response text as subject/description. Extract the core issue from the customer.
`,
  inputSchema: z.object({
    category: z
      .enum(['return', 'warranty', 'delivery', 'defect', 'setup', 'other'])
      .describe('Type: return, warranty, delivery, defect, setup, other'),
    subject: z
      .string()
      .describe(
        'Short title (5-10 words). Examples: "Pedido no recibido", "Producto defectuoso", "Solicitud de devolución"'
      ),
    description: z
      .string()
      .describe(
        'Concise summary of the issue with key details. NOT your reply to the customer.'
      ),
    priority: z
      .enum(['low', 'medium', 'high'])
      .optional()
      .default('medium')
      .describe('Priority level'),
  }),

  outputSchema: z.object({
    ticketId: z.string(),
    category: z.string(),
    subject: z.string(),
    description: z.string(),
    priority: z.string(),
    status: z.string(),
    createdAt: z.string(),
  }),

  execute: async ({ category, subject, description, priority = 'medium' }) => {
    // Generate a realistic ticket ID (in a real app, this would come from a backend)
    const ticketId = `NVA-${Date.now().toString(36).toUpperCase().slice(-8)}`;
    const createdAt = new Date().toISOString();

    return {
      ticketId,
      category,
      subject,
      description,
      priority,
      status: 'open',
      createdAt,
    };
  },
});

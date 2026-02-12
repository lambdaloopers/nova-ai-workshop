'use client';

import type { ReactNode } from 'react';
import type { DynamicToolUIPart, UITool, UIToolInvocation } from 'ai';
import { MessageResponse } from '@/components/ai-elements/message';
import { ProductSuggestionCard } from './product-suggestion-card';
import { UserQuestionRenderer } from './user-question-renderer';
import { AssistanceTicketCard } from './assistance-ticket-card';
import { Shimmer } from '@/components/ai-elements/shimmer';
import { extractTicketFromOutput } from '@/lib/extract-ticket-from-output';
import {
  extractProductsFromSubagentOutput,
  extractTextFromSubagentOutput,
  extractUserQuestionFromMessageParts,
} from '@/lib/extract-subagent-output';

type ToolPart = DynamicToolUIPart | ({ type: `tool-${string}` } & UIToolInvocation<UITool>);

interface ToolRendererProps {
  part: ToolPart;
  messageParts?: Array<{ type?: string; data?: unknown; output?: unknown; state?: string }>;
  onSendMessage?: (text: string) => void;
}

/**
 * Routes tool invocations to the appropriate renderer based on tool name and state.
 * Add new tool renderers here as you add more tools to agents.
 */
export function ToolRenderer({ part, messageParts, onSendMessage }: ToolRendererProps) {
  // catalogQuery tool (key name in agent.tools object)
  if (part.type === 'tool-catalogQuery') {
    switch (part.state) {
      case 'input-available':
        return (
          <div className="flex flex-col gap-2">
            <Shimmer className="text-xs">Searching catalog…</Shimmer>
          </div>
        );

      case 'output-available': {
        const output = part.output as {
          success: boolean;
          products?: Array<{
            id: string;
            name: string;
            brand: string;
            category: string;
            price: number;
            originalPrice: number | null;
            discount: number | null;
            rating: number;
            reviewCount: number;
            image: string;
            badges: string[];
            freeShipping: boolean;
            slug: string;
          }>;
        };

        if (!output.success || !output.products || output.products.length === 0) {
          return (
            <div className="rounded-lg border border-dashed bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              No products found matching the criteria.
            </div>
          );
        }

        return (
          <div className="flex flex-col gap-2">
            {output.products.map((product) => (
              <ProductSuggestionCard key={product.id} product={product} />
            ))}
          </div>
        );
      }

      case 'output-error':
        return (
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            Error searching catalog: {part.errorText || 'Unknown error'}
          </div>
        );
    }
  }

  // askUserQuestion tool (interactive Q&A with suggestions)
  if (part.type === 'tool-askUserQuestion') {
    switch (part.state) {
      case 'input-streaming':
      case 'input-available':
        return (
          <div className="flex flex-col gap-2">
            <Shimmer className="text-xs">Preparing question…</Shimmer>
          </div>
        );

      case 'output-available': {
        const output = part.output as {
          question: string;
          suggestions: string[];
          waitingForUserResponse?: boolean;
        };

        // Show the interactive question UI
        if (output.waitingForUserResponse) {
          return (
            <UserQuestionRenderer
              question={output.question}
              suggestions={output.suggestions}
              onSelectSuggestion={(answer) => {
                // Send the user's answer as a regular message
                onSendMessage?.(answer);
              }}
            />
          );
        }

        // Fallback
        return (
          <div className="rounded-lg border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
            Question: {output.question}
          </div>
        );
      }

      case 'output-error':
        return (
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            Error: {part.errorText || 'Failed to ask question'}
          </div>
        );
    }
  }

  // personalShopperSales subagent - show products and/or Q&A from nested tool calls
  const salesSubagentTypes = [
    'tool-personalShopperSales',
    'tool-agent-personalShopperSales',
  ];
  if (salesSubagentTypes.includes(part.type)) {
    switch (part.state) {
      case 'input-streaming':
      case 'input-available':
        return (
          <div className="flex flex-col gap-2">
            <Shimmer className="text-xs">Buscando para ti…</Shimmer>
          </div>
        );

      case 'output-available': {
        const products = extractProductsFromSubagentOutput(part.output);
        const userQuestion = extractUserQuestionFromMessageParts(messageParts ?? [part]);
        const text = extractTextFromSubagentOutput(part.output);

        const elements: ReactNode[] = [];

        if (userQuestion?.waitingForUserResponse) {
          elements.push(
            <UserQuestionRenderer
              key="question"
              question={userQuestion.question}
              suggestions={userQuestion.suggestions}
              onSelectSuggestion={(answer) => onSendMessage?.(answer)}
            />
          );
        }

        if (text?.trim()) {
          elements.push(
            <MessageResponse key="message">{text}</MessageResponse>
          );
        }

        if (products && products.length > 0) {
          elements.push(
            <div key="products" className="flex flex-col gap-2">
              {products.map((product) => (
                <ProductSuggestionCard key={product.id} product={product} />
              ))}
            </div>
          );
        }

        if (elements.length > 0) {
          return <div className="flex flex-col gap-3">{elements}</div>;
        }
        return null;
      }

      case 'output-error':
        return (
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            Error: {part.errorText || 'Error al procesar'}
          </div>
        );

      default:
        return null;
    }
  }

  // personalShopperPostSale subagent - show ticket card when ticket was created
  const subagentTypes = [
    'tool-personalShopperPostSale',
    'tool-agent-personalShopperPostSale',
  ];
  if (subagentTypes.includes(part.type)) {
    switch (part.state) {
      case 'input-streaming':
      case 'input-available':
        return (
          <div className="flex flex-col gap-2">
            <Shimmer className="text-xs">Atendiendo tu solicitud…</Shimmer>
          </div>
        );

      case 'output-available': {
        const ticket = extractTicketFromOutput(part.output);
        if (ticket) {
          return (
            <AssistanceTicketCard
              ticketId={ticket.ticketId}
              category={ticket.category}
              subject={ticket.subject}
              description={ticket.description}
              priority={ticket.priority}
              status={ticket.status}
              createdAt={ticket.createdAt}
            />
          );
        }
        return null;
      }

      case 'output-error':
        return (
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            Error: {part.errorText || 'Error al procesar la solicitud'}
          </div>
        );

      default:
        return null;
    }
  }

  // createAssistanceTicket tool (direct tool call from post-sale agent)
  if (part.type === 'tool-createAssistanceTicket') {
    switch (part.state) {
      case 'input-streaming':
      case 'input-available':
        return (
          <div className="flex flex-col gap-2">
            <Shimmer className="text-xs">Creando ticket de asistencia…</Shimmer>
          </div>
        );

      case 'output-available': {
        const output = part.output as {
          ticketId: string;
          category: string;
          subject: string;
          description: string;
          priority: string;
          status: string;
          createdAt: string;
        };
        return (
          <AssistanceTicketCard
            ticketId={output.ticketId}
            category={output.category}
            subject={output.subject}
            description={output.description}
            priority={output.priority}
            status={output.status}
            createdAt={output.createdAt}
          />
        );
      }

      case 'output-error':
        return (
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            Error creando ticket: {part.errorText || 'Error desconocido'}
          </div>
        );
    }
  }

  // Fallback for unknown tools
  return (
    <div className="rounded-lg border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
      Tool: {part.type.replace('tool-', '')}
    </div>
  );
}

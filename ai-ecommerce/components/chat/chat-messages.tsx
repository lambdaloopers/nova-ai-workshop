"use client";

import { isToolUIPart, type UIMessage } from "ai";
import {
  extractTicketFromOutput,
  extractTicketFromText,
} from "@/lib/extract-ticket-from-output";
import { AssistanceTicketCard } from "./tool-renderers/assistance-ticket-card";
import { SparklesIcon } from "lucide-react";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { cn } from "@/lib/utils";
import { ToolRenderer } from "./tool-renderers/tool-renderer";

interface ChatMessagesProps {
  messages: UIMessage[];
  status: string;
  suggestions: string[];
  onSuggestion: (text: string) => void;
}

export function ChatMessages({
  messages,
  status,
  suggestions,
  onSuggestion,
}: ChatMessagesProps) {
  return (
    <Conversation className="flex-1">
      <ConversationContent className="gap-4 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center py-12">
            <ConversationEmptyState
              icon={<SparklesIcon className="size-9 text-primary/20" />}
              title="How Can I Help?"
              description="Ask about products, comparisons, or recommendations."
            />
            <div className="mt-5 flex flex-col gap-1.5 w-full max-w-[260px]">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onSuggestion(s)}
                  className="rounded-lg border bg-background px-3.5 py-2 text-left text-xs leading-relaxed text-muted-foreground transition-colors duration-200 hover:border-primary/30 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => {
            // Check if this message contains an ask-user-question tool call
            const hasAskUserQuestion = message.parts?.some(
              (part) => isToolUIPart(part) && part.type === 'tool-askUserQuestion'
            );

            // Check if we have a ticket card (from tool part or text containing NVA-XXX)
            const hasTicketCard =
              message.parts?.some((part) => {
                if (!isToolUIPart(part)) return false;
                const isSubagent =
                  part.type === 'tool-personalShopperPostSale' ||
                  part.type === 'tool-agent-personalShopperPostSale';
                if (!isSubagent || part.state !== 'output-available') return false;
                return !!extractTicketFromOutput(part.output);
              }) ||
              message.parts?.some(
                (part) =>
                  part.type === 'text' &&
                  !!extractTicketFromText((part as { text: string }).text)
              );

            return (
              <Message from={message.role} key={message.id}>
                <MessageContent
                  className={cn(
                    "group-[.is-user]:rounded-2xl group-[.is-user]:rounded-tr-md group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground group-[.is-user]:px-3.5 group-[.is-user]:py-2",
                    "group-[.is-assistant]:bg-transparent group-[.is-assistant]:p-0",
                  )}
                >
                  {message.parts?.map((part, i) => {
                    switch (part.type) {
                      case "text": {
                        // Hide text if ask-user-question shows its own UI
                        if (hasAskUserQuestion) return null;
                        const text = (part as { text: string }).text;
                        // If text contains ticket ID, render card instead
                        const ticketFromText = extractTicketFromText(text);
                        if (ticketFromText) {
                          return (
                            <AssistanceTicketCard
                              key={`${message.id}-${i}`}
                              ticketId={ticketFromText.ticketId}
                              category={ticketFromText.category}
                              subject={ticketFromText.subject}
                              description={ticketFromText.description}
                              priority={ticketFromText.priority}
                              status={ticketFromText.status}
                              createdAt={ticketFromText.createdAt}
                            />
                          );
                        }
                        // Hide text if we show ticket from tool part
                        if (hasTicketCard) return null;
                        return (
                          <MessageResponse key={`${message.id}-${i}`}>
                            {text}
                          </MessageResponse>
                        );
                      }
                      default:
                        if (isToolUIPart(part)) {
                          return (
                            <ToolRenderer
                              key={`${message.id}-${i}`}
                              part={part}
                              onSendMessage={onSuggestion}
                            />
                          );
                        }
                        return null;
                    }
                  })}
                </MessageContent>
              </Message>
            );
          })
        )}
        {(status === "submitted" || status === "streaming") &&
          messages.at(-1)?.role !== "assistant" && (
            <Message from="assistant">
              <MessageContent>
                <Shimmer>Thinking&hellip;</Shimmer>
              </MessageContent>
            </Message>
          )}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}

'use client';

import { useState } from 'react';
import { DefaultChatTransport } from 'ai';
import { useChat } from '@ai-sdk/react';
import { ArrowLeftIcon, SparklesIcon } from 'lucide-react';
import Link from 'next/link';

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  type PromptInputMessage,
} from '@/components/ai-elements/prompt-input';
import { Shimmer } from '@/components/ai-elements/shimmer';
import { cn } from '@/lib/utils';

export default function ChatPage() {
  const [input, setInput] = useState('');

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text?.trim()) return;
    sendMessage({ text: message.text });
    setInput('');
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-4 border-b bg-card/80 px-6 py-3 backdrop-blur-lg">
        <Link
          href="/"
          className="flex h-8 w-8 items-center justify-center rounded-lg border text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Back to home"
        >
          <ArrowLeftIcon className="size-4" aria-hidden="true" />
        </Link>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <SparklesIcon className="size-4 text-primary" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">Nova Assistant</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {status === 'streaming' ? 'Typing\u2026' : 'Ask about any product'}
            </p>
          </div>
        </div>
      </header>

      {/* Conversation */}
      <Conversation className="flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl gap-6 p-6">
          {messages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center py-24">
              <ConversationEmptyState
                icon={<SparklesIcon className="size-12 text-primary/25" />}
                title="Start a Conversation"
                description="Ask me anything — product recommendations, comparisons, or general questions."
              />
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {[
                  'Recommend a laptop under 1,000\u00a0\u20ac',
                  'Compare wireless earbuds',
                  'Best monitors for gaming',
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => sendMessage({ text: suggestion })}
                    className="rounded-full border bg-card px-4 py-2 text-xs text-muted-foreground shadow-sm transition-colors duration-200 hover:border-primary/30 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent
                  className={cn(
                    'group-[.is-user]:rounded-2xl group-[.is-user]:rounded-tr-md group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground group-[.is-user]:px-4 group-[.is-user]:py-2.5',
                    'group-[.is-assistant]:bg-transparent group-[.is-assistant]:p-0',
                  )}
                >
                  {message.parts?.map((part, i) => {
                    if (part.type === 'text') {
                      return (
                        <MessageResponse key={`${message.id}-${i}`}>
                          {(part as { text: string }).text}
                        </MessageResponse>
                      );
                    }
                    return null;
                  })}
                </MessageContent>
              </Message>
            ))
          )}
          {(status === 'submitted' || status === 'streaming') &&
            messages.at(-1)?.role !== 'assistant' && (
              <Message from="assistant">
                <MessageContent>
                  <Shimmer>Thinking&hellip;</Shimmer>
                </MessageContent>
              </Message>
            )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Input */}
      <div className="border-t bg-card/80 backdrop-blur-lg">
        <div className="mx-auto w-full max-w-3xl p-4">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputBody>
              <PromptInputTextarea
                value={input}
                onChange={(e) => setInput(typeof e === 'string' ? e : e.target.value)}
                placeholder="Ask about products, specs, comparisons…"
              />
            </PromptInputBody>
            <PromptInputFooter className="justify-end p-2">
              <PromptInputSubmit status={status} onStop={stop} />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}

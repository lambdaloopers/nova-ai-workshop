'use client';

import { useState } from 'react';
import { DefaultChatTransport } from 'ai';
import { useChat } from '@ai-sdk/react';
import { MessageSquareIcon, XIcon, SparklesIcon } from 'lucide-react';

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

export function ChatWidget() {
  const [open, setOpen] = useState(false);
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
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        className={cn(
          'fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform duration-200',
          'bg-primary text-primary-foreground hover:scale-105',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        )}
      >
        {open ? (
          <XIcon className="size-5" aria-hidden="true" />
        ) : (
          <MessageSquareIcon className="size-5" aria-hidden="true" />
        )}
      </button>

      {/* Chat panel */}
      <div
        className={cn(
          'fixed bottom-24 right-6 z-50 flex flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl',
          'w-[400px] max-w-[calc(100vw-3rem)]',
          'transition-[height,opacity,transform] duration-300',
          open
            ? 'h-[min(620px,calc(100vh-8rem))] opacity-100 translate-y-0'
            : 'pointer-events-none h-0 opacity-0 translate-y-4',
        )}
        style={{ overscrollBehavior: 'contain' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
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
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close chat"
          >
            <XIcon className="size-4" aria-hidden="true" />
          </button>
        </div>

        {/* Conversation */}
        <Conversation className="flex-1">
          <ConversationContent className="gap-4 p-4">
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<SparklesIcon className="size-10 text-primary/30" />}
                title="How can I help?"
                description="Ask about products, comparisons, or recommendations."
              />
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
        <div className="border-t p-3">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputBody>
              <PromptInputTextarea
                value={input}
                onChange={(e) => setInput(typeof e === 'string' ? e : e.target.value)}
                placeholder="Ask about a product…"
                className="min-h-[40px] max-h-[120px] text-sm"
              />
            </PromptInputBody>
            <PromptInputFooter className="justify-end p-1.5">
              <PromptInputSubmit status={status} onStop={stop} />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </>
  );
}

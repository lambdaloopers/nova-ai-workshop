'use client';

import { useState } from 'react';
import { DefaultChatTransport } from 'ai';
import { useChat } from '@ai-sdk/react';
import { MessageSquareIcon, XIcon } from 'lucide-react';

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
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        className={cn(
          'fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200',
          'bg-primary text-primary-foreground hover:scale-105 hover:shadow-xl',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        )}
      >
        {open ? <XIcon className="size-6" /> : <MessageSquareIcon className="size-6" />}
      </button>

      {/* Chat panel */}
      <div
        className={cn(
          'fixed bottom-24 right-6 z-50 flex flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl transition-all duration-300',
          'w-[380px] max-w-[calc(100vw-3rem)]',
          open
            ? 'h-[min(600px,calc(100vh-8rem))] opacity-100 translate-y-0'
            : 'pointer-events-none h-0 opacity-0 translate-y-4',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <MessageSquareIcon className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">AI Assistant</p>
              <p className="text-xs text-muted-foreground">Ask me anything</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Close chat"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        {/* Conversation */}
        <Conversation className="flex-1">
          <ConversationContent className="gap-4 p-4">
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<MessageSquareIcon className="size-10 text-muted-foreground/50" />}
                title="How can I help?"
                description="Type a message below to start chatting."
              />
            ) : (
              messages.map((message) => (
                <Message from={message.role} key={message.id}>
                  <MessageContent
                    className={cn(
                      'group-[.is-user]:rounded-2xl group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground group-[.is-user]:px-4 group-[.is-user]:py-2.5',
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
                    <Shimmer>Thinking...</Shimmer>
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
                placeholder="Type a message..."
                className="min-h-[40px] max-h-[120px] text-sm"
              />
            </PromptInputBody>
            <PromptInputFooter className="justify-end p-1.5">
              <PromptInputSubmit
                status={status}
                onStop={stop}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </>
  );
}

'use client';

import { useState } from 'react';
import { DefaultChatTransport } from 'ai';
import { useChat } from '@ai-sdk/react';
import { ArrowLeftIcon, MessageSquareIcon, SparklesIcon } from 'lucide-react';
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
      <header className="flex items-center gap-4 border-b px-6 py-3">
        <Link
          href="/"
          className="flex h-8 w-8 items-center justify-center rounded-lg border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Back to home"
        >
          <ArrowLeftIcon className="size-4" />
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <SparklesIcon className="size-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">Nova AI Assistant</p>
            <p className="text-xs text-muted-foreground">
              {status === 'streaming' ? 'Typing...' : 'Online'}
            </p>
          </div>
        </div>
      </header>

      {/* Conversation area */}
      <Conversation className="flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl gap-6 p-6">
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<MessageSquareIcon className="size-12 text-muted-foreground/40" />}
              title="Start a conversation"
              description="Ask me anything — product recommendations, comparisons, or general questions."
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

      {/* Input area */}
      <div className="border-t bg-background">
        <div className="mx-auto w-full max-w-3xl p-4">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputBody>
              <PromptInputTextarea
                value={input}
                onChange={(e) => setInput(typeof e === 'string' ? e : e.target.value)}
                placeholder="Ask me anything..."
              />
            </PromptInputBody>
            <PromptInputFooter className="justify-end p-2">
              <PromptInputSubmit
                status={status}
                onStop={stop}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}

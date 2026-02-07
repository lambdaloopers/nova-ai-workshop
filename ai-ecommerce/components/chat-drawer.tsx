'use client';

import { useEffect, useRef, useState } from 'react';
import { DefaultChatTransport } from 'ai';
import { useChat } from '@ai-sdk/react';
import { SparklesIcon, PanelRightCloseIcon } from 'lucide-react';

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
import { useChatDrawer } from '@/lib/chat-drawer-context';

const PANEL_WIDTH = 420; // px — keep in sync with MainContent margin

const suggestions = [
  'Recommend a laptop under 1,000\u00a0\u20ac',
  'Compare wireless earbuds',
  'Best monitors for gaming',
];

export function ChatDrawer() {
  const { open, setOpen } = useChatDrawer();
  const [input, setInput] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text?.trim()) return;
    sendMessage({ text: message.text });
    setInput('');
  };

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, setOpen]);

  return (
    <aside
      ref={panelRef}
      role="complementary"
      aria-label="AI Chat assistant"
      className={cn(
        'fixed inset-y-0 right-0 z-40 flex flex-col border-l bg-card',
        'transition-transform duration-300 ease-out motion-reduce:transition-none',
        open ? 'translate-x-0' : 'translate-x-full',
      )}
      style={{ width: PANEL_WIDTH, overscrollBehavior: 'contain' }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b px-4 py-3.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <SparklesIcon className="size-4 text-primary" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-none truncate">Nova Assistant</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground truncate">
              {status === 'streaming' ? 'Typing\u2026' : 'Ask about any product'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Close chat"
        >
          <PanelRightCloseIcon className="size-4" aria-hidden="true" />
        </button>
      </div>

      {/* ── Conversation ── */}
      <Conversation className="flex-1">
        <ConversationContent className="gap-4 p-4">
          {messages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center py-12">
              <ConversationEmptyState
                icon={<SparklesIcon className="size-9 text-primary/20" />}
                title="How Can I Help?"
                description="Ask about products, comparisons, or recommendations."
              />
              {/* Suggestion chips */}
              <div className="mt-5 flex flex-col gap-1.5 w-full max-w-[260px]">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => sendMessage({ text: s })}
                    className="rounded-lg border bg-background px-3.5 py-2 text-left text-xs leading-relaxed text-muted-foreground transition-colors duration-200 hover:border-primary/30 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent
                  className={cn(
                    'group-[.is-user]:rounded-2xl group-[.is-user]:rounded-tr-md group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground group-[.is-user]:px-3.5 group-[.is-user]:py-2',
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

      {/* ── Input ── */}
      <div className="border-t p-3">
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputBody>
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(typeof e === 'string' ? e : e.target.value)}
              placeholder="Ask about products, specs, comparisons…"
              className="min-h-[40px] max-h-[120px] text-sm"
            />
          </PromptInputBody>
          <PromptInputFooter className="justify-end p-1">
            <PromptInputSubmit status={status} onStop={stop} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </aside>
  );
}

/** Width constant exported for the layout wrapper */
export { PANEL_WIDTH };

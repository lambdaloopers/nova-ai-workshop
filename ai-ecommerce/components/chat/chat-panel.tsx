'use client';

import { useState } from 'react';
import { DefaultChatTransport } from 'ai';
import { useChat } from '@ai-sdk/react';
import type { PromptInputMessage } from '@/components/ai-elements/prompt-input';
import { useAgent } from '@/lib/agent-context';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';

const suggestions = [
  'Recommend a laptop under 1,000\u00a0\u20ac',
  'Compare wireless earbuds',
  'Sugiereme un producto cualquiera',
];

/**
 * Owns the chat logic (useChat hook) and composes ChatMessages + ChatInput.
 * Doesn't know anything about the drawer/container that wraps it.
 */
export function ChatPanel() {
  const [input, setInput] = useState('');
  const { agentId } = useAgent();

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({ api: `/api/chat?agentId=${agentId}` }),
  });

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text?.trim()) return;
    sendMessage({ text: message.text });
    setInput('');
  };

  return (
    <>
      <ChatMessages
        messages={messages}
        status={status}
        suggestions={suggestions}
        onSuggestion={(text) => sendMessage({ text })}
      />
      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        status={status}
        onStop={stop}
      />
    </>
  );
}

/** Re-export status type helper for the drawer header */
export { useChat };

'use client';

import { useState, useEffect } from 'react';
import { DefaultChatTransport } from 'ai';
import { useChat } from '@ai-sdk/react';
import type { PromptInputMessage } from '@/components/ai-elements/prompt-input';
import { useAgent } from '@/lib/agent-context';
import { useAuth } from '@/lib/auth-context';
import { useThread } from '@/lib/thread-context';
import { AGENT_IDS } from '@/lib/agent-ids';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';

const suggestions = [
  'Recommend a laptop under 1,000 €',
  'Compare wireless earbuds',
  'Sugiereme un producto cualquiera',
];

/**
 * Owns the chat logic (useChat hook) and composes ChatMessages + ChatInput.
 * Doesn't know anything about the drawer/container that wraps it.
 */
export function ChatPanel() {
  const [input, setInput] = useState('');
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const { agentId } = useAgent();
  const { user } = useAuth();
  const { activeThreadId, createThread } = useThread();

  const userId = user?.id || 'anonymous';
  
  // Solo usar memoria si es el agente con memoria
  const memoryEnabled = agentId === AGENT_IDS.AGENT_WITH_MEMORY;
  
  // Para el threadId: si hay activeThreadId usarlo, si no usar temp
  const threadId = activeThreadId || `temp-${agentId}`;

  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({ 
      api: `/api/chat?agentId=${agentId}&userId=${userId}&threadId=${threadId}` 
    }),
  });

  // Efecto para enviar mensaje pendiente después de crear thread
  useEffect(() => {
    if (pendingMessage && activeThreadId) {
      sendMessage({ text: pendingMessage });
      setPendingMessage(null);
    }
  }, [pendingMessage, activeThreadId, sendMessage]);

  const handleSubmit = async (message: PromptInputMessage) => {
    if (!message.text?.trim()) return;
    
    // Si no hay thread activo y estamos usando el agente con memoria, crear uno primero
    if (memoryEnabled && !activeThreadId && user) {
      // Guardar el mensaje para enviarlo después de crear el thread
      setPendingMessage(message.text);
      await createThread();
      setInput('');
      return;
    }
    
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
        error={error}
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

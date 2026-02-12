'use client';

import { useState, useRef, useEffect } from 'react';
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
  'Recommend a laptop under 2,000 €',
  'Suggest a random product, I am in the mood for something new',
  'I would like to submit a support ticket, I have a problem with my order',
];

/**
 * Owns the chat logic (useChat hook) and composes ChatMessages + ChatInput.
 * Doesn't know anything about the drawer/container that wraps it.
 */
export function ChatPanel() {
  const [input, setInput] = useState('');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const pendingMessageRef = useRef<string | null>(null);
  const { agentId } = useAgent();
  const { user } = useAuth();
  const { activeThreadId, createThread } = useThread();

  const userId = user?.id || 'anonymous';
  
  // Solo usar memoria si es el agente con memoria
  const memoryEnabled = agentId === AGENT_IDS.AGENT_WITH_MEMORY;
  
  // Para el threadId: si hay activeThreadId usarlo, si no usar temp
  const threadId = activeThreadId || `temp-${agentId}`;

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    transport: new DefaultChatTransport({ 
      api: `/api/chat?agentId=${agentId}&userId=${userId}&threadId=${threadId}` 
    }),
  });

  // Load historical messages when switching to an existing thread
  useEffect(() => {
    if (!activeThreadId || !memoryEnabled) {
      return;
    }

    const loadMessages = async () => {
      setIsLoadingHistory(true);
      try {
        const response = await fetch(`/api/threads/${activeThreadId}/messages`);
        const data = await response.json();
        if (data.messages && data.messages.length > 0) {
          // Use setMessages to load historical messages
          setMessages(data.messages);
        }
      } catch (error) {
        console.error('[ChatPanel] Error loading thread messages:', error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadMessages();
  }, [activeThreadId, memoryEnabled, setMessages]);

  const handleSubmit = async (message: PromptInputMessage) => {
    if (!message.text?.trim()) return;
    
    // Si no hay thread activo y estamos usando el agente con memoria, crear uno primero
    if (memoryEnabled && !activeThreadId && user) {
      // Guardar el mensaje para enviarlo después de crear el thread
      pendingMessageRef.current = message.text;
      await createThread();
      
      // Enviar el mensaje después de crear el thread
      if (pendingMessageRef.current) {
        sendMessage({ text: pendingMessageRef.current });
        pendingMessageRef.current = null;
      }
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
        status={isLoadingHistory ? 'loading' : status}
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

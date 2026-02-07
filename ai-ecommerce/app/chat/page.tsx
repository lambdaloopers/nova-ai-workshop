'use client';

import { DefaultChatTransport, type ToolUIPart } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useRef, useEffect, useState } from 'react';

export default function ChatPage() {
  const { messages, setMessages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status !== 'ready') return;
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <div className="flex h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b bg-white px-4 py-3 dark:bg-zinc-900">
        <h1 className="font-semibold">Chat</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-center text-zinc-500 dark:text-zinc-400">
            Escribe un mensaje para empezar.
          </p>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.role === 'user'
                ? 'ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-zinc-200 px-4 py-2 dark:bg-zinc-800'
                : 'max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-2 shadow dark:bg-zinc-900'
            }`}
          >
            {message.parts?.map((part, i) => {
              if (part.type === 'text') {
                return (
                  <p key={`${message.id}-${i}`} className="whitespace-pre-wrap">
                    {(part as { text?: string }).text}
                  </p>
                );
              }
              if (typeof part.type === 'string' && part.type.startsWith('tool-')) {
                const tool = part as ToolUIPart & { name?: string; title?: string };
                const label = tool.name ?? tool.title ?? 'tool';
                return (
                  <details key={`${message.id}-${i}`} className="mt-2 text-sm">
                    <summary className="cursor-pointer font-medium">
                      Tool: {label}
                    </summary>
                    <pre className="mt-1 overflow-auto rounded bg-zinc-100 p-2 dark:bg-zinc-800">
                      {JSON.stringify(tool.output ?? tool.input ?? {}, null, 2)}
                    </pre>
                  </details>
                );
              }
              return null;
            })}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t bg-white p-4 dark:bg-zinc-900"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe aquí..."
            className="flex-1 rounded-lg border border-zinc-300 bg-transparent px-4 py-2 outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
            disabled={status !== 'ready'}
          />
          <button
            type="submit"
            disabled={!input.trim() || status !== 'ready'}
            className="rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {status === 'streaming' ? '…' : 'Enviar'}
          </button>
        </div>
      </form>
    </div>
  );
}

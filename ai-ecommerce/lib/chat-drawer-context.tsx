'use client';

import { createContext, useCallback, useContext, useState } from 'react';

interface ChatDrawerContextValue {
  open: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
}

const ChatDrawerContext = createContext<ChatDrawerContextValue | null>(null);

export function ChatDrawerProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  return (
    <ChatDrawerContext.Provider value={{ open, toggle, setOpen }}>
      {children}
    </ChatDrawerContext.Provider>
  );
}

export function useChatDrawer() {
  const ctx = useContext(ChatDrawerContext);
  if (!ctx) throw new Error('useChatDrawer must be used within ChatDrawerProvider');
  return ctx;
}

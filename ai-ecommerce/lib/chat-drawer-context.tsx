'use client';

import { createContext, useCallback, useContext, useState } from 'react';

export const PANEL_DEFAULT_WIDTH = 420;
export const PANEL_MIN_WIDTH = 320;
export const PANEL_MAX_WIDTH = 800;

interface ChatDrawerContextValue {
  open: boolean;
  width: number;
  toggle: () => void;
  setOpen: (open: boolean) => void;
  setWidth: (w: number) => void;
}

const ChatDrawerContext = createContext<ChatDrawerContextValue | null>(null);

export function ChatDrawerProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(PANEL_DEFAULT_WIDTH);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  return (
    <ChatDrawerContext.Provider value={{ open, width, toggle, setOpen, setWidth }}>
      {children}
    </ChatDrawerContext.Provider>
  );
}

export function useChatDrawer() {
  const ctx = useContext(ChatDrawerContext);
  if (!ctx) throw new Error('useChatDrawer must be used within ChatDrawerProvider');
  return ctx;
}

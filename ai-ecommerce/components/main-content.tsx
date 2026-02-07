'use client';

import { useChatDrawer } from '@/lib/chat-drawer-context';

/**
 * Wraps page content and applies a right margin when the chat panel is open,
 * so the main area shrinks instead of being obscured.
 */
export function MainContent({ children }: { children: React.ReactNode }) {
  const { open, width } = useChatDrawer();

  return (
    <div
      className="min-h-screen transition-[margin] duration-300 ease-out motion-reduce:transition-none"
      style={{ marginRight: open ? width : 0 }}
    >
      {children}
    </div>
  );
}

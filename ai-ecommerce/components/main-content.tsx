'use client';

import { useChatDrawer } from '@/lib/chat-drawer-context';
import { PANEL_WIDTH } from '@/components/chat-drawer';

/**
 * Wraps page content and applies a right margin when the chat panel is open,
 * so the main area shrinks instead of being obscured.
 */
export function MainContent({ children }: { children: React.ReactNode }) {
  const { open } = useChatDrawer();

  return (
    <div
      className="min-h-screen transition-[margin] duration-300 ease-out motion-reduce:transition-none"
      style={{ marginRight: open ? PANEL_WIDTH : 0 }}
    >
      {children}
    </div>
  );
}

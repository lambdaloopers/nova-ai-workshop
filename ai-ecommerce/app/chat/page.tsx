'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChatDrawer } from '@/lib/chat-drawer-context';

/**
 * /chat route — opens the AI Chat drawer and redirects to home.
 * Keeps the URL clean while supporting direct navigation to /chat.
 */
export default function ChatPage() {
  const { setOpen } = useChatDrawer();
  const router = useRouter();

  useEffect(() => {
    setOpen(true);
    router.replace('/');
  }, [setOpen, router]);

  return null;
}

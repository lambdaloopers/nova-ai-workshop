'use client';

import { TrashIcon, MessageSquareIcon } from 'lucide-react';
import { useThread } from '@/lib/thread-context';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

export function ThreadHistory() {
  const { user } = useAuth();
  const { threads, activeThreadId, switchThread, deleteThread, loading } = useThread();

  if (!user) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Sign in to save conversations
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Loading conversations...
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No conversations yet
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 p-2">
      {threads.map((thread) => (
        <div
          key={thread.id}
          className={cn(
            "group flex items-center gap-2 rounded-lg px-3 py-2 transition-colors",
            activeThreadId === thread.id
              ? "bg-primary/10 text-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <button
            type="button"
            onClick={() => switchThread(thread.id)}
            className="flex flex-1 items-center gap-2 overflow-hidden text-left"
          >
            <MessageSquareIcon className="size-4 shrink-0" />
            <span className="truncate text-sm">{thread.title}</span>
          </button>
          <button
            type="button"
            onClick={() => deleteThread(thread.id)}
            className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
            aria-label="Delete conversation"
          >
            <TrashIcon className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

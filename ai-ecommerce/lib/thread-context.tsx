'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from './auth-context';
import { useAgent } from './agent-context';
import { AGENT_IDS } from './agent-ids';

interface Thread {
  id: string;
  title: string;
  resourceId: string;
  updatedAt?: number;
  createdAt?: number;
}

interface ThreadContextValue {
  threads: Thread[];
  activeThreadId: string | null;
  loading: boolean;
  createThread: () => Promise<string>;
  switchThread: (threadId: string) => void;
  deleteThread: (threadId: string) => Promise<void>;
  refreshThreads: () => Promise<void>;
}

const ThreadContext = createContext<ThreadContextValue | null>(null);

export function ThreadProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { agentId } = useAgent();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Solo habilitar memoria para agent-with-memory
  const memoryEnabled = agentId === AGENT_IDS.AGENT_WITH_MEMORY;

  const refreshThreads = useCallback(async () => {
    if (!user || !memoryEnabled) {
      setThreads([]);
      setActiveThreadId(null);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/threads?userId=${user.id}`);
      const data = await response.json();
      const fetchedThreads = data.threads || [];
      setThreads(fetchedThreads);
      
      // Auto-seleccionar el más reciente si no hay activo y hay threads disponibles
      if (!activeThreadId && fetchedThreads.length > 0) {
        setActiveThreadId(fetchedThreads[0].id);
      }
    } catch (error) {
      console.error('Error fetching threads:', error);
    } finally {
      setLoading(false);
    }
  }, [user, memoryEnabled, activeThreadId]);

  // Efecto para cargar threads cuando cambia a Agent 4
  useEffect(() => {
    if (user && memoryEnabled) {
      // Solo cargar threads existentes, no crear
      refreshThreads();
    } else if (!memoryEnabled) {
      // Limpiar threads al cambiar a agentes sin memoria
      setThreads([]);
      setActiveThreadId(null);
    }
  }, [user, memoryEnabled, refreshThreads]);

  const createThread = useCallback(async () => {
    if (!user) return '';
    
    const newThreadId = `thread-${Date.now()}`;
    
    try {
      await fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          threadId: newThreadId,
          title: `Conversation ${new Date().toLocaleDateString()}`,
        }),
      });
      
      // Agregar el nuevo thread a la lista local inmediatamente
      setThreads(prev => [{
        id: newThreadId,
        title: `Conversation ${new Date().toLocaleDateString()}`,
        resourceId: user.id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }, ...prev]);
      
      setActiveThreadId(newThreadId);
      return newThreadId;
    } catch (error) {
      console.error('Error creating thread:', error);
      return '';
    }
  }, [user]);

  const switchThread = useCallback((threadId: string) => {
    setActiveThreadId(threadId);
  }, []);

  const deleteThread = useCallback(async (threadId: string) => {
    try {
      await fetch(`/api/threads/${threadId}`, { method: 'DELETE' });
      await refreshThreads();
      
      // Si borramos el activo, cambiar a otro
      if (activeThreadId === threadId) {
        const remaining = threads.filter(t => t.id !== threadId);
        setActiveThreadId(remaining[0]?.id || null);
      }
    } catch (error) {
      console.error('Error deleting thread:', error);
    }
  }, [activeThreadId, threads, refreshThreads]);

  return (
    <ThreadContext.Provider value={{
      threads,
      activeThreadId,
      loading,
      createThread,
      switchThread,
      deleteThread,
      refreshThreads,
    }}>
      {children}
    </ThreadContext.Provider>
  );
}

export function useThread() {
  const context = useContext(ThreadContext);
  if (!context) {
    throw new Error('useThread must be used within ThreadProvider');
  }
  return context;
}

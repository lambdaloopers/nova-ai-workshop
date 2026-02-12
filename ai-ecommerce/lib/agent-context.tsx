'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { AGENT_IDS, type AgentId } from './agent-ids';

interface AgentContextValue {
  agentId: AgentId;
  setAgentId: (id: AgentId) => void;
}

const AgentContext = createContext<AgentContextValue | null>(null);

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const [agentId, setAgentId] = useState<AgentId>(AGENT_IDS.PERSONAL_SHOPPER);

  return (
    <AgentContext.Provider value={{ agentId, setAgentId }}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error('useAgent must be used within AgentProvider');
  return ctx;
}

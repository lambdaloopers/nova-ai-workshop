'use client';

import { ChevronDownIcon } from 'lucide-react';
import { useAgent } from '@/lib/agent-context';
import { AGENT_IDS } from '@/lib/agent-ids';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';

const AGENTS = [
  { id: AGENT_IDS.SIMPLE_AGENT, label: '1. Simple Agent', description: 'Basic chat agent' },
  { id: AGENT_IDS.AGENT_WITH_PROMPT, label: '2. Agent with Prompt', description: 'Sales-focused system prompt' },
  { id: AGENT_IDS.AGENT_WITH_TOOLS, label: '3. Agent with Tools', description: 'Catalog query tool' },
];

export function AgentSelector() {
  const { agentId, setAgentId } = useAgent();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentAgent = AGENTS.find((a) => a.id === agentId) || AGENTS[1];

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:border-primary/30 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Select agent"
        aria-expanded={open}
      >
        <span className="hidden sm:inline">{currentAgent.label}</span>
        <span className="sm:hidden">{currentAgent.label.split('.')[0]}.</span>
        <ChevronDownIcon
          className={cn(
            'size-3 transition-transform duration-200',
            open && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-lg border bg-card shadow-lg overflow-hidden z-50">
          <div className="p-2">
            <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Training Mode
            </p>
            {AGENTS.map((agent) => (
              <button
                key={agent.id}
                type="button"
                onClick={() => {
                  setAgentId(agent.id);
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full flex-col items-start rounded-md px-2 py-2 text-left text-sm transition-colors duration-200',
                  agent.id === agentId
                    ? 'bg-primary/10 text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <span className="font-medium">{agent.label}</span>
                <span className="text-xs opacity-80">{agent.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

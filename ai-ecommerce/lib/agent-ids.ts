/**
 * Agent IDs - shared between client and server.
 * Keep in sync with mastra/index.ts AgentId enum.
 */
export const AGENT_IDS = {
  SIMPLE_AGENT: 'simple-agent',
  AGENT_WITH_PROMPT: 'agent-with-prompt',
  AGENT_WITH_TOOLS: 'agent-with-tools',
  AGENT_WITH_MEMORY: 'agent-with-memory',
  PERSONAL_SHOPPER: 'personal-shopper',
} as const;

export type AgentId = typeof AGENT_IDS[keyof typeof AGENT_IDS];

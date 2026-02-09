import { handleChatStream } from '@mastra/ai-sdk';
import { createUIMessageStreamResponse } from 'ai';
import { AgentId, mastra } from '@/mastra';
import { AGENT_IDS } from '@/lib/agent-ids';

export async function POST(req: Request) {
  const params = await req.json();
  const url = new URL(req.url);
  
  const agentId = url.searchParams.get('agentId') || AgentId.AGENT_WITH_PROMPT;
  const userId = url.searchParams.get('userId') || 'anonymous';
  const threadId = url.searchParams.get('threadId') || 'default-thread';
  
  // Solo agregar memoria si es el agente con memoria
  const memoryParams = agentId === AGENT_IDS.AGENT_WITH_MEMORY ? {
    memory: {
      resource: userId,
      thread: {
        id: threadId,
        title: 'Nova Shopping Session',
      },
    },
  } : {};
  
  const stream = await handleChatStream({
    mastra,
    agentId,
    params: {
      ...params,
      ...memoryParams,
    },
  });
  
  return createUIMessageStreamResponse({ stream });
}

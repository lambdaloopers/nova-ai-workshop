import { handleChatStream } from '@mastra/ai-sdk';
import { createUIMessageStreamResponse } from 'ai';
import { AgentId, mastra } from '@/mastra';

export async function POST(req: Request) {
  const params = await req.json();
  const url = new URL(req.url);
  const agentId = url.searchParams.get('agentId') || AgentId.AGENT_WITH_PROMPT; // Read from query param
  
  const stream = await handleChatStream({
    mastra,
    agentId,
    params,
  });
  return createUIMessageStreamResponse({ stream });
}

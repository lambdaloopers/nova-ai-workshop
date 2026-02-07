import { handleChatStream } from '@mastra/ai-sdk';
import { createUIMessageStreamResponse } from 'ai';
import { AgentId, mastra } from '@/mastra';

export async function POST(req: Request) {
  const params = await req.json();
  const stream = await handleChatStream({
    mastra,
    agentId: AgentId.SIMPLE_AGENT,
    params,
  });
  return createUIMessageStreamResponse({ stream });
}

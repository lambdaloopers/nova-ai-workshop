import { NextResponse } from 'next/server';
import { mastra } from '@/mastra';
import { toAISdkV5Messages } from '@mastra/ai-sdk/ui';

// GET - Obtener mensajes de un thread
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: threadId } = await context.params;
    
    const agent = mastra.getAgentById('agent-with-memory');
    
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    const memory = await agent.getMemory();
    
    if (!memory) {
      return NextResponse.json({ error: 'Memory not available' }, { status: 500 });
    }

    // Obtener mensajes del thread usando la API de Mastra
    const { messages } = await memory.recall({
      threadId,
      perPage: false, // Get all messages
    });

    // Convertir mensajes de Mastra al formato de Vercel AI SDK UI usando la función oficial
    const uiMessages = toAISdkV5Messages(messages);

    return NextResponse.json({ messages: uiMessages });
  } catch (error) {
    console.error('[messages API] Error fetching messages:', error);
    return NextResponse.json({ messages: [] });
  }
}

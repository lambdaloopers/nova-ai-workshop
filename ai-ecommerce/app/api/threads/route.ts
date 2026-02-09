import { NextResponse } from 'next/server';
import { mastra } from '@/mastra';

// GET - Listar threads de un usuario
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    // Obtener el agente con memoria usando su ID
    const agent = mastra.getAgentById('agent-with-memory');
    
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    // Obtener la instancia de Memory del agente
    const memory = await agent.getMemory();
    
    if (!memory) {
      return NextResponse.json({ error: 'Memory not available' }, { status: 500 });
    }

    // Usar la API oficial de Mastra Memory
    const result = await memory.listThreads({
      filter: { resourceId: userId },
      perPage: 50,
      page: 0,
      orderBy: { field: 'updatedAt', direction: 'DESC' },
    });

    return NextResponse.json({ threads: result.threads || [] });
  } catch (error) {
    console.error('[threads API] Error fetching threads:', error);
    return NextResponse.json({ threads: [] });
  }
}

// POST - Crear nuevo thread
export async function POST(req: Request) {
  try {
    const { userId, threadId, title } = await req.json();
    
    if (!userId || !threadId) {
      return NextResponse.json(
        { error: 'userId and threadId required' }, 
        { status: 400 }
      );
    }

    const agent = mastra.getAgentById('agent-with-memory');
    
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    const memory = await agent.getMemory();
    
    if (!memory) {
      return NextResponse.json({ error: 'Memory not available' }, { status: 500 });
    }

    // Usar la API oficial de Mastra Memory
    const thread = await memory.saveThread({
      thread: {
        id: threadId,
        title: title || `Conversation ${new Date().toLocaleDateString()}`,
        resourceId: userId,
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ thread });
  } catch (error) {
    console.error('[threads API] Error creating thread:', error);
    return NextResponse.json({ error: 'Failed to create thread' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { mastra } from '@/mastra';

// DELETE - Eliminar thread
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    const agent = mastra.getAgentById('agent-with-memory');
    
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    const memory = await agent.getMemory();
    
    if (!memory) {
      return NextResponse.json({ error: 'Memory not available' }, { status: 500 });
    }

    // Usar la API oficial de Mastra Memory
    await memory.deleteThread(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[threads API] Error deleting thread:', error);
    return NextResponse.json({ error: 'Failed to delete thread' }, { status: 500 });
  }
}

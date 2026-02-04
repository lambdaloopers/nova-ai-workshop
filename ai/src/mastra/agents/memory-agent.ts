import { Agent } from '@mastra/core/agent'
import { Memory } from '@mastra/memory'
import { LibSQLStore } from '@mastra/libsql'

const memory = new Memory({
  storage: new LibSQLStore({
    id: 'learning-memory-storage',
    url: 'file:./memory-agent.db',
  }),
  options: {
    lastMessages: 20, // Incluir las últimas 20 mensajes en el contexto (por defecto 10)
  },
})

export const memoryAgent = new Agent({
  id: 'memory-agent',
  name: 'MemoryAgent',
  instructions: `
    You are a helpful assistant with memory capabilities.
    You can remember previous conversations and user preferences.
    When a user shares information about themselves, acknowledge it and remember it for future reference.
    If asked about something mentioned earlier in the conversation, recall it accurately.
  `,
  model: 'openai/gpt-4.1-mini',
  memory,
})

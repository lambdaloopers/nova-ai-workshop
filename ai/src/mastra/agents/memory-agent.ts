import { Agent } from '@mastra/core/agent'
import { Memory } from '@mastra/memory'
import { LibSQLStore, LibSQLVector } from '@mastra/libsql'

const memory = new Memory({
  storage: new LibSQLStore({
    id: 'learning-memory-storage',
    url: 'file:./memory-agent.db',
  }),
  vector: new LibSQLVector({
    id: 'learning-memory-vector',
    url: 'file:./vector-agent.db',
  }),
  embedder: 'openai/text-embedding-3-small',
  options: {
    lastMessages: 20,
    semanticRecall: true,
  },
})

export const memoryAgent = new Agent({
  id: 'memory-agent',
  name: 'MemoryAgent',
  instructions: `
    You are a helpful assistant with advanced memory capabilities.
    You can remember previous conversations and user preferences.
    When a user shares information about themselves, acknowledge it and remember it for future reference.
    If asked about something mentioned earlier in the conversation, recall it accurately.
    You can also recall relevant information from older conversations when appropriate.
  `,
  model: 'openai/gpt-4.1-mini',
  memory,
})

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
    // Conversation history
    lastMessages: 20,

    // Semantic recall
    semanticRecall: {
      topK: 3,
      messageRange: {
        before: 2,
        after: 1,
      },
    },

    // Working memory
    workingMemory: {
      enabled: true,
      template: `
# User Profile

## Personal Info
- Name:
- Location:
- Timezone:
- Occupation:

## Preferences
- Communication Style:
- Topics of Interest:
- Learning Goals:

## Project Information
- Current Projects:
  - [Project 1]:
    - Deadline:
    - Status:
  - [Project 2]:
    - Deadline:
    - Status:

## Session State
- Current Topic:
- Open Questions:
- Action Items:
`,
    },
  },
})

export const memoryAgent = new Agent({
  id: 'memory-agent',
  name: 'MemoryAgent',
  instructions: `
    You are a helpful assistant with advanced memory capabilities.
    You can remember previous conversations and user preferences.

    IMPORTANT: You have access to working memory to store persistent information about the user.
    When you learn something important about the user, update your working memory according to the template.

    Always refer to your working memory before asking for information the user has already provided.
    Use the information in your working memory to provide personalized responses.

    When the user shares personal information such as their name, location, or preferences,
    acknowledge it and update your working memory accordingly.
  `,
  model: 'openai/gpt-4.1-mini',
  memory,
})

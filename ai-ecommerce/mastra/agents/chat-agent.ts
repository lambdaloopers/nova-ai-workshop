import { Agent } from '@mastra/core/agent';
import {
  createAnswerRelevancyScorer,
  createToxicityScorer,
  createToneScorer,
  createCompletenessScorer,
  createPromptAlignmentScorerLLM,
} from '@mastra/evals/scorers/prebuilt';

// Use a cheap model for scoring to avoid burning tokens
const JUDGE_MODEL = 'openai/gpt-4.1-nano' as const;

export const chatAgent = new Agent({
  id: 'chat-agent',
  name: 'Chat Assistant',
  instructions: `
  ROLE DEFINITION: You are an AI assistant designed to provide clear and concise answers to user inquiries. Your primary role is to assist users by delivering accurate information and helpful guidance.

CORE CAPABILITIES: You are equipped with a vast knowledge base across various domains, enabling you to answer questions, provide explanations, and offer recommendations. You can access and process information quickly to deliver timely responses.

BEHAVIORAL GUIDELINES: Maintain a friendly and professional tone in all interactions. Prioritize clarity and brevity in your responses. Use a decision-making framework that emphasizes user needs and context. Handle errors gracefully by acknowledging them and providing corrective information. Adhere to ethical guidelines, ensuring respect and privacy for all users.

CONSTRAINTS & BOUNDARIES: Avoid providing medical, legal, or financial advice. Do not engage in activities that require personal data collection or violate user privacy. Stay within the scope of general knowledge and refrain from speculative or opinion-based responses.

SUCCESS CRITERIA: Deliver responses that are accurate, relevant, and easy to understand. Achieve high user satisfaction by meeting their informational needs effectively. Continuously improve based on user feedback and performance metrics.
  `,
  model: 'openai/gpt-4o',

  scorers: {
    // LLM-judged: Is the response relevant to the user's question? (0–1, higher = better)
    relevancy: {
      scorer: createAnswerRelevancyScorer({ model: JUDGE_MODEL }),
      sampling: { type: 'ratio', rate: 1 },
    },
    // LLM-judged: Does the response contain toxic/harmful content? (0–1, lower = better)
    toxicity: {
      scorer: createToxicityScorer({ model: JUDGE_MODEL }),
      sampling: { type: 'ratio', rate: 1 },
    },
    // LLM-judged: Does the response follow the system prompt instructions? (0–1, higher = better)
    promptAlignment: {
      scorer: createPromptAlignmentScorerLLM({ model: JUDGE_MODEL }),
      sampling: { type: 'ratio', rate: 1 },
    },
    // Code-based (no LLM): Is the tone consistent throughout the response? (0–1, higher = better)
    tone: {
      scorer: createToneScorer(),
      sampling: { type: 'ratio', rate: 1 },
    },
    // Code-based (no LLM): Does the response address all elements from the input? (0–1, higher = better)
    completeness: {
      scorer: createCompletenessScorer(),
      sampling: { type: 'ratio', rate: 1 },
    },
  },
});

/**
 * Extracts catalog and Q&A tool results from sales subagent output.
 * When the parent delegates to personalShopperSales, tool calls are nested in steps.
 * Fallback: match product names from text when steps are not available.
 */

import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';

type ProductFromJson = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  categoryId: string;
  price: number;
  originalPrice: number | null;
  discount: number | null;
  rating: number;
  reviewCount: number;
  image: string;
  badges: string[];
  inStock: boolean;
  freeShipping: boolean;
  deliveryEstimate: string;
};

export interface ProductData {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number | null;
  discount: number | null;
  rating: number;
  reviewCount: number;
  image: string;
  badges: string[];
  freeShipping: boolean;
  slug: string;
}

export interface UserQuestionData {
  question: string;
  suggestions: string[];
  waitingForUserResponse: boolean;
}

type Step = {
  toolName?: string;
  name?: string;
  result?: unknown;
};

const TOOL_NAMES = {
  catalogQuery: ['catalogQuery', 'catalog-query'],
  askUserQuestion: ['askUserQuestion', 'ask-user-question'],
};

function stepMatchesTool(step: Step, toolKeys: string[]): boolean {
  const name = (step.toolName ?? step.name ?? '').toString();
  return toolKeys.some((key) => name === key);
}

function isProductList(obj: unknown): obj is { products: ProductData[] } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    Array.isArray((obj as { products?: unknown }).products)
  );
}

function isValidProduct(p: unknown): p is ProductData {
  return (
    typeof p === 'object' &&
    p !== null &&
    typeof (p as ProductData).id === 'string' &&
    typeof (p as ProductData).name === 'string'
  );
}

function isUserQuestionResult(obj: unknown): obj is UserQuestionData {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as UserQuestionData).question === 'string' &&
    Array.isArray((obj as UserQuestionData).suggestions)
  );
}

function toProductData(p: ProductFromJson): ProductData {
  const category = (categoriesData as { id: string; name: string }[]).find(
    (c) => c.id === p.categoryId
  );
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: category?.name ?? p.categoryId,
    price: p.price,
    originalPrice: p.originalPrice,
    discount: p.discount,
    rating: p.rating,
    reviewCount: p.reviewCount,
    image: p.image,
    badges: p.badges,
    freeShipping: p.freeShipping,
    slug: p.slug,
  };
}

/** Match product names from text (fallback when steps unavailable). Exported for use in chat-messages. */
export function extractProductsFromText(text: string): ProductData[] {
  const products = productsData as ProductFromJson[];
  const inStock = products.filter((p) => p.inStock);
  const matched: ProductData[] = [];
  const textLower = text.toLowerCase();

  for (const p of inStock) {
    // Match by full name or significant parts (e.g. "Logitech G Pro X Superlight 2")
    const nameParts = p.name
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2);
    const brandMatch = textLower.includes(p.brand.toLowerCase());
    const nameMatch =
      textLower.includes(p.name.toLowerCase()) ||
      nameParts.filter((part) => textLower.includes(part)).length >= 2;

    if (brandMatch || nameMatch) {
      matched.push(toProductData(p));
      if (matched.length >= 3) break;
    }
  }
  return matched;
}

function getTextFromOutput(output: unknown): string {
  if (typeof output === 'string') return output;
  if (!output || typeof output !== 'object') return '';
  const out = output as Record<string, unknown>;
  let text = (out.text ?? out.result ?? out.content ?? '') as string;
  if (typeof text !== 'string' && Array.isArray(out.content)) {
    text = (out.content as { type?: string; text?: string }[])
      .filter((p) => p.type === 'text' && p.text)
      .map((p) => p.text)
      .join(' ');
  }
  return typeof text === 'string' ? text : '';
}

/** Extract contextual AI text from subagent output (e.g. "Te recomiendo este teclado"). */
export function extractTextFromSubagentOutput(output: unknown): string {
  return getTextFromOutput(output).trim();
}

/**
 * Extract products from catalogQuery tool result in subagent steps.
 * Fallback: match product names from text when steps are not available.
 */
export function extractProductsFromSubagentOutput(output: unknown): ProductData[] | null {
  if (!output || typeof output !== 'object') return null;

  const out = output as Record<string, unknown>;

  // 1. Try steps (structured data)
  const steps = out.steps as Step[] | undefined;
  if (Array.isArray(steps)) {
    const catalogStep = [...steps]
      .reverse()
      .find((s) => stepMatchesTool(s, TOOL_NAMES.catalogQuery));

    if (catalogStep?.result) {
      const result = catalogStep.result as { products?: unknown[] };
      if (isProductList(result)) {
        const products = result.products.filter(isValidProduct);
        if (products.length > 0) return products;
      }
    }
  }

  // 2. Try direct products in output
  if (isProductList(out)) {
    const products = out.products.filter(isValidProduct);
    if (products.length > 0) return products;
  }

  // 3. Fallback: parse text for product names
  const text = getTextFromOutput(output);
  if (text) {
    const products = extractProductsFromText(text);
    if (products.length > 0) return products;
  }

  return null;
}

/**
 * Extract user question from askUserQuestion tool result in subagent steps.
 * Returns the last question that is waiting for user response.
 */
export function extractUserQuestionFromSubagentOutput(
  output: unknown
): UserQuestionData | null {
  if (!output || typeof output !== 'object') return null;

  const out = output as Record<string, unknown>;
  const stepsArr = out.steps as Step[] | undefined;

  if (!Array.isArray(stepsArr)) return null;

  const questionStep = [...stepsArr]
    .reverse()
    .find((s) => stepMatchesTool(s, TOOL_NAMES.askUserQuestion));

  const result = questionStep?.result as UserQuestionData | undefined;
  if (!questionStep?.result) return null;
  if (!isUserQuestionResult(result)) return null;
  if (result.waitingForUserResponse) return result;

  return null;
}

type MessagePart = { type?: string; data?: unknown; output?: unknown; state?: string; text?: string };

type ToolResult = {
  toolName?: string;
  name?: string;
  result?: unknown;
};

function toolResultMatchesAskUserQuestion(tr: ToolResult): boolean {
  const name = (tr.toolName ?? tr.name ?? '').toString();
  return TOOL_NAMES.askUserQuestion.some((key) => name === key);
}

/**
 * Extract user question from data-tool-agent part.
 * Mastra's toAISdkStream buffers subagent chunks into steps with toolCalls/toolResults.
 * Supports: data.steps[].toolResults, data.toolResults, data.parts, data (as output).
 */
function extractUserQuestionFromDataToolAgent(data: unknown): UserQuestionData | null {
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, unknown>;

  // A. data.steps[] with toolResults (Mastra toAISdkStream bufferedSteps format)
  const steps = d.steps as Array<{ toolResults?: ToolResult[] }> | undefined;
  if (Array.isArray(steps)) {
    for (let i = steps.length - 1; i >= 0; i--) {
      const toolResults = steps[i]?.toolResults;
      if (!Array.isArray(toolResults)) continue;
      const tr = toolResults.find(toolResultMatchesAskUserQuestion);
      if (!tr?.result) continue;
      const r = tr.result as UserQuestionData;
      if (isUserQuestionResult(r) && r.waitingForUserResponse) return r;
    }
  }

  // B. data.toolResults (flat array)
  const toolResults = d.toolResults as ToolResult[] | undefined;
  if (Array.isArray(toolResults)) {
    const tr = toolResults.find(toolResultMatchesAskUserQuestion);
    if (tr?.result) {
      const r = tr.result as UserQuestionData;
      if (isUserQuestionResult(r) && r.waitingForUserResponse) return r;
    }
  }

  // C. data.parts (UI parts format, e.g. tool-askUserQuestion with output)
  const parts = d.parts as Array<{ type?: string; output?: UserQuestionData }> | undefined;
  if (Array.isArray(parts)) {
    const askPart = parts.find(
      (p) =>
        p?.type === 'tool-askUserQuestion' &&
        (p.output as UserQuestionData)?.waitingForUserResponse
    );
    if (askPart?.output && isUserQuestionResult(askPart.output)) return askPart.output;
  }

  // D. data is the output directly (e.g. { steps: [...] } from tool part)
  const fromData = extractUserQuestionFromSubagentOutput(data);
  if (fromData) return fromData;

  return null;
}

/** Known question patterns with default suggestions (fallback when structured data unavailable). */
const QUESTION_FALLBACKS: Array<{
  pattern: RegExp;
  question: string;
  suggestions: string[];
}> = [
  {
    pattern: /para\s*qu[eé]\s*lo\s*usar[áa]s|uso\s+principal|gaming\s+o\s+trabajo/i,
    question: '¿Para qué lo usarás?',
    suggestions: ['Gaming', 'Trabajo/estudios', 'Edición vídeo', 'Uso general'],
  },
  {
    pattern: /presupuesto|budget|precio\s*m[aá]x/i,
    question: '¿Presupuesto aproximado?',
    suggestions: ['<500€', '500-1000€', '1000-1500€', '>1500€'],
  },
  {
    pattern: /mochila|portabilidad|llevar.*diario/i,
    question: '¿Lo llevarás en mochila a diario?',
    suggestions: ['Sí', 'No'],
  },
];

/**
 * Extract user question from message parts when subagent output is in data-tool-agent.
 * Mastra streams agent-as-tool output into a sibling data-tool-agent part; tool part's output stays empty.
 */
export function extractUserQuestionFromMessageParts(
  parts: MessagePart[] | undefined
): UserQuestionData | null {
  if (!parts?.length) return null;

  let hasSalesSubagent = false;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const isSales =
      part.type === 'tool-personalShopperSales' ||
      part.type === 'tool-agent-personalShopperSales';
    if (isSales) hasSalesSubagent = true;

    if (!isSales) continue;

    // 1. Try tool part's output (steps structure)
    const fromOutput = extractUserQuestionFromSubagentOutput(part.output);
    if (fromOutput) return fromOutput;

    // 2. Look at following data-tool-agent part (Mastra bufferedSteps format)
    const next = parts[i + 1] as { type?: string; data?: unknown } | undefined;
    if (next?.type === 'data-tool-agent' && next.data != null) {
      const extracted = extractUserQuestionFromDataToolAgent(next.data);
      if (extracted) return extracted;
    }
  }

  // 3. Fallback: parse text parts for known question patterns (last resort)
  if (hasSalesSubagent) {
    for (const part of parts) {
      const text =
        part.type === 'text' ? ((part as { text?: string }).text ?? '') : null;
      if (typeof text === 'string' && text.trim()) {
        for (const { pattern, question, suggestions } of QUESTION_FALLBACKS) {
          if (pattern.test(text)) {
            return { question, suggestions, waitingForUserResponse: true };
          }
        }
      }
    }
  }

  return null;
}

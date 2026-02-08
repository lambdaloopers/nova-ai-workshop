'use client';

import type { DynamicToolUIPart, UITool, UIToolInvocation } from 'ai';
import { ProductSuggestionCard } from './product-suggestion-card';
import { Shimmer } from '@/components/ai-elements/shimmer';

type ToolPart = DynamicToolUIPart | ({ type: `tool-${string}` } & UIToolInvocation<UITool>);

interface ToolRendererProps {
  part: ToolPart;
}

/**
 * Routes tool invocations to the appropriate renderer based on tool name and state.
 * Add new tool renderers here as you add more tools to agents.
 */
export function ToolRenderer({ part }: ToolRendererProps) {
  // catalogQuery tool (key name in agent.tools object)
  if (part.type === 'tool-catalogQuery') {
    switch (part.state) {
      case 'input-available':
        return (
          <div className="flex flex-col gap-2">
            <Shimmer className="text-xs">Searching catalog…</Shimmer>
          </div>
        );

      case 'output-available': {
        const output = part.output as {
          success: boolean;
          products?: Array<{
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
          }>;
        };

        if (!output.success || !output.products || output.products.length === 0) {
          return (
            <div className="rounded-lg border border-dashed bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              No products found matching the criteria.
            </div>
          );
        }

        return (
          <div className="flex flex-col gap-2">
            {output.products.map((product) => (
              <ProductSuggestionCard key={product.id} product={product} />
            ))}
          </div>
        );
      }

      case 'output-error':
        return (
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            Error searching catalog: {part.errorText || 'Unknown error'}
          </div>
        );
    }
  }

  // Fallback for unknown tools
  return (
    <div className="rounded-lg border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
      Tool: {part.type.replace('tool-', '')}
    </div>
  );
}

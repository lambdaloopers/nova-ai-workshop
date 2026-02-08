'use client';

interface UserQuestionRendererProps {
  question: string;
  suggestions: string[];
  onSelectSuggestion: (answer: string) => void;
}

/**
 * Renders an interactive question from the agent with clickable suggestion chips.
 * User can click a suggestion to answer quickly.
 */
export function UserQuestionRenderer({
  question,
  suggestions,
  onSelectSuggestion,
}: UserQuestionRendererProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-muted/30 p-3">
      <p className="text-sm font-medium text-foreground">{question}</p>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSelectSuggestion(suggestion)}
            className="rounded-lg border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

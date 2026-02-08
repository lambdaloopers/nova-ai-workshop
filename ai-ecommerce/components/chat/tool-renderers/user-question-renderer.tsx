'use client';

import { useState } from 'react';

interface UserQuestionRendererProps {
  question: string;
  suggestions: string[];
  onSelectSuggestion: (answer: string) => void;
}

/**
 * Renders an interactive question from the agent with clickable suggestion chips.
 * User can click a suggestion to answer quickly.
 * After answering, the component shows the selected answer and disables further interaction.
 */
export function UserQuestionRenderer({
  question,
  suggestions,
  onSelectSuggestion,
}: UserQuestionRendererProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleSelect = (answer: string) => {
    if (selectedAnswer) return; // Prevent multiple selections
    
    setSelectedAnswer(answer);
    onSelectSuggestion(answer);
  };

  // If already answered, show the answer
  if (selectedAnswer) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border bg-muted/20 p-3">
        <p className="text-xs text-muted-foreground">{question}</p>
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <span className="text-primary">✓</span>
          <span>{selectedAnswer}</span>
        </div>
      </div>
    );
  }

  // Show interactive buttons
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-muted/30 p-3">
      <p className="text-sm font-medium text-foreground">{question}</p>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => handleSelect(suggestion)}
            className="rounded-lg border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

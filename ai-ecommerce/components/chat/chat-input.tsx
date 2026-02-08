'use client';

import type { ChatStatus } from 'ai';
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  type PromptInputMessage,
} from '@/components/ai-elements/prompt-input';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (message: PromptInputMessage) => void;
  status: ChatStatus;
  onStop: () => void;
}

export function ChatInput({ value, onChange, onSubmit, status, onStop }: ChatInputProps) {
  return (
    <div className="border-t p-3">
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTextarea
            value={value}
            onChange={(e) => onChange(typeof e === 'string' ? e : e.target.value)}
            placeholder="Ask about products, specs, comparisons…"
            className="min-h-[40px] max-h-[120px] text-sm"
          />
        </PromptInputBody>
        <PromptInputFooter className="justify-end p-1">
          <PromptInputSubmit status={status} onStop={onStop} />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}

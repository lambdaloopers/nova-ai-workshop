import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const CATEGORY_EMOJI: Record<string, string> = {
  laptops: '💻',
  components: '🔧',
  monitors: '🖥️',
  peripherals: '⌨️',
  storage: '💾',
  smartphones: '📱',
};

export function categoryEmoji(categoryId: string): string {
  return CATEGORY_EMOJI[categoryId] ?? '📦';
}

export function formatEUR(value: number): string {
  return value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}

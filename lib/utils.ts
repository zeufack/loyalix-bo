import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { icons, Sparkles, type LucideIcon } from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

/** Turns a snake_case or kebab-case catalog name (e.g. `shopping-bag`) into Title Case. */
export const formatSlugLabel = (value: string) => {
  return value
    .split(/[_-]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/** Resolves a kebab-case Lucide icon name (e.g. `shopping-bag`) to its component. */
export const getLucideIcon = (name: string | null | undefined): LucideIcon => {
  if (!name) return Sparkles;
  const pascalName = name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  return icons[pascalName as keyof typeof icons] ?? Sparkles;
};

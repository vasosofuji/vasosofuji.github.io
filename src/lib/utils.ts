import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names, letting later Tailwind utilities win over earlier ones.
 * The `@/lib/utils` alias was already declared in components.json but the file
 * itself had never been created, so any shadcn component expecting `cn` would
 * have failed to resolve.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

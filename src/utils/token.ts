import { CANON } from '@/constants/currency.ts'

export function canonToken(s: unknown): string {
  const raw = String(s ?? '').trim();
  return CANON[raw as keyof typeof CANON] ?? raw.toUpperCase();
}

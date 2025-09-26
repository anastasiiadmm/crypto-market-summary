import type { TypeFilterValue } from '@/constants/toolbar.ts'

export function normType(v: unknown): 'primary' | 'secondary' | '' {
  const t = String(v ?? '').trim().toLowerCase()
  return t === 'primary' || t === 'secondary' ? t : ''
}

export function getGroupOrder(primaryFirst: boolean) {
  return primaryFirst
    ? { primary: 0, secondary: 1, '': 2 } as const
    : { secondary: 0, primary: 1, '': 2 } as const
}

export function buildCurrencyHaystack(c: any): string {
  return [
    c.code ?? '',
    c.ticker ?? '',
    c.name ?? '',
    normType(c.type),
    String(c.sort_order ?? ''),
    String(c.decimals_places ?? c.decimals ?? ''),
  ]
    .join(' ')
    .toLowerCase()
}

export function filterByType<T extends { type?: unknown }>(
  list: T[],
  type: TypeFilterValue
): T[] {
  return type ? list.filter(c => normType(c.type) === type) : list
}

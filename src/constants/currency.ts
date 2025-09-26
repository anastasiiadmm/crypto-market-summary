export const CANON: Record<string, string> = {
  Xbt: 'BTC',
  Usc: 'USDC',
  Ust: 'USDT',
  Ave: 'AAVE',
  Dge: 'DOGE',
  Com: 'COMP',
} as const;

export const HISTORY_POINTS = 40;

export const FALLBACK_CURRENCY = { code: 'USD', symbol: '$', name: 'US DOLLAR' } as const;

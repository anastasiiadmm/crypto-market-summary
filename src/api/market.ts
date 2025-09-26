import type { FetchMarketResult } from '@/types.ts'
import { safeFetch } from '@/utils/http.ts'
import { MarketRowRawArraySchema } from '@/types.ts'
import { mapMarketRow } from '@/mappers/market.ts'

export async function fetchMarket(quote: string): Promise<FetchMarketResult> {
  const url = new URL('/api/market', window.location.origin);
  const want = String(quote || '').toUpperCase();
  if (want) url.searchParams.set('quote', want);

  const rows = await safeFetch(url.toString(), MarketRowRawArraySchema);

  const secondaries = Array.from(new Set(rows.map(r => r.pair.secondary.toUpperCase())));
  const hasWanted = secondaries.includes(want);

  const items = hasWanted
    ? rows.filter(r => r.pair.secondary.toUpperCase() === want).map(mapMarketRow)
    : [];

  return { quote: want, items, detected: secondaries[0], available: secondaries.sort() };
}

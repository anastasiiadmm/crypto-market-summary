import type { MarketItem, MarketRowRaw } from '@/types.ts'
import { toNum } from '@/utils/number.ts'
import { HISTORY_POINTS } from '@/constants/currency.ts'
import { canonToken } from '@/utils/token.ts'
import { MarketItemSchema } from '@/types.ts'

export function mapMarketRow(raw: MarketRowRaw): MarketItem {
  const last = toNum(raw.price?.last);
  const histAll = (raw.priceHistory ?? []).map(toNum).filter(Number.isFinite);
  const history = histAll.slice(-HISTORY_POINTS);

  const base = history.length ? history[0]! : last;
  const changePct = Number.isFinite(base) && base !== 0 ? ((last - base) / base) * 100 : 0;

  const hi = histAll.length ? Math.max(...histAll, last) : last;
  const lo = histAll.length ? Math.min(...histAll, last) : last;

  const draft: MarketItem = {
    symbol: canonToken(raw.pair.primary),
    price: last,
    change24h: Number.isFinite(changePct) ? changePct : undefined,
    high24h: Number.isFinite(hi) ? hi : undefined,
    low24h: Number.isFinite(lo) ? lo : undefined,
    volume24h: toNum(raw.volume?.secondary) || toNum(raw.volume?.primary) || undefined,
    history,
  };

  const p = MarketItemSchema.safeParse(draft);
  return p.success ? p.data : draft;
}

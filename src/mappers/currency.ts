import type { Currency, CurrencyRaw } from '@/types.ts'
import { CurrencySchema } from '@/types.ts'

export function mapCurrency(raw: CurrencyRaw): Currency {
  const code = (raw.code || raw.ticker || '').toUpperCase();
  const draft: Currency = {
    code,
    symbol: raw.symbol ?? undefined,
    name: raw.name ?? code,
    ticker: raw.ticker ?? undefined,
    type: raw.type ?? undefined,
    iconBase64: raw.icon ?? undefined,
  };
  const p = CurrencySchema.safeParse(draft);
  return p.success ? p.data : draft;
}

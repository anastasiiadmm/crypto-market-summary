import type { FetchCurrenciesResult } from '@/types.ts'
import { CurrencyRawArraySchema } from '@/types.ts'
import { safeFetch } from '@/utils/http.ts'
import { mapCurrency } from '@/mappers/currency.ts'
import { FALLBACK_CURRENCY } from '@/constants/currency.ts'


export async function fetchCurrencies(): Promise<FetchCurrenciesResult> {
  const data = await safeFetch('/api/currency', CurrencyRawArraySchema);
  const quotes = data.map(mapCurrency);
  return {
    base: undefined,
    quotes: quotes.length ? quotes : [FALLBACK_CURRENCY],
  };
}

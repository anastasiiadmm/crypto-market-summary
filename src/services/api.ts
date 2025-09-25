import type { ZodType } from 'zod'

import {
  CurrencyRawArraySchema,
  type CurrencyRaw,
  MarketRowRawArraySchema,
  type MarketRowRaw,
  CurrencySchema,
  type Currency,
  MarketItemSchema,
  type MarketItem,
  type FetchCurrenciesResult,
  type FetchMarketResult,
} from '../types'

const CANON: Record<string, string> = {
  Xbt: 'BTC',
  Usc: 'USDC',
  Ust: 'USDT',
  Ave: 'AAVE',
  Dge: 'DOGE',
  Com: 'COMP',
}

function toNum(v: unknown): number {
  const n = typeof v === 'string' ? parseFloat(v.replace(/,/g, '')) : Number(v)
  return Number.isFinite(n) ? n : NaN
}

function canonToken(s: unknown): string {
  const raw = String(s ?? '').trim()
  return CANON[raw as keyof typeof CANON] ?? raw.toUpperCase()
}

async function safeFetch<T>(url: string, schema: ZodType<T>): Promise<T> {
  const res = await fetch(url, { headers: { accept: 'application/json' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`)
  const json = await res.json()
  const parsed = schema.safeParse(json)
  if (!parsed.success) {
    console.warn('Validation failed for', url, parsed.error)
    return json as unknown as T
  }
  return parsed.data
}

function mapCurrency(raw: CurrencyRaw): Currency {
  const code = (raw.code || raw.ticker || '').toUpperCase()
  const decimals = raw.decimals_places != null ? Number(raw.decimals_places) : undefined
  const draft: Currency = {
    code,
    symbol: raw.symbol ?? undefined,
    name: raw.name ?? code,
    ticker: raw.ticker ?? undefined,
    type: raw.type ?? undefined,
    decimals,
    iconBase64: raw.icon ?? undefined,
  }
  const p = CurrencySchema.safeParse(draft)
  return p.success ? p.data : draft
}

function mapMarketRow(raw: MarketRowRaw): MarketItem {
  const last = toNum(raw.price?.last)
  const hist = (raw.priceHistory ?? []).map(toNum).filter(Number.isFinite)
  const history = hist.slice(-40)
  const base = history.length ? history[0]! : last
  const changePct = Number.isFinite(base) && base !== 0 ? ((last - base) / base) * 100 : 0
  const hi = hist.length ? Math.max(...hist, last) : last
  const lo = hist.length ? Math.min(...hist, last) : last

  const draft: MarketItem = {
    symbol: canonToken(raw.pair.primary),
    name: undefined,
    price: last,
    change24h: Number.isFinite(changePct) ? changePct : undefined,
    high24h: Number.isFinite(hi) ? hi : undefined,
    low24h: Number.isFinite(lo) ? lo : undefined,
    volume24h: toNum(raw.volume?.secondary) || toNum(raw.volume?.primary) || undefined,
    marketCap: undefined,
    history,
  }
  const p = MarketItemSchema.safeParse(draft)
  return p.success ? p.data : draft
}

export async function fetchCurrencies(): Promise<FetchCurrenciesResult> {
  const data = await safeFetch('/api/currency', CurrencyRawArraySchema)

  const quotes = (Array.isArray(data) ? data : [])
    .filter((x) => String(x.type || '').toLowerCase() === 'secondary')
    .map(mapCurrency)

  return {
    base: undefined,
    quotes: quotes.length ? quotes : [{ code: 'USD', symbol: '$', name: 'US DOLLAR' }],
  }
}

export async function fetchMarket(quote: string): Promise<FetchMarketResult> {
  const url = new URL('/api/market', window.location.origin)
  const want = String(quote || '').toUpperCase()
  if (want) url.searchParams.set('quote', want)

  const rows = await safeFetch(url.toString(), MarketRowRawArraySchema)

  const secondaries = new Set(rows.map(r => r.pair.secondary.toUpperCase()))

  let effective = want
  if (!secondaries.has(want)) {
    const first = Array.from(secondaries)[0]
    effective = secondaries.has('USD') ? 'USD' : (first ?? 'USD')
  }

  const items = rows.filter((r) => r.pair.secondary.toUpperCase() === effective).map(mapMarketRow)

  return { quote: effective, items, requested: want, detected: effective }
}

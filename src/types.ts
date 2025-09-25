import { z } from 'zod'

export const CurrencyRawSchema = z.object({
  code: z.string(),
  type: z.string().optional(),
  ticker: z.string().optional(),
  symbol: z.string().optional(),
  name: z.string().optional(),
  decimals_places: z.union([z.number(), z.string()]).optional(),
  icon: z.string().optional(),
})
export type CurrencyRaw = z.infer<typeof CurrencyRawSchema>
export const CurrencyRawArraySchema = z.array(CurrencyRawSchema)

export const MarketRowRawSchema = z.object({
  pair: z.object({ primary: z.string(), secondary: z.string() }),
  price: z.object({ last: z.union([z.string(), z.number()]) }).passthrough(),
  priceHistory: z.array(z.union([z.string(), z.number()])).optional(),
  volume: z
    .object({
      primary: z.union([z.string(), z.number()]).optional(),
      secondary: z.union([z.string(), z.number()]).optional(),
    })
    .optional(),
})
export type MarketRowRaw = z.infer<typeof MarketRowRawSchema>
export const MarketRowRawArraySchema = z.array(MarketRowRawSchema)

export const CurrencySchema = z.object({
  code: z.string(),
  symbol: z.string().optional(),
  name: z.string().optional(),
  ticker: z.string().optional(),
  type: z.string().optional(),
  decimals: z.number().optional(),
  iconBase64: z.string().optional(),
})
export type Currency = z.infer<typeof CurrencySchema>

export const MarketItemSchema = z.object({
  symbol: z.string(),
  name: z.string().optional(),
  price: z.number(),
  change24h: z.number().optional(),
  high24h: z.number().optional(),
  low24h: z.number().optional(),
  volume24h: z.number().optional(),
  marketCap: z.number().optional(),
  history: z.array(z.number()).optional(),
})
export type MarketItem = z.infer<typeof MarketItemSchema>

export interface FetchCurrenciesResult {
  base?: string
  quotes: Currency[]
}

export interface FetchMarketResult {
  quote?: string
  items: MarketItem[]
  requested?: string
  detected?: string
}

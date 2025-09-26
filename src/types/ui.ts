export type SortKey = 'symbol' | 'price' | 'change24h' | 'volume24h'
export type SortDir = 'asc' | 'desc'

export const marketSortOptions = [
  {
    value: 'symbol',
    label: 'Symbol'
  },
  {
    value: 'price',
    label: 'Last price'
  },
  {
    value: 'change24h',
    label: 'Change 24h'
  },
  {
    value: 'volume24h',
    label: 'Volume 24h'
  },
] as const

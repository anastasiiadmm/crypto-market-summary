export function formatPercent(n?: number) {
  if (!n && n !== 0) return '—'
  return `${n.toFixed(2)}%`
}

export function formatNumber(n: number | undefined) {
  if (!n) return 0
  return new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 2 }).format(
    n,
  )
}

export function formatCurrency(quote: string, n?: number) {
  if (!n && n !== 0) return '—'
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: quote,
    currencyDisplay: 'code',
    maximumFractionDigits: 8,
  }).format(n)
}

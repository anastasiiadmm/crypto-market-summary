<script setup lang="ts">
import { storeToRefs } from 'pinia'

import Sparkline from './Sparkline.vue'
import { useMarketStore } from '../stores/market'

const { filtered, loading, error, quote, notice } = storeToRefs(useMarketStore())

function fmtPrice(n?: number) {
  if (!n && n !== 0) return '—'
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: quote.value || 'USD',
    currencyDisplay: 'code',
    maximumFractionDigits: 8,
  }).format(n)
}
function fmtNum(n?: number) {
  if (!n && n !== 0) return '—'
  return new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 2 }).format(
    n,
  )
}
function fmtPct(n?: number) {
  if (!n && n !== 0) return '—'
  const s = n.toFixed(2) + '%'
  return s
}
</script>

<template>
  <div class="card" role="region" aria-live="polite">
    <div class="caption">
      <h2>Market</h2>
      <div v-if="loading" class="muted">Updating…</div>
      <div v-else class="muted">Live</div>
    </div>

    <div v-if="notice" class="notice">
      {{ notice }}
    </div>

    <template v-if="error">
      <div style="padding: 16px; color: var(--down)">{{ error }}</div>
    </template>

    <table v-if="!error" class="table">
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Name</th>
          <th>Price</th>
          <th>24h</th>
          <th>High 24h</th>
          <th>Low 24h</th>
          <th>Vol 24h</th>
          <th>Market Cap</th>
          <th>Trend</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in filtered" :key="row.symbol">
          <td>
            <span class="badge">{{ row.symbol }}</span>
          </td>
          <td>{{ row.name ?? '—' }}</td>
          <td class="price">{{ fmtPrice(row.price) }}</td>
          <td class="pct" :class="{ up: (row.change24h ?? 0) > 0, down: (row.change24h ?? 0) < 0 }">
            {{ fmtPct(row.change24h) }}
          </td>
          <td>{{ fmtPrice(row.high24h) }}</td>
          <td>{{ fmtPrice(row.low24h) }}</td>
          <td>{{ fmtNum(row.volume24h) }}</td>
          <td>{{ fmtNum(row.marketCap) }}</td>
          <td class="num">
            <Sparkline :data="row.history" :width="100" :height="20" aria-label="Price trend" />
          </td>
        </tr>
        <tr v-if="!filtered.length && !loading">
          <td colspan="8" class="small" style="padding: 16px">
            No results. Try clearing filters or search.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMarketStore } from '@/stores/market.ts'
import { formatCurrency, formatNumber, formatPercent } from '../utils/format.ts'
import Sparkline from '@/components/Sparkline.vue'

const store = useMarketStore()
const { filtered, loading, error, quote, notice } = storeToRefs(store)
</script>

<template>
  <div class="card" role="region" aria-live="polite">
    <div class="caption">
      <h2>Market</h2>
      <div v-if="loading" class="muted">Updating…</div>
      <div v-else class="muted">Live</div>
    </div>

    <div v-if="notice" class="notice">{{ notice }}</div>

    <template v-if="error">
      <div style="padding:16px; color: var(--down)">{{ error }}</div>
    </template>

    <table v-else class="table">
      <thead>
      <tr>
        <th>Symbol</th>
        <th>Price</th>
        <th>24h</th>
        <th>High 24h</th>
        <th>Low 24h</th>
        <th>Vol 24h</th>
        <th>Trend</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="row in filtered" :key="row.symbol">
        <td><span class="badge">{{ row.symbol }}</span></td>
        <td class="price">{{ formatCurrency(quote, row.price) }}</td>
        <td class="pct" :class="{ up: (row.change24h ?? 0) > 0, down: (row.change24h ?? 0) < 0 }">
          {{ formatPercent(row.change24h) }}
        </td>
        <td>{{ formatCurrency(quote, row.high24h) }}</td>
        <td>{{ formatCurrency(quote, row.low24h) }}</td>
        <td>{{ formatNumber(row.volume24h) }}</td>
        <td class="num">
          <Sparkline :data="row.history" :width="100" :height="20" aria-label="Price trend" />
        </td>
      </tr>
      <tr v-if="!filtered.length && !loading">
        <td colspan="8" class="small" style="padding:16px">No results. Try clearing filters or search.</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

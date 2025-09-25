<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useMarketStore } from '../stores/market'

const { stats, quote } = storeToRefs(useMarketStore())

function formatNumber(n: number) {
  return new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 2 }).format(
    n,
  )
}
function signed(n: number) {
  const s = n.toFixed(2)
  return n > 0 ? `+${s}%` : `${s}%`
}
</script>

<template>
  <div class="grid-3">
    <div class="card tile">
      <h3>Total Market Cap</h3>
      <div class="value">{{ formatNumber(stats.totalCap) }} {{ quote }}</div>
      <div class="small">Sum across listed assets</div>
    </div>
    <div class="card tile">
      <h3>Average 24h Change</h3>
      <div class="value" :class="{ up: stats.avgChange > 0, down: stats.avgChange < 0 }">
        {{ signed(stats.avgChange) }}
      </div>
      <div class="small">Mean of 24h % change</div>
    </div>
    <div class="card tile">
      <h3>Tracked Assets</h3>
      <div class="value">{{ stats.actives }}</div>
      <div class="small">From current feed</div>
    </div>
  </div>
</template>

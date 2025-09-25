<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useMarketStore } from '../stores/market'

const market = useMarketStore()
const { query, sortKey, sortDir, pollMs, quote, currencies } = storeToRefs(market)

const sortOptions = [
  { label: 'Market Cap', value: 'marketCap' },
  { label: 'Price', value: 'price' },
  { label: '24h Change', value: 'change24h' },
  { label: 'Volume 24h', value: 'volume24h' },
  { label: 'Symbol', value: 'symbol' },
]
</script>

<template>
  <div class="toolbar card" role="region" aria-label="Market toolbar">
    <input
      v-model="query"
      class="search"
      type="search"
      placeholder="Search by symbol or name (e.g. BTC, Ether)"
      aria-label="Search"
    />

    <div class="right">
      <div>
        <label class="small">Quote</label>
        <select v-model="quote">
          <option v-for="c in currencies" :key="c.code" :value="c.code">{{ c.code }}</option>
        </select>
      </div>

      <div>
        <label class="small">Sort by</label>
        <select v-model="sortKey">
          <option v-for="o in sortOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
        </select>
      </div>

      <div>
        <label class="small">Direction</label>
        <select v-model="sortDir">
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>

      <div>
        <label class="small">Polling (ms)</label>
        <input
          v-model.number="pollMs"
          type="number"
          min="3000"
          step="1000"
          aria-label="Polling interval"
        />
      </div>
    </div>
  </div>
</template>

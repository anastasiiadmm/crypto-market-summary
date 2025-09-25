<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useMarketStore } from '../stores/market'
const { currencies } = storeToRefs(useMarketStore())

function iconSrc(base64?: string) {
  return base64 ? `data:image/svg+xml;base64,${base64}` : ''
}
</script>

<template>
  <div class="card" style="margin-top: 12px">
    <div class="caption">
      <h2>Currencies</h2>
      <div class="muted">From /currency</div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>Icon</th>
          <th>Code</th>
          <th>Ticker</th>
          <th>Type</th>
          <th>Decimals</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in currencies" :key="c.code">
          <td>
            <img
              v-if="c.iconBase64"
              :src="iconSrc(c.iconBase64)"
              alt=""
              width="20"
              height="20"
              style="display: block; border-radius: 4px"
            />
          </td>
          <td>
            <span class="badge">{{ c.code }}</span>
          </td>
          <td>{{ c.ticker ?? '—' }}</td>
          <td>{{ c.type ?? '—' }}</td>
          <td>{{ c.decimals ?? '—' }}</td>
          <td>{{ c.name ?? '—' }}</td>
        </tr>
        <tr v-if="!currencies.length">
          <td colspan="6" class="small" style="padding: 16px">No currencies.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

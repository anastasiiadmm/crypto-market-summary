<script setup lang="ts">
import type { Currency } from '@/types.ts'
import { toDataUriSvg } from '@/utils/svg.ts'

const props = defineProps<{ rows: Currency[] }>()
</script>

<template>
  <div class="card">
    <div class="caption"><h2>Currencies</h2></div>

    <table class="table">
      <thead>
      <tr><th>Icon</th><th>Code</th><th>Ticker</th><th>Type</th><th>Name</th></tr>
      </thead>
      <tbody>
      <tr v-for="c in rows" :key="c.code">
        <td>
          <img v-if="c.iconBase64" :src="toDataUriSvg(c.iconBase64)" alt="" width="20" height="20"
               style="display:block; border-radius:4px"
          />
        </td>
        <td><span class="badge">{{ c.code }}</span></td>
        <td>{{ c.ticker ?? '—' }}</td>
        <td>{{ (c.type ?? '').toString() || '—' }}</td>
        <td>{{ c.name ?? '—' }}</td>
      </tr>
      <tr v-if="!rows.length">
        <td colspan="5" class="small" style="padding:16px">No currencies.</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

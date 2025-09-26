<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, watch, watchEffect } from 'vue'
import { useMarketStore } from '@/stores/market.ts'
import { useCurrenciesStore } from '@/stores/currencies.ts'
import { TOOLBAR_DEFAULTS } from '@/constants/toolbar.ts'
import { buildCurrencyHaystack, filterByType, getGroupOrder } from '@/utils/currency.ts'
import { marketSortOptions } from '@/types/ui.ts'

const props = defineProps<{ view: 'market' | 'currencies' }>()
const emit = defineEmits<{ (e: 'update:currencies', rows: any[]): void }>()

const market = useMarketStore()
const { query, sortDir, sortKey, pollMs } = storeToRefs(market)

const currencies = useCurrenciesStore()
const { items: currencyItems, loading: curLoading, error: curError } = storeToRefs(currencies)

const searchQuery = defineModel<string>('searchQuery', { default: TOOLBAR_DEFAULTS.searchQuery })
const typeFilter   = defineModel<'primary' | 'secondary' | ''>('typeFilter', { default: TOOLBAR_DEFAULTS.typeFilter })
const primaryFirst = defineModel<boolean>('primaryFirst', { default: TOOLBAR_DEFAULTS.primaryFirst })

function normType(v: unknown): 'primary'|'secondary'|'' {
  const t = String(v ?? '').trim().toLowerCase()
  return t === 'primary' || t === 'secondary' ? t : ''
}

const currenciesView = computed(() => {
  let list = filterByType([...currencyItems.value], typeFilter.value)

  const q = searchQuery.value.trim().toLowerCase()
  if (q) list = list.filter(c => buildCurrencyHaystack(c).includes(q))

  const order = getGroupOrder(primaryFirst.value)
  return list.sort((a: any, b: any) => {
    const ga = order[normType(a.type)]; const gb = order[normType(b.type)]
    if (ga !== gb) return ga - gb

    const sa = Number(a.sort_order ?? Number.POSITIVE_INFINITY)
    const sb = Number(b.sort_order ?? Number.POSITIVE_INFINITY)
    if (Number.isFinite(sa) || Number.isFinite(sb)) {
      const s = sa - sb
      if (s !== 0) return s
    }
    return (a.code ?? '').localeCompare(b.code ?? '')
  })
})

watchEffect(() => {
  if (props.view === 'currencies') {
    emit('update:currencies', currenciesView.value)
  }
})

watch(() => props.view, (v) => {
  if (v === 'currencies') {
    typeFilter.value = ''
    searchQuery.value = ''
  } else {
    query.value = ''
  }
}, { immediate: true })

watch(() => props.view, (v) => {
  if (v === 'currencies' && !currencyItems.value.length && !curLoading.value) {
    void currencies.load();
  }
}, { immediate: true })
</script>

<template>
  <div class="toolbar card" role="region" aria-label="Toolbar">
    <template v-if="view === 'market'">
      <input
        v-model="query"
        class="search"
        type="search"
        placeholder="Search by symbol (e.g. BTC, ETH)"
        aria-label="Search market"
      />
      <div class="right">
        <div>
          <label class="small">Sort by</label>
          <select v-model="sortKey">
            <option v-for="o in marketSortOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
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
          <input v-model.number="pollMs" type="number" min="3000" step="1000" aria-label="Polling interval" />
        </div>
      </div>
    </template>

    <template v-else>
      <div class="toolbar-left">
        <input v-model="searchQuery" class="search" placeholder="Search code/ticker/name/type" />
        <select v-model="typeFilter" aria-label="Filter by type">
          <option value="">All</option>
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
        </select>
        <div class="segmented" role="group" aria-label="Type order">
          <button
            class="segmented-btn"
            :aria-pressed="primaryFirst"
            type="button"
            @click="primaryFirst = true"
          >
            Primary → Secondary
          </button>
          <button
            class="segmented-btn"
            :aria-pressed="!primaryFirst"
            type="button"
            @click="primaryFirst = false"
          >
            Secondary → Primary
          </button>
        </div>
      </div>
      <div class="right">
        <span v-if="curLoading" class="small muted">Loading…</span>
        <span v-else-if="curError" class="small" style="color:var(--down)">{{ curError }}</span>
      </div>
    </template>
  </div>
</template>

import { defineStore } from 'pinia'
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

import { fetchCurrencies, fetchMarket } from '../services/api'
import type { MarketItem, Currency } from '../types'

export type SortKey = 'symbol' | 'price' | 'change24h' | 'volume24h' | 'marketCap'
export type SortDir = 'asc' | 'desc'

export const useMarketStore = defineStore('market', () => {
  const currencies = ref<Currency[]>([])
  const quote = ref<string>('USD')
  const items = ref<MarketItem[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const query = ref<string>('')
  const sortKey = ref<SortKey>('marketCap')
  const sortDir = ref<SortDir>('desc')
  const pollMs = ref<number>(10_000)
  const notice = ref<string | null>(null)

  let timer: number | null = null

  async function init() {
    try {
      loading.value = true
      const { quotes } = await fetchCurrencies()
      currencies.value = quotes
      if (!quotes.find((c) => c.code === 'USD') && quotes[0]) {
        quote.value = quotes[0].code
      }
      await load()
      start()
    } catch (e: any) {
      error.value = e.message ?? String(e)
    } finally {
      loading.value = false
    }
  }

  async function load() {
    try {
      loading.value = true
      error.value = null
      const { items: data, requested, detected } = await fetchMarket(quote.value)
      items.value = data

      if (requested && detected && requested !== detected) {
        notice.value = `Для ${requested} нет данных. Показаны пары в ${detected}.`
      } else {
        notice.value = null
      }
    } catch (e: any) {
      error.value = e.message ?? String(e)
    } finally {
      loading.value = false
    }
  }

  function start() {
    stop()
    timer = window.setInterval(() => {
      void load()
    }, pollMs.value)
  }
  function stop() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  const filtered = computed(() => {
    const q = query.value.trim().toLowerCase()
    let list = items.value
    if (q) list = list.filter((i) => (i.symbol + ' ' + (i.name ?? '')).toLowerCase().includes(q))

    const dir = sortDir.value === 'asc' ? 1 : -1
    const key = sortKey.value
    return [...list].sort((a, b) => {
      const va = (a as any)[key] ?? 0
      const vb = (b as any)[key] ?? 0
      if (typeof va === 'string' && typeof vb === 'string') return va.localeCompare(vb) * dir
      return (va - vb) * dir
    })
  })

  const stats = computed(() => {
    const totalCap = items.value.reduce((s, x) => s + (x.marketCap ?? 0), 0)
    const avgChange = items.value.length
      ? items.value.reduce((s, x) => s + (x.change24h ?? 0), 0) / items.value.length
      : 0
    const actives = items.value.length
    return { totalCap, avgChange, actives }
  })

  watch(pollMs, () => start())
  watch(quote, () => {
    void load()
  })

  onMounted(() => {
    void init()
  })
  onUnmounted(stop)

  return {
    currencies,
    quote,
    items,
    loading,
    error,
    query,
    sortKey,
    sortDir,
    pollMs,
    init,
    load,
    start,
    stop,
    filtered,
    stats,
    notice,
  }
})

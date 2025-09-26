import { defineStore } from 'pinia'
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { MarketItem } from '@/types.ts'
import type { SortDir, SortKey } from '@/types/ui.ts'
import { fetchMarket } from '@/api/market.ts'

export const useMarketStore = defineStore('market', () => {
  const quote = ref<string>('AUD')

  const items = ref<MarketItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const notice = ref<string | null>(null)

  const query = ref('')
  const sortKey = ref<SortKey>('price')
  const sortDir = ref<SortDir>('desc')
  const pollMs = ref(10_000)

  let timer: number | null = null

  async function load(): Promise<void> {
    try {
      loading.value = true
      error.value = null
      const res = await fetchMarket(quote.value)
      items.value = res.items
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e)
    } finally {
      loading.value = false
    }
  }

  function start(): void {
    stop()
    timer = window.setInterval(() => { void load() }, pollMs.value)
  }
  function stop(): void {
    if (timer !== null) { clearInterval(timer); timer = null }
  }

  function getSortValue(item: MarketItem, key: SortKey): number | string {
    switch (key) {
      case 'symbol': return item.symbol
      case 'price': return item.price ?? 0
      case 'change24h': return item.change24h ?? 0
      case 'volume24h': return item.volume24h ?? 0
    }
  }
  function compareByKey(key: SortKey, dir: SortDir) {
    const mul = dir === 'asc' ? 1 : -1
    return (a: MarketItem, b: MarketItem): number => {
      const va = getSortValue(a, key)
      const vb = getSortValue(b, key)
      return (typeof va === 'string' && typeof vb === 'string')
        ? va.localeCompare(vb) * mul
        : (Number(va) - Number(vb)) * mul
    }
  }

  const filtered = computed<MarketItem[]>(() => {
    const q = query.value.trim().toLowerCase()
    const base = q
      ? items.value.filter((i) => (i.symbol).toLowerCase().includes(q))
      : items.value
    return [...base].sort(compareByKey(sortKey.value, sortDir.value))
  })

  watch(pollMs, start)
  watch(quote, () => { void load() })

  onMounted(async () => { await load(); start() })
  onUnmounted(stop)

  return {
    quote, items, loading, error, notice,
    query, sortKey, sortDir, pollMs,
    filtered,
    load,
  }
})

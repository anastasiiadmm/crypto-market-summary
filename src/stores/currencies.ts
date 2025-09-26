import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Currency } from '@/types.ts'
import { fetchCurrencies } from '@/api/currency.ts'

export const useCurrenciesStore = defineStore('currencies', () => {
  const items = ref<Currency[]>([])
  const loading = ref(false)
  const error = ref<string|null>(null)

  async function load(): Promise<void> {
    if (loading.value) return
    loading.value = true
    error.value = null
    try {
      const { quotes } = await fetchCurrencies()
      items.value = quotes
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e)
    } finally {
      loading.value = false
    }
  }

  return { items, loading, error, load }
})

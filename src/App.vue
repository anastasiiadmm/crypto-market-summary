<script setup lang="ts">
import { ref } from 'vue'
import Toolbar from './components/Toolbar.vue'
import StatTiles from './components/StatTiles.vue'
import MarketTable from './components/MarketTable.vue'
import CurrencyList from './components/CurrencyList.vue'
import './style.css'

type TabId = 'market' | 'currencies'
const tabs: ReadonlyArray<{ id: TabId; label: string }> = [
  { id: 'market',     label: 'Market' },
  { id: 'currencies', label: 'Currencies' },
] as const

const active = ref<TabId>('market')

function onTabsKeydown(e: KeyboardEvent) {
  if (!tabs.length) return
  const idx = Math.max(0, tabs.findIndex(t => t.id === active.value))
  if (e.key === 'ArrowRight') {
    active.value = (tabs[(idx + 1) % tabs.length]?.id ?? 'market') as TabId
    e.preventDefault()
  } else if (e.key === 'ArrowLeft') {
    active.value = (tabs[(idx - 1 + tabs.length) % tabs.length]?.id ?? 'market') as TabId
    e.preventDefault()
  }
}
</script>

<template>
  <div class="container">
    <h1 style="margin: 0 0 8px 0">Crypto Market Summary</h1>

    <Toolbar />
    <div style="height: 12px"></div>
    <StatTiles />
    <div style="height: 12px"></div>

    <div class="tabs card" role="tablist" aria-label="Data views" @keydown="onTabsKeydown">
      <button
        v-for="t in tabs" :key="t.id"
        class="tab" :class="{ 'is-active': active === t.id }"
        role="tab" :id="`tab-${t.id}`"
        :aria-selected="active === t.id" :tabindex="active === t.id ? 0 : -1"
        :aria-controls="`panel-${t.id}`"
        @click="active = t.id"
      >
        {{ t.label }}
      </button>
    </div>

    <section role="tabpanel" id="panel-market" aria-labelledby="tab-market" v-show="active === 'market'">
      <MarketTable />
    </section>

    <section role="tabpanel" id="panel-currencies" aria-labelledby="tab-currencies" v-show="active === 'currencies'">
      <CurrencyList />
    </section>

    <footer>Built for the Senior Vue 3 Developer Test • No external UI libs</footer>
  </div>
</template>

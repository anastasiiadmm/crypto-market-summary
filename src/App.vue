<script setup lang="ts">
import './style.css'
import { ref } from 'vue'

import CurrencyList from './components/CurrencyList.vue'
import MarketTable from './components/MarketTable.vue'
import StatTiles from './components/StatTiles.vue'
import Toolbar from './components/Toolbar.vue'

type TabId = 'market' | 'currencies'
const tabs: { id: TabId; label: string }[] = [
  { id: 'market', label: 'Market' },
  { id: 'currencies', label: 'Currencies' },
]
const active = ref<TabId>('market')

function onTabsKeydown(e: KeyboardEvent) {
  const idx = tabs.findIndex((t) => t.id === active.value)
  if (e.key === 'ArrowRight') {
    e.preventDefault()
    active.value = tabs[(idx + 1) % tabs.length]?.id
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    active.value = tabs[(idx - 1 + tabs.length) % tabs.length]?.id
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
        v-for="t in tabs"
        :id="`tab-${t.id}`"
        :key="t.id"
        class="tab"
        :class="{ 'is-active': active === t.id }"
        role="tab"
        :aria-selected="active === t.id"
        :tabindex="active === t.id ? 0 : -1"
        :aria-controls="`panel-${t.id}`"
        @click="active = t.id"
      >
        {{ t.label }}
      </button>
    </div>

    <section
      v-show="active === 'market'"
      :id="`panel-market`"
      role="tabpanel"
      aria-labelledby="tab-market"
    >
      <MarketTable />
    </section>

    <section
      v-show="active === 'currencies'"
      :id="`panel-currencies`"
      role="tabpanel"
      aria-labelledby="tab-currencies"
    >
      <CurrencyList />
    </section>

    <footer>Built for the Senior Vue 3 Developer Test • No external UI libs</footer>
  </div>
</template>

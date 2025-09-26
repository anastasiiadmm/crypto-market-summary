<script setup lang="ts">
import { ref } from 'vue'
import type { Currency } from '@/types.ts'
import Toolbar from '@/components/Toolbar.vue'
import MarketTable from '@/components/MarketTable.vue'
import CurrencyList from '@/components/CurrencyList.vue'
import './style.css'

const view = ref<'market' | 'currencies'>('market')
const currencyRows = ref<Currency[]>([])
</script>

<template>
  <div class="container">
    <h1 class="page-title">Crypto Market Summary</h1>

    <div class="tabs">
      <button :class="{active: view==='market'}" @click="view='market'">Market</button>
      <button :class="{active: view==='currencies'}" @click="view='currencies'">Currencies</button>
    </div>

    <Toolbar :view="view" @update:currencies="currencyRows = $event" />

    <MarketTable v-if="view==='market'" />
    <CurrencyList v-else :rows="currencyRows" />

    <footer>Built for the Senior Vue 3 Developer Test • No external UI libs</footer>
  </div>
</template>

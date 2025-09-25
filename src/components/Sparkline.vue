<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  data?: number[]
  width?: number
  height?: number
  strokeWidth?: number
  ariaLabel?: string
}
const props = defineProps<Props>()

const W  = computed<number>(() => props.width ?? 100)
const H  = computed<number>(() => props.height ?? 20)

const hasData = computed(() => (props.data?.length ?? 0) >= 2)

const isUp = computed(() => {
  const d = props.data ?? []
  if (d.length >= 2) {
    const first = d[0]!
    const last  = d[d.length - 1]!
    return last >= first
  }
  return false
})

const pathD = computed(() => {
  const d = props.data ?? []
  const n = d.length
  if (n < 2) return ''

  let min = Infinity, max = -Infinity
  for (const v of d) { if (v < min) min = v; if (v > max) max = v }
  const range = max - min || 1

  const stepX = n > 1 ? W.value / (n - 1) : W.value
  const toY = (v: number) => {
    const t = (v - min) / range
    return H.value - t * H.value
  }

  let dstr = `M 0 ${toY(d[0]!).toFixed(2)}`
  for (let i = 1; i < n; i++) {
    const x = (i * stepX).toFixed(2)
    const y = toY(d[i]!).toFixed(2)
    dstr += ` L ${x} ${y}`
  }
  return dstr
})
</script>

<template>
  <svg
    :width="W" :height="H" viewBox="0 0 100 20"
    class="sparkline" role="img"
    :aria-label="`${ariaLabel ?? 'Price trend chart'} with ${data?.length ?? 0} data points`"
  >
    <title>{{ ariaLabel ?? 'Price trend chart' }}</title>
    <rect x="0" y="0" width="100" height="20" class="bg" />
    <path v-if="hasData" :d="pathD" :class="['line', isUp ? 'up' : 'down']" vector-effect="non-scaling-stroke" />
    <line v-else x1="0" y1="10" x2="100" y2="10" class="line flat" vector-effect="non-scaling-stroke" />
  </svg>
</template>


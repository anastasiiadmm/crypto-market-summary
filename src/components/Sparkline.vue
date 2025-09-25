<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  data?: number[]
  width?: number
  height?: number
  strokeWidth?: number
  ariaLabel?: string
}
const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  width: 100,
  height: 20,
  strokeWidth: 1.5,
  ariaLabel: 'Price trend chart',
})

const hasData = computed(() => (props.data?.length ?? 0) >= 2)
const isUp = computed(() => {
  const d = props.data ?? []
  return d.length >= 2 ? d[d.length - 1] >= d[0] : false
})

const pathD = computed(() => {
  const d = props.data ?? []
  const n = d.length
  if (n < 2) return ''

  let min = Infinity,
    max = -Infinity
  for (const v of d) {
    if (v < min) min = v
    if (v > max) max = v
  }
  const range = max - min || 1

  const w = props.width
  const h = props.height
  const stepX = n > 1 ? w / (n - 1) : w

  const toY = (v: number) => {
    const t = (v - min) / range
    return h - t * h // инверсия оси Y
  }

  let dstr = `M 0 ${toY(d[0]).toFixed(2)}`
  for (let i = 1; i < n; i++) {
    const x = (i * stepX).toFixed(2)
    const y = toY(d[i]).toFixed(2)
    dstr += ` L ${x} ${y}`
  }
  return dstr
})
</script>

<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 100 20"
    class="sparkline"
    role="img"
    :aria-label="`${ariaLabel} with ${data?.length ?? 0} data points`"
  >
    <title>{{ ariaLabel }}</title>
    <rect x="0" y="0" width="100" height="20" class="bg" />
    <path
      v-if="hasData"
      :d="pathD"
      :class="['line', isUp ? 'up' : 'down']"
      vector-effect="non-scaling-stroke"
    />
    <line
      v-else
      x1="0"
      y1="10"
      x2="100"
      y2="10"
      class="line flat"
      vector-effect="non-scaling-stroke"
    />
  </svg>
</template>

<style scoped>
.sparkline {
  display: block;
  max-width: 100%;
}
.bg {
  fill: transparent;
}
.line {
  fill: none;
  stroke-width: 1.5;
}
.line.up {
  stroke: var(--up, #2ecc71);
}
.line.down {
  stroke: var(--down, #e74c3c);
}
.line.flat {
  stroke: var(--muted, #7f8c8d);
}
</style>

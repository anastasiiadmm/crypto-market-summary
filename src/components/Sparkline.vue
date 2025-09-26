<script setup lang="ts">
import { computed } from 'vue'
import { SPARK_COPY, SPARK_DEFAULTS, SPARK_VIEWBOX } from '@/constants/sparkline.ts'
import { buildPath, hasData, isTrendUp } from '@/utils/sparkline.ts'

interface Props {
  data?: number[]
  width?: number
  height?: number
  strokeWidth?: number
  ariaLabel?: string
}
const props = defineProps<Props>()

const W = computed(() => props.width ?? SPARK_DEFAULTS.width)
const H = computed(() => props.height ?? SPARK_DEFAULTS.height)

const _hasData = computed(() => hasData(props.data))
const up = computed(() => isTrendUp(props.data))

const pathD = computed(() => buildPath(props.data ?? [], W.value, H.value))

const aria = computed(() => {
  const label = props.ariaLabel ?? SPARK_COPY.title
  const count = props.data?.length ?? 0
  return SPARK_COPY.ariaWithCount(label, count)
})
</script>

<template>
  <svg
    :width="W"
    :height="H"
    :viewBox="SPARK_VIEWBOX"
    class="sparkline"
    role="img"
    :aria-label="aria"
  >
    <title>{{ props.ariaLabel ?? SPARK_COPY.title }}</title>
    <rect x="0" y="0" :width="SPARK_DEFAULTS.width" :height="SPARK_DEFAULTS.height" class="bg" />
    <path
      v-if="_hasData"
      :d="pathD"
      :class="['line', up ? 'up' : 'down']"
      vector-effect="non-scaling-stroke"
      :style="{ strokeWidth: (props.strokeWidth ?? SPARK_DEFAULTS.strokeWidth) + 'px' }"
    />
    <line
      v-else
      x1="0" :y1="SPARK_DEFAULTS.height / 2"
      :x2="SPARK_DEFAULTS.width" :y2="SPARK_DEFAULTS.height / 2"
      class="line flat"
      vector-effect="non-scaling-stroke"
      :style="{ strokeWidth: (props.strokeWidth ?? SPARK_DEFAULTS.strokeWidth) + 'px' }"
    />
  </svg>
</template>

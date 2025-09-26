export const SPARK_DEFAULTS = {
  width: 100,
  height: 20,
  strokeWidth: 1.5,
  ariaLabel: 'Price trend chart',
} as const;

export const SPARK_VIEWBOX = `0 0 ${SPARK_DEFAULTS.width} ${SPARK_DEFAULTS.height}`;

export const SPARK_COPY = {
  title: 'Price trend chart',
  ariaWithCount: (label: string, points: number) =>
    `${label} with ${points} data points`,
} as const;

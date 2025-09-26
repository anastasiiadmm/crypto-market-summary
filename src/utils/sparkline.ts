export function hasData(data?: number[]): boolean {
  return (data?.length ?? 0) >= 2;
}

export function isTrendUp(data?: number[]): boolean {
  if (!data || data.length < 2) return false;
  const first = data[0]!;
  const last = data[data.length - 1]!;
  return last >= first;
}

export function getMinMax(data: number[]): { min: number; max: number; range: number } {
  let min = Infinity, max = -Infinity;
  for (const v of data) { if (v < min) min = v; if (v > max) max = v; }
  const range = max - min || 1;
  return { min, max, range };
}

export function toY(v: number, min: number, range: number, height: number): number {
  const t = (v - min) / range;
  return height - t * height;
}

export function buildPath(data: number[], width: number, height: number): string {
  const n = data.length;
  if (n < 2) return '';

  const { min, range } = getMinMax(data);
  const stepX = n > 1 ? width / (n - 1) : width;

  let d = `M 0 ${toY(data[0]!, min, range, height).toFixed(2)}`;
  for (let i = 1; i < n; i++) {
    const x = (i * stepX).toFixed(2);
    const y = toY(data[i]!, min, range, height).toFixed(2);
    d += ` L ${x} ${y}`;
  }
  return d;
}

import { scaleLinear } from '@tanstack/charts/scales/linear'

export type RadiusRange = readonly [min: number, max: number]

export function sqrtRadiusScale(
  values: readonly number[],
  [minRadius, maxRadius]: RadiusRange,
): (value: number) => number {
  if (values.length === 0) return () => minRadius
  const low = Math.sqrt(Math.max(0, Math.min(...values)))
  const high = Math.sqrt(Math.max(0, Math.max(...values)))
  if (low === high) return () => (minRadius + maxRadius) / 2
  const scale = scaleLinear([low, high], [minRadius, maxRadius])
  return (value) => scale(Math.sqrt(Math.max(0, value))) ?? minRadius
}

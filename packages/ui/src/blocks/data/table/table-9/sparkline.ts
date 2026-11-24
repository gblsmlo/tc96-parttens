export interface SparklineBox {
  height: number
  padding?: number
  width: number
}

export function buildSparklinePath(
  points: readonly number[],
  { height, padding = 2, width }: SparklineBox,
): string {
  if (points.length === 0) return ''
  const min = Math.min(...points)
  const max = Math.max(...points)
  const span = max - min
  const step =
    points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0

  return points
    .map((point, index) => {
      const x = padding + index * step
      const ratio = span === 0 ? 0.5 : (point - min) / span
      const y = padding + (1 - ratio) * (height - padding * 2)
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
}

import { barX, defineChart, text } from '@tanstack/charts'
import { scaleBand } from '@tanstack/charts/scales/band'
import { scaleLinear } from '@tanstack/charts/scales/linear'
import { tooltip } from '@tanstack/charts/tooltip'
import { useMemo } from 'react'
import { TanstackChartFrame, tanstackChartTheme } from './tanstack-chart-frame'

export interface CategoryBarDatum {
  id: string
  label: string
  value: number
}

export interface CategoryBarChartProps {
  color?: string
  data: readonly CategoryBarDatum[]
  formatValue: (value: number) => string
  label: string
  summary: string
  tooltipText: (datum: CategoryBarDatum) => string
}

const rowHeight = 36

export function CategoryBarChart({
  color = 'var(--chart-1)',
  data,
  formatValue,
  label,
  summary,
  tooltipText,
}: Readonly<CategoryBarChartProps>) {
  const definition = useMemo(
    () =>
      defineChart({
        focus: 'group-y',
        marks: [
          barX(data, {
            fill: color,
            key: (datum) => datum.id,
            radius: { end: 4 },
            x: (datum) => datum.value,
            y: (datum) => datum.label,
          }),
          text(data, {
            anchor: 'start',
            dx: 6,
            fill: 'var(--foreground)',
            fontWeight: 500,
            key: (datum) => `${datum.id}-value`,
            text: (datum) => formatValue(datum.value),
            x: (datum) => datum.value,
            y: (datum) => datum.label,
          }),
        ],
        margin: { right: 72 },
        scales: {
          x: { axis: false, nice: true, scale: scaleLinear },
          y: { scale: () => scaleBand<string>().padding(0.28) },
        },
        theme: tanstackChartTheme,
        tooltip: {
          format: ({ datum }: { datum: CategoryBarDatum }) =>
            tooltipText(datum),
          use: tooltip,
        },
      }),
    [color, data, formatValue, tooltipText],
  )

  return (
    <TanstackChartFrame
      definition={definition}
      height={Math.max(data.length, 1) * rowHeight + 16}
      label={label}
      summary={summary}
    />
  )
}

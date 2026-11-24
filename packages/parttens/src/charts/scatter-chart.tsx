import {
  type ChartKey,
  type ChartPoint,
  colorLegend,
  defineChart,
  dot,
} from '@tanstack/charts'
import { Chart } from '@tanstack/charts/react'
import { scaleLinear } from '@tanstack/charts/scales/linear'
import { scaleOrdinal } from '@tanstack/charts/scales/ordinal'
import { tooltip } from '@tanstack/charts/tooltip'
import { useMemo } from 'react'
import { type RadiusRange, sqrtRadiusScale } from './lib/sqrt-radius'

const defaultColors = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

const defaultRadiusRange: RadiusRange = [4, 22]

export interface ScatterChartProps<TDatum> {
  data: readonly TDatum[]
  getKey: (datum: TDatum) => ChartKey
  x: (datum: TDatum) => number
  y: (datum: TDatum) => number
  size: (datum: TDatum) => number
  color: (datum: TDatum) => string
  ariaLabel: string
  ariaDescription?: string
  xLabel?: string
  yLabel?: string
  colorLabel?: string
  colors?: readonly string[]
  radiusRange?: RadiusRange
  height?: number
  className?: string
  formatTooltip?: (datum: TDatum) => string
  onFocusChange?: (datum: TDatum | null) => void
  onSelect?: (datum: TDatum | null) => void
}

export function ScatterChart<TDatum>({
  data,
  getKey,
  x,
  y,
  size,
  color,
  ariaLabel,
  ariaDescription,
  xLabel,
  yLabel,
  colorLabel,
  colors = defaultColors,
  radiusRange = defaultRadiusRange,
  height = 360,
  className,
  formatTooltip,
  onFocusChange,
  onSelect,
}: ScatterChartProps<TDatum>) {
  const definition = useMemo(() => {
    const radius = sqrtRadiusScale(data.map(size), radiusRange)
    return defineChart({
      color: {
        legend: colorLegend({ label: colorLabel }),
        scale: () => scaleOrdinal<string, string>().range([...colors]),
      },
      marks: [
        dot(data, {
          color,
          fillOpacity: 0.7,
          key: getKey,
          r: size,
          rScale: radius,
          x,
          y,
        }),
      ],
      scales: {
        x: {
          axis: { label: xLabel },
          grid: true,
          nice: true,
          scale: scaleLinear,
        },
        y: {
          axis: { label: yLabel },
          grid: true,
          nice: true,
          scale: scaleLinear,
        },
      },
      tooltip: formatTooltip
        ? {
            format: ({ datum }: ChartPoint<TDatum, number, number>) =>
              formatTooltip(datum),
            use: tooltip,
          }
        : tooltip,
    })
  }, [
    data,
    getKey,
    x,
    y,
    size,
    color,
    xLabel,
    yLabel,
    colorLabel,
    colors,
    radiusRange,
    formatTooltip,
  ])

  return (
    <div className={className} data-slot="scatter-chart">
      <Chart<TDatum, number, number>
        ariaDescription={ariaDescription}
        ariaLabel={ariaLabel}
        definition={definition}
        height={height}
        onFocusChange={
          onFocusChange &&
          ((point) =>
            onFocusChange(point?.datum ?? null))
        }
        onSelect={
          onSelect &&
          ((point) => onSelect(point?.datum ?? null))
        }
      />
    </div>
  )
}

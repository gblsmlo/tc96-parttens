import { barY, defineChart, group, lineY } from '@tanstack/charts'
import { scaleBand } from '@tanstack/charts/scales/band'
import { scaleLinear } from '@tanstack/charts/scales/linear'
import { tooltip } from '@tanstack/charts/tooltip'
import { useMemo } from 'react'
import { TanstackChartFrame, tanstackChartTheme } from './tanstack-chart-frame'

export interface PeriodColumnSeries {
  color: string
  id: string
}

export interface PeriodColumnDatum {
  forecast?: boolean
  period: string
  series: string
  value: number
}

export interface PeriodLineDatum {
  period: string
  value: number
}

export interface PeriodColumnChartProps {
  columnTooltip: (datum: PeriodColumnDatum) => string
  data: readonly PeriodColumnDatum[]
  formatAxis: (value: number) => string
  height?: number
  label: string
  line?: {
    color: string
    data: readonly PeriodLineDatum[]
    tooltip: (datum: PeriodLineDatum) => string
  }
  periods: readonly string[]
  series: readonly PeriodColumnSeries[]
  summary: string
}

const forecastDash = '4 3'

export function PeriodColumnChart({
  columnTooltip,
  data,
  formatAxis,
  height = 260,
  label,
  line,
  periods,
  series,
  summary,
}: Readonly<PeriodColumnChartProps>) {
  const definition = useMemo(() => {
    const seriesIds = series.map((item) => item.id)
    const colorOf = (id: string) =>
      series.find((item) => item.id === id)?.color ?? 'var(--chart-1)'
    const actual = data.filter((datum) => !datum.forecast)
    const forecast = data.filter((datum) => datum.forecast)
    const layout =
      seriesIds.length > 1
        ? group({ padding: 0.12, scale: scaleBand<string>().domain(seriesIds) })
        : undefined
    const columnOptions = {
      key: (datum: PeriodColumnDatum) => `${datum.period}-${datum.series}`,
      layout,
      maxThickness: 28,
      radius: { end: 3 },
      x: (datum: PeriodColumnDatum) => datum.period,
      y: (datum: PeriodColumnDatum) => datum.value,
      z: (datum: PeriodColumnDatum) => datum.series,
    }

    return defineChart({
      focus: 'group-x',
      marks: [
        barY(actual, {
          ...columnOptions,
          fill: (datum) => colorOf(datum.series),
          id: 'actual',
        }),
        barY(forecast, {
          ...columnOptions,
          fill: (datum) => colorOf(datum.series),
          fillOpacity: 0.3,
          id: 'forecast',
          stroke: (datum) => colorOf(datum.series),
          strokeDasharray: forecastDash,
          strokeWidth: 1.5,
        }),
        ...(line
          ? [
              lineY(line.data, {
                id: 'line',
                key: (datum) => `${datum.period}-line`,
                points: true,
                stroke: line.color,
                x: (datum) => datum.period,
                y: (datum) => datum.value,
              }),
            ]
          : []),
      ],
      scales: {
        x: {
          scale: () => scaleBand<string>().domain(periods).padding(0.24),
        },
        y: {
          axis: { ticks: { count: 4, format: formatAxis } },
          grid: true,
          nice: true,
          scale: scaleLinear,
        },
      },
      theme: tanstackChartTheme,
      tooltip: {
        format: ({ datum }: { datum: PeriodColumnDatum | PeriodLineDatum }) =>
          'series' in datum
            ? columnTooltip(datum)
            : (line?.tooltip(datum) ?? ''),
        use: tooltip,
      },
    })
  }, [columnTooltip, data, formatAxis, line, periods, series])

  return (
    <TanstackChartFrame
      definition={definition}
      height={height}
      label={label}
      summary={summary}
    />
  )
}

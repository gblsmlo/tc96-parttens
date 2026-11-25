import type {
  ChartTheme,
  ChartValue,
  DomChartDefinition,
} from '@tanstack/charts'
import { Chart } from '@tanstack/charts/react'

export const tanstackChartTheme: Partial<ChartTheme> = {
  foreground: 'var(--foreground)',
  grid: 'var(--border)',
  muted: 'var(--muted-foreground)',
  palette: [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
  ],
}

export interface TanstackChartFrameProps<
  TDatum,
  TXValue extends ChartValue,
  TYValue extends ChartValue,
> {
  definition: DomChartDefinition<TDatum, TXValue, TYValue>
  height?: number
  label: string
  summary: string
}

export function TanstackChartFrame<
  TDatum,
  TXValue extends ChartValue,
  TYValue extends ChartValue,
>({
  definition,
  height = 240,
  label,
  summary,
}: Readonly<TanstackChartFrameProps<TDatum, TXValue, TYValue>>) {
  return (
    <div
      className="min-w-0 text-muted-foreground text-xs [--ts-chart-tooltip-background:var(--popover)] [--ts-chart-tooltip-border:1px_solid_var(--border)] [--ts-chart-tooltip-color:var(--popover-foreground)]"
      data-slot="dashboard-chart"
    >
      <Chart<TDatum, TXValue, TYValue>
        ariaDescription={summary}
        ariaLabel={label}
        definition={definition}
        height={height}
      />
    </div>
  )
}

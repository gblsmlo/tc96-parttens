import { cn } from '@tc96/utils'

export type ChartSeriesMarker = 'dashed' | 'line' | 'solid'

export interface ChartSeriesLegendItem {
  color: string
  id: string
  label: string
  marker?: ChartSeriesMarker
  value?: string
}

function SeriesMarker({
  color,
  marker,
}: Readonly<{ color: string; marker: ChartSeriesMarker }>) {
  if (marker === 'line') {
    return (
      <span
        aria-hidden="true"
        className="h-0.5 w-3.5 shrink-0"
        style={{ backgroundColor: color }}
      />
    )
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        'size-2.5 shrink-0 rounded-sm border-2',
        marker === 'dashed' && 'border-dashed bg-transparent',
      )}
      style={{
        backgroundColor: marker === 'dashed' ? undefined : color,
        borderColor: color,
      }}
    />
  )
}

export function ChartSeriesLegend({
  className,
  items,
  label,
}: Readonly<{
  className?: string
  items: readonly ChartSeriesLegendItem[]
  label: string
}>) {
  return (
    <ul
      aria-label={label}
      className={cn(
        'm-0 flex list-none flex-wrap gap-x-4 gap-y-1.5 p-0 text-muted-foreground text-xs',
        className,
      )}
      data-slot="dashboard-chart-legend"
    >
      {items.map((item) => (
        <li
          className="flex items-center gap-1.5"
          data-series={item.id}
          key={item.id}
        >
          <SeriesMarker color={item.color} marker={item.marker ?? 'solid'} />
          <span>{item.label}</span>
          {item.value === undefined ? null : (
            <span className="font-medium text-foreground tabular-nums">
              {item.value}
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}

import type { ReactElement } from 'react'

export interface ChartTooltipProps {
  active?: boolean
  formatValue: (value: number) => string
  label?: unknown
  payload?: readonly {
    color?: string
    name?: unknown
    value?: unknown
  }[]
}

export function ChartTooltip({
  active,
  formatValue,
  label,
  payload,
}: Readonly<ChartTooltipProps>): ReactElement | null {
  if (!active || !payload?.length) return null

  return (
    <div className="grid gap-1 rounded-lg border bg-popover px-2.5 py-1.5 text-popover-foreground text-xs shadow-(shadow:--chart-shadow)">
      <span className="text-muted-foreground">{String(label ?? '')}</span>
      {payload.map((item) => (
        <span
          className="flex items-center gap-1.5 tabular-nums"
          key={String(item.name)}
        >
          <span
            aria-hidden="true"
            className="size-2 rounded-sm"
            style={{ backgroundColor: item.color }}
          />
          {String(item.name)}{' '}
          <span className="font-medium">{formatValue(Number(item.value))}</span>
        </span>
      ))}
    </div>
  )
}

export function ChartLegend({
  items,
}: Readonly<{ items: readonly { color: string; label: string }[] }>) {
  return (
    <ul className="m-0 flex list-none flex-wrap justify-center gap-x-4 gap-y-1 p-0 text-muted-foreground text-xs">
      {items.map((item) => (
        <li className="flex items-center gap-1.5" key={item.label}>
          <span
            aria-hidden="true"
            className="size-2 rounded-sm"
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </li>
      ))}
    </ul>
  )
}

export function chartColor(index: number) {
  return `var(--chart-${(index % 5) + 1})`
}

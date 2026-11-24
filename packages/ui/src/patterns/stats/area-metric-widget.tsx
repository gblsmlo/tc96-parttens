import { CardPanel } from '@tc96/ui/card'
import type { AmountFormatOptions } from '@tc96/ui/helpers/format'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { useId } from 'react'
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts'
import { Amount } from '../widgets/shared/amount'
import { WidgetShell } from '../widgets/shared/widget-shell'

export interface AreaMetricWidgetProps
  extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  caption?: ReactNode
  color?: string
  format?: AmountFormatOptions
  label: ReactNode
  points: readonly number[]
  value: number | ReactNode
}

export function AreaMetricWidget({
  caption,
  className,
  color = 'var(--chart-1)',
  format,
  label,
  points,
  value,
  ...props
}: Readonly<AreaMetricWidgetProps>): ReactElement {
  const titleId = useId()
  const gradientId = `area-metric-${titleId.replace(/[^\w-]/g, '')}`
  const data = points.map((point, index) => ({ index, value: point }))

  return (
    <WidgetShell
      aria-labelledby={titleId}
      className={className}
      data-widget="area-metric"
      {...props}
    >
      <CardPanel className="grid gap-4 p-5">
        <h3 className="truncate font-medium text-sm" id={titleId}>
          {label}
        </h3>
        <div className="flex items-end justify-between gap-4">
          <div className="grid min-w-0 gap-1">
            {caption ? (
              <p className="truncate text-muted-foreground text-xs">
                {caption}
              </p>
            ) : null}
            {typeof value === 'number' ? (
              <Amount
                className="font-semibold text-2xl leading-tight tracking-tight"
                value={value}
                {...(format ? { format } : {})}
              />
            ) : (
              <span className="font-semibold text-2xl leading-tight tracking-tight tabular-nums">
                {value}
              </span>
            )}
          </div>
          {data.length > 1 ? (
            <div
              aria-hidden="true"
              className="h-12 w-1/2 max-w-40 shrink-0"
              data-slot="area-metric-chart"
            >
              <ResponsiveContainer
                height="100%"
                initialDimension={{ height: 48, width: 160 }}
                width="100%"
              >
                <AreaChart
                  accessibilityLayer={false}
                  data={data}
                  margin={{ bottom: 0, left: 0, right: 0, top: 2 }}
                >
                  <defs>
                    <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <YAxis domain={['dataMin', 'dataMax']} hide />
                  <Area
                    dataKey="value"
                    fill={`url(#${gradientId})`}
                    isAnimationActive={false}
                    stroke={color}
                    strokeWidth={1.5}
                    type="monotone"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : null}
        </div>
      </CardPanel>
    </WidgetShell>
  )
}

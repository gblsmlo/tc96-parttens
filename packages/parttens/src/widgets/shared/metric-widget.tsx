import type { AmountFormatOptions } from '@tc96/helpers/format'
import { CardPanel } from '@tc96/ui/card'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { useId } from 'react'
import { Amount } from './amount'
import { CardWidgetShell } from './card-widget-shell'
import { TrendIndicator } from './trend-indicator'

export interface MetricWidgetProps
  extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  change?: number
  changeFormat?: AmountFormatOptions
  changeLabel?: ReactNode
  children?: ReactNode
  format?: AmountFormatOptions
  icon?: ReactNode
  label: ReactNode
  tone?: 'default' | 'inverted'
  value: number | ReactNode
}

export function MetricWidget({
  change,
  changeFormat,
  changeLabel,
  children,
  className,
  format,
  icon,
  label,
  tone = 'default',
  value,
  ...props
}: Readonly<MetricWidgetProps>): ReactElement {
  const titleId = useId()
  const card = (
    <CardWidgetShell
      aria-labelledby={titleId}
      className={className}
      data-tone={tone}
      data-widget="metric"
      {...props}
    >
      <CardPanel className="grid gap-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="truncate text-muted-foreground text-sm" id={titleId}>
            {label}
          </h3>
          {icon}
        </div>
        <div className="grid gap-2">
          {typeof value === 'number' ? (
            <Amount
              className="font-medium text-4xl leading-tight tracking-tight"
              dimFraction
              value={value}
              {...(format ? { format } : {})}
            />
          ) : (
            <span className="font-medium text-4xl leading-tight tracking-tight tabular-nums">
              {value}
            </span>
          )}
          {change === undefined && !changeLabel ? null : (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              {change === undefined ? null : (
                <TrendIndicator
                  value={change}
                  {...(changeFormat ? { format: changeFormat } : {})}
                />
              )}
              {changeLabel}
            </div>
          )}
        </div>
        {children}
      </CardPanel>
    </CardWidgetShell>
  )

  return tone === 'inverted' ? (
    <div className="dark contents" data-slot="metric-widget-scope">
      {card}
    </div>
  ) : (
    card
  )
}

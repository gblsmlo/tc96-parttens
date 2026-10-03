import type { AmountFormatOptions } from '@tc96/helpers/format'
import { CardPanel } from '@tc96/ui/card'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { useId } from 'react'
import { Amount } from '../shared/amount'
import { CardWidgetShell } from '../shared/card-widget-shell'
import { TrendIndicator } from '../shared/trend-indicator'

export interface AssetStatWidgetProps
  extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  change?: number
  changeFormat?: AmountFormatOptions
  format?: AmountFormatOptions
  icon?: ReactNode
  label: ReactNode
  name: ReactNode
  symbol?: ReactNode
  tone?: 'default' | 'inverted'
  value: number
}

export function AssetStatWidget({
  change,
  changeFormat,
  className,
  format,
  icon,
  label,
  name,
  symbol,
  tone = 'default',
  value,
  ...props
}: Readonly<AssetStatWidgetProps>): ReactElement {
  const titleId = useId()
  const card = (
    <CardWidgetShell
      aria-labelledby={titleId}
      className={className}
      data-widget="asset-stat"
      data-tone={tone}
      {...props}
    >
      <CardPanel className="grid gap-5 p-5">
        <div className="flex items-center justify-between gap-3">
          {icon}
          {change === undefined ? null : (
            <TrendIndicator
              className="ms-auto"
              value={change}
              {...(changeFormat ? { format: changeFormat } : {})}
            />
          )}
        </div>
        <div className="grid gap-3">
          <h3 className="truncate font-semibold text-sm" id={titleId}>
            {name}
            {symbol ? (
              <span className="ms-1.5 font-normal text-muted-foreground text-sm">
                {symbol}
              </span>
            ) : null}
          </h3>
          <div className="grid gap-1">
            <p className="text-muted-foreground text-sm">{label}</p>
            <Amount
              className="font-medium text-4xl leading-tight tracking-tight"
              dimFraction
              value={value}
              {...(format ? { format } : {})}
            />
          </div>
        </div>
      </CardPanel>
    </CardWidgetShell>
  )

  return tone === 'inverted' ? (
    <div className="dark contents" data-slot="asset-stat-widget-scope">
      {card}
    </div>
  ) : (
    card
  )
}

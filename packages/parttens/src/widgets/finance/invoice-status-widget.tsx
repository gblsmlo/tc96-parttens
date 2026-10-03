import { type AmountFormatOptions, formatAmount } from '@tc96/helpers/format'
import { CardPanel } from '@tc96/ui/card'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { useId } from 'react'
import { Amount } from '../shared/amount'
import { CardWidgetShell } from '../shared/card-widget-shell'
import {
  ExpandableList,
  type WidgetExpandProps,
} from '../shared/expandable-list'
import { WidgetHeader } from '../shared/widget-header'
import type { WidgetTone } from '../types'
import { ShareBar } from './market-share-widget'

export interface InvoiceStatus {
  count?: number
  id: string
  label: string
  tone: WidgetTone
  value: number
}

export interface InvoiceStatusWidgetProps
  extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  action?: ReactNode
  countLabel?: (count: number) => ReactNode
  expand?: WidgetExpandProps
  format?: AmountFormatOptions
  locale?: string
  statuses: readonly InvoiceStatus[]
  title: ReactNode
  totalLabel?: ReactNode
}

const toneColors: Record<WidgetTone, string> = {
  destructive: 'var(--destructive)',
  info: 'var(--info)',
  success: 'var(--success)',
  warning: 'var(--warning)',
}

export function InvoiceStatusWidget({
  action,
  className,
  countLabel,
  expand,
  format,
  locale,
  statuses,
  title,
  totalLabel = 'Total em aberto',
  ...props
}: Readonly<InvoiceStatusWidgetProps>): ReactElement {
  const titleId = useId()
  const total = statuses.reduce((sum, status) => sum + status.value, 0)

  return (
    <CardWidgetShell
      aria-labelledby={titleId}
      className={className}
      data-widget="invoice-status"
      {...props}
    >
      <WidgetHeader action={action} title={title} titleId={titleId} />
      <CardPanel className="grid gap-5 px-5 pb-5">
        <div className="grid gap-1">
          <p className="text-muted-foreground text-sm">{totalLabel}</p>
          <Amount
            className="font-medium text-4xl leading-tight tracking-tight"
            dimFraction
            value={total}
            {...(format ? { format } : {})}
          />
        </div>
        <ShareBar
          segments={statuses.map((status) => ({
            color: toneColors[status.tone],
            id: status.id,
            label: status.label,
            value: status.value,
          }))}
          {...(locale ? { locale } : {})}
        />
        <ExpandableList items={statuses} {...expand}>
          {(shown) => (
            <ul className="grid gap-3" data-slot="invoice-status-list">
              {shown.map((status) => (
                <li
                  className="flex min-w-0 items-center gap-3"
                  data-slot="invoice-status-item"
                  data-tone={status.tone}
                  key={status.id}
                >
                  <span
                    aria-hidden="true"
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: toneColors[status.tone] }}
                  />
                  <span className="min-w-0 flex-1 truncate text-sm">
                    {status.label}
                    {status.count === undefined ? null : (
                      <span className="ms-2 text-muted-foreground text-xs tabular-nums">
                        {countLabel ? countLabel(status.count) : status.count}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 font-medium tabular-nums">
                    {formatAmount(status.value, format)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </ExpandableList>
      </CardPanel>
    </CardWidgetShell>
  )
}

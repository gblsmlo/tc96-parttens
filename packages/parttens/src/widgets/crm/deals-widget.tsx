import { type AmountFormatOptions, formatAmount } from '@tc96/helpers/format'
import { Badge } from '@tc96/ui/badge'
import { CardPanel } from '@tc96/ui/card'
import { cn } from '@tc96/utils'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { useId } from 'react'
import { AvatarStack, type AvatarStackPerson } from '../shared/avatar-stack'
import { CardWidgetShell } from '../shared/card-widget-shell'
import {
  ExpandableList,
  type WidgetExpandProps,
} from '../shared/expandable-list'
import { WidgetHeader } from '../shared/widget-header'
import type { WidgetTone } from '../types'

export interface DealStage {
  label: ReactNode
  tone?: WidgetTone
}

export interface Deal {
  closeLabel?: ReactNode
  company?: ReactNode
  icon?: ReactNode
  id: string
  name: ReactNode
  owner?: AvatarStackPerson
  stage?: DealStage
  value: number
}

const stageVariants: Record<
  WidgetTone,
  'error' | 'info' | 'success' | 'warning'
> = {
  destructive: 'error',
  info: 'info',
  success: 'success',
  warning: 'warning',
}

export interface DealListProps extends ComponentProps<'ul'> {}

export function DealList({
  className,
  ...props
}: Readonly<DealListProps>): ReactElement {
  return (
    <ul
      className={cn('divide-y divide-border/40', className)}
      data-slot="deal-list"
      {...props}
    />
  )
}

export interface DealListItemProps
  extends Omit<ComponentProps<'li'>, 'children' | 'title'> {
  closeLabel?: ReactNode
  company?: ReactNode
  format?: AmountFormatOptions
  icon?: ReactNode
  name: ReactNode
  owner?: AvatarStackPerson
  ownerLabel?: string
  stage?: DealStage
  value: number
}

export function DealListItem({
  className,
  closeLabel,
  company,
  format,
  icon,
  name,
  owner,
  ownerLabel = 'Responsável',
  stage,
  value,
  ...props
}: Readonly<DealListItemProps>): ReactElement {
  return (
    <li
      className={cn(
        'flex min-w-0 items-center gap-3 py-3 first:pt-0 last:pb-0',
        className,
      )}
      data-slot="deal-list-item"
      {...props}
    >
      {icon}
      <div className="grid min-w-0 flex-1 gap-1">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate font-medium text-sm">{name}</span>
          {stage ? (
            <Badge
              data-slot="deal-stage"
              data-tone={stage.tone ?? 'info'}
              variant={stageVariants[stage.tone ?? 'info']}
            >
              {stage.label}
            </Badge>
          ) : null}
        </div>
        {company || closeLabel ? (
          <span className="flex min-w-0 items-center gap-1.5 text-muted-foreground text-xs">
            {company ? <span className="truncate">{company}</span> : null}
            {company && closeLabel ? <span aria-hidden="true">·</span> : null}
            {closeLabel ? (
              <span className="shrink-0 truncate">{closeLabel}</span>
            ) : null}
          </span>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="font-semibold text-sm tabular-nums">
          {formatAmount(value, format)}
        </span>
        {owner ? (
          <AvatarStack aria-label={ownerLabel} people={[owner]} size="sm" />
        ) : null}
      </div>
    </li>
  )
}

export interface DealsWidgetProps
  extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  action?: ReactNode
  deals: readonly Deal[]
  emptyLabel?: ReactNode
  expand?: WidgetExpandProps
  format?: AmountFormatOptions
  listLabel?: string
  ownerLabel?: string
  title: ReactNode
}

export function DealsWidget({
  action,
  className,
  deals,
  emptyLabel = 'Sem negócios',
  expand,
  format,
  listLabel,
  ownerLabel,
  title,
  ...props
}: Readonly<DealsWidgetProps>): ReactElement {
  const titleId = useId()

  return (
    <CardWidgetShell
      aria-labelledby={titleId}
      className={className}
      data-widget="deals"
      {...props}
    >
      <WidgetHeader action={action} title={title} titleId={titleId} />
      <CardPanel className="grid gap-5 px-5 pb-5">
        {deals.length ? (
          <ExpandableList items={deals} {...expand}>
            {(shown) => (
              <DealList
                aria-label={
                  listLabel ?? (typeof title === 'string' ? title : 'Negócios')
                }
              >
                {shown.map(({ id, ...deal }) => (
                  <DealListItem
                    key={id}
                    {...deal}
                    {...(format ? { format } : {})}
                    {...(ownerLabel ? { ownerLabel } : {})}
                  />
                ))}
              </DealList>
            )}
          </ExpandableList>
        ) : (
          <p className="text-muted-foreground text-sm" data-slot="deals-empty">
            {emptyLabel}
          </p>
        )}
      </CardPanel>
    </CardWidgetShell>
  )
}

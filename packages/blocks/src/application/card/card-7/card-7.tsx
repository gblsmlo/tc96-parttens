import { ChatCircleIcon } from '@phosphor-icons/react'
import { formatAmount } from '@tc96/helpers/format'
import { getInitials } from '@tc96/helpers/initials'
import { WidgetShell } from '@tc96/parttens/widgets/shared/widget-shell'
import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui/avatar'
import { Button } from '@tc96/ui/button'
import { CardPanel } from '@tc96/ui/card'
import { IconFrame } from '@tc96/ui/icon-frame'
import { cn } from '@tc96/utils'
import { type CSSProperties, useId } from 'react'
import { CardBadge } from '../shared/card-badge'
import { cardLoadState } from '../shared/card-load-state'
import { Card7Skeleton } from './card-7-skeleton'
import { defaultCard7Labels } from './labels'
import type { Card7Props } from './types'

const avatarSize = {
  '--avatar-size': 'calc(var(--spacing) * 16)',
} as CSSProperties

export function Card7({
  actionIcon = <ChatCircleIcon />,
  className,
  contact,
  currency = 'BRL',
  error,
  items = [],
  labels: labelsProp,
  locale = 'pt-BR',
  onAction,
  onRetry,
  pending,
  stats = [],
}: Readonly<Card7Props>) {
  const labels = { ...defaultCard7Labels, ...labelsProp }
  const nameId = useId()
  const loadState = cardLoadState({
    error,
    labels,
    onRetry,
    pending: pending || (!contact && !error),
    skeleton: <Card7Skeleton label={labels.loading} />,
  })

  if (loadState || !contact) return <div className={className}>{loadState}</div>

  return (
    <WidgetShell aria-labelledby={nameId} className={cn('w-full', className)}>
      <CardPanel className="grid gap-5 p-5">
        <div className="flex items-center gap-4">
          <Avatar style={avatarSize}>
            {contact.avatarUrl ? (
              <AvatarImage alt="" src={contact.avatarUrl} />
            ) : null}
            <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
          </Avatar>
          <div className="grid min-w-0 flex-1 justify-items-start gap-2">
            <div className="grid min-w-0 gap-1">
              <h3 className="truncate font-medium leading-none" id={nameId}>
                {contact.name}
              </h3>
              <p className="truncate text-muted-foreground text-sm leading-none">
                {contact.email}
              </p>
            </div>
            {contact.status ? <CardBadge {...contact.status} /> : null}
          </div>
        </div>
        {stats.length > 0 ? (
          <dl
            aria-label={labels.stats}
            className="grid auto-cols-fr grid-flow-col divide-x rounded-lg bg-muted py-3"
          >
            {stats.map((stat) => (
              <div
                className="flex flex-col-reverse items-center gap-0.5 px-2 text-center"
                key={stat.id}
              >
                <dt className="text-muted-foreground text-xs">{stat.label}</dt>
                <dd className="font-medium tabular-nums">{stat.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {items.length > 0 ? (
          <ul aria-label={labels.items} className="grid divide-y divide-dashed">
            {items.map((item) => (
              <li
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                data-item={item.id}
                key={item.id}
              >
                <IconFrame color={item.color} shape="rounded" size="sm">
                  {item.icon}
                </IconFrame>
                <span className="min-w-0 flex-1 truncate text-sm">
                  {item.label}
                </span>
                <span className="font-medium text-sm tabular-nums">
                  {formatAmount(item.amount, {
                    currency: item.currency ?? currency,
                    locale,
                    maximumFractionDigits: 0,
                    style: 'currency',
                  })}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
        {onAction ? (
          <Button onClick={onAction} variant="secondary">
            {actionIcon}
            {labels.action}
          </Button>
        ) : null}
      </CardPanel>
    </WidgetShell>
  )
}

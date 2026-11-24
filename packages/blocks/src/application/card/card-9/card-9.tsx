import { ClockIcon, MapPinIcon, PackageIcon } from '@phosphor-icons/react'
import {
  Card,
  CardFrame,
  CardFrameAction,
  CardFrameHeader,
  CardFrameTitle,
  CardPanel,
} from '@tc96/ui/card'
import { IconFrame } from '@tc96/ui/icon-frame'
import { cn } from '@tc96/utils'
import { type ReactNode, useId } from 'react'
import { CardBadge } from '../shared/card-badge'
import { cardLoadState } from '../shared/card-load-state'
import { CardMenu } from '../shared/card-menu'
import { Card9Skeleton } from './card-9-skeleton'
import { defaultCard9Labels } from './labels'
import type { Card9Props } from './types'

function DetailRow({
  children,
  icon,
  label,
}: Readonly<{ children: ReactNode; icon: ReactNode; label: string }>) {
  return (
    <div className="flex items-center gap-3">
      <dt className="text-muted-foreground">
        <span className="sr-only">{label}</span>
        {icon}
      </dt>
      <dd className="flex min-w-0 flex-wrap items-center gap-2 text-sm">
        {children}
      </dd>
    </div>
  )
}

export function Card9({
  actions,
  className,
  delivery,
  error,
  labels: labelsProp,
  onActionSelect,
  onRetry,
  pending,
}: Readonly<Card9Props>) {
  const labels = { ...defaultCard9Labels, ...labelsProp }
  const titleId = useId()
  const notesId = useId()
  const loadState = cardLoadState({
    error,
    labels,
    onRetry,
    pending: pending || (!delivery && !error),
    skeleton: <Card9Skeleton label={labels.loading} />,
  })

  if (loadState || !delivery)
    return <div className={className}>{loadState}</div>

  return (
    <CardFrame
      aria-labelledby={titleId}
      className={cn('w-full', className)}
      render={<section />}
    >
      <CardFrameHeader>
        <CardFrameTitle className="flex items-center gap-2" id={titleId}>
          <IconFrame shape="rounded" size="xs">
            <PackageIcon />
          </IconFrame>
          {labels.title}
        </CardFrameTitle>
        {actions?.length && onActionSelect ? (
          <CardFrameAction>
            <CardMenu
              actions={actions}
              label={labels.more}
              onSelect={onActionSelect}
            />
          </CardFrameAction>
        ) : null}
      </CardFrameHeader>
      <Card>
        <CardPanel className="grid gap-5 p-5">
          <dl className="grid gap-4">
            <DetailRow icon={<MapPinIcon />} label={labels.address}>
              <span>{delivery.address}</span>
              {delivery.addressTag ? (
                <CardBadge {...delivery.addressTag} />
              ) : null}
            </DetailRow>
            <DetailRow icon={<ClockIcon />} label={labels.duration}>
              <span className="tabular-nums">{delivery.duration}</span>
              {delivery.updatedAt ? (
                <span className="text-muted-foreground">
                  {delivery.updatedAt}
                </span>
              ) : null}
            </DetailRow>
            <DetailRow icon={<PackageIcon />} label={labels.tracking}>
              <span className="tabular-nums">{delivery.tracking}</span>
              {delivery.trackingStatus ? (
                <span className="text-muted-foreground">
                  {delivery.trackingStatus}
                </span>
              ) : null}
            </DetailRow>
          </dl>
          {delivery.notes ? (
            <section aria-labelledby={notesId} className="grid gap-1">
              <h3 className="font-medium text-sm" id={notesId}>
                {labels.notes}
              </h3>
              <p className="text-muted-foreground text-sm">{delivery.notes}</p>
            </section>
          ) : null}
        </CardPanel>
      </Card>
    </CardFrame>
  )
}

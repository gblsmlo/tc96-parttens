import { formatAmount } from '@tc96/helpers/format'
import { getInitials } from '@tc96/helpers/initials'
import { WidgetShell } from '@tc96/parttens/widgets/shared/widget-shell'
import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui/avatar'
import { Button } from '@tc96/ui/button'
import { CardPanel } from '@tc96/ui/card'
import { useId } from 'react'
import { CardBadge } from '../shared/card-badge'
import { defaultCard3Labels } from './labels'
import type { Card3Props } from './types'

export function Card3({
  className,
  labels: labelsProp,
  locale = 'pt-BR',
  onFollow,
  onMessage,
  profile,
}: Readonly<Card3Props>) {
  const labels = { ...defaultCard3Labels, ...labelsProp }
  const nameId = useId()
  const stats = profile.stats.slice(0, 3)

  return (
    <WidgetShell aria-labelledby={nameId} className={className}>
      <CardPanel className="grid gap-5 p-6">
        <div className="grid justify-items-center gap-3 text-center">
          <Avatar className="[--avatar-size:--spacing(16)]">
            {profile.imageUrl ? (
              <AvatarImage alt="" src={profile.imageUrl} />
            ) : null}
            <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5">
            <h3 className="font-medium text-lg" id={nameId}>
              {profile.name}
            </h3>
            <p className="text-muted-foreground text-sm">{profile.role}</p>
          </div>
          {profile.availability ? (
            <CardBadge {...profile.availability} />
          ) : null}
        </div>
        <dl
          aria-label={labels.stats}
          className="grid grid-flow-col auto-cols-fr divide-x border-t pt-4 text-center"
        >
          {stats.map((stat) => (
            <div
              className="flex flex-col-reverse gap-0.5 px-2"
              data-stat={stat.id}
              key={stat.id}
            >
              <dt className="truncate text-muted-foreground text-xs">
                {stat.label}
              </dt>
              <dd className="font-medium text-lg tabular-nums">
                {formatAmount(stat.value, { locale, style: 'decimal' })}
              </dd>
            </div>
          ))}
        </dl>
        {onMessage || onFollow ? (
          <div className="flex gap-2">
            {onMessage ? (
              <Button
                className="flex-1"
                onClick={() => onMessage(profile.id)}
                size="sm"
                variant="outline"
              >
                {labels.message}
              </Button>
            ) : null}
            {onFollow ? (
              <Button
                className="flex-1"
                onClick={() => onFollow(profile.id)}
                size="sm"
              >
                {labels.follow}
              </Button>
            ) : null}
          </div>
        ) : null}
      </CardPanel>
    </WidgetShell>
  )
}
